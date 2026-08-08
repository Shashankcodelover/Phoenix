const { evaluateStudentDiagnostic } = require('./diagnosticEngine');
const { getExamNotifications } = require('./examRadarEngine');
const { getPyqQuestions, evaluateMockExam } = require('./pyqDatabase');
const { getSeniorMentors } = require('./mentorshipEngine');
const { getRoadmap, listRoadmaps } = require('./roadmapEngine');
const { generateDailyChecklist, generateMonthlyMilestones } = require('./checklistEngine');
const { getResources } = require('./resourceRepository');
const { exploreDomainByStage } = require('./domainExplorer');
const { getGapGuide, listGapGuides } = require('./gapGuideEngine');

/**
 * Horizon Controller
 */
const horizonController = {
  // POST /api/v1/horizon/diagnostic
  submitDiagnostic: async (req, res) => {
    try {
      const { academicStage, interests, primaryGoal } = req.body;
      
      let userId = req.user ? req.user._id : null;
      let result;
      if (userId) {
        result = await evaluateStudentDiagnostic(userId, { academicStage, interests, primaryGoal });
      } else {
        // Guest mode - don't save to DB
        const { matchWorld, WORLD_MAP } = require('./diagnosticEngine');
        const matchedWorld = matchWorld(interests);
        const worldDetails = WORLD_MAP[matchedWorld];
        result = {
          success: true,
          matchedWorld: matchedWorld,
          worldName: worldDetails.name,
          worldDescription: worldDetails.description,
          recommendedDomains: worldDetails.domains,
          startingPhase: 'Phase 1: Foundation',
          message: 'Diagnostic complete. (Guest mode)',
          redirectionUrl: `/horizon/world-dashboard.html?world=${matchedWorld}&stage=${academicStage}`
        };
      }
      return res.status(200).json(result);
    } catch (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
  },

  // GET /api/v1/horizon/exams
  getExams: async (req, res) => {
    try {
      const { sector, examKey } = req.query;
      const result = await getExamNotifications({ sector, examKey });
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  // GET /api/v1/horizon/pyqs
  getPyqs: async (req, res) => {
    try {
      const { examKey, subject, difficulty, limit } = req.query;
      const result = await getPyqQuestions({ examKey, subject, difficulty, limit: limit ? parseInt(limit) : 10 });
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  // POST /api/v1/horizon/pyq/evaluate
  evaluatePyqMock: async (req, res) => {
    try {
      const { examKey, answers } = req.body;
      const result = await evaluateMockExam({ examKey, answers });
      return res.status(200).json(result);
    } catch (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
  },

  // GET /api/v1/horizon/mentors
  getMentors: async (req, res) => {
    try {
      const { world } = req.query;
      const result = await getSeniorMentors({ world });
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  // POST /api/v1/horizon/bot/chat
  botChat: async (req, res) => {
    try {
      const { message, userStage, currentPage } = req.body;
      let reply = "I'm your Phoenix Guide. Try asking about your roadmap or exam prep.";
      let focusElements = [];
      
      const lower = message.toLowerCase();
      if (lower.includes('roadmap')) {
        reply = "Here is your phased roadmap! It breaks down your journey from Zero-to-One foundation all the way to placement.";
        focusElements.push({ selector: '#roadmapCard' });
      } else if (lower.includes('kcet') || lower.includes('exam')) {
        reply = "I've highlighted your Exam Radar. Keep an eye on those registration dates!";
        focusElements.push({ selector: '#examCard' });
      } else if (lower.includes('checklist')) {
        reply = "Complete these daily actions to earn XP and level up your career foundation.";
        focusElements.push({ selector: '#checklistCard' });
      }

      return res.status(200).json({
        success: true,
        botReply: reply,
        focusElements
      });
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

  // GET /api/v1/horizon/guides
  getGapGuidesList: async (req, res) => {
    try {
      const { world } = req.query;
      const result = listGapGuides({ world });
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  // GET /api/v1/horizon/guides/:domainKey
  getGapGuideByKey: async (req, res) => {
    try {
      const result = getGapGuide(req.params.domainKey);
      if (!result.success) return res.status(404).json(result);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },
};

module.exports = horizonController;
