const { describe, it } = require('node:test');
const assert = require('node:assert');

const { DemoDisasterRecoveryHub } = require('../modules/hackathon-agent/demoDisasterRecoveryHub');

describe('V26 Feature 36: Real-Time Chaos & Network Failure Fallback Engine', () => {
  const engine = new DemoDisasterRecoveryHub();

  it('retrieves chaos presets for wifi blackouts, rate limits, and database crashes', () => {
    const presets = engine.getPresets();
    assert.ok(presets.baseline, 'Baseline preset exists');
    assert.ok(presets.wifi_blackout, 'Wi-Fi blackout preset exists');
    assert.ok(presets.api_429_limit, 'API 429 limit preset exists');
    assert.ok(presets.db_crash, 'Database crash preset exists');

    assert.strictEqual(presets.wifi_blackout.circuitState, 'OPEN');
    assert.strictEqual(presets.db_crash.circuitState, 'HALF_OPEN');
  });

  it('simulates 100% offline venue blackout and verifies circuit breaker trip to OPEN state', () => {
    const sim = engine.simulateChaos({
      chaosType: 'OFFLINE_VENUE_WIFI',
      trafficRps: 200,
      durationSec: 10
    });

    assert.strictEqual(sim.success, true);
    assert.strictEqual(sim.circuitState, 'OPEN');
    assert.strictEqual(sim.recoveredRequests, 2000);
    assert.strictEqual(sim.failedRequests, 0);
    assert.strictEqual(sim.successRate, '100.0%');
    assert.ok(sim.activeFallbackEngine.includes('In-Memory'));
    assert.ok(sim.failoverEvents.length >= 3);
    assert.ok(sim.spokenPitchPivot.includes('Judges'));
  });

  it('simulates LLM 429 quota exhaustion and switches to procedural heuristics', () => {
    const sim = engine.simulateChaos({
      chaosType: 'API_429_RATE_LIMIT',
      trafficRps: 150,
      durationSec: 5
    });

    assert.strictEqual(sim.success, true);
    assert.strictEqual(sim.circuitState, 'OPEN');
    assert.ok(sim.activeFallbackEngine.includes('Procedural Deterministic'));
    assert.ok(sim.latencyMetrics.p50Ms.includes('ms'));
  });
});
