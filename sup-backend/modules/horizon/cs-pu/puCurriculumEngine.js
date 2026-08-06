/**
 * Phoenix Horizon — PU Computer Science Stream Engine
 * ===================================================
 * Deeply simulates what a real Pre-University CS student faces:
 *
 * REALITY CHECK (as a PU CS student):
 * - You're 16-17 years old, just chose "Science with Computer Science" after 10th
 * - Your PU college teaches C/C++ as "Computer Science" but only printf/scanf
 * - Nobody tells you DSA exists. Nobody tells you domains exist.
 * - You hear "coding" and "IT" but have zero idea what to actually DO
 * - KCET is the gate to engineering, but 80% of students study only 2 months before
 * - You waste 2 years not knowing what "problem solving" means in CS context
 *
 * THIS ENGINE FIXES THAT GAP.
 */

// ═══════════════════════════════════════════════════════════
// SECTION 1: THE REAL PU CS SYLLABUS vs WHAT INDUSTRY NEEDS
// ═══════════════════════════════════════════════════════════

const PU_CS_SYLLABUS_REALITY = {
  whatCollegeTeaches: {
    firstPU: [
      { topic: 'Computer Fundamentals & History of Computing', industryRelevance: 'LOW', gap: 'Outdated hardware history. Industry cares about problem-solving, not who invented ENIAC.' },
      { topic: 'C Programming Basics (printf, scanf, if-else, loops)', industryRelevance: 'MEDIUM', gap: 'Teaches syntax but NOT how to think algorithmically. Students can write printf but cannot solve a real problem.' },
      { topic: 'Arrays & Strings (1D only, basic traversal)', industryRelevance: 'MEDIUM', gap: 'Only teaches declaration and traversal. Never teaches two-pointer, sliding window, or frequency counting.' },
      { topic: 'Functions & Recursion (basic factorial/fibonacci)', industryRelevance: 'HIGH', gap: 'Good foundation, but stops at factorial. Never explores backtracking, memoization, or real recursive problem decomposition.' },
      { topic: 'Boolean Algebra & Logic Gates', industryRelevance: 'LOW', gap: 'Useful for ECE, but CS students need this time learning Git, terminal commands, and version control.' },
    ],
    secondPU: [
      { topic: 'C++ OOP Basics (class, object, constructor)', industryRelevance: 'MEDIUM', gap: 'Teaches class syntax but never explains SOLID principles, design patterns, or why OOP matters in real codebases.' },
      { topic: 'Pointers & Dynamic Memory Allocation', industryRelevance: 'HIGH', gap: 'Critical for C/C++ systems programming, but taught so poorly that 90% of students fear pointers for life.' },
      { topic: 'File Handling (fopen, fclose, text files)', industryRelevance: 'LOW', gap: 'Industry uses databases and APIs, not fopen/fclose. This is 1990s-era curriculum.' },
      { topic: 'Data Structures Introduction (stack, queue, linked list)', industryRelevance: 'HIGH', gap: 'The right topic at the wrong depth. Only teaches push/pop, never teaches when/why to use stacks in real problems.' },
      { topic: 'SQL Basics (CREATE, INSERT, SELECT)', industryRelevance: 'HIGH', gap: 'Good start but stops at SELECT *. Never teaches JOINs, indexing, normalization, or ORM patterns.' },
    ],
  },

  whatIndustryActuallyNeeds: [
    { skill: 'Algorithmic Problem Solving (DSA thinking)', priority: 'CRITICAL', whenToStart: '1st PU itself' },
    { skill: 'Git & GitHub Version Control', priority: 'CRITICAL', whenToStart: '1st PU Holiday' },
    { skill: 'Terminal/CLI Navigation (cd, ls, mkdir, grep)', priority: 'HIGH', whenToStart: '1st PU' },
    { skill: 'Web Fundamentals (HTML, CSS, JavaScript)', priority: 'HIGH', whenToStart: '1st PU Summer Holiday' },
    { skill: 'Understanding What Domains Exist (Web, Mobile, ML, Cyber, Cloud)', priority: 'CRITICAL', whenToStart: 'Day 1 of 1st PU' },
    { skill: 'Building & Deploying One Real Project', priority: 'HIGH', whenToStart: '2nd PU Summer' },
    { skill: 'Basic Networking Concepts (HTTP, DNS, IP, Ports)', priority: 'MEDIUM', whenToStart: '2nd PU' },
    { skill: 'English Communication & Technical Writing', priority: 'HIGH', whenToStart: 'Ongoing' },
  ],
};

