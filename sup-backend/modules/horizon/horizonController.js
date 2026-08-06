const { evaluateStudentDiagnostic } = require('./diagnosticEngine');
const { getExamNotifications } = require('./examRadarEngine');
const { getPyqQuestions, evaluateMockExam } = require('./pyqDatabase');
const { getSeniorMentors } = require('./mentorshipEngine');

/**
 * Horizon Controller
 */
const horizonController = {
  // POST /api/v1/horizon/diagnostic
  submitDiagnostic: async (req, res) => {
    try {
      const { academicStage, interestSector, primaryGoal } = req.body;
      const result = evaluateStudentDiagnostic({ academicStage, interestSector, primaryGoal });
      return res.status(200).json(result);
    } catch (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
  },

  // GET /api/v1/horizon/exams
  getExams: async (req, res) => {
    try {
      const { stage, examKey } = req.query;
      const result = getExamNotifications({ stage, examKey });
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  // GET /api/v1/horizon/pyqs
  getPyqs: async (req, res) => {
    try {
      const { examKey, subject, difficulty, limit } = req.query;
      const result = getPyqQuestions({ examKey, subject, difficulty, limit: limit ? parseInt(limit) : 10 });
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  // POST /api/v1/horizon/pyq/evaluate
  evaluatePyqMock: async (req, res) => {
    try {
      const { examKey, answers } = req.body;
      const result = evaluateMockExam({ examKey, answers });
      return res.status(200).json(result);
    } catch (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
  },

  // GET /api/v1/horizon/mentors
  getMentors: async (req, res) => {
    try {
      const { world } = req.query;
      const result = getSeniorMentors({ world });
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },
};

module.exports = horizonController;
