/**
 * visaImmigrationSimulatorEngine.js
 * Feature 56: Visa & Immigration Readiness Simulator
 * 
 * Provides:
 *  - US F-1, J-1, and German Student Visa risk modeling.
 *  - INA 214(b) immigrant intent risk quantification.
 *  - Financial proof ratio calculator (I-20 vs Liquid/Loan split).
 *  - TAL 221(g) administrative processing audit.
 *  - Interactive Consular Officer mock question evaluation.
 */

const VISA_CATEGORIES = [
  {
    id: 'F1_STUDENT',
    name: 'US F-1 Academic Student Visa',
    country: 'United States',
    regulations: 'INA 214(b) Non-Immigrant Intent; 1.5x 1st Year I-20 Cost Proof Mandatory',
    consularProcess: 'DS-160 + SEVIS Fee ($350) + OFC Biometrics + Consular Interview'
  },
  {
    id: 'GERMAN_NATIONAL_D',
    name: 'German National Visa (Study)',
    country: 'Germany',
    regulations: 'Mandatory Blocked Account (Sperrkonto €11,904/year) + APS Certificate Verification',
    consularProcess: 'APS India Certificate + VFS Appointment + Federal Foreign Office'
  },
  {
    id: 'J1_RESEARCH',
    name: 'US J-1 Research Scholar / Exchange Visitor',
    country: 'United States',
    regulations: 'Section 212(e) Two-Year Home-Country Physical Presence Rule',
    consularProcess: 'DS-2019 Form + SEVIS + Consular Interview'
  }
];

const MOCK_QUESTIONS = [
  {
    id: 'why_this_university',
    question: 'Why did you choose this specific university when there are comparable institutions in India?',
    goodAnswerKeywords: ['faculty', 'curriculum', 'lab', 'specialization', 'benchmarks', 'prof', 'research', 'capstone', 'coursework'],
    redFlagKeywords: ['settle', 'job opportunity', 'silicon valley money', 'earn back fast'],
    sampleModelAnswer: 'I chose Stanford specifically for its Center for Research on Foundation Models (CRFM) under Prof. Percy Liang. Their work on efficient model inference directly complements my undergraduate capstone. Additionally, the curriculum offers specialized coursework in Hardware-Aware Algorithms which is not offered at this depth in India.'
  },
  {
    id: 'who_is_funding',
    question: 'Who is funding your education, and how will your family sustain themselves in India?',
    goodAnswerKeywords: ['sanction letter', 'savings', 'parents', 'provident fund', 'liquid assets', 'loan'],
    redFlagKeywords: ['part-time job on campus to survive', 'off-campus cash job', 'uncle who promised verbally'],
    sampleModelAnswer: 'My first-year expenses of $78,000 are fully covered through a combination of an approved non-collateral education loan sanction of $55,000 from Prodigy Finance, and $35,000 in liquid fixed deposits and provident funds held by my parents, who earn an annual income of ₹32 Lakhs.'
  },
  {
    id: 'post_graduation_plans',
    question: 'What are your concrete career plans after completing your Master degree?',
    goodAnswerKeywords: ['return to india', 'bangalore tech ecosystem', 'product companies', 'startup', 'senior engineer'],
    redFlagKeywords: ['stay in us', 'green card', 'h1b lottery', 'never return'],
    sampleModelAnswer: 'Upon graduation, I plan to return to Bengaluru to join India’s rapidly growing AI infrastructure ecosystem as a Senior Systems Engineer at companies like Postman or Google India R&D. The specialized knowledge in distributed inference I gain from this degree will position me for high-impact technical leadership in our domestic market.'
  }
];

const PRESETS = [
  {
    id: 'f1_prime_applicant',
    label: 'Prime F-1 Profile (Stanford MS CS - 2.1x Financial Proof & Strong Home Ties)',
    visaType: 'F1_STUDENT',
    universityName: 'Stanford University',
    firstYearCostUsd: 78000,
    liquidFundsUsd: 45000,
    loanSanctionUsd: 75000,
    sponsorRelationship: 'Parents (Father: Director of Engineering)',
    postStudyPlan: 'Return to Bengaluru to join India’s burgeoning AI infrastructure sector',
    hasPropertyOrFamilyTies: true,
    researchArea: 'Natural Language Processing & Compiler Optimization'
  },
  {
    id: 'f1_borderline_risk',
    label: 'Borderline F-1 Profile (Tight Funds 1.1x & High Immigrant Intent Flag)',
    visaType: 'F1_STUDENT',
    universityName: 'Arizona State University (ASU)',
    firstYearCostUsd: 48000,
    liquidFundsUsd: 15000,
    loanSanctionUsd: 38000,
    sponsorRelationship: 'Distant Relative / Personal Savings',
    postStudyPlan: 'Work in California permanently under OPT and H-1B',
    hasPropertyOrFamilyTies: false,
    researchArea: 'General Software Engineering'
  },
  {
    id: 'german_sperrkonto_verified',
    label: 'German National D Visa (TUM Informatics - Blocked Account Verified)',
    visaType: 'GERMAN_NATIONAL_D',
    universityName: 'Technical University of Munich (TUM)',
    firstYearCostUsd: 20000,
    liquidFundsUsd: 24000,
    loanSanctionUsd: 0,
    sponsorRelationship: 'Self-Funded Blocked Account (Expatrio / Fintiba)',
    postStudyPlan: 'Gain European automotive systems exposure and return to India mobility hub',
    hasPropertyOrFamilyTies: true,
    researchArea: 'Autonomous Robotics & Automotive Systems'
  }
];

class VisaImmigrationSimulatorEngine {
  getVisaCategories() {
    return VISA_CATEGORIES;
  }

