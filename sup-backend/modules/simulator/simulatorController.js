/**
 * Hackathon Game Simulator Controller
 * Orchestrates turn-based game sessions, teammate voting, chaos events, and judging.
 */

const { evaluateCrewVote } = require('./personalityEngine');
const { triggerRandomChaos } = require('./chaosEngine');
const { calculateScores } = require('./scoringEngine');
const { generateJudgeRoast } = require('./judgeEngine');

// @desc    Start a new Hackathon Simulation Session
// @route   POST /api/v1/simulator/start
const startSession = async (req, res) => {
  try {
    const { title, difficulty = 'medium', track = 'AI/ML' } = req.body;

    const session = {
      sessionId: `SIM-${Date.now()}`,
      title: title || 'Autonomous Code Agent',
      difficulty,
      track,
      stage: 'teamFormation',
      createdAt: new Date().toISOString()
    };

    res.json({ message: 'Simulation session initialized.', session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Initiate Crew Vote on tech stack and USP
// @route   POST /api/v1/simulator/vote
const crewVote = async (req, res) => {
  try {
    const { techStack = [], usp = '', features = [] } = req.body;
    const voteResult = evaluateCrewVote({ techStack, usp, features });
    res.json(voteResult);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Trigger Random Chaos Event
// @route   GET /api/v1/simulator/chaos
const triggerChaos = async (req, res) => {
  try {
    const chaosEvent = triggerRandomChaos();
    res.json(chaosEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit Final Pitch for Judge Evaluation & Roast
// @route   POST /api/v1/simulator/evaluate
const evaluateSimulation = async (req, res) => {
  try {
    const {
      title = 'EcoTrack AI',
      difficulty = 'medium',
      techStack = ['React', 'Node.js', 'PostgreSQL'],
      usp = 'AI autonomous carbon credit calculator',
      features = ['Dashboard', 'AI Model', 'Export'],
      slideCount = 5,
      teamBonus = 10,
      judgeId = 'vc_investor'
    } = req.body;

    const scores = calculateScores({ difficulty, techStack, features, slideCount, teamBonus, judgeId });

    const roast = await generateJudgeRoast(
      judgeId,
      { title, techStack: techStack.join(', '), usp, features: features.join(', ') },
      scores
    );

    res.json({
      title,
      scores,
      judgeRoast: roast
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  startSession,
  crewVote,
  triggerChaos,
  evaluateSimulation
};
