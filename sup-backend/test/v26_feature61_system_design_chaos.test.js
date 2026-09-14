const { describe, it } = require('node:test');
const assert = require('node:assert');

const systemDesignChaosEngine = require('../modules/interview-prep/systemDesignChaosEngine');

describe('Project Phoenix v27.0: Autonomous Distributed System Design & Chaos Engineering Lab', () => {

  it('retrieves all premier FAANG distributed architecture archetypes', () => {
    const archetypes = systemDesignChaosEngine.getArchetypes();
    assert.strictEqual(Array.isArray(archetypes), true);
    assert.ok(archetypes.length >= 3);

    const uber = archetypes.find(a => a.id === 'uber_dispatch');
    assert.ok(uber);
    assert.ok(uber.name.includes('Uber'));
    assert.strictEqual(uber.slaTarget, '99.999%');
    assert.ok(uber.maxCapacityQps >= 100000);
    assert.ok(uber.totalNodes >= 5);
  });

  it('fetches specific archetype details and node topology netlists', () => {
    const gDrive = systemDesignChaosEngine.getArchetypeById('google_drive');
    assert.strictEqual(gDrive.id, 'google_drive');
    assert.ok(gDrive.nodes.length >= 5);

    const spannerNode = gDrive.nodes.find(n => n.id === 'spanner_meta');
    assert.ok(spannerNode);
    assert.strictEqual(spannerNode.type, 'DATABASE');
    assert.ok(spannerNode.capacityQps > 0);
  });

  it('simulates standard load under M/M/k queueing theory with optimal latency', () => {
    const sim = systemDesignChaosEngine.simulateLoad('uber_dispatch', 35000);
    assert.strictEqual(sim.success, true);
    assert.strictEqual(sim.requestedQps, 35000);
    assert.strictEqual(sim.availabilityPercent, 99.999);
    assert.ok(sim.latencies.p50Ms > 0);
    assert.ok(sim.latencies.p95Ms >= sim.latencies.p50Ms);
    assert.ok(sim.latencies.p99Ms >= sim.latencies.p95Ms);
    assert.strictEqual(sim.systemHealth, 'OPTIMAL_RESONANCE');
    assert.strictEqual(sim.nodeTelemetries.length, 6);
  });

  it('accurately identifies bottleneck node and latency degradation under heavy load', () => {
    // 75000 QPS will push Sharded PostgreSQL (capacity 65000 QPS) over 95% saturation
    const overloadSim = systemDesignChaosEngine.simulateLoad('uber_dispatch', 80000);
    assert.strictEqual(overloadSim.success, true);
    assert.ok(overloadSim.maxSaturationPercent >= 90);
    assert.ok(overloadSim.bottleneckNode.includes('PostgreSQL'));
    assert.strictEqual(overloadSim.systemHealth, 'DEGRADED_BOTTLENECK');
    assert.ok(overloadSim.latencies.p99Ms > 100);
  });

  it('clamps extreme QPS inputs between safe mathematical bounds [1000, 500000]', () => {
    const lowSim = systemDesignChaosEngine.simulateLoad('uber_dispatch', 50);
    assert.strictEqual(lowSim.requestedQps, 1000);

    const highSim = systemDesignChaosEngine.simulateLoad('uber_dispatch', 1000000);
    assert.strictEqual(highSim.requestedQps, 500000);
  });

  it('injects primary DB crash and demonstrates sub-2s Raft self-healing and zero data loss', () => {
    const chaos = systemDesignChaosEngine.injectChaos('uber_dispatch', 'primary_db_crash');
    assert.strictEqual(chaos.success, true);
    assert.strictEqual(chaos.faultType, 'primary_db_crash');
    assert.ok(chaos.faultName.includes('Primary Database Node Crash'));
    assert.ok(chaos.failoverLatencyMs < 2500);
    assert.ok(chaos.dataLossRpo.includes('0.00 seconds'));
    assert.strictEqual(chaos.recoveryStatus, 'SELF_HEALED_HEALTHY');
    assert.ok(chaos.cryptographicPassport.startsWith('0xPHOENIX-ARCH-'));
  });

  it('injects cache stampede and mitigates via probabilistic early expiration', () => {
    const chaos = systemDesignChaosEngine.injectChaos('uber_dispatch', 'cache_stampede');
    assert.strictEqual(chaos.success, true);
    assert.ok(chaos.selfHealingMechanism.includes('XFetch'));
    assert.ok(chaos.failoverLatencyMs < 1000);
    assert.strictEqual(chaos.recoveryStatus, 'SELF_HEALED_HEALTHY');
  });

  it('injects subsea fiber cut and enforces CAP AP eventual consistency', () => {
    const chaos = systemDesignChaosEngine.injectChaos('google_drive', 'network_partition');
    assert.strictEqual(chaos.success, true);
    assert.ok(chaos.selfHealingMechanism.includes('CRDT'));
    assert.ok(chaos.dataLossRpo.includes('Eventual Consistency'));
  });

  it('injects DDoS L7 flood attack and validates sliding token bucket filter', () => {
    const chaos = systemDesignChaosEngine.injectChaos('whatsapp_messenger', 'ddos_l7_flood');
    assert.strictEqual(chaos.success, true);
    assert.ok(chaos.selfHealingMechanism.includes('Token Bucket'));
    assert.strictEqual(chaos.recoveryStatus, 'SELF_HEALED_HEALTHY');
    assert.ok(chaos.cryptographicPassport.length >= 20);
  });
});
