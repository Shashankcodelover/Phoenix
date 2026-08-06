/**
 * Phoenix Horizon — Diagnostic & Sector Match Engine
 * Provides ultra-fast, 3-click sector matching with zero friction.
 */

const SECTOR_MAPPINGS = {
  software_coding: {
    matchedWorld: 'tech_world',
    title: 'Tech & Software Engineering World',
    startingPhase: 'Phase 1: Programming Foundations & Algorithmic Thinking',
    recommendedDomains: ['Full-Stack Web', 'Data Structures & Algorithms', 'AI & Machine Learning', 'Mobile Dev'],
    first30DaysRoadmap: [
      { day: 1, task: 'Install VS Code, Node.js, and Git', durationMinutes: 20 },
      { day: 3, task: 'Master JavaScript Variables, Data Types & Control Flow', durationMinutes: 45 },
      { day: 7, task: 'Build your first interactive DOM web application', durationMinutes: 60 },
      { day: 14, task: 'Understand Arrays, Maps, Sets & Time Complexity (Big-O)', durationMinutes: 45 },
      { day: 21, task: 'Create a REST API backend with Express.js', durationMinutes: 60 },
      { day: 30, task: 'Deploy your project live to Vercel/Render', durationMinutes: 30 }
    ]
  },
  commerce_ca_finance: {
    matchedWorld: 'commerce_world',
    title: 'Commerce, Finance & CA World',
    startingPhase: 'Phase 1: Financial Accounting & Quantitative Aptitude',
    recommendedDomains: ['CA Foundation', 'Investment Banking', 'Corporate Law', 'Financial Analysis'],
    first30DaysRoadmap: [
      { day: 1, task: 'Understand Double-Entry Bookkeeping Principles', durationMinutes: 30 },
      { day: 5, task: 'Master Journal Entries, Ledger Posting & Trial Balance', durationMinutes: 45 },
      { day: 10, task: 'Learn Financial Statement Analysis (Balance Sheet & P&L)', durationMinutes: 60 },
      { day: 20, task: 'Solve 50 CA Foundation Quantitative Aptitude PYQs', durationMinutes: 60 },
      { day: 30, task: 'Complete 1 Full Timed Mock Exam for Accounts', durationMinutes: 90 }
    ]
  },
  medical_bio: {
    matchedWorld: 'bio_world',
    title: 'Bio-Medical & Healthcare World',
    startingPhase: 'Phase 1: NEET Biology & Organic Chemistry Core',
    recommendedDomains: ['NEET-UG Preparation', 'Biotechnology', 'Pharmacy', 'Clinical Research'],
    first30DaysRoadmap: [
      { day: 1, task: 'NCERT Human Physiology & Cell Biology Masterclass', durationMinutes: 45 },
      { day: 7, task: 'Solve 100 NEET Previous Year Questions (Biology)', durationMinutes: 60 },
      { day: 15, task: 'Organic Chemistry Reaction Mechanisms & IUPAC Naming', durationMinutes: 60 },
      { day: 30, task: 'Full Length NEET Biology Mock Test with Error Log Analysis', durationMinutes: 90 }
    ]
  },
  electronics_iot: {
    matchedWorld: 'electronics_world',
    title: 'Electronics, Hardware & Embedded Systems World',
    startingPhase: 'Phase 1: Digital Electronics & C Programming for Microcontrollers',
    recommendedDomains: ['Embedded Systems', 'IoT & Sensors', 'VLSI Design', 'Robotics'],
    first30DaysRoadmap: [
      { day: 1, task: 'Understand Logic Gates, Boolean Algebra & Truth Tables', durationMinutes: 30 },
      { day: 10, task: 'Write C Code for Arduino/ESP32 LED & Sensor Interfaces', durationMinutes: 60 },
      { day: 30, task: 'Build an Automated IoT Temperature Alert System', durationMinutes: 90 }
    ]
  },
  arts_design: {
    matchedWorld: 'arts_world',
    title: 'Arts, UI/UX Design & Media World',
    startingPhase: 'Phase 1: Design Systems, Color Theory & Visual Communication',
    recommendedDomains: ['UI/UX Product Design', 'Graphic Design', 'Content Creation', 'Digital Media'],
    first30DaysRoadmap: [
      { day: 1, task: 'Learn Figma Fundamentals & Wireframing', durationMinutes: 30 },
      { day: 10, task: 'Design a Mobile App UI with Auto-Layout & Design Tokens', durationMinutes: 60 },
      { day: 30, task: 'Publish a 3-Page Case Study Portfolio on Behance', durationMinutes: 90 }
    ]
  }
};

/**
 * Evaluates student diagnostic choices cleanly with zero friction.
 * @param {Object} input - { academicStage, interestSector, primaryGoal }
 */
function evaluateStudentDiagnostic({ academicStage, interestSector, primaryGoal }) {
  if (!academicStage || !interestSector) {
    throw new Error('Academic stage and interest sector are required.');
  }

  const mappingKey = SECTOR_MAPPINGS[interestSector] ? interestSector : 'software_coding';
  const sectorData = SECTOR_MAPPINGS[mappingKey];

  return {
    success: true,
    academicStage,
    primaryGoal: primaryGoal || 'Career & Entrance Exam Success',
    evaluatedAt: new Date().toISOString(),
    matchDetails: {
      matchedWorld: sectorData.matchedWorld,
      title: sectorData.title,
      startingPhase: sectorData.startingPhase,
      recommendedDomains: sectorData.recommendedDomains,
      first30DaysRoadmap: sectorData.first30DaysRoadmap,
    },
    redirectionUrl: `/horizon/world-dashboard.html?world=${sectorData.matchedWorld}&stage=${academicStage}`,
  };
}

module.exports = {
  evaluateStudentDiagnostic,
  SECTOR_MAPPINGS,
};
