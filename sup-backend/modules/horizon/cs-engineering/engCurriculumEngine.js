/**
 * Phoenix Horizon — Engineering CS/IT Stream Engine
 * ===================================================
 * REALITY CHECK (as an Engineering CS student):
 * - You're 18-22 years old, B.E/B.Tech CS/IT/IS
 * - College curriculum is 5-10 years behind what industry uses
 * - You learn Turbo C++ in lab while industry uses VS Code + TypeScript + Docker
 * - Placement season hits in 7th semester — if you haven't prepared, it's too late
 * - DSA is the gatekeeper for every product company (Google, Microsoft, Amazon)
 * - System Design questions start appearing for 6+ LPA packages
 * - 80% of students start "serious preparation" only 3 months before placements
 *   and wonder why they don't clear even the first round
 *
 * THIS ENGINE CONNECTS DIRECTLY TO PILLAR 1 (INTERVIEW PREP)
 */

// ═══════════════════════════════════════════════════════════
// SECTION 1: SEMESTER-WISE SKILL GAP ANALYSIS
// ═══════════════════════════════════════════════════════════

const ENGINEERING_SEMESTER_GAP = {
  sem1_2: {
    name: '1st Year (Semester 1 & 2)',
    whatCollegeTeaches: [
      { topic: 'Engineering Mathematics I & II (Linear Algebra, Calculus, Differential Equations)', industryRelevance: 'MEDIUM', gap: 'Required for ML/AI roles but taught without real-world application context.' },
      { topic: 'Programming with C/C++ (Basic syntax, loops, functions)', industryRelevance: 'MEDIUM', gap: 'Uses Turbo C++. Industry uses VS Code. Students cannot run code outside the lab.' },
      { topic: 'Physics, Chemistry, Workshop Practice', industryRelevance: 'LOW', gap: 'Required for university credits but zero direct relevance for software engineering careers.' },
    ],
    whatToDoInsteadAlongside: [
      'Install VS Code + Node.js + Git on your personal laptop from Day 1.',
      'Complete CS50 by Harvard (free, best intro to CS thinking).',
      'Create a GitHub account and push EVERY assignment you write.',
      'Learn HTML + CSS + JavaScript basics during holidays.',
      'Join the college coding club / ACM student chapter.',
    ],
  },
  sem3_4: {
    name: '2nd Year (Semester 3 & 4)',
    whatCollegeTeaches: [
      { topic: 'Data Structures (Arrays, Linked Lists, Trees, Graphs, Hashing)', industryRelevance: 'CRITICAL', gap: 'Right topic but only theory + textbook pseudocode. Students cannot solve a LeetCode Easy after this.' },
      { topic: 'Object-Oriented Programming with Java/C++', industryRelevance: 'HIGH', gap: 'Teaches class syntax but not SOLID principles, design patterns, or clean architecture.' },
      { topic: 'Discrete Mathematics', industryRelevance: 'HIGH', gap: 'Actually useful for graph theory, combinatorics, and logic — but taught so boringly that students hate it.' },
      { topic: 'Computer Architecture & Organization', industryRelevance: 'MEDIUM', gap: 'Good for embedded systems roles but irrelevant for most web/app developer roles.' },
    ],
    whatToDoInsteadAlongside: [
      'This is THE make-or-break year. Start solving LeetCode/GFG problems daily.',
      'Target: 100 problems solved by end of 2nd year (mix of Easy and Medium).',
      'Build 1 complete full-stack project (MERN stack or equivalent). Deploy it live.',
      'Start competitive programming (CodeForces, CodeChef) for speed training.',
      'Attend your FIRST hackathon. Win or lose, the experience is invaluable.',
    ],
  },
  sem5_6: {
    name: '3rd Year (Semester 5 & 6)',
    whatCollegeTeaches: [
      { topic: 'DBMS (Normalization, SQL, ER Diagrams, Transactions)', industryRelevance: 'HIGH', gap: 'Good foundation but missing: indexing strategy, query optimization, NoSQL, ORM patterns.' },
      { topic: 'Operating Systems (Process management, Scheduling, Memory, Deadlocks)', industryRelevance: 'HIGH', gap: 'Theory-focused. Missing: Linux system administration, Docker, container orchestration.' },
      { topic: 'Computer Networks (OSI, TCP/IP, HTTP, DNS)', industryRelevance: 'HIGH', gap: 'Good concepts but no hands-on networking lab with Wireshark, curl, or real API debugging.' },
      { topic: 'Software Engineering (SDLC, Waterfall, Agile, UML)', industryRelevance: 'MEDIUM', gap: 'Memorizes UML diagrams but never uses Jira, Git branching strategies, or CI/CD pipelines.' },
    ],
    whatToDoInsteadAlongside: [
      'INTERNSHIP IS MANDATORY. Apply to at least 20 companies for summer internship.',
      'Target: 200+ DSA problems solved. Medium difficulty should feel "comfortable".',
      'Build 2 more projects. At least 1 should be team-based (proves collaboration skills).',
      'Learn System Design basics: Load Balancers, Caching, Database Sharding, Message Queues.',
      'Start mock interviews with peers. Use Phoenix Interview Prep P2P rooms.',
      'Prepare your resume. Use ATS-friendly format. Get it reviewed by 3+ seniors.',
    ],
  },
  sem7_8: {
    name: '4th Year (Semester 7 & 8)',
    whatCollegeTeaches: [
      { topic: 'Electives (Machine Learning, Cloud Computing, Cyber Security)', industryRelevance: 'HIGH', gap: 'Finally relevant but often 1 elective per semester. Choose wisely based on your target role.' },
      { topic: 'Final Year Project (Capstone Project)', industryRelevance: 'HIGH', gap: 'Must be an ORIGINAL project — not a copy from YouTube. Must be deployed, tested, and documented.' },
    ],
    whatToDoInsteadAlongside: [
      'PLACEMENT SEASON IS HERE. If you followed this roadmap, you are ready.',
      'Target: 300+ DSA problems. Hard problems should be "attemptable" within 45 minutes.',
      'System Design: Can design Twitter, URL Shortener, Rate Limiter, Chat System from scratch.',
      'Behavioral prep: STAR stories ready for "Tell me about a time when..." questions.',
      'Salary negotiation: Know your market value (use Phoenix Compensation Benchmark Engine).',
    ],
  },
};

