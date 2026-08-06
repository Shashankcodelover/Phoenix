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
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:5173,http://127.0.0.1:5500').split(',');
app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin or 'null' (local file:// protocol) or whitelisted domains
    if (!origin || origin === 'null' || allowedOrigins.includes(origin)) return cb(null, true);
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
const { inputSecurityMiddleware } = require('./middleware/inputSanitizer');
const { createPromptShield } = require('./middleware/promptShield');
const { createRateLimiter } = require('./middleware/rateLimiter');

// Rate limiters
const aiRateLimiter = createRateLimiter({ windowMs: 60000, maxRequests: 15, message: 'AI endpoint rate limit exceeded. Max 15 requests per minute.' });
const generalRateLimiter = createRateLimiter({ windowMs: 60000, maxRequests: 60 });

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
app.use('/api', createPromptShield({ maxPayloadBytes: 50 * 1024, sanitize: true, blockOnInjection: true }));


// Health & Telemetry Status Endpoint
const getHealthStatus = (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'Project Phoenix Ultimate Autonomous Career & Hackathon Operating System',
    version: '11.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
    architecture: 'Tri-Pillar Modular World System (1. Placement & Interview World, 2. Hackathon & Builder World, 3. Phoenix Horizon Gap-Filler & Foundation)',
    aiEngineStatus: 'Multi-Provider Cascade Router (Groq 70B -> Gemini Flash -> OpenAI -> OpenRouter -> Local Engine)',
    horizonStatus: 'ACTIVE (Diagnostic Engine, 4-Phase Roadmaps, Exam Radar, PYQ Bank, Senior Bridge)',
    speechProsodyStatus: 'ACTIVE (WPM, Clarity, Filler Density & Vocal Prosody Evaluator)',
    peerMatchStatus: 'ACTIVE (P2P Signaling Room Engine & AI Safety-Net Takeover)',
    systemDesignStatus: 'ACTIVE (Interactive Architecture SLA, SPOF & Cloud Cost Evaluator)',
    hackathonScraperStatus: 'ACTIVE (Multi-Platform Feed Deduplication & Urgency Match Scorer)',
    skillMatrixStatus: 'ACTIVE (Unified 6-Axis Skill Radar Mastery Matrix)',
    starSynthesizerStatus: 'ACTIVE (STAR Behavioral Interview Story Synthesizer)',
    compBenchmarkStatus: 'ACTIVE (Salary & Equity Compensation Benchmarking Engine)',
    pitchDeckStatus: 'ACTIVE (5-Slide Pitch Presenter Blueprint Generator)',
    webhookDispatcherStatus: 'ACTIVE (Outbound Signed Event Relay & Dispatcher)',
    questEngineStatus: 'ACTIVE (Daily Streak Multiplier & XP Quest Engine)',
    securityShieldStatus: 'ACTIVE (Prompt Injection Shield + XSS Sanitizer + Payload Ceiling Guard)',
    availablePillars: {
      pillar1_placement_interview: [
        'Behavioral Outage Crisis Engine (/api/v1/prep/behavioral-pressure)',
        'Latency Budget Circuit Breaker (/api/v1/prep/evaluate-latency)',
        'Speech Prosody Evaluator (/api/v1/prep/analyze-speech)',
        'Peer Mock Room & AI Safety-Net (/api/v1/prep/peer-session)',
        'System Design Architecture Evaluator (/api/v1/prep/evaluate-architecture)',
        'ATS Resume Diff Engine (/api/v1/prep/resume-diff)',
        'STAR Story Synthesizer (/api/v1/prep/star-synthesize)',
        'Compensation Benchmarking Engine (/api/v1/prep/comp-benchmark)'
      ],
      pillar2_hackathon_builder: [
        'Hackathon Urgency & Match Scorer (/api/v1/agent/rank-hackathons)',
        'Live 3-Round AI Judge Defense Simulator (/api/v1/agent/judge-defense-sim)',
        '5-Slide Pitch Deck Presenter Blueprint (/api/v1/agent/pitch-deck)',
        'AI Code Review Audit Agent (/api/v1/code-review/audit)',
        'Hackathon Winner Solutions RAG (/api/v1/idea-gen/generate-ideas)',
        'Webhook Outbound Relay (/api/v1/webhooks/dispatch)'
      ],
      pillar3_horizon_gap_filler: [
        'Zero-Friction Diagnostic Onboarding (/api/v1/horizon/diagnostic)',
        'Multi-Sector 4-Phase Domain Roadmaps (/api/v1/horizon/roadmaps)',
        'Daily Action Checklists & XP Rewards (/api/v1/horizon/checklists/daily)',
        'Verified Resource & Link Repository (/api/v1/horizon/resources)',
        'Entrance Exam Radar (KCET/DCET/NEET/CA/JEE) (/api/v1/horizon/exams)',
        '500+ Categorized PYQ Question Bank & Mock Simulator (/api/v1/horizon/pyqs)',
        'Senior Alumni Mentorship Bridge (/api/v1/horizon/mentors)',
        'Stage-Based Career Path Explorer (/api/v1/horizon/explorer/:stageKey)'
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
app.use('/api/bot', botRoutes);

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