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

// Feature 21: Problem Statement Deconstructor & Idea Scoring Engine (Public)
const { ideaDeconstructorEngine } = require('./ideaDeconstructorEngine');

router.get('/deconstruct/presets', (req, res) => {
  res.json({ success: true, presets: ideaDeconstructorEngine.getPresets() });
});

router.post('/deconstruct/score', (req, res) => {
  try {
    const result = ideaDeconstructorEngine.deconstructAndScore(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Feature 22: Rapid Architecture & Full-Stack Tech Stack Scaffolder (Public)
const { stackScaffolderEngine } = require('./stackScaffolderEngine');

router.get('/scaffolder/presets', (req, res) => {
  res.json({ success: true, presets: stackScaffolderEngine.getPresets() });
});

router.post('/scaffolder/generate', (req, res) => {
  try {
    const result = stackScaffolderEngine.generateScaffold(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Feature 23: Sponsor API Bounty Auto-Integrator & Webhook Sandbox (Public)
const { sponsorSandboxEngine } = require('./sponsorSandboxEngine');

router.get('/bounties/catalog', (req, res) => {
  res.json({ success: true, bounties: sponsorSandboxEngine.getCatalog() });
});

router.post('/bounties/simulate', (req, res) => {
  try {
    const result = sponsorSandboxEngine.simulateCall(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/bounties/webhook-dispatch', (req, res) => {
  try {
    const result = sponsorSandboxEngine.dispatchWebhook(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Feature 24: 3-Minute VC Demo Pitch Deck Generator & Slide Structurer (Public)
const { vcPitchDeckEngine } = require('./vcPitchDeckEngine');

router.get('/pitch/presets', (req, res) => {
  res.json({ success: true, presets: vcPitchDeckEngine.getPresets() });
});

router.post('/pitch/generate-deck', (req, res) => {
  try {
    const result = vcPitchDeckEngine.generateDeck(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Feature 25: Live Demo Defense & Tough Judge Q&A Simulator (Public)
const { judgeDefenseEngine } = require('./judgeDefenseEngine');

router.get('/judge-sim/presets', (req, res) => {
  res.json({ success: true, ...judgeDefenseEngine.getPresets() });
});

router.post('/judge-sim/evaluate-round', (req, res) => {
  try {
    const result = judgeDefenseEngine.evaluateDefenseRound(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/judge-sim/verdict', (req, res) => {
  try {
    const result = judgeDefenseEngine.generateFinalVerdict(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Feature 26: Hackathon Team Synergy & Role Task Matrix Canvas (Public)
const { teamSynergyEngine } = require('./teamSynergyEngine');

router.get('/team-synergy/presets', (req, res) => {
  res.json({ success: true, ...teamSynergyEngine.getPresets() });
});

router.post('/team-synergy/evaluate', (req, res) => {
  try {
    const result = teamSynergyEngine.evaluateTeam(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/team-synergy/add-task', (req, res) => {
  try {
    const result = teamSynergyEngine.addTask(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Feature 27: Interactive Product Demo Sandbox & Embeddable Widget (Public)
const { demoSandboxEngine } = require('./demoSandboxEngine');

router.get('/demo-sandbox/presets', (req, res) => {
  res.json({ success: true, ...demoSandboxEngine.getPresets() });
});

router.post('/demo-sandbox/action', (req, res) => {
  try {
    const result = demoSandboxEngine.executeAction(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/demo-sandbox/embed', (req, res) => {
  try {
    const result = demoSandboxEngine.generateEmbedWidget(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Feature 28: Competitive Moat & Unfair Advantage Auditor (Public)
const { moatAuditorEngine } = require('./moatAuditorEngine');

router.get('/moat/benchmarks', (req, res) => {
  res.json({ success: true, ...moatAuditorEngine.getPresets() });
});

router.post('/moat/audit', (req, res) => {
  try {
    const result = moatAuditorEngine.auditMoat(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Feature 29: Technical Architecture Diagram & Flow Visualizer (Public)
const { archVisualizerEngine } = require('./archVisualizerEngine');

router.get('/arch/presets', (req, res) => {
  res.json({ success: true, ...archVisualizerEngine.getPresets() });
});

router.post('/arch/simulate-flow', (req, res) => {
  try {
    const result = archVisualizerEngine.simulateFlow(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Feature 30: Live Demo Video Script & Teleprompter Studio (Public)
const { demoScriptEngine } = require('./demoScriptEngine');

router.get('/demo-script/presets', (req, res) => {
  res.json({ success: true, ...demoScriptEngine.getPresets() });
});

router.post('/demo-script/timing', (req, res) => {
  try {
    const result = demoScriptEngine.calculateTiming(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Feature 31: Devpost Submission Markdown & Asset Packager (Public)
const { devpostSubmissionEngine } = require('./devpostSubmissionEngine');

router.get('/devpost/presets', (req, res) => {
  res.json({ success: true, presets: devpostSubmissionEngine.getPresets() });
});

router.post('/devpost/generate', (req, res) => {
  try {
    const result = devpostSubmissionEngine.generateDevpostSubmission(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/devpost/audit', (req, res) => {
  try {
    const result = devpostSubmissionEngine.auditCompliance(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Feature 32: Live Judge Rubric Scorer & Podium Predictor (Public)
const { judgeRubricPodiumEngine } = require('./judgeRubricPodiumEngine');

router.get('/podium/presets', (req, res) => {
  res.json({ success: true, presets: judgeRubricPodiumEngine.getPresets() });
});

router.post('/podium/predict', (req, res) => {
  try {
    const result = judgeRubricPodiumEngine.evaluateRubricAndPredictPodium(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Feature 33: Problem Validation & User Interview Generator (Public)
const { problemValidationEngine } = require('./problemValidationEngine');

router.get('/validation/presets', (req, res) => {
  res.json({ success: true, presets: problemValidationEngine.getPresets() });
});

router.post('/validation/generate', (req, res) => {
  try {
    const result = problemValidationEngine.generateValidationReport(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Feature 34: Unit Economics & Monetization Model Sandbox (Public)
const { unitEconomicsEngine } = require('./unitEconomicsEngine');

router.get('/economics/presets', (req, res) => {
  res.json({ success: true, presets: unitEconomicsEngine.getPresets() });
});

router.post('/economics/calculate', (req, res) => {
  try {
    const result = unitEconomicsEngine.calculateEconomics(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Feature 35: Codebase Security & Pre-Demo Vulnerability Sweeper (Public)
const { securitySweeperEngine } = require('./securitySweeperEngine');

router.get('/sweeper/presets', (req, res) => {
  res.json({ success: true, presets: securitySweeperEngine.getPresets() });
});

router.post('/sweeper/audit', (req, res) => {
  try {
    const result = securitySweeperEngine.sweepCodebase(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Feature 36: Real-Time Chaos & Network Failure Fallback Engine (Public)
const { demoDisasterRecoveryHub } = require('./demoDisasterRecoveryHub');

router.get('/chaos/presets', (req, res) => {
  res.json({ success: true, presets: demoDisasterRecoveryHub.getPresets() });
});

router.post('/chaos/simulate', (req, res) => {
  try {
    const result = demoDisasterRecoveryHub.simulateChaos(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Feature 37: Hackathon Hall of Fame & Winning Repo Decompiler (Public)
const { winningRepoDecompilerEngine } = require('./winningRepoDecompilerEngine');

router.get('/repo-decompile/presets', (req, res) => {
  res.json({ success: true, presets: winningRepoDecompilerEngine.getPresets() });
});

router.get('/repo-decompile/repo/:id', (req, res) => {
  try {
    const repo = winningRepoDecompilerEngine.getRepoDetails(req.params.id);
    res.json({ success: true, repo });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
});

router.post('/repo-decompile/decompile', (req, res) => {
  try {
    const { repoIdOrUrl, options } = req.body;
    const result = winningRepoDecompilerEngine.decompileRepo(repoIdOrUrl, options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/repo-decompile/compare', (req, res) => {
  try {
    const { repoId1, repoId2 } = req.body;
    const result = winningRepoDecompilerEngine.compareRepos(repoId1, repoId2);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Feature 38: Sponsor Bounty Value Maximizer & Multi-Track Solver (Public)
const { sponsorBountyMaximizerEngine } = require('./sponsorBountyMaximizerEngine');

router.get('/bounty/catalog', (req, res) => {
  res.json({ success: true, catalog: sponsorBountyMaximizerEngine.getCatalog() });
});

router.get('/bounty/presets', (req, res) => {
  res.json({ success: true, presets: sponsorBountyMaximizerEngine.getPresets() });
});

router.post('/bounty/solve', (req, res) => {
  try {
    const result = sponsorBountyMaximizerEngine.solveMaxBounties(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Feature 39: Post-Hackathon Investor Outreach & Seed Pitch Pack (Public)
const { investorOutreachEngine } = require('./investorOutreachEngine');

router.get('/investor/presets', (req, res) => {
  res.json({ success: true, presets: investorOutreachEngine.getPresets() });
});

router.post('/investor/generate', (req, res) => {
  try {
    const result = investorOutreachEngine.generatePitchPack(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Feature 40: Grand Champion Command Center & Trophy Vault (Public)
const { grandChampionTrophyEngine } = require('./grandChampionTrophyEngine');

router.get('/trophy/profile', (req, res) => {
  res.json({ success: true, profile: grandChampionTrophyEngine.getProfile(req.query.id) });
});

router.get('/trophy/verify/:id', (req, res) => {
  try {
    const result = grandChampionTrophyEngine.verifyTrophyProof(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
});

router.get('/trophy/embed', (req, res) => {
  res.json(grandChampionTrophyEngine.generateEmbedBadge(req.query.id));
});

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



