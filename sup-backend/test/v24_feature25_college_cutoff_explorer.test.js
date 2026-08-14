const { describe, it } = require('node:test');
const assert = require('node:assert');

const { CollegeCutoffExplorerEngine, HISTORICAL_COLLEGE_ARCHIVE } = require('../modules/horizon/collegeCutoffExplorerEngine');

describe('V24 Quality Focus: Feature 25 — Karnataka College Cutoff Explorer Engine', () => {
  const engine = new CollegeCutoffExplorerEngine();

  it('retrieves 5-year longitudinal historical cutoff trends for RVCE', () => {
    const trends = engine.getCutoffTrends('RVCE');

    assert.strictEqual(trends.success, true);
    assert.strictEqual(trends.collegeCode, 'RVCE');
    assert.strictEqual(trends.tier, 'Tier-1 Elite');
    assert.strictEqual(trends.branchTrends.CSE.history.length, 5);
    assert.strictEqual(trends.branchTrends.CSE.closingRank2026, 1850);
  });

  it('predicts admission probability bands (Safe / Target / Reach) accurately', () => {
    const safeForecast = engine.predictAdmissionChances({ candidateRank: 1200, collegeCode: 'RVCE', branch: 'CSE' });
    assert.strictEqual(safeForecast.success, true);
    assert.ok(safeForecast.admissionForecast.probabilityBand.includes('Safe'));

    const targetForecast = engine.predictAdmissionChances({ candidateRank: 2000, collegeCode: 'RVCE', branch: 'CSE' });
    assert.strictEqual(targetForecast.success, true);
    assert.ok(targetForecast.admissionForecast.probabilityBand.includes('Target'));
  });
});
