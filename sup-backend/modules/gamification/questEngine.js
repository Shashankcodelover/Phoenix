/**
 * Phoenix v9.0: Daily Streak Multiplier & XP Quest Engine
 * 
 * Manages daily quest challenges, streak bonus multipliers, and XP level progression:
 * - Daily Quest Challenges (DSA PYQs, AI Mock Interview, System Design Whiteboard)
 * - Streak Bonus Multipliers (1.2x at 3 days, 1.5x at 7 days, 2.0x at 14+ days)
 * - Quest Progress & Reward Claim State
 */

const DAILY_QUEST_TEMPLATES = [
  { questId: 'q_dsa_01', title: 'Algorithm Challenger', description: 'Solve 3 DSA PYQs in the Placement Prep Question Bank', xpReward: 50, requiredCount: 3 },
  { questId: 'q_mock_01', title: 'Bar-Raiser Interviewee', description: 'Complete 1 Bar-Raiser AI Mock Interview with <3% filler density', xpReward: 75, requiredCount: 1 },
  { questId: 'q_sys_01', title: 'System Architect', description: 'Evaluate 1 System Design Architecture with 0 SPOFs', xpReward: 100, requiredCount: 1 },
  { questId: 'q_audit_01', title: 'Security Sentinel', description: 'Run 1 Code Review Audit with AI Code Review Agent', xpReward: 60, requiredCount: 1 }
];

/**
 * Calculates current streak multiplier factor.
 * 
 * @param {number} streakDays - Current active streak days
 * @returns {number} Multiplier factor (e.g. 1.5)
 */
function getStreakMultiplier(streakDays = 1) {
  if (streakDays >= 14) return 2.0;
  if (streakDays >= 7) return 1.5;
  if (streakDays >= 3) return 1.25;
  return 1.0;
}

/**
 * Gets active daily quests and user completion state.
 * 
 * @param {Object} userStats
 * @param {number} userStats.streak - Active streak days
 * @param {Array<string>} userStats.completedQuestIds - List of completed quest IDs today
 * @returns {Object} Active Quests & Streak Summary
 */
function getActiveQuests(userStats = {}) {
  const { streak = 1, completedQuestIds = [] } = userStats;

  const multiplier = getStreakMultiplier(streak);

  const quests = DAILY_QUEST_TEMPLATES.map(template => {
    const isCompleted = completedQuestIds.includes(template.questId);
    const boostedXp = Math.round(template.xpReward * multiplier);

    return {
      ...template,
      boostedXpReward: boostedXp,
      isCompleted,
      status: isCompleted ? 'CLAIMED' : 'IN_PROGRESS'
    };
  });

  const totalAvailableXp = quests.reduce((acc, q) => acc + q.boostedXpReward, 0);
  const totalEarnedXp = quests.filter(q => q.isCompleted).reduce((acc, q) => acc + q.boostedXpReward, 0);

  return {
    activeStreakDays: streak,
    streakMultiplier: multiplier,
    streakTierName: streak >= 14 ? '🔥 Legendary Hustler (2.0x XP)' : streak >= 7 ? '⚡ Veteran Grinder (1.5x XP)' : '🌱 Daily Learner (1.0x XP)',
    quests,
    totalAvailableXp,
    totalEarnedXp
  };
}

module.exports = { getActiveQuests, getStreakMultiplier, DAILY_QUEST_TEMPLATES };
