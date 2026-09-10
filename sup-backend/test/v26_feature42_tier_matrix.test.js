const { describe, it } = require('node:test');
const assert = require('node:assert');

const { InstitutionalTierMatrixEngine, INSTITUTION_MATRIX } = require('../modules/horizon/institutionalTierMatrixEngine');

describe('V26 Feature 42: Institutional Tier & Accreditation Matrix', () => {
  const engine = new InstitutionalTierMatrixEngine();

  it('retrieves institutional catalog with NIRF ranks and NAAC/NBA accreditations', () => {
    const catalog = engine.getCatalog();
    assert.ok(Array.isArray(catalog));
    assert.ok(catalog.length >= 5);

    const iitb = catalog.find(c => c.code === 'IITB');
    assert.ok(iitb);
    assert.strictEqual(iitb.tierCategory, 'Tier-1 National Apex');
    assert.strictEqual(iitb.nirfRank, 3);
    assert.ok(iitb.naac.includes('A++'));

    const rvce = catalog.find(c => c.code === 'RVCE');
    assert.ok(rvce);
    assert.strictEqual(rvce.tierCategory, 'Tier-1 State Premier Autonomous');
    assert.ok(rvce.nba.includes('Tier-1'));
  });

  it('calculates accurate 4-year tuition ROI and payback period', () => {
    const data = engine.getInstitution('RVCE');
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.institution.code, 'RVCE');

    const roi = data.roiMetrics;
    assert.ok(roi.roiYear1Percent >= 100, 'ROI percentage is over 100%');
    assert.ok(roi.paybackMonths <= 12, 'Payback period is under 12 months for KCET fee');
    assert.ok(roi.tenYearNetWealthInr > 10000000, '10-year earnings net of tuition exceeds 1 crore');
    assert.ok(roi.institutionalQualityIndex >= 55, 'IQI index is institutional tier standard');
  });

  it('calculates custom fee ROI (e.g. COMEDK vs KCET fee)', () => {
    const inst = engine.getInstitution('RVCE').institution;
    const comedkRoi = engine.calculateRoiMetrics(inst, 1750000); // 17.5L COMEDK fee + hostel

    assert.ok(comedkRoi.totalCostInr === 1750000);
    assert.ok(comedkRoi.paybackMonths > 12, 'COMEDK higher fee extends payback months');
    assert.ok(comedkRoi.roiYear1Percent < 100);
  });

  it('performs side-by-side institutional comparison and determines academic and financial winners', () => {
    const comparison = engine.compareInstitutions(['IITB', 'RVCE', 'UVCE']);
    assert.strictEqual(comparison.success, true);
    assert.strictEqual(comparison.comparedCount, 3);
    assert.ok(comparison.analysis.academicQualityWinner);
    assert.ok(comparison.analysis.financialRoiWinner);
    assert.ok(comparison.analysis.recommendation.includes('leads'));
  });
});
