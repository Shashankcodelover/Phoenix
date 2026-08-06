const { evaluateStudentDiagnostic } = require('./diagnosticEngine');
const { getExamNotifications } = require('./examRadarEngine');
const { getPyqQuestions, evaluateMockExam } = require('./pyqDatabase');
const { getSeniorMentors } = require('./mentorshipEngine');
const { getRoadmap, listRoadmaps } = require('./roadmapEngine');
const { generateDailyChecklist, generateMonthlyMilestones } = require('./checklistEngine');
const { getResources } = require('./resourceRepository');
const { exploreDomainByStage } = require('./domainExplorer');

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

  // GET /api/v1/horizon/roadmaps
  getRoadmapsList: async (req, res) => {
    try {
      const { world, stage } = req.query;
      const result = listRoadmaps({ world, stage });
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  // GET /api/v1/horizon/roadmaps/:domainKey
  getRoadmapByKey: async (req, res) => {
    try {
      const result = getRoadmap(req.params.domainKey);
      if (!result.success) return res.status(404).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  // GET /api/v1/horizon/checklists/daily
  getDailyChecklist: async (req, res) => {
    try {
      const { domainKey, phaseId, dayOfMonth } = req.query;
      const result = generateDailyChecklist({
        domainKey: domainKey || 'fullstack_web',
        phaseId: parseInt(phaseId) || 1,
        dayOfMonth: parseInt(dayOfMonth) || 1,
      });
      if (!result.success) return res.status(404).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  // GET /api/v1/horizon/checklists/milestones
  getMonthlyMilestones: async (req, res) => {
    try {
      const { domainKey, phaseId } = req.query;
      const result = generateMonthlyMilestones({
        domainKey: domainKey || 'fullstack_web',
        phaseId: parseInt(phaseId) || 1,
      });
      if (!result.success) return res.status(404).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  // GET /api/v1/horizon/resources
  getResourcesList: async (req, res) => {
    try {
      const { domainKey, phase, freeOnly } = req.query;
      const result = getResources({
        domainKey: domainKey || 'fullstack_web',
        phase: phase ? parseInt(phase) : null,
        freeOnly: freeOnly === 'true',
      });
      if (!result.success) return res.status(404).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  // GET /api/v1/horizon/explorer/:stageKey
  getStageExplorer: async (req, res) => {
    try {
      const result = exploreDomainByStage(req.params.stageKey);
      if (!result.success) return res.status(404).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },
};

module.exports = horizonController;
