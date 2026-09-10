/**
 * Feature 44: Branch Transition & Career Pivot Simulator
 * Horizon Universal Career & Admissions Engine
 * 
 * Simulates institutional branch change thresholds (RVCE, BMSCE, MSRIT, PES, NITK),
 * computes vacancy-adjusted admission probabilities, and constructs NEP 2020 Minor Degree
 * course maps and off-branch tech placement bridge strategies.
 */

const INSTITUTION_RULES = {
  RVCE: {
    name: 'RV College of Engineering, Bangalore',
    policyType: 'Autonomous (VTU Aligned)',
    maxBranchChangeCapPercent: 5,
    minEligibilityCgpa: 8.50,
    rules: [
      'Must clear Semesters 1 and 2 in the first attempt without any backlogs.',
      'Branch change is strictly based on Year-1 CGPA merit list against vacated/surrendered seats.',
      'Parent branch strength cannot drop below 75% of sanctioned intake.'
    ],
    branches: {
      CSE: { name: 'Computer Science and Engineering', cutoffCgpa: 9.68, vacancyTrend: 'Very Low (2-4 seats)' },
      AIML: { name: 'Artificial Intelligence & Machine Learning', cutoffCgpa: 9.45, vacancyTrend: 'Low (3-5 seats)' },
      ISE: { name: 'Information Science and Engineering', cutoffCgpa: 9.35, vacancyTrend: 'Moderate (4-6 seats)' },
      DS: { name: 'Computer Science (Data Science)', cutoffCgpa: 9.25, vacancyTrend: 'Moderate (3-5 seats)' },
      ECE: { name: 'Electronics and Communication Engineering', cutoffCgpa: 8.95, vacancyTrend: 'High (6-10 seats)' },
      EEE: { name: 'Electrical and Electronics Engineering', cutoffCgpa: 8.40, vacancyTrend: 'High (8-12 seats)' },
      MECH: { name: 'Mechanical Engineering', cutoffCgpa: 7.80, vacancyTrend: 'Very High (15+ seats)' },
      CIVIL: { name: 'Civil Engineering', cutoffCgpa: 7.50, vacancyTrend: 'Very High (15+ seats)' }
    }
  },
  BMSCE: {
    name: 'BMS College of Engineering, Bangalore',
    policyType: 'Autonomous (VTU Aligned)',
    maxBranchChangeCapPercent: 5,
    minEligibilityCgpa: 8.50,
    rules: [
      'Zero active backlogs at the end of 1st year (both SGPA >= 7.50).',
      'Merit rank determined by cumulative CGPA at end of Year 1.',
      'Supernumerary and SNQ quota students cannot change branch.'
    ],
    branches: {
      CSE: { name: 'Computer Science and Engineering', cutoffCgpa: 9.55, vacancyTrend: 'Low (3-5 seats)' },
      AIML: { name: 'AI & Data Science', cutoffCgpa: 9.30, vacancyTrend: 'Moderate (4-6 seats)' },
      ISE: { name: 'Information Science and Engineering', cutoffCgpa: 9.20, vacancyTrend: 'Moderate (4-7 seats)' },
      ECE: { name: 'Electronics & Communication', cutoffCgpa: 8.80, vacancyTrend: 'High (7-11 seats)' },
      EEE: { name: 'Electrical & Electronics', cutoffCgpa: 8.25, vacancyTrend: 'High (8-12 seats)' },
      MECH: { name: 'Mechanical Engineering', cutoffCgpa: 7.60, vacancyTrend: 'Very High (12+ seats)' }
    }
  },
  MSRIT: {
    name: 'Ramaiah Institute of Technology (MSRIT), Bangalore',
    policyType: 'Autonomous (VTU Aligned)',
    maxBranchChangeCapPercent: 5,
    minEligibilityCgpa: 8.00,
    rules: [
      'Minimum CGPA 8.00 across Semesters 1 and 2.',
      'No pending F or absent grades.',
      'Sanctioned branch capacity cannot exceed +5% of AICTE approved intake.'
    ],
    branches: {
      CSE: { name: 'Computer Science and Engineering', cutoffCgpa: 9.50, vacancyTrend: 'Low (3-6 seats)' },
      AIML: { name: 'AI and Machine Learning', cutoffCgpa: 9.28, vacancyTrend: 'Moderate (4-6 seats)' },
      ISE: { name: 'Information Science', cutoffCgpa: 9.15, vacancyTrend: 'Moderate (5-8 seats)' },
      ECE: { name: 'Electronics & Communication', cutoffCgpa: 8.75, vacancyTrend: 'High (6-10 seats)' },
      MECH: { name: 'Mechanical Engineering', cutoffCgpa: 7.55, vacancyTrend: 'Very High (14+ seats)' }
    }
  },
  PESU: {
    name: 'PES University (Ring Road Campus), Bangalore',
    policyType: 'Private State University',
    maxBranchChangeCapPercent: 10,
    minEligibilityCgpa: 8.50,
    rules: [
      'Overall 1st year composite CGPA >= 8.50.',
      'Mandatory prerequisite math & physics course grades >= B+.',
      'Branch change fee adjustment applies upon successful reallocation.'
    ],
    branches: {
      CSE: { name: 'Computer Science & Engineering', cutoffCgpa: 9.62, vacancyTrend: 'Low (5-8 seats)' },
      AIML: { name: 'CSE (AI & Machine Learning)', cutoffCgpa: 9.38, vacancyTrend: 'Moderate (6-10 seats)' },
      ECE: { name: 'Electronics & Communication', cutoffCgpa: 8.90, vacancyTrend: 'High (10-15 seats)' },
      EEE: { name: 'Electrical & Electronics', cutoffCgpa: 8.10, vacancyTrend: 'High (12-18 seats)' },
      MECH: { name: 'Mechanical Engineering', cutoffCgpa: 7.40, vacancyTrend: 'Very High (20+ seats)' }
    }
  },
  NITK: {
    name: 'National Institute of Technology Karnataka (NITK), Surathkal',
    policyType: 'Institute of National Importance (INI)',
    maxBranchChangeCapPercent: 10,
    minEligibilityCgpa: 8.50,
    rules: [
      'CGPA >= 8.50 for General/OBC, >= 7.50 for SC/ST at end of second semester.',
      'Intake of receiving branch shall not increase by more than 10%.',
      'Strength of donor branch shall not fall below 90% of current registered strength.'
    ],
    branches: {
      CSE: { name: 'Computer Science and Engineering', cutoffCgpa: 9.75, vacancyTrend: 'Very Low (1-3 seats)' },
      AI: { name: 'Artificial Intelligence', cutoffCgpa: 9.58, vacancyTrend: 'Very Low (2-4 seats)' },
      IT: { name: 'Information Technology', cutoffCgpa: 9.48, vacancyTrend: 'Low (2-4 seats)' },
      ECE: { name: 'Electronics & Communication', cutoffCgpa: 9.12, vacancyTrend: 'Moderate (4-6 seats)' },
      EEE: { name: 'Electrical & Electronics', cutoffCgpa: 8.65, vacancyTrend: 'Moderate (5-8 seats)' },
      MECH: { name: 'Mechanical Engineering', cutoffCgpa: 8.15, vacancyTrend: 'High (8-12 seats)' },
      CIVIL: { name: 'Civil Engineering', cutoffCgpa: 7.80, vacancyTrend: 'High (10-15 seats)' }
    }
  }
};

