/**
 * Phoenix Horizon — PYQ Database & Timed Mock Exam Engine
 * Provides categorized previous year question bank with automated scoring via MongoDB.
 */

const { MCQBank } = require('../../models/horizonModel');

const SAMPLE_PYQS_SEED = [
  {
    questionId: 'kcet_math_2025_01',
    examKey: 'kcet',
    subject: 'Mathematics',
    year: 2025,
    difficulty: 'MEDIUM',
    questionText: 'If A is a square matrix of order 3 such that |adj A| = 64, then |A| is equal to:',
    options: ['8 or -8', '64', '8', '16'],
    correctOptionIndex: 0,
    explanation: 'For a matrix A of order n, |adj A| = |A|^(n-1). Here n=3, so |adj A| = |A|^2 = 64 => |A| = ±8.',
  },
  {
    questionId: 'dcet_math_2024_05',
    examKey: 'dcet',
    subject: 'Applied Mathematics',
    year: 2024,
    difficulty: 'EASY',
    questionText: 'Find the derivative of y = e^(3x) with respect to x:',
    options: ['e^(3x)', '3 * e^(3x)', '3x * e^(3x)', 'e^(3x) / 3'],
    correctOptionIndex: 1,
    explanation: 'By chain rule, d/dx (e^(3x)) = e^(3x) * d/dx (3x) = 3 * e^(3x).',
  },
  {
    questionId: 'neet_bio_2025_12',
    examKey: 'neet',
    subject: 'Biology',
    year: 2025,
    difficulty: 'EASY',
    questionText: 'Which organelle is known as the powerhouse of the cell?',
    options: ['Ribosome', 'Golgi Apparatus', 'Mitochondria', 'Lysosome'],
    correctOptionIndex: 2,
    explanation: 'Mitochondria generate ATP through cellular respiration, earning the title powerhouse of the cell.',
  },
  {
    questionId: 'ca_acc_2024_02',
    examKey: 'ca_foundation',
    subject: 'Accounting',
    year: 2024,
    difficulty: 'MEDIUM',
    questionText: 'Which accounting concept states that business entity is distinct from its owners?',
    options: ['Going Concern Concept', 'Business Entity Concept', 'Money Measurement Concept', 'Matching Concept'],
    correctOptionIndex: 1,
    explanation: 'The Business Entity concept treats business operations separately from the personal affairs of its owners.',
  },
];

async function seedMCQsIfEmpty() {
  const count = await MCQBank.countDocuments();
  if (count === 0) {
    await MCQBank.insertMany(SAMPLE_PYQS_SEED);
  }
}

/**
 * Searches questions by exam key, subject, or difficulty via MongoDB.
 */
async function getPyqQuestions({ examKey, subject, difficulty, limit = 10 }) {
  await seedMCQsIfEmpty();

  let query = {};
  if (examKey) query.examKey = examKey;
  if (subject) query.subject = { $regex: subject, $options: 'i' };
  if (difficulty) query.difficulty = difficulty;

  const questions = await MCQBank.find(query).limit(limit).lean();

  return {
    success: true,
    count: questions.length,
    questions: questions,
  };
}

/**
 * Evaluates timed mock exam submissions and generates instant score report.
 */
async function evaluateMockExam({ examKey, answers }) {
  if (!answers || !Array.isArray(answers)) {
    throw new Error('Answers array is required.');
  }

  let totalQuestions = answers.length;
  let correctCount = 0;
  let incorrectCount = 0;
  const breakdown = [];

  for (const ans of answers) {
    const question = await MCQBank.findOne({ questionId: ans.questionId }).lean();
    if (question) {
      const isCorrect = ans.selectedOptionIndex === question.correctOptionIndex;
      if (isCorrect) correctCount++;
      else incorrectCount++;

      breakdown.push({
        questionId: question.questionId,
        questionText: question.questionText,
        isCorrect,
        correctOption: question.options[question.correctOptionIndex],
        userOption: question.options[ans.selectedOptionIndex] || 'Skipped',
        explanation: question.explanation,
      });
    }
  }

  const percentageScore = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  return {
    success: true,
    examKey: examKey || 'general_mock',
    evaluatedAt: new Date().toISOString(),
    results: {
      totalQuestions,
      correctCount,
      incorrectCount,
      percentageScore,
      grade: percentageScore >= 80 ? 'EXCELLENT' : percentageScore >= 50 ? 'GOOD' : 'NEEDS_REVISION',
      breakdown,
    },
  };
}

module.exports = {
  getPyqQuestions,
  evaluateMockExam
};
