/**
 * Phoenix v6.0: Company & Role Intelligence Engine
 * 
 * Contains detailed hiring profiles, interview round structures, topic weightages,
 * and previous-year hiring trends for 12 major companies across India and globally.
 */

const COMPANY_INTELLIGENCE = {
  google: {
    companyName: 'Google',
    logo: '🔵',
    tier: 'Tier 1 Global Tech',
    hiringRounds: [
      { name: 'Round 1: Online Assessment (OA)', format: '2 Algorithmic Coding Questions', duration: '90 mins', focus: 'DSA (Graphs, Dynamic Programming, Strings)' },
      { name: 'Round 2: Technical Interview 1', format: 'Live Coding & Edge Case Analysis', duration: '45 mins', focus: 'Trees, Recursion, Time Complexity' },
      { name: 'Round 3: Technical Interview 2', format: 'Advanced Algorithms', duration: '45 mins', focus: 'Sliding Window, Binary Search, Heaps' },
      { name: 'Round 4: System Design / Architecture', format: 'Whiteboard System Design (SDE-2+)', duration: '45 mins', focus: 'Scalability, Caching, Load Balancing' },
      { name: 'Round 5: Googleyness & Leadership', format: 'Behavioral & Scenario-based', duration: '45 mins', focus: 'Ambiguity, Teamwork, Inclusion, Ethics' }
    ],
    topicWeightages: {
      dsa: 55,
      systemDesign: 25,
      coreCS: 10,
      aptitude: 0,
      behavioral: 10
    },
    topAskedTopics: ['Dynamic Programming', 'Graph Traversal (BFS/DFS)', 'Sliding Window', 'LRU Cache Design', 'Googleyness Scenarios'],
    averageSalaryPackage: '₹25 LPA - ₹45 LPA (India Entry Level)',
    hiringTips: [
      'Think out loud — Google interviewers care deeply about your thought process over the final code.',
      'Always analyze time and space complexity (Big-O) before writing code.',
      'Test your code with edge cases (empty array, null pointers, negative values) before saying you are done.'
    ]
  },

  amazon: {
    companyName: 'Amazon',
    logo: '📦',
    tier: 'Tier 1 Global Tech',
    hiringRounds: [
      { name: 'Round 1: Online Assessment (OA)', format: '2 Coding + Work Simulation + LP Survey', duration: '120 mins', focus: 'Arrays, Hash Maps, Priority Queues' },
      { name: 'Round 2: Technical 1 (Coding + LP)', format: '1 LP Question + 1 Live Coding', duration: '60 mins', focus: 'Customer Obsession, Linked Lists, Trees' },
      { name: 'Round 3: Technical 2 (Coding + LP)', format: '1 LP Question + 1 Live Coding', duration: '60 mins', focus: 'Ownership, Dynamic Programming, Graphs' },
      { name: 'Round 4: Bar Raiser Round', format: 'Deep Dive LP + Technical Architecture', duration: '60 mins', focus: '16 Leadership Principles, System Trade-offs' }
    ],
    topicWeightages: {
      dsa: 45,
      systemDesign: 20,
      coreCS: 10,
      aptitude: 0,
      behavioral: 25
    },
    topAskedTopics: ['16 Leadership Principles', 'Trees & BSTs', 'Heap / Priority Queue', 'System Design (Order Processing)', 'Coin Change DP'],
    averageSalaryPackage: '₹28 LPA - ₹44 LPA',
    hiringTips: [
      'Structure EVERY behavioral response using the STAR method (Situation, Task, Action, Result).',
      'Memorize 2 concrete stories for each of the 16 Leadership Principles.',
      'Prioritize customer obsession and long-term maintainability in your system design.'
    ]
  },

  microsoft: {
    companyName: 'Microsoft',
    logo: '🟦',
    tier: 'Tier 1 Global Tech',
    hiringRounds: [
      { name: 'Round 1: Online Assessment (OA)', format: '3 Coding Questions', duration: '90 mins', focus: 'Arrays, Strings, Dynamic Programming' },
      { name: 'Round 2: Technical 1', format: 'Data Structures & OOP Principles', duration: '45 mins', focus: 'Arrays, Partitioning, SOLID Principles' },
      { name: 'Round 3: Technical 2', format: 'System Design & OS Fundamentals', duration: '45 mins', focus: 'Concurrency, Threads, Cloud Architecture' },
      { name: 'Round 4: AA (Appropriate Authority / Hiring Manager)', format: 'Culture & Growth Mindset', duration: '45 mins', focus: 'Growth Mindset, Past Project Deep Dive' }
    ],
    topicWeightages: {
      dsa: 45,
      systemDesign: 20,
      coreCS: 20,
      aptitude: 0,
      behavioral: 15
    },
    topAskedTopics: ['Dutch National Flag Partitioning', 'Tree Maximum Path Sum', 'SOLID Principles', 'OS Threading', 'Growth Mindset Stories'],
    averageSalaryPackage: '₹24 LPA - ₹42 LPA',
    hiringTips: [
      'Show a Growth Mindset — acknowledge mistakes openly and talk about what you learned.',
      'Write clean, modular code following SOLID principles during live coding.',
      'Be prepared to discuss OS concepts like threads, processes, and memory management.'
    ]
  },

  tcs: {
    companyName: 'TCS (Tata Consultancy Services)',
    logo: '🌐',
    tier: 'Tier 2 Mass Recruiter / IT Services',
    hiringRounds: [
      { name: 'Round 1: NQT Online Test', format: 'Aptitude + Verbal + Reasoning + Hands-on Coding', duration: '180 mins', focus: 'Quant, Logic, Basic C/C++/Java/Python' },
      { name: 'Round 2: Technical Interview (TR)', format: 'CS Fundamentals & Project Viva', duration: '30 mins', focus: 'SQL Joins, OS Deadlocks, OOP Concepts' },
      { name: 'Round 3: HR & Managerial Interview (MR/HR)', format: 'Communication & Location Preference', duration: '20 mins', focus: 'Communication Skills, Adaptability, Relocation' }
    ],
    topicWeightages: {
      dsa: 20,
      systemDesign: 0,
      coreCS: 40,
      aptitude: 30,
      behavioral: 10
    },
    topAskedTopics: ['Quantitative Aptitude (Pipes, Time/Work)', 'SQL Queries & Joins', 'Deadlock 4 Conditions', 'Polymorphism vs Inheritance', 'Basic String Manipulation'],
    averageSalaryPackage: '₹3.6 LPA (Ninja) - ₹7.0 LPA (Digital) - ₹11.5 LPA (Prime)',
    hiringTips: [
      'Speed and accuracy in Aptitude & Logical Reasoning are key to clearing the NQT cutoff.',
      'Master basic SQL queries (INNER JOIN, GROUP BY, HAVING) — almost guaranteed questions.',
      'Speak clearly and confidently in English during the TR/HR rounds.'
    ]
  },

  infosys: {
    companyName: 'Infosys',
    logo: '🏢',
    tier: 'Tier 2 IT Services / Enterprise Solutions',
    hiringRounds: [
      { name: 'Round 1: HackWithInfy / InfyTQ Test', format: 'Aptitude + Pseudo Code + Coding', duration: '150 mins', focus: 'Data Structures, Pseudo Code Tracing' },
      { name: 'Round 2: Technical + HR Combined', format: 'Resume & Fundamentals Review', duration: '30 mins', focus: 'Core CS (OS, DBMS, CN), Academic Projects' }
    ],
    topicWeightages: {
      dsa: 25,
      systemDesign: 0,
      coreCS: 45,
      aptitude: 20,
      behavioral: 10
    },
    topAskedTopics: ['Pseudo Code Tracing', 'Process vs Thread', 'OSI Model 7 Layers', 'Binary Search Variations', 'SQL Normalization'],
    averageSalaryPackage: '₹3.6 LPA (SE) - ₹6.5 LPA (DSE) - ₹9.5 LPA (Power Programmer)',
    hiringTips: [
      'Practice tracing pseudo-code loops and conditional logic quickly.',
      'Be ready to explain every project listed on your resume line by line.',
      'Understand fundamental networking concepts (OSI layers, TCP vs UDP).'
    ]
  },

  flipkart: {
    companyName: 'Flipkart',
    logo: '🛍️',
    tier: 'Tier 1 Indian E-Commerce Giant',
    hiringRounds: [
      { name: 'Round 1: Online Coding (GRiD / Campus)', format: '3 Hard Algorithmic Problems', duration: '90 mins', focus: 'Arrays, DP, Graphs' },
      { name: 'Round 2: Machine Coding Round', format: 'Build a Working Low Level Design (LLD)', duration: '120 mins', focus: 'Object-Oriented Design, In-Memory DB' },
      { name: 'Round 3: System Design (HLD)', format: 'High-Level E-Commerce Architecture', duration: '60 mins', focus: 'Caching, Scalability, Message Queues' },
      { name: 'Round 4: Engineering Manager', format: 'Culture & Product Ownership', duration: '45 mins', focus: 'Past Failures, Ownership, Architecture Decisions' }
    ],
    topicWeightages: {
      dsa: 40,
      systemDesign: 35,
      coreCS: 15,
      aptitude: 0,
      behavioral: 10
    },
    topAskedTopics: ['Machine Coding (Parking Lot, Elevator)', 'Trapping Rain Water', 'E-Commerce Search Engine HLD', 'Database Indexing & Joins'],
    averageSalaryPackage: '₹18 LPA - ₹32 LPA',
    hiringTips: [
      'Practice Machine Coding rounds — write clean, runnable, modular OOP code in 90 minutes.',
      'Understand how message queues (Kafka) and caching (Redis) power high-concurrency flash sales.'
    ]
  }
};

/**
 * Helper to fetch company intelligence profile or return a default fallback profile.
 */
function getCompanyProfile(companyName) {
  const key = (companyName || '').toLowerCase().trim();
  return COMPANY_INTELLIGENCE[key] || COMPANY_INTELLIGENCE['tcs'];
}

module.exports = {
  COMPANY_INTELLIGENCE,
  getCompanyProfile
};