const MINOR_DEGREE_PATHWAY = {
  name: 'NEP 2020 Minor Degree in Computer Science & Systems',
  totalCredits: 18,
  durationSemesters: 'Sem 3 to Sem 7',
  eligibilityCgpa: 7.50,
  curriculum: [
    { sem: 'Sem 3', courseCode: 'CSM301', title: 'Data Structures & Algorithms', credits: 4, type: 'Core Theory + Lab', focus: 'Arrays, Trees, Graphs, Sorting, Complexity Analysis' },
    { sem: 'Sem 4', courseCode: 'CSM401', title: 'Database Management Systems & SQL', credits: 4, type: 'Core Theory + Lab', focus: 'Relational Schema, Indexing, Transactions, ACID, NoSQL' },
    { sem: 'Sem 5', courseCode: 'CSM501', title: 'Operating Systems & System Architecture', credits: 4, type: 'Core Theory', focus: 'Processes, Threads, Concurrency, Memory Virtualization, File Systems' },
    { sem: 'Sem 6', courseCode: 'CSM601', title: 'Design & Analysis of Algorithms', credits: 3, type: 'Theory', focus: 'Dynamic Programming, Greedy, Graph Algorithms, NP-Completeness' },
    { sem: 'Sem 7', courseCode: 'CSM701', title: 'Applied Machine Learning & Capstone', credits: 3, type: 'Project Lab', focus: 'Supervised/Unsupervised Learning, Cloud Deployment, End-to-End App' }
  ],
  placementImpact: {
    tier1Eligibility: '85% of Super-Dream/Dream Tech recruiters accept Minor Degree in CSE',
    averageLpaDelta: '+ ₹4.5 LPA compared to core branch benchmark',
    certOnDegree: 'Degree certificate explicitly stamped: "B.Tech in [Core Branch] with Minor in Computer Science"'
  }
};

