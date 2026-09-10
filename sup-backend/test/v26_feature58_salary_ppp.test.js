const { describe, it } = require('node:test');
const assert = require('node:assert');
const { salaryPppRelocationEngine } = require('../modules/horizon/salaryPppRelocationEngine');

describe('Feature 58: Salary Purchasing Power & Relocation Comparator Engine', () => {
  it('should list all global tech hubs with CoL and rent indexes', () => {
    const hubs = salaryPppRelocationEngine.getTechHubs();
    assert.ok(Array.isArray(hubs));
    assert.ok(hubs.length >= 6);
    const blr = hubs.find(h => h.code === 'BENGALURU');
    assert.ok(blr);
    assert.strictEqual(blr.currency, 'INR');
    assert.ok(blr.costOfLivingIndex < 35);
  });

  it('should return valid relocation comparison presets', () => {
    const presets = salaryPppRelocationEngine.getPresets();
    assert.ok(Array.isArray(presets));
    assert.ok(presets.length >= 3);
    assert.ok(presets[0].label.includes('San Francisco'));
  });

  it('should calculate PPP comparison between Bengaluru and San Francisco', () => {
    const comparison = salaryPppRelocationEngine.compareRelocationOffer({
      sourceHubCode: 'BENGALURU',
      sourceSalaryLocal: 3500000,
      targetHubCode: 'SAN_FRANCISCO',
      targetSalaryLocal: 180000
    });

    assert.ok(comparison.source);
    assert.ok(comparison.target);
    assert.strictEqual(comparison.source.city, 'Bengaluru');
    assert.strictEqual(comparison.target.city, 'San Francisco (Bay Area)');
    assert.ok(comparison.pppComparison.costOfLivingRatio > 3.0);
    assert.ok(comparison.pppComparison.targetEquivalentInSourceLocal > 0);
    assert.ok(comparison.target.estimatedAnnualSavingsUsd > 0);
  });

  it('should correctly handle zero state tax benefit for Seattle', () => {
    const comparison = salaryPppRelocationEngine.compareRelocationOffer({
      sourceHubCode: 'BENGALURU',
      sourceSalaryLocal: 3000000,
      targetHubCode: 'SEATTLE',
      targetSalaryLocal: 165000
    });

    assert.ok(comparison.target.netAnnualUsd > 0);
    assert.strictEqual(comparison.target.currency, 'USD');
    assert.ok(comparison.pppComparison.realWealthGrowthFactor > 1.0);
  });
});
