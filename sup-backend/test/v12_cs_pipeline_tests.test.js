const test = require('node:test');
const assert = require('node:assert/strict');

// PU CS Module Tests
const { getPuSyllabusGapAnalysis, getPuMonthByMonthRoadmap, getPuEntranceExamPrep, getPuBoardPyqs, getPuResources } = require('../modules/horizon/cs-pu/puCurriculumEngine');

// Diploma CS Module Tests
const { getDiplomaSyllabusGapAnalysis, getDiplomaRoadmap, getDcetPrepPlan, getDcetPyqs, getDiplomaResources, getLateralEntryGuide } = require('../modules/horizon/cs-diploma/diplomaCurriculumEngine');

// Engineering CS Module Tests
const { getEngSemesterGapAnalysis, getEngRoadmap, evaluatePlacementReadiness } = require('../modules/horizon/cs-engineering/engCurriculumEngine');

// AI Guide Bot Tests
const { processMessage, recognizeIntent } = require('../modules/horizon/ai-guide-bot/guideBotEngine');

// ═══════════════════════════════════════════════════════════
// PU CS ENGINE TESTS
// ═══════════════════════════════════════════════════════════

test('PU Syllabus Gap Analysis identifies industry needs vs college curriculum', () => {
  const result = getPuSyllabusGapAnalysis();
  assert.equal(result.success, true);
  assert.ok(result.collegeTeaches.firstPU.length >= 4);
  assert.ok(result.industryNeeds.length >= 6);
  assert.ok(result.verdict.includes('30%'));
});

test('PU Month-by-Month Roadmap covers full 2-year journey', () => {
  const result = getPuMonthByMonthRoadmap();
  assert.equal(result.success, true);
  assert.ok(result.totalMonths >= 9);
  assert.ok(result.roadmap[0].monthRange.includes('June'));
});

test('PU Entrance Exam Prep returns KCET details with monthly plan', () => {
  const kcet = getPuEntranceExamPrep('kcet');
  assert.equal(kcet.success, true);
  assert.equal(kcet.exam.examPattern.totalQuestions, 180);
  assert.ok(kcet.exam.monthlyPrepPlan.length >= 5);
  assert.ok(kcet.exam.topMistakes.length >= 4);
});

test('PU Board PYQs return questions with model answers', () => {
  const pyqs = getPuBoardPyqs({});
  assert.equal(pyqs.success, true);
  assert.ok(pyqs.count >= 5);
  assert.ok(pyqs.questions[0].modelAnswer.length > 10);
});

test('PU Resources are all free and verified', () => {
  const resources = getPuResources({});
  assert.equal(resources.success, true);
  assert.ok(resources.count >= 6);
  assert.ok(resources.resources.every(r => r.free === true));
});

// ═══════════════════════════════════════════════════════════
// DIPLOMA CS ENGINE TESTS
// ═══════════════════════════════════════════════════════════

test('Diploma Syllabus Gap Analysis identifies critical self-study skills', () => {
  const result = getDiplomaSyllabusGapAnalysis();
  assert.equal(result.success, true);
  assert.ok(result.criticalSkillsToSelfLearn.length >= 5);
  assert.ok(result.criticalSkillsToSelfLearn.some(s => s.skill.includes('Git')));
});

test('Diploma 3-Year Roadmap covers all 8 periods', () => {
  const result = getDiplomaRoadmap();
  assert.equal(result.success, true);
  assert.ok(result.totalMonths >= 8);
});

test('DCET Prep Plan includes exam pattern, monthly plan, and mistakes', () => {
  const result = getDcetPrepPlan();
  assert.equal(result.success, true);
  assert.equal(result.examPattern.totalQuestions, 120);
  assert.ok(result.monthlyPrepPlan.length >= 5);
  assert.ok(result.topMistakes.length >= 3);
});

test('DCET PYQs return questions with correct answers and explanations', () => {
  const result = getDcetPyqs({});
  assert.equal(result.success, true);
  assert.ok(result.count >= 4);
  assert.ok(result.questions[0].explanation.length > 10);
});

test('Lateral Entry Guide addresses biggest challenges with fixes', () => {
  const result = getLateralEntryGuide();
  assert.equal(result.success, true);
  assert.ok(result.biggestChallenges.length >= 4);
  assert.ok(result.firstMonthSurvivalPlan.length >= 4);
});

// ═══════════════════════════════════════════════════════════
// ENGINEERING CS ENGINE TESTS
// ═══════════════════════════════════════════════════════════

test('Engineering Semester Gap Analysis covers all 4 semester groups', () => {
  const result = getEngSemesterGapAnalysis();
  assert.equal(result.success, true);
  assert.ok(Object.keys(result.semesters).length >= 4);
});

test('Engineering 8-Semester Roadmap has DSA targets per semester', () => {
  const result = getEngRoadmap();
  assert.equal(result.success, true);
  assert.equal(result.totalSemesters, 8);
  assert.ok(result.roadmap[0].dsaTarget.length > 0);
});

test('Placement Readiness evaluates high-preparation student correctly', () => {
  const result = evaluatePlacementReadiness({
    dsaProblemsSolved: 300,
    projectsDeployed: 4,
    internshipsDone: 1,
    mockInterviewsDone: 12,
    systemDesignTopicsStudied: 8,
    semester: 7,
  });
  assert.equal(result.success, true);
  assert.ok(result.overallReadiness >= 80);
  assert.ok(result.verdict.includes('PLACEMENT READY'));
});

test('Placement Readiness flags unprepared student with urgent actions', () => {
  const result = evaluatePlacementReadiness({
    dsaProblemsSolved: 10,
    projectsDeployed: 0,
    internshipsDone: 0,
    mockInterviewsDone: 0,
    systemDesignTopicsStudied: 0,
    semester: 6,
  });
  assert.equal(result.success, true);
  assert.ok(result.overallReadiness < 30);
  assert.ok(result.verdict.includes('NOT READY'));
  assert.ok(result.urgentActions.length >= 3);
});

// ═══════════════════════════════════════════════════════════
// AI GUIDE BOT ENGINE TESTS
// ═══════════════════════════════════════════════════════════

test('AI Bot recognizes greeting intent', () => {
  const intent = recognizeIntent('hello, how can you help me?');
  assert.equal(intent.intent, 'greeting');
});

test('AI Bot recognizes roadmap intent and returns stage-specific data', () => {
  const result = processMessage({ message: 'show me my roadmap', userStage: '2nd_pu' });
  assert.equal(result.success, true);
  assert.equal(result.intent.intent, 'find_roadmap');
  assert.ok(result.data);
  assert.ok(result.focusElements.length > 0);
});

test('AI Bot recognizes navigate intent and returns page focus elements', () => {
  const result = processMessage({ message: 'where is the exam radar?', userStage: '2nd_pu' });
  assert.equal(result.success, true);
  assert.equal(result.intent.intent, 'navigate_element');
  assert.ok(result.focusElements.length > 0);
  assert.equal(result.focusAction, 'HIGHLIGHT_AND_SCROLL');
});

test('AI Bot returns diploma-specific data when stage is diploma', () => {
  const result = processMessage({ message: 'show me practice questions', userStage: 'diploma_3' });
  assert.equal(result.success, true);
  assert.ok(result.botReply.includes('DCET'));
});

test('AI Bot handles lateral entry query for diploma students', () => {
  const result = processMessage({ message: 'how does lateral entry work?', userStage: 'diploma_3' });
  assert.equal(result.success, true);
  assert.equal(result.intent.intent, 'lateral_entry');
  assert.ok(result.data);
});
