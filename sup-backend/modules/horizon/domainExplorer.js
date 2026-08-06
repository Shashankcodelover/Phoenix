/**
 * Phoenix Horizon — Domain Explorer Engine
 * Module 9: "What's Out There at My Stage?"
 * Answers: "I am in stage X — what career paths exist for me right now?"
 */

const STAGE_EXPLORER_DATABASE = {
  '10th': {
    stageKey: '10th',
    stageName: '10th Grade / SSLC',
    availableStreams: [
      {
        stream: 'Science (PCMB / PCMC)',
        description: 'Physics, Chemistry, Math, Biology / Computer Science. Opens paths to Engineering, Medical, Architecture, Research, and Pure Sciences.',
        topExams: ['KCET', 'JEE Main', 'NEET-UG', 'COMEDK'],
        targetWorlds: ['tech_world', 'bio_world', 'electronics_world'],
      },
      {
        stream: 'Commerce (CEBA / SEBA)',
        description: 'Commerce, Economics, Business Studies, Accountancy / Statistics. Opens paths to CA, CS, Investment Banking, Corporate Law, and Business Analytics.',
        topExams: ['CA Foundation', 'IPMAT', 'CUET-UG', 'CS Executive Entrance'],
        targetWorlds: ['commerce_world'],
      },
      {
        stream: 'Arts & Design (HEPS)',
        description: 'History, Economics, Political Science, Sociology / Design. Opens paths to UI/UX Design, Law, Journalism, Civil Services (UPSC), Media, and Psychology.',
        topExams: ['CLAT', 'NIFT / NID', 'CUET-UG', 'NATA'],
        targetWorlds: ['arts_world'],
      },
      {
        stream: 'Polytechnic Diploma',
        description: '3-Year Technical Diploma after 10th. Direct lateral entry into 2nd year B.E/B.Tech via DCET without doing 11th/12th.',
        topExams: ['DCET (Diploma Common Entrance Test)'],
        targetWorlds: ['tech_world', 'electronics_world'],
      },
    ],
  },
  '2nd_pu': {
    stageKey: '2nd_pu',
    stageName: '1st & 2nd Pre-University (PUC / 11th & 12th)',
    availableStreams: [
      {
        stream: 'Engineering & Technology (B.E / B.Tech)',
        description: 'Computer Science, AI/ML, Electronics, Mechanical, Civil, Biotech.',
        topExams: ['KCET', 'JEE Main', 'COMEDK', 'BITSAT'],
        targetWorlds: ['tech_world', 'electronics_world'],
      },
      {
        stream: 'Medical & Healthcare (MBBS / BDS / Allied)',
        description: 'Medicine, Dentistry, Veterinary, Pharmacy, Biotechnology, Nursing.',
        topExams: ['NEET-UG', 'KCET (Pharma/Agri)'],
        targetWorlds: ['bio_world'],
      },
      {
        stream: 'Chartered Accountancy & Finance',
        description: 'CA Foundation, CS, CFA, Investment Banking, B.Com/BBA.',
        topExams: ['CA Foundation', 'IPMAT', 'CUET'],
        targetWorlds: ['commerce_world'],
      },
      {
        stream: 'Design & Visual Communication',
        description: 'UI/UX Product Design, Fashion, Animation, Fine Arts, Media.',
        topExams: ['NID DAT', 'NIFT Entrance', 'UCEED'],
        targetWorlds: ['arts_world'],
      },
    ],
  },
  'diploma_3': {
    stageKey: 'diploma_3',
    stageName: 'Polytechnic Diploma (Final Year)',
    availableStreams: [
      {
        stream: 'B.E / B.Tech Lateral Entry (2nd Year)',
        description: 'Direct admission to 3rd semester engineering via DCET.',
        topExams: ['DCET (KEA)'],
        targetWorlds: ['tech_world', 'electronics_world'],
      },
      {
        stream: 'Direct Junior Engineer Jobs & PSUs',
        description: 'Government Junior Engineer (JE) roles, Railway RRB JE, SSC JE.',
        topExams: ['SSC JE', 'RRB JE', 'State PSU JE Exams'],
        targetWorlds: ['electronics_world', 'tech_world'],
      },
    ],
  },
  'eng_2': {
    stageKey: 'eng_2',
    stageName: 'Engineering (B.E / B.Tech 1st–4th Year)',
    availableStreams: [
      {
        stream: 'Software Development & Full-Stack Engineering',
        description: 'DSA, System Design, Web/Mobile Dev, Cloud DevOps, AI/ML.',
        topExams: ['Campus Placements', 'GATE CS', 'Off-Campus Hiring'],
        targetWorlds: ['tech_world'],
      },
      {
        stream: 'Core Electronics & Embedded Systems',
        description: 'VLSI, Microcontrollers, IoT, Robotics, Automotive Electronics.',
        topExams: ['GATE ECE/EE', 'ISRO/DRDO Scientist Entrance'],
        targetWorlds: ['electronics_world'],
      },
    ],
  },
};

function exploreDomainByStage(stageKey) {
  const stageData = STAGE_EXPLORER_DATABASE[stageKey];
  if (!stageData) {
    return {
      success: false,
      error: `Stage "${stageKey}" not found. Available: ${Object.keys(STAGE_EXPLORER_DATABASE).join(', ')}`,
    };
  }
  return { success: true, ...stageData };
}

module.exports = { exploreDomainByStage, STAGE_EXPLORER_DATABASE };
