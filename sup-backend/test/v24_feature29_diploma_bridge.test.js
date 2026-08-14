const { describe, it } = require('node:test');
const assert = require('node:assert');

const { DiplomaMathBridgeEngine, FOURTEEN_DAY_CURRICULUM } = require('../modules/horizon/diplomaMathBridgeEngine');

describe('V24 Quality Focus: Feature 29 — Polytechnic Diploma Lateral Entry Math Bridge Engine', () => {
  const engine = new DiplomaMathBridgeEngine();

  it('retrieves the complete 14-day remedial mathematics curriculum for VTU 3rd Sem transition', () => {
    const curriculum = engine.getBridgeCurriculum();

    assert.strictEqual(curriculum.success, true);
    assert.strictEqual(curriculum.totalDays, 14);
    assert.strictEqual(curriculum.totalHours, 42);
    assert.strictEqual(curriculum.curriculum.length, 5);

    const laplaceModule = curriculum.curriculum.find(c => c.topic.includes('Laplace'));
    assert.ok(laplaceModule);
    assert.strictEqual(laplaceModule.day, 7);
  });

  it('evaluates student completion diagnostic and produces low dropout risk assessment', () => {
    const diagnostic = engine.evaluateBridgeDiagnostic({ candidateBranch: 'CSE Lateral Entry', completedDays: 14 });

    assert.strictEqual(diagnostic.success, true);
    assert.strictEqual(diagnostic.bridgeReadinessIndex, '92/100 (Lateral Entry Engineering Ready)');
    assert.ok(diagnostic.academicRiskGrade.includes('Low Risk'));
    assert.strictEqual(diagnostic.recommendedNextSteps.length, 2);
  });
});
