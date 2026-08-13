/**
 * Phoenix v23.0: Alumni Mentor Match & Peer Study Room Exchange
 */

const VERIFIED_ALUMNI_MENTORS = [
  { id: 'mentor_1', name: 'Pooja Hegde', college: 'RVCE Bengaluru', branch: 'CSE', company: 'Google', role: 'Software Engineer II', expertise: ['KCET Top 50 Strategy', 'DSA Patterns', 'Google Placements'] },
  { id: 'mentor_2', name: 'Nikhil Gowda', college: 'BMSCE Bengaluru', branch: 'ISE', company: 'Amazon', role: 'SDE-1', expertise: ['Diploma DCET Lateral Entry', 'System Design', 'Backend Engineering'] },
  { id: 'mentor_3', name: 'Ananya Rao', college: 'MSRIT Bengaluru', branch: 'AI-ML', company: 'Microsoft', role: 'AI Cloud Engineer', expertise: ['Hackathon Winning Blueprints', 'Azure & LLMs', 'College Project Portfolios'] }
];

class MentorExchangeEngine {
  constructor() {
    this.amaThreads = [];
  }

  matchMentor(studentGoal = 'KCET Top 500') {
    const goalLower = studentGoal.toLowerCase();
    const matched = VERIFIED_ALUMNI_MENTORS.filter(m => 
      m.expertise.some(exp => exp.toLowerCase().includes(goalLower) || goalLower.includes(exp.toLowerCase().split(' ')[0]))
    );

    return {
      studentGoal,
      recommendedMentors: matched.length > 0 ? matched : VERIFIED_ALUMNI_MENTORS,
      suggestedQuestions: [
        'How did you structure your daily revision schedule during the last 30 days before exam?',
        'Which core subjects should I prioritize to secure a <1,000 state rank?',
        'What were the biggest mistakes you avoided in 1st year engineering?'
      ]
    };
  }

  submitQuestion(questionData = {}) {
    const thread = {
      threadId: `ama_${Date.now()}`,
      studentId: questionData.studentId || 'student_guest',
      mentorId: questionData.mentorId || 'mentor_1',
      question: questionData.question || 'How to prepare for KCET calculus?',
      status: 'DISPATCHED_TO_MENTOR',
      timestamp: Date.now()
    };
    this.amaThreads.push(thread);
    return { success: true, thread, estimatedResponseTimeHours: 12 };
  }
}

const mentorExchangeEngine = new MentorExchangeEngine();
module.exports = { MentorExchangeEngine, mentorExchangeEngine, VERIFIED_ALUMNI_MENTORS };
