const { describe, it } = require('node:test');
const assert = require('node:assert');

const { AutonomousAffiliationEngine, AUTONOMOUS_COLLEGES_DB } = require('../modules/horizon/autonomousAffiliationEngine');

describe('V24 Quality Focus: Feature 49 — Autonomous vs Affiliated Academic Freedom Engine', () => {
  const engine = new AutonomousAffiliationEngine();

  it('evaluates autonomous academic agility, relative grading curve, and summer makeup option for RVCE', () => {
    const report = engine.evaluateAcademicFreedom({ collegeCode: 'RVCE' });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.collegeCode, 'RVCE');
    assert.strictEqual(report.freedomIndexScore, '94/100 (High Academic Agility)');
    assert.ok(report.comparisonMetrics.curriculumUpdateCycle.includes('Ultra-High'));
    assert.ok(report.comparisonMetrics.gradingCurve.includes('Relative Grading'));
    assert.ok(report.comparisonMetrics.cgpaAdvantage.includes('+0.55'));
    assert.ok(report.comparisonMetrics.summerFastTrackMakeup.includes('Available'));
  });
});
