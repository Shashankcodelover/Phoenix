const { describe, it } = require('node:test');
const assert = require('node:assert');

const { JudgeObjectionEngine, CLASSIC_JUDGE_OBJECTIONS } = require('../modules/hackathon-agent/judgeObjectionEngine');

describe('V24 Quality Focus: Feature 38 — Judge Q&A Objection & Counter-Defense Engine', () => {
  const engine = new JudgeObjectionEngine();

  it('generates winning counter-defense strategies across scalability, defensibility, and wrapper traps', () => {
    const report = engine.generateCounterDefense({ projectName: 'Phoenix Apex Ultra' });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.judgePersuasionIndex, '95/100 (Grand Prize Podium Caliber)');
    assert.strictEqual(report.totalObjectionScenarios, 3);
    assert.strictEqual(report.goldenRulesForQa.length, 3);

    const scalabilityObjection = report.objections.find(o => o.objectionKey === 'scalability');
    assert.ok(scalabilityObjection);
    assert.ok(scalabilityObjection.winningRebuttalScript.includes('Redis cluster shards'));
    assert.ok(scalabilityObjection.winningRebuttalScript.includes('P99 latency'));
  });
});
