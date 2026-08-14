/**
 * Phoenix Apex Ultra: Feature 31 — Branch Suitability AI Diagnostic Engine
 * 
 * Evaluates candidate cognitive traits (Discrete Logic, Probability, Embedded Hardware, Systems)
 * to calculate weighted suitability across engineering branches (CSE, ISE, AIML, ECE).
 */

class BranchSuitabilityEngine {
  /**
   * Evaluates candidate trait scores and returns branch suitability percentages.
   */
  evaluateBranchSuitability(payload = {}) {
    const {
      discreteMathScore = 88,
      probabilityStatsScore = 82,
      hardwareInterestScore = 55,
      softwareAppDevScore = 92
    } = payload;

    // CSE: Heavy math + software app dev
    const cseSuitability = Math.min(99, Math.round(discreteMathScore * 0.5 + softwareAppDevScore * 0.5));
    // ISE: Applied software + enterprise systems
    const iseSuitability = Math.min(99, Math.round(softwareAppDevScore * 0.65 + discreteMathScore * 0.35));
    // AIML: Heavy probability + discrete math
    const aimlSuitability = Math.min(99, Math.round(probabilityStatsScore * 0.6 + discreteMathScore * 0.4));
    // ECE: Hardware + discrete math
    const eceSuitability = Math.min(99, Math.round(hardwareInterestScore * 0.7 + discreteMathScore * 0.3));

    const branchRankings = [
      {
        branchCode: 'CSE',
        branchName: 'Computer Science & Engineering',
        suitabilityScore: `${cseSuitability}%`,
        coreFocus: 'Algorithms, Operating Systems, Compilers, Distributed Systems',
        recommended: cseSuitability >= 90
      },
      {
        branchCode: 'ISE',
        branchName: 'Information Science & Engineering',
        suitabilityScore: `${iseSuitability}%`,
        coreFocus: 'Full-Stack Software Architecture, Cloud Infrastructure, Database Engineering',
        recommended: iseSuitability >= 90
      },
      {
        branchCode: 'AIML',
        branchName: 'Artificial Intelligence & Machine Learning',
        suitabilityScore: `${aimlSuitability}%`,
        coreFocus: 'Deep Learning, Neural Networks, Computer Vision, High-Dimensional Statistics',
        recommended: aimlSuitability >= 85
      },
      {
        branchCode: 'ECE',
        branchName: 'Electronics & Communication Engineering',
        suitabilityScore: `${eceSuitability}%`,
        coreFocus: 'VLSI Design, Embedded Microcontrollers, Digital Signal Processing',
        recommended: eceSuitability >= 80
      }
    ].sort((a, b) => parseInt(b.suitabilityScore) - parseInt(a.suitabilityScore));

    return {
      success: true,
      topRecommendation: branchRankings[0].branchName,
      branchRankings,
      counselorSummary: 'Strong aptitude for Discrete Algorithms and Software Architecture. Primary recommendation is Pure CSE or ISE with secondary elective specializations in Cloud Systems.'
    };
  }
}

const branchSuitabilityEngine = new BranchSuitabilityEngine();
module.exports = { BranchSuitabilityEngine, branchSuitabilityEngine };