// ═══════════════════════════════════════════════════════════
// SECTION 2: KCET & ENTRANCE EXAM DEEP PREPARATION ENGINE
// ═══════════════════════════════════════════════════════════

const PU_ENTRANCE_EXAMS = {
  kcet: {
    name: 'KCET (Karnataka Common Entrance Test)',
    conductedBy: 'KEA (Karnataka Examination Authority)',
    eligibility: '2nd PU passed with PCM/PCMB (45% aggregate, 40% for reserved)',
    examPattern: {
      subjects: ['Physics', 'Chemistry', 'Mathematics'],
      totalQuestions: 180,
      totalMarks: 180,
      duration: '80 minutes per subject (separate slots)',
      negativeMarking: false,
      weightage: 'KCET Score (50%) + PU Board Marks (50%) = Final Merit Rank',
    },
    monthlyPrepPlan: [
      { month: 'August (2nd PU Start)', focus: 'Begin NCERT Physics Mechanics & Chemistry Atomic Structure alongside PU classes', hoursPerDay: 2 },
      { month: 'September-November', focus: 'Complete PU 2nd year syllabus topics as they are taught. Solve 10 KCET PYQs daily.', hoursPerDay: 3 },
      { month: 'December', focus: 'Finish PU 2nd year portions. Start chapter-wise KCET previous year analysis.', hoursPerDay: 3 },
      { month: 'January-February', focus: 'Full revision cycle 1. Focus on weak chapters. Solve 5 full mock tests.', hoursPerDay: 4 },
      { month: 'March (Post PU Board)', focus: 'Intensive KCET sprint. 1 full mock test every 2 days. Error notebook review.', hoursPerDay: 6 },
      { month: 'April (Exam Month)', focus: 'Final revision. Formula sheets. Last 3 years PYQ timed practice. Stay calm.', hoursPerDay: 5 },
    ],
    topMistakes: [
      'Starting KCET prep only after PU Board exams (you lose 2 months of prime revision time)',
      'Studying from 500-page reference books instead of NCERT + PYQ combo',
      'Ignoring Mathematics problem-solving speed (KCET Math needs 1.3 min/question pace)',
      'Not maintaining an error notebook for wrong mock test answers',
      'Relying on coaching class notes without solving problems independently',
    ],
    officialPortal: 'https://cetonline.karnataka.gov.in/kea/',
  },
  comedk: {
    name: 'COMEDK UGET (Under Graduate Entrance Test)',
    conductedBy: 'COMEDK (Consortium of Medical, Engineering & Dental Colleges of Karnataka)',
    eligibility: '2nd PU passed with PCM (45% aggregate)',
    examPattern: {
      subjects: ['Physics', 'Chemistry', 'Mathematics'],
      totalQuestions: 180,
      totalMarks: 180,
      duration: '3 hours (combined)',
      negativeMarking: false,
    },
    officialPortal: 'https://www.comedk.org/',
  },
  jee_main: {
    name: 'JEE Main (Joint Entrance Examination)',
    conductedBy: 'NTA (National Testing Agency)',
    eligibility: '12th passed with PCM (75% or top 20 percentile)',
    examPattern: {
      subjects: ['Physics', 'Chemistry', 'Mathematics'],
      totalQuestions: 90,
      totalMarks: 300,
      duration: '3 hours',
      negativeMarking: true,
    },
    officialPortal: 'https://jeemain.nta.nic.in/',
  },
};

// ═══════════════════════════════════════════════════════════
// SECTION 3: COMPLETE 2-YEAR PU CS ROADMAP (Month by Month)
// ═══════════════════════════════════════════════════════════

