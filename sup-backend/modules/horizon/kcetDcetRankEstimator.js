/**
 * Phoenix v21.0: KCET & DCET Rank Estimator & Mock Entrance Simulator Engine
 * 
 * Provides entrance exam mark normalization, accuracy curve analysis,
 * state rank projections, and college cutoff matching for Karnataka engineering colleges.
 */

// Historical cutoff brackets for top Karnataka Engineering Colleges (CSE / ISE / AI-ML)
const COLLEGE_CUTOFF_BENCHMARKS = [
  { collegeCode: 'E001', collegeName: 'RV College of Engineering (RVCE), Bengaluru', branch: 'Computer Science (CSE)', generalMeritRankCutoff: 450, tier: 'Tier-1 Elite' },
  { collegeCode: 'E003', collegeName: 'BMS College of Engineering (BMSCE), Bengaluru', branch: 'Computer Science (CSE)', generalMeritRankCutoff: 1200, tier: 'Tier-1 Elite' },
  { collegeCode: 'E005', collegeName: 'M.S. Ramaiah Institute of Technology (MSRIT), Bengaluru', branch: 'Computer Science (CSE)', generalMeritRankCutoff: 1600, tier: 'Tier-1 Elite' },
  { collegeCode: 'E006', collegeName: 'PES University (Ring Road Campus), Bengaluru', branch: 'Computer Science (CSE)', generalMeritRankCutoff: 2100, tier: 'Tier-1' },
  { collegeCode: 'E021', collegeName: 'SJCE / JSS Science & Tech University, Mysuru', branch: 'Computer Science (CSE)', generalMeritRankCutoff: 3200, tier: 'Tier-1' },
  { collegeCode: 'E033', collegeName: 'BMS Institute of Technology (BMSIT), Bengaluru', branch: 'Information Science (ISE)', generalMeritRankCutoff: 5800, tier: 'Tier-2' },
  { collegeCode: 'E044', collegeName: 'Dayananda Sagar College of Engineering (DSCE), Bengaluru', branch: 'Computer Science (CSE)', generalMeritRankCutoff: 4800, tier: 'Tier-2' }
];

class KcetDcetRankEstimator {
  /**
   * Simulates an entrance exam performance and estimates state rank.
   * 
   * @param {Object} input
   * @param {string} input.examType - 'KCET' | 'DCET'
   * @param {number} input.physicsScore - Score out of 60 (for KCET)
   * @param {number} input.chemistryScore - Score out of 60 (for KCET)
   * @param {number} input.mathScore - Score out of 60 (for KCET)
   * @param {number} input.boardPercentage - Board/Diploma 12th percentage (0-100)
   * @param {number} input.diplomaAppliedMarks - Score out of 100 (for DCET)
   * @returns {Object} Comprehensive Rank Estimation & College Eligibility Report
   */
  estimateRank(input = {}) {
    const {
      examType = 'KCET',
      physicsScore = 42,
      chemistryScore = 45,
      mathScore = 48,
      boardPercentage = 92,
      diplomaAppliedMarks = 78
    } = input;

    let totalEntranceScore = 0;
    let maxEntranceMarks = 180;
    let normalizedPercentage = 0;

    if (examType.toUpperCase() === 'DCET') {
      maxEntranceMarks = 100;
      totalEntranceScore = Math.min(100, Math.max(0, diplomaAppliedMarks));
      // DCET uses 100% entrance marks + qualifying diploma marks
      normalizedPercentage = parseFloat((((totalEntranceScore / 100) * 50) + ((boardPercentage / 100) * 50)).toFixed(2));
    } else {
      // KCET: Physics (60) + Chemistry (60) + Math (60) = 180
      const safeP = Math.min(60, Math.max(0, physicsScore));
      const safeC = Math.min(60, Math.max(0, chemistryScore));
      const safeM = Math.min(60, Math.max(0, mathScore));
      totalEntranceScore = safeP + safeC + safeM;

      // 50% KCET entrance + 50% Board PCM percentage (50:50 rule)
      const entrancePercentage = (totalEntranceScore / 180) * 100;
      normalizedPercentage = parseFloat(((entrancePercentage * 0.5) + (boardPercentage * 0.5)).toFixed(2));
    }

    // Realistic state rank estimation curve based on ~220,000 KCET test takers
    let estimatedRank = 1;
    if (normalizedPercentage >= 96) estimatedRank = Math.round(1 + (100 - normalizedPercentage) * 50);
    else if (normalizedPercentage >= 92) estimatedRank = Math.round(200 + (96 - normalizedPercentage) * 250);
    else if (normalizedPercentage >= 85) estimatedRank = Math.round(1200 + (92 - normalizedPercentage) * 600);
    else if (normalizedPercentage >= 75) estimatedRank = Math.round(5400 + (85 - normalizedPercentage) * 1200);
    else if (normalizedPercentage >= 60) estimatedRank = Math.round(17400 + (75 - normalizedPercentage) * 2500);
    else estimatedRank = Math.round(55000 + (60 - normalizedPercentage) * 4000);

    estimatedRank = Math.max(1, Math.min(200000, estimatedRank));

    // Match college eligibility
    const eligibleColleges = COLLEGE_CUTOFF_BENCHMARKS.map(col => {
      const isEligible = estimatedRank <= col.generalMeritRankCutoff;
      const margin = col.generalMeritRankCutoff - estimatedRank;
      let chanceCategory = 'High Probability';
      if (!isEligible) {
        chanceCategory = margin > -1500 ? 'Borderline / Round 2 Target' : 'Low Probability';
      }
      return {
        ...col,
        isEligible,
        rankDifference: margin,
        chanceCategory
      };
    });

    const topEligible = eligibleColleges.filter(c => c.isEligible);

    return {
      examType: examType.toUpperCase(),
      totalEntranceScore,
      maxEntranceMarks,
      boardPercentage,
      compositeNormalizedPercentage: normalizedPercentage,
      estimatedStateRank: estimatedRank,
      rankConfidenceRange: {
        optimistic: Math.max(1, Math.round(estimatedRank * 0.85)),
        pessimistic: Math.round(estimatedRank * 1.15)
      },
      admissionReadiness: estimatedRank <= 3000 ? 'Tier-1 Top Engineering Eligible' : estimatedRank <= 10000 ? 'Tier-2 CS/IS Ready' : 'Focus on Math/Physics Revision',
      eligibleCollegesSummary: {
        totalEligible: topEligible.length,
        colleges: eligibleColleges
      },
      recommendedStrategy: estimatedRank > 2000
        ? ['Boost Mathematics score by 8+ marks to jump into the Top 1,500 rank bracket.', 'Practice KCET 10-year past papers focusing on Calculus and Vector Algebra speed.']
        : ['Excellent standing! Maintain Board percentage $\\ge 92\\%$ to lock Tier-1 RVCE/BMSCE Computer Science seats.']
    };
  }
}

const kcetDcetRankEstimator = new KcetDcetRankEstimator();
module.exports = { KcetDcetRankEstimator, kcetDcetRankEstimator, COLLEGE_CUTOFF_BENCHMARKS };
