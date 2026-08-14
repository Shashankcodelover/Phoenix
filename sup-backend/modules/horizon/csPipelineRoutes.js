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
const { karnatakaRankMatrixEngine } = require('./karnatakaRankMatrixEngine');

// Feature 1: Instant 360° Diagnostic & 10x Career Blueprint
router.post('/diagnostic/360-blueprint', (req, res) => {
  try {
    const result = instantDiagnostic360.evaluate360(req.body);
    res.json(result);
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

// Feature 8: Karnataka KCET & DCET Rank Matrix & Seat Forecaster
router.post('/rank/karnataka-matrix', (req, res) => {
  try {
    const result = karnatakaRankMatrixEngine.forecastRankAndColleges(req.body);
    res.json(result);
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

const { mentorDispatchHub } = require('./mentorDispatchHub');

// Feature 10: Verified Alumni Mentor Direct Dispatch & Guidance Hub
router.get('/mentors/directory', (req, res) => {
  try {
    const result = mentorDispatchHub.getMentorDirectory();
    res.json(result);
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

router.post('/mentors/dispatch-question', (req, res) => {
  try {
    const result = mentorDispatchHub.dispatchQuestion(req.body);
    res.json(result);
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

const { regionalVoiceCoachEngine } = require('./regionalVoiceCoachEngine');

// Feature 15: Regional Language Voice & Guidance Coach (Kannada & Hindi)
router.post('/vernacular/guidance', (req, res) => {
  try {
    const result = regionalVoiceCoachEngine.processVernacularGuidance(req.body);
    res.json(result);
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

const { choiceFillingSimulatorEngine } = require('./choiceFillingSimulatorEngine');

// Feature 21: KCET & DCET Choice Filling Option-Entry Simulator
router.post('/option-entry/simulate-allotment', (req, res) => {
  try {
    const result = choiceFillingSimulatorEngine.simulateSeatAllotment(req.body);
    res.json(result);
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

const { collegeCutoffExplorerEngine } = require('./collegeCutoffExplorerEngine');

// Feature 25: 5-Year Karnataka College Cutoff Explorer & Trend Forecaster
router.get('/colleges/cutoff-trends', (req, res) => {
  try {
    const result = collegeCutoffExplorerEngine.getCutoffTrends(req.query.collegeCode);
    res.json(result);
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

router.post('/colleges/predict-admission-chances', (req, res) => {
  try {
    const result = collegeCutoffExplorerEngine.predictAdmissionChances(req.body);
    res.json(result);
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

const { snqFeeWaiverEngine } = require('./snqFeeWaiverEngine');

// Feature 26: Supernumerary Quota (SNQ) & Tuition Fee Waiver Matcher
router.post('/snq/evaluate-eligibility', (req, res) => {
  try {
    const result = snqFeeWaiverEngine.evaluateSnqEligibility(req.body);
    res.json(result);
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

const { diplomaMathBridgeEngine } = require('./diplomaMathBridgeEngine');

// Feature 29: Polytechnic Diploma Lateral Entry 14-Day Math Bridge
router.get('/diploma/math-bridge-curriculum', (req, res) => {
  try {
    const result = diplomaMathBridgeEngine.getBridgeCurriculum();
    res.json(result);
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

router.post('/diploma/math-bridge-evaluate', (req, res) => {
  try {
    const result = diplomaMathBridgeEngine.evaluateBridgeDiagnostic(req.body);
    res.json(result);
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

const { branchSuitabilityEngine } = require('./branchSuitabilityEngine');

// Feature 31: Branch Suitability AI Diagnostic (CSE vs ISE vs AIML vs ECE)
router.post('/branch/suitability-diagnostic', (req, res) => {
  try {
    const result = branchSuitabilityEngine.evaluateBranchSuitability(req.body);
    res.json(result);
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

const { scholarshipMatcherEngine } = require('./scholarshipMatcherEngine');

// Feature 34: Karnataka State Scholarship (SSP / NSP) Matcher
router.post('/scholarships/match-eligibility', (req, res) => {
  try {
    const result = scholarshipMatcherEngine.matchScholarships(req.body);
    res.json(result);
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

const { managementQuotaFeeEngine } = require('./managementQuotaFeeEngine');

// Feature 36: Management Quota Fee & 4-Year COA Forecaster
router.post('/management-quota/calculate-fees', (req, res) => {
  try {
    const result = managementQuotaFeeEngine.calculateCostOfAttendance(req.body);
    res.json(result);
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

const { vtuCgpaCalculatorEngine } = require('./vtuCgpaCalculatorEngine');

// Feature 39: VTU CBCS CGPA to Percentage & Eligibility Converter
router.post('/vtu/cgpa-converter', (req, res) => {
  try {
    const result = vtuCgpaCalculatorEngine.convertCgpa(req.body);
    res.json(result);
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

const { karnatakaReservationEngine } = require('./karnatakaReservationEngine');

// Feature 41: Karnataka Rural & Kannada Medium Reservation Engine
router.post('/reservations/evaluate-quota', (req, res) => {
  try {
    const result = karnatakaReservationEngine.evaluateQuotaEligibility(req.body);
    res.json(result);
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

const { campusHostelCommuteEngine } = require('./campusHostelCommuteEngine');

// Feature 44: Karnataka Campus Hostel, Mess & Commute Intelligence
router.post('/campus-life/hostel-commute-intel', (req, res) => {
  try {
    const result = campusHostelCommuteEngine.getHostelCommuteProfile(req.body);
    res.json(result);
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

const { firstGenGraduateEngine } = require('./firstGenGraduateEngine');

// Feature 46: First-Generation Graduate Toolkit & Fee Concession
router.post('/first-gen/evaluate-concession', (req, res) => {
  try {
    const result = firstGenGraduateEngine.evaluateFirstGenProfile(req.body);
    res.json(result);
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

const { autonomousAffiliationEngine } = require('./autonomousAffiliationEngine');

// Feature 49: Autonomous vs Affiliated Academic Freedom Matrix
router.post('/colleges/autonomous-freedom-matrix', (req, res) => {
  try {
    const result = autonomousAffiliationEngine.evaluateAcademicFreedom(req.body);
    res.json(result);
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

const { karnatakaStudyCertificateEngine } = require('./karnatakaStudyCertificateEngine');

// Feature 51: Karnataka Study Certificate 7-Year Continuous Validator
router.post('/verification/validate-study-certificate', (req, res) => {
  try {
    const result = karnatakaStudyCertificateEngine.validateStudyHistory(req.body);
    res.json(result);
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

const { article371JEngine } = require('./article371JEngine');

// Feature 54: Article 371(J) Kalyana-Karnataka Reservation Quota
router.post('/reservations/article-371j-quota', (req, res) => {
  try {
    const result = article371JEngine.evaluateEligibility(req.body);
    res.json(result);
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

const { sportsQuotaEngine } = require('./sportsQuotaEngine');

// Feature 57: Karnataka Engineering Sports, Cultural & NCC Quota
router.post('/reservations/sports-cultural-quota', (req, res) => {
  try {
    const result = sportsQuotaEngine.evaluateQuota(req.body);
    res.json(result);
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

module.exports = router;







































