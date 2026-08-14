/**
 * Phoenix Apex Ultra: Feature 21 — KCET & DCET Choice Filling Option-Entry Simulator
 * 
 * Simulates official Karnataka Examination Authority (KEA) multi-round seat allotment
 * algorithms with priority re-ordering, quota allocations, and Choice 1-4 decision modeling.
 */

const HISTORICAL_ROUND_CUTOFFS = {
  'RVCE_CSE': { round1: 1850, round2: 2250, categoryCutoffs: { OBC_2A: 3400, SC_ST: 7800, SNQ: 1400 } },
  'BMSCE_CSE': { round1: 3200, round2: 3800, categoryCutoffs: { OBC_2A: 5200, SC_ST: 11200, SNQ: 2600 } },
  'MSRIT_ISE': { round1: 4100, round2: 4900, categoryCutoffs: { OBC_2A: 6800, SC_ST: 14500, SNQ: 3500 } },
  'UVCE_CSE': { round1: 5200, round2: 6100, categoryCutoffs: { OBC_2A: 8200, SC_ST: 18000, SNQ: 4200 } }
};

class ChoiceFillingSimulatorEngine {
  /**
   * Simulates multi-round seat allotment for ordered college options.
   */
  simulateSeatAllotment(payload = {}) {
    const {
      candidateRank = 2140,
      categoryQuota = 'GM', // 'GM' | 'OBC_2A' | 'SC_ST' | 'SNQ'
      orderedOptions = [
        { priority: 1, collegeCode: 'RVCE', branch: 'CSE', key: 'RVCE_CSE' },
        { priority: 2, collegeCode: 'BMSCE', branch: 'CSE', key: 'BMSCE_CSE' },
        { priority: 3, collegeCode: 'MSRIT', branch: 'ISE', key: 'MSRIT_ISE' },
        { priority: 4, collegeCode: 'UVCE', branch: 'CSE', key: 'UVCE_CSE' }
      ]
    } = payload;

    let round1Allotment = null;
    let round2Allotment = null;

    // Simulate Round 1
    for (const opt of orderedOptions) {
      const collegeCutoff = HISTORICAL_ROUND_CUTOFFS[opt.key];
      if (collegeCutoff) {
        const threshold = categoryQuota !== 'GM' && collegeCutoff.categoryCutoffs[categoryQuota]
          ? collegeCutoff.categoryCutoffs[categoryQuota]
          : collegeCutoff.round1;

        if (candidateRank <= threshold) {
          round1Allotment = {
            allotted: true,
            optionPriority: opt.priority,
            college: opt.collegeCode,
            branch: opt.branch,
            cutoffRank: threshold,
            allotmentStatus: `ALLOTTED in Round 1 (Priority #${opt.priority})`
          };
          break;
        }
      }
    }

    // Simulate Round 2 (Higher upgrade potential)
    for (const opt of orderedOptions) {
      const collegeCutoff = HISTORICAL_ROUND_CUTOFFS[opt.key];
      if (collegeCutoff) {
        const threshold = categoryQuota !== 'GM' && collegeCutoff.categoryCutoffs[categoryQuota]
          ? Math.round(collegeCutoff.categoryCutoffs[categoryQuota] * 1.08)
          : collegeCutoff.round2;

        if (candidateRank <= threshold) {
          round2Allotment = {
            allotted: true,
            optionPriority: opt.priority,
            college: opt.collegeCode,
            branch: opt.branch,
            cutoffRank: threshold,
            allotmentStatus: `UPGRADED in Round 2 (Priority #${opt.priority})`
          };
          break;
        }
      }
    }

    return {
      success: true,
      candidateRank,
      categoryQuota,
      totalOptionsSubmitted: orderedOptions.length,
      round1Result: round1Allotment || { allotted: false, message: 'No seat allotted in Round 1. Eligible for Round 2.' },
      round2Result: round2Allotment || { allotted: false, message: 'No seat allotted in Round 2. Consider adding more options.' },
      keaDecisionStrategy: {
        recommendedChoice: round1Allotment?.optionPriority === 1 ? 'Choice 1: Accept & Freeze (Top Priority Allotted)' : 'Choice 2: Accept Round 1 Seat & Hold for Round 2 Upgrade',
        choiceDefinitions: [
          { choice: 'Choice 1', meaning: 'Accept allotted seat, pay fee, and exit counseling (Seat Confirmed).' },
          { choice: 'Choice 2', meaning: 'Accept allotted seat as backup, participate in Round 2 for higher options.' },
          { choice: 'Choice 3', meaning: 'Reject allotted seat, participate in Round 2 for other options.' },
          { choice: 'Choice 4', meaning: 'Reject allotted seat and exit KEA counseling entirely.' }
        ]
      }
    };
  }
}

const choiceFillingSimulatorEngine = new ChoiceFillingSimulatorEngine();
module.exports = { ChoiceFillingSimulatorEngine, choiceFillingSimulatorEngine, HISTORICAL_ROUND_CUTOFFS };
