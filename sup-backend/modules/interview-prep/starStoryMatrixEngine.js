/**
 * Phoenix v23.0: Behavioral STAR Story Matrix Analyzer with Impact Scorer
 */

class StarStoryMatrixEngine {
  /**
   * Deconstructs a candidate behavioral answer into Situation, Task, Action, Result
   * and scores the quantification of impact.
   */
  evaluateStarAnswer(question = '', answer = '') {
    const cleanAnswer = answer.trim().toLowerCase();
    const words = cleanAnswer.split(/\s+/).filter(Boolean);

    // 1. Detect STAR components
    const hasSituation = /when|while|during|at my previous|project|company|team was/i.test(cleanAnswer);
    const hasTask = /needed to|responsible for|goal was|objective was|tasked with/i.test(cleanAnswer);
    const hasAction = /i built|i designed|i implemented|i optimized|i resolved|i led|i created/i.test(cleanAnswer);
    const hasResult = /resulted in|reduced|increased|improved|saved|achieved|delivered|boosted/i.test(cleanAnswer);

    // 2. Detect Quantifiable Impact (Numbers, Percentages, Latency)
    const hasMetrics = /\d+%\s*|\d+\s*ms|\$\d+|\d+\s*users|\d+x\s*|reduced by\s*\d+/i.test(cleanAnswer);

    let starScore = 40;
    if (hasSituation) starScore += 15;
    if (hasTask) starScore += 15;
    if (hasAction) starScore += 15;
    if (hasResult) starScore += 15;

    let impactBonus = hasMetrics ? 20 : 0;
    const finalScore = Math.min(100, starScore + impactBonus);

    const feedback = [];
    if (!hasSituation) feedback.push('Clarify the Situation: set the context, team size, and background challenge.');
    if (!hasAction) feedback.push('Emphasize Action: Use "I" instead of "We" to highlight your specific technical contributions.');
    if (!hasResult) feedback.push('State the Result: Clearly state the positive business or engineering outcome.');
    if (!hasMetrics) feedback.push('Quantify Impact: Add concrete numbers (e.g. "Reduced API latency by 45%", "Scaled to 10k users").');

    return {
      question,
      wordCount: words.length,
      starCompliance: {
        situation: hasSituation,
        task: hasTask,
        action: hasAction,
        result: hasResult,
        quantifiedMetrics: hasMetrics
      },
      starScore: finalScore,
      rating: finalScore >= 85 ? 'Exemplary FAANG STAR Response' : finalScore >= 65 ? 'Strong Answer (Needs Quantification)' : 'Incomplete STAR Structure',
      actionableTips: feedback.length > 0 ? feedback : ['Flawless STAR response with clear quantified engineering impact.']
    };
  }
}

const starStoryMatrixEngine = new StarStoryMatrixEngine();
module.exports = { StarStoryMatrixEngine, starStoryMatrixEngine };
