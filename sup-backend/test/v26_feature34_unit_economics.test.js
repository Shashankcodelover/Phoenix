const { describe, it } = require('node:test');
const assert = require('node:assert');

const { UnitEconomicsEngine } = require('../modules/hackathon-agent/unitEconomicsEngine');

describe('V26 Feature 34: Unit Economics & Monetization Model Sandbox', () => {
  const engine = new UnitEconomicsEngine();

  it('retrieves financial presets for hybrid B2G, enterprise, and prosumer models', () => {
    const presets = engine.getPresets();
    assert.ok(presets.aegis, 'Aegis preset exists');
    assert.ok(presets.oncomatch, 'OncoMatch preset exists');
    assert.ok(presets.nexusaudio, 'NexusAudio preset exists');

    assert.strictEqual(presets.aegis.pricing.proPrice, 199);
    assert.strictEqual(presets.oncomatch.pricing.enterpriseAnnual, 75000);
    assert.strictEqual(presets.nexusaudio.pricing.proPrice, 29);
  });

  it('calculates mathematically coherent unit economics for Aegis Swarm', () => {
    const result = engine.calculateEconomics({
      projectTitle: 'Aegis Swarm',
      pricing: { proPrice: 199, enterpriseAnnual: 36000 },
      volume: { activeUsers: 2400, proConversionPct: 6.0, enterpriseClients: 12 },
      costs: { aiCostPerUser: 4.50, cloudInfraPerUser: 1.80, cac: 420, monthlyChurnPct: 1.5 }
    });

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.projectTitle, 'Aegis Swarm');
    assert.ok(result.summary.totalMrr.startsWith('$'));
    assert.ok(result.summary.projectedArr.startsWith('$'));

    // Verify gross margin is positive and between 50% and 98%
    const marginNum = parseFloat(result.summary.grossMargin);
    assert.ok(marginNum > 50 && marginNum < 98, `Gross margin ${marginNum}% should be healthy SaaS margin`);

    // Verify LTV/CAC ratio is greater than 2.0x
    const ltvCacNum = parseFloat(result.summary.ltvCacRatio);
    assert.ok(ltvCacNum > 2.0, `LTV/CAC ratio ${ltvCacNum}x should be venture viable`);

    // Verify 12-month projections exist
    assert.strictEqual(result.projections12Month.length, 12);
    assert.strictEqual(result.projections12Month[0].month, 'Month 1');
    assert.strictEqual(result.projections12Month[11].month, 'Month 12');
  });

  it('scales projections appropriately when pricing or churn is adjusted', () => {
    const conservative = engine.calculateEconomics({
      volume: { activeUsers: 1000, proConversionPct: 3.0, enterpriseClients: 2 },
      pricing: { proPrice: 20, enterpriseAnnual: 10000 },
      costs: { aiCostPerUser: 1.0, cloudInfraPerUser: 0.5, cac: 100, monthlyChurnPct: 8.0 }
    });

    const aggressive = engine.calculateEconomics({
      volume: { activeUsers: 5000, proConversionPct: 8.0, enterpriseClients: 10 },
      pricing: { proPrice: 50, enterpriseAnnual: 30000 },
      costs: { aiCostPerUser: 1.0, cloudInfraPerUser: 0.5, cac: 100, monthlyChurnPct: 2.0 }
    });

    const consMrr = parseInt(conservative.summary.totalMrr.replace(/[$,]/g, ''), 10);
    const aggrMrr = parseInt(aggressive.summary.totalMrr.replace(/[$,]/g, ''), 10);
    assert.ok(aggrMrr > consMrr * 3, `Aggressive MRR (${aggrMrr}) should substantially outpace conservative MRR (${consMrr})`);
  });
});
