const { describe, it } = require('node:test');
const assert = require('node:assert');

const { ScholarshipMatcherEngine, STATE_SCHOLARSHIP_SCHEMES } = require('../modules/horizon/scholarshipMatcherEngine');

describe('V24 Quality Focus: Feature 34 — Karnataka State Scholarship (SSP / NSP) Matcher Engine', () => {
  const engine = new ScholarshipMatcherEngine();

  it('matches female engineering student with BCWD and Pragati scholarships totaling ₹85,000', () => {
    const report = engine.matchScholarships({
      category: '2A',
      annualIncomeLpa: 2.0,
      gender: 'Female',
      isHosteller: true,
      isNpciBankSeeded: true
    });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.matchedSchemesCount, 2);
    assert.strictEqual(report.totalEligibleAnnualGrantInr, '₹85,000');
    assert.strictEqual(report.npciSeedingStatus, 'Verified (DBT Ready)');
    assert.strictEqual(report.mandatoryDocuments.length, 4);

    const pragati = report.matchedSchemes.find(s => s.schemeName.includes('Pragati'));
    assert.ok(pragati);
    assert.strictEqual(pragati.annualGrantInr, 50000);
  });
});