const INDUSTRY_BRIDGE_CURRICULUM = [
  {
    phase: 'Phase 1: Algorithmic Foundations (Months 1-3)',
    target: 'Master Data Structures in C++ or Java',
    milestones: ['Solve 150 LeetCode problems (100 Medium, 50 Easy)', 'Master Two-Pointers, Sliding Window, Trees, Graphs', 'Attain 1600+ rating on CodeChef / LeetCode contest']
  },
  {
    phase: 'Phase 2: Full-Stack & Systems Engineering (Months 4-6)',
    target: 'Ship 2 Production Full-Stack Repositories',
    milestones: ['Build Next.js + Node.js/Go backend with PostgreSQL & Redis caching', 'Containerize with Docker and deploy to AWS / Render with CI/CD GitHub Actions', 'Include OpenAPI Swagger docs and 80%+ test coverage']
  },
  {
    phase: 'Phase 3: High-Level System Design (Months 7-9)',
    target: 'Pass Mid-Tier & Tier-1 Architecture Rounds',
    milestones: ['Study rate-limiting, consistent hashing, load balancing, message queues (Kafka)', 'Simulate URL shortener, Twitter timeline, and WhatsApp chat backends', 'Perform mock system design interviews with senior mentors']
  },
  {
    phase: 'Phase 4: Off-Campus & Referral Blitz (Months 10-12)',
    target: 'Convert Tech Offers Regardless of Branch',
    milestones: ['Target off-campus hiring contests (Google Kickstart/Code Jam archives, TCS CodeVita, Uber HackTag)', 'Reach out to 50+ alumni for warm employee referrals', 'Pitch non-traditional background as strong multi-disciplinary edge']
  }
];

const PRESETS = [
  {
    id: 'rvce_mech_to_cse',
    label: 'Mechanical to CSE Aspirant (RVCE - High CGPA 9.45)',
    collegeCode: 'RVCE',
    currentBranch: 'MECH',
    targetBranch: 'CSE',
    cgpa: 9.45,
    category: 'GM',
    backlogsCount: 0
  },
  {
    id: 'bmsce_civil_to_aiml',
    label: 'Civil to AI/Data Science (BMSCE - Borderline CGPA 8.70)',
    collegeCode: 'BMSCE',
    currentBranch: 'CIVIL',
    targetBranch: 'AIML',
    cgpa: 8.70,
    category: 'OBC',
    backlogsCount: 0
  },
  {
    id: 'nitk_ece_to_cse',
    label: 'ECE to Pure CSE Pivot (NITK - Competitive CGPA 9.80)',
    collegeCode: 'NITK',
    currentBranch: 'ECE',
    targetBranch: 'CSE',
    cgpa: 9.80,
    category: 'GM',
    backlogsCount: 0
  },
  {
    id: 'pesu_mech_backlog',
    label: 'Mechanical with Backlog (PESU - Disqualified Scenario)',
    collegeCode: 'PESU',
    currentBranch: 'MECH',
    targetBranch: 'CSE',
    cgpa: 8.90,
    category: 'GM',
    backlogsCount: 1
  }
];

