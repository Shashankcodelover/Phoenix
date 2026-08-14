const { describe, it } = require('node:test');
const assert = require('node:assert');

const { CrisisPressureSimulatorEngine, CRISIS_SCENARIOS } = require('../modules/interview-prep/crisisPressureSimulatorEngine');

describe('V24 Quality Focus: Feature 27 — FAANG Bar-Raiser Behavioral Pressure & P0 Crisis Engine', () => {
  const engine = new CrisisPressureSimulatorEngine();

  it('evaluates P0 critical payment outage scenario across 4 triage phases', () => {
    const report = engine.simulateCrisisScenario({
      scenarioKey: 'PAYMENT_P0_OUTAGE',
      candidateActionPlan: 'Enable circuit breaker fast-fail and reroute read traffic to replicas.'
    });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.scenarioKey, 'PAYMENT_P0_OUTAGE');
    assert.ok(report.severity.includes('SEV-1'));
    assert.ok(report.composureIndex.includes('96/100'));
    assert.strictEqual(report.fourPhasePlaybook.length, 4);
    assert.ok(report.fourPhasePlaybook[0].phase.includes('Blast Radius Containment'));
    assert.ok(report.fourPhasePlaybook[3].phase.includes('Blameless Post-Mortem'));
    assert.strictEqual(report.barRaiserFeedback.length, 3);
  });
});
