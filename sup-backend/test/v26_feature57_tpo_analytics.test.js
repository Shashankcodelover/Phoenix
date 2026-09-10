const { describe, it } = require('node:test');
const assert = require('node:assert');
const { tpoAnalyticsDashboardEngine } = require('../modules/horizon/tpoAnalyticsDashboardEngine');

describe('Feature 57: TPO Placement Officer Institutional Analytics Engine', () => {
  it('should return institutional summary with batch metrics and departments', () => {
    const summary = tpoAnalyticsDashboardEngine.getInstitutionalSummary();
    assert.ok(summary);
    assert.strictEqual(summary.batchYear, 2026);
    assert.ok(summary.departments.length >= 5);
    assert.ok(summary.overallPlacementRatePct > 80);
    assert.ok(summary.unplacedStudentRoster.length > 0);
  });

  it('should return valid institution presets', () => {
    const presets = tpoAnalyticsDashboardEngine.getPresets();
    assert.ok(Array.isArray(presets));
    assert.ok(presets.length >= 3);
    assert.ok(presets[0].label.includes('NITK'));
  });

  it('should filter metrics by department code', () => {
    const cse = tpoAnalyticsDashboardEngine.filterDepartment('CSE');
    assert.ok(cse.success);
    assert.strictEqual(cse.department.code, 'CSE');
    assert.ok(cse.placementRatePct > 90);
    assert.strictEqual(cse.unplacedCount, 8);
  });

  it('should calculate accurate triage score for unplaced student', () => {
    const student = {
      id: 'STU-999',
      name: 'Test Student',
      activeBacklogs: 1,
      cgpa: 6.0,
      interviewsRejected: 5,
      codingTestAvgScore: 40
    };
    const triage = tpoAnalyticsDashboardEngine.triageUnplacedStudent(student);
    assert.ok(triage.urgencyScore >= 75);
    assert.strictEqual(triage.triageLevel, 'CRITICAL RESCUE PROTOCOL');
    assert.ok(triage.recommendedStrategy.includes('1-on-1'));
  });
});
