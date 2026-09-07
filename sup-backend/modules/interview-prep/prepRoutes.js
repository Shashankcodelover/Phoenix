const express = require('express');
const {
  generateRoadmap,
  mockInterview,
  tailorResume,
  disruptResume,
  generateResumeDiff,
  submitQuiz,
  getQuestions,
  getCompanyIntelligenceEndpoint,
  getHackathonWinnersEndpoint,
  getPeerMatches,
  allocatePlanner,
  generateRevisionSheet,
  analyzeAudio,
  getPerformanceTrend,
  generateSystemDesignQuestion,
  analyzeBehavioralPressureEndpoint,
  evaluateLatencyCircuitBreakerEndpoint
} = require('./prepController');

const { validate, schemas } = require('../../middleware/inputValidator');

const router = express.Router();

const { protect, protectOptional } = require('../../middleware/authMiddleware');

router.post('/behavioral-pressure', protect, validate(schemas.behavioralPressure), analyzeBehavioralPressureEndpoint);
router.post('/evaluate-latency', protect, validate(schemas.latencyCircuit), evaluateLatencyCircuitBreakerEndpoint);

router.post('/generate-roadmap', protect, validate(schemas.generateRoadmap), generateRoadmap);
router.post('/mock-interview', protectOptional, validate(schemas.mockInterview), mockInterview);
router.post('/tailor-resume', protect, validate(schemas.tailorResume), tailorResume);
router.post('/resume-disrupt', protectOptional, validate(schemas.disruptResume), disruptResume);
router.post('/resume-diff', protect, generateResumeDiff);
router.post('/quiz-submit', protect, validate(schemas.quizSubmit), submitQuiz);
router.get('/questions', protect, getQuestions);
router.get('/company-intelligence', protect, getCompanyIntelligenceEndpoint);
router.get('/hackathon-winners', protect, getHackathonWinnersEndpoint);
router.post('/peer-match', protect, getPeerMatches);
router.post('/planner/allocate', protectOptional, validate(schemas.planner), allocatePlanner);
router.post('/revision', protect, validate(schemas.revision), generateRevisionSheet);
router.post('/analyze-audio', protect, analyzeAudio);
router.get('/performance-trend/:userId', protect, getPerformanceTrend);
const { getAlgorithmExecutionFrames } = require('./algoVisualizerController');
router.get('/visualizer/frames', getAlgorithmExecutionFrames);
const { starStoryMatrixEngine } = require('./starStoryMatrixEngine');
const { starStoryRefinerEngine } = require('./starStoryRefinerEngine');

