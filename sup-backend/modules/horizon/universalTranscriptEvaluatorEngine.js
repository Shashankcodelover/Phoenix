/**
 * Feature 45: Universal Credit Transfer & Transcript Evaluator
 * Horizon Universal Career & Admissions Engine
 * 
 * Implements WES (US 4.0 scale), ECTS (European Credits), German Bavarian Formula,
 * and UK Degree Classification conversions, with prerequisite gap audits for MS/PhD admissions.
 */

const GRADING_SYSTEMS = {
  US_WES: {
    name: 'US 4.0 Scale (WES Standard)',
    scaleMax: 4.0,
    description: 'World Education Services course-by-course evaluation standard for US graduate admissions.',
    convert: (cgpa10) => {
      const c = parseFloat(cgpa10);
      if (c >= 9.0) return 4.0;
      if (c >= 8.5) return 3.8;
      if (c >= 8.0) return 3.6;
      if (c >= 7.5) return 3.3;
      if (c >= 7.0) return 3.0;
      if (c >= 6.5) return 2.7;
      if (c >= 6.0) return 2.3;
      if (c >= 5.5) return 2.0;
      return 1.5;
    },
    letterGrade: (cgpa10) => {
      const c = parseFloat(cgpa10);
      if (c >= 9.0) return 'A (Excellent)';
      if (c >= 8.0) return 'A- / B+ (Very Good)';
      if (c >= 7.0) return 'B (Good)';
      if (c >= 6.0) return 'B- / C+ (Above Average)';
      return 'C / F (Satisfactory or Below)';
    }
  },
  GERMAN_BAVARIAN: {
    name: 'German Bavarian Formula (1.0 - 4.0 Scale)',
    description: 'Standard formula used by TU Munich, RWTH Aachen, and German uni-assist: 1.0 is highest, 4.0 is passing limit.',
    convert: (cgpa10, minPass = 4.0, maxGrade = 10.0) => {
      const c = Math.min(10.0, Math.max(minPass, parseFloat(cgpa10)));
      // Formula: 1 + 3 * ((Nmax - Nd) / (Nmax - Nmin))
      const bavarian = 1 + 3 * ((maxGrade - c) / (maxGrade - minPass));
      return parseFloat(bavarian.toFixed(2));
    },
    classification: (bavarian) => {
      if (bavarian <= 1.5) return 'Sehr Gut (Very Good / Excellent)';
      if (bavarian <= 2.5) return 'Gut (Good)';
      if (bavarian <= 3.5) return 'Befriedigend (Satisfactory)';
      if (bavarian <= 4.0) return 'Ausreichend (Sufficient)';
      return 'Nicht Bestanden (Fail)';
    }
  },
  ECTS_EUROPE: {
    name: 'European Credit Transfer System (ECTS)',
    description: 'Converts Indian undergraduate credits (approx 160-175) to European ECTS standard (approx 1.5 ECTS per Indian credit).',
    calculateEcts: (credits) => Math.round(credits * 1.5)
  },
  UK_NARIC: {
    name: 'UK ENIC / NARIC Honours Degree Classification',
    classify: (cgpa10) => {
      const c = parseFloat(cgpa10);
      if (c >= 7.75) return 'First-Class Honours (1st)';
      if (c >= 6.75) return 'Upper Second-Class Honours (2:1)';
      if (c >= 5.75) return 'Lower Second-Class Honours (2:2)';
      return 'Third-Class Honours / Pass';
    }
  }
};

const MS_CS_PREREQUISITES = [
  { id: 'math_calc', name: 'Multivariable Calculus & Differential Eq', category: 'Mathematics', requiredCredits: 4 },
  { id: 'math_la', name: 'Linear Algebra & Matrix Theory', category: 'Mathematics', requiredCredits: 3 },
  { id: 'math_prob', name: 'Probability, Random Processes & Statistics', category: 'Mathematics', requiredCredits: 4 },
  { id: 'math_discrete', name: 'Discrete Mathematics & Graph Theory', category: 'Mathematics', requiredCredits: 4 },
  { id: 'cs_dsa', name: 'Data Structures & Algorithms', category: 'Core Computer Science', requiredCredits: 4 },
  { id: 'cs_os', name: 'Operating Systems & Concurrency', category: 'Core Systems', requiredCredits: 4 },
  { id: 'cs_arch', name: 'Computer Organization & Architecture', category: 'Core Systems', requiredCredits: 4 },
  { id: 'cs_dbms', name: 'Database Management Systems', category: 'Core Computer Science', requiredCredits: 3 },
  { id: 'cs_networks', name: 'Computer Networks & Internet Protocols', category: 'Core Systems', requiredCredits: 3 },
  { id: 'cs_theory', name: 'Theory of Computation & Automata', category: 'Core Computer Science', requiredCredits: 3 }
];

const PRESETS = [
  {
    id: 'vtu_cs_high',
    label: 'Tier-1 VTU CS Graduate (CGPA 8.85 -> US MS Ready)',
    universityName: 'Visvesvaraya Technological University (Autonomous)',
    degreeProgram: 'B.E. in Computer Science and Engineering',
    cgpa: 8.85,
    totalCreditsEarned: 168,
    completedCourseIds: [
      'math_calc', 'math_la', 'math_prob', 'math_discrete',
      'cs_dsa', 'cs_os', 'cs_arch', 'cs_dbms', 'cs_networks', 'cs_theory'
    ]
  },
  {
    id: 'ece_to_cs_pivot',
    label: 'ECE Graduate Pivoting to US MS in CS (Missing Automata & OS)',
    universityName: 'Autonomous Engineering College, Bangalore',
    degreeProgram: 'B.Tech in Electronics and Communication Engineering',
    cgpa: 8.20,
    totalCreditsEarned: 164,
    completedCourseIds: [
      'math_calc', 'math_la', 'math_prob',
      'cs_dsa', 'cs_arch', 'cs_networks'
    ]
  },
  {
    id: 'mech_tum_germany',
    label: 'Mechanical Graduate Applying to TU Munich (German Scale)',
    universityName: 'NITK Surathkal',
    degreeProgram: 'B.Tech in Mechanical Engineering',
    cgpa: 8.60,
    totalCreditsEarned: 172,
    completedCourseIds: [
      'math_calc', 'math_la', 'math_prob'
    ]
  }
];

