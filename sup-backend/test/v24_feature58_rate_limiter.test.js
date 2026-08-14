const { describe, it } = require('node:test');
const assert = require('node:assert');

const { RateLimiterVisualizerEngine, RATE_LIMIT_ALGORITHMS } = require('../modules/interview-prep/rateLimiterVisualizerEngine');

describe('V24 Quality Focus: Feature 58 — Rate Limiter & Sliding Window Engine', () => {
  const engine = new RateLimiterVisualizerEngine();

  it('triggers HTTP 429 when traffic surge exceeds burst threshold and outputs atomic Lua script', () => {
    const report = engine.simulateLimiter({
      algorithmKey: 'sliding_window_counter',
      requestsPerSecondLimit: 100,
      burstCapacity: 150,
      incomingRpsSurge: 300
    });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.algorithmKey, 'sliding_window_counter');
    assert.ok(report.rateLimitOutcome.includes('HTTP 429'));
    assert.strictEqual(report.metrics.forwardedRps, 100);
    assert.strictEqual(report.metrics.droppedRps, 200);
    assert.strictEqual(report.metrics.retryAfterHeader, '1s');
    assert.ok(report.productionRedisLua.includes('ZREMRANGEBYSCORE'));
    assert.ok(report.productionRedisLua.includes('ZCARD'));
  });
});
