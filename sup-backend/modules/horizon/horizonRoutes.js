const express = require('express');
const router = express.Router();
const horizonController = require('./horizonController');
const { validate, schemas } = require('../../middleware/inputValidator');

// Diagnostic onboarding assessment
router.post('/diagnostic', validate(schemas.horizonDiagnostic), horizonController.submitDiagnostic);

// Entrance Exam Radar alerts (KCET, DCET, NEET, CA, JEE)
router.get('/exams', horizonController.getExams);

// PYQ Question Bank & Search
router.get('/pyqs', horizonController.getPyqs);

// Timed Mock Exam Submission & Evaluator
router.post('/pyq/evaluate', validate(schemas.horizonPyqSubmit), horizonController.evaluatePyqMock);

// Senior Alumni Mentorship Bridge
router.get('/mentors', horizonController.getMentors);

module.exports = router;
