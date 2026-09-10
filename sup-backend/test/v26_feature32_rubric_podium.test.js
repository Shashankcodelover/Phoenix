const { describe, it } = require('node:test');
const assert = require('node:assert');

const { JudgeRubricPodiumEngine } = require('../modules/hackathon-agent/judgeRubricPodiumEngine');

describe('V26 Feature 32: Live Judge Rubric Scorer & Podium Predictor', () => {
  const engine = new JudgeRubricPodiumEngine();

  it('retrieves preset benchmarks with complete score profiles', () => {
    const presets = engine.getPresets();
    assert.ok(presets.aegis, 'Aegis preset must exist');
    assert.ok(presets.oncomatch, 'OncoMatch preset must exist');
    assert.ok(presets.nexusaudio, 'NexusAudio preset must exist');

    assert.strictEqual(presets.aegis.projectTitle, 'Aegis Swarm');
    assert.strictEqual(presets.aegis.scores.innovation, 25);
  });

  it('evaluates rubric composite score and produces Markov Monte-Carlo podium odds', () => {
    const result = engine.evaluateRubricAndPredictPodium({
      projectTitle: 'Aegis Swarm',
      cohortSize: 120,
      scores: {
        innovation: 25,
        technicalDepth: 25,
        impact: 20,
        design: 14,
        pitch: 14
      }
    });

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.numericScore, 98);
    assert.strictEqual(result.compositeScore, '98/100');
    assert.strictEqual(result.statusRating, 'Grand Prize Front-Runner');
    assert.ok(result.rubricBreakdown.length === 5);

    // Verify podium probability metrics exist and parse as numbers
    const podium = result.podiumProjections;
    assert.ok(podium.firstPlaceGrandPrize);
    assert.ok(podium.overallPodiumProbability);
    const firstPlaceNum = parseFloat(podium.firstPlaceGrandPrize);
    assert.ok(firstPlaceNum > 35, `Expected 1st place prob > 35% for score 98, got ${firstPlaceNum}%`);
    const overallNum = parseFloat(podium.overallPodiumProbability);
    assert.ok(overallNum > 85, `Expected overall podium prob > 85% for score 98, got ${overallNum}%`);

    // Verify jury feedback and remediation
    assert.strictEqual(result.juryDeliberations.length, 3);
    assert.ok(Array.isArray(result.remediationActions));
  });

  it('correctly calculates lower tier podium odds for median project', () => {
    const result = engine.evaluateRubricAndPredictPodium({
      projectTitle: 'Standard Project',
      cohortSize: 100,
      scores: {
        innovation: 15,
        technicalDepth: 15,
        impact: 12,
        design: 10,
        pitch: 10
      }
    });

    assert.strictEqual(result.numericScore, 62);
    const firstPlaceNum = parseFloat(result.podiumProjections.firstPlaceGrandPrize);
    assert.ok(firstPlaceNum < 15, `Expected 1st place prob < 15% for score 62, got ${firstPlaceNum}%`);
    assert.strictEqual(result.statusRating, 'Finalist Candidate');
    assert.ok(result.remediationActions.length > 0);
  });
});