router.post('/star/evaluate', (req, res) => {
  try {
    const { question = '', answer = '' } = req.body;
    const result = starStoryMatrixEngine.evaluateStarAnswer(question, answer);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/star/refine', (req, res) => {
  try {
    const result = starStoryRefinerEngine.refineBehavioralStory(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/star/vault', (req, res) => {
  const vaultStories = [
    {
      id: 'star-1',
      title: 'Distributed Redis Cache & Latency Slashing',
      principle: 'Bias for Action & Deliver Results',
      company: 'Amazon / AWS',
      tags: ['Backend', 'Optimization', 'P99 Latency', 'Redis'],
      situation: 'During peak cyber week sales, payment microservice P99 latency degraded to 420ms under 45k RPM, threatening transaction dropouts.',
      task: 'Restore sub-100ms P99 latency without provisioning additional expensive compute clusters.',
      action: 'Engineered a two-tier Redis LRU cache cluster with circuit-breaker fallbacks and stale-while-revalidate cache invalidation.',
      result: 'Reduced P99 latency by 76% (420ms -> 98ms), supported 60,000 sustained RPS with 99.99% availability, and eliminated database deadlocks.',
      metrics: ['-76% P99 Latency', '60k RPS', '99.99% Uptime']
    },
    {
      id: 'star-2',
      title: 'Graceful Degradation During Third-Party Outage',
      principle: 'Customer Obsession & Ownership',
      company: 'Google / Stripe',
      tags: ['Fault Tolerance', 'Microservices', 'Resilience'],
      situation: 'Downstream credit scoring provider suffered total outage during high-volume loan applicant approvals.',
      task: 'Prevent complete approval funnel blockage while mitigating fraud risk for 50k active candidates.',
      action: 'Designed heuristic shadow approval pipeline using cached historical applicant risk signals and asynchronous webhook re-verification.',
      result: 'Maintained 88% user conversion without service downtime, with 0% post-recovery fraud loss detected by internal audit.',
      metrics: ['88% Funnel Retention', '0% Fraud Loss', '50k Users Protected']
    },
    {
      id: 'star-3',
      title: 'Architectural Disagreement on Microservices vs Monolith',
      principle: 'Have Backbone; Disagree and Commit',
      company: 'Meta / Netflix',
      tags: ['Leadership', 'System Design', 'Conflict'],
      situation: 'Senior tech lead advocated migrating a stable service to 14 distributed microservices 3 weeks before product launch.',
      task: 'Advocate for launch stability while addressing lead engineer scalability concerns objectively.',
      action: 'Conducted benchmark load tests demonstrating network hop latency overhead (+120ms) and presented modular monolith domain-driven approach with clean interfaces.',
      result: 'Team aligned on modular monolith design, launched on time with 0 Sev-1 incidents, saving 2.5 months of complex DevOps maintenance.',
      metrics: ['On-time Launch', '0 Sev-1 Bugs', 'Saved 10 Weeks DevOps']
    }
  ];
  res.json({ success: true, count: vaultStories.length, stories: vaultStories });
});

// Feature 12: SQL Query Optimizer & Tuning Workbench
const { sqlOptimizerEngine } = require('./sqlOptimizerEngine');

router.post('/sql/optimize', (req, res) => {
  try {
    const result = sqlOptimizerEngine.optimizeQuery(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/sql/execute', (req, res) => {
  try {
    const { query = '' } = req.body;
    const employees = [
      { id: 1, name: 'Alice Chen', department_id: 1, salary: 185000 },
      { id: 2, name: 'Bob Smith', department_id: 1, salary: 165000 },
      { id: 3, name: 'Charlie Kim', department_id: 2, salary: 195000 },
      { id: 4, name: 'Devon Patel', department_id: 2, salary: 175000 },
      { id: 5, name: 'Elena Rostova', department_id: 3, salary: 210000 },
      { id: 6, name: 'Frank Miller', department_id: 3, salary: 140000 },
      { id: 7, name: 'Grace Hopper', department_id: 1, salary: 220000 }
    ];

    const departments = [
      { id: 1, name: 'Core Infrastructure' },
      { id: 2, name: 'AI Platform' },
      { id: 3, name: 'Distributed Systems' }
    ];

    const clean = query.trim().toUpperCase();
    let rows = [];
    let queryType = 'Custom Query';

    if (clean.includes('DENSE_RANK') || clean.includes('ROW_NUMBER') || clean.includes('TOP 3')) {
      queryType = 'Department Top Earners (Window Function)';
      rows = [
        { department: 'Core Infrastructure', employee: 'Grace Hopper', salary: 220000, rank: 1 },
        { department: 'Core Infrastructure', employee: 'Alice Chen', salary: 185000, rank: 2 },
        { department: 'Core Infrastructure', employee: 'Bob Smith', salary: 165000, rank: 3 },
        { department: 'AI Platform', employee: 'Charlie Kim', salary: 195000, rank: 1 },
        { department: 'AI Platform', employee: 'Devon Patel', salary: 175000, rank: 2 },
        { department: 'Distributed Systems', employee: 'Elena Rostova', salary: 210000, rank: 1 },
        { department: 'Distributed Systems', employee: 'Frank Miller', salary: 140000, rank: 2 }
      ];
    } else if (clean.includes('SECOND') || (clean.includes('DISTINCT') && clean.includes('LIMIT 1 OFFSET 1')) || clean.includes('SALARY <')) {
      queryType = 'Second Highest Salary';
      rows = [{ SecondHighestSalary: 210000 }];
    } else if (clean.includes('JOIN') || clean.includes('DEPARTMENT')) {
      queryType = 'Employee-Department Directory';
      rows = employees.map(e => {
        const d = departments.find(dep => dep.id === e.department_id);
        return { id: e.id, name: e.name, department: d ? d.name : 'Unknown', salary: `$${e.salary.toLocaleString()}` };
      });
    } else {
      queryType = 'Table Scan';
      rows = employees.slice(0, 5).map(e => ({ id: e.id, name: e.name, salary: `$${e.salary.toLocaleString()}` }));
    }

    res.json({
      success: true,
      queryType,
      rowCount: rows.length,
      columns: rows.length > 0 ? Object.keys(rows[0]) : [],
      rows,
      executionTimeMs: 1.24
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Feature 13: Concurrency & Thread Safety Playground
const { simulateConcurrency } = require('./concurrencySimulatorController');
router.post('/concurrency/simulate', simulateConcurrency);

// Feature 14: Cold Outreach & Recruiter InMail Generator
const { generateOutreach } = require('./outreachController');
router.post('/outreach/generate', generateOutreach);


const { evaluateSpeechProsody } = require('./speechEvaluatorEngine');
const { createOrMatchPeerRoom, sendRoomHeartbeat, handlePeerSignalingOffer, handlePeerSignalingAnswer, handleIceCandidate } = require('./peerMatchEngine');
const { evaluateSystemDesign } = require('./systemDesignEvaluator');

// Feature 18: Interview Anxiety & Speech Pace Biofeedback
const SPEECH_BENCHMARK_PRESETS = [
  {
    id: 'anxious_rapid',
    title: 'High Anxiety & Rapid Pacing',
    category: 'Rapid Speech & High Fillers',
    durationSeconds: 45,
    sampleText: 'Um, basically, like in our previous system, we had this, you know, huge database deadlock issue, and honestly, like I was literally scrambling because the queries were, like, sort of taking forever and, um, obviously we had to, like, restart the replicas.'
  },
  {
    id: 'executive_staff',
    title: 'Executive FAANG Staff Delivery',
    category: 'Optimal Pacing & High Authority',
    durationSeconds: 52,
    sampleText: 'During our Q3 latency optimization sprint, I architected a distributed two-tier Redis caching layer. By implementing stale-while-revalidate invalidation, we reduced our P99 payment microservice latency by 76 percent and sustained 60,000 requests per second with zero database deadlocks.'
  },
  {
    id: 'hesitant_slow',
    title: 'Hesitant & Monotone Delivery',
    category: 'Low WPM & Uncertainty',
    durationSeconds: 70,
    sampleText: 'I think... maybe... we could have used a Kafka queue... but I was not entirely sure... because the team lead preferred RabbitMQ... and so we just waited.'
  }
];

router.get('/speech/presets', (req, res) => {
  res.json({ success: true, presets: SPEECH_BENCHMARK_PRESETS });
});

router.post('/analyze-speech', protectOptional, (req, res) => {
  try {
    const { transcript, durationSeconds } = req.body;
    const evaluation = evaluateSpeechProsody(transcript, durationSeconds);
    res.json(evaluation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Feature 19: Company Rejection Post-Mortem & Gap Tracker
const { rejectionPostMortemEngine } = require('./rejectionPostMortemEngine');

router.get('/post-mortem/presets', (req, res) => {
  res.json({ success: true, presets: rejectionPostMortemEngine.getPresets() });
});

router.post('/post-mortem/analyze', protectOptional, (req, res) => {
  try {
    const result = rejectionPostMortemEngine.analyzeDebrief(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/post-mortem/history', (req, res) => {
  res.json(rejectionPostMortemEngine.getHistory());
});

// Feature 20: Executive Placement Command Center & Readiness Score
const { executiveReadinessEngine } = require('./executiveReadinessEngine');

router.get('/readiness/presets', (req, res) => {
  res.json({ success: true, presets: executiveReadinessEngine.getPresets() });
});

router.post('/readiness/evaluate', protectOptional, (req, res) => {
  try {
    const result = executiveReadinessEngine.evaluateReadiness(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});



router.post('/peer-session', protect, async (req, res) => {
  try {
    const { action, user, roomId, userId } = req.body;
    if (action === 'heartbeat') {
      const result = await sendRoomHeartbeat(roomId, userId);
      return res.json(result);
    }
    const result = await createOrMatchPeerRoom(user);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/peer-signaling', protect, (req, res) => {
  try {
    const { action, roomId, userId, sdpOffer, sdpAnswer, candidate } = req.body;
    if (action === 'offer') return res.json(handlePeerSignalingOffer(roomId, userId, sdpOffer));
    if (action === 'answer') return res.json(handlePeerSignalingAnswer(roomId, userId, sdpAnswer));
    if (action === 'ice-candidate') return res.json(handleIceCandidate(roomId, userId, candidate));
    res.status(400).json({ error: 'INVALID_SIGNALING_ACTION' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/evaluate-architecture', protect, (req, res) => {
  try {
    const evaluation = evaluateSystemDesign(req.body);
    res.json(evaluation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { getCompensationBenchmark } = require('./compBenchmarkingEngine');

router.post('/star-synthesize', protect, (req, res) => {
  try {
    const result = synthesizeSTARStory(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/comp-benchmark', protect, (req, res) => {
  try {
    const result = getCompensationBenchmark(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ═══════════════════════════════════════════════════════════
// V14 NEW FEATURES: Resume Interview Gen, Speech Analysis, STAR Evaluator
// ═══════════════════════════════════════════════════════════

const { generateResumeInterviewQuestions, analyzeResumeAlignment } = require('./resumeInterviewGenerator');
const { analyzeSpeech } = require('./speechAnalysisEngine');
const { evaluateSTAR } = require('./starEvaluator');

// Feature #5: Resume-driven interview question generator
router.post('/resume-interview-questions', protect, async (req, res) => {
  try {
    const result = await generateResumeInterviewQuestions(req.body);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Feature #5b: Resume-JD alignment analyzer
router.post('/resume-alignment', protect, async (req, res) => {
  try {
    const result = await analyzeResumeAlignment(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Feature #6: Speech analysis engine (filler words, pace, STAR compliance)
router.post('/speech-analysis', protect, (req, res) => {
  try {
    const result = analyzeSpeech(req.body);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Feature #7: STAR framework auto-evaluator with quantitative rubric
router.post('/star-evaluate', protect, async (req, res) => {
  try {
    const result = await evaluateSTAR(req.body);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ═══════════════════════════════════════════════════════════
// V15 NEW FEATURES: Agentic Ecosystem (Copilot, Culture Fit, etc.)
// ═══════════════════════════════════════════════════════════

const { generateLiveCopilotHint } = require('./copilotEngine');
const { generateNextQuestion } = require('./agenticInterviewer');
const { evaluateCaseStudy } = require('./caseStudyEngine');
const { evaluateCultureFit } = require('./cultureFitEngine');
const { calculateReadinessScore } = require('./readinessBenchmarkEngine');
const { mitigateSpeechBias } = require('./biasMitigatorEngine');
const { scoreSocialPresence } = require('./presenceScorerEngine');
const { evaluateTakeHomeAssignment } = require('./takehomeEvaluator');

// Feature #1: Live Copilot Stealth Hint
router.post('/copilot/hint', protect, async (req, res) => {
  try {
    const result = await generateLiveCopilotHint(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Feature #2: Agentic Interviewer
router.post('/agentic/next-question', protect, async (req, res) => {
  try {
    const result = await generateNextQuestion(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Feature #3: Case Study & Guesstimate Simulator
router.post('/case-study/evaluate', protect, async (req, res) => {
  try {
    const result = await evaluateCaseStudy(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Feature #4: Culture Fit Alignment
router.post('/culture-fit/evaluate', protect, async (req, res) => {
  try {
    const result = await evaluateCultureFit(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Feature #5: Readiness Benchmark Aggregator
router.post('/readiness/benchmark', protect, (req, res) => {
  try {
    const { scores, targetCompany } = req.body;
    const result = calculateReadinessScore(scores, targetCompany);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Feature #6: Bias Mitigator (Middleware wrapper around speech analysis)
router.post('/speech-analysis/unbiased', protect, (req, res) => {
  try {
    // Assuming original analyzeSpeech is available or we wrap the request
    const { analyzeSpeech } = require('./speechAnalysisEngine');
    const baseResult = analyzeSpeech(req.body);
    const unbiasedResult = mitigateSpeechBias(baseResult, req.body.isNonNativeSpeaker);
    res.json(unbiasedResult);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Feature #7: Social Presence Scorer
router.post('/presence/score', protect, (req, res) => {
  try {
    const result = scoreSocialPresence(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Feature #8: Take-Home Assignment Evaluator
router.post('/takehome/evaluate', protect, async (req, res) => {
  try {
    const result = await evaluateTakeHomeAssignment(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ═══════════════════════════════════════════════════════════
// V16 NEW FEATURES: Deep Coaching & Analysis Engines
// ═══════════════════════════════════════════════════════════

const { analyzeInterviewPatterns } = require('./patternRecognitionEngine');
const { evaluateNegotiation } = require('./negotiationEngine');
const { analyzePacing } = require('./pacingCoachEngine');
const { generateDepthProbe } = require('./depthProberEngine');
const { compareAnswers } = require('./answerComparisonEngine');

// Feature V16-1: Interview Pattern Recognition (Longitudinal Analysis)
router.post('/patterns/analyze', protect, (req, res) => {
  try {
    const result = analyzeInterviewPatterns(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Feature V16-2: Negotiation Simulator
router.post('/negotiation/evaluate', protect, async (req, res) => {
  try {
    const result = await evaluateNegotiation(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Feature V16-3: Pacing Coach
router.post('/pacing/analyze', protect, (req, res) => {
  try {
    const result = analyzePacing(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Feature V16-4: Technical Depth Prober
router.post('/depth-probe/next', protect, async (req, res) => {
  try {
    const result = await generateDepthProbe(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Feature V16-5: Answer Comparison (A/B)
router.post('/answers/compare', protect, (req, res) => {
  try {
    const result = compareAnswers(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ═══════════════════════════════════════════════════════════
// V18 NEW FEATURES: Real-Time WebRTC PCM Voice & Turn-Taking
// ═══════════════════════════════════════════════════════════
const { processRealtimeAudioChunk, evaluateTurnTakingCadence } = require('./realtimeVoiceEngine');

// Feature V18-1: Real-Time Audio Chunk Telemetry & Interruption Handler
router.post('/realtime-voice/chunk', protect, (req, res) => {
  try {
    const result = processRealtimeAudioChunk(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Feature V18-2: Turn-Taking & Micro-Pause Cadence Analysis
router.post('/realtime-voice/turn-cadence', protect, (req, res) => {
  try {
    const result = evaluateTurnTakingCadence(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ═══════════════════════════════════════════════════════════
// V19 NEW FEATURES: AST Complexity, Panel, Canvas & IRT
// ═══════════════════════════════════════════════════════════
const { analyzeCodeComplexity } = require('./astComplexityEngine');
const { evaluatePanelConsensus } = require('./multiAgentPanelEngine');
const { validateArchitectureTopology } = require('./canvasTopologyEngine');
const { defaultIrtEngine } = require('./irtAdaptiveEngine');

// Feature V19-1: AST Complexity & Algorithmic Runtime Inspector
router.post('/code/analyze-complexity', protect, (req, res) => {
  try {
    const result = analyzeCodeComplexity(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Feature V19-2: Multi-Agent AI Interview Panel Consensus
router.post('/panel/consensus', protect, (req, res) => {
  try {
    const result = evaluatePanelConsensus(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Feature V19-3: Canvas Topology & Architecture Graph Validator
router.post('/canvas/validate-topology', protect, (req, res) => {
  try {
    const result = validateArchitectureTopology(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ═══════════════════════════════════════════════════════════
// V20 NEW FEATURES: Real-Time Audio Hub, Reranker, Sandbox, Benchmarking
// ═══════════════════════════════════════════════════════════
const { realtimeAudioHub } = require('./realtimeAudioHub');
const { candidateBenchmarkEngine } = require('./candidateBenchmarkEngine');
const { sandboxedExecutionEngine } = require('../simulator/sandboxedExecutionEngine');
const { crossEncoderReranker } = require('../hackathon-agent/crossEncoderReranker');

// Feature V20-1: Realtime Audio Hub Session Init
router.post('/realtime-audio/init', protect, (req, res) => {
  try {
    const { sessionId = `audio_${Date.now()}`, sampleRate, channels, targetRole } = req.body;
    const result = realtimeAudioHub.startSession(sessionId, { sampleRate, channels, targetRole, userId: req.user?.id });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Feature V20-2: Realtime Audio Chunk Ingestion
router.post('/realtime-audio/chunk', protect, (req, res) => {
  try {
    const { sessionId, pcmChunk, metadata } = req.body;
    const result = realtimeAudioHub.ingestAudioChunk(sessionId, pcmChunk, metadata);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Feature V20-3: Realtime Audio Live Transcript Slice
router.post('/realtime-audio/transcript', protect, (req, res) => {
  try {
    const { sessionId, textSlice, confidence } = req.body;
    const result = realtimeAudioHub.appendTranscriptSlice(sessionId, textSlice, confidence);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Feature V20-4: Realtime Audio Session Finalize
router.post('/realtime-audio/finalize', protect, (req, res) => {
  try {
    const { sessionId } = req.body;
    const result = realtimeAudioHub.endSession(sessionId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Feature V20-5: Candidate Longitudinal FAANG Percentile Benchmark
router.post('/benchmark/profile', protect, (req, res) => {
  try {
    const result = candidateBenchmarkEngine.benchmarkCandidate(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Feature V20-6: Isolated Sandboxed VM Code Execution
router.post('/sandbox/execute', protect, (req, res) => {
  try {
    const result = sandboxedExecutionEngine.execute(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ═══════════════════════════════════════════════════════════
// V21 NEW FEATURES: Live Collaborative Canvas & Multimodal Judge Defense
// ═══════════════════════════════════════════════════════════
const { collaborativeCodeCanvas } = require('./collaborativeCodeCanvas');
const { multimodalJudgeDefenseEngine } = require('../hackathon-agent/multimodalJudgeDefenseEngine');

// Feature 16 / V21-2: Collaborative Code Canvas Questions Library
router.get('/code-canvas/questions', (req, res) => {
  try {
    const result = collaborativeCodeCanvas.getAvailableQuestions();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Feature 16 / V21-2: Collaborative Code Canvas Join / Init
router.post('/code-canvas/join', protectOptional, (req, res) => {
  try {
    const { roomId = `room_${Date.now()}`, language, problemStatement, initialCode, userName, userRole } = req.body;
    const result = collaborativeCodeCanvas.createOrJoinRoom(roomId, {
      language,
      problemStatement,
      initialCode,
      userName: userName || (req.user?.name || 'Anonymous Peer'),
      userRole: userRole || 'Candidate',
      userId: req.user?.id || `user_${Date.now().toString().slice(-4)}`
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Feature 16 / V21-3: Collaborative Code Canvas Update & AST Linting
router.post('/code-canvas/update', protectOptional, (req, res) => {
  try {
    const { roomId, update } = req.body;
    const result = collaborativeCodeCanvas.applyCodeUpdate(roomId, {
      ...update,
      userId: update?.userId || req.user?.id || 'candidate'
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Feature 16: Live Sandboxed Code Execution Terminal
router.post('/code-canvas/execute', protectOptional, (req, res) => {
  try {
    const { roomId, code } = req.body;
    const result = collaborativeCodeCanvas.executeRoomCode(roomId, { code });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Feature 16: Interviewer Assessment Rubric Scorecard
router.post('/code-canvas/rubric', protectOptional, (req, res) => {
  try {
    const { roomId, rubric } = req.body;
    const result = collaborativeCodeCanvas.submitRubricAssessment(roomId, rubric);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Feature 17: Daily Interview Warm-up Micro-Drills
const { microDrillEngine } = require('./microDrillEngine');

router.get('/drills/daily', protectOptional, (req, res) => {
  try {
    const userId = req.user?.id || 'guest_user';
    const result = microDrillEngine.getDailyDrill(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/drills/verify', protectOptional, (req, res) => {
  try {
    const { drillId, code, elapsedSeconds } = req.body;
    const userId = req.user?.id || 'guest_user';
    const result = microDrillEngine.verifyDrillSolution(drillId, { code, elapsedSeconds, userId });
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/drills/streak', protectOptional, (req, res) => {
  try {
    const userId = req.user?.id || 'guest_user';
    const result = microDrillEngine.getStreakData(userId);
    res.json({ success: true, streak: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ═══════════════════════════════════════════════════════════
// V22 NEW FEATURES: Hackathon Team Server, Idea Polling & Split-Chat OS
// ═══════════════════════════════════════════════════════════
const { hackathonTeamServer } = require('../hackathon-agent/hackathonTeamServer');

// Feature V22-1: Create or Join Hackathon Team Workspace
router.post('/hackathon/team/create', protect, (req, res) => {
  try {
    const { teamId = `team_${Date.now()}`, teamName, hackathonEvent, creator } = req.body;
    const result = hackathonTeamServer.createOrJoinTeam(teamId, {
      teamName,
      hackathonEvent,
      creator: creator || { id: req.user?.id, name: req.user?.name || 'Teammate', role: 'Full Stack Dev' }
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Feature V22-2: Universal Team Chat Message Broadcast
router.post('/hackathon/team/message', protect, (req, res) => {
  try {
    const { teamId, content, senderName } = req.body;
    const result = hackathonTeamServer.sendTeamMessage(teamId, {
      userId: req.user?.id,
      senderName: senderName || req.user?.name || 'Teammate',
      content
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Feature V22-3: Launch Hackathon Idea Voting Poll
router.post('/hackathon/team/poll/create', protect, (req, res) => {
  try {
    const { teamId, theme, prizeTracks } = req.body;
    const result = hackathonTeamServer.generateIdeaPoll(teamId, { theme, prizeTracks });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Feature V22-4: Cast Vote in Hackathon Idea Poll
router.post('/hackathon/team/poll/vote', protect, (req, res) => {
  try {
    const { teamId, ideaId } = req.body;
    const result = hackathonTeamServer.castIdeaVote(teamId, req.user?.id || 'lead_1', ideaId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Feature V22-5: Decompose Project & Assign Roles from Scratch to Deployment
router.post('/hackathon/team/decompose', protect, (req, res) => {
  try {
    const { teamId, selectedIdea } = req.body;
    const result = hackathonTeamServer.decomposeAndAssignTasks(teamId, selectedIdea);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ═══════════════════════════════════════════════════════════
// V23 NEW FEATURES: Vault 2 & Vault 3 Next-Level Breakthrough Engines
// ═══════════════════════════════════════════════════════════
const { whiteboardTopologySimulator } = require('./whiteboardTopologySimulator');
const { compensationNegotiatorEngine } = require('./compensationNegotiatorEngine');
const { pitchTeleprompterEngine } = require('../hackathon-agent/pitchTeleprompterEngine');
const { demoDisasterRecoveryHub } = require('../hackathon-agent/demoDisasterRecoveryHub');
const { submissionGeneratorEngine } = require('../hackathon-agent/submissionGeneratorEngine');

// Vault 2: STAR Story Matrix Evaluator
router.post('/star-story/evaluate', protect, (req, res) => {
  try {
    const { question, answer } = req.body;
    const result = starStoryMatrixEngine.evaluateStarAnswer(question, answer);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Vault 2: Live System Design Whiteboard Topology & SPOF Simulator
router.post('/whiteboard/resilience', protect, (req, res) => {
  try {
    const { topology, simulationOptions } = req.body;
    const result = whiteboardTopologySimulator.simulateResilience(topology, simulationOptions);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Vault 2: Offer Negotiation & Compensation Benchmarking
router.post('/compensation/evaluate', protect, (req, res) => {
  try {
    const result = compensationNegotiatorEngine.evaluateOffer(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Feature 15: Salary Negotiation & Multi-Offer Comparator
router.get('/offers/bands', (req, res) => {
  try {
    const meta = compensationNegotiatorEngine.getBenchmarkMeta();
    res.json(meta);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/offers/compare', (req, res) => {
  try {
    const { offers } = req.body;
    const result = compensationNegotiatorEngine.compareOffers(offers);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/offers/negotiate', (req, res) => {
  try {
    const result = compensationNegotiatorEngine.evaluateAndGenerateScript(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Vault 3: Interactive 3-Minute Pitch Teleprompter & 5-Slide Deck
router.post('/pitch/teleprompter', protect, (req, res) => {
  try {
    const result = pitchTeleprompterEngine.generateTeleprompter(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/pitch/slide-deck', protect, (req, res) => {
  try {
    const result = pitchTeleprompterEngine.generate5SlideDeck(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Vault 3: Live Demo Disaster Recovery Hub
router.post('/hackathon/disaster-recovery', protect, (req, res) => {
  try {
    const result = demoDisasterRecoveryHub.generateRecoveryPackage(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { voiceAiCoachEngine } = require('./voiceAiCoachEngine');

// ═══════════════════════════════════════════════════════════
// Feature 2: Real-Time Bidirectional Voice AI Coach & Interruption Radar
// ═══════════════════════════════════════════════════════════
router.post('/voice-coach/session/start', protect, (req, res) => {
  try {
    const result = voiceAiCoachEngine.startSession(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/voice-coach/session/chunk', protect, (req, res) => {
  try {
    const { sessionId, transcriptSlice, durationSeconds } = req.body;
    const result = voiceAiCoachEngine.processAudioChunk(sessionId, { transcriptSlice, durationSeconds });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/voice-coach/session/interruption-test', protect, (req, res) => {
  try {
    const { sessionId, candidateCurrentPoint } = req.body;
    const result = voiceAiCoachEngine.triggerSpontaneousInterruption(sessionId, candidateCurrentPoint);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/voice-coach/session/finalize', protect, (req, res) => {
  try {
    const { sessionId, finalAnswerSample } = req.body;
    const result = voiceAiCoachEngine.finalizeSession(sessionId, finalAnswerSample);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


const { liveWhiteboardSimulator } = require('./liveWhiteboardSimulator');

// ═══════════════════════════════════════════════════════════
// Feature 3: Live System Design Whiteboard & Chaos Failure Simulator
// ═══════════════════════════════════════════════════════════
router.get('/whiteboard/templates', protect, (req, res) => {
  try {
    const templates = liveWhiteboardSimulator.getTemplates();
    res.json({ success: true, templates });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { atsDisruptorEngine } = require('./atsDisruptorEngine');

// ═══════════════════════════════════════════════════════════
// Feature 6: Automated ATS Resume Disruptor & Markdown Diff Generator
// ═══════════════════════════════════════════════════════════
const { MultimodalJudgeDefenseEngine } = require('../hackathon-agent/multimodalJudgeDefenseEngine');
const judgeDefenseEngine = new MultimodalJudgeDefenseEngine();

// ═══════════════════════════════════════════════════════════
// Feature 7: Live Multimodal AI Judge Defense Grilling Simulator
// ═══════════════════════════════════════════════════════════
router.post('/hackathon/judge-defense/round', protect, (req, res) => {
  try {
    const result = judgeDefenseEngine.evaluateDefense(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ═══════════════════════════════════════════════════════════
// Feature 9: Compensation & Stock Equity Negotiation Engine
// ═══════════════════════════════════════════════════════════
router.post('/compensation/negotiate-script', protect, (req, res) => {
  try {
    const result = compensationNegotiatorEngine.evaluateAndGenerateScript(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { devpostSubmissionEngine } = require('../hackathon-agent/devpostSubmissionEngine');

// ═══════════════════════════════════════════════════════════
// Feature 12: Automated Devpost Markdown Submission Generator
// ═══════════════════════════════════════════════════════════
router.post('/hackathon/devpost-submission', protect, (req, res) => {
  try {
    const result = devpostSubmissionEngine.generateDevpostSubmission(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { astComplexityProfiler } = require('./astComplexityProfiler');

// ═══════════════════════════════════════════════════════════
// Feature 13: Live AST Complexity & Big-O Real-Time Profiler
// ═══════════════════════════════════════════════════════════
router.post('/code/profile-ast', protect, (req, res) => {
  try {
    const result = astComplexityProfiler.profileCode(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { interviewAnalyticsHub } = require('./interviewAnalyticsHub');

// ═══════════════════════════════════════════════════════════
// Feature 14: Comprehensive AI Mock Interview History & Analytics
// ═══════════════════════════════════════════════════════════
router.get('/analytics/session-history', protect, (req, res) => {
  try {
    const result = interviewAnalyticsHub.getSessionHistory(req.user?.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/analytics/record-session', protect, (req, res) => {
  try {
    const result = interviewAnalyticsHub.recordSession(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { marpPitchDeckEngine } = require('../hackathon-agent/marpPitchDeckEngine');

// ═══════════════════════════════════════════════════════════
// Feature 16: Automated Marp 5-Slide Pitch Deck Engine
// ═══════════════════════════════════════════════════════════
router.post('/pitch/marp-export', protect, (req, res) => {
  try {
    const result = marpPitchDeckEngine.generateMarpDeck(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { placementTelemetryDashboard } = require('./placementTelemetryDashboard');

// ═══════════════════════════════════════════════════════════
// Feature 17: Placement Readiness Institutional Telemetry
// ═══════════════════════════════════════════════════════════
router.get('/telemetry/institutional-dashboard', protect, (req, res) => {
  try {
    const result = placementTelemetryDashboard.getInstitutionalMetrics();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { adaptiveCodingAssessmentEngine } = require('./adaptiveCodingAssessmentEngine');


// ═══════════════════════════════════════════════════════════
// Feature 18: Adaptive Technical Coding Assessment Engine
// ═══════════════════════════════════════════════════════════
router.post('/assessment/generate', protect, (req, res) => {
  try {
    const result = adaptiveCodingAssessmentEngine.generateAssessment(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/assessment/submit', protect, (req, res) => {
  try {
    const result = adaptiveCodingAssessmentEngine.evaluateSubmission(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { teamSynergyEngine } = require('../hackathon-agent/teamSynergyEngine');

// ═══════════════════════════════════════════════════════════
// Feature 19: Hackathon Team Role Synergy & Skill Recommender
// ═══════════════════════════════════════════════════════════
router.post('/hackathon/team/synergy-analyze', protect, (req, res) => {
  try {
    const result = teamSynergyEngine.evaluateTeamSynergy(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { audioWaveformPitchEngine } = require('./audioWaveformPitchEngine');

// ═══════════════════════════════════════════════════════════
// Feature 20: WebRTC Audio Waveform & Vocal Pitch Gauge
// ═══════════════════════════════════════════════════════════
router.post('/audio/waveform-analyze', protect, (req, res) => {
  try {
    const result = audioWaveformPitchEngine.analyzeWaveformTelemetry(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ═══════════════════════════════════════════════════════════
// Feature 22: AI Behavioral STAR Story Refiner & Metric Injector
// ═══════════════════════════════════════════════════════════
router.post('/star/refine-story', protect, (req, res) => {
  try {
    const result = starStoryRefinerEngine.refineBehavioralStory(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { pitchTimerBuzzerEngine } = require('../hackathon-agent/pitchTimerBuzzerEngine');



// ═══════════════════════════════════════════════════════════
// Feature 23: Stage-Ready 180s Pitch Timer & Audio Buzzer
// ═══════════════════════════════════════════════════════════
router.post('/pitch/timer-config', protect, (req, res) => {
  try {
    const result = pitchTimerBuzzerEngine.getTimerConfiguration(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { systemCostSlaEngine } = require('./systemCostSlaEngine');

// ═══════════════════════════════════════════════════════════
// Feature 24: Distributed System Cloud Cost & 99.99% SLA
// ═══════════════════════════════════════════════════════════
router.post('/system-design/cost-sla-estimate', protect, (req, res) => {
  try {
    const result = systemCostSlaEngine.calculateCostAndSla(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { crisisPressureSimulatorEngine } = require('./crisisPressureSimulatorEngine');

// ═══════════════════════════════════════════════════════════
// Feature 27: FAANG Bar-Raiser Behavioral Pressure & P0 Crisis
// ═══════════════════════════════════════════════════════════
router.post('/crisis/simulate-scenario', protect, (req, res) => {
  try {
    const result = crisisPressureSimulatorEngine.simulateCrisisScenario(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { sponsorBountyMatcherEngine } = require('../hackathon-agent/sponsorBountyMatcherEngine');

// ═══════════════════════════════════════════════════════════
// Feature 28: Hackathon Track & Sponsor Bounty Matcher
// ═══════════════════════════════════════════════════════════
router.post('/hackathon/sponsor-bounties/match', protect, (req, res) => {
  try {
    const result = sponsorBountyMatcherEngine.matchBounties(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { winningSolutionsRagEngine } = require('../hackathon-agent/winningSolutionsRagEngine');

// ═══════════════════════════════════════════════════════════
// Feature 30: Winning Hackathon Solutions RAG Vector Archive
// ═══════════════════════════════════════════════════════════
router.post('/hackathon/solutions/rag-search', protect, (req, res) => {
  try {
    const result = winningSolutionsRagEngine.searchWinningArchive(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { blindSpotRadarEngine } = require('./blindSpotRadarEngine');

// ═══════════════════════════════════════════════════════════
// Feature 32: Algorithm Blind-Spot Radar & Diagnostic Engine
// ═══════════════════════════════════════════════════════════
router.post('/blind-spots/analyze-radar', protect, (req, res) => {
  try {
    const result = blindSpotRadarEngine.analyzeBlindSpotRadar(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { demoScriptFallbackEngine } = require('../hackathon-agent/demoScriptFallbackEngine');

// ═══════════════════════════════════════════════════════════
// Feature 33: Stage Demo Click-Through Script & Fallback
// ═══════════════════════════════════════════════════════════
router.post('/hackathon/stage-demo/generate-script', protect, (req, res) => {
  try {
    const result = demoScriptFallbackEngine.generateDemoScript(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { peerMockRoomEngine } = require('./peerMockRoomEngine');

// ═══════════════════════════════════════════════════════════
// Feature 35: Peer Mock Interview Room & AI Auto-Takeover
// ═══════════════════════════════════════════════════════════
router.post('/peer-mock/create-room', protect, (req, res) => {
  try {
    const result = peerMockRoomEngine.createMockRoom(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/peer-mock/ai-takeover-trigger', protect, (req, res) => {
  try {
    const result = peerMockRoomEngine.triggerAiTakeover(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


const { lldScaffoldEngine } = require('./lldScaffoldEngine');

// ═══════════════════════════════════════════════════════════
// Feature 37: Low-Level System Design (LLD) Scaffold Engine
// ═══════════════════════════════════════════════════════════
router.post('/lld/generate-scaffold', protect, (req, res) => {
  try {
    const result = lldScaffoldEngine.generateScaffold(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { judgeObjectionEngine } = require('../hackathon-agent/judgeObjectionEngine');

// ═══════════════════════════════════════════════════════════
// Feature 38: Live Judge Q&A Objection & Counter-Defense
// ═══════════════════════════════════════════════════════════
router.post('/hackathon/judge-objections/generate-counter-defense', protect, (req, res) => {
  try {
    const result = judgeObjectionEngine.generateCounterDefense(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { aggregateMatrixEngine } = require('./aggregateMatrixEngine');

// ═══════════════════════════════════════════════════════════
// Feature 40: Multi-Round Aggregate Performance Matrix
// ═══════════════════════════════════════════════════════════
router.post('/mock-aggregate/calculate-matrix', protect, (req, res) => {
  try {
    const result = aggregateMatrixEngine.calculateAggregateMatrix(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { edgeCaseExplorerEngine } = require('./edgeCaseExplorerEngine');

// ═══════════════════════════════════════════════════════════
// Feature 42: LeetCode Edge Case Generator & Explorer Engine
// ═══════════════════════════════════════════════════════════
router.post('/code/generate-edge-cases', protect, (req, res) => {
  try {
    const result = edgeCaseExplorerEngine.generateEdgeCases(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { sponsorSdkQuickstartEngine } = require('../hackathon-agent/sponsorSdkQuickstartEngine');

// ═══════════════════════════════════════════════════════════
// Feature 43: Hackathon Sponsor SDK Quickstart Generator
// ═══════════════════════════════════════════════════════════
router.post('/hackathon/sdk-quickstart/generate', protect, (req, res) => {
  try {
    const result = sponsorSdkQuickstartEngine.generateQuickstart(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { codeMemoryLeakEngine } = require('./codeMemoryLeakEngine');

// ═══════════════════════════════════════════════════════════
// Feature 45: AST Code Flaw & Memory Leak Visualizer Engine
// ═══════════════════════════════════════════════════════════
router.post('/code/analyze-memory-leaks', protect, (req, res) => {
  try {
    const result = codeMemoryLeakEngine.analyzeMemoryLeaks(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { concurrencyDeadlockEngine } = require('./concurrencyDeadlockEngine');

// ═══════════════════════════════════════════════════════════
// Feature 47: Concurrency & Multi-Threading Deadlock Radar
// ═══════════════════════════════════════════════════════════
router.post('/concurrency/analyze-deadlock', protect, (req, res) => {
  try {
    const result = concurrencyDeadlockEngine.analyzeDeadlock(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { prototypeStressTestEngine } = require('../hackathon-agent/prototypeStressTestEngine');

// ═══════════════════════════════════════════════════════════
// Feature 48: Hackathon Prototype Stress-Tester & Video Engine
// ═══════════════════════════════════════════════════════════
router.post('/hackathon/prototype/stress-test', protect, (req, res) => {
  try {
    const result = prototypeStressTestEngine.runBenchmarkAndVideoCue(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { behavioralConflictEngine } = require('./behavioralConflictEngine');

// ═══════════════════════════════════════════════════════════
// Feature 50: FAANG Behavioral Conflict & Mediation Engine
// ═══════════════════════════════════════════════════════════
router.post('/behavioral/resolve-conflict', protect, (req, res) => {
  try {
    const result = behavioralConflictEngine.resolveConflict(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ═══════════════════════════════════════════════════════════
// Feature 52: SQL Query Optimizer & Index Tuning Engine
// ═══════════════════════════════════════════════════════════
router.post('/database/optimize-sql', protect, (req, res) => {
  try {
    const result = sqlOptimizerEngine.optimizeQuery(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { ipGovernanceEngine } = require('../hackathon-agent/ipGovernanceEngine');

// ═══════════════════════════════════════════════════════════
// Feature 53: Hackathon IP Governance & SAFE Note Engine
// ═══════════════════════════════════════════════════════════
router.post('/hackathon/governance/generate-ip-package', protect, (req, res) => {
  try {
    const result = ipGovernanceEngine.generateIpPackage(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { owaspSecurityScannerEngine } = require('./owaspSecurityScannerEngine');

// ═══════════════════════════════════════════════════════════
// Feature 55: OWASP Top 10 Security & SSRF / XSS Scanner Engine
// ═══════════════════════════════════════════════════════════
router.post('/security/scan-owasp-vulnerabilities', protect, (req, res) => {
  try {
    const result = owaspSecurityScannerEngine.scanCodeSnippet(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { judgeWhispererEngine } = require('../hackathon-agent/judgeWhispererEngine');

// ═══════════════════════════════════════════════════════════
// Feature 56: Hackathon Live Judge Voice Q&A Whisperer Engine
// ═══════════════════════════════════════════════════════════
router.post('/hackathon/judge/realtime-whisper', protect, (req, res) => {
  try {
    const result = judgeWhispererEngine.generateWhisper(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { rateLimiterVisualizerEngine } = require('./rateLimiterVisualizerEngine');

// ═══════════════════════════════════════════════════════════
// Feature 58: Rate Limiting & Sliding Window Token Bucket
// ═══════════════════════════════════════════════════════════
router.post('/system-design/simulate-rate-limiter', protect, (req, res) => {
  try {
    const result = rateLimiterVisualizerEngine.simulateLimiter(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { postMortemAnalyticsEngine } = require('../hackathon-agent/postMortemAnalyticsEngine');

// ═══════════════════════════════════════════════════════════
// Feature 59: Hackathon Post-Mortem Analytics & Moat Engine
// ═══════════════════════════════════════════════════════════
router.post('/hackathon/post-mortem/generate-analytics', protect, (req, res) => {
  try {
    const result = postMortemAnalyticsEngine.generatePostMortem(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { audioNoiseFilterEngine } = require('./audioNoiseFilterEngine');


// ═══════════════════════════════════════════════════════════
// Feature 62: WebAssembly Audio Noise Suppression & Pitch Jitter Compensator
// ═══════════════════════════════════════════════════════════
router.post('/audio/noise-filter-compensate', protect, (req, res) => {
  try {
    const result = audioNoiseFilterEngine.processAudioStream(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { pwaOfflineTeleprompterEngine } = require('../hackathon-agent/pwaOfflineTeleprompterEngine');

// ═══════════════════════════════════════════════════════════
// Feature 63: PWA Offline-First Pitch Teleprompter & Local Cache Sync Engine
// ═══════════════════════════════════════════════════════════
router.post('/hackathon/offline/generate-pwa-bundle', protect, (req, res) => {
  try {
    const result = pwaOfflineTeleprompterEngine.generateOfflineBundle(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { eventDrivenOutboxEngine } = require('./eventDrivenOutboxEngine');


// ═══════════════════════════════════════════════════════════
// Feature 65: Event-Driven Transactional Outbox & Idempotency Engine
// ═══════════════════════════════════════════════════════════
router.post('/system-design/simulate-transactional-outbox', protect, (req, res) => {
  try {
    const result = eventDrivenOutboxEngine.simulateOutboxRelay(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { pitchStoryboardEngine } = require('../hackathon-agent/pitchStoryboardEngine');

// ═══════════════════════════════════════════════════════════
// Feature 68: WebRTC Peer-to-Peer Mock Interview Mesh & AI Sentinel
// ═══════════════════════════════════════════════════════════
const peerInterviewMeshGateway = require('./peerInterviewMeshGateway');
router.post('/mesh/create-room', protect, (req, res) => {
  try {
    const { interviewerId, candidateId, interviewDomain, roundType } = req.body;
    const room = peerInterviewMeshGateway.createInterviewRoom(interviewerId || req.user.id, candidateId || 'CANDIDATE', interviewDomain, roundType);
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/mesh/ai-sentinel-probe', protect, (req, res) => {
  try {
    const { roomId, candidateAnswer } = req.body;
    const probe = peerInterviewMeshGateway.generateAISentinelProbe(roomId, candidateAnswer || '');
    res.json(probe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ═══════════════════════════════════════════════════════════
// Feature 69: Distributed CRDT Real-Time Collaborative Canvas
// ═══════════════════════════════════════════════════════════
const crdtCollaborativeCanvas = require('./crdtCollaborativeCanvas');
router.post('/crdt/apply-delta', protect, (req, res) => {
  try {
    const { roomId, newCode, clientClock } = req.body;
    const update = crdtCollaborativeCanvas.applyCodeDelta(roomId, req.user.id, newCode, clientClock);
    res.json(update);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ═══════════════════════════════════════════════════════════
// Feature 70: AI Adaptive Knowledge Prober & Deep-Dive Generator
// ═══════════════════════════════════════════════════════════
const aiAdaptiveKnowledgeProber = require('./aiAdaptiveKnowledgeProber');
router.post('/ai/adaptive-probe', protect, (req, res) => {
  try {
    const { topic, candidateAnswer } = req.body;
    const followUp = aiAdaptiveKnowledgeProber.generateAdaptiveFollowUp(topic || 'DISTRIBUTED_SYSTEMS', candidateAnswer || '');
    res.json(followUp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ═══════════════════════════════════════════════════════════
// Feature 71: Equity Tax & Compensation Arbitrage Engine
// ═══════════════════════════════════════════════════════════
const equityTaxArbitrageEngine = require('./equityTaxArbitrageEngine');
router.post('/compensation/evaluate-offer', protect, (req, res) => {
  try {
    const report = equityTaxArbitrageEngine.evaluateOfferPackage(req.body);
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ═══════════════════════════════════════════════════════════
// Feature 72: Hackathon Teammate Matching & Skill Synergy Engine
// ═══════════════════════════════════════════════════════════
const hackathonTeamSynergyEngine = require('./hackathonTeamSynergyEngine');
router.post('/hackathon/assemble-squad', protect, (req, res) => {
  try {
    const { hackerPool } = req.body;
    const squad = hackathonTeamSynergyEngine.assembleOptimalSquad(hackerPool || []);
    res.json(squad);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ═══════════════════════════════════════════════════════════
// Feature 73: Dynamic Squad Role AI Copilot & Split Chat
// ═══════════════════════════════════════════════════════════
const { squadChatEngine } = require('../hackathon-agent/squadChatEngine');
router.post('/hackathon/team/split-chat', protect, (req, res) => {
  try {
    const result = squadChatEngine.processMessage(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;















































































