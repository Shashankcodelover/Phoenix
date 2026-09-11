/**
 * ⚡ HFT Order Book & Matching Engine Sandbox
 * Ultra-low latency limit order book (LOB) with price-time priority (FIFO),
 * multi-tier L2/L3 order depth, Market/Limit/IOC/FOK order execution,
 * order imbalance telemetry, and market impact calculation.
 */

class Order {
  constructor(id, symbol, side, type, price, qty, timestamp = Date.now()) {
    this.id = id || 'ord_' + Math.random().toString(36).substr(2, 9);
    this.symbol = symbol || 'NVDA';
    this.side = side.toUpperCase(); // 'BUY' or 'SELL'
    this.type = type.toUpperCase(); // 'LIMIT', 'MARKET', 'IOC', 'FOK'
    this.price = parseFloat(price);
    this.qty = parseInt(qty, 10);
    this.filledQty = 0;
    this.remainingQty = this.qty;
    this.timestamp = timestamp;
    this.status = 'PENDING'; // 'FILLED', 'PARTIALLY_FILLED', 'CANCELLED', 'REJECTED'
  }
}

class LimitOrderBook {
  constructor(symbol, initialMidPrice = 124.50, volatility = 0.018) {
    this.symbol = symbol;
    this.midPrice = initialMidPrice;
    this.volatility = volatility;
    this.bids = []; // sorted descending by price, then ascending timestamp
    this.asks = []; // sorted ascending by price, then ascending timestamp
    this.trades = [];
    this.orderHistory = [];
    this.latenciesNs = []; // nanoseconds for matching execution
    this.initDefaultBook();
  }

  initDefaultBook() {
    const spreadHalf = 0.05;
    const baseBid = +(this.midPrice - spreadHalf).toFixed(2);
    const baseAsk = +(this.midPrice + spreadHalf).toFixed(2);

    for (let i = 0; i < 12; i++) {
      const bidPrice = +(baseBid - i * 0.10).toFixed(2);
      const bidQty = Math.floor(150 + Math.sin(i * 0.7) * 80 + Math.random() * 120);
      this.bids.push(new Order(`seed_bid_${i}`, this.symbol, 'BUY', 'LIMIT', bidPrice, bidQty, Date.now() - (12 - i) * 100));

      const askPrice = +(baseAsk + i * 0.10).toFixed(2);
      const askQty = Math.floor(140 + Math.cos(i * 0.7) * 75 + Math.random() * 110);
      this.asks.push(new Order(`seed_ask_${i}`, this.symbol, 'SELL', 'LIMIT', askPrice, askQty, Date.now() - (12 - i) * 100));
    }
    this.sortBook();
  }

  sortBook() {
    this.bids.sort((a, b) => b.price !== a.price ? b.price - a.price : a.timestamp - b.timestamp);
    this.asks.sort((a, b) => a.price !== b.price ? a.price - b.price : a.timestamp - b.timestamp);
  }

  getBestBid() {
    return this.bids.length > 0 ? this.bids[0].price : null;
  }

  getBestAsk() {
    return this.asks.length > 0 ? this.asks[0].price : null;
  }

  getSpread() {
    const bb = this.getBestBid();
    const ba = this.getBestAsk();
    if (bb !== null && ba !== null) {
      return +(ba - bb).toFixed(4);
    }
    return 0;
  }

  getSpreadBps() {
    const spread = this.getSpread();
    const mid = this.getMidPrice();
    return mid > 0 ? +((spread / mid) * 10000).toFixed(2) : 0;
  }

  getMidPrice() {
    const bb = this.getBestBid();
    const ba = this.getBestAsk();
    if (bb !== null && ba !== null) {
      return +((bb + ba) / 2).toFixed(4);
    }
    return this.midPrice;
  }

