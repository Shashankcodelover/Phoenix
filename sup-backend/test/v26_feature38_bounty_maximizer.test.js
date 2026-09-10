const { describe, it } = require('node:test');
const assert = require('node:assert');

const { SponsorBountyMaximizerEngine, SPONSOR_CATALOG } = require('../modules/hackathon-agent/sponsorBountyMaximizerEngine');

describe('V26 Feature 38: Sponsor Bounty Value Maximizer & Multi-Track Solver', () => {
  const engine = new SponsorBountyMaximizerEngine();

  it('retrieves full catalog of sponsor tracks and prizes', () => {
    const catalog = engine.getCatalog();
    assert.ok(Array.isArray(catalog), 'Catalog is an array');
    assert.ok(catalog.length >= 8, 'At least 8 sponsor bounties');

    const sponsors = catalog.map(c => c.sponsor);
    assert.ok(sponsors.includes('Google Cloud'));
    assert.ok(sponsors.includes('Supabase'));
    assert.ok(sponsors.includes('Twilio'));
    assert.ok(sponsors.includes('Stripe'));
    assert.ok(sponsors.includes('ElevenLabs'));
  });

  it('retrieves multi-track presets with calculated bounty yields', () => {
    const presets = engine.getPresets();
    assert.ok(Array.isArray(presets), 'Presets is an array');
    assert.ok(presets.length >= 3, 'At least 3 presets');

    const fullstack = presets.find(p => p.id === 'ai-agent-fullstack');
    assert.ok(fullstack);
    assert.strictEqual(fullstack.sponsorsCount, 4);
    assert.strictEqual(fullstack.totalBountyYieldUsd, 24000);
    assert.strictEqual(fullstack.totalIntegrationHours, 8.0);
  });

  it('solves knapsack multi-track optimization under time constraint (e.g. 6.0 hours)', () => {
    const solution = engine.solveMaxBounties({
      maxEffortHours: 6.0
    });

    assert.strictEqual(solution.success, true);
    assert.ok(solution.solutionId.startsWith('BOUNTY-SOLVE-'));
    assert.ok(solution.totalIntegrationHours <= 6.0);
    assert.ok(solution.totalBountyYieldUsd >= 15000);
    assert.ok(solution.selectedBounties.length >= 2);
    assert.ok(solution.boothPitchPlan.length === solution.selectedBounties.length);
    assert.ok(solution.masterIntegrationCode.includes('Google Cloud') || solution.masterIntegrationCode.includes('import'));
  });

  it('generates 120-second booth defense pitch plan per selected sponsor', () => {
    const solution = engine.solveMaxBounties({
      sponsorIds: ['google-gemini', 'supabase-vector', 'twilio-comm']
    });

    assert.strictEqual(solution.success, true);
    assert.strictEqual(solution.totalSelectedBounties, 3);
    assert.strictEqual(solution.totalBountyYieldUsd, 19000);
    assert.strictEqual(solution.boothPitchPlan.length, 3);
    assert.strictEqual(solution.boothPitchPlan[0].allocatedSeconds, 40);
    assert.ok(solution.boothPitchPlan[0].primaryChecklistRule);
  });
});
