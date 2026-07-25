/**
 * In-Memory Rate Limiter Middleware
 * 
 * Limits the number of requests per IP address within a sliding time window.
 * In production, replace with Redis-backed store for distributed scaling.
 */

const rateLimitStore = new Map();

const CLEANUP_INTERVAL = 60 * 1000; // Clean expired entries every 60 seconds

// Periodic cleanup to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now - entry.windowStart > entry.windowMs * 2) {
      rateLimitStore.delete(key);
    }
  }
}, CLEANUP_INTERVAL);

/**
 * Creates a rate limiter middleware.
 * @param {Object} options
 * @param {number} options.windowMs - Time window in milliseconds (default: 60000 = 1 minute)
 * @param {number} options.maxRequests - Max requests per window per IP (default: 30)
 * @param {string} options.message - Error message when limit exceeded
 */
const createRateLimiter = (options = {}) => {
  const {
    windowMs = 60 * 1000,
    maxRequests = 30,
    message = 'Too many requests. Please slow down and try again shortly.'
  } = options;

  return (req, res, next) => {
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
    const key = `${clientIp}:${req.baseUrl}`;
    const now = Date.now();

    let entry = rateLimitStore.get(key);

    if (!entry || (now - entry.windowStart) > windowMs) {
      // New window
      entry = { windowStart: now, count: 1, windowMs };
      rateLimitStore.set(key, entry);
    } else {
      entry.count++;
    }

    // Set rate limit headers (standard)
    const remaining = Math.max(0, maxRequests - entry.count);
    const resetTime = Math.ceil((entry.windowStart + windowMs - now) / 1000);

    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', resetTime);

    if (entry.count > maxRequests) {
      return res.status(429).json({
        error: 'RATE_LIMIT_EXCEEDED',
        message,
        retryAfterSeconds: resetTime
      });
    }

    next();
  };
};

module.exports = { createRateLimiter };
