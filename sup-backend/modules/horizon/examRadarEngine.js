/**
 * Phoenix Horizon — Exam Radar & Entrance Notification Engine
 * Tracks KCET, DCET, NEET-UG, CA Foundation, JEE Main, COMEDK alerts using MongoDB.
 */

const { ExamAlert } = require('../../models/horizonModel');

const INITIAL_SEED = [
  {
    examKey: 'kcet',
    examName: 'KCET (Karnataka Common Entrance Test)',
    sector: 'Engineering / Agriculture',
    registrationStartDate: new Date('2026-02-01'),
    registrationEndDate: new Date('2026-03-25'),
    examDate: new Date('2026-04-18'),
    officialLink: 'https://cetonline.karnataka.gov.in/kea/',
    syllabusChanges: 'Focus 70% of time on Class 12 NCERT numerical problems and last 10 years KEA PYQs.'
  },
  {
    examKey: 'dcet',
    examName: 'DCET (Diploma Common Entrance Test)',
    sector: 'Diploma Lateral Entry to B.E/B.Tech (2nd Year)',
    registrationStartDate: new Date('2026-04-01'),
    registrationEndDate: new Date('2026-05-10'),
    examDate: new Date('2026-06-02'),
    officialLink: 'https://cetonline.karnataka.gov.in/kea/',
    syllabusChanges: 'Master DCET Engineering Mathematics (Matrices, Calculus, Differential Equations).'
  },
  {
    examKey: 'neet',
    examName: 'NEET-UG (National Eligibility cum Entrance Test)',
    sector: 'Medical / Dental / Veterinary',
    registrationStartDate: new Date('2026-01-15'),
    registrationEndDate: new Date('2026-03-09'),
    examDate: new Date('2026-05-03'),
    officialLink: 'https://neet.nta.nic.in/',
    syllabusChanges: 'NCERT Biology textbook must be memorized line-by-line.'
  },
  {
    examKey: 'ca_foundation',
    examName: 'ICAI CA Foundation Exam',
    sector: 'Chartered Accountancy',
    registrationStartDate: new Date('2025-12-01'),
    registrationEndDate: new Date('2026-02-01'),
    examDate: new Date('2026-06-20'),
    officialLink: 'https://www.icai.org/',
    syllabusChanges: 'Practice written presentation of ICAI Law answers and speed-solve Quantitative Aptitude MCQs.'
  },
  {
    examKey: 'jee_main',
    examName: 'JEE Main (Session 2)',
    sector: 'Engineering / NITs / IIITs / CFTIs',
    registrationStartDate: new Date('2026-02-01'),
    registrationEndDate: new Date('2026-03-02'),
    examDate: new Date('2026-04-04'),
    officialLink: 'https://jeemain.nta.ac.in/',
    syllabusChanges: 'Prioritize Chemistry NCERT for quick 100/100 points, followed by high-yield Physics topics.'
  }
];

async function seedExamsIfEmpty() {
  const count = await ExamAlert.countDocuments();
  if (count === 0) {
    await ExamAlert.insertMany(INITIAL_SEED);
  }
}

/**
 * Retrieves exam radar alerts filtered by target sector or exam key from MongoDB.
 */
async function getExamNotifications({ sector, examKey }) {
  await seedExamsIfEmpty();
  
  let query = {};
  if (examKey) {
    query.examKey = examKey;
  }
  if (sector) {
    // For fuzzy matching sectors
    query.sector = { $regex: sector, $options: 'i' };
  }

  const exams = await ExamAlert.find(query);
  
  return {
    success: true,
    count: exams.length,
    exams: exams,
  };
}

module.exports = {
  getExamNotifications
};
