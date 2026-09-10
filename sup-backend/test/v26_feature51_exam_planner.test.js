/**
 * v26_feature51_exam_planner.test.js
 * Comprehensive unit test suite for Feature 51: Competitive Exam Sprint Planner & Mock Proctor
 */

const assert = require('assert');
const examEngine = require('../modules/horizon/competitiveExamPlannerEngine');

console.log('Running Feature 51: Competitive Exam Sprint Planner & Mock Proctor Unit Tests...');

// Test 1: Registry check
const exams = examEngine.getExams();
assert(Array.isArray(exams), 'Exams list should be an array');
assert(exams.length >= 3, 'Should support at least GATE, CAT, and GRE');

const gate = exams.find(e => e.id === 'GATE_CS');
assert(gate, 'GATE_CS should exist in registry');
assert.strictEqual(gate.totalQuestions, 65);
assert.strictEqual(gate.maxMarks, 100);
assert(gate.subjectBreakdown.length >= 7, 'Should have comprehensive subject breakdown');

console.log('✓ Test 1 Passed: Exam registry and syllabus breakdown verified.');

// Test 2: Presets check
const presets = examEngine.getPresets();
assert(Array.isArray(presets), 'Presets should be an array');
assert(presets.length >= 3, 'Should have at least 3 presets');
assert(presets.some(p => p.examId === 'GATE_CS'), 'Should have a GATE CS preset');
assert(presets.some(p => p.examId === 'CAT_MBA'), 'Should have a CAT MBA preset');

console.log('✓ Test 2 Passed: Preset configurations verified.');

// Test 3: Sprint Plan Generation
const sprint = examEngine.generateSprintPlan({
  examId: 'GATE_CS',
  studentName: 'Aarav Gupta',
  targetDays: 90,
  dailyHours: 5,
  weakAreas: ['Computer Networks', 'Operating Systems & System Calls']
});

assert.strictEqual(sprint.examId, 'GATE_CS');
assert.strictEqual(sprint.totalSprintDays, 90);
assert.strictEqual(sprint.dailyAvailableHours, 5);
assert.strictEqual(sprint.totalStudyHours, 450);
assert.strictEqual(sprint.phases.length, 3, 'Sprint should have exactly 3 phases');

const weakSubject = sprint.subjects.find(s => s.subject.includes('Computer Networks'));
assert(weakSubject, 'Subject list should contain Computer Networks');
assert.strictEqual(weakSubject.priority, 'URGENT REMEDIATION', 'Weak area should be prioritized');
assert(weakSubject.isWeakArea === true);

console.log('✓ Test 3 Passed: 3-Phase adaptive sprint planner with weak-area prioritization verified.');

// Test 4: Mock Performance Diagnostic - GATE CS
const gateMock = examEngine.evaluateMockPerformance({
  examId: 'GATE_CS',
  attempted: 52,
  correct: 42,
  incorrect: 10,
  unattempted: 13
});

assert.strictEqual(gateMock.attempted, 52);
assert.strictEqual(gateMock.correct, 42);
assert.strictEqual(gateMock.incorrect, 10);
assert(gateMock.rawScore > 50, 'Raw score should exceed 50 marks');
assert(gateMock.negativePenaltyMarks > 0, 'Negative penalty should be calculated');
assert(gateMock.estimatedPercentile >= 90, 'Percentile should be above 90 for 42 correct');
assert(gateMock.predictedRankOrBand.length > 0);
assert(gateMock.tacticalInsight.length > 0);

console.log('✓ Test 4 Passed: GATE CS negative marking and percentile calibration verified.');

// Test 5: Mock Performance Diagnostic - CAT MBA
const catMock = examEngine.evaluateMockPerformance({
  examId: 'CAT_MBA',
  attempted: 45,
  correct: 36,
  incorrect: 9,
  unattempted: 21
});

assert.strictEqual(catMock.attempted, 45);
assert(catMock.rawScore >= 95, 'Raw score should be around 100 marks for 36 correct in CAT');
assert(catMock.estimatedPercentile >= 98.0, 'Percentile should project top IIM shortlists');
assert(catMock.predictedRankOrBand.includes('Percentile'));

console.log('✓ Test 5 Passed: CAT MBA score-to-percentile curve verified.');

// Test 6: Mock Performance Diagnostic - GRE General
const greMock = examEngine.evaluateMockPerformance({
  examId: 'GRE_GEN',
  attempted: 54,
  correct: 48,
  incorrect: 6,
  unattempted: 0
});

assert.strictEqual(greMock.maxScore, 340);
assert(greMock.rawScore >= 325, 'Score should reflect competitive high-tier GRE');
assert.strictEqual(greMock.negativePenaltyMarks, 0, 'GRE should incur 0 negative penalty marks');

console.log('✓ Test 6 Passed: GRE General adaptive score mapping verified.');

console.log('\nAll Feature 51 Exam Planner Unit Tests PASSED Successfully! (6/6)');
