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

router.post('/behavioral-pressure', validate(schemas.behavioralPressure), analyzeBehavioralPressureEndpoint);
router.post('/evaluate-latency', validate(schemas.latencyCircuit), evaluateLatencyCircuitBreakerEndpoint);

router.post('/generate-roadmap', validate(schemas.generateRoadmap), generateRoadmap);
router.post('/mock-interview', validate(schemas.mockInterview), mockInterview);
router.post('/tailor-resume', validate(schemas.tailorResume), tailorResume);
router.post('/resume-disrupt', validate(schemas.disruptResume), disruptResume);
router.post('/resume-diff', generateResumeDiff);
router.post('/quiz-submit', validate(schemas.quizSubmit), submitQuiz);
router.get('/questions', getQuestions);
router.get('/company-intelligence', getCompanyIntelligenceEndpoint);
router.get('/hackathon-winners', getHackathonWinnersEndpoint);
router.post('/peer-match', getPeerMatches);
router.post('/planner/allocate', validate(schemas.planner), allocatePlanner);
router.post('/revision', validate(schemas.revision), generateRevisionSheet);
router.post('/analyze-audio', analyzeAudio);
router.get('/performance-trend/:userId', getPerformanceTrend);
const { evaluateSpeechProsody } = require('./speechEvaluatorEngine');
const { createOrMatchPeerRoom, sendRoomHeartbeat, handlePeerSignalingOffer, handlePeerSignalingAnswer, handleIceCandidate } = require('./peerMatchEngine');
const { evaluateSystemDesign } = require('./systemDesignEvaluator');

router.post('/analyze-speech', (req, res) => {
  try {
    const { transcript, durationSeconds } = req.body;
    const evaluation = evaluateSpeechProsody(transcript, durationSeconds);
    res.json(evaluation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/peer-session', (req, res) => {
  try {
    const { action, user, roomId, userId } = req.body;
    if (action === 'heartbeat') {
      const result = sendRoomHeartbeat(roomId, userId);
      return res.json(result);
    }
    const result = createOrMatchPeerRoom(user);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/peer-signaling', (req, res) => {
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

router.post('/evaluate-architecture', (req, res) => {
  try {
    const evaluation = evaluateSystemDesign(req.body);
    res.json(evaluation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { synthesizeSTARStory } = require('./starStorySynthesizer');
const { getCompensationBenchmark } = require('./compBenchmarkingEngine');

router.post('/star-synthesize', (req, res) => {
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
