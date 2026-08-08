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

module.exports = router;
