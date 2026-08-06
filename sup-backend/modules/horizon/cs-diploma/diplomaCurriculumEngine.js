/**
 * Phoenix Horizon — Diploma CS/IT Stream Engine
 * ===================================================
 * REALITY CHECK (as a Diploma CS student):
 * - You're 15-16 years old, chose Polytechnic after 10th instead of PU
 * - 3-year technical diploma in Computer Science / Information Science
 * - Your college teaches C, C++, Java, basic HTML, DBMS, Networking
 * - BUT: No DSA, no version control, no modern web frameworks, no deployment
 * - DCET (Diploma Common Entrance Test) is your gate to B.E lateral entry (2nd year)
 * - You can also get Junior Engineer (JE) government jobs directly with diploma
 * - BIGGEST GAP: Diploma students entering engineering are 1 year behind regular students
 *   because they skip 1st year engineering fundamentals
 *
 * THIS ENGINE BRIDGES THAT GAP.
 */

// ═══════════════════════════════════════════════════════════
// SECTION 1: DIPLOMA CS SYLLABUS vs INDUSTRY REALITY
// ═══════════════════════════════════════════════════════════

const DIPLOMA_CS_SYLLABUS_REALITY = {
  whatCollegeTeaches: {
    year1: [
      { topic: 'Engineering Mathematics (Algebra, Trigonometry, Calculus basics)', industryRelevance: 'MEDIUM', gap: 'Needed for DCET/GATE but taught too theoretically. Practice numerical problems.' },
      { topic: 'Engineering Physics & Chemistry', industryRelevance: 'LOW', gap: 'Required for DCET exam but zero direct industry application for CS students.' },
      { topic: 'C Programming (syntax, loops, arrays, strings)', industryRelevance: 'MEDIUM', gap: 'Same as PU — teaches printf/scanf but not problem-solving or algorithmic thinking.' },
      { topic: 'Digital Electronics & Computer Organization', industryRelevance: 'MEDIUM', gap: 'Good foundational knowledge for embedded systems, but taught without lab hardware.' },
    ],
    year2: [
      { topic: 'Data Structures (Stack, Queue, Linked List, Tree basics)', industryRelevance: 'HIGH', gap: 'RIGHT TOPIC but stops at theory. Never teaches when/why to use these in real problems.' },
      { topic: 'Java Programming (OOP, Inheritance, Polymorphism)', industryRelevance: 'HIGH', gap: 'Good foundation but limited to console programs. No web frameworks, no Spring Boot, no REST APIs.' },
      { topic: 'DBMS & SQL (Normalization, Joins, ERD)', industryRelevance: 'HIGH', gap: 'Decent coverage but uses outdated Oracle/MySQL CLI. Industry uses PostgreSQL, MongoDB, ORMs.' },
      { topic: 'Computer Networking (OSI, TCP/IP, Routing)', industryRelevance: 'HIGH', gap: 'Theory-heavy. Students can describe OSI layers but cannot configure a VLAN or troubleshoot DNS.' },
    ],
    year3: [
      { topic: 'Web Technology (HTML, CSS, basic JavaScript)', industryRelevance: 'HIGH', gap: 'Teaches HTML4-era tags. No React, no Node.js, no REST API design, no deployment.' },
      { topic: 'Software Engineering (SDLC, Waterfall, Agile terms)', industryRelevance: 'MEDIUM', gap: 'Memorizes Waterfall vs Agile definitions without ever using Jira, Git branches, or CI/CD.' },
      { topic: 'Project Work (Final Year Mini Project)', industryRelevance: 'HIGH', gap: 'Often a copy-pasted project. Must be an original, deployed, version-controlled project with tests.' },
      { topic: 'Operating Systems (Process scheduling, Memory management)', industryRelevance: 'HIGH', gap: 'Theory exam-focused. Never teaches Linux administration, Docker containers, or cloud VM management.' },
    ],
  },

  criticalSkillsToSelfLearn: [
    { skill: 'Git & GitHub (branches, pull requests, commit history)', priority: 'CRITICAL', whenToStart: 'Year 1 Holiday', reason: 'Every engineering and industry team uses Git. Diploma colleges never teach it.' },
    { skill: 'DSA Problem Solving (not just theory — solve 100+ problems)', priority: 'CRITICAL', whenToStart: 'Year 2', reason: 'DCET, GATE, and all placement interviews are DSA-heavy.' },
    { skill: 'Modern Web Development (React or Next.js + Node.js + MongoDB)', priority: 'HIGH', whenToStart: 'Year 2-3', reason: 'College teaches HTML4 tags. Industry wants full-stack React developers.' },
    { skill: 'Linux Terminal & Shell Scripting', priority: 'HIGH', whenToStart: 'Year 2', reason: 'Industry servers run Linux. Diploma labs use Windows-only environments.' },
    { skill: 'Cloud Basics (AWS EC2, S3, or Vercel/Railway deployment)', priority: 'MEDIUM', whenToStart: 'Year 3', reason: 'Deploying a project live separates "I know coding" from "I can ship software."' },
    { skill: 'DCET Exam Preparation (Mathematics + CS subjects)', priority: 'CRITICAL', whenToStart: 'Year 2 November', reason: 'DCET is your direct ticket to skip PU and enter B.E/B.Tech 2nd year directly.' },
  ],
};

