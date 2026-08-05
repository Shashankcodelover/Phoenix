/**
 * Phoenix v8.0: Unified Skill Radar Mastery Matrix Engine
 * 
 * Aggregates user activities across 6 core competency axes:
 * 1. Algorithms & Data Structures (DSA)
 * 2. System Architecture & Scalability
 * 3. Code Security & Quality
 * 4. Team Collaboration & Communication
 * 5. Product Pitching & Defense
 * 6. CS Fundamentals (OS, DBMS, Networks, OOP)
 * 
 * Generates personalized weakness remedies and milestone badges.
 */

/**
 * Calculates unified 6-axis skill radar scores and personalized recommendations.
 * 
 * @param {Object} userStats
 * @param {number} userStats.dsaScore - 0-100
 * @param {number} userStats.systemDesignScore - 0-100
 * @param {number} userStats.securityScore - 0-100
 * @param {number} userStats.communicationScore - 0-100
 * @param {number} userStats.pitchScore - 0-100
 * @param {number} userStats.csFundamentalsScore - 0-100
 * @returns {Object} Unified Skill Radar Matrix Report
 */
function calculateSkillMatrix(userStats = {}) {
  const {
    dsaScore = 65,
    systemDesignScore = 55,
    securityScore = 70,
    communicationScore = 60,
    pitchScore = 50,
    csFundamentalsScore = 75
  } = userStats;

  const matrix = {
    dsa: Math.max(0, Math.min(100, Math.round(dsaScore))),
    systemDesign: Math.max(0, Math.min(100, Math.round(systemDesignScore))),
    security: Math.max(0, Math.min(100, Math.round(securityScore))),
    communication: Math.max(0, Math.min(100, Math.round(communicationScore))),
    pitch: Math.max(0, Math.min(100, Math.round(pitchScore))),
    csFundamentals: Math.max(0, Math.min(100, Math.round(csFundamentalsScore)))
  };

  // Overall Mastery Level Calculation
  const scores = Object.values(matrix);
  const overallAverage = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

  let rankTier = 'Novice Developer';
  if (overallAverage >= 90) rankTier = 'Principal Architect (Level 5)';
  else if (overallAverage >= 80) rankTier = 'Staff Engineer (Level 4)';
  else if (overallAverage >= 70) rankTier = 'Senior Software Engineer (Level 3)';
  else if (overallAverage >= 55) rankTier = 'Junior Developer (Level 2)';

  // Identify Weakest Competency
  const sortedAxes = Object.entries(matrix).sort((a, b) => a[1] - b[1]);
  const weakestAxis = sortedAxes[0];
  const strongestAxis = sortedAxes[sortedAxes.length - 1];

  // Axis Labels Mapping
  const AXIS_NAMES = {
    dsa: 'Algorithms & Data Structures',
    systemDesign: 'System Architecture & Scalability',
    security: 'Code Security & Quality',
    communication: 'Team Collaboration & Communication',
    pitch: 'Product Pitching & Defense',
    csFundamentals: 'CS Fundamentals'
  };

  // Remediation Action Plan
  const remedies = [];
  if (weakestAxis[0] === 'dsa') {
    remedies.push('Focus on Graphs & Dynamic Programming PYQs in the Placement Prep Question Bank.');
  } else if (weakestAxis[0] === 'systemDesign') {
    remedies.push('Practice System Design Whiteboard scenarios focusing on Redis caching and DB read replicas.');
  } else if (weakestAxis[0] === 'security') {
    remedies.push('Run your code through the AI Code Review Audit Agent to identify OWASP top 10 flaws.');
  } else if (weakestAxis[0] === 'communication') {
    remedies.push('Complete 2 Bar-Raiser AI Mock Interviews focusing on reducing filler word density.');
  } else if (weakestAxis[0] === 'pitch') {
    remedies.push('Run a 3-round Live AI Judge Defense Simulation in the Hackathon Command Center.');
  } else if (weakestAxis[0] === 'csFundamentals') {
    remedies.push('Review High-Yield Revision Sheets for Operating Systems (Deadlocks) and DBMS (Indexing).');
  }

  // Earned Badges
  const badges = [];
  if (matrix.dsa >= 80) badges.push('💎 Algorithm Master');
  if (matrix.systemDesign >= 80) badges.push('🏛️ System Architect');
  if (matrix.security >= 80) badges.push('🛡️ Security Guardian');
  if (matrix.pitch >= 80) badges.push('🎤 Pitch Master');
  if (matrix.communication >= 80) badges.push('🎙️ Bar-Raiser Communicator');
  if (badges.length === 0) badges.push('🌱 Emerging Talent');

  return {
    overallMasteryScore: overallAverage,
    rankTier,
    matrix,
    weakestArea: { key: weakestAxis[0], name: AXIS_NAMES[weakestAxis[0]], score: weakestAxis[1] },
    strongestArea: { key: strongestAxis[0], name: AXIS_NAMES[strongestAxis[0]], score: strongestAxis[1] },
    remedies,
    earnedBadges: badges
  };
}

module.exports = { calculateSkillMatrix };