const PU_CS_MONTH_BY_MONTH_ROADMAP = [
  {
    monthRange: 'June-July (1st PU Start)',
    academicFocus: 'PU classes begin. C programming basics in college.',
    selfStudyFocus: 'Install VS Code. Learn terminal basics (cd, ls, mkdir). Create a GitHub account.',
    weeklyHours: 5,
    milestone: 'Can navigate terminal, create folders, and push a "hello world" to GitHub.',
  },
  {
    monthRange: 'August-September (1st PU)',
    academicFocus: 'C loops, arrays, functions in PU class.',
    selfStudyFocus: 'Solve 20 easy problems on HackerRank/LeetCode using C. Learn what "Big-O" means.',
    weeklyHours: 6,
    milestone: 'Can solve basic array traversal and pattern printing problems independently.',
  },
  {
    monthRange: 'October-November (1st PU)',
    academicFocus: 'Functions, recursion, Boolean algebra in PU class.',
    selfStudyFocus: 'Learn HTML & CSS basics. Build 1 static personal profile page. Push to GitHub Pages.',
    weeklyHours: 7,
    milestone: 'Has a live personal website on GitHub Pages with their name, skills, and interests.',
  },
  {
    monthRange: 'December-January (1st PU Exams + Holiday)',
    academicFocus: '1st PU preparatory and final exams.',
    selfStudyFocus: 'Learn JavaScript fundamentals (variables, DOM manipulation, events). Build 1 interactive mini-project.',
    weeklyHours: 8,
    milestone: 'Can build a calculator or to-do list app using HTML + CSS + JavaScript.',
  },
  {
    monthRange: 'February-April (1st PU Summer Holiday)',
    academicFocus: 'Summer break — no academic pressure.',
    selfStudyFocus: 'GOLDEN OPPORTUNITY: Complete a full beginner course (freeCodeCamp or The Odin Project). Build 2 projects.',
    weeklyHours: 15,
    milestone: 'Has 3+ GitHub repositories with real code. Understands how websites actually work.',
  },
  {
    monthRange: 'May-July (2nd PU Start)',
    academicFocus: '2nd PU classes begin. C++ OOP, Pointers, Data Structures intro.',
    selfStudyFocus: 'Start learning Python or continue JavaScript. Explore domains: "What is web dev vs mobile dev vs ML?"',
    weeklyHours: 8,
    milestone: 'Can articulate what 3+ CS domains are and has chosen 1 to explore deeper.',
  },
  {
    monthRange: 'August-November (2nd PU)',
    academicFocus: '2nd PU core CS syllabus. SQL basics. File handling.',
    selfStudyFocus: 'Begin DSA fundamentals: Arrays, Strings, HashMaps. Solve 30 easy LeetCode problems. Start KCET prep alongside.',
    weeklyHours: 10,
    milestone: 'Can solve 2-pointer and frequency counting problems. KCET PYQ routine started.',
  },
  {
    monthRange: 'December-February (2nd PU Exam Prep)',
    academicFocus: '2nd PU preparatory exams and board exam revision.',
    selfStudyFocus: 'Board exam focus. But maintain 30 min/day DSA habit. Weekend KCET mock tests.',
    weeklyHours: 5,
    milestone: 'Board exams done. KCET mock score consistently improving.',
  },
  {
    monthRange: 'March-April (Post Board, Pre KCET)',
    academicFocus: 'PU Board exams completed. Full-time KCET/COMEDK/JEE sprint.',
    selfStudyFocus: 'KCET intensive: 1 full mock test every 2 days. Error notebook. Formula revision sheets.',
    weeklyHours: 30,
    milestone: 'KCET exam day: prepared, practiced, and confident.',
  },
];

// ═══════════════════════════════════════════════════════════
// SECTION 4: PYQ BANK FOR PU CS BOARD EXAMS
// ═══════════════════════════════════════════════════════════

