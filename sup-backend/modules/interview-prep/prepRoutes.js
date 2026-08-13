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

// Feature V21-2: Collaborative Code Canvas Join / Init
router.post('/code-canvas/join', protect, (req, res) => {
  try {
    const { roomId = `room_${Date.now()}`, language, problemStatement, initialCode } = req.body;
    const result = collaborativeCodeCanvas.createOrJoinRoom(roomId, { language, problemStatement, initialCode, userId: req.user?.id || 'candidate' });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Feature V21-3: Collaborative Code Canvas Update & AST Linting
router.post('/code-canvas/update', protect, (req, res) => {
  try {
    const { roomId, update } = req.body;
    const result = collaborativeCodeCanvas.applyCodeUpdate(roomId, { ...update, userId: req.user?.id });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
const { starStoryMatrixEngine } = require('./starStoryMatrixEngine');
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

router.post('/whiteboard/simulate-chaos', protect, (req, res) => {
  try {
    const result = liveWhiteboardSimulator.simulateChaos(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;








