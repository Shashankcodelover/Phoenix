/**
 * Phoenix v2.0: Multi-Dimensional Scoring Engine
 * 
 * Inspired by The Hackathon Simulator's multi-axis scoring with judge weights.
 * Replaces flat XP with a nuanced 5-axis competency system plus
 * interviewer archetype scoring that personalizes feedback.
 * 
 * 5 Competency Axes:
 *   1. Technical Depth — DSA, OS, DBMS mastery
 *   2. System Thinking — Architecture, scalability
 *   3. Communication — STAR stories, filler word reduction
 *   4. Builder Score — Portfolio, hackathon projects
 *   5. Leadership — Teamwork, peer reviews, mentoring
 * 
 * 4 Interviewer Archetypes (like judge personalities):
 *   Each weights the 5 axes differently during evaluation.
 */

// --- Interviewer Archetypes ---
// Each archetype weights the 5 competency axes differently
const INTERVIEWER_ARCHETYPES = {
  'tech-deep': {
    id: 'tech-deep',
    name: 'The Deep Diver',
    description: 'Cares about algorithmic depth and optimization. Wants to see you think through edge cases.',
    avatar: '🔬',
    weights: {
      technicalDepth: 0.40,
      systemThinking: 0.25,
      communication: 0.10,
      builderScore: 0.15,
      leadership: 0.10
    }
  },
  'system-architect': {
    id: 'system-architect',
    name: 'The Architect',
    description: 'Focuses on scalability, design patterns, and trade-off reasoning.',
    avatar: '🏛️',
    weights: {
      technicalDepth: 0.20,
      systemThinking: 0.40,
      communication: 0.15,
      builderScore: 0.15,
      leadership: 0.10
    }
  },
  'bar-raiser': {
    id: 'bar-raiser',
    name: 'The Bar Raiser',
    description: 'Evaluates holistically. Cares about leadership, culture fit, and communication as much as tech skills.',
    avatar: '📊',
    weights: {
      technicalDepth: 0.20,
      systemThinking: 0.15,
      communication: 0.25,
      builderScore: 0.15,
      leadership: 0.25
    }
  },
  'product-builder': {
    id: 'product-builder',
    name: 'The Builder',
    description: 'Wants to see what you\'ve shipped. Hackathon wins, GitHub contributions, and real-world impact matter most.',
    avatar: '🛠️',
    weights: {
      technicalDepth: 0.15,
      systemThinking: 0.15,
      communication: 0.15,
      builderScore: 0.40,
      leadership: 0.15
    }
  }
};

// --- Synergy Bonuses ---
// When multiple axes are above a threshold, grant bonus points
const SYNERGY_RULES = [
  {
    name: 'Full Stack Mind',
    description: 'Technical Depth + System Thinking both above 60',
    condition: (scores) => scores.technicalDepth >= 60 && scores.systemThinking >= 60,
    bonus: 5
  },
  {
    name: 'Storyteller Engineer',
    description: 'Communication + Builder Score both above 50',
    condition: (scores) => scores.communication >= 50 && scores.builderScore >= 50,
    bonus: 7
  },
  {
    name: 'Team Captain',
    description: 'Leadership + Communication both above 60',
    condition: (scores) => scores.leadership >= 60 && scores.communication >= 60,
    bonus: 5
  },
  {
    name: 'The Complete Package',
    description: 'All 5 axes above 50',
    condition: (scores) => Object.values(scores).every(v => v >= 50),
    bonus: 15
  },
  {
    name: 'Hackathon Champion',
    description: 'Builder Score above 80 and Leadership above 40',
    condition: (scores) => scores.builderScore >= 80 && scores.leadership >= 40,
    bonus: 8
  }
];

// --- Grade Thresholds ---
const GRADE_THRESHOLDS = [
  { min: 95, grade: 'S+', label: 'Exceptional — Would hire instantly', color: '#FFD700' },
  { min: 85, grade: 'A', label: 'Strong Hire — Clear and confident', color: '#4CAF50' },
  { min: 75, grade: 'B+', label: 'Hire — Above average with minor gaps', color: '#8BC34A' },
  { min: 65, grade: 'B', label: 'Lean Hire — Solid but needs refinement', color: '#FFC107' },
  { min: 55, grade: 'C+', label: 'Borderline — Needs more practice', color: '#FF9800' },
  { min: 45, grade: 'C', label: 'No Hire — Significant gaps in prep', color: '#FF5722' },
  { min: 0,  grade: 'D', label: 'Not Ready — Needs fundamental work', color: '#F44336' }
];

/**
 * Calculates a weighted score based on an interviewer archetype.
 * 
 * @param {Object} competencyScores - { technicalDepth, systemThinking, communication, builderScore, leadership }
 * @param {string} archetypeId - The interviewer archetype to use for weighting
 * @returns {Object} { weightedScore, grade, synergies, breakdown }
 */
