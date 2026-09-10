/**
 * Feature 50: Study Abroad & Global MS/PhD Admissions Engine
 * Horizon Universal Career & Admissions Engine
 * 
 * Evaluates student test metrics (GRE, TOEFL, IELTS, CGPA) against international graduate
 * standards, generates tri-tier university categorization (Ambitious, Target, Safe),
 * computes I-20 financial proof requirements, and tracks application deadline radar.
 */

const UNIVERSITIES_CATALOG = [
  {
    id: 'stanford_ms_cs',
    name: 'Stanford University',
    country: 'USA',
    program: 'M.S. in Computer Science',
    tierLevel: 'Apex Ivy-Plus',
    minGpaWes: 3.80,
    recommendedGreQuant: 168,
    minToefl: 105,
    minIelts: 8.0,
    annualTuitionUsd: 62500,
    estimatedLivingUsd: 28000,
    fallDeadline: 'December 1',
    acceptanceRatePct: 8.5,
    strengths: ['AI/ML', 'Systems', 'Theoretical Computer Science', 'Silicon Valley Network']
  },
  {
    id: 'cmu_ms_cs',
    name: 'Carnegie Mellon University (CMU)',
    country: 'USA',
    program: 'M.S. in Computer Science (SCS)',
    tierLevel: 'Apex CS (#1 US News)',
    minGpaWes: 3.75,
    recommendedGreQuant: 167,
    minToefl: 104,
    minIelts: 7.5,
    annualTuitionUsd: 58500,
    estimatedLivingUsd: 22000,
    fallDeadline: 'December 10',
    acceptanceRatePct: 9.2,
    strengths: ['Software Engineering', 'Robotics', 'Language Technologies', 'Computer Systems']
  },
  {
    id: 'uiuc_ms_cs',
    name: 'University of Illinois Urbana-Champaign (UIUC)',
    country: 'USA',
    program: 'M.S. in Computer Science',
    tierLevel: 'Tier-1 Public Ivy',
    minGpaWes: 3.60,
    recommendedGreQuant: 165,
    minToefl: 102,
    minIelts: 7.5,
    annualTuitionUsd: 38500,
    estimatedLivingUsd: 18000,
    fallDeadline: 'December 15',
    acceptanceRatePct: 18.0,
    strengths: ['Parallel Computing', 'Compilers', 'Data Mining', 'Cloud Architecture']
  },
  {
    id: 'gatech_ms_cs',
    name: 'Georgia Institute of Technology',
    country: 'USA',
    program: 'M.S. in Computer Science',
    tierLevel: 'Tier-1 Top Tech',
    minGpaWes: 3.50,
    recommendedGreQuant: 164,
    minToefl: 100,
    minIelts: 7.5,
    annualTuitionUsd: 33500,
    estimatedLivingUsd: 17500,
    fallDeadline: 'February 1',
    acceptanceRatePct: 24.5,
    strengths: ['High-Performance Computing', 'Machine Learning', 'Cybersecurity', 'Robotics']
  },
  {
    id: 'asu_ms_cs',
    name: 'Arizona State University (ASU)',
    country: 'USA',
    program: 'M.S. in Computer Science',
    tierLevel: 'Solid Tier-2 High-Intake',
    minGpaWes: 3.20,
    recommendedGreQuant: 160,
    minToefl: 90,
    minIelts: 6.5,
    annualTuitionUsd: 32000,
    estimatedLivingUsd: 16000,
    fallDeadline: 'March 1',
    acceptanceRatePct: 48.0,
    strengths: ['Software Engineering', 'Information Assurance', 'Biomedical Informatics']
  },
  {
    id: 'tum_ms_informatics',
    name: 'Technical University of Munich (TUM)',
    country: 'Germany',
    program: 'M.Sc. in Informatics',
    tierLevel: 'European Apex Engineering',
    minGpaWes: 3.50,
    bavarianCutoff: 1.9,
    recommendedGreQuant: 162,
    minToefl: 88,
    minIelts: 6.5,
    annualTuitionUsd: 6500, // €6,000
    estimatedLivingUsd: 13500,
    fallDeadline: 'May 31',
    acceptanceRatePct: 22.0,
    strengths: ['Autonomous Systems', 'Software Engineering', 'Computer Graphics', 'German Industry Ties']
  }
];

