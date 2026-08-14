const { describe, it } = require('node:test');
const assert = require('node:assert');

const { SportsQuotaEngine } = require('../modules/horizon/sportsQuotaEngine');

describe('V24 Quality Focus: Feature 57 — Sports & Cultural Special Quota Engine', () => {
  const engine = new SportsQuotaEngine();

  it('evaluates National Medalist athlete and awards Priority 2 with 85 merit score points', () => {
    const report = engine.evaluateQuota({
      categoryType: 'SPORTS',
      achievementLevel: 'NATIONAL_MEDALIST',
      sportsDiscipline: 'Athletics (100m Sprint)',
      certificateIssuedBy: 'Athletics Federation of India / SGFI'
    });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.achievementLevel, 'NATIONAL_MEDALIST');
    assert.ok(report.keaPriorityOrder.includes('Priority 2'));
    assert.strictEqual(report.meritScorePoints, '85 / 100 Points');
    assert.ok(report.seatAllotmentProbability.includes('Top 5 Bangalore'));
    assert.strictEqual(report.verificationChecklist.length, 3);
  });
});
