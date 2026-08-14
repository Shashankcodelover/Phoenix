const { describe, it } = require('node:test');
const assert = require('node:assert');

const { IpGovernanceEngine } = require('../modules/hackathon-agent/ipGovernanceEngine');

describe('V24 Quality Focus: Feature 53 — Hackathon IP Governance & SAFE Note Engine', () => {
  const engine = new IpGovernanceEngine();

  it('generates Apache-2.0 patent grant license, 4-way founder vesting, and YC SAFE note terms', () => {
    const report = engine.generateIpPackage({
      projectName: 'Phoenix Autonomous Agent',
      licenseType: 'Apache-2.0',
      founderNames: ['Alice', 'Bob', 'Charlie', 'Diana'],
      valuationCapUsd: 2000000
    });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.projectName, 'Phoenix Autonomous Agent');
    assert.strictEqual(report.licenseType, 'Apache-2.0');
    assert.ok(report.licenseOverview.includes('patent grant protection'));
    assert.strictEqual(report.equityVestingGovernance.founderShares.length, 4);
    assert.strictEqual(report.equityVestingGovernance.founderShares[0].equity, '25.0%');
    assert.ok(report.equityVestingGovernance.founderShares[0].vestingSchedule.includes('1-Year Cliff'));
    assert.strictEqual(report.ycSafeNoteTerms.valuationCap, '$2,000,000');
  });
});
