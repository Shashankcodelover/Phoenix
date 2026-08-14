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

const { compensationNegotiatorEngine } = require('./compensationNegotiatorEngine');

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

const { starStoryRefinerEngine } = require('./starStoryRefinerEngine');

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

const { sqlOptimizerEngine } = require('./sqlOptimizerEngine');

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
// Feature 66: AI Pitch Video Storyboard & WebVTT Subtitle Generator
// ═══════════════════════════════════════════════════════════
router.post('/hackathon/video/generate-pitch-storyboard', protect, (req, res) => {
  try {
    const result = pitchStoryboardEngine.generateStoryboard(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;












































































