/**
 * Phoenix v2.0: Achievement & Badge System
 * 
 * Inspired by The Hackathon Simulator's 13 milestones + Codewars belts.
 * Defines achievements, checks trigger conditions, and awards badges.
 * 
 * Each achievement has:
 *   - id: Unique identifier
 *   - name: Display name
 *   - description: How to earn it
 *   - icon: Emoji icon
 *   - rarity: Common / Uncommon / Rare / Epic / Legendary
 *   - condition: Function that checks if the user qualifies
 *   - xpBonus: Extra XP awarded when unlocked
 */

// --- Achievement Definitions ---
const ACHIEVEMENTS = [
  // === Getting Started (Common) ===
  {
    id: 'first_flame',
    name: 'First Flame',
    description: 'Complete your first mock interview session.',
    icon: '🔥',
    rarity: 'Common',
    xpBonus: 25,
    condition: (user, action) => action.type === 'mock_interview' && !user.badges.includes('first_flame')
  },
  {
    id: 'roadmap_pioneer',
    name: 'Roadmap Pioneer',
    description: 'Generate your first study roadmap.',
    icon: '🗺️',
    rarity: 'Common',
    xpBonus: 25,
    condition: (user, action) => action.type === 'generate_roadmap' && !user.badges.includes('roadmap_pioneer')
  },
  {
    id: 'profile_complete',
    name: 'Identity Forged',
    description: 'Fill out all profile fields (bio, skills, github, portfolio).',
    icon: '🪪',
    rarity: 'Common',
    xpBonus: 30,
    condition: (user) => {
      return user.bio && user.skills.length > 0 && user.github && user.portfolio
        && !user.badges.includes('profile_complete');
    }
  },

  // === Practice Makes Perfect (Uncommon) ===
  {
    id: 'quiz_streak_5',
    name: 'On a Roll',
    description: 'Maintain a 5-day activity streak.',
    icon: '🔁',
    rarity: 'Uncommon',
    xpBonus: 50,
    condition: (user) => user.streak >= 5 && !user.badges.includes('quiz_streak_5')
  },
  {
    id: 'team_player',
    name: 'Team Player',
    description: 'Join 3 hackathon teams on the platform.',
    icon: '🤝',
    rarity: 'Uncommon',
    xpBonus: 50,
    condition: (user, action) => action.type === 'join_team' && action.totalTeams >= 3
      && !user.badges.includes('team_player')
  },
  {
    id: 'sniper',
    name: 'Sniper',
    description: 'Score 90%+ on a DSA quiz.',
    icon: '🎯',
    rarity: 'Uncommon',
    xpBonus: 75,
    condition: (user, action) => action.type === 'quiz_submit' && action.score >= 90
      && !user.badges.includes('sniper')
  },

  // === Mastery (Rare) ===
  {
    id: 'architect',
    name: 'The Architect',
    description: 'Complete 5 system design challenges.',
    icon: '🏗️',
    rarity: 'Rare',
    xpBonus: 100,
    condition: (user, action) => action.type === 'system_design' && action.totalDesigns >= 5
      && !user.badges.includes('architect')
  },
  {
    id: 'streak_warrior',
    name: 'Streak Warrior',
    description: 'Maintain a 15-day activity streak.',
    icon: '⚔️',
    rarity: 'Rare',
    xpBonus: 100,
    condition: (user) => user.streak >= 15 && !user.badges.includes('streak_warrior')
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete cramming mode in under 3 days.',
    icon: '⚡',
    rarity: 'Rare',
    xpBonus: 100,
    condition: (user, action) => action.type === 'cramming_complete' && action.daysUsed <= 3
      && !user.badges.includes('speed_demon')
  },
  {
    id: 'resume_master',
    name: 'Resume Master',
    description: 'Tailor your resume for 5 different job descriptions.',
    icon: '📄',
    rarity: 'Rare',
    xpBonus: 100,
    condition: (user, action) => action.type === 'tailor_resume' && action.totalResumes >= 5
      && !user.badges.includes('resume_master')
  },

  // === Excellence (Epic) ===
  {
    id: 'silver_tongue',
    name: 'Silver Tongue',
    description: 'Complete a mock interview with zero filler words.',
    icon: '🗣️',
    rarity: 'Epic',
    xpBonus: 150,
    condition: (user, action) => action.type === 'mock_interview' && action.fillerCount === 0
      && !user.badges.includes('silver_tongue')
  },
  {
    id: 'bridge_builder',
    name: 'Bridge Builder',
    description: 'Generate STAR stories from 3 different hackathon projects.',
    icon: '🌉',
    rarity: 'Epic',
    xpBonus: 150,
    condition: (user, action) => action.type === 'story_mined' && action.totalStories >= 3
      && !user.badges.includes('bridge_builder')
  },
  {
    id: 'chaos_survivor',
    name: 'Chaos Survivor',
    description: 'Successfully handle 10 chaos events in mock interviews.',
    icon: '🌀',
    rarity: 'Epic',
    xpBonus: 150,
    condition: (user, action) => action.type === 'chaos_survived' && action.totalChaos >= 10
      && !user.badges.includes('chaos_survivor')
  },
  {
    id: 'streak_legend',
    name: 'Streak Legend',
    description: 'Maintain a 30-day activity streak.',
    icon: '👑',
    rarity: 'Epic',
    xpBonus: 200,
    condition: (user) => user.streak >= 30 && !user.badges.includes('streak_legend')
  },
  {
    id: 'full_radar',
    name: 'Well-Rounded',
    description: 'Achieve 50+ in all 5 skill radar categories.',
    icon: '📡',
    rarity: 'Epic',
    xpBonus: 200,
    condition: (user) => {
      const r = user.skillRadar;
      return r && r.dsa >= 50 && r.os >= 50 && r.dbms >= 50 && r.cn >= 50 && r.systemDesign >= 50
        && !user.badges.includes('full_radar');
    }
  },

  // === Legendary ===
  {
    id: 'phoenix_rising',
    name: 'Phoenix Rising',
    description: 'Reach Level 50 and achieve the Phoenix rank.',
    icon: '🔥',
    rarity: 'Legendary',
    xpBonus: 500,
    condition: (user) => user.level >= 50 && user.rank === 'Phoenix'
      && !user.badges.includes('phoenix_rising')
  },
  {
    id: 'hired',
    name: 'Hired!',
    description: 'Log a confirmed job offer on the platform.',
    icon: '🎉',
    rarity: 'Legendary',
    xpBonus: 500,
    condition: (user, action) => action.type === 'job_offer_logged'
      && !user.badges.includes('hired')
  },
  {
    id: 'mentor_certified',
    name: 'Mentor Certified',
    description: 'Help 10 peers through mock interview sessions.',
    icon: '🎓',
    rarity: 'Legendary',
    xpBonus: 500,
    condition: (user, action) => action.type === 'peer_helped' && action.totalHelped >= 10
      && !user.badges.includes('mentor_certified')
  }
];

