/**
 * v26_feature56_visa_readiness.test.js
 * Unit test suite for Feature 56: Visa & Immigration Readiness Simulator
 */

const assert = require('assert');
const visaEngine = require('../modules/horizon/visaImmigrationSimulatorEngine');

console.log('Running Feature 56: Visa & Immigration Readiness Simulator Unit Tests...');

// Test 1: Categories and Questions Registry
const categories = visaEngine.getVisaCategories();
assert(Array.isArray(categories), 'Categories should be an array');
assert(categories.length >= 3, 'Should support F-1, J-1, and German National D');

const f1 = categories.find(c => c.id === 'F1_STUDENT');
assert(f1);
assert(f1.regulations.includes('214(b)'));

const questions = visaEngine.getMockQuestions();
assert(Array.isArray(questions));
assert(questions.length >= 3, 'Should have at least 3 high-stakes consular questions');

console.log('✓ Test 1 Passed: Visa categories and consular question banks verified.');

// Test 2: Presets Verification
const presets = visaEngine.getPresets();
assert(Array.isArray(presets));
assert(presets.length >= 3);
assert(presets.some(p => p.visaType === 'F1_STUDENT'));
assert(presets.some(p => p.visaType === 'GERMAN_NATIONAL_D'));

console.log('✓ Test 2 Passed: Preset visa candidate profiles verified.');

// Test 3: Prime F-1 Profile Evaluation
const primeEvaluation = visaEngine.evaluateVisaReadiness({
  visaType: 'F1_STUDENT',
  firstYearCostUsd: 78000,
  liquidFundsUsd: 45000,
  loanSanctionUsd: 75000,
  postStudyPlan: 'Return to Bengaluru to join India AI sector',
  hasPropertyOrFamilyTies: true,
  researchArea: 'Compilers & Systems'
});

assert.strictEqual(primeEvaluation.financialCoverageRatio, 1.54);
assert.strictEqual(primeEvaluation.financialStatus, 'Optimal (Exceeds 1.5x Rule)');
assert(primeEvaluation.approvalProbabilityPct >= 85, 'Approval probability should be high');
assert.strictEqual(primeEvaluation.riskBand, 'Low Risk (High Approval Feasibility)');
assert(primeEvaluation.talAdministrativeCheck221g.includes('Clear'));

console.log('✓ Test 3 Passed: Prime F-1 applicant solvency ratio and 214(b) defense verified.');

// Test 4: Borderline Immigrant Intent Flagging
const borderlineEvaluation = visaEngine.evaluateVisaReadiness({
  visaType: 'F1_STUDENT',
  firstYearCostUsd: 50000,
  liquidFundsUsd: 15000,
  loanSanctionUsd: 35000,
  postStudyPlan: 'Stay in US permanently and get green card',
  hasPropertyOrFamilyTies: false,
  researchArea: 'Software Engineering'
});

assert(borderlineEvaluation.immigrantIntentRiskScore >= 60, 'Risk score should spike for permanent stay intent');
assert(borderlineEvaluation.riskBand.includes('High Risk'));
assert(borderlineEvaluation.approvalProbabilityPct <= 45);

console.log('✓ Test 4 Passed: INA 214(b) immigrant intent penalty and risk elevation verified.');

// Test 5: Consular Response Evaluation
const goodAnswer = visaEngine.scoreConsularAnswer('why_this_university', 'I chose Stanford for its Center for Research on Foundation Models under Prof. Percy Liang. Their research directly fits my capstone.');
assert(goodAnswer.clarityScore >= 80, 'Score should be high for faculty-focused answer');
assert.strictEqual(goodAnswer.status, 'EXCELLENT');

const badAnswer = visaEngine.scoreConsularAnswer('why_this_university', 'I want to settle in Silicon Valley and earn money fast to recover costs.');
assert(badAnswer.clarityScore < 60, 'Score should be penalized for immigrant intent keyword');
assert.strictEqual(badAnswer.status, 'RED FLAG DETECTED');

console.log('✓ Test 5 Passed: Consular mock answer evaluation and red-flag keyword trap verified.');

console.log('\nAll Feature 56 Visa Readiness Simulator Unit Tests PASSED Successfully! (5/5)');
