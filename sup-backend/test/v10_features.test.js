const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

const { evaluateBehavioralPressure, SCENARIOS } = require('../modules/interview-prep/behavioralPressureEngine');
const { evaluateLatencyCircuitBreaker } = require('../modules/interview-prep/latencyCircuitBreakerEngine');

describe('Behavioral Outage Crisis & Pressure Engine Tests', () => {
  test('evaluateBehavioralPressure handles exemplar calm crisis response', () => {
    const input = {
      candidateAnswer: 'In a production database outage, I first isolate the affected node and triage metrics on Datadog. Then I execute a safe rollback to the previous migration, update the status page for stakeholders, and set up fallback rate limiting. Later, we run a root cause postmortem.',
      crisisScenario: 'PROD_OUTAGE',
      reactionTimeSeconds: 12
    };
    const res = evaluateBehavioralPressure(input);
    assert.equal(res.success, true);
    assert.equal(res.scenarioTitle, SCENARIOS.PROD_OUTAGE.title);
    assert.ok(res.pressureIndex >= 85);
    assert.equal(res.crisisRating, 'EXEMPLARY');
    assert.ok(res.keyStrengths.length >= 3);
    assert.equal(res.panicFlagsDetected.length, 0);
  });

  test('evaluateBehavioralPressure detects panic and penalizes panic indicators', () => {
    const input = {
      candidateAnswer: 'I panicked and freaked out, it was not my fault, I blame the DevOps team because everything was screwed.',
      crisisScenario: 'PROD_OUTAGE',
      reactionTimeSeconds: 45
    };
    const res = evaluateBehavioralPressure(input);
    assert.equal(res.success, true);
    assert.ok(res.pressureIndex < 55);
    assert.equal(res.crisisRating, 'VULNERABLE');
    assert.ok(res.panicFlagsDetected.length >= 1);
  });

  test('evaluateBehavioralPressure handles empty response gracefully', () => {
    const res = evaluateBehavioralPressure({});
    assert.equal(res.success, true);
    assert.equal(res.pressureIndex, 0);
    assert.equal(res.crisisRating, 'VULNERABLE');
  });
});

describe('Latency Budget & Circuit Breaker Architecture Evaluator Tests', () => {
  test('evaluateLatencyCircuitBreaker evaluates healthy topology', () => {
    const topology = [
      { name: 'Gateway', p50: 10, p95: 25, p99: 50, hasCircuitBreaker: true, hasCache: true, hasReplica: true },
      { name: 'User Service', p50: 20, p95: 40, p99: 80, hasCircuitBreaker: true, hasCache: true, hasReplica: true },
      { name: 'Database', p50: 30, p95: 70, p99: 120, hasCircuitBreaker: true, hasCache: true, hasReplica: true }
    ];
    const res = evaluateLatencyCircuitBreaker({ architectureTopology: topology, SLAThresholdMs: 250 });
    assert.equal(res.success, true);
    assert.equal(res.totalNodesEvaluated, 3);
    assert.equal(res.latencyMetrics.totalP95Ms, 135);
    assert.equal(res.circuitBreakerHealth, 'OPTIMAL');
    assert.equal(res.spofVulnerabilities.length, 0);
    assert.ok(res.stabilityScore >= 80);
  });

  test('evaluateLatencyCircuitBreaker detects SPOFs and SLA violations', () => {
    const topology = [
      { name: 'Gateway', p50: 50, p95: 150, p99: 300, hasCircuitBreaker: false, hasCache: false, hasReplica: false },
      { name: 'Legacy API', p50: 80, p95: 200, p99: 450, hasCircuitBreaker: false, hasCache: false, hasReplica: false }
    ];
    const res = evaluateLatencyCircuitBreaker({ architectureTopology: topology, SLAThresholdMs: 200 });
    assert.equal(res.success, true);
    assert.ok(res.spofVulnerabilities.length >= 2);
    assert.equal(res.circuitBreakerHealth, 'CRITICAL');
    assert.ok(res.slaViolationRiskPercentage > 50);
    assert.ok(res.resilienceRecommendations.length >= 2);
  });
});
