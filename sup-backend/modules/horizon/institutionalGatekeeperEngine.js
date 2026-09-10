/**
 * Feature 47: Institutional Gatekeeper Assessment Engine
 * Horizon Universal Career & Admissions Engine
 * 
 * Simulates institutional gatekeeper screening exams (Mettl / HackerRank Campus / CoCubes),
 * computes multi-section scores (Quant, Logical, Technical, Coding), audits anti-cheat
 * tab-switch integrity heuristics, and predicts batch-wide percentile & shortlist status.
 */

const EXAM_SCHEMA = {
  examName: 'All-India Institutional Gatekeeper Tech Screening (TPO Standard)',
  totalDurationMins: 90,
  totalMarks: 100,
  sectionalCutoffMinPercent: 60,
  sections: [
    { id: 'quant', name: 'Quantitative & Numerical Aptitude', maxScore: 25, durationMins: 20, weight: 0.25 },
    { id: 'logical', name: 'Logical & Analytical Reasoning', maxScore: 25, durationMins: 20, weight: 0.25 },
    { id: 'tech_mcq', name: 'Core CS & System Fundamentals', maxScore: 25, durationMins: 20, weight: 0.25 },
    { id: 'coding', name: 'Algorithmic Coding Challenge', maxScore: 25, durationMins: 30, weight: 0.25 }
  ]
};

const PRESETS = [
  {
    id: 'top_tier_sde',
    label: 'Top-Tier SDE Candidate (Clean Integrity & 96% Score)',
    candidateName: 'Aditya Shenoy',
    usn: '1RV21CS018',
    collegeName: 'RV College of Engineering',
    quantScore: 24,
    logicalScore: 23,
    techMcqScore: 25,
    codingTestCasesPassed: 10,
    codingTotalTestCases: 10,
    tabSwitchCount: 0,
    pasteEventsCount: 0,
    timeSpentMins: 72
  },
  {
    id: 'borderline_candidate',
    label: 'Borderline Candidate (Passed Tech, Borderline Quant)',
    candidateName: 'Pooja R. Hegde',
    usn: '1BM21IS042',
    collegeName: 'BMS College of Engineering',
    quantScore: 14,
    logicalScore: 16,
    techMcqScore: 21,
    codingTestCasesPassed: 7,
    codingTotalTestCases: 10,
    tabSwitchCount: 1,
    pasteEventsCount: 1,
    timeSpentMins: 85
  },
  {
    id: 'flagged_integrity',
    label: 'Flagged Submission (High Tab-Switches & Plagiarism)',
    candidateName: 'Rahul Verma',
    usn: '1MS21EC089',
    collegeName: 'Ramaiah Institute of Technology',
    quantScore: 22,
    logicalScore: 20,
    techMcqScore: 23,
    codingTestCasesPassed: 10,
    codingTotalTestCases: 10,
    tabSwitchCount: 7,
    pasteEventsCount: 5,
    timeSpentMins: 45
  }
];

class InstitutionalGatekeeperEngine {
  getExamSchema() {
    return { success: true, schema: EXAM_SCHEMA };
  }

  getPresets() {
    return PRESETS;
  }

