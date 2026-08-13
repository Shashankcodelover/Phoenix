/**
 * Phoenix v23.0: Interactive Domain Readiness Quiz with Dynamic Difficulty Scaling
 */

const DOMAIN_ASSESSMENT_BANKS = {
  cybersecurity: [
    { id: 'cs_1', question: 'Which HTTP response header mitigates Clickjacking attacks?', options: ['X-Frame-Options', 'Access-Control-Allow-Origin', 'Cache-Control', 'Strict-Transport-Security'], correctIndex: 0, difficulty: 'Medium' },
    { id: 'cs_2', question: 'What is the primary defense against SQL Injection vulnerabilities?', options: ['Prepared Statements / Parameterized Queries', 'Client-side Regex Filtering', 'URL Encoding', 'Using GET instead of POST'], correctIndex: 0, difficulty: 'Easy' }
  ],
  fullstack_web: [
    { id: 'fs_1', question: 'In React, what hook should you use to synchronize state with local storage after render?', options: ['useEffect', 'useMemo', 'useReducer', 'useCallback'], correctIndex: 0, difficulty: 'Easy' },
    { id: 'fs_2', question: 'What is the time complexity of a HashMap key lookup under optimal hash distribution?', options: ['O(1)', 'O(N)', 'O(log N)', 'O(N^2)'], correctIndex: 0, difficulty: 'Easy' }
  ]
};

class DomainSkillQuizEngine {
  generateAssessment(domainKey = 'fullstack_web') {
    const questions = DOMAIN_ASSESSMENT_BANKS[domainKey] || DOMAIN_ASSESSMENT_BANKS.fullstack_web;
    return {
      domainKey,
      totalQuestions: questions.length,
      timeLimitMinutes: 15,
      questions: questions.map(q => ({
        id: q.id,
        question: q.question,
        options: q.options,
        difficulty: q.difficulty
      }))
    };
  }

  evaluateSubmission(domainKey = 'fullstack_web', userAnswers = []) {
    const questions = DOMAIN_ASSESSMENT_BANKS[domainKey] || DOMAIN_ASSESSMENT_BANKS.fullstack_web;
    let correct = 0;

    userAnswers.forEach((ans, idx) => {
      if (questions[idx] && ans === questions[idx].correctIndex) {
        correct++;
      }
    });

    const scorePercent = Math.round((correct / questions.length) * 100);
    let skillLevel = 'Beginner (Phase 1 Foundation Recommended)';
    if (scorePercent >= 80) skillLevel = 'Advanced (Ready for Live Industry Projects)';
    else if (scorePercent >= 50) skillLevel = 'Intermediate (Focus on Core Deep-Dive)';

    return {
      domainKey,
      scorePercent,
      correctCount: correct,
      totalQuestions: questions.length,
      skillLevel,
      recommendedNextStep: scorePercent >= 80 ? 'Build and deploy a full-stack portfolio piece.' : 'Complete foundational Git & JavaScript modules.'
    };
  }
}

const domainSkillQuizEngine = new DomainSkillQuizEngine();
module.exports = { DomainSkillQuizEngine, domainSkillQuizEngine };
