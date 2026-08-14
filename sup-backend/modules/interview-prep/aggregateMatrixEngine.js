/**
 * Phoenix Apex Ultra: Feature 40 — Multi-Round Aggregate Performance Matrix & Heatmap Engine
 * 
 * Aggregates candidate performance across DSA, System Design, LLD, and Behavioral rounds,
 * producing an end-to-end multi-round scorecard and granular weakness heatmap.
 */

class AggregateMatrixEngine {
  /**
   * Computes multi-round aggregate matrix and hire recommendation.
   */
  calculateAggregateMatrix(payload = {}) {
    const {
      candidateName = 'Phoenix Candidate',
      roundScores = {
        dsaRound: 92,
        systemDesignRound: 86,
        lldMachineCodingRound: 89,
        behavioralBarRaiserRound: 85
      }
    } = payload;

    const scores = Object.values(roundScores);
    const averageScore = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);

    const heatmap = [
      { dimension: 'Data Structures & Algorithms', score: roundScores.dsaRound, status: 'EXCELLENT', color: 'emerald' },
      { dimension: 'Distributed System Design', score: roundScores.systemDesignRound, status: 'STRONG', color: 'sky' },
      { dimension: 'LLD Machine Coding & SOLID', score: roundScores.lldMachineCodingRound, status: 'STRONG', color: 'sky' },
      { dimension: 'Bar-Raiser & Crisis Behavioral', score: roundScores.behavioralBarRaiserRound, status: 'GOOD', color: 'purple' }
    ];

    const recommendation = parseFloat(averageScore) >= 88.0
      ? 'STRONG HIRE (L5 / L6 Contender)'
      : parseFloat(averageScore) >= 75.0
        ? 'HIRE (L4 Standard)'
        : 'LEAN NO HIRE (Needs Targeted Remediation)';

    return {
      success: true,
      candidateName,
      compositeReadinessPercentage: `${averageScore}%`,
      recommendation,
      heatmap,
      summaryRemarks: 'Candidate demonstrates strong algorithmic agility and distributed architectural intuition with clear STAR behavioral delivery.'
    };
  }
}

const aggregateMatrixEngine = new AggregateMatrixEngine();
module.exports = { AggregateMatrixEngine, aggregateMatrixEngine };
