/**
 * Phoenix Horizon — Daily & Monthly Action Checklist Engine
 * Module 3: Gamified task checklists tied to roadmap phases.
 */

function generateDailyChecklist({ domainKey, phaseId, dayOfMonth }) {
  const DOMAIN_TASKS = {
    fullstack_web: {
      1: [
        { taskId: 'fw_p1_d1', task: 'Complete HTML semantic elements tutorial', xpReward: 10, estimatedMinutes: 30 },
        { taskId: 'fw_p1_d2', task: 'Build a basic profile page with HTML only', xpReward: 15, estimatedMinutes: 45 },
        { taskId: 'fw_p1_d3', task: 'Push your profile page to GitHub', xpReward: 20, estimatedMinutes: 20 },
      ],
      2: [
        { taskId: 'fw_p2_d1', task: 'Build a React component with useState hook', xpReward: 20, estimatedMinutes: 45 },
        { taskId: 'fw_p2_d2', task: 'Connect frontend to Express REST API', xpReward: 25, estimatedMinutes: 60 },
        { taskId: 'fw_p2_d3', task: 'Write one Jest/Vitest unit test for your API', xpReward: 15, estimatedMinutes: 30 },
      ],
    },
    ca_foundation: {
      1: [
        { taskId: 'ca_p1_d1', task: 'Solve 10 Journal Entry problems from ICAI module', xpReward: 15, estimatedMinutes: 45 },
        { taskId: 'ca_p1_d2', task: 'Read Business Law Chapter 1 — Indian Contract Act', xpReward: 10, estimatedMinutes: 40 },
        { taskId: 'ca_p1_d3', task: 'Solve 5 Quantitative Aptitude ratio problems', xpReward: 10, estimatedMinutes: 30 },
      ],
    },
    neet_biology: {
      1: [
        { taskId: 'neet_p1_d1', task: 'Read NCERT Biology Ch.1 — Cell: Unit of Life', xpReward: 15, estimatedMinutes: 45 },
        { taskId: 'neet_p1_d2', task: 'Solve 20 MCQs from Cell Biology chapter', xpReward: 20, estimatedMinutes: 30 },
        { taskId: 'neet_p1_d3', task: 'Draw and label a plant cell diagram from memory', xpReward: 10, estimatedMinutes: 20 },
      ],
    },
    dsa_algorithms: {
      1: [
        { taskId: 'dsa_p1_d1', task: 'Learn Big-O notation and analyze 5 code snippets', xpReward: 15, estimatedMinutes: 30 },
        { taskId: 'dsa_p1_d2', task: 'Solve 3 easy Array problems on LeetCode', xpReward: 20, estimatedMinutes: 45 },
        { taskId: 'dsa_p1_d3', task: 'Implement binary search from scratch (no copy-paste)', xpReward: 25, estimatedMinutes: 30 },
      ],
    },
  };

  const domainTasks = DOMAIN_TASKS[domainKey];
  if (!domainTasks) {
    return { success: false, error: `No checklist data for domain "${domainKey}".` };
  }

  const phaseTasks = domainTasks[phaseId] || domainTasks[1];
  const dailyIndex = ((dayOfMonth - 1) % phaseTasks.length);

  return {
    success: true,
    domainKey,
    phaseId,
    dayOfMonth,
    dailyTasks: [phaseTasks[dailyIndex]],
    totalXpAvailable: phaseTasks[dailyIndex].xpReward,
  };
}

function generateMonthlyMilestones({ domainKey, phaseId }) {
  const MILESTONES = {
    fullstack_web: {
      1: { milestone: 'Build and deploy 1 static website to GitHub Pages', xpReward: 100 },
      2: { milestone: 'Complete a full-stack CRUD app with user auth', xpReward: 200 },
      3: { milestone: 'Ship 2 portfolio projects with live demo URLs', xpReward: 300 },
      4: { milestone: 'Solve 100 DSA problems and complete 3 mock interviews', xpReward: 500 },
    },
    ca_foundation: {
      1: { milestone: 'Complete all ICAI Practice Manual exercises for Accounts', xpReward: 150 },
      2: { milestone: 'Score 60%+ on 3 timed mock exams', xpReward: 250 },
    },
    neet_biology: {
      1: { milestone: 'Complete NCERT Biology Class 11 & 12 first reading', xpReward: 150 },
      2: { milestone: 'Solve 500 NEET PYQs chapter-wise', xpReward: 300 },
    },
    dsa_algorithms: {
      1: { milestone: 'Solve 50 easy problems across arrays, strings, and hashmaps', xpReward: 150 },
      2: { milestone: 'Complete all tree and graph traversal patterns', xpReward: 250 },
    },
  };

  const domainMilestones = MILESTONES[domainKey];
  if (!domainMilestones) {
    return { success: false, error: `No milestones for domain "${domainKey}".` };
  }

  const milestone = domainMilestones[phaseId] || domainMilestones[1];
  return { success: true, domainKey, phaseId, milestone };
}

module.exports = { generateDailyChecklist, generateMonthlyMilestones };
