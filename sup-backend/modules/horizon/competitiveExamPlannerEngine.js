/**
 * competitiveExamPlannerEngine.js
 * Feature 51: Competitive Exam Sprint Planner & Mock Proctor
 * 
 * Provides:
 *  - Standardized competitive examination blueprints (GATE CS, CAT MBA, GRE General, UPSC CSAT).
 *  - Sprint timetable generation with adaptive weightage allocation and phased milestones.
 *  - Mock test scoring diagnostic: calculates raw score, accuracy %, negative penalty leakage,
 *    percentile curve approximation, and targeted admission/PSU call feasibility.
 */

const EXAM_REGISTRY = {
  GATE_CS: {
    id: 'GATE_CS',
    name: 'GATE - Computer Science & Information Technology',
    conductingBody: 'IITs / IISc',
    durationMinutes: 180,
    totalQuestions: 65,
    maxMarks: 100,
    negativeMarkingRule: '1/3 mark for 1-mark MCQ; 2/3 mark for 2-mark MCQ; 0 for NAT & MSQ',
    sections: [
      { name: 'General Aptitude', questions: 10, marks: 15, weightPct: 15 },
      { name: 'Engineering Mathematics & Discrete Math', questions: 10, marks: 15, weightPct: 15 },
      { name: 'Core CS (Algo, DS, OS, DBMS, TOC, CN, Compilers, COA, Digital)', questions: 45, marks: 70, weightPct: 70 }
    ],
    subjectBreakdown: [
      { subject: 'Data Structures & Algorithms', avgMarks: 16, priority: 'Critical' },
      { subject: 'Theory of Computation & Compilers', avgMarks: 14, priority: 'High' },
      { subject: 'Operating Systems & System Calls', avgMarks: 10, priority: 'High' },
      { subject: 'Database Management Systems & SQL', avgMarks: 8, priority: 'Moderate' },
      { subject: 'Computer Networks', avgMarks: 9, priority: 'Moderate' },
      { subject: 'Computer Organization & Architecture', avgMarks: 7, priority: 'Moderate' },
      { subject: 'Digital Logic', avgMarks: 6, priority: 'Foundation' },
      { subject: 'Discrete Mathematics & Linear Algebra', avgMarks: 15, priority: 'Critical' },
      { subject: 'General Aptitude & Verbal', avgMarks: 15, priority: 'High Yield' }
    ],
    qualifyingCutoff: 27.5,
    iitDirectCallCutoff: 64.0,
    psuRecruitmentCutoff: 72.0
  },

  CAT_MBA: {
    id: 'CAT_MBA',
    name: 'CAT - Common Admission Test (IIMs)',
    conductingBody: 'Indian Institutes of Management (IIMs)',
    durationMinutes: 120,
    totalQuestions: 66,
    maxMarks: 198,
    negativeMarkingRule: '+3 for correct MCQ, -1 for wrong MCQ; 0 for Non-MCQ (TITA)',
    sections: [
      { name: 'Verbal Ability & Reading Comprehension (VARC)', questions: 24, marks: 72, timeMins: 40, weightPct: 36.4 },
      { name: 'Data Interpretation & Logical Reasoning (DILR)', questions: 20, marks: 60, timeMins: 40, weightPct: 30.3 },
      { name: 'Quantitative Ability (QA)', questions: 22, marks: 66, timeMins: 40, weightPct: 33.3 }
    ],
    subjectBreakdown: [
      { subject: 'VARC - Reading Comprehension Passages', avgMarks: 48, priority: 'Critical' },
      { subject: 'VARC - ParaJumbles, Summary, Odd One Out', avgMarks: 24, priority: 'High' },
      { subject: 'DILR - Matrices, Arrangements, Games & Tournaments', avgMarks: 36, priority: 'Critical' },
      { subject: 'DILR - Charts, Tables & Data Analytics', avgMarks: 24, priority: 'High' },
      { subject: 'QA - Arithmetic (Profit, Work, Mixtures, TSD)', avgMarks: 27, priority: 'Critical' },
      { subject: 'QA - Algebra (Quadratic, Functions, Progressions)', avgMarks: 21, priority: 'High' },
      { subject: 'QA - Geometry, Mensuration & Number Systems', avgMarks: 18, priority: 'Moderate' }
    ],
    targetPercentiles: [
      { percentile: 99.5, minScore: 102, institutions: ['IIM Ahmedabad', 'IIM Bangalore', 'IIM Calcutta'] },
      { percentile: 98.0, minScore: 84, institutions: ['IIM Lucknow', 'IIM Kozhikode', 'IIM Indore', 'FMS Delhi'] },
      { percentile: 95.0, minScore: 68, institutions: ['New IIMs (Trichy, Udaipur, Raipur)', 'SPJIMR', 'MDI Gurgaon'] },
      { percentile: 90.0, minScore: 54, institutions: ['Baby IIMs', 'IIT Bombay SJMSOM', 'IIT Delhi DMS'] }
    ]
  },

  GRE_GEN: {
    id: 'GRE_GEN',
    name: 'GRE - Graduate Record Examination General Test',
    conductingBody: 'ETS (Educational Testing Service)',
    durationMinutes: 115,
    totalQuestions: 54,
    maxMarks: 340,
    negativeMarkingRule: 'Section-adaptive algorithm; no negative penalty for incorrect choices',
    sections: [
      { name: 'Quantitative Reasoning (2 Sections)', questions: 27, scaleRange: '130 - 170', weightPct: 50 },
      { name: 'Verbal Reasoning (2 Sections)', questions: 27, scaleRange: '130 - 170', weightPct: 50 },
      { name: 'Analytical Writing (Issue Task)', questions: 1, scaleRange: '0.0 - 6.0', weightPct: 0 }
    ],
    subjectBreakdown: [
      { subject: 'Quant - Algebra & Functions', avgQuestions: 9, priority: 'Critical' },
      { subject: 'Quant - Arithmetic & Number Properties', avgQuestions: 8, priority: 'High' },
      { subject: 'Quant - Data Analysis & Probability', avgQuestions: 6, priority: 'High' },
      { subject: 'Quant - Geometry & Coordinate Geo', avgQuestions: 4, priority: 'Moderate' },
      { subject: 'Verbal - Text Completion (1, 2, 3 Blanks)', avgQuestions: 12, priority: 'Critical' },
      { subject: 'Verbal - Reading Comprehension & Critical Reasoning', avgQuestions: 10, priority: 'Critical' },
      { subject: 'Verbal - Sentence Equivalence', avgQuestions: 5, priority: 'High Yield' }
    ],
    targetBands: [
      { score: 330, tier: 'Apex Global (MIT, Stanford, CMU MSCS)', quantTarget: 168, verbalTarget: 162 },
      { score: 320, tier: 'Top 30 Tier-1 US (GaTech, UIUC, Columbia)', quantTarget: 165, verbalTarget: 155 },
      { score: 310, tier: 'Tier-2 Competitive (ASU, Stony Brook, NEU)', quantTarget: 161, verbalTarget: 149 }
    ]
  }
};

