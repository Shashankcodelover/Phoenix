const { describe, it } = require('node:test');
const assert = require('node:assert');

const { PlacementTelemetryDashboard } = require('../modules/interview-prep/placementTelemetryDashboard');

describe('V24 Quality Focus: Feature 17 — Placement Readiness Institutional Telemetry Dashboard', () => {
  const dashboard = new PlacementTelemetryDashboard();

  it('retrieves institutional consortium metrics with 1,420 enrolled students and 78.4% FAANG readiness', () => {
    const report = dashboard.getInstitutionalMetrics();

    assert.strictEqual(report.success, true);
    assert.ok(report.institution.includes('Karnataka Engineering Consortium'));
    assert.strictEqual(report.metrics.totalEnrolled, 1420);
    assert.strictEqual(report.metrics.faangTier1Readiness, '78.4%');
    assert.ok(report.metrics.averageVoiceLatency.includes('284ms'));
    assert.strictEqual(report.departments.length, 4);
  });

  it('evaluates branch breakdown and detects at-risk ECE lateral cohort interventions', () => {
    const report = dashboard.getInstitutionalMetrics();

    const cse = report.departments.find(d => d.department.includes('CSE'));
    assert.ok(cse.readinessPercent >= 88);

    assert.ok(report.hiringPartners.some(hp => hp.company === 'Google' && hp.matchedOffers === 42));
    assert.ok(report.atRiskInterventions.some(i => i.includes('ECE Lateral Entry')));
  });
});