class BranchTransitionEngine {
  getCollegesAndBranches() {
    const list = Object.keys(INSTITUTION_RULES).map(code => {
      const inst = INSTITUTION_RULES[code];
      return {
        code,
        name: inst.name,
        policyType: inst.policyType,
        minEligibilityCgpa: inst.minEligibilityCgpa,
        branches: Object.keys(inst.branches).map(bCode => ({
          code: bCode,
          name: inst.branches[bCode].name,
          cutoffCgpa: inst.branches[bCode].cutoffCgpa,
          vacancyTrend: inst.branches[bCode].vacancyTrend
        }))
      };
    });
    return { success: true, colleges: list };
  }

  getPresets() {
    return PRESETS;
  }

  simulate(params) {
    const {
      collegeCode = 'RVCE',
      currentBranch = 'MECH',
      targetBranch = 'CSE',
      cgpa = 9.0,
      category = 'GM',
      backlogsCount = 0
    } = params;

    const numCgpa = parseFloat(cgpa);
    const numBacklogs = parseInt(backlogsCount, 10) || 0;

    const inst = INSTITUTION_RULES[collegeCode] || INSTITUTION_RULES.RVCE;
    const targetBranchData = inst.branches[targetBranch] || inst.branches.CSE || Object.values(inst.branches)[0];
    const currentBranchData = inst.branches[currentBranch] || { name: currentBranch };

    // Disqualification condition 1: Active backlogs
    if (numBacklogs > 0) {
      return {
        success: true,
        eligibleToApply: false,
        feasibility: 'INELIGIBLE',
        feasibilityLabel: 'Disqualified (Active Backlog)',
        probabilityScore: 0,
        cgpaMargin: (numCgpa - targetBranchData.cutoffCgpa).toFixed(2),
        cutoffThreshold: targetBranchData.cutoffCgpa,
        targetBranchName: targetBranchData.name,
        currentBranchName: currentBranchData.name,
        institutionName: inst.name,
        verdictSummary: `You are disqualified from vertical branch change due to ${numBacklogs} active backlog(s). All universities require a 100% clean 1st-year academic record with 0 backlogs in single sitting.`,
        minorDegreeAlternative: MINOR_DEGREE_PATHWAY,
        bridgeRoadmap: INDUSTRY_BRIDGE_CURRICULUM,
        actionAdvice: [
          'Prioritize clearing your backlog in the supplementary/makeup semester immediately.',
          'Adopt the NEP 2020 Minor Degree route or self-taught SWE bridge instead of depending on vertical branch change.',
          'Start Phase 1 Data Structures practice immediately to qualify for campus IT drives in Year 3/4.'
        ]
      };
    }

    // Disqualification condition 2: Below minimum institutional application threshold
    if (numCgpa < inst.minEligibilityCgpa) {
      return {
        success: true,
        eligibleToApply: false,
        feasibility: 'INELIGIBLE',
        feasibilityLabel: 'Below Application Cutoff',
        probabilityScore: 5,
        cgpaMargin: (numCgpa - targetBranchData.cutoffCgpa).toFixed(2),
        cutoffThreshold: targetBranchData.cutoffCgpa,
        targetBranchName: targetBranchData.name,
        currentBranchName: currentBranchData.name,
        institutionName: inst.name,
        verdictSummary: `Your CGPA (${numCgpa.toFixed(2)}) is below ${inst.name}'s minimum application threshold of ${inst.minEligibilityCgpa.toFixed(2)}.`,
        minorDegreeAlternative: MINOR_DEGREE_PATHWAY,
        bridgeRoadmap: INDUSTRY_BRIDGE_CURRICULUM,
        actionAdvice: [
          'Branch change is not permitted below institution minimum cutoff.',
          'Enroll in the NEP 2020 Minor Degree in CSE (requires minimum 7.50 CGPA).',
          'Leverage online competitive programming and open-source contributions for tech placement drives.'
        ]
      };
    }

    // Merit Evaluation
    const margin = numCgpa - targetBranchData.cutoffCgpa;
    let feasibility = 'TARGET_COMPETITIVE';
    let feasibilityLabel = 'Moderate / Competitive Chance';
    let probabilityScore = 65;

    if (margin >= 0.05) {
      feasibility = 'SAFE_HIGH';
      feasibilityLabel = 'High Feasibility / Safe Bet';
      probabilityScore = Math.min(96, Math.round(85 + margin * 25));
    } else if (margin >= -0.15) {
      feasibility = 'BORDERLINE_TARGET';
      feasibilityLabel = 'Borderline Competitive';
      probabilityScore = Math.round(55 + (margin + 0.15) * 60);
    } else {
      feasibility = 'HIGH_REACH';
      feasibilityLabel = 'High Reach (Unlikely via Branch Change)';
      probabilityScore = Math.max(12, Math.round(35 + margin * 20));
    }

    const actionAdvice = [];
    if (probabilityScore >= 80) {
      actionAdvice.push(`Submit your official branch change application to the Dean/Registrar office within 48 hours of Sem 2 results declaration.`);
      actionAdvice.push(`Ensure no unverified grade cards or missing credits delay your merit serial number generation.`);
      actionAdvice.push(`Review the 2nd-year curriculum of ${targetBranchData.name} to jumpstart prerequisite coursework.`);
    } else if (probabilityScore >= 50) {
      actionAdvice.push(`Fill all preferred computer branches in descending order (e.g., CSE -> AIML -> ISE -> Data Science) to maximize your vacancy allocation.`);
      actionAdvice.push(`Register concurrently for the Minor Degree in CSE pathway as a guaranteed safety fallback.`);
      actionAdvice.push(`Begin self-studying Data Structures & Discrete Math during the summer break.`);
    } else {
      actionAdvice.push(`Do not rely exclusively on vertical branch change due to the narrow vacancy pool (${targetBranchData.vacancyTrend}).`);
      actionAdvice.push(`Opt into the NEP 2020 Minor Degree in Computer Science to obtain formal CSE credentials on your graduating degree.`);
      actionAdvice.push(`Execute the 4-phase Industry SWE Bridge Plan: 85% of tech recruiters hire cross-branch students with strong DSA and full-stack projects.`);
    }

    return {
      success: true,
      eligibleToApply: true,
      feasibility,
      feasibilityLabel,
      probabilityScore,
      cgpaMargin: margin >= 0 ? `+${margin.toFixed(2)}` : margin.toFixed(2),
      cutoffThreshold: targetBranchData.cutoffCgpa,
      targetBranchName: targetBranchData.name,
      currentBranchName: currentBranchData.name,
      institutionName: inst.name,
      policyType: inst.policyType,
      vacancyTrend: targetBranchData.vacancyTrend,
      maxCapPercent: inst.maxBranchChangeCapPercent,
      rules: inst.rules,
      verdictSummary: `With a ${numCgpa.toFixed(2)} CGPA against a historical cutoff of ${targetBranchData.cutoffCgpa.toFixed(2)}, your transition likelihood into ${targetBranchData.name} is assessed at ${probabilityScore}% (${feasibilityLabel}).`,
      minorDegreeAlternative: MINOR_DEGREE_PATHWAY,
      bridgeRoadmap: INDUSTRY_BRIDGE_CURRICULUM,
      actionAdvice
    };
  }
}

const branchTransitionEngine = new BranchTransitionEngine();

module.exports = {
  branchTransitionEngine,
  INSTITUTION_RULES,
  MINOR_DEGREE_PATHWAY,
  INDUSTRY_BRIDGE_CURRICULUM,
  PRESETS
};