const PRESETS = [
  {
    id: 'gate_cs_top_ranker',
    label: 'GATE CS 2027 Aspirant (IIT Bombay / IISc M.Tech)',
    examId: 'GATE_CS',
    studentName: 'Ananya Sharma',
    targetDateDays: 120,
    dailyHours: 5,
    currentMockScore: 48,
    weakAreas: ['Computer Networks', 'Operating Systems & System Calls'],
    mockAttempt: {
      attempted: 52,
      correct: 38,
      incorrect: 14,
      unattempted: 13
    }
  },
  {
    id: 'cat_iim_aspirant',
    label: 'CAT 2026 Aspirant (IIM A/B/C 99+ Percentile)',
    examId: 'CAT_MBA',
    studentName: 'Rohan Mehra',
    targetDateDays: 90,
    dailyHours: 4,
    currentMockScore: 78,
    weakAreas: ['DILR - Matrices, Arrangements, Games & Tournaments'],
    mockAttempt: {
      attempted: 45,
      correct: 34,
      incorrect: 11,
      unattempted: 21
    }
  },
  {
    id: 'gre_us_fall27',
    label: 'GRE General Aspirant (Fall 2027 Global MS CS)',
    examId: 'GRE_GEN',
    studentName: 'Siddharth Roy',
    targetDateDays: 60,
    dailyHours: 3.5,
    currentMockScore: 314,
    weakAreas: ['Verbal - Text Completion (1, 2, 3 Blanks)'],
    mockAttempt: {
      attempted: 54,
      correct: 42,
      incorrect: 12,
      unattempted: 0
    }
  }
];

