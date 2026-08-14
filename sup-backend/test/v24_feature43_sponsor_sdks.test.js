const { describe, it } = require('node:test');
const assert = require('node:assert');

const { SponsorSdkQuickstartEngine, SDK_BOILERPLATES } = require('../modules/hackathon-agent/sponsorSdkQuickstartEngine');

describe('V24 Quality Focus: Feature 43 — Hackathon Sponsor SDK Quickstart Engine', () => {
  const engine = new SponsorSdkQuickstartEngine();

  it('generates Gemini 2.5 SDK quickstart with @google/genai syntax and $5k bounty compliance', () => {
    const report = engine.generateQuickstart({ sdkKey: 'gemini' });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.sdkKey, 'gemini');
    assert.ok(report.bountyTrack.includes('$5,000'));
    assert.ok(report.installCommand.includes('@google/genai'));
    assert.ok(report.codeSnippet.includes('gemini-2.5-flash'));
    assert.ok(report.judgeComplianceChecklist.length >= 3);
  });

  it('generates Redis distributed cache quickstart with ioredis', () => {
    const report = engine.generateQuickstart({ sdkKey: 'redis' });

    assert.strictEqual(report.success, true);
    assert.ok(report.bountyTrack.includes('$3,000'));
    assert.ok(report.codeSnippet.includes('ioredis'));
  });
});
