/**
 * Phoenix Horizon — Multi-Sector Domain Roadmap Generator Engine
 * Module 2: Interactive 4-phase roadmaps for every career domain.
 * Each roadmap: Foundation → Deep-Dive → Real-World Application → Exam/Interview/Placement
 */

const ROADMAP_DATABASE = {
  fullstack_web: {
    domainKey: 'fullstack_web',
    world: 'tech_world',
    title: 'Full Stack Web Development',
    targetStudents: ['diploma_1', 'diploma_2', 'diploma_3', 'eng_1', 'eng_2', 'eng_3', 'eng_4'],
    phases: [
      {
        phaseId: 1,
        name: 'Zero-to-One Foundation',
        durationWeeks: 4,
        description: 'The alphabet — you cannot write sentences without it.',
        topics: [
          { topic: 'HTML5 Semantic Structure', estimatedHours: 6 },
          { topic: 'CSS3 Flexbox, Grid & Responsive Design', estimatedHours: 10 },
          { topic: 'JavaScript ES6+ Fundamentals (Variables, Functions, DOM)', estimatedHours: 20 },
          { topic: 'Git & GitHub Version Control Basics', estimatedHours: 4 },
          { topic: 'VS Code Workflow & Terminal CLI Navigation', estimatedHours: 3 },
        ],
        checkpointQuiz: ['What does the DOM stand for?', 'Explain the difference between let, const, and var.', 'What is a CSS media query?'],
      },
      {
        phaseId: 2,
        name: 'Core Domain Deep-Dive',
        durationWeeks: 12,
        description: 'This is where you become dangerous.',
        topics: [
          { topic: 'React.js Component Architecture & State Management', estimatedHours: 40 },
          { topic: 'Node.js & Express.js REST API Development', estimatedHours: 30 },
          { topic: 'MongoDB & Mongoose Schema Design', estimatedHours: 15 },
          { topic: 'Authentication (JWT, OAuth 2.0, Session Management)', estimatedHours: 10 },
          { topic: 'API Testing with Postman & Automated Test Suites', estimatedHours: 8 },
        ],
        miniProject: 'Build a full CRUD Todo App with user authentication and MongoDB persistence.',
      },
      {
        phaseId: 3,
        name: 'Real-World Application & Portfolio',
        durationWeeks: 8,
        description: 'This is what interviewers actually look at.',
        topics: [
          { topic: 'Build 2 Complete Full-Stack Projects with CI/CD', estimatedHours: 60 },
          { topic: 'Deploy to Vercel, Railway, or Render', estimatedHours: 5 },
          { topic: 'Create Professional GitHub Profile & Portfolio Site', estimatedHours: 8 },
          { topic: 'Open Source Contribution (1 Merged PR)', estimatedHours: 10 },
        ],
        portfolioPiece: 'Ship one complete, deployed, production-grade project with README, tests, and live demo URL.',
      },
      {
        phaseId: 4,
        name: 'Exam / Interview / Placement Prep',
        durationWeeks: 8,
        description: 'The finish line — be ready.',
        topics: [
          { topic: 'DSA: Arrays, Strings, HashMaps, Trees, Graphs', estimatedHours: 80 },
          { topic: 'System Design Basics (Load Balancing, Caching, DB Sharding)', estimatedHours: 20 },
          { topic: 'Mock Interview Practice (Behavioral + Technical)', estimatedHours: 15 },
          { topic: 'Resume Tailoring & ATS Optimization', estimatedHours: 5 },
        ],
        mockExam: 'Timed 90-minute coding assessment + 30-minute system design whiteboard.',
      },
    ],
  },

  ca_foundation: {
    domainKey: 'ca_foundation',
    world: 'commerce_world',
    title: 'Chartered Accountancy (CA Foundation)',
    targetStudents: ['2nd_pu', 'commerce'],
    phases: [
      {
        phaseId: 1, name: 'Zero-to-One Foundation', durationWeeks: 4,
        description: 'Accounting is the language of business — learn to read it.',
        topics: [
          { topic: 'Double-Entry Bookkeeping Principles', estimatedHours: 10 },
          { topic: 'Journal Entries, Ledger Posting & Trial Balance', estimatedHours: 12 },
          { topic: 'Basic Business Mathematics & Statistics', estimatedHours: 15 },
          { topic: 'Economics Fundamentals (Micro & Macro)', estimatedHours: 10 },
        ],
        checkpointQuiz: ['What is the Golden Rule of Debit and Credit?', 'What does a Trial Balance prove?'],
      },
      {
        phaseId: 2, name: 'Core Domain Deep-Dive', durationWeeks: 16,
        description: 'ICAI study material is your primary weapon — master it.',
        topics: [
          { topic: 'ICAI Accounting Standards (AS 1–14)', estimatedHours: 40 },
          { topic: 'Business Law & Company Act 2013', estimatedHours: 30 },
          { topic: 'Quantitative Aptitude (Ratios, Interest, Permutations)', estimatedHours: 25 },
          { topic: 'Business Economics & Commercial Knowledge', estimatedHours: 20 },
        ],
        miniProject: 'Solve complete ICAI Practice Manual for Accounts and Law.',
      },
      {
        phaseId: 3, name: 'Real-World Application', durationWeeks: 8,
        description: 'Practice under exam conditions — not just reading.',
        topics: [
          { topic: 'Solve 5 Past Attempt Papers Under Strict Timer', estimatedHours: 30 },
          { topic: 'Written Answer Drafting Practice (Law Section)', estimatedHours: 15 },
          { topic: 'Tax Filing Practice (GST Returns, ITR)', estimatedHours: 10 },
        ],
      },
      {
        phaseId: 4, name: 'CA Foundation Exam Sprint', durationWeeks: 4,
        description: 'Final 30-day revision sprint before exam day.',
        topics: [
          { topic: 'Full-Length Timed Mock Exams (Weekly)', estimatedHours: 24 },
          { topic: 'Error Notebook Review & Weak Area Remediation', estimatedHours: 10 },
          { topic: 'ICAI Revision Test Papers (RTP) Analysis', estimatedHours: 15 },
        ],
      },
    ],
  },

  neet_biology: {
    domainKey: 'neet_biology',
    world: 'bio_world',
    title: 'NEET-UG Medical Preparation',
    targetStudents: ['2nd_pu', 'bio_medical'],
    phases: [
      {
        phaseId: 1, name: 'NCERT Foundation', durationWeeks: 8,
        description: 'NCERT is your holy grail. Every line matters.',
        topics: [
          { topic: 'NCERT Biology Class 11 (Cell Biology, Plant Physiology)', estimatedHours: 40 },
          { topic: 'NCERT Biology Class 12 (Genetics, Ecology, Human Physiology)', estimatedHours: 40 },
          { topic: 'Organic Chemistry Basics (IUPAC Naming, Reaction Mechanisms)', estimatedHours: 25 },
          { topic: 'Physics Fundamentals (Mechanics, Optics, Thermodynamics)', estimatedHours: 30 },
        ],
      },
      {
        phaseId: 2, name: 'Topic-Wise Deep-Dive', durationWeeks: 12,
        description: 'Go beyond reading — understand mechanisms.',
        topics: [
          { topic: 'High-Yield Biology Topics (Genetics, Human Physiology, Ecology)', estimatedHours: 50 },
          { topic: 'Organic Chemistry Named Reactions & Conversion Chains', estimatedHours: 30 },
          { topic: 'Physics Numerical Practice (HC Verma, DC Pandey)', estimatedHours: 40 },
        ],
      },
      {
        phaseId: 3, name: 'Mock Test & Analysis Phase', durationWeeks: 8,
        description: 'Testing is training. Every wrong answer teaches.',
        topics: [
          { topic: 'Weekly Full-Length NEET Mock Tests', estimatedHours: 36 },
          { topic: 'Error Notebook Maintenance & Pattern Analysis', estimatedHours: 15 },
          { topic: 'NEET PYQ 10-Year Chapter-Wise Analysis', estimatedHours: 30 },
        ],
      },
      {
        phaseId: 4, name: 'Final Revision Sprint', durationWeeks: 4,
        description: 'Revise, revise, revise. Speed and accuracy.',
        topics: [
          { topic: 'NCERT Line-by-Line Revision (Biology Only)', estimatedHours: 20 },
          { topic: 'Formula Sheet Review (Physics + Chemistry)', estimatedHours: 10 },
          { topic: 'Final 3 Full Mock Tests Under Strict Timer', estimatedHours: 12 },
        ],
      },
    ],
  },

  dsa_algorithms: {
    domainKey: 'dsa_algorithms',
    world: 'tech_world',
    title: 'Data Structures & Algorithms Mastery',
    targetStudents: ['eng_1', 'eng_2', 'eng_3', 'eng_4', 'diploma_3'],
    phases: [
      {
        phaseId: 1, name: 'Fundamentals', durationWeeks: 4,
        description: 'Learn to think in patterns, not just syntax.',
        topics: [
          { topic: 'Big-O Notation, Time & Space Complexity', estimatedHours: 8 },
          { topic: 'Arrays, Strings & Two-Pointer Techniques', estimatedHours: 15 },
          { topic: 'HashMaps, Sets & Frequency Counting', estimatedHours: 10 },
          { topic: 'Recursion & Backtracking Foundations', estimatedHours: 12 },
        ],
      },
      {
        phaseId: 2, name: 'Core Data Structures', durationWeeks: 8,
        description: 'Trees, graphs, and heaps separate junior from senior.',
        topics: [
          { topic: 'Linked Lists (Singly, Doubly, Cycle Detection)', estimatedHours: 10 },
          { topic: 'Stacks & Queues (Monotonic Stack, BFS)', estimatedHours: 10 },
          { topic: 'Binary Trees & BSTs (Traversals, LCA, Serialize)', estimatedHours: 20 },
          { topic: 'Graphs (BFS, DFS, Dijkstra, Topological Sort)', estimatedHours: 25 },
          { topic: 'Heaps & Priority Queues', estimatedHours: 8 },
        ],
      },
      {
        phaseId: 3, name: 'Advanced Patterns', durationWeeks: 8,
        description: 'Dynamic programming and sliding window unlock hard problems.',
        topics: [
          { topic: 'Dynamic Programming (1D, 2D, Knapsack, LCS, LIS)', estimatedHours: 40 },
          { topic: 'Sliding Window & Two Pointers Advanced', estimatedHours: 12 },
          { topic: 'Trie, Segment Tree & Union-Find', estimatedHours: 15 },
        ],
      },
      {
        phaseId: 4, name: 'Interview Sprint', durationWeeks: 4,
        description: 'Solve 150+ problems. Speed is everything.',
        topics: [
          { topic: 'LeetCode Top 150 Interview Questions', estimatedHours: 60 },
          { topic: 'Mock Coding Interviews (45-min timer)', estimatedHours: 15 },
          { topic: 'Company-Specific Problem Sets (Google, Amazon, Microsoft)', estimatedHours: 20 },
        ],
      },
    ],
  },

  cyber_security: {
    domainKey: 'cyber_security',
    world: 'tech_world',
    title: 'Cyber Security & Ethical Hacking',
    targetStudents: ['eng_2', 'eng_3', 'eng_4'],
    phases: [
      {
        phaseId: 1, name: 'Networking & OS Foundations', durationWeeks: 6,
        description: 'You cannot defend what you do not understand.',
        topics: [
          { topic: 'TCP/IP, DNS, HTTP/HTTPS, TLS Handshake', estimatedHours: 15 },
          { topic: 'Linux Command Line & File Permissions', estimatedHours: 12 },
          { topic: 'Windows Security Architecture', estimatedHours: 8 },
        ],
      },
      {
        phaseId: 2, name: 'Offensive Security Deep-Dive', durationWeeks: 12,
        description: 'Learn to attack so you can learn to defend.',
        topics: [
          { topic: 'OWASP Top 10 Vulnerability Classes', estimatedHours: 20 },
          { topic: 'Web Application Pentesting (Burp Suite, SQLi, XSS)', estimatedHours: 30 },
          { topic: 'Network Scanning & Enumeration (Nmap, Wireshark)', estimatedHours: 15 },
          { topic: 'Privilege Escalation Techniques (Linux & Windows)', estimatedHours: 15 },
        ],
      },
      {
        phaseId: 3, name: 'Capture The Flag & Labs', durationWeeks: 8,
        description: 'Practice on real vulnerable machines.',
        topics: [
          { topic: 'TryHackMe & HackTheBox CTF Challenges', estimatedHours: 40 },
          { topic: 'Bug Bounty Report Writing', estimatedHours: 10 },
        ],
      },
      {
        phaseId: 4, name: 'Certification Prep', durationWeeks: 8,
        description: 'CEH, CompTIA Security+, or OSCP — pick your target.',
        topics: [
          { topic: 'CEH v12 / CompTIA Security+ Exam Prep', estimatedHours: 40 },
          { topic: 'Mock Certification Exams', estimatedHours: 15 },
        ],
      },
    ],
  },
};

/**
 * Retrieves a specific domain roadmap.
 */
function getRoadmap(domainKey) {
  const roadmap = ROADMAP_DATABASE[domainKey];
  if (!roadmap) {
    return { success: false, error: `Domain "${domainKey}" not found. Available: ${Object.keys(ROADMAP_DATABASE).join(', ')}` };
  }
  return { success: true, roadmap };
}

/**
 * Lists all available roadmaps filtered by world or student stage.
 */
function listRoadmaps({ world, stage }) {
  let roadmaps = Object.values(ROADMAP_DATABASE);

  if (world) {
    roadmaps = roadmaps.filter(r => r.world === world);
  }
  if (stage) {
    roadmaps = roadmaps.filter(r => r.targetStudents.includes(stage));
  }

  return {
    success: true,
    count: roadmaps.length,
    roadmaps: roadmaps.map(r => ({
      domainKey: r.domainKey,
      title: r.title,
      world: r.world,
      totalPhases: r.phases.length,
      totalWeeks: r.phases.reduce((sum, p) => sum + p.durationWeeks, 0),
    })),
  };
}

module.exports = { getRoadmap, listRoadmaps, ROADMAP_DATABASE };
