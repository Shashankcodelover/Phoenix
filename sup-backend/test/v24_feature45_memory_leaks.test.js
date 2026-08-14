const { describe, it } = require('node:test');
const assert = require('node:assert');

const { CodeMemoryLeakEngine } = require('../modules/interview-prep/codeMemoryLeakEngine');

describe('V24 Quality Focus: Feature 45 — AST Code Flaw & Memory Leak Visualizer Engine', () => {
  const engine = new CodeMemoryLeakEngine();

  it('detects unbounded closure memory retention and provides GC heap allocation estimates', () => {
    const report = engine.analyzeMemoryLeaks({
      codeSnippet: 'function createLogger() { const logs = []; return (req) => { logs.push(req); }; }',
      language: 'JavaScript'
    });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.totalFlawsDetected, 1);
    assert.strictEqual(report.heapAllocationEstimate.peakMemoryMb, '32.4 MB');
    assert.ok(report.detectedFlaws[0].flawType.includes('Unbounded Closure'));
    assert.strictEqual(report.detectedFlaws[0].severity, 'HIGH');
    assert.ok(report.detectedFlaws[0].suggestedFix.includes('RingBuffer'));
  });
});
