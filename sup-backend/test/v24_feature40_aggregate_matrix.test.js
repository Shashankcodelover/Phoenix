const { describe, it } = require('node:test');
const assert = require('node:assert');

const { AggregateMatrixEngine } = require('../modules/interview-prep/aggregateMatrixEngine');

describe('V24 Quality Focus: Feature 40 — Multi-Round Aggregate Performance Matrix Engine', () => {
  const engine = new AggregateMatrixEngine();

  it('aggregates multi-round mock interview scores and awards STRONG HIRE recommendation', () => {
    const report = engine.calculateAggregateMatrix({
      candidateName: 'Shashank J',
      roundScores: {
        dsaRound: 92,
        systemDesignRound: 86,
        lldMachineCodingRound: 89,
        behavioralBarRaiserRound: 85
      }
    });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.compositeReadinessPercentage, '88.0%');
    assert.strictEqual(report.recommendation, 'STRONG HIRE (L5 / L6 Contender)');
    assert.strictEqual(report.heatmap.length, 4);

    const dsaHeatmap = report.heatmap.find(h => h.dimension.includes('Data Structures'));
    assert.ok(dsaHeatmap);
    assert.strictEqual(dsaHeatmap.score, 92);
  });
});
