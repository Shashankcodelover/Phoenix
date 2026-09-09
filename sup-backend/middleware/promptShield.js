/**
 * Phoenix v2.0: Prompt Injection Shield Middleware
 * 
 * Inspired by The Hackathon Simulator's hardened security architecture.
 * Protects all AI endpoints from:
 *   1. Prompt injection / jailbreak attacks
 *   2. XSS (Cross-Site Scripting) in user inputs
 *   3. Oversized payloads that could crash the server
 *   4. Malformed or suspicious request patterns
 * 
 * If an attack is detected, the request is blocked and logged.
 * The AI endpoint can then fall back to safe static responses.
 */

// --- Jailbreak Detection Patterns ---
// Common prompt injection signatures that attempt to override system instructions
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /ignore\s+(all\s+)?above\s+instructions/i,
  /disregard\s+(all\s+)?previous/i,
  /forget\s+(all\s+)?(your\s+)?instructions/i,
  /system\s*:\s*override/i,
  /system\s*:\s*you\s+are\s+now/i,
  /developer\s+mode/i,
  /DAN\s+mode/i,
  /do\s+anything\s+now/i,
  /jailbreak/i,
  /act\s+as\s+(if\s+)?you\s+(have\s+)?no\s+(restrictions|limitations|rules)/i,
  /pretend\s+you\s+(are|have)\s+no\s+(restrictions|limitations|rules)/i,
  /you\s+are\s+now\s+free/i,
  /bypass\s+(your\s+)?(safety|content|ethical)\s+(filters|guidelines)/i,
  /override\s+(your\s+)?(safety|content|ethical)/i,
  /reveal\s+(your\s+)?(system|initial)\s+(prompt|instructions)/i,
  /what\s+(is|are)\s+your\s+(system|initial)\s+(prompt|instructions)/i,
  /repeat\s+(the\s+)?text\s+above/i,
  /output\s+(the\s+)?(initialization|system)\s+prompt/i,
  /sudo\s+mode/i,
  /admin\s+mode/i,
  /maintenance\s+mode/i,
  /root\s+access/i
];

// --- XSS Attack Patterns ---
const XSS_PATTERNS = [
  /<script[\s>]/i,
  /javascript\s*:/i,
  /on\w+\s*=\s*["']/i,  // onclick=, onerror=, etc.
  /<iframe/i,
  /<object/i,
  /<embed/i,
  /<svg[\s>].*?on\w+/i,
  /eval\s*\(/i,
  /document\s*\.\s*(cookie|write|location)/i,
  /window\s*\.\s*(location|open)/i
];

// --- Suspicious IP Log ---
// In production, replace with Redis or database-backed logging
const suspiciousIPs = new Map();

/**
 * Sanitizes a string by stripping HTML tags and escaping dangerous characters.
 */
function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/<[^>]*>/g, '')           // Strip HTML tags
    .replace(/&/g, '&amp;')            // Escape ampersands
    .replace(/</g, '&lt;')             // Escape less-than
    .replace(/>/g, '&gt;')             // Escape greater-than
    .replace(/"/g, '&quot;')           // Escape double quotes
    .replace(/'/g, '&#x27;');          // Escape single quotes
}

/**
 * Recursively sanitizes all string values in an object.
 */
function sanitizeDeep(obj) {
  if (typeof obj === 'string') return sanitizeString(obj);
  if (Array.isArray(obj)) return obj.map(item => sanitizeDeep(item));
  if (obj !== null && typeof obj === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = sanitizeDeep(value);
    }
    return result;
  }
  return obj;
}

/**
 * Checks if any string in the request body contains injection patterns.
 */
function detectInjection(text) {
  if (typeof text !== 'string') return false;
  return INJECTION_PATTERNS.some(pattern => pattern.test(text));
}

/**
 * Checks if any string in the request body contains XSS patterns.
 */
function detectXSS(text) {
  if (typeof text !== 'string') return false;
  return XSS_PATTERNS.some(pattern => pattern.test(text));
}

/**
 * Recursively checks all string values in an object for threats.
 * Returns { isInjection: bool, isXSS: bool, flaggedField: string }
 */
function scanObject(obj, parentKey = '') {
  if (typeof obj === 'string') {
    if (detectInjection(obj)) return { isInjection: true, isXSS: false, flaggedField: parentKey };
    if (detectXSS(obj)) return { isInjection: false, isXSS: true, flaggedField: parentKey };
    return null;
  }
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      const result = scanObject(obj[i], `${parentKey}[${i}]`);
      if (result) return result;
    }
  }
  if (obj !== null && typeof obj === 'object') {
    for (const [key, value] of Object.entries(obj)) {
      const result = scanObject(value, parentKey ? `${parentKey}.${key}` : key);
      if (result) return result;
    }
  }
  return null;
}