// ═══════════════════════════════════════════════════════════
// SECTION 2: DCET DEEP PREPARATION ENGINE
// ═══════════════════════════════════════════════════════════

const DCET_PREP_ENGINE = {
  name: 'DCET (Diploma Common Entrance Test)',
  conductedBy: 'KEA (Karnataka Examination Authority)',
  purpose: 'Direct lateral entry admission to 2nd year B.E/B.Tech engineering colleges in Karnataka.',
  eligibility: 'Diploma passed in any engineering branch with minimum 45% aggregate (40% for reserved).',
  examPattern: {
    subjects: ['Mathematics', 'Computer Science / IT Fundamentals'],
    totalQuestions: 120,
    totalMarks: 120,
    duration: '2 hours (combined)',
    negativeMarking: false,
    scoringFormula: 'DCET Score (50%) + Diploma Aggregate Marks (50%) = Final Merit Rank',
  },
  subjectWiseSyllabus: {
    mathematics: [
      'Trigonometry (ratios, identities, heights & distances)',
      'Algebra (matrices, determinants, partial fractions)',
      'Calculus (differentiation, integration, limits)',
      'Coordinate Geometry (straight lines, circles, conics)',
      'Probability & Statistics (mean, median, mode, Bayes theorem)',
    ],
    computerScience: [
      'C Programming (arrays, pointers, structures, file handling)',
      'Data Structures (stack, queue, linked list, tree, graph basics)',
      'Database Management (SQL queries, normalization, ER diagrams)',
      'Computer Organization (number systems, Boolean algebra, memory hierarchy)',
      'Operating Systems (process management, scheduling algorithms, deadlocks)',
      'Computer Networks (OSI model, TCP/IP, IP addressing, routing)',
    ],
  },
  monthlyPrepPlan: [
    { month: 'November (Year 2)', focus: 'Start Mathematics revision: Trigonometry + Algebra. Solve 10 DCET PYQs daily.', hoursPerDay: 2 },
    { month: 'December-January', focus: 'Complete Calculus and Coordinate Geometry. Begin CS Data Structures revision.', hoursPerDay: 3 },
    { month: 'February-March', focus: 'Full CS syllabus revision. Weekly full mock tests. Error notebook maintenance.', hoursPerDay: 4 },
    { month: 'April-May (Pre-Exam Sprint)', focus: 'Daily full mock tests. Formula sheet revision. Focus only on weak chapters.', hoursPerDay: 5 },
    { month: 'June (Exam Month)', focus: 'Final 2-week revision. Solve last 5 years DCET papers under strict timer.', hoursPerDay: 6 },
  ],
  topMistakes: [
    'Ignoring Mathematics completely because "I am a CS student" — Math is 50% of DCET marks.',
    'Starting DCET prep only in the final month instead of 6 months prior.',
    'Not solving previous year DCET papers — the exam repeats patterns heavily.',
    'Skipping Data Structures and OS theory because "I will learn them in engineering" — they are on the exam NOW.',
  ],
  officialPortal: 'https://cetonline.karnataka.gov.in/kea/',
};

