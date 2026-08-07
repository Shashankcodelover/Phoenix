const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();

const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// ensure upload directories exist
const fs = require('fs');
['uploads', 'uploads/profiles', 'uploads/chat'].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// --- HARDENED CORS WHITELIST (No Origin 'null' vulnerability) ---
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:5173,http://127.0.0.1:5500').split(',');
app.use(cors({
  origin: (origin, cb) => {
    // Allow non-browser requests (mobile apps/curl) with no origin header in production, or whitelisted domains
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    // Explicitly reject untrusted 'null' origin strings from sandboxed cross-origin iframes
    if (origin === 'null' && process.env.ALLOW_NULL_ORIGIN === 'true') return cb(null, true);
    cb(new Error('CORS policy violation'));
  },
  credentials: true
}));

app.use(express.json());

// --- STRUCTURED REQUEST LOGGER ---
app.use((req, res, next) => {
  req.requestId = crypto.randomUUID();
  const start = Date.now();
  res.on('finish', () => {
    console.log(JSON.stringify({
      requestId: req.requestId,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      durationMs: Date.now() - start,
      timestamp: new Date().toISOString()
    }));
  });
  next();
});

// --- RATE LIMITER & BOUNDED MEMORY STORE (Memory Leak Guard) ---
const rateLimitMap = new Map();
const MAX_RATE_LIMIT_KEYS = 5000;

setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of rateLimitMap.entries()) {
    const valid = timestamps.filter(t => now - t < 60000);
    if (valid.length === 0) rateLimitMap.delete(ip);
    else rateLimitMap.set(ip, valid);
  }
}, 60000).unref();

app.use((req, res, next) => {
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  const now = Date.now();

  if (rateLimitMap.size >= MAX_RATE_LIMIT_KEYS && !rateLimitMap.has(ip)) {
    const firstKey = rateLimitMap.keys().next().value;
    if (firstKey) rateLimitMap.delete(firstKey);
  }

  const timestamps = rateLimitMap.get(ip) || [];
  const valid = timestamps.filter(t => now - t < 60000);
  if (valid.length >= 100) {
    return res.status(429).json({ error: 'Too many requests' });
  }
  valid.push(now);
  rateLimitMap.set(ip, valid);
  next();
});

// --- HEALTH & READINESS ---
app.get('/health', (req, res) => {
  res.json({ status: 'V5 Production', uptime: process.uptime() });
});
app.get('/ready', (req, res) => {
  res.json({ ready: true });
});

const PORT = process.env.PORT || 5000;

const hackathonRoutes = require('./modules/hackathon-agent/hackathonRoutes');
const authRoutes = require('./modules/auth/authRoutes');
const profileRoutes = require('./modules/profile/profileRoutes');
const teamRoutes = require('./modules/team/teamRoutes');
const chatRoutes = require('./modules/chat/chatRoutes');
const userRoutes = require('./modules/user/userRoutes');
const prepRoutes = require('./modules/interview-prep/prepRoutes');
const agentRoutes = require('./modules/hackathon-agent/agentRoutes');
const gamificationRoutes = require('./modules/gamification/gamificationRoutes');
const githubRoutes = require('./modules/github/githubRoutes');
const ideaGenRoutes = require('./modules/idea-gen/ideaGenRoutes');
const enterpriseRoutes = require('./modules/enterprise/enterpriseRoutes');
const webhookRoutes = require('./modules/webhooks/webhookRoutes');
const simulatorRoutes = require('./modules/simulator/simulatorRoutes');
const codeReviewRoutes = require('./modules/code-review/codeReviewRoutes');
const botRoutes = require('./modules/bot/botRoutes');
const horizonRoutes = require('./modules/horizon/horizonRoutes');
const csPipelineRoutes = require('./modules/horizon/csPipelineRoutes');
const { inputSecurityMiddleware } = require('./middleware/inputSanitizer');
const { createPromptShield } = require('./middleware/promptShield');
const { createRateLimiter } = require('./middleware/rateLimiter');
const { createTokenBucketLimiter } = require('./middleware/tokenBucketRateLimiter');
const { sastPayloadGuard } = require('./middleware/sastPayloadGuard');

// Rate limiters
const aiRateLimiter = createRateLimiter({ windowMs: 60000, maxRequests: 15, message: 'AI endpoint rate limit exceeded. Max 15 requests per minute.' });
const tokenBucketLimiter = createTokenBucketLimiter({ capacity: 60, refillRatePerSec: 5, keyPrefix: 'api' });

// Google-Standard Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

app.use('/uploads', express.static('uploads'));
app.use(inputSecurityMiddleware);
app.use('/api', tokenBucketLimiter);
app.use('/api', createPromptShield({ maxPayloadBytes: 50 * 1024, sanitize: true, blockOnInjection: true }));
app.use('/api/v1/horizon/security', sastPayloadGuard);

// Health & Telemetry Status Endpoint
const getHealthStatus = (req, res) => {
  res.json({
    status: 'HEALTHY',
    version: '13.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    activeArchitecture: {
      triPillar: [
        'Pillar 1: Placement & Interview Preparation OS',
        'Pillar 2: Hackathon Builder Defense Engine',
        'Pillar 3: Phoenix Horizon Universal Career Foundation'
      ],
      securityGuards: [
        'Token Bucket Rate Limiter with Memory Leak Safeguard',
        'Automated SAST Security Payload Scanner',
        'Code Playback & Reasoning Integrity Inspector',
        'Zero-Trust Input Injection Shield'
      ]
    }
  });
};

app.get('/api/v1/health', getHealthStatus);
app.get('/api/health', getHealthStatus);

// API Versioning
app.use('/api/v1/hackathons', hackathonRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/teams', teamRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/prep', aiRateLimiter, prepRoutes);
app.use('/api/v1/agent', aiRateLimiter, agentRoutes);
app.use('/api/v1/gamification', gamificationRoutes);
app.use('/api/v1/github', githubRoutes);
app.use('/api/v1/idea-gen', aiRateLimiter, ideaGenRoutes);
app.use('/api/v1/enterprise', enterpriseRoutes);
app.use('/api/v1/webhooks', webhookRoutes);
app.use('/api/v1/simulator', simulatorRoutes);
app.use('/api/v1/code-review', codeReviewRoutes);
app.use('/api/v1/bot', aiRateLimiter, botRoutes);
app.use('/api/v1/horizon', horizonRoutes);
app.use('/api/v1/horizon', csPipelineRoutes);

// Fallback compatibility
app.use('/api/hackathons', hackathonRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/chat', chatRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Engine Exception]:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    requestId: req.requestId,
    timestamp: new Date().toISOString()
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[Phoenix Server v13.0.0]: Running on http://localhost:${PORT}`);
  });
}

module.exports = app;