const express = require('express');
const { protect } = require('../../middleware/authMiddleware');
const { aiRateLimiter } = require('../../middleware/rateLimiter');
const { validate, schemas } = require('../../middleware/inputValidator');

const {
  getScrapedEvents,
  saveTeam,
  triggerAutoFill,
  mineStory,
  runSkillGapAnalysis,
  checkIdeaNovelty,
  addPortfolioProject,
  getPortfolioProjects
} = require('./agentController');

const { generateIdeas, refineIdeas } = require('./ideaGeneratorController');
const { generateProjectRoadmap, generateMemberGuide, memberGuideChat, generatePitchPlan } = require('./roadmapController');
const { generateProjectExplainer } = require('./explainerEngine');
const { runJudgeDefenseSim } = require('./judgeSimulatorController');
const ragService = require('./rag_service');
const notificationService = require('./notification_service');
const { searchAndRankHackathons } = require('./hackathonScraperEngine');
const { generatePitchDeckBlueprint } = require('./pitchDeckGenerator');

const router = express.Router();

// Apply protect middleware to ALL agent routes
router.use(protect);

router.post('/scrape', getScrapedEvents);
router.post('/save-team', saveTeam);
router.post('/auto-fill', triggerAutoFill);
router.post('/mine-story', aiRateLimiter, validate(schemas.mineStory), mineStory);
router.post('/skill-gap', runSkillGapAnalysis);
router.post('/novelty-check', aiRateLimiter, validate(schemas.noveltyCheck), checkIdeaNovelty);
router.post('/portfolio', addPortfolioProject);
router.get('/portfolio/:userId', getPortfolioProjects);

router.post('/generate-ideas', aiRateLimiter, validate(schemas.generateIdeas), generateIdeas);
router.post('/refine-ideas', aiRateLimiter, refineIdeas);
router.post('/project-roadmap', aiRateLimiter, validate(schemas.projectRoadmap), generateProjectRoadmap);
router.post('/member-guide', aiRateLimiter, generateMemberGuide);
router.post('/member-guide-chat', aiRateLimiter, memberGuideChat);
router.post('/pitch-planner', aiRateLimiter, generatePitchPlan);

router.post('/judge-explainer', aiRateLimiter, validate(schemas.judgeExplainer), async (req, res) => {
  try {
    const { projectTitle, techStack = [], projectDescription, targetTrack } = req.body;
    const explainer = await generateProjectExplainer({ projectTitle, techStack, projectDescription, targetTrack });
    res.json(explainer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/judge-defense-sim', aiRateLimiter, runJudgeDefenseSim);

router.post('/rag-search', async (req, res) => {
  try {
    const { query, limit } = req.body;
    const results = await ragService.retrieveHackathons(query, limit || 3);
    res.json({ results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/deadlines', (req, res) => {
  const alerts = notificationService.getDeadlineAlerts();
  res.json({ alerts });
});

router.post('/rank-hackathons', async (req, res) => {
  try {
    const results = await searchAndRankHackathons(req.body);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/pitch-deck', aiRateLimiter, async (req, res) => {
  try {
    const blueprint = await generatePitchDeckBlueprint(req.body);
    res.json(blueprint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ═══════════════════════════════════════════════════════════
// HACKATHON INCEPTION SUITE (Part 1: Poster, Ideas, Docs, Features)
// ═══════════════════════════════════════════════════════════
const { hackathonInceptionEngine } = require('./hackathonInceptionEngine');

router.post('/inception/scan-poster', (req, res) => {
  try {
    const result = hackathonInceptionEngine.scanPosterAndExtractTimeline(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { liveAiIdeaGenerator } = require('./liveAiIdeaGenerator');

router.post('/inception/winning-ideas', async (req, res) => {
  try {
    const result = await liveAiIdeaGenerator.generateDynamicWinningIdeas(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/inception/foundation-docs', (req, res) => {
  try {
    const result = hackathonInceptionEngine.generateSixFoundationDocs(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/inception/crazy-features', (req, res) => {
  try {
    const result = hackathonInceptionEngine.generateCrazyFeatures(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ═══════════════════════════════════════════════════════════
// HACKATHON INCEPTION SUITE (Part 2: One-Pager, Deep Build Guide)
// ═══════════════════════════════════════════════════════════
const { generateOnePager } = require('./onePagerGenerator');
const { generateDeepBuildGuide } = require('./deepBuildGuideGenerator');

router.post('/inception/one-pager', aiRateLimiter, generateOnePager);
router.post('/inception/deep-build-guide', aiRateLimiter, generateDeepBuildGuide);

// ═══════════════════════════════════════════════════════════
// HACKATHON LIVE ROOM SYNCHRONIZER (Dynamic Multi-Member State)
// ═══════════════════════════════════════════════════════════
const { hackathonRoomStore } = require('./hackathonRoomStore');

router.post('/room/create', (req, res) => {
  try {
    const result = hackathonRoomStore.createRoom(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/room/:roomId', (req, res) => {
  try {
    const room = hackathonRoomStore.getRoom(req.params.roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json({ success: true, room });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/room/:roomId/join', (req, res) => {
  try {
    const result = hackathonRoomStore.joinRoom(req.params.roomId, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/room/:roomId/reset', (req, res) => {
  try {
    const result = hackathonRoomStore.resetSquad(req.params.roomId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/room/:roomId/update-poster', (req, res) => {
  try {
    const result = hackathonRoomStore.updatePosterData(req.params.roomId, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/room/:roomId/lock-idea', (req, res) => {
  try {
    const { problemStatement, domain } = req.body;
    const result = hackathonRoomStore.lockProblemStatement(req.params.roomId, problemStatement, domain);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/room/:roomId/vote', (req, res) => {
  try {
    const { ideaId, memberId } = req.body;
    const result = hackathonRoomStore.castVote(req.params.roomId, ideaId, memberId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/room/:roomId/foundation-docs', (req, res) => {
  try {
    const result = hackathonRoomStore.getConnectedFoundationDocs(req.params.roomId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/room/:roomId/set-round', (req, res) => {
  try {
    const { roundKey } = req.body;
    const result = hackathonRoomStore.setRound(req.params.roomId, roundKey);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/room/:roomId/round-assets', (req, res) => {
  try {
    const { roundKey } = req.query;
    const result = hackathonRoomStore.getRoundSpecificAssets(req.params.roomId, roundKey);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;



