const { describe, it } = require('node:test');
const assert = require('node:assert');

const {
  studyAbroadEngine,
  UNIVERSITIES_CATALOG,
  PRESETS
} = require('../modules/horizon/studyAbroadEngine');

describe('V26 Feature 50: Study Abroad & Global MS/PhD Admissions Engine', () => {
  it('retrieves global universities catalog with requirements and costs', () => {
    const res = studyAbroadEngine.getUniversities();
    assert.strictEqual(res.success, true);
    assert.ok(Array.isArray(res.universities));
    assert.ok(res.universities.length >= 6);

    const stanford = res.universities.find(u => u.id === 'stanford_ms_cs');
    assert.ok(stanford);
    assert.strictEqual(stanford.country, 'USA');
    assert.strictEqual(stanford.recommendedGreQuant, 168);

    const tum = res.universities.find(u => u.id === 'tum_ms_informatics');
    assert.ok(tum);
    assert.strictEqual(tum.country, 'Germany');
  });

  it('retrieves candidate presets', () => {
    const presets = studyAbroadEngine.getPresets();
    assert.ok(Array.isArray(presets));
    assert.ok(presets.length >= 3);
    assert.ok(presets.some(p => p.id === 'top_tier_ivy_aspirant'));
  });

  it('evaluates top-tier student and categorizes Stanford/CMU as Ambitious, UIUC/GaTech as Target/Safe', () => {
    const res = studyAbroadEngine.evaluate({
      cgpa: 9.25,
      greQuant: 169,
      greVerbal: 161,
      toeflScore: 112,
      ieltsScore: 8.5,
      budgetCeilingUsd: 85000
    });

    assert.strictEqual(res.success, true);
    assert.strictEqual(res.profileSummary.wesGpaEstimated, 3.9);
    assert.strictEqual(res.profileSummary.totalGre, 330);

    const cat = res.categorization;
    assert.ok(cat.ambitious.count >= 1);
    assert.ok(cat.target.count >= 1);
    assert.ok(cat.safe.count >= 1);

    // Stanford has <10% acceptance rate, must be in ambitious
    assert.ok(cat.ambitious.universities.some(u => u.id === 'stanford_ms_cs'));

    // Financial plan verification
    assert.ok(res.financialProofPlan.recommendedLiquidFundUsd >= 50000);
    assert.strictEqual(res.financialProofPlan.visaFinancialAdvice.length, 3);
  });

  it('evaluates budget-conscious European scholar and verifies German blocked account advice', () => {
    const res = studyAbroadEngine.evaluate({
      cgpa: 8.70,
      greQuant: 162,
      greVerbal: 152,
      toeflScore: 98,
      ieltsScore: 7.5,
      budgetCeilingUsd: 30000
    });

    assert.strictEqual(res.success, true);
    assert.ok(res.financialProofPlan.visaFinancialAdvice.some(a => a.includes('Sperrkonto')));
  });
});