// ═══════════════════════════════════════════════════════════
// SECTION 3: 3-YEAR DIPLOMA CS MONTH-BY-MONTH ROADMAP
// ═══════════════════════════════════════════════════════════

const DIPLOMA_CS_ROADMAP = [
  { monthRange: 'June-August (Year 1 Start)', academicFocus: 'College orientation, Engineering Math, C basics.', selfStudyFocus: 'Install VS Code + Git. Learn terminal basics. Create GitHub account.', weeklyHours: 4, milestone: 'Has a GitHub profile and can navigate terminal.' },
  { monthRange: 'September-December (Year 1)', academicFocus: 'C arrays, strings, functions. Digital Electronics.', selfStudyFocus: 'Solve 20 HackerRank C problems. Watch CS50 Lecture 1-3.', weeklyHours: 5, milestone: 'Can write C programs without looking at textbook.' },
  { monthRange: 'January-April (Year 1 Exams + Holiday)', academicFocus: 'Year 1 final exams.', selfStudyFocus: 'Learn HTML + CSS. Build 1 personal website. Push to GitHub Pages.', weeklyHours: 8, milestone: 'Has a live personal website deployed on GitHub Pages.' },
  { monthRange: 'June-September (Year 2)', academicFocus: 'Data Structures, Java OOP, DBMS.', selfStudyFocus: 'Start DSA problem solving (Arrays, Strings, HashMaps). Learn JavaScript.', weeklyHours: 8, milestone: 'Can solve 30 easy DSA problems. Understands SQL JOINs.' },
  { monthRange: 'October-January (Year 2)', academicFocus: 'Computer Networks, OS, advanced Java.', selfStudyFocus: 'Build 1 full-stack mini project (Node.js + MongoDB). Begin DCET Math prep.', weeklyHours: 10, milestone: 'Has 1 deployed full-stack project. DCET Math revision started.' },
  { monthRange: 'February-May (Year 2 → Year 3)', academicFocus: 'Year 2 exams. DCET registration.', selfStudyFocus: 'DCET intensive prep: Daily PYQs + Mock Tests + Error Notebook.', weeklyHours: 12, milestone: 'Consistently scoring 80+ on DCET mock tests.' },
  { monthRange: 'June-September (Year 3)', academicFocus: 'Web Tech, SE, Project Work.', selfStudyFocus: 'Build final year project as a REAL deployed app (not copy-paste). Learn React basics.', weeklyHours: 10, milestone: 'Has an original, deployed, tested final year project.' },
  { monthRange: 'October-March (Year 3)', academicFocus: 'Final year exams + Project submission.', selfStudyFocus: 'DCET final sprint (if not done). Prepare engineering transition skills.', weeklyHours: 8, milestone: 'Diploma completed. DCET cleared. Ready for B.E 2nd year lateral entry.' },
];

// ═══════════════════════════════════════════════════════════
// SECTION 4: DCET PYQ BANK
// ═══════════════════════════════════════════════════════════

