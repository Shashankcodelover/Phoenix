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
  generateSystemDesignQuestion
} = require('./prepController');

const { validate, schemas } = require('../../middleware/inputValidator');

const router = express.Router();

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
router.post('/system-design', validate(schemas.systemDesign), generateSystemDesignQuestion);

module.exports = router;
