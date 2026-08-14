const { describe, it } = require('node:test');
const assert = require('node:assert');

const { SystemCostSlaEngine } = require('../modules/interview-prep/systemCostSlaEngine');

describe('V24 Quality Focus: Feature 24 — Distributed System Cloud Cost & SLA Calculator', () => {
  const engine = new SystemCostSlaEngine();

  it('calculates monthly infrastructure cost in USD and INR for 50,000 RPS multi-AZ topology', () => {
    const report = engine.calculateCostAndSla({
      expectedRps: 50000,
      computeNodes: 12,
      databaseType: 'CockroachDB Multi-AZ',
      cachingTier: 'Sharded Redis LRU (6 Nodes)',
      multiRegionEnabled: true
    });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.targetRps, 50000);
    assert.ok(report.totalMonthlyUsd.includes('$3,750'));
    assert.ok(report.totalMonthlyInr.includes('₹3,28,125'));
    assert.strictEqual(report.costBreakdown.length, 4);
    assert.strictEqual(report.slaAvailability.compositeUptime, '99.995% SLA');
    assert.ok(report.slaAvailability.maxAllowableDowntime.includes('2.16 minutes'));
  });

  it('calculates standard single-region topology SLA downtime allowance', () => {
    const report = engine.calculateCostAndSla({ multiRegionEnabled: false });

    assert.strictEqual(report.slaAvailability.compositeUptime, '99.95% SLA');
    assert.ok(report.slaAvailability.maxAllowableDowntime.includes('21.6 minutes'));
  });
});
