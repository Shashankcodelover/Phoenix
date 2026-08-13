const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/authMiddleware');
const { tokenBucketLimiter } = require('../../middleware/tokenBucketRateLimiter');

// Globally protect all horizon routes
router.use(protect);

// PU CS Module
const { getPuSyllabusGapAnalysis, getPuMonthByMonthRoadmap, getPuEntranceExamPrep, getPuBoardPyqs, getPuResources } = require('./cs-pu/puCurriculumEngine');

// Diploma CS Module
const { getDiplomaSyllabusGapAnalysis, getDiplomaRoadmap, getDcetPrepPlan, getDcetPyqs, getDiplomaResources, getLateralEntryGuide } = require('./cs-diploma/diplomaCurriculumEngine');

// Engineering CS Module
const { getEngSemesterGapAnalysis, getEngRoadmap, evaluatePlacementReadiness } = require('./cs-engineering/engCurriculumEngine');

// AI Guide Bot
const { processMessage } = require('./ai-guide-bot/guideBotEngine');

// Advanced Modules
const { submitMentorQuestion, getDispatchedQuestions } = require('./mentorWebhookRelay');
const { predictScholarshipEligibility } = require('./scholarshipEngine');
const { searchLearningResources } = require('./resourceSearchEngine');
const { evaluateCodeTypingIntegrity } = require('../interview-prep/reasoningIntegrityEngine');
const { scanCodeForVulnerabilities } = require('../security/sastSecurityScanner');

// ════════════════════════════════════════════════════
// PU CS ROUTES (/api/v1/horizon/cs-pu/*)
// ════════════════════════════════════════════════════
router.get('/cs-pu/gap-analysis', async (req, res) => {
  try { res.json(await getPuSyllabusGapAnalysis()); }
  catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

router.get('/cs-pu/roadmap', async (req, res) => {
  try { res.json(await getPuMonthByMonthRoadmap()); }
  catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

router.get('/cs-pu/entrance-exams', async (req, res) => {
  try { res.json(await getPuEntranceExamPrep(req.query.examKey)); }
  catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

router.get('/cs-pu/pyqs', async (req, res) => {
  try { res.json(await getPuBoardPyqs(req.query)); }
  catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

router.get('/cs-pu/resources', async (req, res) => {
  try { res.json(await getPuResources(req.query)); }
  catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ════════════════════════════════════════════════════
// DIPLOMA CS ROUTES (/api/v1/horizon/cs-diploma/*)
// ════════════════════════════════════════════════════
router.get('/cs-diploma/gap-analysis', async (req, res) => {
  try { res.json(await getDiplomaSyllabusGapAnalysis()); }
  catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

router.get('/cs-diploma/roadmap', async (req, res) => {
  try { res.json(await getDiplomaRoadmap()); }
  catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

router.get('/cs-diploma/dcet-prep', async (req, res) => {
  try { res.json(await getDcetPrepPlan()); }
  catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

router.get('/cs-diploma/pyqs', async (req, res) => {
  try { res.json(await getDcetPyqs(req.query)); }
  catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

router.get('/cs-diploma/resources', async (req, res) => {
  try { res.json(await getDiplomaResources(req.query)); }
  catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

router.get('/cs-diploma/lateral-entry', async (req, res) => {
  try { res.json(await getLateralEntryGuide()); }
  catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ════════════════════════════════════════════════════
// ENGINEERING CS ROUTES (/api/v1/horizon/cs-eng/*)
// ════════════════════════════════════════════════════
router.get('/cs-eng/gap-analysis', async (req, res) => {
  try { res.json(await getEngSemesterGapAnalysis(req.query.semester)); }
  catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

router.get('/cs-eng/roadmap', async (req, res) => {
  try { res.json(await getEngRoadmap()); }
  catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

router.post('/cs-eng/readiness', async (req, res) => {
  try { res.json(await evaluatePlacementReadiness(req.body)); }
  catch (e) { res.status(400).json({ success: false, error: e.message }); }
});

// ════════════════════════════════════════════════════
// AI GUIDE BOT & ADVANCED SERVICES (/api/v1/horizon/*)
// ════════════════════════════════════════════════════
router.post('/bot/chat', tokenBucketLimiter, async (req, res) => {
  try {
    const { message, userStage, currentPage } = req.body;
    const result = await processMessage({ message, userStage, currentPage });
    res.json(result);
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

router.post('/mentors/ask', async (req, res) => {
  try { res.json(await submitMentorQuestion(req.body)); }
  catch (e) { res.status(400).json({ success: false, error: e.message }); }
});

router.get('/mentors/questions', async (req, res) => {
  try { res.json(await getDispatchedQuestions(req.query)); }
  catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

router.post('/scholarships/predict', async (req, res) => {
  try { 
    const payload = { ...req.body, userId: req.user._id };
    res.json(await predictScholarshipEligibility(payload)); 
  }
  catch (e) { res.status(400).json({ success: false, error: e.message }); }
});

router.get('/resources/search', (req, res) => {
  try { res.json(searchLearningResources(req.query)); }
  catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

router.post('/integrity/evaluate', (req, res) => {
  try { res.json(evaluateCodeTypingIntegrity(req.body)); }
  catch (e) { res.status(400).json({ success: false, error: e.message }); }
});

const { kcetDcetRankEstimator } = require('./kcetDcetRankEstimator');

const { smartScholarshipMatcher } = require('./smartScholarshipMatcher');
const { mentorExchangeEngine } = require('./mentorExchangeEngine');
const { domainSkillQuizEngine } = require('./domainSkillQuizEngine');

// Feature V23-1: Smart Scholarship & Fee Waiver Matcher
router.post('/scholarships/match', (req, res) => {
  try {
    const result = smartScholarshipMatcher.matchScholarships(req.body);
    res.json(result);
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

// Feature V23-2: Alumni Mentor Match & AMA Thread
router.post('/mentors/match-advisor', (req, res) => {
  try {
    const { studentGoal } = req.body;
    const result = mentorExchangeEngine.matchMentor(studentGoal);
    res.json(result);
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

// Feature V23-3: Interactive Domain Readiness Quiz Generate & Evaluate
router.get('/domain-quiz/generate', (req, res) => {
  try {
    const { domainKey } = req.query;
    const result = domainSkillQuizEngine.generateAssessment(domainKey);
    res.json(result);
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

const { instantDiagnostic360 } = require('./instantDiagnostic360');

// Feature 1: Instant 360° Diagnostic & 10x Career Blueprint
router.post('/diagnostic/360-blueprint', (req, res) => {
  try {
    const result = instantDiagnostic360.evaluate360(req.body);
    res.json(result);
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

module.exports = router;



