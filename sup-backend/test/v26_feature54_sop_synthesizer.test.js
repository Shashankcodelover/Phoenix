/**
 * v26_feature54_sop_synthesizer.test.js
 * Unit test suite for Feature 54: High-Stakes SOP & Personal Statement Synthesizer
 */

const assert = require('assert');
const sopEngine = require('../modules/horizon/highStakesSopSynthesizerEngine');

console.log('Running Feature 54: High-Stakes SOP & Personal Statement Synthesizer Unit Tests...');

// Test 1: Program Templates
const templates = sopEngine.getTemplates();
assert(Array.isArray(templates), 'Templates should be an array');
assert(templates.length >= 3, 'Should support at least Stanford, CMU, and ETH Zurich');

const stanford = templates.find(t => t.id === 'STANFORD_MS_CS');
assert(stanford, 'Stanford MS CS should exist');
assert.strictEqual(stanford.wordLimit, 1000);
assert(stanford.targetFaculty.length >= 2);

console.log('✓ Test 1 Passed: University program templates and faculty rosters verified.');

// Test 2: Presets Verification
const presets = sopEngine.getPresets();
assert(Array.isArray(presets));
assert(presets.length >= 3);
assert(presets.some(p => p.targetProgramId === 'STANFORD_MS_CS'));

console.log('✓ Test 2 Passed: Preset student personas verified.');

// Test 3: High-Stakes SOP Synthesis - Stanford MS CS
const stanfordSop = sopEngine.synthesizeSOP({
  candidateName: 'Akash Narayanan',
  targetProgramId: 'STANFORD_MS_CS',
  undergraduateBg: 'B.Tech in Computer Science from Tier-1 NIT (CGPA: 9.35/10)',
  keyProjects: 'Engineered speculative decoding runtime reducing 70B LLM inference latency by 42%',
  targetFaculty: 'Prof. Christopher Manning and Prof. Percy Liang',
  postGradGoals: 'Lead fundamental research at DeepMind / FAIR followed by Ph.D.'
});

assert.strictEqual(stanfordSop.targetUniversity, 'Stanford University');
assert.strictEqual(stanfordSop.targetProgram, 'Master of Science in Computer Science');
assert(stanfordSop.fullSopText.includes('Christopher Manning'));
assert(stanfordSop.fullSopText.includes('speculative decoding runtime'));
assert(stanfordSop.fullSopText.includes('42%'));
assert.strictEqual(stanfordSop.clicheAudit.status, 'CLEAN (Zero Banned Clichés)');
assert.strictEqual(stanfordSop.clicheAudit.detectedCliches.length, 0);
assert(stanfordSop.rhetoricalRigorScore >= 90, 'Rigor score should be >= 90 for clean technical essay');

console.log('✓ Test 3 Passed: Stanford MS CS SOP synthesis and rhetoric auditing verified.');

// Test 4: Cliché Detection Rigor Audit
const dirtySop = sopEngine.synthesizeSOP({
  candidateName: 'Test Student',
  targetProgramId: 'CMU_MS_SCS',
  undergraduateBg: 'Ever since I was a child, computers have always fascinated me and served as a stepping stone.',
  keyProjects: 'Passion for computers made me build websites.',
  targetFaculty: 'Prof. Andy Pavlo',
  postGradGoals: 'Work in USA.'
});

assert.strictEqual(dirtySop.clicheAudit.status, 'WARNING (Clichés Detected)');
assert(dirtySop.clicheAudit.detectedCliches.length >= 2, 'Should flag multiple banned clichés');

console.log('✓ Test 4 Passed: Rhetorical cliché warning auditor successfully flagged forbidden phrases.');

console.log('\nAll Feature 54 SOP Synthesizer Unit Tests PASSED Successfully! (4/4)');
