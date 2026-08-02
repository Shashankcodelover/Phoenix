const express = require('express');
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

// V20: Hackathon Command Center controllers
const { generateIdeas, refineIdeas } = require('./ideaGeneratorController');
const { generateProjectRoadmap, generateMemberGuide, memberGuideChat, generatePitchPlan } = require('./roadmapController');
const { generateProjectExplainer } = require('./explainerEngine');

const router = express.Router();

const { validate, schemas } = require('../../middleware/inputValidator');

// Existing routes
router.post('/scrape', getScrapedEvents);
router.post('/save-team', saveTeam);
router.post('/auto-fill', triggerAutoFill);
router.post('/mine-story', mineStory);
router.post('/skill-gap', runSkillGapAnalysis);
router.post('/novelty-check', validate(schemas.noveltyCheck), checkIdeaNovelty);
router.post('/portfolio', addPortfolioProject);
router.get('/portfolio/:userId', getPortfolioProjects);

// V20: Hackathon Command Center routes
router.post('/generate-ideas', validate(schemas.generateIdeas), generateIdeas);
router.post('/refine-ideas', refineIdeas);
router.post('/project-roadmap', validate(schemas.projectRoadmap), generateProjectRoadmap);
router.post('/member-guide', generateMemberGuide);
router.post('/member-guide-chat', memberGuideChat);
router.post('/pitch-planner', generatePitchPlan);

// V22: Project Explainer & Judge Defense Blueprint
router.post('/judge-explainer', async (req, res) => {
  try {
    const { projectTitle, techStack = [], projectDescription, targetTrack } = req.body;
    const explainer = await generateProjectExplainer({ projectTitle, techStack, projectDescription, targetTrack });
    res.json(explainer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// V21: RAG & Deadline Notification routes
const ragService = require('./rag_service');
const notificationService = require('./notification_service');

router.post('/rag-search', (req, res) => {
  const { query, limit } = req.body;
  const results = ragService.retrieveHackathons(query, limit || 3);
  res.json({ results });
});

router.get('/deadlines', (req, res) => {
  const alerts = notificationService.getDeadlineAlerts();
  res.json({ alerts });
});

module.exports = router;