const PRESETS = [
  {
    id: 'top_tier_ivy_aspirant',
    label: 'High-Aptitude Tier-1 Aspirant (Stanford / CMU Reach)',
    studentName: 'Varun K. Bharadwaj',
    cgpa: 9.25,
    greQuant: 169,
    greVerbal: 161,
    toeflScore: 112,
    ieltsScore: 8.5,
    budgetCeilingUsd: 85000,
    researchPapersCount: 2
  },
  {
    id: 'balanced_us_target',
    label: 'Balanced Competitor (UIUC / GaTech Target)',
    studentName: 'Shreya Sundaram',
    cgpa: 8.45,
    greQuant: 165,
    greVerbal: 155,
    toeflScore: 104,
    ieltsScore: 7.5,
    budgetCeilingUsd: 60000,
    researchPapersCount: 1
  },
  {
    id: 'budget_europe_scholar',
    label: 'Budget-Optimized European Scholar (TU Munich / Germany)',
    studentName: 'Naveen Kumar M.',
    cgpa: 8.70,
    greQuant: 162,
    greVerbal: 152,
    toeflScore: 98,
    ieltsScore: 7.5,
    budgetCeilingUsd: 30000,
    researchPapersCount: 0
  }
];

class StudyAbroadEngine {
  getUniversities() {
    return {
      success: true,
      totalUniversities: UNIVERSITIES_CATALOG.length,
      universities: UNIVERSITIES_CATALOG
    };
  }

  getPresets() {
    return PRESETS;
  }

  evaluate(profile) {
    const {
      cgpa = 8.5,
      greQuant = 164,
      greVerbal = 155,
      toeflScore = 100,
      ieltsScore = 7.5,
      budgetCeilingUsd = 65000
    } = profile;

    const numCgpa = parseFloat(cgpa) || 8.5;
    const qScore = parseInt(greQuant, 10) || 160;
    const vScore = parseInt(greVerbal, 10) || 150;
    const toefl = parseInt(toeflScore, 10) || 95;
    const ielts = parseFloat(ieltsScore) || 7.0;
    const totalGre = qScore + vScore;

    // Convert Indian CGPA to approx WES GPA
    let wesGpa = 3.3;
    if (numCgpa >= 9.0) wesGpa = 3.9;
    else if (numCgpa >= 8.5) wesGpa = 3.7;
    else if (numCgpa >= 8.0) wesGpa = 3.5;
    else if (numCgpa >= 7.5) wesGpa = 3.3;
    else wesGpa = 3.0;

    const ambitious = [];
    const target = [];
    const safe = [];

    UNIVERSITIES_CATALOG.forEach(u => {
      // Evaluation scoring
      const gpaDiff = wesGpa - u.minGpaWes;
      const quantDiff = qScore - u.recommendedGreQuant;
      const engPassed = toefl >= u.minToefl || ielts >= u.minIelts;

      const compositeRating = gpaDiff * 15 + quantDiff * 2.5 + (engPassed ? 5 : -15);

      const universityCard = {
        ...u,
        engRequirementMet: engPassed,
        estimated1stYearCostUsd: u.annualTuitionUsd + u.estimatedLivingUsd,
        estimated1stYearCostInr: Math.round((u.annualTuitionUsd + u.estimatedLivingUsd) * 86.5) // current USD-INR
      };

      if (u.acceptanceRatePct < 15 || compositeRating < -2) {
        ambitious.push(universityCard);
      } else if (compositeRating >= 10 && u.acceptanceRatePct >= 35) {
        safe.push(universityCard);
      } else {
        target.push(universityCard);
      }
    });

    // Ensure balanced distribution if student has high stats
    if (safe.length === 0 && target.length > 2) {
      safe.push(target.pop());
    }

    const avg1stYearProofInr = 4500000; // ~45 Lakhs INR standard I-20 proof
    const visaFinancialAdvice = [
      'For US F-1 Visa: Financial documentation must show 1.5x of the 1st-year official I-20 amount (liquid funds + sanction letter).',
      'For Germany (TUM): Blocked account (Sperrkonto) mandates €11,904 for 2026/27 cost of living proof.',
      'Approved funding mix: 50% NBFC/Bank Education Loan sanction + 30% Savings/Fixed Deposits + 20% Provident Fund (PF) balance.'
    ];

    return {
      success: true,
      profileSummary: {
        wesGpaEstimated: wesGpa,
        totalGre,
        greQuant: qScore,
        toefl,
        ielts
      },
      categorization: {
        ambitious: { count: ambitious.length, universities: ambitious },
        target: { count: target.length, universities: target },
        safe: { count: safe.length, universities: safe }
      },
      financialProofPlan: {
        recommendedLiquidFundUsd: 55000,
        recommendedLiquidFundInr: 4750000,
        visaFinancialAdvice
      }
    };
  }
}

const studyAbroadEngine = new StudyAbroadEngine();

module.exports = {
  studyAbroadEngine,
  UNIVERSITIES_CATALOG,
  PRESETS
};
