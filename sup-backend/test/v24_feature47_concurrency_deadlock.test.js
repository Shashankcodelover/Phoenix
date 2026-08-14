const { describe, it } = require('node:test');
const assert = require('node:assert');

const { ConcurrencyDeadlockEngine } = require('../modules/interview-prep/concurrencyDeadlockEngine');

describe('V24 Quality Focus: Feature 47 — Concurrency & Multi-Threading Deadlock Radar Engine', () => {
  const engine = new ConcurrencyDeadlockEngine();

  it('evaluates Coffman conditions and confirms deadlock safety when circular wait is broken', () => {
    const report = engine.analyzeDeadlock({
      concurrencyPattern: 'Bank Transfer Double-Mutex Lock (min ID -> max ID)',
      threadCount: 8
    });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.isDeadlockFree, true);
    assert.strictEqual(report.deadlockSafetyScore, '96/100 (Deadlock-Proof)');
    assert.strictEqual(report.coffmanAudit.circularWait.satisfied, false);
    assert.ok(report.remediationGuarantees.some(r => r.includes('lexicographical lock acquisition')));
  });
});