  evaluate(submission) {
    const {
      candidateName = 'Anonymous Candidate',
      usn = 'UNREGISTERED',
      collegeName = 'Engineering College',
      quantScore = 20,
      logicalScore = 20,
      techMcqScore = 20,
      codingTestCasesPassed = 8,
      codingTotalTestCases = 10,
      tabSwitchCount = 0,
      pasteEventsCount = 0,
      timeSpentMins = 80
    } = submission;

    const qScore = Math.min(25, Math.max(0, parseFloat(quantScore) || 0));
    const lScore = Math.min(25, Math.max(0, parseFloat(logicalScore) || 0));
    const tScore = Math.min(25, Math.max(0, parseFloat(techMcqScore) || 0));
    const passedCases = Math.min(codingTotalTestCases, Math.max(0, parseInt(codingTestCasesPassed, 10) || 0));
    const totalCases = parseInt(codingTotalTestCases, 10) || 10;

    // Coding score out of 25 proportional to test cases
    const codingScore = Math.round((passedCases / totalCases) * 25);
    const totalScore = Math.round(qScore + lScore + tScore + codingScore);

    // Sectional Pass / Fail Audit (Cutoff: 60% of each section = 15/25)
    const cutoffThreshold = 15;
    const sectionalAudit = {
      quant: { score: qScore, max: 25, passed: qScore >= cutoffThreshold },
      logical: { score: lScore, max: 25, passed: lScore >= cutoffThreshold },
      tech_mcq: { score: tScore, max: 25, passed: tScore >= cutoffThreshold },
      coding: { score: codingScore, max: 25, passed: codingScore >= cutoffThreshold, testCasesRatio: `${passedCases}/${totalCases}` }
    };

    const allSectionsPassed = Object.values(sectionalAudit).every(s => s.passed);

    // Anti-Cheat Integrity Heuristics Score (0 to 100)
    // Starts at 100; loses 10 pts per tab switch, 6 pts per paste event, penalty for unnatural completion speed
    const numTabs = parseInt(tabSwitchCount, 10) || 0;
    const numPastes = parseInt(pasteEventsCount, 10) || 0;
    let integrityScore = 100 - (numTabs * 10) - (numPastes * 6);
    if (timeSpentMins < 40 && totalScore > 85) {
      integrityScore -= 15; // Suspiciously rapid completion with high accuracy
    }
    integrityScore = Math.max(0, Math.min(100, integrityScore));

    let integrityStatus = 'CLEAN_VERIFIED';
    let integrityLabel = 'Clean / High Trust Verification';
    if (integrityScore < 60) {
      integrityStatus = 'FLAGGED_PROCTOR_REVIEW';
      integrityLabel = 'Flagged (Severe Tab-Switch / Copy Anomaly)';
    } else if (integrityScore < 85) {
      integrityStatus = 'MONITORED_AUDIT';
      integrityLabel = 'Monitored (Minor Behavioral Warnings)';
    }

    // Automated Percentile Estimation (Gaussian normal CDF approximation across 10,000 candidates)
    // Mean = 58, StdDev = 16
    const z = (totalScore - 58) / 16;
    const cdf = 0.5 * (1 + Math.sign(z) * Math.sqrt(1 - Math.exp(-2 * z * z / Math.PI)));
    let percentile = Math.round(cdf * 100);
    percentile = Math.max(1, Math.min(99, percentile));

    // Institutional TPO Shortlist Verdict
    let shortlistVerdict = 'WAITLISTED';
    let verdictColor = '#f59e0b';
    let recommendation = 'Meets overall score but requires sectional improvement.';

    if (integrityStatus === 'FLAGGED_PROCTOR_REVIEW') {
      shortlistVerdict = 'DISQUALIFIED (INTEGRITY BREACH)';
      verdictColor = '#f43f5e';
      recommendation = `Submission flagged due to ${numTabs} unauthorized tab switch(es) and ${numPastes} clipboard paste(s). Plagiarism review required.`;
    } else if (allSectionsPassed && totalScore >= 75 && percentile >= 85) {
      shortlistVerdict = 'SHORTLISTED FOR INTERVIEW (DAY 1)';
      verdictColor = '#10b981';
      recommendation = `Outstanding performance! Top ${100 - percentile}% in batch. Cleared all 4 sectional cutoffs with verified integrity.`;
    } else if (totalScore >= 60 && !allSectionsPassed) {
      shortlistVerdict = 'BORDERLINE / SECTIONAL RETEST';
      verdictColor = '#f59e0b';
      recommendation = 'Failed one or more sectional cutoffs despite reasonable overall score. Remedial test recommended.';
    } else {
      shortlistVerdict = 'UNSUCCESSFUL';
      verdictColor = '#94a3b8';
      recommendation = 'Overall score below institutional screening threshold.';
    }

    return {
      success: true,
      assessmentId: `GATEKEEPER-${Date.now()}`,
      candidate: {
        name: candidateName,
        usn,
        collegeName
      },
      scores: {
        totalScore,
        maxScore: 100,
        percentile,
        timeSpentMins
      },
      sectionalAudit,
      integrity: {
        score: integrityScore,
        status: integrityStatus,
        label: integrityLabel,
        tabSwitches: numTabs,
        pasteEvents: numPastes
      },
      verdict: {
        shortlistVerdict,
        verdictColor,
        allSectionsPassed,
        recommendation
      }
    };
  }
}

const institutionalGatekeeperEngine = new InstitutionalGatekeeperEngine();

module.exports = {
  institutionalGatekeeperEngine,
  EXAM_SCHEMA,
  PRESETS
};
