const { describe, it } = require('node:test');
const assert = require('node:assert');

const { VtuCgpaCalculatorEngine } = require('../modules/horizon/vtuCgpaCalculatorEngine');

describe('V24 Quality Focus: Feature 39 — VTU CBCS CGPA to Percentage & Eligibility Engine', () => {
  const engine = new VtuCgpaCalculatorEngine();

  it('converts VTU 8.42 CGPA to 76.7% and asserts First Class with Distinction and FAANG eligibility', () => {
    const report = engine.convertCgpa({ cgpa: 8.42, scheme: '2022 Scheme CBCS', activeBacklogs: 0 });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.percentage, '76.7%');
    assert.strictEqual(report.classAwarded, 'First Class with Distinction (FCD)');
    assert.strictEqual(report.backlogStatus, 'Clean Record (0 Active Backlogs)');
    assert.strictEqual(report.eligibilityProfiles.length, 3);

    const faangProfile = report.eligibilityProfiles.find(p => p.tier.includes('FAANG'));
    assert.ok(faangProfile);
    assert.strictEqual(faangProfile.isEligible, true);
  });
});
