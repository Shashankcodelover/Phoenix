/**
 * Phoenix v2.0: Interview Simulation Engine Controller
 * 
 * A full end-to-end interview simulation that walks students through
 * 8 stages of a realistic technical interview — from company selection
 * to final verdict. Think of it like a video game, but for interviews.
 * 
 * The 8-Stage Interview Pipeline:
 *   1. company_select   — Choose a company and see their interview pattern
 *   2. resume_review    — AI reviewer scans your resume and flags weaknesses
 *   3. behavioral       — STAR-format behavioral questions
 *   4. technical        — Live coding problem with timer
 *   5. system_design    — Architecture challenge
 *   6. bar_raiser       — Difficulty scales based on your performance
 *   7. team_fit         — Culture-fit questions specific to the company
 *   8. verdict          — Detailed scorecard with improvement suggestions
 */

const { callAIForFeature, parseAIJson } = require('../../config/aiProvider');
const { selectChaosEvent, resolveChaosChoice } = require('../interview-prep/chaosEvents');

const { calculateWeightedScore, INTERVIEWER_ARCHETYPES } = require('../gamification/scoringEngine');

// --- Company Interview Profiles ---
const COMPANY_PROFILES = {
  google: {
    name: 'Google',
    logo: '🔵',
    interviewStyle: 'Highly structured, focuses on algorithmic depth and system design. Uses the "Googleyness" culture fit check.',
    stages: ['behavioral', 'technical', 'system_design', 'bar_raiser', 'team_fit'],
    archetypeWeights: 'tech-deep',
    focusAreas: ['Algorithms', 'Data Structures', 'System Design', 'Googleyness'],
    difficultyMultiplier: 1.3
  },
  amazon: {
    name: 'Amazon',
    logo: '📦',
    interviewStyle: 'Leadership Principles focused. Every answer should reference an LP. Heavy on behavioral + system design.',
    stages: ['behavioral', 'behavioral', 'technical', 'system_design', 'bar_raiser'],
    archetypeWeights: 'bar-raiser',
    focusAreas: ['Leadership Principles', 'System Design', 'Ownership', 'Customer Obsession'],
    difficultyMultiplier: 1.2
  },
  meta: {
    name: 'Meta',
    logo: '🔷',
    interviewStyle: 'Fast-paced coding rounds with emphasis on optimal solutions. System design focuses on social scale.',
    stages: ['technical', 'technical', 'system_design', 'behavioral', 'team_fit'],
    archetypeWeights: 'tech-deep',
    focusAreas: ['Coding Speed', 'Optimal Solutions', 'Social Systems', 'Move Fast'],
    difficultyMultiplier: 1.25
  },
  microsoft: {
    name: 'Microsoft',
    logo: '🟦',
    interviewStyle: 'Well-rounded. Tests coding, design, and behavioral equally. Collaborative coding rounds.',
    stages: ['behavioral', 'technical', 'system_design', 'team_fit', 'bar_raiser'],
    archetypeWeights: 'system-architect',
    focusAreas: ['Balanced Skills', 'Collaboration', 'Cloud Architecture', 'Growth Mindset'],
    difficultyMultiplier: 1.1
  },
  startup: {
    name: 'Fast-Growing Startup',
    logo: '🚀',
    interviewStyle: 'Practical and project-based. Cares about what you\'ve shipped. Less algorithm-heavy, more builder-focused.',
    stages: ['behavioral', 'technical', 'team_fit'],
    archetypeWeights: 'product-builder',
    focusAreas: ['Shipping Speed', 'Full-Stack Skills', 'Culture Fit', 'Portfolio'],
    difficultyMultiplier: 0.9
  }
};

// --- Simulation State Management ---
// In production, this would be in Redis or MongoDB sessions
const activeSessions = new Map();

/**
 * Start a new interview simulation.
 * @route POST /api/v1/interview-sim/start
 */
