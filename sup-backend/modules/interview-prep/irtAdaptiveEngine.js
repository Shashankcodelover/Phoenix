/**
 * Phoenix v19: Adaptive IRT Question Recommendation Engine
 * ========================================================
 * Implements 2-Parameter Item Response Theory (IRT) to adaptively
 * match candidate ability (Theta) to optimal question difficulty (Beta):
 *   P(Correct | Theta) = 1 / (1 + exp(-Alpha * (Theta - Beta)))
 */

class IRTAdaptiveEngine {
  constructor() {
    this.defaultTheta = 0.0; // Ability scale centered at 0 (-3.0 beginner to +3.0 principal)
  }

  /**
   * Calculates probability of correct answer given candidate ability theta and item params.
   */
  calculateProbability(theta = 0.0, beta = 0.0, alpha = 1.0) {
    const exponent = -alpha * (theta - beta);
    return 1.0 / (1.0 + Math.exp(exponent));
  }

  /**
   * Updates candidate estimated ability theta using Maximum A Posteriori (MAP) gradient step.
   * 
   * @param {number} currentTheta - Current ability estimate (-3.0 to +3.0)
   * @param {boolean} isCorrect - Whether candidate solved the problem
   * @param {Object} itemParams - { beta: difficulty, alpha: discrimination }
   * @returns {Object} Updated ability state
   */
  updateAbility(currentTheta = 0.0, isCorrect = true, itemParams = { beta: 0.0, alpha: 1.0 }) {
    const { beta = 0.0, alpha = 1.0 } = itemParams;
    const p = this.calculateProbability(currentTheta, beta, alpha);
    const outcome = isCorrect ? 1.0 : 0.0;

    // Gradient step: error = outcome - predicted probability
    const error = outcome - p;
    const learningRate = 0.4;
    const updatedTheta = Math.max(-3.0, Math.min(3.0, currentTheta + (learningRate * alpha * error)));

    // Map Theta (-3 to +3) to 0-100 Placement Readiness Percentile
    const percentileRank = Math.round((1.0 / (1.0 + Math.exp(-updatedTheta * 1.5))) * 100);

    return {
      success: true,
      previousTheta: Math.round(currentTheta * 100) / 100,
      updatedTheta: Math.round(updatedTheta * 100) / 100,
      probabilityOfSuccess: Math.round(p * 1000) / 1000,
      percentileRank,
      recommendedNextDifficulty: updatedTheta > 1.5 ? 'HARD / PRINCIPAL' : updatedTheta > 0.0 ? 'MEDIUM / SENIOR' : 'EASY / JUNIOR',
      status: 'THETA_UPDATED'
    };
  }

  /**
   * Selects next question that maximizes Fisher Information (most informative for current Theta).
   */
  selectNextQuestion(candidateTheta = 0.0, questionPool = []) {
    if (!Array.isArray(questionPool) || questionPool.length === 0) {
      return null;
    }

    let maxInformation = -1;
    let selectedQuestion = questionPool[0];

    for (const q of questionPool) {
      const beta = typeof q.difficultyRating === 'number' ? q.difficultyRating : 0.0;
      const alpha = typeof q.discrimination === 'number' ? q.discrimination : 1.0;
      const p = this.calculateProbability(candidateTheta, beta, alpha);
      const information = (alpha * alpha) * p * (1 - p); // Fisher Information for 2PL model

      if (information > maxInformation) {
        maxInformation = information;
        selectedQuestion = q;
      }
    }

    return {
      question: selectedQuestion,
      fisherInformation: Math.round(maxInformation * 1000) / 1000,
      targetCandidateTheta: candidateTheta
    };
  }
}

const defaultIrtEngine = new IRTAdaptiveEngine();

module.exports = {
  IRTAdaptiveEngine,
  defaultIrtEngine
};
