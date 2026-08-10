/**
 * Phoenix V16: Interview Timer & Pacing Coach
 *
 * Analyzes answer timing against optimal durations for each question type.
 * Competitive gap: Most platforms don't provide per-question time coaching.
 */

// Optimal answer durations in seconds by question type
const OPTIMAL_DURATIONS = {
  BEHAVIORAL: { min: 60, ideal: 120, max: 180 },
  TECHNICAL: { min: 30, ideal: 90, max: 150 },
  SYSTEM_DESIGN: { min: 120, ideal: 300, max: 600 },
  CODING: { min: 180, ideal: 600, max: 1200 },
  CASE_STUDY: { min: 120, ideal: 300, max: 480 },
  GENERAL: { min: 30, ideal: 60, max: 120 }
};

/**
 * Evaluate answer pacing for a set of responses.
 *
 * @param {Object} params
 * @param {Array} params.answers - Array of { questionType, durationSeconds, wordCount }
 * @returns {Object} Pacing analysis with per-answer and aggregate scores
 */
function analyzePacing({ answers = [] }) {
  if (!Array.isArray(answers) || answers.length === 0) {
    return { success: false, error: 'At least one answer timing is required.' };
  }

  // Cap to prevent abuse & filter invalid non-object answers (FIX REJECTION #7)
  const capped = answers
    .slice(0, 50)
    .filter(a => a && typeof a === 'object');

  if (capped.length === 0) {
    return { success: false, error: 'No valid answer objects provided.' };
  }

  const results = capped.map((answer, idx) => {
    const type = (answer.questionType && OPTIMAL_DURATIONS[answer.questionType]) ? answer.questionType : 'GENERAL';
    const optimal = OPTIMAL_DURATIONS[type];
    const dur = Math.max(0, answer.durationSeconds || 0);
    const wc = Math.max(0, answer.wordCount || 0);

    let pacingScore = 100;
    let assessment = 'OPTIMAL';

    if (dur < optimal.min) {
      pacingScore = Math.round((dur / optimal.min) * 70);
      assessment = 'TOO_FAST';
    } else if (dur > optimal.max) {
      pacingScore = Math.max(30, Math.round(100 - ((dur - optimal.max) / optimal.max) * 50));
      assessment = 'TOO_SLOW';
    } else if (dur >= optimal.min && dur <= optimal.ideal) {
      pacingScore = 90 + Math.round((dur - optimal.min) / (optimal.ideal - optimal.min) * 10);
      assessment = 'OPTIMAL';
    } else {
      pacingScore = Math.max(70, Math.round(100 - ((dur - optimal.ideal) / (optimal.max - optimal.ideal)) * 30));
      assessment = 'SLIGHTLY_LONG';
    }

    const wpm = dur > 0 ? Math.round((wc / dur) * 60) : 0;

    return {
      questionIndex: idx + 1,
      questionType: type,
      durationSeconds: dur,
      wordCount: wc,
      wpm,
      pacingScore: Math.min(100, pacingScore),
      assessment,
      idealRange: `${optimal.min}-${optimal.ideal}s`
    };
  });

  const avgScore = Math.round(results.reduce((sum, r) => sum + r.pacingScore, 0) / results.length);
  const tooFast = results.filter(r => r.assessment === 'TOO_FAST').length;
  const tooSlow = results.filter(r => r.assessment === 'TOO_SLOW').length;

  const tips = [];
  if (tooFast > results.length / 2) tips.push('You tend to rush through answers. Slow down and elaborate on your thought process.');
  if (tooSlow > results.length / 2) tips.push('You tend to over-explain. Practice being more concise and structured.');

  return {
    success: true,
    results,
    aggregate: { avgPacingScore: avgScore, tooFastCount: tooFast, tooSlowCount: tooSlow },
    tips,
    metadata: { engine: 'Phoenix Pacing Coach v16' }
  };
}

module.exports = { analyzePacing, OPTIMAL_DURATIONS };
