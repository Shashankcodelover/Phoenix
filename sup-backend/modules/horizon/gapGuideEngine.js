/**
 * Phoenix Horizon — A-to-Zero Gap & Pathway Guide Engine
 * Provides comprehensive A-to-Z domain guides covering:
 * 1. The Hidden Academic Gap (What college/coaching fails to teach)
 * 2. Step-by-Step Strategic Pathway (Day 1 to Industry/Exam Mastery)
 * 3. Top 5 Mistakes to Avoid
 * 4. Required Tools, Textbooks & Official Links
 */

const GAP_GUIDES_DATABASE = {
  commerce_ca: {
    domainKey: 'commerce_ca',
    world: 'commerce_world',
    title: 'Chartered Accountancy & Finance Master Pathway',
    targetAudience: '10th, 1st PU, 2nd PU, B.Com, BBA Students',
    hiddenGap: 'Colleges teach theoretical bookkeeping on paper, but CA exams require lightning-fast speed on ICAI modules, section-wise legal drafting, and real GST/ITR tax filing awareness.',
    stepByStepPathway: [
      { step: 1, title: 'Foundation Stage (11th/12th/1st PU)', detail: 'Master Double-Entry Bookkeeping, Journal Entries, Ledger Posting, and Trial Balance. Do not just memorize formulas — understand accounting concepts.' },
      { step: 2, title: 'CA Foundation Registration & Preparation', detail: 'Register with ICAI 4 months prior. Study official ICAI modules for Accounts, Law, Math, and Economics. Solve last 5 attempt Revision Test Papers (RTP).' },
      { step: 3, title: 'CA Intermediate & Articleship', detail: 'Pass CA Foundation, register for CA Inter (8 papers across 2 groups), and secure 2 years of practical articleship at a registered audit firm.' },
      { step: 4, title: 'CA Final & Specialization', detail: 'Complete Advanced Auditing, Financial Reporting, and Strategic Financial Management to earn the CA designation.' }
    ],
    topMistakesToAvoid: [
      'Reading reference books instead of solving official ICAI study material 100%.',
      'Neglecting written Law drafting practice — knowing law in your head is useless if you cannot write section numbers and structured answers on paper.',
      'Ignoring Quantitative Aptitude speed drills.'
    ],
    officialPortals: [
      { name: 'ICAI Official Portal', url: 'https://www.icai.org/' },
      { name: 'ICAI BOS Knowledge Portal', url: 'https://www.icai.org/post/students-study-material' }
    ]
  },

  bio_medical_neet: {
    domainKey: 'bio_medical_neet',
    world: 'bio_world',
    title: 'NEET-UG Medical & Allied Health Sciences Pathway',
    targetAudience: '10th, 1st PU, 2nd PU Science (PCMB) Students',
    hiddenGap: 'Coaching centers push heavy 1000-page reference books, but 85+ out of 90 NEET Biology questions come word-for-word from NCERT Class 11 & 12 diagrams and text captions.',
    stepByStepPathway: [
      { step: 1, title: 'NCERT Line-by-Line Mastery (Class 11 & 12)', detail: 'Read NCERT Biology at least 15 times. Annotate diagrams, summary tables, and scientist contributions.' },
      { step: 2, title: 'Organic Chemistry & Physics Numerical Drills', detail: 'Master Named Reactions and IUPAC nomenclature. Solve 100 numerical problems weekly for Physics mechanics and optics.' },
      { step: 3, title: 'Timed Mock Exams & Error Notebook', detail: 'Take weekly 3-hour 20-minute mock tests under OMR sheet conditions. Maintain an Error Notebook for every wrong question.' },
      { step: 4, title: 'NEET Counseling & College Choice', detail: 'Participate in MCC All India Quota (AIQ) and State KEA counseling for MBBS, BDS, BVSc, or B.Pharm seats.' }
    ],
    topMistakesToAvoid: [
      'Buying 5 different reference books instead of mastering NCERT Biology.',
      'Ignoring Physics numerical practice due to fear of math.',
      'Not analyzing mock test errors on the same day.'
    ],
    officialPortals: [
      { name: 'NTA NEET Official Portal', url: 'https://neet.nta.nic.in/' },
      { name: 'KEA Karnataka Medical Counseling', url: 'https://cetonline.karnataka.gov.in/kea/' }
    ]
  },

  arts_design_clat: {
    domainKey: 'arts_design_clat',
    world: 'arts_world',
    title: 'Law (CLAT), Product Design (NIFT/NID) & Media Pathway',
    targetAudience: '10th, PU, Diploma, Commerce, Arts Students',
    hiddenGap: 'Students assume Arts/Design has no entrance exams, missing high-paying careers in UI/UX Product Design (₹12-25 LPA starting) and Corporate Law (CLAT/NLUs).',
    stepByStepPathway: [
      { step: 1, title: 'Exploration & Aptitude Identification', detail: 'Determine if you lean toward Analytical Law (CLAT), Visual Product Design (NID/NIFT), or Digital Media & Journalism.' },
      { step: 2, title: 'Entrance Exam Mastery', detail: 'CLAT: Daily reading comprehension, Legal Reasoning, and GK. NID/NIFT: Sketching, perspective drawing, spatial awareness, and Design Aptitude Test (DAT).' },
      { step: 3, title: 'Portfolio Building & Design Systems', detail: 'For UI/UX Design: Learn Figma, wireframing, color theory, user research, and publish 2 Behance case studies.' },
      { step: 4, title: 'Industry Internship & Placement', detail: 'Secure internships at corporate law firms, design agencies, or tech startups.' }
    ],
    topMistakesToAvoid: [
      'Assuming Law or Design does not require rigorous daily preparation.',
      'Not maintaining a physical sketching sketchbook for NID/NIFT DAT exams.',
      'Neglecting digital Figma skills for UI/UX product design.'
    ],
    officialPortals: [
      { name: 'Consortium of NLUs (CLAT)', url: 'https://consortiumofnlus.ac.in/' },
      { name: 'NID Admissions Portal', url: 'https://admissions.nid.edu/' }
    ]
  },

  electronics_iot_embedded: {
    domainKey: 'electronics_iot_embedded',
    world: 'electronics_world',
    title: 'Electronics, Embedded C, VLSI & Robotics Pathway',
    targetAudience: 'Diploma, B.E/B.Tech (ECE/EEE/TE) Students',
    hiddenGap: 'Colleges teach obsolete 8085 microprocessor assembly on paper, whereas industry demands Embedded C, ESP32/STM32 microcontrollers, RTOS, and SystemVerilog VLSI design.',
    stepByStepPathway: [
      { step: 1, title: 'Digital Logic & Circuit Theory', detail: 'Master Boolean algebra, K-maps, logic gates, OP-AMPs, and Kirchhoff laws.' },
      { step: 2, title: 'Embedded C & Hardware Interfacing', detail: 'Write C programs for Arduino/ESP32, UART, SPI, I2C protocols, and GPIO sensor interfacing.' },
      { step: 3, title: 'Advanced Microcontrollers & RTOS', detail: 'Learn FreeRTOS task scheduling, STM32 ARM Cortex-M architecture, and PCB design in KiCAD.' },
      { step: 4, title: 'VLSI / IoT Specialization & GATE Prep', detail: 'Specialize in SystemVerilog/Verilog for chip design or build connected IoT hardware projects.' }
    ],
    topMistakesToAvoid: [
      'Studying theory without building physical microcontroller hardware projects.',
      'Ignoring C pointer fundamentals and memory management.',
      'Fearing hardware debugging with Oscilloscopes and Logic Analyzers.'
    ],
    officialPortals: [
      { name: 'GATE Official Portal', url: 'https://gate2026.iisc.ac.in/' },
      { name: 'IEEE Robotics & Automation Society', url: 'https://www.ieee-ras.org/' }
    ]
  },

  software_fullstack_dsa: {
    domainKey: 'software_fullstack_dsa',
    world: 'tech_world',
    title: 'Software Engineering, Full-Stack & DSA Pathway',
    targetAudience: '10th, PU, Diploma, Engineering CS/IT Students',
    hiddenGap: 'College curriculum teaches basic syntax without DSA problem-solving, Git version control, REST APIs, or production deployment — leaving graduates un-interviewable.',
    stepByStepPathway: [
      { step: 1, title: 'Programming & Logic Building', detail: 'Master JavaScript or Python fundamentals. Understand arrays, loops, functions, and Big-O notation.' },
      { step: 2, title: 'Data Structures & Algorithms (DSA)', detail: 'Solve 150+ LeetCode problems covering Arrays, HashMaps, Two Pointers, Trees, Graphs, and Dynamic Programming.' },
      { step: 3, title: 'Full-Stack Project Engineering', detail: 'Build 2 production web apps with React.js, Express/Node.js, and MongoDB/PostgreSQL. Deploy live to Vercel/Render.' },
      { step: 4, title: 'System Design & Mock Interviews', detail: 'Learn Load Balancers, Caching (Redis), Database Sharding, and practice timed peer mock interviews.' }
    ],
    topMistakesToAvoid: [
      'Waiting until final year to learn Data Structures & Algorithms.',
      'Copy-pasting tutorial code without building deployed projects from scratch.',
      'Having a blank GitHub profile with zero commits.'
    ],
    officialPortals: [
      { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/' },
      { name: 'LeetCode Practice Portal', url: 'https://leetcode.com/' }
    ]
  }
};

function getGapGuide(domainKey) {
  const guide = GAP_GUIDES_DATABASE[domainKey];
  if (!guide) {
    return {
      success: false,
      error: `Guide for domain "${domainKey}" not found. Available: ${Object.keys(GAP_GUIDES_DATABASE).join(', ')}`,
    };
  }
  return { success: true, guide };
}

function listGapGuides({ world }) {
  let guides = Object.values(GAP_GUIDES_DATABASE);
  if (world) {
    guides = guides.filter((g) => g.world === world);
  }
  return {
    success: true,
    count: guides.length,
    guides: guides.map((g) => ({
      domainKey: g.domainKey,
      world: g.world,
      title: g.title,
      targetAudience: g.targetAudience,
    })),
  };
}

module.exports = { getGapGuide, listGapGuides, GAP_GUIDES_DATABASE };
