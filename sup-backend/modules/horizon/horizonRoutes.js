const express = require('express');
const router = express.Router();
const horizonController = require('./horizonController');
const { validate, schemas } = require('../../middleware/inputValidator');

// Diagnostic onboarding assessment
router.post('/diagnostic', validate(schemas.horizonDiagnostic), horizonController.submitDiagnostic);

// Multi-Sector Domain Roadmaps
router.get('/roadmaps', horizonController.getRoadmapsList);
router.get('/roadmaps/:domainKey', horizonController.getRoadmapByKey);

// Daily & Monthly Action Checklists
router.get('/checklists/daily', horizonController.getDailyChecklist);
router.get('/checklists/milestones', horizonController.getMonthlyMilestones);

// Verified Resource & Link Repository
router.get('/resources', horizonController.getResourcesList);

// Entrance Exam Radar alerts (KCET, DCET, NEET, CA, JEE)
router.get('/exams', horizonController.getExams);

// PYQ Question Bank & Search
router.get('/pyqs', horizonController.getPyqs);

// Timed Mock Exam Submission & Evaluator
router.post('/pyq/evaluate', validate(schemas.horizonPyqSubmit), horizonController.evaluatePyqMock);

// Senior Alumni Mentorship Bridge
router.get('/mentors', horizonController.getMentors);

// Stage-Based Domain Explorer ("What's out there at my stage?")
router.get('/explorer/:stageKey', horizonController.getStageExplorer);

module.exports = router;
