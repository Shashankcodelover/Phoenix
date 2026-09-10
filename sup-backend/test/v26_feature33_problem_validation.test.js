const { describe, it } = require('node:test');
const assert = require('node:assert');

const { ProblemValidationEngine } = require('../modules/hackathon-agent/problemValidationEngine');

describe('V26 Feature 33: Problem Validation & User Interview Generator', () => {
  const engine = new ProblemValidationEngine();

  it('retrieves comprehensive customer validation presets with 5 personas each', () => {
    const presets = engine.getPresets();
    assert.ok(presets.aegis, 'Aegis preset exists');
    assert.ok(presets.oncomatch, 'OncoMatch preset exists');
    assert.ok(presets.nexusaudio, 'NexusAudio preset exists');

    assert.strictEqual(presets.aegis.personas.length, 5);
    assert.strictEqual(presets.oncomatch.personas.length, 5);
    assert.strictEqual(presets.nexusaudio.personas.length, 5);
  });

  it('generates institutional customer validation report for Aegis Swarm', () => {
    const report = engine.generateValidationReport({
      projectTitle: 'Aegis Swarm',
      domain: 'Disaster Logistics'
    });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.projectTitle, 'Aegis Swarm');
    assert.strictEqual(report.personas.length, 5);
    assert.ok(report.surveyMetrics.problemIncidenceRate.includes('%'));
    assert.ok(report.surveyMetrics.willingnessToPay.includes('%'));
    assert.ok(report.investorTakeaway.includes('bottleneck'));
    assert.ok(report.validationScore.includes('94/100'));

    // Check individual persona structure
    const p1 = report.personas[0];
    assert.ok(p1.name);
    assert.ok(p1.role);
    assert.ok(p1.quote.length > 30);
    assert.ok(p1.willingnessToPay);
  });

  it('generates procedural fallback validation report for novel custom domain', () => {
    const report = engine.generateValidationReport({
      projectTitle: 'AgriDrone Autonomous Soil Nitrogen Profiler',
      domain: 'Precision Agriculture',
      targetAudience: 'Agronomists and Commercial Corn Farmers',
      sampleSize: 90
    });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.projectTitle, 'AgriDrone Autonomous Soil Nitrogen Profiler');
    assert.strictEqual(report.domain, 'Precision Agriculture');
    assert.strictEqual(report.personas.length, 5);
    assert.strictEqual(report.sampleSize, 90);
    assert.ok(report.investorTakeaway.includes('Precision Agriculture'));
  });
});
