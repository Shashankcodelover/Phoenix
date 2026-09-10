const { describe, it } = require('node:test');
const assert = require('node:assert');

const { UniversalScholarshipMatcherEngine, SCHOLARSHIP_CATALOG } = require('../modules/horizon/universalScholarshipMatcherEngine');

describe('V26 Feature 43: Scholarship & Financial Aid Eligibility Matcher', () => {
  const engine = new UniversalScholarshipMatcherEngine();

  it('retrieves full scholarship catalog with deadlines and grant amounts', () => {
    const catalog = engine.getCatalog();
    assert.ok(Array.isArray(catalog));
    assert.ok(catalog.length >= 7);

    const google = catalog.find(s => s.id === 'google-gen-scholarship');
    assert.ok(google);
    assert.strictEqual(google.annualGrantInr, 200000);
    assert.ok(google.targetGender.includes('Female'));

    const ssp = catalog.find(s => s.id === 'karnataka-ssp-postmatric');
    assert.ok(ssp);
    assert.strictEqual(ssp.incomeCeilingLpa, 2.5);
  });

  it('retrieves preset student profiles', () => {
    const presets = engine.getPresets();
    assert.ok(Array.isArray(presets));
    assert.ok(presets.length >= 3);
  });

  it('accurately matches female tech scholar profile to multiple grants (Google + Amazon + SSP + SNQ)', () => {
    const match = engine.matchScholarships({
      gender: 'Female',
      category: '2A',
      annualIncomeLpa: 2.2,
      academicPercent: 91.5,
      isHosteller: true,
      hasNpciSeededBank: true
    });

    assert.strictEqual(match.success, true);
    assert.ok(match.auditId.startsWith('SCHOLAR-AUDIT-'));
    assert.ok(match.metrics.totalEligibleSchemes >= 4, 'Eligible for at least 4 schemes');
    assert.ok(match.metrics.estimatedMaxCombinableAidInr >= 200000);
    assert.strictEqual(match.metrics.npciSeedingReady, true);

    const eligibleIds = match.eligibleSchemes.map(s => s.id);
    assert.ok(eligibleIds.includes('google-gen-scholarship'));
    assert.ok(eligibleIds.includes('amazon-future-engineer'));
    assert.ok(eligibleIds.includes('karnataka-ssp-postmatric'));
  });

  it('flags ineligible schemes with detailed causal reasons (e.g. income limit exceeded or gender restriction)', () => {
    const match = engine.matchScholarships({
      gender: 'Male',
      category: 'GM',
      annualIncomeLpa: 7.5,
      academicPercent: 65.0
    });

    assert.strictEqual(match.success, true);
    assert.ok(match.ineligibleSchemes.length > 0);

    const googleIneligible = match.ineligibleSchemes.find(s => s.id === 'google-gen-scholarship');
    assert.ok(googleIneligible);
    assert.ok(googleIneligible.reasons.some(r => r.includes('Female')));

    const sspIneligible = match.ineligibleSchemes.find(s => s.id === 'karnataka-ssp-postmatric');
    assert.ok(sspIneligible);
    assert.ok(sspIneligible.reasons.some(r => r.includes('income')));
  });
});