class CompetitiveExamPlannerEngine {
  getExams() {
    return Object.values(EXAM_REGISTRY).map(e => ({
      id: e.id,
      name: e.name,
      conductingBody: e.conductingBody,
      durationMinutes: e.durationMinutes,
      totalQuestions: e.totalQuestions,
      maxMarks: e.maxMarks,
      sections: e.sections,
      subjectBreakdown: e.subjectBreakdown
    }));
  }

  getPresets() {
    return PRESETS;
  }

  getExamById(examId) {
    return EXAM_REGISTRY[examId] || null;
  }

  /**
   * Generates a 3-phase adaptive sprint plan based on target timeline,
   * daily study capacity, and weak areas.
   */
  generateSprintPlan(params) {
    const {
      examId = 'GATE_CS',
      studentName = 'Candidate',
      targetDays = 90,
      dailyHours = 4,
      weakAreas = []
    } = params;

    const exam = EXAM_REGISTRY[examId] || EXAM_REGISTRY.GATE_CS;
    const totalDays = Math.max(14, Math.min(365, parseInt(targetDays, 10) || 90));
    const hoursPerDay = Math.max(1, Math.min(14, parseFloat(dailyHours) || 4));
    const totalStudyHours = Math.round(totalDays * hoursPerDay);

    // Phase distribution: Phase 1 (40%), Phase 2 (35%), Phase 3 (25%)
    const phase1Days = Math.round(totalDays * 0.40);
    const phase2Days = Math.round(totalDays * 0.35);
    const phase3Days = totalDays - phase1Days - phase2Days;

    const phases = [
      {
        phaseNumber: 1,
        title: 'Phase I: Deep Conceptual Foundations & Syllabus Mastery',
        durationDays: phase1Days,
        allocatedHours: Math.round(phase1Days * hoursPerDay),
        focus: 'Comprehensive topic review, formula mapping, core theorem proofs, and standard textbook illustrations.',
        keyMilestone: 'Finish 100% of subject syllabus with detailed flashcard summaries and concept notes.',
        weeklyMockCadence: '1 diagnostic sectional test every 10 days'
      },
      {
        phaseNumber: 2,
        title: 'Phase II: Previous 15-Year Question (PYQ) Drills & Weak Area Remediation',
        durationDays: phase2Days,
        allocatedHours: Math.round(phase2Days * hoursPerDay),
        focus: 'Targeted drills on high-weightage topics and identified weak vectors (' + (weakAreas.length ? weakAreas.join(', ') : 'All modules') + ').',
        keyMilestone: 'Solve 1,500+ past questions under untimed & timed conditions; calibrate speed to 2.5 min/question.',
        weeklyMockCadence: '2 sectional mocks per week + in-depth error logging'
      },
      {
        phaseNumber: 3,
        title: 'Phase III: High-Stakes Full-Length Mocks & Negative Penalty Suppression',
        durationDays: phase3Days,
        allocatedHours: Math.round(phase3Days * hoursPerDay),
        focus: 'Exact 1:1 exam environment simulation, biological clock alignment, guessing-penalty mitigation, and stamina building.',
        keyMilestone: 'Complete 12-16 full-length proctored mocks with >85% accuracy and <4 marks lost to negative penalties.',
        weeklyMockCadence: '3 full-length simulations per week at exact exam time slots'
      }
    ];

    // Subject Time Allocation
    const subjects = exam.subjectBreakdown.map(subj => {
      const isWeak = weakAreas.some(w => w.toLowerCase().includes(subj.subject.toLowerCase()) || subj.subject.toLowerCase().includes(w.toLowerCase()));
      const weightMultiplier = isWeak ? 1.4 : 1.0;
      const baseHours = Math.round((totalStudyHours / exam.subjectBreakdown.length) * weightMultiplier);

      return {
        subject: subj.subject,
        priority: isWeak ? 'URGENT REMEDIATION' : subj.priority,
        recommendedHours: baseHours,
        isWeakArea: isWeak,
        avgMarksOrQuestions: subj.avgMarks || subj.avgQuestions || 'Standard'
      };
    });

    return {
      examId: exam.id,
      examName: exam.name,
      studentName,
      totalSprintDays: totalDays,
      dailyAvailableHours: hoursPerDay,
      totalStudyHours,
      phases,
      subjects,
      proctorRecommendations: [
        'Adhere strictly to negative-marking threshold rules: Only attempt MCQs where you have eliminated at least 2 incorrect options.',
        'Never take full-length mocks late at night if your exam slot is morning (09:30 - 12:30 IST); synchronize your peak circadian focus.',
        'Maintain an active Error Log notebook categorizing every mistake into: (a) Conceptual gap, (b) Calculation slip, (c) Question misread.'
      ]
    };
  }

