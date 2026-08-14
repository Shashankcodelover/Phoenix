const { describe, it } = require('node:test');
const assert = require('node:assert');

const { BehavioralConflictEngine, CONFLICT_SCENARIOS } = require('../modules/interview-prep/behavioralConflictEngine');

describe('V24 Quality Focus: Feature 50 — FAANG Behavioral Conflict Mediation Engine', () => {
  const engine = new BehavioralConflictEngine();

  it('resolves Security P0 vs Deadline conflict using Amazon LP 14 Disagree and Commit framework', () => {
    const report = engine.resolveConflict({ scenarioKey: 'security_vs_deadline' });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.scenarioKey, 'security_vs_deadline');
    assert.ok(report.leadershipPillars.amazonLp.includes('Customer Obsession'));
    assert.ok(report.leadershipPillars.amazonLp.includes('Disagree & Commit'));
    assert.ok(report.resolutionBlueprint.includes('Feature Flags'));
    assert.ok(report.executiveStarScript.includes('data-backed risk matrix'));
    assert.strictEqual(report.interviewerGradingChecklist.length, 4);
  });
});
