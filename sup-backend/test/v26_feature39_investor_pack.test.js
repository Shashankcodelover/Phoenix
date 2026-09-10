const { describe, it } = require('node:test');
const assert = require('node:assert');

const { InvestorOutreachEngine, PRESETS } = require('../modules/hackathon-agent/investorOutreachEngine');

describe('V26 Feature 39: Post-Hackathon Investor Outreach & Seed Pitch Pack', () => {
  const engine = new InvestorOutreachEngine();

  it('retrieves investor pitch pack presets', () => {
    const presets = engine.getPresets();
    assert.ok(Array.isArray(presets));
    assert.ok(presets.length >= 3);

    const ids = presets.map(p => p.id);
    assert.ok(ids.includes('ai-developer-os'));
    assert.ok(ids.includes('edge-iot-robotics'));
    assert.ok(ids.includes('fintech-zk-privacy'));
  });

  it('generates institutional one-pager, 10-slide deck outline, and SAFE terms', () => {
    const preset = PRESETS['ai-developer-os'];
    const pack = engine.generatePitchPack(preset);

    assert.strictEqual(pack.success, true);
    assert.ok(pack.packId.startsWith('SEED-PACK-'));
    assert.ok(pack.onePagerMarkdown.includes('# Executive Summary: Phoenix OS'));
    assert.ok(pack.onePagerMarkdown.includes('TAM'));
    assert.strictEqual(pack.tenSlideDeck.length, 10);
    assert.strictEqual(pack.tenSlideDeck[0].title, 'Vision & Hook');
    assert.strictEqual(pack.tenSlideDeck[9].title, 'The Ask');

    // SAFE terms
    assert.strictEqual(pack.safeTermSheet.instrument, 'Y Combinator Post-Money Valuation Cap SAFE');
    assert.strictEqual(pack.safeTermSheet.investmentAmountUsd, 1200000);
    assert.strictEqual(pack.safeTermSheet.valuationCapUsd, 10000000);
    assert.strictEqual(pack.safeTermSheet.effectiveOwnershipPercentage, 12);
  });

  it('generates 3 tailored cold outbound investor emails', () => {
    const preset = PRESETS['fintech-zk-privacy'];
    const pack = engine.generatePitchPack(preset);

    assert.ok(pack.emailTemplates.fomoWinner.subject.includes('Fresh Hackathon Grand Winner'));
    assert.ok(pack.emailTemplates.fomoWinner.body.includes('VeriPay ZK'));
    assert.ok(pack.emailTemplates.deepTechMoat.subject.includes('moat'));
    assert.ok(pack.emailTemplates.forwardableBlurb.body.includes('forwardable blurb'));
  });
});