const startSimulation = async (req, res) => {
  try {
    const { userId, company = 'google', difficulty = 'medium' } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required.' });
    }

    const profile = COMPANY_PROFILES[company] || COMPANY_PROFILES.google;

    const session = {
      sessionId: `sim_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      userId,
      company,
      profile,
      difficulty,
      currentStageIndex: 0,
      stages: ['company_select', 'resume_review', ...profile.stages, 'verdict'],
      scores: {
        technicalDepth: 30,
        systemThinking: 30,
        communication: 30,
        builderScore: 30,
        leadership: 30
      },
      chaosEventsTriggered: [],
      stageHistory: [],
      startedAt: new Date(),
      isActive: true
    };

    activeSessions.set(session.sessionId, session);

    res.json({
      sessionId: session.sessionId,
      company: {
        name: profile.name,
        logo: profile.logo,
        interviewStyle: profile.interviewStyle,
        focusAreas: profile.focusAreas
      },
      totalStages: session.stages.length,
      currentStage: session.stages[0],
      message: `Welcome to your ${profile.name} interview simulation! Let's begin.`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Advance to the next stage of the simulation.
 * @route POST /api/v1/interview-sim/advance
 */
const advanceStage = async (req, res) => {
  try {
    const { sessionId, response = '' } = req.body;

    const session = activeSessions.get(sessionId);
    if (!session || !session.isActive) {
      return res.status(404).json({ message: 'Simulation session not found or expired.' });
    }

    const currentStage = session.stages[session.currentStageIndex];

    // Process the current stage response and generate AI feedback
    let stageResult;
    try {
      stageResult = await processStage(session, currentStage, response);
    } catch (err) {
      stageResult = {
        feedback: 'Your response has been noted. Let\'s move on.',
        scoreAdjustments: {},
        question: null
      };
    }

    // Apply score adjustments
    for (const [axis, delta] of Object.entries(stageResult.scoreAdjustments || {})) {
      if (session.scores[axis] !== undefined) {
        session.scores[axis] = Math.max(0, Math.min(100, session.scores[axis] + delta));
      }
    }

    // Record stage result
    session.stageHistory.push({
      stage: currentStage,
      response: response.substring(0, 500),
      feedback: stageResult.feedback,
      scoreAdjustments: stageResult.scoreAdjustments
    });

    // Check for chaos event between stages (25% chance)
    let chaosEvent = null;
    if (session.currentStageIndex > 1 && session.currentStageIndex < session.stages.length - 1) {
      chaosEvent = selectChaosEvent(session.chaosEventsTriggered, 0.25);
      if (chaosEvent) {
        session.chaosEventsTriggered.push(chaosEvent.id);
      }
    }

    // Advance to next stage
    session.currentStageIndex++;

    // Check if simulation is complete
    if (session.currentStageIndex >= session.stages.length) {
      session.isActive = false;
      const verdict = calculateWeightedScore(session.scores, session.profile.archetypeWeights);

      return res.json({
        status: 'completed',
        currentStage: 'verdict',
        feedback: stageResult.feedback,
        verdict: {
          ...verdict,
          company: session.profile.name,
          duration: Math.round((Date.now() - new Date(session.startedAt).getTime()) / 60000),
          stageHistory: session.stageHistory,
          chaosEventsHandled: session.chaosEventsTriggered.length,
          competencyScores: session.scores
        }
      });
    }

    const nextStage = session.stages[session.currentStageIndex];

    // Generate next stage's question
    let nextQuestion;
    try {
      nextQuestion = await generateStageQuestion(session, nextStage);
    } catch (err) {
      nextQuestion = getStaticQuestion(nextStage, session.company);
    }

    res.json({
      status: 'in_progress',
      currentStage: nextStage,
      stageNumber: session.currentStageIndex + 1,
      totalStages: session.stages.length,
      feedback: stageResult.feedback,
      question: nextQuestion,
      chaosEvent,
      currentScores: session.scores
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Resolve a chaos event choice during simulation.
 * @route POST /api/v1/interview-sim/chaos-resolve
 */
const resolveChaos = (req, res) => {
  try {
    const { sessionId, eventId, choiceIndex } = req.body;

    const session = activeSessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found.' });
    }

    const result = resolveChaosChoice(eventId, choiceIndex);
    if (!result) {
      return res.status(400).json({ message: 'Invalid event or choice.' });
    }

    // Apply chaos effects to scores
    for (const [axis, delta] of Object.entries(result.effect || {})) {
      if (session.scores[axis] !== undefined) {
        session.scores[axis] = Math.max(0, Math.min(100, session.scores[axis] + delta));
      }
    }

    res.json({
      resolved: true,
      eventName: result.eventName,
      chosenAction: result.chosenAction,
      feedback: result.feedback,
      effects: result.effect,
      updatedScores: session.scores
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get available companies for simulation.
 * @route GET /api/v1/interview-sim/companies
 */
const getCompanies = (req, res) => {
  const companies = Object.entries(COMPANY_PROFILES).map(([key, profile]) => ({
    id: key,
    name: profile.name,
    logo: profile.logo,
    interviewStyle: profile.interviewStyle,
    focusAreas: profile.focusAreas,
    totalStages: profile.stages.length + 2 // +2 for company_select and verdict
  }));
  res.json(companies);
};

/**
 * Get current session status.
 * @route GET /api/v1/interview-sim/status/:sessionId
 */
const getSessionStatus = (req, res) => {
  const session = activeSessions.get(req.params.sessionId);
  if (!session) {
    return res.status(404).json({ message: 'Session not found.' });
  }

  res.json({
    sessionId: session.sessionId,
    company: session.profile.name,
    currentStage: session.stages[session.currentStageIndex],
    stageNumber: session.currentStageIndex + 1,
    totalStages: session.stages.length,
    isActive: session.isActive,
    scores: session.scores,
    chaosEventsHandled: session.chaosEventsTriggered.length,
    duration: Math.round((Date.now() - new Date(session.startedAt).getTime()) / 60000)
  });
};

// --- Internal Stage Processing ---

async function processStage(session, stage, response) {
  if (!response || response.trim().length === 0) {
    return {
      feedback: 'No response recorded for this stage.',
      scoreAdjustments: { communication: -3 }
    };
  }

  const company = session.profile.name;
  const difficulty = session.difficulty;

  const prompt = `You are a ${company} interviewer conducting a ${stage.replace('_', ' ')} round (${difficulty} difficulty).
The candidate responded: "${response.substring(0, 2000)}"

Evaluate this response and provide:
1. A brief 2-3 sentence feedback
2. Score adjustments for these axes (use numbers between -10 and +10):
   - technicalDepth
   - systemThinking
   - communication
   - builderScore
   - leadership

Return strict JSON with keys: "feedback" (string), "scoreAdjustments" (object with the 5 axes).`;

  const result = await callAIForFeature(
    'analytical',
    prompt,
    `You are a strict but fair ${company} interviewer. Return JSON only.`,
    true,
    JSON.stringify({
      feedback: 'Your response has been noted. You showed some good thinking but could improve clarity.',
      scoreAdjustments: { technicalDepth: 2, communication: 1, systemThinking: 0, builderScore: 0, leadership: 0 }
    })
  );

  try {
    return parseAIJson(result.text);
  } catch (e) {
    return {
      feedback: 'Your response has been noted.',
      scoreAdjustments: { communication: 2 }
    };
  }
}

async function generateStageQuestion(session, stage) {
  const company = session.profile.name;
  const stageLabel = stage.replace('_', ' ');

  const prompt = `Generate a realistic ${company} interview question for the "${stageLabel}" round.
Difficulty: ${session.difficulty}
Company focus areas: ${session.profile.focusAreas.join(', ')}

Return a JSON object with: "question" (string), "hint" (string), "timeLimit" (number in seconds).`;

  const result = await callAIForFeature(
    'structured',
    prompt,
    'You are a professional interview question generator. Return JSON only.',
    true,
    JSON.stringify(getStaticQuestion(stage, session.company))
  );

  try {
    return parseAIJson(result.text);
  } catch (e) {
    return getStaticQuestion(stage, session.company);
  }
}

function getStaticQuestion(stage, company) {
  const staticQuestions = {
    resume_review: { question: 'Tell me about yourself and walk me through your resume.', hint: 'Focus on your most impactful experiences. Use a chronological narrative.', timeLimit: 180 },
    behavioral: { question: 'Tell me about a time you had to deal with a difficult teammate during a project.', hint: 'Use the STAR format: Situation, Task, Action, Result.', timeLimit: 300 },
    technical: { question: 'Given an array of integers, find two numbers that add up to a target sum. Explain your approach and optimize.', hint: 'Consider the time-space tradeoff between brute force and hash map approaches.', timeLimit: 600 },
    system_design: { question: 'Design a URL shortener like bit.ly that can handle millions of requests per day.', hint: 'Think about hashing, database choice, caching, and read/write patterns.', timeLimit: 900 },
    bar_raiser: { question: 'If you could redesign any software system you\'ve worked on, what would you change and why?', hint: 'Show depth of thinking about trade-offs and lessons learned.', timeLimit: 600 },
    team_fit: { question: 'What kind of engineering culture do you thrive in, and how do you handle disagreements about technical decisions?', hint: 'Be honest and specific. Use real examples.', timeLimit: 300 }
  };
  return staticQuestions[stage] || staticQuestions.behavioral;
}

// Cleanup inactive sessions every 30 minutes
setInterval(() => {
  const thirtyMinAgo = Date.now() - (30 * 60 * 1000);
  for (const [id, session] of activeSessions.entries()) {
    if (new Date(session.startedAt).getTime() < thirtyMinAgo && !session.isActive) {
      activeSessions.delete(id);
    }
  }
}, 30 * 60 * 1000);

module.exports = {
  startSimulation,
  advanceStage,
  resolveChaos,
  getCompanies,
  getSessionStatus,
  COMPANY_PROFILES
};
