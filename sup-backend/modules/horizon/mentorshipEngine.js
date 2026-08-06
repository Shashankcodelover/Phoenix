/**
 * Phoenix Horizon — Senior Mentorship Bridge Engine
 * Provides verified senior alumni advice cards and mistakes-to-avoid guides.
 */

const SENIOR_PROFILES = [
  {
    mentorId: 'senior_01',
    name: 'Ananya Sharma',
    currentRole: 'Senior Software Engineer @ Google',
    originPath: 'Diploma in CS (DCET Rank 14) -> B.E. RVCE',
    verifiedAlumni: true,
    top3MistakesToAvoid: [
      'Waiting until 3rd year to learn Data Structures — start in 1st year diploma/PU.',
      'Ignoring project deployment — having 2 live GitHub projects beats 10 tutorial certificates.',
      'Fearing DCET math — start calculus prep 6 months before exams.'
    ],
    wisdomQuote: 'Domain knowledge is built step-by-step. Don’t get intimidated by advanced tools; master fundamentals first.'
  },
  {
    mentorId: 'senior_02',
    name: 'Rohan Mehta',
    currentRole: 'Chartered Accountant & Financial Analyst @ Deloitte',
    originPath: '12th Commerce -> CA Foundation (First Attempt)',
    verifiedAlumni: true,
    top3MistakesToAvoid: [
      'Neglecting ICAI study material — 90% exam paper comes directly from official ICAI modules.',
      'Not solving past 5 attempt question papers under strict timer conditions.',
      'Memorizing Law without practicing section-wise written drafting.'
    ],
    wisdomQuote: 'Consistency beats intensity. 3 hours of focused daily study for 6 months guarantees clearing CA Foundation.'
  },
  {
    mentorId: 'senior_03',
    name: 'Dr. Kavya Rao',
    currentRole: 'Junior Resident Doctor @ AIIMS New Delhi',
    originPath: '2nd PU Science -> NEET-UG (Score 685/720)',
    verifiedAlumni: true,
    top3MistakesToAvoid: [
      'Buying 10 different reference books instead of reading NCERT Biology 15 times.',
      'Ignoring Physics numerical practice in favor of reading theory repeatedly.',
      'Not maintaining an Error Notebook for missed mock test questions.'
    ],
    wisdomQuote: 'Your NCERT textbook is your holy grail. Highlight it, annotate it, and revise it until every page is familiar.'
  }
];

function getSeniorMentors({ world }) {
  return {
    success: true,
    count: SENIOR_PROFILES.length,
    mentors: SENIOR_PROFILES,
  };
}

module.exports = {
  getSeniorMentors,
  SENIOR_PROFILES,
};