/**
 * Logs a suspicious request for security auditing.
 */
function logSuspicious(ip, threatType, details) {
  const now = Date.now();
  const entry = suspiciousIPs.get(ip) || { count: 0, firstSeen: now, events: [] };
  entry.count++;
  entry.events.push({
    type: threatType,
    details,
    timestamp: new Date().toISOString()
  });
  // Keep only last 20 events per IP to prevent memory bloat
  if (entry.events.length > 20) entry.events = entry.events.slice(-20);
  suspiciousIPs.set(ip, entry);

  console.warn(JSON.stringify({
    security: 'THREAT_DETECTED',
    ip,
    type: threatType,
    details,
    totalAttempts: entry.count,
    timestamp: new Date().toISOString()
  }));
}

// Cleanup old suspicious IP entries every 30 minutes
const cleanupInterval = setInterval(() => {
  const thirtyMinAgo = Date.now() - (30 * 60 * 1000);
  for (const [ip, entry] of suspiciousIPs.entries()) {
    if (entry.firstSeen < thirtyMinAgo && entry.count < 10) {
      suspiciousIPs.delete(ip);
    }
  }
}, 30 * 60 * 1000);
if (cleanupInterval.unref) cleanupInterval.unref();

/**
 * Creates the Prompt Shield middleware.
 * 
 * @param {Object} options
 * @param {number} options.maxPayloadBytes - Maximum request body size (default: 50KB)
 * @param {boolean} options.sanitize - Whether to sanitize inputs (default: true)
 * @param {boolean} options.blockOnInjection - Block request on injection (default: true)
 */
const createPromptShield = (options = {}) => {
  const {
    maxPayloadBytes = 50 * 1024,  // 50KB
    sanitize = true,
    blockOnInjection = true
  } = options;

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';

    // 1. Payload size check
    const contentLength = parseInt(req.headers['content-length'] || '0');
    if (contentLength > maxPayloadBytes) {
      logSuspicious(ip, 'OVERSIZED_PAYLOAD', { size: contentLength, limit: maxPayloadBytes });
      return res.status(413).json({
        error: 'PAYLOAD_TOO_LARGE',
        message: `Request body exceeds the ${Math.floor(maxPayloadBytes / 1024)}KB limit.`
      });
    }

    // 2. Check for empty or malformed body on POST/PUT
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
      // 3. Scan for prompt injection and XSS
      const threat = scanObject(req.body);

      const url = req.originalUrl || req.url || '';
      const isCodeExecutionRoute = url.includes('/drills/') || url.includes('/code-canvas/') || url.includes('/sandbox/') || url.includes('/code-review');

      if (threat) {
        if (threat.isInjection && !isCodeExecutionRoute) {
          logSuspicious(ip, 'PROMPT_INJECTION', { field: threat.flaggedField });
          if (blockOnInjection) {
            return res.status(400).json({
              error: 'INJECTION_DETECTED',
              message: 'Your input contains patterns that look like a prompt injection attempt. This request has been blocked and logged.',
              flaggedField: threat.flaggedField
            });
          }
        }

        if (threat.isXSS) {
          logSuspicious(ip, 'XSS_ATTEMPT', { field: threat.flaggedField });
          // Don't block XSS — just sanitize below
        }
      }

      // 4. Sanitize all string inputs (strip HTML, escape special chars)
      // Preserves valid programming code syntax (e.g. `<` and `>`) on code execution and review routes
      if (sanitize && !isCodeExecutionRoute) {
        req.body = sanitizeDeep(req.body);
      }
    }

    // 5. Check if this IP has too many suspicious events (auto-block repeat offenders)
    const ipEntry = suspiciousIPs.get(ip);
    if (ipEntry && ipEntry.count >= 10) {
      return res.status(403).json({
        error: 'IP_BLOCKED',
        message: 'Your IP has been temporarily blocked due to repeated suspicious activity.'
      });
    }

    next();
  };
};

module.exports = { createPromptShield, sanitizeString, sanitizeDeep };