  getMicroPrice() {
    const bb = this.getBestBid();
    const ba = this.getBestAsk();
    if (bb === null || ba === null) return this.getMidPrice();

    const bidVolTop = this.bids.filter(b => b.price === bb).reduce((acc, b) => acc + b.remainingQty, 0);
    const askVolTop = this.asks.filter(a => a.price === ba).reduce((acc, a) => acc + a.remainingQty, 0);

    const totalVol = bidVolTop + askVolTop;
    if (totalVol === 0) return this.getMidPrice();

    // Microprice = (ba * bidVol + bb * askVol) / (bidVol + askVol)
    const micro = (ba * bidVolTop + bb * askVolTop) / totalVol;
    return +micro.toFixed(4);
  }

  getOrderImbalance() {
    const totalBidVol = this.bids.slice(0, 5).reduce((acc, b) => acc + b.remainingQty, 0);
    const totalAskVol = this.asks.slice(0, 5).reduce((acc, a) => acc + a.remainingQty, 0);
    const sum = totalBidVol + totalAskVol;
    if (sum === 0) return 0;
    return +((totalBidVol - totalAskVol) / sum).toFixed(4);
  }

  // Estimate square-root market impact: I = Y * sigma * sqrt(Q / V_adv)
  calculateMarketImpact(qty) {
    const totalL2Vol = this.bids.reduce((a, b) => a + b.remainingQty, 0) + this.asks.reduce((a, b) => a + b.remainingQty, 0);
    const normalizedADV = Math.max(totalL2Vol * 10, 10000);
    const Y = 0.5; // typical market impact constant
    const impactPercent = Y * this.volatility * Math.sqrt(qty / normalizedADV);
    const basisPoints = +(impactPercent * 10000).toFixed(2);
    const dollarImpact = +(this.getMidPrice() * impactPercent).toFixed(4);
    return {
      basisPoints,
      dollarImpact,
      expectedSlippagePct: +(impactPercent * 100).toFixed(4)
    };
  }

  submitOrder(orderData) {
    const startNs = process.hrtime.bigint();
    const order = new Order(
      orderData.id,
      this.symbol,
      orderData.side,
      orderData.type || 'LIMIT',
      orderData.price,
      orderData.qty,
      Date.now()
    );

    const result = {
      orderId: order.id,
      symbol: this.symbol,
      side: order.side,
      type: order.type,
      requestedQty: order.qty,
      requestedPrice: order.price,
      status: 'PENDING',
      executedTrades: [],
      fillPercentage: 0,
      averageExecPrice: 0,
      totalExecutedQty: 0,
      latencyNs: 0
    };

    // Pre-execution validation for FOK
    if (order.type === 'FOK') {
      const canFillAll = this.checkCanFillFully(order);
      if (!canFillAll) {
        order.status = 'CANCELLED';
        result.status = 'CANCELLED';
        result.message = 'Immediate full fill not available in book for FOK order.';
        const endNs = process.hrtime.bigint();
        result.latencyNs = Number(endNs - startNs);
        this.latenciesNs.push(result.latencyNs);
        return result;
      }
    }

    if (order.side === 'BUY') {
      this.matchBuyOrder(order, result);
    } else {
      this.matchSellOrder(order, result);
    }

    // Post match handling
    if (order.remainingQty === 0) {
      order.status = 'FILLED';
      result.status = 'FILLED';
    } else if (order.filledQty > 0) {
      if (order.type === 'IOC') {
        order.status = 'PARTIALLY_FILLED';
        result.status = 'PARTIALLY_FILLED_CANCELLED_REST';
        // Remainder cancelled, not placed in book
      } else {
        order.status = 'PARTIALLY_FILLED';
        result.status = 'PARTIALLY_FILLED';
        if (order.type === 'LIMIT') {
          this.bids.push(order);
          this.sortBook();
        }
      }
    } else {
      // Zero filled
      if (order.type === 'IOC' || order.type === 'MARKET') {
        order.status = 'CANCELLED';
        result.status = 'UNFILLED_CANCELLED';
      } else {
        order.status = 'OPEN';
        result.status = 'PLACED_ON_BOOK';
        if (order.side === 'BUY') {
          this.bids.push(order);
        } else {
          this.asks.push(order);
        }
        this.sortBook();
      }
    }

    // Update statistics
    if (result.executedTrades.length > 0) {
      let totalValue = 0;
      let totalQty = 0;
      result.executedTrades.forEach(t => {
        totalValue += t.price * t.qty;
        totalQty += t.qty;
        this.trades.unshift(t);
      });
      result.totalExecutedQty = totalQty;
      result.averageExecPrice = +(totalValue / totalQty).toFixed(4);
      result.fillPercentage = +((totalQty / order.qty) * 100).toFixed(2);
      this.midPrice = this.getMidPrice();
    }

    const endNs = process.hrtime.bigint();
    result.latencyNs = Number(endNs - startNs);
    this.latenciesNs.push(result.latencyNs);
    this.orderHistory.unshift(order);

    return result;
  }

