/**
 * Multi-Axis Scoring Matrix Engine
 * Computes: Innovation x Execution x Design x Pitch + Synergy Bonuses - Penalties
 */

const { JUDGES } = require('./judgeEngine');

function calculateScores({ difficulty = 'medium', techStack = [], features = [], slideCount = 5, teamBonus = 0, judgeId = 'vc_investor' }) {
  let innovation = 60;
  let execution = 65;
  let design = 60;
  let pitch = 70;

  // Tech stack impact
  const techStr = techStack.join(' ').toLowerCase();
  if (/react|next|vue|tailwind/i.test(techStr)) design += 15;
  if (/python|fastapi|node|postgres|redis/i.test(techStr)) execution += 15;
  if (/tensorflow|pytorch|vector|agent|llm/i.test(techStr)) innovation += 20;

  // Difficulty multiplier
  if (difficulty === 'hard') {
    innovation += 10;
    execution -= 5;
  } else if (difficulty === 'expert') {
    innovation += 20;
    execution -= 15;
  }

  // Feature scope impact
  if (features.length >= 4) {
    execution += 10;
  } else if (features.length <= 1) {
    execution -= 10;
  }

  // Slide deck impact
  if (slideCount >= 5 && slideCount <= 7) {
    pitch += 15;
  } else if (slideCount < 3) {
    pitch -= 15;
  }

  // Apply Team Alignment Bonus
  innovation = Math.min(100, Math.max(0, innovation + teamBonus));
  execution = Math.min(100, Math.max(0, execution + teamBonus));
  design = Math.min(100, Math.max(0, design + teamBonus));
  pitch = Math.min(100, Math.max(0, pitch + teamBonus));

  // Judge weighting calculation
  const judge = JUDGES.find(j => j.id === judgeId) || JUDGES[0];
  const total = Math.round(
    (innovation * judge.weights.innovation) +
    (execution * judge.weights.execution) +
    (design * judge.weights.design) +
    (pitch * judge.weights.pitch)
  );

  let grade = 'B';
  if (total >= 90) grade = 'S (First Place Winner! 🏆)';
  else if (total >= 80) grade = 'A (Runner-Up 🥇)';
  else if (total >= 70) grade = 'B (Finalist 🥈)';
  else if (total >= 60) grade = 'C (Honorable Mention 🥉)';
  else grade = 'D (Participant Certificate)';

  return {
    innovation,
    execution,
    design,
    pitch,
    total,
    grade,
    judgeName: judge.name
  };
}

module.exports = { calculateScores };
