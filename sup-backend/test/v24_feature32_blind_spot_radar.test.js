const { describe, it } = require('node:test');
const assert = require('node:assert');

const { BlindSpotRadarEngine, ALGORITHM_PATTERNS } = require('../modules/interview-prep/blindSpotRadarEngine');

describe('V24 Quality Focus: Feature 32 — Algorithm Blind-Spot Radar Engine', () => {
  const engine = new BlindSpotRadarEngine();

  it('evaluates candidate algorithm patterns and flags critical blind spots with remediation questions', () => {
    const report = engine.analyzeBlindSpotRadar({ targetCompany: 'Google Staff Bar-Raiser' });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.totalPatternsTracked, 10);
    assert.strictEqual(report.criticalBlindSpotsCount, 2);
    assert.strictEqual(report.remediationChecklist.length, 2);

    const bitmaskProblem = report.remediationChecklist.find(r => r.pattern.includes('Bitmask'));
    assert.ok(bitmaskProblem);
    assert.ok(bitmaskProblem.recommendedProblem.includes('LeetCode 847'));
    assert.ok(bitmaskProblem.keyIntuition.includes('bitmask integers'));
  });
});