const DCET_PYQS = [
  { questionId: 'dcet_math_2025_01', year: 2025, subject: 'Mathematics', chapter: 'Trigonometry', question: 'If sin(A) = 3/5, find cos(A) and tan(A).', difficulty: 'Easy', correctAnswer: 'cos(A) = 4/5, tan(A) = 3/4', explanation: 'Using sin²A + cos²A = 1: cos²A = 1 - 9/25 = 16/25, so cos(A) = 4/5. tan(A) = sin(A)/cos(A) = 3/4.' },
  { questionId: 'dcet_math_2025_02', year: 2025, subject: 'Mathematics', chapter: 'Matrices', question: 'Find the determinant of matrix A = [[2, 3], [1, 4]].', difficulty: 'Easy', correctAnswer: '5', explanation: 'det(A) = (2×4) - (3×1) = 8 - 3 = 5.' },
  { questionId: 'dcet_cs_2025_01', year: 2025, subject: 'Computer Science', chapter: 'Data Structures', question: 'What is the time complexity of searching an element in a balanced BST?', difficulty: 'Medium', correctAnswer: 'O(log n)', explanation: 'In a balanced BST, the height is log(n). Search eliminates half the tree at each level.' },
  { questionId: 'dcet_cs_2025_02', year: 2025, subject: 'Computer Science', chapter: 'SQL', question: 'Write an SQL query to find the second highest salary from an Employee table.', difficulty: 'Medium', correctAnswer: 'SELECT MAX(Salary) FROM Employee WHERE Salary < (SELECT MAX(Salary) FROM Employee);', explanation: 'The subquery finds the maximum salary. The outer query finds the max salary that is less than the absolute max.' },
  { questionId: 'dcet_cs_2024_01', year: 2024, subject: 'Computer Science', chapter: 'Operating Systems', question: 'What is a deadlock? State the 4 necessary conditions for deadlock.', difficulty: 'Medium', correctAnswer: 'Deadlock: A situation where 2+ processes wait indefinitely for resources held by each other. 4 conditions: 1) Mutual Exclusion, 2) Hold and Wait, 3) No Preemption, 4) Circular Wait.', explanation: 'All 4 conditions must hold simultaneously for a deadlock to occur. Breaking any one prevents deadlock.' },
];

// ═══════════════════════════════════════════════════════════
// SECTION 5: CURATED FREE RESOURCES FOR DIPLOMA CS STUDENTS
// ═══════════════════════════════════════════════════════════