  checkCanFillFully(order) {
    let availableQty = 0;
    const targetBook = order.side === 'BUY' ? this.asks : this.bids;
    for (const opp of targetBook) {
      if (order.side === 'BUY' && order.type !== 'MARKET' && opp.price > order.price) break;
      if (order.side === 'SELL' && order.type !== 'MARKET' && opp.price < order.price) break;
      availableQty += opp.remainingQty;
      if (availableQty >= order.qty) return true;
    }
    return false;
  }

  matchBuyOrder(order, result) {
    while (this.asks.length > 0 && order.remainingQty > 0) {
      const bestAsk = this.asks[0];
      if (order.type !== 'MARKET' && bestAsk.price > order.price) {
        break; // Best ask is higher than limit price
      }

      const matchQty = Math.min(order.remainingQty, bestAsk.remainingQty);
      const execPrice = bestAsk.price;

      order.filledQty += matchQty;
      order.remainingQty -= matchQty;
      bestAsk.filledQty += matchQty;
      bestAsk.remainingQty -= matchQty;

      const trade = {
        tradeId: 'tr_' + Math.random().toString(36).substr(2, 9),
        symbol: this.symbol,
        price: execPrice,
        qty: matchQty,
        makerOrderId: bestAsk.id,
        takerOrderId: order.id,
        side: 'BUY',
        timestamp: Date.now()
      };
      result.executedTrades.push(trade);

      if (bestAsk.remainingQty === 0) {
        bestAsk.status = 'FILLED';
        this.asks.shift(); // Remove filled ask
      } else {
        bestAsk.status = 'PARTIALLY_FILLED';
      }
    }
  }

  matchSellOrder(order, result) {
    while (this.bids.length > 0 && order.remainingQty > 0) {
      const bestBid = this.bids[0];
      if (order.type !== 'MARKET' && bestBid.price < order.price) {
        break; // Best bid is lower than limit price
      }

      const matchQty = Math.min(order.remainingQty, bestBid.remainingQty);
      const execPrice = bestBid.price;

      order.filledQty += matchQty;
      order.remainingQty -= matchQty;
      bestBid.filledQty += matchQty;
      bestBid.remainingQty -= matchQty;

      const trade = {
        tradeId: 'tr_' + Math.random().toString(36).substr(2, 9),
        symbol: this.symbol,
        price: execPrice,
        qty: matchQty,
        makerOrderId: bestBid.id,
        takerOrderId: order.id,
        side: 'SELL',
        timestamp: Date.now()
      };
      result.executedTrades.push(trade);

      if (bestBid.remainingQty === 0) {
        bestBid.status = 'FILLED';
        this.bids.shift(); // Remove filled bid
      } else {
        bestBid.status = 'PARTIALLY_FILLED';
      }
    }
  }

