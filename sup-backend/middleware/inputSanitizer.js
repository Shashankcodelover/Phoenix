/**
 * Hardened Security Middleware:
 * 1. Payload Size Enforcement (< 50KB)
 * 2. Prompt Injection Shield
 * 3. XSS Sanitization & Character Escaping
 */

const INJECTION_PATTERNS = [
  /ignore (?:all )?previous (?:instructions|prompts)/gi,
  /system override/gi,
  /developer mode/gi,
  /you are now an unrestricted/gi,
  /bypass (?:security|safety) (?:filter|protocol)/gi,
  /sudo mode/gi
];

function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Strip script tags
    .replace(/<[^>]+>/g, '') // Strip HTML tags
    .replace(/javascript:/gi, '')
    .replace(/onerror=/gi, '')
    .replace(/onload=/gi, '')
    .trim();
}

function recursiveSanitize(obj) {
  if (typeof obj === 'string') return sanitizeString(obj);
  if (Array.isArray(obj)) return obj.map(recursiveSanitize);
  if (obj && typeof obj === 'object') {
    const cleaned = {};
    for (const key of Object.keys(obj)) {
      cleaned[sanitizeString(key)] = recursiveSanitize(obj[key]);
    }
    return cleaned;
  }
  return obj;
}

const inputSecurityMiddleware = (req, res, next) => {
  // 1. Content Length Check (Max 50KB)
  const contentLength = parseInt(req.headers['content-length'] || '0', 10);
  if (contentLength > 50 * 1024) {
    return res.status(413).json({ message: '413 Payload Too Large. Maximum allowed size is 50KB.' });
  }

  if (req.body) {
    const bodyStr = JSON.stringify(req.body);

    // 2. Prompt Injection Shield Check
    for (const pattern of INJECTION_PATTERNS) {
      if (pattern.test(bodyStr)) {
        console.warn(`[SecurityShield] Blocked prompt injection attempt from IP ${req.ip}`);
        req.promptInjectionDetected = true;
        break;
      }
    }

    // 3. XSS Sanitization
    req.body = recursiveSanitize(req.body);
  }

  next();
};

module.exports = { inputSecurityMiddleware };
