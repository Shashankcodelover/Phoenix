const { describe, it } = require('node:test');
const assert = require('node:assert');

const { IncubatorGrantEngine, COLLEGE_INCUBATOR_REGISTRY } = require('../modules/horizon/incubatorGrantEngine');

describe('V24 Quality Focus: Feature 60 — Karnataka Incubator Grants & Patent Subsidy Engine', () => {
  const engine = new IncubatorGrantEngine();

  it('matches RVCE startup with CIIL ₹10L DST NIDHI grant and ₹2L Karnataka patent subsidy', () => {
    const report = engine.matchGrants({
      collegeKey: 'RVCE',
      startupDomain: 'Edge AI & Autonomous Robotics'
    });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.collegeKey, 'RVCE');
    assert.ok(report.incubatorDetails.centreName.includes('RV Centre for Innovation'));
    assert.strictEqual(report.incubatorDetails.availableGrantPool, '₹10,00,000 (DST NIDHI-EIR / PRAYAS)');
    assert.ok(report.incubatorDetails.patentFilingSubsidy.includes('₹2,00,000'));
    assert.strictEqual(report.karnatakaElevateFastTrack.maximumGrant, '₹25,00,000 (Equity-Free State Grant)');
    assert.strictEqual(report.patentFilingRoadmap.length, 3);
  });
});