class UniversalTranscriptEvaluatorEngine {
  getGradingSystems() {
    return {
      success: true,
      systems: Object.keys(GRADING_SYSTEMS).map(k => ({
        key: k,
        name: GRADING_SYSTEMS[k].name,
        description: GRADING_SYSTEMS[k].description
      })),
      prerequisitesList: MS_CS_PREREQUISITES
    };
  }

  getPresets() {
    return PRESETS;
  }

  evaluate(params) {
    const {
      cgpa = 8.5,
      totalCreditsEarned = 160,
      completedCourseIds = [],
      targetDegreeType = 'MS_CS'
    } = params;

    const numCgpa = parseFloat(cgpa);
    const numCredits = parseInt(totalCreditsEarned, 10) || 160;

    // 1. Convert to WES 4.0
    const wesGpa = GRADING_SYSTEMS.US_WES.convert(numCgpa);
    const wesLetter = GRADING_SYSTEMS.US_WES.letterGrade(numCgpa);

    // 2. Convert to German Bavarian Scale
    const germanBavarian = GRADING_SYSTEMS.GERMAN_BAVARIAN.convert(numCgpa);
    const germanClassification = GRADING_SYSTEMS.GERMAN_BAVARIAN.classification(germanBavarian);

    // 3. Convert to ECTS
    const totalEcts = GRADING_SYSTEMS.ECTS_EUROPE.calculateEcts(numCredits);

    // 4. Convert to UK Classification
    const ukClass = GRADING_SYSTEMS.UK_NARIC.classify(numCgpa);

    // 5. Audit Prerequisites
    const completedSet = new Set(completedCourseIds);
    const auditedPrerequisites = MS_CS_PREREQUISITES.map(req => ({
      ...req,
      isFulfilled: completedSet.has(req.id)
    }));

    const fulfilledCount = auditedPrerequisites.filter(r => r.isFulfilled).length;
    const missingCount = auditedPrerequisites.filter(r => !r.isFulfilled).length;
    const prerequisiteFulfillmentPct = Math.round((fulfilledCount / MS_CS_PREREQUISITES.length) * 100);

    const levelingRecommendations = [];
    auditedPrerequisites.filter(r => !r.isFulfilled).forEach(m => {
      levelingRecommendations.push({
        course: m.name,
        category: m.category,
        recommendation: `Complete accredited online bridge: UC Berkeley Extension / Coursera Specialization in ${m.name} or MIT OCW prerequisite module.`
      });
    });

    // 6. Admissions Competitiveness
    let admissionsBand = 'Target (Top 50-100 Global)';
    if (wesGpa >= 3.8) admissionsBand = 'Ambitious / Ivy / Tier-1 (CMU, Stanford, Berkeley, TU Munich)';
    else if (wesGpa >= 3.5) admissionsBand = 'Competitive Tier-1 / Tier-2 (UIUC, Purdue, GaTech, TUM, RWTH)';
    else if (wesGpa >= 3.0) admissionsBand = 'Safe / Solid Tier-2 (ASU, UT Dallas, NEU, SUNY)';
    else admissionsBand = 'Reach / Specialized Pathway';

    const documentChecklist = [
      { doc: 'Official Degree Certificate', status: 'Mandatory', notes: 'Attested by university Registrar or State Higher Education Dept' },
      { doc: 'Consolidated Grade Card (CGC / Transcripts)', status: 'Mandatory', notes: 'Semester 1 to 8 marks sheets in university-sealed & stamped envelope' },
      { doc: 'National Academic Depository (NAD) / Digilocker ID', status: 'Digital WES Fast-Track', notes: 'Accelerates WES verification turnaround from 6 weeks to 7 business days' },
      { doc: 'Medium of Instruction (MOI) English Certificate', status: 'Recommended', notes: 'Waives TOEFL/IELTS requirements at several European & UK institutions' },
      { doc: 'Backlog / Attempt Summary Sheet', status: 'Mandatory for US/Germany', notes: 'Must show zero active backlogs at time of degree conferring' }
    ];

    return {
      success: true,
      cgpaEntered: numCgpa,
      totalCreditsEntered: numCredits,
      conversions: {
        wesGpa,
        wesLetter,
        germanBavarian,
        germanClassification,
        totalEcts,
        ukClassification: ukClass
      },
      admissionsBand,
      prerequisites: {
        total: MS_CS_PREREQUISITES.length,
        fulfilledCount,
        missingCount,
        fulfillmentPct: prerequisiteFulfillmentPct,
        details: auditedPrerequisites
      },
      levelingRecommendations,
      documentChecklist
    };
  }
}

const universalTranscriptEvaluatorEngine = new UniversalTranscriptEvaluatorEngine();

module.exports = {
  universalTranscriptEvaluatorEngine,
  GRADING_SYSTEMS,
  MS_CS_PREREQUISITES,
  PRESETS
};
