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
router.get('/exams', protect, validate(schemas.horizonExamQuery), horizonController.getExams);

// PYQ Question Bank & Search
router.get('/pyqs', protect, horizonController.getPyqs);

// Timed Mock Exam Submission & Evaluator
router.post('/pyq/evaluate', protect, validate(schemas.horizonPyqSubmit), horizonController.evaluatePyqMock);

// Senior Alumni Mentorship Bridge
router.get('/mentors', protect, horizonController.getMentors);

// Stage-Based Domain Explorer ("What's out there at my stage?")
router.get('/explorer/:stageKey', horizonController.getStageExplorer);

// A-to-Z Gap & Pathway Guides
router.get('/guides', horizonController.getGapGuidesList);
router.get('/guides/:domainKey', horizonController.getGapGuideByKey);

// AI Bot Chat (world-dashboard)
router.post('/bot/chat', protectOptional, horizonController.botChat);

module.exports = router;