// --- Rarity Colors (for frontend rendering) ---
const RARITY_COLORS = {
  'Common': '#a0a0a0',
  'Uncommon': '#4caf50',
  'Rare': '#2196f3',
  'Epic': '#9c27b0',
  'Legendary': '#ff9800'
};

/**
 * Checks all achievements against the current user state and action.
 * Returns an array of newly earned achievements.
 * 
 * @param {Object} user - The Mongoose user document
 * @param {Object} action - The action that was just performed
 *   { type: string, ...additional context fields }
 * @returns {Array} Array of { id, name, icon, rarity, xpBonus } for newly earned achievements
 */
function checkAchievements(user, action = {}) {
  const newlyEarned = [];

  for (const achievement of ACHIEVEMENTS) {
    try {
      if (achievement.condition(user, action)) {
        newlyEarned.push({
          id: achievement.id,
          name: achievement.name,
          description: achievement.description,
          icon: achievement.icon,
          rarity: achievement.rarity,
          xpBonus: achievement.xpBonus
        });
      }
    } catch (err) {
      // Skip individual achievement check failures silently
      console.warn(`Achievement check failed for "${achievement.id}":`, err.message);
    }
  }

  return newlyEarned;
}

/**
 * Awards achievements to a user and saves to database.
 * Adds badge IDs to user.badges array and awards bonus XP.
 * 
 * @param {Object} user - The Mongoose user document
 * @param {Array} achievements - Array from checkAchievements()
 * @returns {Object} { awarded: Array, totalBonusXp: number }
 */
async function awardAchievements(user, achievements) {
  if (!achievements || achievements.length === 0) return { awarded: [], totalBonusXp: 0 };

  let totalBonusXp = 0;

  for (const achievement of achievements) {
    // Add badge to user
    if (!user.badges.includes(achievement.id)) {
      user.badges.push(achievement.id);
    }

    // Add to trophy case
    user.trophies.push({
      name: `${achievement.icon} ${achievement.name}`,
      icon: achievement.icon,
      earnedAt: new Date()
    });

    totalBonusXp += achievement.xpBonus;
  }

  // Award bonus XP
  user.xp = (user.xp || 0) + totalBonusXp;

  // Recalculate level
  const newLevel = Math.floor(user.xp / 100) + 1;
  if (newLevel > (user.level || 1)) {
    user.level = newLevel;
  }

  // Recalculate rank
  if (user.level >= 50) user.rank = 'Phoenix';
  else if (user.level >= 35) user.rank = 'Platinum';
  else if (user.level >= 20) user.rank = 'Gold';
  else if (user.level >= 10) user.rank = 'Silver';
  else if (user.level >= 5) user.rank = 'Bronze';
  else user.rank = 'Iron';

  await user.save();

  return { awarded: achievements, totalBonusXp };
}

/**
 * Returns all achievement definitions for the frontend to render.
 */
function getAllAchievements() {
  return ACHIEVEMENTS.map(a => ({
    id: a.id,
    name: a.name,
    description: a.description,
    icon: a.icon,
    rarity: a.rarity,
    xpBonus: a.xpBonus
  }));
}

/**
 * Returns the user's earned badges with full achievement details.
 */
function getUserAchievements(userBadges = []) {
  return ACHIEVEMENTS
    .filter(a => userBadges.includes(a.id))
    .map(a => ({
      id: a.id,
      name: a.name,
      description: a.description,
      icon: a.icon,
      rarity: a.rarity,
      xpBonus: a.xpBonus,
      earned: true
    }));
}

module.exports = {
  ACHIEVEMENTS,
  RARITY_COLORS,
  checkAchievements,
  awardAchievements,
  getAllAchievements,
  getUserAchievements
};
