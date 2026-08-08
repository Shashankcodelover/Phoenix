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

router.post('/comp-benchmark', (req, res) => {
  try {
    const result = getCompensationBenchmark(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