  /**
   * Diagnostic Mock Test Evaluation
   * Evaluates accuracy, raw score, negative marking penalty leakage,
   * percentile projection, and institutional feasibility.
   */
  evaluateMockPerformance(params) {
    const {
      examId = 'GATE_CS',
      attempted = 45,
      correct = 35,
      incorrect = 10,
      unattempted = 10
    } = params;

    const exam = EXAM_REGISTRY[examId] || EXAM_REGISTRY.GATE_CS;
    const totalQ = exam.totalQuestions;

    const att = Math.max(0, parseInt(attempted, 10) || 0);
    const corr = Math.max(0, parseInt(correct, 10) || 0);
    const inc = Math.max(0, parseInt(incorrect, 10) || 0);
    const unatt = Math.max(0, parseInt(unattempted, 10) || (totalQ - att));

    const safeAtt = Math.min(totalQ, corr + inc);
    const accuracyPct = safeAtt > 0 ? parseFloat(((corr / safeAtt) * 100).toFixed(1)) : 0;

    let rawScore = 0;
    let negativePenaltyMarks = 0;
    let maxScore = exam.maxMarks;
    let estimatedPercentile = 0;
    let predictedRankOrBand = '';
    let tacticalInsight = '';

    if (examId === 'GATE_CS') {
      // In GATE CS, approx 40% are 1-mark, 60% are 2-mark.
      // Average correct question yields ~1.54 marks.
      // Average incorrect MCQ deduction is ~0.51 marks.
      const avgMarkPerQuestion = 1.54;
      const avgPenaltyPerWrong = 0.51;

      const marksFromCorrect = corr * avgMarkPerQuestion;
      negativePenaltyMarks = parseFloat((inc * avgPenaltyPerWrong).toFixed(2));
      rawScore = parseFloat(Math.max(0, marksFromCorrect - negativePenaltyMarks).toFixed(2));

      // Percentile approximation based on GATE historical normal distribution
      // Qualifying mark ~27.5, 60 marks is ~99th percentile (Top 1000 AIR)
      if (rawScore >= 75) {
        estimatedPercentile = 99.85;
        predictedRankOrBand = 'Top 100 AIR (Direct IIT Bombay / IISc CSA / PSU Maharatna)';
      } else if (rawScore >= 64) {
        estimatedPercentile = 99.1;
        predictedRankOrBand = 'Top 500 AIR (IIT Madras, IIT Delhi, IIT Kanpur Calls)';
      } else if (rawScore >= 50) {
        estimatedPercentile = 97.5;
        predictedRankOrBand = 'Top 2,000 AIR (Top NITs - Trichy, Surathkal, Warangal)';
      } else if (rawScore >= exam.qualifyingCutoff) {
        estimatedPercentile = 85.0;
        predictedRankOrBand = 'GATE Qualified (State Universities / Self-Sponsored M.Tech)';
      } else {
        estimatedPercentile = parseFloat((Math.max(10, (rawScore / exam.qualifyingCutoff) * 75)).toFixed(1));
        predictedRankOrBand = 'Below Qualifying Threshold (Requires Phase I Foundations)';
      }

      tacticalInsight = negativePenaltyMarks > 5.0
        ? ('CRITICAL LEAKAGE: You lost ' + negativePenaltyMarks + ' marks to negative deductions. Eliminating wild guesses would boost your AIR by over 400 ranks!')
        : ('EXCELLENT ACCURACY: Strict guessing discipline kept your penalty down to ' + negativePenaltyMarks + ' marks.');

    } else if (examId === 'CAT_MBA') {
      // +3 correct, -1 wrong MCQ
      // Assume 85% of attempted are MCQs subject to negative marking
      const mcqIncorrect = Math.round(inc * 0.85);
      negativePenaltyMarks = mcqIncorrect * 1;
      rawScore = Math.max(0, (corr * 3) - negativePenaltyMarks);

      // Score-to-percentile mapping for CAT (198 max)
      // 99.5% ~102 marks, 98% ~84, 95% ~68, 90% ~54
      if (rawScore >= 105) {
        estimatedPercentile = 99.75;
        predictedRankOrBand = '99.7+ Percentile (IIM Ahmedabad, IIM Bangalore, IIM Calcutta Shortlist Feasible)';
      } else if (rawScore >= 85) {
        estimatedPercentile = 98.4;
        predictedRankOrBand = '98+ Percentile (IIM Lucknow, IIM Kozhikode, FMS Delhi Feasible)';
      } else if (rawScore >= 68) {
        estimatedPercentile = 95.2;
        predictedRankOrBand = '95+ Percentile (IIM Indore, SPJIMR, MDI Gurgaon, New IIMs)';
      } else if (rawScore >= 50) {
        estimatedPercentile = 88.0;
        predictedRankOrBand = '88-90 Percentile (Baby IIMs, IIT Delhi DMS, FORE, TAPMI)';
      } else {
        estimatedPercentile = parseFloat(Math.min(84, Math.max(15, (rawScore / 50) * 85)).toFixed(1));
        predictedRankOrBand = 'Sub-85th Percentile (Focus on high-yield Arithmetic & VARC RCs)';
      }

      tacticalInsight = (inc / safeAtt) > 0.25
        ? ('HIGH RISK ERROR RATE: Over 25% of your attempts were incorrect (-' + negativePenaltyMarks + ' marks). Enforce a minimum 80% confidence threshold before bubbling!')
        : 'SOLID DISCIPLINE: High hit-rate with minimal negative mark erosion. Focus now on increasing attempt volume in DILR sets.';

    } else if (examId === 'GRE_GEN') {
      // Scale from 260 to 340
      // 54 scored questions. Accuracy correlates directly with scaled score.
      const proportion = corr / (totalQ || 54);
      const scaledQuant = Math.min(170, Math.round(130 + (proportion * 40)));
      const scaledVerbal = Math.min(170, Math.round(130 + (proportion * 38)));
      rawScore = scaledQuant + scaledVerbal;
      maxScore = 340;
      negativePenaltyMarks = 0; // GRE has no negative penalty

      if (rawScore >= 328) {
        estimatedPercentile = 96.0;
        predictedRankOrBand = 'Apex Global CS (Stanford, CMU SCS, UC Berkeley Tier)';
      } else if (rawScore >= 318) {
        estimatedPercentile = 86.0;
        predictedRankOrBand = 'Tier-1 High Competitive (GaTech, UIUC, Columbia, Purdue)';
      } else if (rawScore >= 305) {
        estimatedPercentile = 68.0;
        predictedRankOrBand = 'Tier-2 Solid Match (ASU, Stony Brook, NEU, UT Dallas)';
      } else {
        estimatedPercentile = 45.0;
        predictedRankOrBand = 'Foundation Stage (Requires intense vocab builder & Quant fundamentals)';
      }

      tacticalInsight = 'Since GRE has NO negative marking, never leave any question unattempted! Always select a choice before the section timer expires.';
    }

    return {
      examId: exam.id,
      examName: exam.name,
      totalQuestions: totalQ,
      attempted: safeAtt,
      correct: corr,
      incorrect: inc,
      unattempted: unatt,
      accuracyPct,
      rawScore,
      maxScore,
      negativePenaltyMarks,
      estimatedPercentile,
      predictedRankOrBand,
      tacticalInsight
    };
  }
}

module.exports = new CompetitiveExamPlannerEngine();
