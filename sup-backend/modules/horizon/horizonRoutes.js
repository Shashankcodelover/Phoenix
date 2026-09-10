const express = require('express');
const router = express.Router();
const horizonController = require('./horizonController');
const { validate, schemas } = require('../../middleware/inputValidator');
const { protect, protectOptional } = require('../../middleware/authMiddleware');

// Diagnostic onboarding assessment
router.post('/diagnostic', protectOptional, validate(schemas.horizonDiagnostic), horizonController.submitDiagnostic);

// Multi-Sector Domain Roadmaps
router.get('/roadmaps', horizonController.getRoadmapsList);
router.get('/roadmaps/:domainKey', horizonController.getRoadmapByKey);

// Daily & Monthly Action Checklists
router.get('/checklists/daily', horizonController.getDailyChecklist);
router.get('/checklists/milestones', horizonController.getMonthlyMilestones);

// Verified Resource & Link Repository
router.get('/resources', horizonController.getResourcesList);

// Entrance Exam Radar alerts (KCET, DCET, NEET, CA, JEE)
router.get('/exams', protectOptional, validate(schemas.horizonExamQuery), horizonController.getExams);

// PYQ Question Bank & Search
router.get('/pyqs', protectOptional, horizonController.getPyqs);

// Timed Mock Exam Submission & Evaluator
router.post('/pyq/evaluate', protectOptional, validate(schemas.horizonPyqSubmit), horizonController.evaluatePyqMock);

// Senior Alumni Mentorship Bridge
router.get('/mentors', protectOptional, horizonController.getMentors);

// Stage-Based Domain Explorer ("What's out there at my stage?")
router.get('/explorer/:stageKey', horizonController.getStageExplorer);

// A-to-Z Gap & Pathway Guides
router.get('/guides', horizonController.getGapGuidesList);
router.get('/guides/:domainKey', horizonController.getGapGuideByKey);

// AI Bot Chat (world-dashboard)
router.post('/bot/chat', protectOptional, horizonController.botChat);

// Daily 2-3 Hour Learning Session Tracker
router.post('/session/log', protectOptional, horizonController.logSession);

// DAY 2: Regional Karnataka Entrance & VTU Engineering Bridges
router.get('/dcet/bridge', protectOptional, horizonController.getDcetBridge);
router.post('/dcet/bridge/evaluate', protectOptional, horizonController.evaluateDcetBridge);
router.get('/colleges/cutoffs', protectOptional, horizonController.getCollegeTrends);
router.post('/colleges/chances', protectOptional, horizonController.predictCollegeChances);
router.post('/scholarships/evaluate', protectOptional, horizonController.evaluateScholarship);
router.post('/karnataka/371j', protectOptional, horizonController.evaluateArticle371J);

// Feature 41: Multi-Stream Admissions & Cutoff Predictor (Public/Optional Auth)
const { multiStreamAdmissionsEngine } = require('./multiStreamAdmissionsEngine');

router.get('/admissions/streams', (req, res) => {
  res.json(multiStreamAdmissionsEngine.getStreamsAndQuotas());
});

router.get('/admissions/colleges', (req, res) => {
  res.json(multiStreamAdmissionsEngine.getColleges(req.query.stream));
});

router.post('/admissions/predict', (req, res) => {
  try {
    const result = multiStreamAdmissionsEngine.predictAdmissions(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
