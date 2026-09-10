/**
 * v26_feature53_skill_gap_auditor.test.js
 * Unit test suite for Feature 53: Dynamic Skill Gap & Certification Pathway Auditor
 */

const assert = require('assert');
const auditorEngine = require('../modules/horizon/dynamicSkillGapAuditorEngine');

console.log('Running Feature 53: Dynamic Skill Gap & Certification Pathway Auditor Unit Tests...');

// Test 1: Certification Registry and Job Archetypes
const certs = auditorEngine.getCertifications();
assert(Array.isArray(certs), 'Certifications should be an array');
assert(certs.length >= 4, 'Should support at least CKA, AWS SAA, Terraform, and GCP');

const archetypes = auditorEngine.getJobArchetypes();
assert(Array.isArray(archetypes));
assert(archetypes.length >= 3, 'Should have at least 3 job archetypes');

console.log('✓ Test 1 Passed: Industry certification registry and job archetypes verified.');

// Test 2: Presets Verification
const presets = auditorEngine.getPresets();
assert(Array.isArray(presets));
assert(presets.length >= 3);
assert(presets.some(p => p.targetRoleId === 'CLOUD_DEVOPS_ENGINEER'));

console.log('✓ Test 2 Passed: Preset personas verified.');

// Test 3: Audit Execution - Cloud DevOps Role
const devopsAudit = auditorEngine.auditSkillGap({
  studentName: 'Sanjay Krishnan',
  targetRoleId: 'CLOUD_DEVOPS_ENGINEER',
  transcriptCourses: ['Operating Systems', 'Linux Administration'],
  existingSkills: ['Linux internals', 'Docker', 'Python', 'CI/CD pipelines']
});

assert.strictEqual(devopsAudit.targetRoleId, 'CLOUD_DEVOPS_ENGINEER');
assert(devopsAudit.matchedStrengths.includes('Docker'));
assert(devopsAudit.matchedStrengths.includes('Linux internals'));
assert(devopsAudit.matchedStrengths.includes('CI/CD pipelines'));
assert(devopsAudit.missingDeficits.includes('Kubernetes'));
assert(devopsAudit.missingDeficits.includes('Terraform'));
assert(devopsAudit.matchRatePct >= 35, 'Match rate should reflect identified strengths');
assert.strictEqual(devopsAudit.recommendedCertification.id, 'CKA_K8S', 'Should recommend CKA for missing Kubernetes');
assert(Array.isArray(devopsAudit.recommendedCertification.weeklySprint));
assert.strictEqual(devopsAudit.recommendedCertification.weeklySprint.length, 4);

console.log('✓ Test 3 Passed: Cloud DevOps skill gap audit and CKA roadmap mapping verified.');

// Test 4: Audit Execution - Distributed Backend SWE
const backendAudit = auditorEngine.auditSkillGap({
  studentName: 'Meera Nambiar',
  targetRoleId: 'BACKEND_DISTRIBUTED_SWE',
  transcriptCourses: ['Data Structures', 'Database Systems'],
  existingSkills: ['Go', 'PostgreSQL', 'Redis', 'Docker']
});

assert.strictEqual(backendAudit.targetRoleId, 'BACKEND_DISTRIBUTED_SWE');
assert(backendAudit.matchedStrengths.includes('Go'));
assert(backendAudit.matchedStrengths.includes('PostgreSQL'));
assert(backendAudit.missingDeficits.includes('AWS'));
assert.strictEqual(backendAudit.recommendedCertification.id, 'AWS_SAA');

console.log('✓ Test 4 Passed: Distributed Backend SWE skill gap audit and AWS SAA roadmap mapping verified.');

console.log('\nAll Feature 53 Skill Gap Auditor Unit Tests PASSED Successfully! (4/4)');
