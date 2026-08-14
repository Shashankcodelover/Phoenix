const { describe, it } = require('node:test');
const assert = require('node:assert');

const { SeatRetentionStrategyEngine } = require('../modules/horizon/seatRetentionStrategyEngine');

describe('V25 Enterprise Tier: Feature 64 — KEA Multi-Round Seat Retention vs Upgrade Engine', () => {
  const engine = new SeatRetentionStrategyEngine();

  it('evaluates Choice 2 seat retention safety net and provides challan compliance checklist', () => {
    const report = engine.evaluateRetentionStrategy({
      allottedCollege: 'BMSCE ISE',
      candidateRank: 1350,
      targetUpgradeCollege: 'RVCE CSE',
      targetCutoff: 1200,
      selectedKeaChoice: 'Choice_2'
    });

    assert.strictEqual(report.success, true);
    assert.ok(report.selectedChoiceStrategy.seatRetentionGuarantee.includes('100% Protected'));
    assert.strictEqual(report.selectedChoiceStrategy.complianceChecklist.length, 3);
    assert.ok(report.statisticalUpgradeOdds.upgradeProbability.includes('High Probability'));
  });

  it('correctly warns on Choice 3 forfeiture of Round 1 seat', () => {
    const report = engine.evaluateRetentionStrategy({
      selectedKeaChoice: 'Choice_3'
    });

    assert.strictEqual(report.success, true);
    assert.ok(report.selectedChoiceStrategy.seatRetentionGuarantee.includes('Forfeited'));
  });
});