const PU_CS_BOARD_PYQS = [
  {
    questionId: 'pu_cs_2025_01', year: 2025, chapter: 'C Programming',
    question: 'Write a C program to find the largest of three numbers using nested if-else.',
    marks: 5, difficulty: 'Easy', expectedTimeMinutes: 8,
    modelAnswer: '#include<stdio.h>\nint main() {\n  int a, b, c;\n  printf("Enter 3 numbers: ");\n  scanf("%d%d%d", &a, &b, &c);\n  if(a > b && a > c) printf("Largest: %d", a);\n  else if(b > c) printf("Largest: %d", b);\n  else printf("Largest: %d", c);\n  return 0;\n}',
  },
  {
    questionId: 'pu_cs_2025_02', year: 2025, chapter: 'Arrays',
    question: 'Write a C program to search for an element in an array using Linear Search.',
    marks: 5, difficulty: 'Easy', expectedTimeMinutes: 8,
    modelAnswer: '#include<stdio.h>\nint main() {\n  int arr[] = {10, 20, 30, 40, 50};\n  int n = 5, key, found = 0;\n  printf("Enter element to search: ");\n  scanf("%d", &key);\n  for(int i = 0; i < n; i++) {\n    if(arr[i] == key) { printf("Found at index %d", i); found = 1; break; }\n  }\n  if(!found) printf("Not found");\n  return 0;\n}',
  },
  {
    questionId: 'pu_cs_2025_03', year: 2025, chapter: 'Functions & Recursion',
    question: 'Explain call by value and call by reference with examples.',
    marks: 5, difficulty: 'Medium', expectedTimeMinutes: 10,
    modelAnswer: 'Call by Value: A copy of the argument is passed. Changes inside the function do NOT affect the original variable.\nCall by Reference: The address of the argument is passed (using pointers). Changes inside the function DIRECTLY affect the original variable.\n\nExample (Call by Value):\nvoid swap(int a, int b) { int t=a; a=b; b=t; } // Original unchanged\n\nExample (Call by Reference):\nvoid swap(int *a, int *b) { int t=*a; *a=*b; *b=t; } // Original swapped',
  },
  {
    questionId: 'pu_cs_2024_01', year: 2024, chapter: 'C++ OOP',
    question: 'Define a class "Student" with data members name and marks. Write a member function to display student details.',
    marks: 5, difficulty: 'Easy', expectedTimeMinutes: 8,
    modelAnswer: '#include<iostream>\nusing namespace std;\nclass Student {\n  string name;\n  int marks;\npublic:\n  void getData() { cout << "Name: "; cin >> name; cout << "Marks: "; cin >> marks; }\n  void display() { cout << "Name: " << name << " Marks: " << marks; }\n};\nint main() { Student s; s.getData(); s.display(); return 0; }',
  },
  {
    questionId: 'pu_cs_2024_02', year: 2024, chapter: 'Pointers',
    question: 'What is a pointer? Write a C program to swap two numbers using pointers.',
    marks: 5, difficulty: 'Medium', expectedTimeMinutes: 10,
    modelAnswer: 'A pointer is a variable that stores the memory address of another variable.\n\n#include<stdio.h>\nvoid swap(int *a, int *b) {\n  int temp = *a;\n  *a = *b;\n  *b = temp;\n}\nint main() {\n  int x = 10, y = 20;\n  printf("Before: x=%d y=%d\\n", x, y);\n  swap(&x, &y);\n  printf("After: x=%d y=%d\\n", x, y);\n  return 0;\n}',
  },
  {
    questionId: 'pu_cs_2024_03', year: 2024, chapter: 'SQL',
    question: 'Write SQL queries: (a) Create a table Employee with EmpID, Name, Salary. (b) Insert a record. (c) Display employees with salary > 50000.',
    marks: 5, difficulty: 'Easy', expectedTimeMinutes: 8,
    modelAnswer: '(a) CREATE TABLE Employee (EmpID INT PRIMARY KEY, Name VARCHAR(50), Salary DECIMAL(10,2));\n(b) INSERT INTO Employee VALUES (1, \'Rahul\', 55000);\n(c) SELECT * FROM Employee WHERE Salary > 50000;',
  },
];

// ═══════════════════════════════════════════════════════════
// SECTION 5: CURATED FREE RESOURCES FOR PU CS STUDENTS
// ═══════════════════════════════════════════════════════════