  getL2Depth(levels = 8) {
    const aggregateLevels = (orders) => {
      const levelMap = new Map();
      orders.forEach(o => {
        const count = levelMap.get(o.price) || { price: o.price, volume: 0, orderCount: 0 };
        count.volume += o.remainingQty;
        count.orderCount += 1;
        levelMap.set(o.price, count);
      });
      return Array.from(levelMap.values());
    };

    const aggregatedBids = aggregateLevels(this.bids).slice(0, levels);
    const aggregatedAsks = aggregateLevels(this.asks).slice(0, levels);

    // Compute cumulative depth
    let bidAccum = 0;
    aggregatedBids.forEach(b => {
      bidAccum += b.volume;
      b.totalCumulativeVolume = bidAccum;
    });

    let askAccum = 0;
    aggregatedAsks.forEach(a => {
      askAccum += a.volume;
      a.totalCumulativeVolume = askAccum;
    });

    return {
      bids: aggregatedBids,
      asks: aggregatedAsks,
      maxLevelVolume: Math.max(...aggregatedBids.map(b => b.volume), ...aggregatedAsks.map(a => a.volume), 1)
    };
  }

  getL3Depth(count = 15) {
    return {
      topBids: this.bids.slice(0, count).map(o => ({ id: o.id, price: o.price, qty: o.remainingQty, ts: o.timestamp })),
      topAsks: this.asks.slice(0, count).map(o => ({ id: o.id, price: o.price, qty: o.remainingQty, ts: o.timestamp }))
    };
  }

  getLatencyPercentiles() {
    if (this.latenciesNs.length === 0) return { p50: 120, p90: 280, p99: 450, sampleCount: 0 };
    const sorted = [...this.latenciesNs].sort((a, b) => a - b);
    const p50Idx = Math.floor(sorted.length * 0.50);
    const p90Idx = Math.floor(sorted.length * 0.90);
    const p99Idx = Math.min(Math.floor(sorted.length * 0.99), sorted.length - 1);
    return {
      p50: sorted[p50Idx],
      p90: sorted[p90Idx],
      p99: sorted[p99Idx],
      min: sorted[0],
      max: sorted[sorted.length - 1],
      sampleCount: sorted.length
    };
  }

  getSnapshot() {
    const bestBid = this.getBestBid();
    const bestAsk = this.getBestAsk();
    const mid = this.getMidPrice();
    const micro = this.getMicroPrice();
    const spread = this.getSpread();
    const spreadBps = this.getSpreadBps();
    const imbalance = this.getOrderImbalance();
    const l2 = this.getL2Depth(8);
    const latencies = this.getLatencyPercentiles();

    return {
      symbol: this.symbol,
      timestamp: Date.now(),
      bestBid,
      bestAsk,
      midPrice: mid,
      microPrice: micro,
      spread,
      spreadBps,
      orderImbalance: imbalance,
      imbalanceBias: imbalance > 0.15 ? 'STRONG_BUY_PRESSURE' : imbalance < -0.15 ? 'STRONG_SELL_PRESSURE' : 'NEUTRAL_BALANCED',
      l2Depth: l2,
      recentTrades: this.trades.slice(0, 10),
      totalBidsCount: this.bids.length,
      totalAsksCount: this.asks.length,
      latencyNanoseconds: latencies
    };
  }

  injectRandomBurst(count = 10) {
    const results = [];
    for (let i = 0; i < count; i++) {
      const side = Math.random() > 0.5 ? 'BUY' : 'SELL';
      const type = Math.random() > 0.3 ? 'LIMIT' : 'MARKET';
      const offset = (Math.random() * 0.40 - 0.20);
      const price = +(this.midPrice + offset).toFixed(2);
      const qty = Math.floor(10 + Math.random() * 80);
      results.push(this.submitOrder({ side, type, price, qty }));
    }
    return results;
  }
}

// Singleton instances for active symbols
const orderBooks = {
  'NVDA': new LimitOrderBook('NVDA', 124.50, 0.024),
  'GOOGL': new LimitOrderBook('GOOGL', 178.20, 0.016),
  'BTC': new LimitOrderBook('BTC', 64250.00, 0.045)
};

function getBook(symbol = 'NVDA') {
  const sym = symbol.toUpperCase();
  if (!orderBooks[sym]) {
    orderBooks[sym] = new LimitOrderBook(sym, 100.0, 0.02);
  }
  return orderBooks[sym];
}

module.exports = {
  LimitOrderBook,
  getBook,
  orderBooks
};
