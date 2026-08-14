const { describe, it } = require('node:test');
const assert = require('node:assert');

const { Article371JEngine, KALYANA_KARNATAKA_DISTRICTS } = require('../modules/horizon/article371JEngine');

describe('V24 Quality Focus: Feature 54 — Article 371(J) Kalyana-Karnataka Quota Engine', () => {
  const engine = new Article371JEngine();

  it('evaluates Kalaburagi candidate with Form-E and applies 3.8x rank multiplier advantage', () => {
    const report = engine.evaluateEligibility({
      candidateDistrict: 'Kalaburagi (Gulbarga)',
      candidateRank: 15200,
      hasFormECertificate: true
    });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.isArticle371JEligible, true);
    assert.ok(report.seatReservationQuotas.statewideTier1Colleges.includes('8% Exclusive'));
    assert.ok(report.seatReservationQuotas.regionalLocalColleges.includes('70% Local'));
    assert.strictEqual(report.effectiveCompetitiveRank, 4000);
    assert.ok(report.rankMultiplierAdvantage.includes('3.8x'));
  });

  it('correctly flags ineligibility when candidate belongs to non-HK district (e.g. Mysore)', () => {
    const report = engine.evaluateEligibility({
      candidateDistrict: 'Mysore',
      candidateRank: 5000,
      hasFormECertificate: false
    });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.isArticle371JEligible, false);
    assert.strictEqual(report.effectiveCompetitiveRank, 5000);
  });
});