const PU_CS_RESOURCES = [
  { resourceId: 'pu_r01', title: 'freeCodeCamp — Full Curriculum (HTML/CSS/JS/React)', url: 'https://www.freecodecamp.org/', type: 'course', free: true, quality: 'GOLD', phase: 'Holiday Project Building' },
  { resourceId: 'pu_r02', title: 'The Odin Project — Full Stack Path', url: 'https://www.theodinproject.com/', type: 'course', free: true, quality: 'GOLD', phase: 'Holiday Project Building' },
  { resourceId: 'pu_r03', title: 'CS50 by Harvard (Best Intro to CS Ever Made)', url: 'https://cs50.harvard.edu/x/', type: 'course', free: true, quality: 'GOLD', phase: '1st PU' },
  { resourceId: 'pu_r04', title: 'HackerRank — 30 Days of Code Challenge', url: 'https://www.hackerrank.com/domains/tutorials/30-days-of-code', type: 'practice', free: true, quality: 'GOLD', phase: '1st PU' },
  { resourceId: 'pu_r05', title: 'Git & GitHub Crash Course (Traversy Media)', url: 'https://www.youtube.com/watch?v=SWYqp7iY_Tc', type: 'video', free: true, quality: 'GOLD', phase: 'Day 1' },
  { resourceId: 'pu_r06', title: 'KEA KCET Previous Year Papers', url: 'https://cetonline.karnataka.gov.in/kea/', type: 'pyq', free: true, quality: 'GOLD', phase: '2nd PU KCET Prep' },
  { resourceId: 'pu_r07', title: 'LeetCode Easy Problems (First 50)', url: 'https://leetcode.com/problemset/', type: 'practice', free: true, quality: 'GOLD', phase: '2nd PU DSA Start' },
  { resourceId: 'pu_r08', title: 'Striver A2Z DSA Sheet', url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/', type: 'course', free: true, quality: 'GOLD', phase: '2nd PU / Engineering Entry' },
];

// ═══════════════════════════════════════════════════════════
// EXPORTED API FUNCTIONS
// ═══════════════════════════════════════════════════════════

function getPuSyllabusGapAnalysis() {
  return {
    success: true,
    engine: 'PU CS Syllabus Gap Analysis',
    collegeTeaches: PU_CS_SYLLABUS_REALITY.whatCollegeTeaches,
    industryNeeds: PU_CS_SYLLABUS_REALITY.whatIndustryActuallyNeeds,
    verdict: 'PU CS teaches 30% of what you actually need. The remaining 70% — DSA thinking, Git, web development, domain awareness — must be self-taught using this roadmap.',
  };
}

function getPuMonthByMonthRoadmap() {
  return {
    success: true,
    engine: 'PU CS 2-Year Month-by-Month Roadmap',
    totalMonths: PU_CS_MONTH_BY_MONTH_ROADMAP.length,
    roadmap: PU_CS_MONTH_BY_MONTH_ROADMAP,
  };
}

function getPuEntranceExamPrep(examKey) {
  if (examKey) {
    const exam = PU_ENTRANCE_EXAMS[examKey];
    if (!exam) return { success: false, error: `Exam "${examKey}" not found. Available: ${Object.keys(PU_ENTRANCE_EXAMS).join(', ')}` };
    return { success: true, exam };
  }
  return { success: true, exams: PU_ENTRANCE_EXAMS };
}

function getPuBoardPyqs({ chapter, year, limit }) {
  let pyqs = [...PU_CS_BOARD_PYQS];
  if (chapter) pyqs = pyqs.filter(q => q.chapter.toLowerCase().includes(chapter.toLowerCase()));
  if (year) pyqs = pyqs.filter(q => q.year === parseInt(year));
  if (limit) pyqs = pyqs.slice(0, parseInt(limit));
  return { success: true, count: pyqs.length, questions: pyqs };
}

function getPuResources({ phase }) {
  let resources = [...PU_CS_RESOURCES];
  if (phase) resources = resources.filter(r => r.phase.toLowerCase().includes(phase.toLowerCase()));
  return { success: true, count: resources.length, resources };
}

module.exports = {
  getPuSyllabusGapAnalysis,
  getPuMonthByMonthRoadmap,
  getPuEntranceExamPrep,
  getPuBoardPyqs,
  getPuResources,
  PU_CS_SYLLABUS_REALITY,
  PU_CS_MONTH_BY_MONTH_ROADMAP,
  PU_ENTRANCE_EXAMS,
  PU_CS_BOARD_PYQS,
  PU_CS_RESOURCES,
};
