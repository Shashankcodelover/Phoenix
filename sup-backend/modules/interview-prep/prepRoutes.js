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

const { protect } = require('../../middleware/authMiddleware');

router.post('/behavioral-pressure', protect, validate(schemas.behavioralPressure), analyzeBehavioralPressureEndpoint);
router.post('/evaluate-latency', protect, validate(schemas.latencyCircuit), evaluateLatencyCircuitBreakerEndpoint);

router.post('/generate-roadmap', protect, validate(schemas.generateRoadmap), generateRoadmap);
router.post('/mock-interview', protect, validate(schemas.mockInterview), mockInterview);
router.post('/tailor-resume', protect, validate(schemas.tailorResume), tailorResume);
router.post('/resume-disrupt', protect, validate(schemas.disruptResume), disruptResume);
router.post('/resume-diff', protect, generateResumeDiff);
router.post('/quiz-submit', protect, validate(schemas.quizSubmit), submitQuiz);
router.get('/questions', protect, getQuestions);
router.get('/company-intelligence', protect, getCompanyIntelligenceEndpoint);
router.get('/hackathon-winners', protect, getHackathonWinnersEndpoint);
router.post('/peer-match', protect, getPeerMatches);
router.post('/planner/allocate', protect, validate(schemas.planner), allocatePlanner);
router.post('/revision', protect, validate(schemas.revision), generateRevisionSheet);
router.post('/analyze-audio', protect, analyzeAudio);
router.get('/performance-trend/:userId', protect, getPerformanceTrend);
const { evaluateSpeechProsody } = require('./speechEvaluatorEngine');
const { createOrMatchPeerRoom, sendRoomHeartbeat, handlePeerSignalingOffer, handlePeerSignalingAnswer, handleIceCandidate } = require('./peerMatchEngine');
const { evaluateSystemDesign } = require('./systemDesignEvaluator');

router.post('/analyze-speech', protect, (req, res) => {
  try {
    const { transcript, durationSeconds } = req.body;
    const evaluation = evaluateSpeechProsody(transcript, durationSeconds);
    res.json(evaluation);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

const { synthesizeSTARStory } = require('./starStorySynthesizer');
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

// Feature V19-4: Item Response Theory (IRT) Adaptive Ability Update
router.post('/adaptive/update-ability', protect, (req, res) => {
  try {
    const { currentTheta, isCorrect, itemParams } = req.body;
    const result = defaultIrtEngine.updateAbility(currentTheta, isCorrect, itemParams);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;


