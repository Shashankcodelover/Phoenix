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

  // POST /api/v1/horizon/bot/chat (Zero-Quota Resilient)
  botChat: async (req, res) => {
    try {
      const { message, userStage, currentPage } = req.body;
      const { processMessage } = require('./ai-guide-bot/guideBotEngine');
      const result = await processMessage({ message, userStage, currentPage });
      return res.status(200).json(result);
    } catch (err) {
      // Even in a catastrophic catch, never return 500 error to student
      const { findSemanticResponse } = require('./ai-guide-bot/horizonSemanticKnowledge');
      const fallback = findSemanticResponse(req.body ? req.body.message : '', req.body ? req.body.userStage : '2nd_pu');
      return res.status(200).json(fallback);
    }
  },

  // POST /api/v1/horizon/session/log (2-3 Hour Daily Learning Session Tracker)
  logSession: async (req, res) => {
    try {
      const { sessionMinutes, currentCycle, exercisesCompleted, xpEarned } = req.body;
      const targetDailyMinutes = 180; // 3 hours goal
      const remainingMinutes = Math.max(0, targetDailyMinutes - (sessionMinutes || 0));
      
      return res.status(200).json({
        success: true,
        sessionMinutes: sessionMinutes || 0,
        targetDailyMinutes,
        remainingMinutes,
        percentComplete: Math.min(100, Math.round(((sessionMinutes || 0) / targetDailyMinutes) * 100)),
        currentCycle: currentCycle || 'Cycle 1: Web Foundations',
        exercisesCompleted: exercisesCompleted || 0,
        xpEarned: xpEarned || 0,
        message: sessionMinutes >= 120 ? '🔥 Incredible dedication! You are in the top 5% of persistent engineers today.' : 'Keep pushing forward! Consistent 2-3 hour daily practice creates placement masters.'
      });
    } catch (err) {
      return res.status(200).json({ success: true, sessionMinutes: 0 });
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

  // ─── DAY 2: REGIONAL ENTRANCE & VTU ENGINEERING BRIDGES ───────────────
  // GET /api/v1/horizon/dcet/bridge
  getDcetBridge: async (req, res) => {
    try {
      const { diplomaMathBridgeEngine } = require('./diplomaMathBridgeEngine');
      return res.status(200).json(diplomaMathBridgeEngine.getBridgeCurriculum());
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  // POST /api/v1/horizon/dcet/bridge/evaluate
  evaluateDcetBridge: async (req, res) => {
    try {
      const { diplomaMathBridgeEngine } = require('./diplomaMathBridgeEngine');
      return res.status(200).json(diplomaMathBridgeEngine.evaluateBridgeDiagnostic(req.body));
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  // GET /api/v1/horizon/colleges/cutoffs
  getCollegeTrends: async (req, res) => {
    try {
      const { collegeCutoffExplorerEngine } = require('./collegeCutoffExplorerEngine');
      return res.status(200).json(collegeCutoffExplorerEngine.getCutoffTrends(req.query.collegeCode));
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  // POST /api/v1/horizon/colleges/chances
  predictCollegeChances: async (req, res) => {
    try {
      const { collegeCutoffExplorerEngine } = require('./collegeCutoffExplorerEngine');
      return res.status(200).json(collegeCutoffExplorerEngine.predictAdmissionChances(req.body));
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  // POST /api/v1/horizon/scholarships/evaluate
  evaluateScholarship: async (req, res) => {
    try {
      const { predictScholarshipEligibility } = require('./scholarshipEngine');
      const payload = {
        userId: (req.user && req.user._id) ? req.user._id : 'guest_student',
        academicStage: req.body.academicStage || '2nd_pu',
        familyIncomeLakhs: req.body.familyIncomeLakhs || 4.5,
        entranceRank: req.body.entranceRank || 6500,
        isFemale: req.body.isFemale || false
      };
      return res.status(200).json(predictScholarshipEligibility(payload));
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  // POST /api/v1/horizon/karnataka/371j
  evaluateArticle371J: async (req, res) => {
    try {
      const { article371JEngine } = require('./article371JEngine');
      return res.status(200).json(article371JEngine.evaluateEligibility(req.body));
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },
};

module.exports = horizonController;
