const { describe, it } = require('node:test');
const assert = require('node:assert');

const { ManagementQuotaFeeEngine, MANAGEMENT_QUOTA_COLLEGES } = require('../modules/horizon/managementQuotaFeeEngine');

describe('V24 Quality Focus: Feature 36 — Management Quota Fee & COA Forecaster Engine', () => {
  const engine = new ManagementQuotaFeeEngine();

  it('calculates 4-year cost of attendance and payback ROI for RVCE Management Quota CSE', () => {
    const report = engine.calculateCostOfAttendance({ collegeCode: 'RVCE' });

    assert.strictEqual(report.success, true);
    assert.ok(report.collegeName.includes('R.V. College'));
    assert.strictEqual(report.breakdown.oneTimeInstitutionalDonation, '₹20,00,000');
    assert.strictEqual(report.breakdown.totalCostOfAttendance, '₹45,20,000');
    assert.strictEqual(report.roiAnalysis.avgPlacementPackageLpa, '16.5 LPA');
    assert.ok(report.roiAnalysis.investmentVerdict.includes('High ROI'));
  });
});
