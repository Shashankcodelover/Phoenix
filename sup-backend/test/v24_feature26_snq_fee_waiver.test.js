const { describe, it } = require('node:test');
const assert = require('node:assert');

const { SnqFeeWaiverEngine, SNQ_COLLEGE_BENCHMARKS } = require('../modules/horizon/snqFeeWaiverEngine');

describe('V24 Quality Focus: Feature 26 — Supernumerary Quota (SNQ) & Tuition Fee Waiver Engine', () => {
  const engine = new SnqFeeWaiverEngine();

  it('evaluates income below ₹8.0 LPA and calculates 4-year fee savings of ₹4,10,000', () => {
    const report = engine.evaluateSnqEligibility({
      candidateRank: 2140,
      annualFamilyIncomeInr: 240000,
      hasValidRdIncomeCert: true
    });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.isSnqEligible, true);
    assert.ok(report.feeComparison.totalFourYearSavings.includes('₹4,10,000'));
    assert.strictEqual(report.collegeBenchmarks.length, 4);
    assert.ok(report.documentChecklist[0].includes('RD Number'));
  });

  it('correctly marks SNQ ineligible when income exceeds ₹8.0 LPA ceiling', () => {
    const report = engine.evaluateSnqEligibility({
      candidateRank: 1200,
      annualFamilyIncomeInr: 950000,
      hasValidRdIncomeCert: true
    });

    assert.strictEqual(report.isSnqEligible, false);
  });
});
