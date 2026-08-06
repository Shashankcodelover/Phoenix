/**
 * Phoenix Horizon — Exam Radar & Entrance Notification Engine
 * Tracks KCET, DCET, NEET-UG, CA Foundation, JEE Main, COMEDK alerts.
 */

const EXAM_DATABASE = {
  kcet: {
    examKey: 'kcet',
    name: 'KCET (Karnataka Common Entrance Test)',
    category: 'Engineering / Agriculture',
    targetStudents: ['2nd_pu', '12th'],
    registrationStatus: 'OPEN',
    registrationDeadline: '2026-03-25',
    examDate: '2026-04-18',
    officialPortal: 'https://cetonline.karnataka.gov.in/kea/',
    syllabusSubjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
    topPreparationTip: 'Focus 70% of time on Class 12 NCERT numerical problems and last 10 years KEA PYQs.',
  },
  dcet: {
    examKey: 'dcet',
    name: 'DCET (Diploma Common Entrance Test)',
    category: 'Diploma Lateral Entry to B.E/B.Tech (2nd Year)',
    targetStudents: ['diploma_1', 'diploma_2', 'diploma_3'],
    registrationStatus: 'UPCOMING',
    registrationDeadline: '2026-05-10',
    examDate: '2026-06-02',
    officialPortal: 'https://cetonline.karnataka.gov.in/kea/',
    syllabusSubjects: ['Applied Mathematics', 'Applied Science', 'Engineering Core Branch Subject'],
    topPreparationTip: 'Master DCET Engineering Mathematics (Matrices, Calculus, Differential Equations) — accounts for 40% total score.',
  },
  neet: {
    examKey: 'neet',
    name: 'NEET-UG (National Eligibility cum Entrance Test)',
    category: 'Medical / Dental / Veterinary',
    targetStudents: ['2nd_pu', '12th', 'bio_medical'],
    registrationStatus: 'OPEN',
    registrationDeadline: '2026-03-09',
    examDate: '2026-05-03',
    officialPortal: 'https://neet.nta.nic.in/',
    syllabusSubjects: ['Botany', 'Zoology', 'Physics', 'Chemistry'],
    topPreparationTip: 'NCERT Biology textbook must be memorized line-by-line. 85+ questions come directly from NCERT text diagrams.',
  },
  ca_foundation: {
    examKey: 'ca_foundation',
    name: 'ICAI CA Foundation Exam',
    category: 'Chartered Accountancy',
    targetStudents: ['2nd_pu', 'commerce', '12th'],
    registrationStatus: 'OPEN',
    registrationDeadline: '2026-02-01',
    examDate: '2026-06-20',
    officialPortal: 'https://www.icai.org/',
    syllabusSubjects: ['Accounting', 'Business Laws', 'Quantitative Aptitude', 'Business Economics'],
    topPreparationTip: 'Practice written presentation of ICAI Law answers and speed-solve Quantitative Aptitude MCQs.',
  },
  jee_main: {
    examKey: 'jee_main',
    name: 'JEE Main (Session 2)',
    category: 'Engineering / NITs / IIITs / CFTIs',
    targetStudents: ['2nd_pu', '12th'],
    registrationStatus: 'OPEN',
    registrationDeadline: '2026-03-02',
    examDate: '2026-04-04',
    officialPortal: 'https://jeemain.nta.ac.in/',
    syllabusSubjects: ['Physics', 'Chemistry', 'Mathematics'],
    topPreparationTip: 'Prioritize Chemistry NCERT for quick 100/100 points, followed by high-yield Physics topics.',
  },
};

/**
 * Retrieves exam radar alerts filtered by target stage or exam key.
 */
function getExamNotifications({ stage, examKey }) {
  if (examKey && EXAM_DATABASE[examKey]) {
    return { success: true, count: 1, exams: [EXAM_DATABASE[examKey]] };
  }

  let exams = Object.values(EXAM_DATABASE);
  if (stage) {
    exams = exams.filter((e) => e.targetStudents.includes(stage));
  }

  return {
    success: true,
    count: exams.length,
    exams,
  };
}

module.exports = {
  getExamNotifications,
  EXAM_DATABASE,
};
