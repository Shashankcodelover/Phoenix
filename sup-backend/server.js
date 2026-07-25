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

// --- CORS WHITELIST ---
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:5173').split(',');
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
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

// --- RATE LIMITER ---
const rateLimitMap = new Map();
app.use((req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
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
  res.json({ status: 'V4 Production', uptime: process.uptime() });
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
const { inputSecurityMiddleware } = require('./middleware/inputSanitizer');
const { createRateLimiter } = require('./middleware/rateLimiter');

// Rate limiters
const aiRateLimiter = createRateLimiter({ windowMs: 60000, maxRequests: 15, message: 'AI endpoint rate limit exceeded. Max 15 requests per minute.' });
const generalRateLimiter = createRateLimiter({ windowMs: 60000, maxRequests: 60 });

app.use('/uploads', express.static('uploads'));
app.use(inputSecurityMiddleware);

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

// Fallback compatibility
app.use('/api/hackathons', hackathonRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/users', userRoutes);
app.use('/api/prep', prepRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/idea-gen', ideaGenRoutes);
app.use('/api/enterprise', enterpriseRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/simulator', simulatorRoutes);
app.use('/api/code-review', codeReviewRoutes);

// --- GLOBAL ERROR BOUNDARY ---
app.use((err, req, res, next) => {
  console.error(JSON.stringify({ requestId: req.requestId, error: err.message, stack: err.stack }));
  res.status(500).json({ error: 'Internal server error', requestId: req.requestId });
});

let server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
process.on('SIGINT', () => {
  server.close(() => process.exit(0));
});

module.exports = server;