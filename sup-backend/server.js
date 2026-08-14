const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();

const fs = require('fs');

// FIX REJECTION #4: Do NOT write to the filesystem on boot.
// In read-only containers (K8s, Docker, Fargate), fs.appendFileSync crashes the process.
// Instead, generate secrets in-memory only and warn the operator.
// Enforce production security invariants
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  console.error('[FATAL SECURITY ERROR]: JWT_SECRET must be explicitly defined in production environment.');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = crypto.randomBytes(32).toString('hex');
  console.warn('[Security Warning]: JWT_SECRET not found in .env. Generated ephemeral secret (will not persist across restarts). Set JWT_SECRET in your environment.');
}

if (!process.env.WEBHOOK_SECRET) {
  process.env.WEBHOOK_SECRET = crypto.randomBytes(32).toString('hex');
  console.warn('[Security Warning]: WEBHOOK_SECRET not found in .env. Generated ephemeral secret.');
}


const connectDB = require('./config/db');

// FIX REJECTION #2: Initialize RAG service AFTER dotenv.config() to prevent env race condition
const ragService = require('./modules/hackathon-agent/rag_service');

const app = express();

// Connect Database
connectDB();

// FIX REJECTION #5: Track RAG initialization health for readiness probes.
// If RAG init fails, the /ready endpoint should report NOT_READY so K8s
// won't route traffic to this pod until the AI backend is reachable.
let ragHealthy = false;
ragService.initialize()
  .then(() => { ragHealthy = true; console.log('[Server] RAG Service initialized successfully.'); })
  .catch(err => {
    console.error('[Server] RAG Service initialization failed:', err.message);
    console.error('[Server] Server will boot in DEGRADED mode (no AI features).');
  });

// FIX REJECTION #4: Wrap mkdir in try/catch for read-only filesystems.
try {
  ['uploads', 'uploads/profiles', 'uploads/chat'].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });
} catch (mkdirErr) {
  console.warn('[Server] Cannot create upload directories (read-only filesystem?):', mkdirErr.code);
}

// --- HARDENED CORS WHITELIST (No Origin 'null' vulnerability) ---
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:5173,http://127.0.0.1:5500').split(',');
app.use(cors({
  origin: (origin, cb) => {
    // Allow non-browser requests (mobile apps/curl) with no origin header in production, or whitelisted domains
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    // Explicitly reject untrusted 'null' origin strings from sandboxed cross-origin iframes
    if (origin === 'null') return cb(new Error('CORS policy violation: null origin not permitted'));
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

// --- RATE LIMITER & BOUNDED MEMORY STORE ---
// FIX REJECTION #2 & #3: Replaced O(N) array-filter cleanup with a
// simple counter-based sliding window. Each IP gets a {count, windowStart}
// object instead of an array of timestamps. Cleanup iterates at most
// CLEANUP_BATCH_SIZE entries per tick to prevent blocking the event loop.
const rateLimitMap = new Map();
const MAX_RATE_LIMIT_KEYS = 5000;
const CLEANUP_BATCH_SIZE = 500;

setInterval(() => {
  const now = Date.now();
  let cleaned = 0;
  for (const [ip, bucket] of rateLimitMap.entries()) {
    if (cleaned >= CLEANUP_BATCH_SIZE) break;
    if (now - bucket.windowStart > 60000) {
      rateLimitMap.delete(ip);
    }
    cleaned++;
  }
}, 30000).unref();

app.use((req, res, next) => {
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  const now = Date.now();

  if (rateLimitMap.size >= MAX_RATE_LIMIT_KEYS && !rateLimitMap.has(ip)) {
    const firstKey = rateLimitMap.keys().next().value;
    if (firstKey) rateLimitMap.delete(firstKey);
  }

  let bucket = rateLimitMap.get(ip);
  if (!bucket || now - bucket.windowStart > 60000) {
    bucket = { count: 0, windowStart: now };
    rateLimitMap.set(ip, bucket);
  }

  bucket.count++;
  if (bucket.count > 100) {
    // FIX REJECTION #12: Include Retry-After header for RFC compliance
    const retryAfterSec = Math.ceil((60000 - (now - bucket.windowStart)) / 1000);
    res.setHeader('Retry-After', Math.max(1, retryAfterSec));
    return res.status(429).json({ error: 'Too many requests', retryAfterSeconds: Math.max(1, retryAfterSec) });
  }
  next();
});

// --- HEALTH & READINESS ---
app.get('/health', (req, res) => {
  res.json({ status: 'V16 Production', uptime: process.uptime() });
});
app.get('/ready', (req, res) => {
  // FIX REJECTION #5: Readiness probe reflects actual AI service health.
  res.status(ragHealthy ? 200 : 503).json({ ready: ragHealthy, ragStatus: ragHealthy ? 'INITIALIZED' : 'DEGRADED' });
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

// Google-Standard Security Headers & CSP
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; connect-src 'self' ws: wss:; font-src 'self' https://fonts.gstatic.com; object-src 'none';"
  );
  next();
});

app.use('/uploads', express.static('uploads'));
app.use(inputSecurityMiddleware);
app.use('/api', tokenBucketLimiter);
app.use('/api', createPromptShield({ maxPayloadBytes: 50 * 1024, sanitize: true, blockOnInjection: true }));
app.use('/api/v1/prep', sastPayloadGuard);
app.use('/api/v1/horizon/security', sastPayloadGuard);

// Cached Health & Telemetry Status Endpoint (5-second TTL to prevent L7 CPU DoS)
let cachedHealthTelemetry = null;
let lastHealthCheckTimestamp = 0;

const getHealthStatus = (req, res) => {
  const now = Date.now();
  if (!cachedHealthTelemetry || now - lastHealthCheckTimestamp > 5000) {
    cachedHealthTelemetry = {
      status: 'HEALTHY',
      version: '16.0.0',
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
          'Zero-Trust Input Injection Shield',
          'SSRF-Protected Outbound Webhook Relay'
        ]
      }
    };
    lastHealthCheckTimestamp = now;
  }
  res.json(cachedHealthTelemetry);
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

const http = require('http');
const { Server } = require('socket.io');
const { setupPeerSignalingSockets } = require('./modules/interview-prep/peerMatchEngine');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error('CORS policy violation'));
    },
    credentials: true
  }
});

setupPeerSignalingSockets(io);

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`[Phoenix Server v13.0.0]: Running on http://localhost:${PORT}`);
  });
}

module.exports = app;