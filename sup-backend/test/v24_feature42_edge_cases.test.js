const { describe, it } = require('node:test');
const assert = require('node:assert');

const { EdgeCaseExplorerEngine } = require('../modules/interview-prep/edgeCaseExplorerEngine');

describe('V24 Quality Focus: Feature 42 — LeetCode Edge Case Generator Engine', () => {
  const engine = new EdgeCaseExplorerEngine();

  it('synthesizes boundary, integer overflow, duplicate, and negative value edge cases', () => {
    const report = engine.generateEdgeCases({
      problemName: 'Two Sum Target Pair',
      inputDataType: 'number[]',
      constraints: '1 <= nums.length <= 10^5'
    });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.totalEdgeCasesSynthesized, 4);
    assert.strictEqual(report.problemName, 'Two Sum Target Pair');
    assert.ok(report.recommendedCodeGuard.includes('nums.length < 2'));

    const boundaryCase = report.edgeCaseSuites.find(s => s.category.includes('Extreme Boundary'));
    assert.ok(boundaryCase);
    assert.ok(boundaryCase.vulnerabilityDetected.includes('Off-by-one'));
  });
});