const DIPLOMA_CS_RESOURCES = [
  { resourceId: 'dip_r01', title: 'CS50 by Harvard — Best Introduction to Computer Science', url: 'https://cs50.harvard.edu/x/', type: 'course', free: true, quality: 'GOLD', phase: 'Year 1' },
  { resourceId: 'dip_r02', title: 'freeCodeCamp — JavaScript & Web Development', url: 'https://www.freecodecamp.org/', type: 'course', free: true, quality: 'GOLD', phase: 'Year 2-3' },
  { resourceId: 'dip_r03', title: 'Striver A2Z DSA Sheet (Complete DSA Roadmap)', url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/', type: 'course', free: true, quality: 'GOLD', phase: 'Year 2-3' },
  { resourceId: 'dip_r04', title: 'KEA DCET Previous Year Papers (Official)', url: 'https://cetonline.karnataka.gov.in/kea/', type: 'pyq', free: true, quality: 'GOLD', phase: 'DCET Prep' },
  { resourceId: 'dip_r05', title: 'Git & GitHub for Beginners (Traversy Media)', url: 'https://www.youtube.com/watch?v=SWYqp7iY_Tc', type: 'video', free: true, quality: 'GOLD', phase: 'Day 1' },
  { resourceId: 'dip_r06', title: 'The Odin Project — Full Stack JavaScript Path', url: 'https://www.theodinproject.com/', type: 'course', free: true, quality: 'GOLD', phase: 'Year 2-3' },
];

// ═══════════════════════════════════════════════════════════
// SECTION 6: LATERAL ENTRY TRANSITION GUIDE
// ═══════════════════════════════════════════════════════════

const LATERAL_ENTRY_GUIDE = {
  title: 'Diploma → Engineering Lateral Entry Survival Guide',
  whatIs: 'After completing a 3-year Polytechnic Diploma, you can directly enter the 2nd year (3rd semester) of B.E/B.Tech via DCET, skipping PU and 1st year engineering entirely.',
  biggestChallenges: [
    { challenge: '1st year engineering subjects (Physics, Chemistry, Math-I, Math-II) are skipped entirely', fix: 'Self-study Engineering Mathematics from NPTEL within first 2 months of joining.' },
    { challenge: 'Regular students have 1 year of college friendships, group dynamics, and lab familiarity', fix: 'Actively join coding clubs, hackathon teams, and study groups from Day 1.' },
    { challenge: 'Engineering Data Structures & Algorithms course assumes Math-I/II foundation', fix: 'Complete a fast-track Discrete Mathematics course on YouTube (Neso Academy).' },
    { challenge: 'Placement preparation starts in 3rd year — you have less runway than regular students', fix: 'Start LeetCode and project building from Day 1 of lateral entry, not "after settling in."' },
  ],
  firstMonthSurvivalPlan: [
    { week: 1, task: 'Meet seniors who entered via lateral entry. Ask them what mistakes to avoid.' },
    { week: 1, task: 'Join the college coding club, ACM chapter, or IEEE student branch.' },
    { week: 2, task: 'Start Striver A2Z DSA sheet. Solve 3 easy problems per day.' },
    { week: 3, task: 'Set up a GitHub profile with 3+ repositories from your diploma projects.' },
    { week: 4, task: 'Identify 1 domain you want to specialize in (web dev, ML, cyber, mobile).' },
  ],
};

// ═══════════════════════════════════════════════════════════
// EXPORTED API FUNCTIONS
// ═══════════════════════════════════════════════════════════

function getDiplomaSyllabusGapAnalysis() {
  return {
    success: true,
    engine: 'Diploma CS Syllabus Gap Analysis',
    collegeTeaches: DIPLOMA_CS_SYLLABUS_REALITY.whatCollegeTeaches,
    criticalSkillsToSelfLearn: DIPLOMA_CS_SYLLABUS_REALITY.criticalSkillsToSelfLearn,
    verdict: 'Diploma CS covers basic programming and theory, but misses Git, modern web frameworks, cloud deployment, and DSA problem-solving. Self-study is mandatory.',
  };
}

function getDiplomaRoadmap() {
  return { success: true, engine: 'Diploma CS 3-Year Roadmap', totalMonths: DIPLOMA_CS_ROADMAP.length, roadmap: DIPLOMA_CS_ROADMAP };
}

function getDcetPrepPlan() {
  return { success: true, ...DCET_PREP_ENGINE };
}

function getDcetPyqs({ subject, chapter, year, limit }) {
  let pyqs = [...DCET_PYQS];
  if (subject) pyqs = pyqs.filter(q => q.subject.toLowerCase().includes(subject.toLowerCase()));
  if (chapter) pyqs = pyqs.filter(q => q.chapter.toLowerCase().includes(chapter.toLowerCase()));
  if (year) pyqs = pyqs.filter(q => q.year === parseInt(year));
  if (limit) pyqs = pyqs.slice(0, parseInt(limit));
  return { success: true, count: pyqs.length, questions: pyqs };
}

function getDiplomaResources({ phase }) {
  let resources = [...DIPLOMA_CS_RESOURCES];
  if (phase) resources = resources.filter(r => r.phase.toLowerCase().includes(phase.toLowerCase()));
  return { success: true, count: resources.length, resources };
}

function getLateralEntryGuide() {
  return { success: true, ...LATERAL_ENTRY_GUIDE };
}

module.exports = {
  getDiplomaSyllabusGapAnalysis, getDiplomaRoadmap, getDcetPrepPlan,
  getDcetPyqs, getDiplomaResources, getLateralEntryGuide,
  DIPLOMA_CS_SYLLABUS_REALITY, DIPLOMA_CS_ROADMAP, DCET_PREP_ENGINE,
  DCET_PYQS, DIPLOMA_CS_RESOURCES, LATERAL_ENTRY_GUIDE,
};
