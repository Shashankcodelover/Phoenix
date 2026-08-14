const { describe, it } = require('node:test');
const assert = require('node:assert');

const { BranchSuitabilityEngine } = require('../modules/horizon/branchSuitabilityEngine');

describe('V24 Quality Focus: Feature 31 — Branch Suitability AI Diagnostic Engine', () => {
  const engine = new BranchSuitabilityEngine();

  it('calculates weighted branch suitability across CSE, ISE, AIML, and ECE', () => {
    const report = engine.evaluateBranchSuitability({
      discreteMathScore: 92,
      probabilityStatsScore: 85,
      hardwareInterestScore: 60,
      softwareAppDevScore: 95
    });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.branchRankings.length, 4);

    const cse = report.branchRankings.find(b => b.branchCode === 'CSE');
    assert.ok(cse);
    assert.strictEqual(cse.suitabilityScore, '94%');
    assert.strictEqual(cse.recommended, true);

    const ise = report.branchRankings.find(b => b.branchCode === 'ISE');
    assert.ok(ise);
    assert.strictEqual(ise.suitabilityScore, '94%');

    assert.ok(report.counselorSummary.includes('Discrete Algorithms'));
  });
});