// ═══════════════════════════════════════════════════════════
// SECTION 2: 8-SEMESTER PLACEMENT-ORIENTED ROADMAP
// ═══════════════════════════════════════════════════════════

const ENGINEERING_CS_ROADMAP = [
  { semester: 'Sem 1', academicFocus: 'C/C++ basics, Engineering Math', selfStudyFocus: 'Install dev tools. Complete CS50. Create GitHub profile. Build 1 HTML/CSS site.', dsaTarget: '0-10 problems', projectTarget: '1 static website', weeklyHours: 6 },
  { semester: 'Sem 2', academicFocus: 'Math II, Physics, Workshop', selfStudyFocus: 'Learn JavaScript. Build 1 interactive mini-app. Push everything to GitHub.', dsaTarget: '10-30 problems', projectTarget: '1 JS interactive app', weeklyHours: 8 },
  { semester: 'Sem 3', academicFocus: 'Data Structures, Discrete Math', selfStudyFocus: 'DSA sprint begins. Arrays, Strings, HashMaps, Two Pointers. Solve daily.', dsaTarget: '30-80 problems', projectTarget: '1 backend API project', weeklyHours: 12 },
  { semester: 'Sem 4', academicFocus: 'OOP Java, Computer Arch', selfStudyFocus: 'Trees, Graphs, BFS/DFS, Dynamic Programming intro. First hackathon.', dsaTarget: '80-150 problems', projectTarget: '1 full-stack MERN app (deployed)', weeklyHours: 14 },
  { semester: 'Sem 5', academicFocus: 'DBMS, OS, Networks', selfStudyFocus: 'Apply for internships (20+ applications). Advanced DSA patterns. System Design basics.', dsaTarget: '150-220 problems', projectTarget: 'Internship project + 1 team project', weeklyHours: 15 },
  { semester: 'Sem 6', academicFocus: 'SE, Compiler Design', selfStudyFocus: 'SUMMER INTERNSHIP. Production codebase experience. Mock interviews weekly.', dsaTarget: '220-280 problems', projectTarget: 'Internship deliverable shipped', weeklyHours: 40 },
  { semester: 'Sem 7', academicFocus: 'Electives + Capstone Project', selfStudyFocus: 'PLACEMENT SEASON. Attend drives. System Design + Behavioral prep. Resume polished.', dsaTarget: '280-350 problems', projectTarget: 'Capstone project deployed', weeklyHours: 20 },
  { semester: 'Sem 8', academicFocus: 'Final Project + Exams', selfStudyFocus: 'Continue off-campus applications if needed. GATE prep if pursuing M.Tech.', dsaTarget: '350+ problems', projectTarget: 'Production-quality portfolio', weeklyHours: 15 },
];

