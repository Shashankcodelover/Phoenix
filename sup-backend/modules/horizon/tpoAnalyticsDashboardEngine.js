/**
 * Feature 57: Placement Officer Institutional Analytics Dashboard (TPO Cockpit)
 * Provides comprehensive institutional-level tracking of batch placement velocity,
 * department-wise CTC distributions, Tier-1 super-dream offer rates, and an
 * algorithmic early-warning intervention engine for unplaced students.
 */

const SAMPLE_BATCH_DATA = {
  batchYear: 2026,
  institutionName: 'National Institute of Technology Karnataka (NITK) Surathkal',
  totalRegisteredStudents: 1250,
  placedStudents: 1088,
  unplacedStudents: 162,
  overallPlacementRatePct: 87.04,
  averageCtcLpa: 18.4,
  medianCtcLpa: 15.2,
  highestCtcLpa: 64.0,
  totalOffers: 1420,
  departments: [
    { code: 'CSE', name: 'Computer Science & Engineering', total: 240, placed: 232, avgCtc: 24.5, superDreamOffers: 110, massRecruiterOffers: 15 },
    { code: 'ISE', name: 'Information Science & Engineering', total: 180, placed: 171, avgCtc: 21.8, superDreamOffers: 72, massRecruiterOffers: 22 },
    { code: 'ECE', name: 'Electronics & Communication', total: 220, placed: 198, avgCtc: 17.6, superDreamOffers: 45, massRecruiterOffers: 58 },
    { code: 'EEE', name: 'Electrical & Electronics', total: 160, placed: 132, avgCtc: 13.9, superDreamOffers: 18, massRecruiterOffers: 65 },
    { code: 'MECH', name: 'Mechanical Engineering', total: 250, placed: 195, avgCtc: 11.2, superDreamOffers: 12, massRecruiterOffers: 115 },
    { code: 'CIVIL', name: 'Civil Engineering', total: 200, placed: 160, avgCtc: 9.8, superDreamOffers: 5, massRecruiterOffers: 110 }
  ],
  offerTiers: {
    superDream: { minCtcLpa: 20, count: 262, percentage: 18.45 },
    dream: { minCtcLpa: 10, maxCtcLpa: 19.9, count: 540, percentage: 38.03 },
    standardCore: { minCtcLpa: 6, maxCtcLpa: 9.9, count: 385, percentage: 27.11 },
    massRecruitment: { maxCtcLpa: 5.9, count: 233, percentage: 16.41 }
  },
  unplacedStudentRoster: [
    {
      id: 'STU-2026-089',
      name: 'Aditya Rao',
      department: 'ECE',
      cgpa: 6.42,
      activeBacklogs: 1,
      codingTestAvgScore: 42,
      interviewsAttended: 5,
      interviewsRejected: 5,
      identifiedBlocker: 'Data Structures & System Design Coding Round Failure',
      recommendedIntervention: 'Enroll in 14-day Dynamic Programming & Mock Interview Sprint'
    },
    {
      id: 'STU-2026-142',
      name: 'Sneha Patel',
      department: 'MECH',
      cgpa: 7.15,
      activeBacklogs: 0,
      codingTestAvgScore: 68,
      interviewsAttended: 3,
      interviewsRejected: 3,
      identifiedBlocker: 'Managerial & Core Behavioral Fit Round Freeze',
      recommendedIntervention: 'Schedule 1-on-1 Behavioral STAR Method Coaching with Senior Alumni'
    },
    {
      id: 'STU-2026-301',
      name: 'Rahul Kulkarni',
      department: 'EEE',
      cgpa: 5.85,
      activeBacklogs: 2,
      codingTestAvgScore: 35,
      interviewsAttended: 2,
      interviewsRejected: 2,
      identifiedBlocker: 'Low CGPA Filter & Backlog Gatekeeper Restriction',
      recommendedIntervention: 'Target Core Embedded Systems & Startups with Relaxed Academic Criteria'
    },
    {
      id: 'STU-2026-418',
      name: 'Pooja Hegde',
      department: 'CSE',
      cgpa: 8.92,
      activeBacklogs: 0,
      codingTestAvgScore: 89,
      interviewsAttended: 4,
      interviewsRejected: 4,
      identifiedBlocker: 'Super-Dream Specific Advanced System Design Bottleneck',
      recommendedIntervention: 'Pair with Tier-1 Tech Lead Alumni for Mock Distributed Systems Review'
    }
  ]
};

const INSTITUTION_PRESETS = [
  {
    id: 'nitk_tier1',
    label: 'NITK Surathkal (Tier 1 Premier Engineering)',
    institutionName: 'National Institute of Technology Karnataka',
    totalRegistered: 1250,
    placed: 1088,
    avgCtcLpa: 18.4,
    superDreamPct: 24.1
  },
  {
    id: 'bmsce_autonomous',
    label: 'BMS College of Engineering (Tier 2 Autonomous Tech)',
    institutionName: 'BMSCE Bengaluru',
    totalRegistered: 1100,
    placed: 915,
    avgCtcLpa: 11.2,
    superDreamPct: 14.5
  },
  {
    id: 'vtu_affiliated_tier3',
    label: 'Regional VTU Affiliated College (Tier 3 Mass Drive)',
    institutionName: 'Regional VTU Engineering Campus',
    totalRegistered: 850,
    placed: 512,
    avgCtcLpa: 6.2,
    superDreamPct: 3.8
  }
];

class TpoAnalyticsDashboardEngine {
  getInstitutionalSummary() {
    return SAMPLE_BATCH_DATA;
  }

  getPresets() {
    return INSTITUTION_PRESETS;
  }

  /**
   * Generates custom institution metrics or department filter
   */
  filterDepartment(deptCode) {
    if (!deptCode || deptCode === 'ALL') {
      return SAMPLE_BATCH_DATA;
    }
    const dept = SAMPLE_BATCH_DATA.departments.find(d => d.code.toUpperCase() === deptCode.toUpperCase());
    if (!dept) {
      return { success: false, message: 'Department not found' };
    }
    const deptPlacementRate = parseFloat(((dept.placed / dept.total) * 100).toFixed(2));
    const unplacedCount = dept.total - dept.placed;
    return {
      success: true,
      department: dept,
      placementRatePct: deptPlacementRate,
      unplacedCount
    };
  }

  /**
   * Evaluates student intervention triage score (0 - 100: higher = more urgent)
   */
  triageUnplacedStudent(student) {
    let urgencyScore = 30; // base

    if (student.activeBacklogs > 0) urgencyScore += 25;
    if (student.cgpa < 6.5) urgencyScore += 20;
    if (student.interviewsRejected >= 4) urgencyScore += 20;
    if (student.codingTestAvgScore < 50) urgencyScore += 15;

    urgencyScore = Math.min(100, urgencyScore);

    let triageLevel = 'MODERATE INTERVENTION';
    if (urgencyScore >= 75) triageLevel = 'CRITICAL RESCUE PROTOCOL';
    else if (urgencyScore < 45) triageLevel = 'STANDARD COACHING';

    return {
      studentId: student.id || 'STU-NEW',
      name: student.name || 'Candidate',
      urgencyScore,
      triageLevel,
      recommendedStrategy: urgencyScore >= 75
        ? 'Deploy immediate 1-on-1 TPO Mentorship + Target Startup Referral Pool'
        : 'Assign weekly structured mock tests and technical refinement'
    };
  }
}

const tpoAnalyticsDashboardEngine = new TpoAnalyticsDashboardEngine();

module.exports = {
  TpoAnalyticsDashboardEngine,
  tpoAnalyticsDashboardEngine
};
