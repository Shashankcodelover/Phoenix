const test = require('node:test');
const assert = require('node:assert/strict');
const { evaluateStudentDiagnostic } = require('../modules/horizon/diagnosticEngine');
const { getExamNotifications } = require('../modules/horizon/examRadarEngine');
const { getPyqQuestions, evaluateMockExam } = require('../modules/horizon/pyqDatabase');
const { getSeniorMentors } = require('../modules/horizon/mentorshipEngine');

test('evaluateStudentDiagnostic matches Tech sector correctly', () => {
  const result = evaluateStudentDiagnostic({
    academicStage: '2nd_pu',
    interestSector: 'software_coding'
  });

  assert.equal(result.success, true);
  assert.equal(result.matchDetails.matchedWorld, 'tech_world');
  assert.ok(result.matchDetails.first30DaysRoadmap.length >= 5);
});

test('evaluateStudentDiagnostic matches Commerce sector correctly', () => {
  const result = evaluateStudentDiagnostic({
    academicStage: 'commerce',
    interestSector: 'commerce_ca_finance'
  });

  assert.equal(result.success, true);
  assert.equal(result.matchDetails.matchedWorld, 'commerce_world');
});

test('getExamNotifications filters KCET and DCET entrance exams', () => {
  const allExams = getExamNotifications({});
  assert.ok(allExams.count >= 4);

  const dcetOnly = getExamNotifications({ examKey: 'dcet' });
  assert.equal(dcetOnly.exams[0].name, 'DCET (Diploma Common Entrance Test)');
});

test('getPyqQuestions returns subject-filtered questions', () => {
  const mathPyqs = getPyqQuestions({ subject: 'Mathematics' });
  assert.ok(mathPyqs.questions.length > 0);
  assert.equal(mathPyqs.questions[0].subject, 'Mathematics');
});

test('evaluateMockExam scores answers correctly', () => {
  const mockResult = evaluateMockExam({
    examKey: 'kcet',
    answers: [
      { questionId: 'kcet_math_2025_01', selectedOptionIndex: 0 } // Correct option (8 or -8)
    ]
  });

  assert.equal(mockResult.success, true);
  assert.equal(mockResult.results.correctCount, 1);
  assert.equal(mockResult.results.percentageScore, 100);
});

test('getSeniorMentors returns verified alumni advice cards', () => {
  const mentors = getSeniorMentors({ world: 'tech_world' });
  assert.ok(mentors.mentors.length >= 3);
  assert.equal(mentors.mentors[0].verifiedAlumni, true);
});
