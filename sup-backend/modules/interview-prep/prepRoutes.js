const express = require('express');
const {
  generateRoadmap,
  mockInterview,
  tailorResume,
  disruptResume,
  submitQuiz,
  getQuestions,
  getPeerMatches,
  allocatePlanner,
  generateRevisionSheet,
  analyzeAudio,
  getPerformanceTrend,
  generateSystemDesignQuestion
} = require('./prepController');

const router = express.Router();

router.post('/generate-roadmap', generateRoadmap);
router.post('/mock-interview', mockInterview);
router.post('/tailor-resume', tailorResume);
router.post('/resume-disrupt', disruptResume);
router.post('/quiz-submit', submitQuiz);
router.get('/questions', getQuestions);
router.post('/peer-match', getPeerMatches);
router.post('/planner/allocate', allocatePlanner);
router.post('/revision', generateRevisionSheet);
router.post('/analyze-audio', analyzeAudio);
router.get('/performance-trend/:userId', getPerformanceTrend);
router.post('/system-design', generateSystemDesignQuestion);

module.exports = router;
