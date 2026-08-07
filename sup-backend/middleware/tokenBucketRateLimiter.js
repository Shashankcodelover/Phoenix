/**
 * Phoenix v13 Security Engine — Token Bucket Rate Limiter
 * =======================================================
 * Production-grade Token Bucket algorithm allowing human burstiness
 * while protecting API endpoints from volumetric DoS and automated script abuse.
 *
 * Implements:
 * - Atomic bucket refilling based on elapsed millisecond precision
 * - Memory leak protection (TTL cleanup interval & max 10,000 keys LRU eviction)
 * - Burst allowance configuration
 * - HTTP 429 response with RFC-compliant 'Retry-After' and X-RateLimit-* headers
 */

class TokenBucket {
  constructor({ capacity, refillRatePerSec }) {
    this.capacity = capacity;
    this.refillRatePerSec = refillRatePerSec;
    this.tokens = capacity;
    this.lastRefillTimestamp = Date.now();
  }

  refill() {
    const now = Date.now();
    const elapsedSeconds = (now - this.lastRefillTimestamp) / 1000;
    if (elapsedSeconds > 0) {
      const tokensToAdd = elapsedSeconds * this.refillRatePerSec;
      this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
      this.lastRefillTimestamp = now;
    }
  }

  consume(tokensRequested = 1) {
    this.refill();
    if (this.tokens >= tokensRequested) {
      this.tokens -= tokensRequested;
      return { allowed: true, remainingTokens: Math.floor(this.tokens), retryAfterSec: 0 };
    }
    const missingTokens = tokensRequested - this.tokens;
    const retryAfterSec = Math.ceil(missingTokens / this.refillRatePerSec);
    return { allowed: false, remainingTokens: Math.floor(this.tokens), retryAfterSec };
  }
}

const BUCKET_STORE = new Map();
const MAX_BUCKET_KEYS = 10000;
const TTL_CLEANUP_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

// Periodic memory leak cleanup interval
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of BUCKET_STORE.entries()) {
    if (now - bucket.lastRefillTimestamp > TTL_CLEANUP_INTERVAL_MS) {
      BUCKET_STORE.delete(key);
    }
  }
}, TTL_CLEANUP_INTERVAL_MS).unref();

/**
 * Creates an Express middleware enforcing Token Bucket rate limiting.
 */
function createTokenBucketLimiter({ capacity = 30, refillRatePerSec = 2, keyPrefix = 'global' } = {}) {
  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress || '127.0.0.1';
    const clientKey = `${keyPrefix}:${ip}`;

    // Max key capacity safeguard to prevent OOM
    if (BUCKET_STORE.size >= MAX_BUCKET_KEYS && !BUCKET_STORE.has(clientKey)) {
      const firstKey = BUCKET_STORE.keys().next().value;
      if (firstKey) BUCKET_STORE.delete(firstKey);
    }

    let bucket = BUCKET_STORE.get(clientKey);
    if (!bucket) {
      bucket = new TokenBucket({ capacity, refillRatePerSec });
      BUCKET_STORE.set(clientKey, bucket);
    }

    const result = bucket.consume(1);

    res.setHeader('X-RateLimit-Limit', capacity);
    res.setHeader('X-RateLimit-Remaining', result.remainingTokens);

    if (result.allowed) {
      next();
    } else {
      res.setHeader('Retry-After', result.retryAfterSec);
      res.status(429).json({
        success: false,
        error: 'Too Many Requests',
        message: `Rate limit exceeded. Token bucket depleted. Please try again in ${result.retryAfterSec} seconds.`,
        retryAfterSeconds: result.retryAfterSec,
        timestamp: new Date().toISOString()
      });
    }
  };
}

function clearBucketStore() {
  BUCKET_STORE.clear();
}

module.exports = { TokenBucket, createTokenBucketLimiter, clearBucketStore, BUCKET_STORE };