function calculateWeightedScore(competencyScores, archetypeId = 'bar-raiser') {
  const archetype = INTERVIEWER_ARCHETYPES[archetypeId] || INTERVIEWER_ARCHETYPES['bar-raiser'];

  // Calculate base weighted score
  let weightedScore = 0;
  const breakdown = {};

  for (const [axis, weight] of Object.entries(archetype.weights)) {
    const score = competencyScores[axis] || 0;
    const contribution = score * weight;
    breakdown[axis] = {
      raw: score,
      weight: weight,
      contribution: Math.round(contribution * 10) / 10
    };
    weightedScore += contribution;
  }

  // Apply synergy bonuses
  const activeSynergies = [];
  for (const rule of SYNERGY_RULES) {
    if (rule.condition(competencyScores)) {
      weightedScore += rule.bonus;
      activeSynergies.push({ name: rule.name, description: rule.description, bonus: rule.bonus });
    }
  }

  // Clamp to 0-100
  weightedScore = Math.max(0, Math.min(100, Math.round(weightedScore)));

  // Determine grade
  const gradeEntry = GRADE_THRESHOLDS.find(g => weightedScore >= g.min) || GRADE_THRESHOLDS[GRADE_THRESHOLDS.length - 1];

  return {
    weightedScore,
    grade: gradeEntry.grade,
    gradeLabel: gradeEntry.label,
    gradeColor: gradeEntry.color,
    archetype: {
      id: archetype.id,
      name: archetype.name,
      description: archetype.description,
      avatar: archetype.avatar
    },
    synergies: activeSynergies,
    totalSynergyBonus: activeSynergies.reduce((sum, s) => sum + s.bonus, 0),
    breakdown
  };
}

/**
 * Maps user actions to competency score increments.
 * Called after each user action to update their 5-axis radar.
 * 
 * @param {string} actionType - The type of action performed
 * @param {Object} actionData - Additional context about the action
 * @returns {Object} Score increments for each axis
 */
function getScoreIncrements(actionType, actionData = {}) {
  const increments = {
    technicalDepth: 0,
    systemThinking: 0,
    communication: 0,
    builderScore: 0,
    leadership: 0
  };

  switch (actionType) {
    case 'quiz_submit':
      increments.technicalDepth = (actionData.score >= 80) ? 5 : 3;
      break;

    case 'mock_interview':
      increments.communication = (actionData.fillerCount <= 2) ? 7 : 4;
      increments.technicalDepth = 2;
      break;

    case 'system_design':
      increments.systemThinking = 8;
      increments.technicalDepth = 3;
      break;

    case 'tailor_resume':
      increments.communication = 4;
      increments.builderScore = 2;
      break;

    case 'hackathon_submit':
      increments.builderScore = 10;
      increments.leadership = 3;
      break;

    case 'story_mined':
      increments.communication = 5;
      increments.builderScore = 5;
      break;

    case 'peer_mock':
      increments.communication = 4;
      increments.leadership = 6;
      break;

    case 'team_formed':
      increments.leadership = 5;
      increments.builderScore = 2;
      break;

    case 'war_room_session':
      increments.leadership = 4;
      increments.builderScore = 3;
      break;

    case 'roadmap_completed':
      increments.technicalDepth = 5;
      increments.systemThinking = 3;
      break;

    case 'chaos_survived':
      increments.communication = 3;
      increments.technicalDepth = 2;
      break;

    default:
      increments.technicalDepth = 1;
      break;
  }

  return increments;
}

/**
 * Converts the existing skillRadar format to competency scores.
 * Bridges old system → new multi-axis system.
 */
function skillRadarToCompetency(skillRadar, user) {
  return {
    technicalDepth: Math.round(
      ((skillRadar.dsa || 10) * 0.4) +
      ((skillRadar.os || 10) * 0.2) +
      ((skillRadar.dbms || 10) * 0.2) +
      ((skillRadar.cn || 10) * 0.2)
    ),
    systemThinking: skillRadar.systemDesign || 10,
    communication: Math.min(100, Math.max(10, 50 - (user.burnoutRisk || 0) / 2 + (user.streak || 0))),
    builderScore: Math.min(100, ((user.portfolioProjects || []).length * 15) + 10),
    leadership: Math.min(100, ((user.teamMembers || []).length * 10) + (user.streak || 0) + 10)
  };
}

module.exports = {
  INTERVIEWER_ARCHETYPES,
  SYNERGY_RULES,
  GRADE_THRESHOLDS,
  calculateWeightedScore,
  getScoreIncrements,
  skillRadarToCompetency
};