  getMockQuestions() {
    return MOCK_QUESTIONS;
  }

  getPresets() {
    return PRESETS;
  }

  /**
   * Calculates comprehensive immigration readiness, financial ratio,
   * and INA 214(b) / 221(g) risk probabilities.
   */
  evaluateVisaReadiness(params) {
    const {
      visaType = 'F1_STUDENT',
      firstYearCostUsd = 60000,
      liquidFundsUsd = 35000,
      loanSanctionUsd = 50000,
      postStudyPlan = 'Return to home country',
      hasPropertyOrFamilyTies = true,
      researchArea = 'Computer Science'
    } = params;

    const totalAvailableUsd = (parseFloat(liquidFundsUsd) || 0) + (parseFloat(loanSanctionUsd) || 0);
    const i20Cost = Math.max(1000, parseFloat(firstYearCostUsd) || 60000);
    const coverageRatio = parseFloat((totalAvailableUsd / i20Cost).toFixed(2));

    // INA 214(b) Immigrant Intent Risk (Scale 0 - 100: lower is safer)
    let immigrantRiskScore = 15; // baseline low risk

    // Check plan for immigrant intent red flags
    const planLower = (postStudyPlan || '').toLowerCase();
    if (planLower.includes('permanent') || planLower.includes('green card') || planLower.includes('stay in us') || planLower.includes('never return')) {
      immigrantRiskScore += 55;
    } else if (planLower.includes('return') || planLower.includes('india') || planLower.includes('home country')) {
      immigrantRiskScore -= 5;
    }

    if (!hasPropertyOrFamilyTies) {
      immigrantRiskScore += 15;
    }

    // Financial adequacy impact on 214(b)
    if (coverageRatio < 1.2) {
      immigrantRiskScore += 25;
    } else if (coverageRatio >= 1.7) {
      immigrantRiskScore -= 5;
    }

    immigrantRiskScore = Math.max(5, Math.min(95, immigrantRiskScore));

    // Approval Probability %
    const approvalProbPct = Math.max(10, Math.min(98, 100 - immigrantRiskScore));

    // 221(g) Technology Alert List (TAL) check
    const talKeywords = ['nuclear', 'missile', 'satellite', 'quantum cryptography', 'biochemical', 'hypersonic', 'surveillance'];
    const hasTalRisk = talKeywords.some(kw => researchArea.toLowerCase().includes(kw));

    let riskBand = 'Low Risk (High Approval Feasibility)';
    if (immigrantRiskScore >= 60) {
      riskBand = 'High Risk (Severe INA 214(b) Rejection Hazard)';
    } else if (immigrantRiskScore >= 35) {
      riskBand = 'Moderate Risk (Requires Rehearsed Consular Defense)';
    }

    return {
      visaType,
      i20CostUsd: i20Cost,
      totalAvailableUsd,
      financialCoverageRatio: coverageRatio,
      financialStatus: coverageRatio >= 1.5 ? 'Optimal (Exceeds 1.5x Rule)' : (coverageRatio >= 1.0 ? 'Adequate (Meets 1.0x Bare Minimum)' : 'Deficit (High Rejection Probability)'),
      immigrantIntentRiskScore: immigrantRiskScore,
      riskBand,
      approvalProbabilityPct: approvalProbPct,
      talAdministrativeCheck221g: hasTalRisk ? 'High Probability of 221(g) TAL Administrative Processing' : 'Clear (Standard 221(g) Clearance Expected)',
      consularDefenses: [
        coverageRatio < 1.5
          ? 'CRITICAL DEFICIT: Supplement funds with a co-signed bank education loan sanction letter to demonstrate minimum 1.5x coverage of 1st year cost.'
          : 'STRONG FINANCIAL SOLVENCY: Clearly state the liquid vs loan ratio in the first 10 seconds of the interview.',
        immigrantRiskScore > 40
          ? 'INA 214(b) WARNING: Never mention intentions of pursuing H-1B lottery or settling abroad. Explicitly state post-graduation intent to return to India.'
          : 'NON-IMMIGRANT INTENT CERTIFIED: Anchor post-graduation plans to specific high-paying roles in India tech ecosystem.'
      ]
    };
  }

  /**
   * Evaluates student's answer to consular questions
   */
  scoreConsularAnswer(questionId, answerText) {
    const qObj = MOCK_QUESTIONS.find(q => q.id === questionId) || MOCK_QUESTIONS[0];
    const text = (answerText || '').toLowerCase();

    let matchedGoods = 0;
    qObj.goodAnswerKeywords.forEach(kw => {
      if (text.includes(kw.toLowerCase())) matchedGoods++;
    });

    let matchedFlags = 0;
    qObj.redFlagKeywords.forEach(rf => {
      if (text.includes(rf.toLowerCase())) matchedFlags++;
    });

    let score = 70 + (matchedGoods * 7) - (matchedFlags * 25);
    score = Math.max(20, Math.min(100, score));

    return {
      questionId: qObj.id,
      question: qObj.question,
      answerWordCount: answerText.trim().split(/\s+/).length,
      clarityScore: score,
      status: matchedFlags > 0 ? 'RED FLAG DETECTED' : (score >= 80 ? 'EXCELLENT' : 'NEEDS REFINEMENT'),
      feedback: matchedFlags > 0
        ? 'Dangerous phrase detected indicating immigrant intent or financial desperation. Rewrite to emphasize temporary academic intent.'
        : 'Solid concise answer with credible technical and academic rationale.',
      modelAnswer: qObj.sampleModelAnswer
    };
  }
}

module.exports = new VisaImmigrationSimulatorEngine();
