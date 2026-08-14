const { describe, it } = require('node:test');
const assert = require('node:assert');

const { KarnatakaReservationEngine } = require('../modules/horizon/karnatakaReservationEngine');

describe('V24 Quality Focus: Feature 41 — Karnataka Rural & Kannada Medium Reservation Engine', () => {
  const engine = new KarnatakaReservationEngine();

  it('calculates 2.2x rank cutoff advantage and produces BEO document checklist for Rural + Kannada Medium student', () => {
    const report = engine.evaluateQuotaEligibility({
      ruralStudyYears: 10,
      kannadaMediumYears: 10,
      article371jEligible: false,
      rawKcetRank: 4500
    });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.rawKcetRank, 4500);
    assert.ok(report.effectiveEquivalentRank < 2200);
    assert.ok(report.quotaBadges.some(b => b.includes('15% Rural Quota')));
    assert.ok(report.quotaBadges.some(b => b.includes('5% Kannada Medium Quota')));
    assert.ok(report.documentChecklist.some(d => d.includes('Block Education Officer (BEO)')));
  });
});
