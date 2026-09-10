/**
 * v26_feature55_lor_drafter.test.js
 * Unit test suite for Feature 55: Faculty Recommendation Letter (LOR) Drafter
 */

const assert = require('assert');
const lorEngine = require('../modules/horizon/facultyLorDrafterEngine');

console.log('Running Feature 55: Faculty Recommendation Letter (LOR) Drafter Unit Tests...');

// Test 1: Archetypes Check
const archetypes = lorEngine.getLorArchetypes();
assert(Array.isArray(archetypes), 'Archetypes should be an array');
assert(archetypes.length >= 3, 'Should support at least Research, Coursework/HOD, and Industry manager');

const researchArch = archetypes.find(a => a.id === 'ACADEMIC_RESEARCH_PROFESSOR');
assert(researchArch);
assert(researchArch.focus.includes('Research Rigor'));

console.log('✓ Test 1 Passed: LOR Recommender archetypes and specialization rubrics verified.');

// Test 2: Presets Check
const presets = lorEngine.getPresets();
assert(Array.isArray(presets));
assert(presets.length >= 3);
assert(presets.some(p => p.candidateRankPercentile.includes('Top 1%')));

console.log('✓ Test 2 Passed: Preset faculty and industry scenarios verified.');

// Test 3: Academic Research Professor LOR Draft
const researchLor = lorEngine.draftLOR({
  archetypeId: 'ACADEMIC_RESEARCH_PROFESSOR',
  candidateName: 'Akash Narayanan',
  recommenderName: 'Dr. S. K. Ramanathan',
  recommenderTitle: 'Professor & Head of Intelligent Systems Lab',
  institution: 'National Institute of Technology (NIT)',
  relationshipDuration: '2 years as undergraduate research assistant',
  courseOrLabTaught: 'Deep Learning & Natural Language Processing Lab',
  candidateRankPercentile: 'Top 1% among 180 students',
  keyProjectHighlight: 'Formulated a novel speculative decoding pipeline for 70B LLMs, resulting in an accepted workshop paper at EMNLP 2025 and 42% latency drop.',
  softSkills: 'Intellectual fearlessness and collaborative lab leadership',
  targetDegree: 'Ph.D. in Computer Science'
});

assert.strictEqual(researchLor.candidateName, 'Akash Narayanan');
assert.strictEqual(researchLor.recommenderName, 'Dr. S. K. Ramanathan');
assert(researchLor.fullLetter.includes('Top 1% among 180 students'));
assert(researchLor.fullLetter.includes('speculative decoding pipeline'));
assert(researchLor.fullLetter.includes('EMNLP 2025'));
assert(researchLor.endorsementScore >= 95, 'Endorsement score should be high for top 1% rank');
assert.strictEqual(researchLor.wordCount > 250, true);
assert(Array.isArray(researchLor.verificationChecklist));
assert(researchLor.verificationChecklist.length >= 3);

console.log('✓ Test 3 Passed: Academic research professor LOR synthesis and rubric evaluation verified.');

// Test 4: Coursework HOD LOR Draft
const hodLor = lorEngine.draftLOR({
  archetypeId: 'COURSEWORK_FACULTY_HOD',
  candidateName: 'Rhea Chakraborty',
  recommenderName: 'Dr. Meenakshi Sundaram',
  recommenderTitle: 'Head of Department, CSE',
  institution: 'RV College of Engineering',
  relationshipDuration: '3 academic semesters',
  courseOrLabTaught: 'Advanced Operating Systems',
  candidateRankPercentile: 'Rank 2 out of 145 students (Top 1.5%)',
  keyProjectHighlight: 'Engineered a Raft-replicated transactional key-value store in Modern C++ sustaining 180k ops/sec.',
  softSkills: 'Exemplary academic discipline and mentoring junior batchmates',
  targetDegree: 'M.S. in Computer Science'
});

assert.strictEqual(hodLor.candidateName, 'Rhea Chakraborty');
assert(hodLor.fullLetter.includes('Rank 2 out of 145 students'));
assert(hodLor.fullLetter.includes('Raft-replicated transactional key-value store'));
assert(hodLor.fullLetter.includes('Dr. Meenakshi Sundaram'));

console.log('✓ Test 4 Passed: Department HOD coursework LOR synthesis verified.');

console.log('\nAll Feature 55 LOR Drafter Unit Tests PASSED Successfully! (4/4)');