// ═══════════════════════════════════════════════════════════
// SECTION 3: PLACEMENT READINESS DIAGNOSTIC
// ═══════════════════════════════════════════════════════════

function evaluatePlacementReadiness({ dsaProblemsSolved, projectsDeployed, internshipsDone, mockInterviewsDone, systemDesignTopicsStudied, semester }) {
  const scores = {
    dsaScore: Math.min(100, (dsaProblemsSolved / 300) * 100),
    projectScore: Math.min(100, (projectsDeployed / 3) * 100),
    internshipScore: internshipsDone >= 1 ? 100 : 0,
    mockInterviewScore: Math.min(100, (mockInterviewsDone / 10) * 100),
    systemDesignScore: Math.min(100, (systemDesignTopicsStudied / 8) * 100),
  };

  const overallReadiness = Math.round(
    (scores.dsaScore * 0.35) + (scores.projectScore * 0.25) + (scores.internshipScore * 0.15) +
    (scores.mockInterviewScore * 0.15) + (scores.systemDesignScore * 0.10)
  );

  let verdict, urgentActions;
  if (overallReadiness >= 80) {
    verdict = 'PLACEMENT READY — You are in the top 10% of candidates. Keep sharpening.';
    urgentActions = ['Focus on company-specific preparation', 'Practice behavioral STAR stories', 'Negotiate salary confidently'];
  } else if (overallReadiness >= 50) {
    verdict = 'PARTIALLY READY — You have gaps that will cost you in interviews. Act NOW.';
    urgentActions = [];
    if (scores.dsaScore < 70) urgentActions.push('URGENT: Solve 5 DSA problems per day until you hit 250+');
    if (scores.projectScore < 70) urgentActions.push('URGENT: Build and deploy 1 production-quality project this month');
    if (scores.internshipScore === 0) urgentActions.push('URGENT: Apply to 20 internships/part-time roles immediately');
    if (scores.mockInterviewScore < 50) urgentActions.push('URGENT: Schedule 2 peer mock interviews per week');
  } else {
    verdict = 'NOT READY — Major preparation gaps. You need an intensive sprint starting TODAY.';
    urgentActions = [
      'START DSA today. Solve 3 easy problems today. No excuses.',
      'Pick 1 project idea and start building it TODAY.',
      'Create a GitHub profile and start committing code DAILY.',
      'Join Phoenix P2P Mock Interview rooms for weekly practice.',
    ];
  }

  return { success: true, semester, scores, overallReadiness, verdict, urgentActions };
}

// ═══════════════════════════════════════════════════════════
// EXPORTED API FUNCTIONS
// ═══════════════════════════════════════════════════════════

function getEngSemesterGapAnalysis(semesterKey) {
  if (semesterKey) {
    const data = ENGINEERING_SEMESTER_GAP[semesterKey];
    if (!data) return { success: false, error: `Semester "${semesterKey}" not found. Available: ${Object.keys(ENGINEERING_SEMESTER_GAP).join(', ')}` };
    return { success: true, ...data };
  }
  return { success: true, semesters: ENGINEERING_SEMESTER_GAP };
}

function getEngRoadmap() {
  return { success: true, engine: 'Engineering CS 8-Semester Placement Roadmap', totalSemesters: ENGINEERING_CS_ROADMAP.length, roadmap: ENGINEERING_CS_ROADMAP };
}

module.exports = {
  getEngSemesterGapAnalysis, getEngRoadmap, evaluatePlacementReadiness,
  ENGINEERING_SEMESTER_GAP, ENGINEERING_CS_ROADMAP,
};
