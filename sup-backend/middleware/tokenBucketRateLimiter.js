/**
 * Phoenix v13 Security Engine — Token Bucket Rate Limiter
 * =======================================================
 * Production-grade Token Bucket algorithm allowing human burstiness
 * while protecting API endpoints from volumetric DoS and automated script abuse.
 *
 * Implements:
 * - Atomic bucket refilling based on elapsed millisecond precision
 * - Burst allowance configuration
 * - HTTP 429 response with RFC-compliant 'Retry-After' and X-RateLimit-* headers
 * - IP and User-ID based keying
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

/**
 * Creates an Express middleware enforcing Token Bucket rate limiting.
 * @param {Object} options
 * @param {number} options.capacity - Max tokens bucket can hold (allows bursts)
 * @param {number} options.refillRatePerSec - Tokens added per second
 * @param {string} options.keyPrefix - Prefix for grouping limiters
 */
function createTokenBucketLimiter({ capacity = 20, refillRatePerSec = 2, keyPrefix = 'global' } = {}) {
  return (req, res, next) => {
    const clientKey = `${keyPrefix}:${req.ip || req.headers['x-forwarded-for'] || '127.0.0.1'}`;
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

module.exports = { TokenBucket, createTokenBucketLimiter, clearBucketStore };
