/**
 * v26_feature52_internship_tracker.test.js
 * Unit test suite for Feature 52: Industry Internship Pipeline & Stipend Tracker
 */

const assert = require('assert');
const internshipEngine = require('../modules/horizon/industryInternshipTrackerEngine');

console.log('Running Feature 52: Industry Internship Pipeline & Stipend Tracker Unit Tests...');

// Test 1: Directory listing and filters
const allInternships = internshipEngine.getInternships();
assert(Array.isArray(allInternships), 'Should return an array');
assert(allInternships.length >= 5, 'Should have at least 5 internships in directory');

const bigTechOnly = internshipEngine.getInternships({ category: 'Big Tech' });
assert(bigTechOnly.length >= 2, 'Should return at least Google and Microsoft');
assert(bigTechOnly.every(item => item.category === 'Big Tech'));

const highStipend = internshipEngine.getInternships({ minStipend: 200000 });
assert(highStipend.length >= 1, 'Should find high stipend internships');
assert(highStipend.some(item => item.company.includes('D. E. Shaw')));

console.log('✓ Test 1 Passed: Internship directory listing and multi-criteria filters verified.');

// Test 2: Stipend Index Aggregate Metrics
const stipendIndex = internshipEngine.getStipendIndex();
assert.strictEqual(stipendIndex.totalTrackedPrograms, allInternships.length);
assert(stipendIndex.averageMonthlyStipendInr >= 100000, 'Average stipend should be at least 1L');
assert.strictEqual(stipendIndex.maxMonthlyStipendInr, 350000);
assert(stipendIndex.averagePpoConversionPct >= 65, 'Average PPO conversion should be >65%');
assert(Array.isArray(stipendIndex.categoryBreakdown), 'Category breakdown should be present');

console.log('✓ Test 2 Passed: Real-time monthly stipend indices and PPO benchmarks verified.');

// Test 3: Presets check
const presets = internshipEngine.getPresets();
assert(Array.isArray(presets));
assert(presets.length >= 3);
assert(presets.some(p => p.targetCategory === 'Big Tech'));
assert(presets.some(p => p.targetCategory === 'Quant/HFT'));

console.log('✓ Test 3 Passed: Preset personas verified.');

// Test 4: Referral Outreach Generator
const pitch = internshipEngine.generateReferralPitch({
  candidateName: 'Aditi Rao',
  company: 'Google',
  role: 'Software Engineering Intern',
  keySkills: ['C++', 'Distributed Systems', 'LeetCode 500+'],
  githubProfile: 'https://github.com/aditi-rao'
});

assert(pitch.subjectLine.includes('Referral Request'));
assert(pitch.subjectLine.includes('Aditi Rao'));
assert(pitch.messageBody.includes('Google'));
assert(pitch.messageBody.includes('Distributed Systems'));
assert(Array.isArray(pitch.tips) && pitch.tips.length >= 2);

console.log('✓ Test 4 Passed: Cold referral note generation and outreach tips verified.');

// Test 5: Pipeline Kanban Funnel Summarization
const mockApplications = [
  { company: 'Google', status: 'Technical Round' },
  { company: 'Microsoft', status: 'OA Scheduled' },
  { company: 'Zepto', status: 'Offer Received' },
  { company: 'Razorpay', status: 'Applied' },
  { company: 'D. E. Shaw', status: 'Saved' }
];

const summary = internshipEngine.summarizePipeline(mockApplications);
assert.strictEqual(summary.totalApplications, 5);
assert.strictEqual(summary.stageCounts['Technical Round'], 1);
assert.strictEqual(summary.stageCounts['Offer Received'], 1);
assert(summary.interviewRatePct >= 30, 'Interview rate should be around 40%');
assert.strictEqual(summary.pipelineHealth, 'Optimal (High-Yield)');

console.log('✓ Test 5 Passed: Application Kanban pipeline funnels and metrics verified.');

console.log('\nAll Feature 52 Internship Tracker Unit Tests PASSED Successfully! (5/5)');
