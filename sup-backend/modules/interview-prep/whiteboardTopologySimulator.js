/**
 * Phoenix v23.0: Live System Design Whiteboard Topology & SPOF Resilience Simulator
 */

class WhiteboardTopologySimulator {
  /**
   * Simulates traffic spikes and failure injection on a system architecture graph.
   * 
   * @param {Object} topology - { nodes: [...], edges: [...] }
   * @param {Object} simulationOptions - { rpsTraffic: 50000, injectFailureNode: 'primary_db' }
   */
  simulateResilience(topology = {}, simulationOptions = {}) {
    const nodes = topology.nodes || [
      { id: 'client', type: 'Client' },
      { id: 'lb', type: 'LoadBalancer' },
      { id: 'app_1', type: 'AppServer' },
      { id: 'cache', type: 'RedisCache' },
      { id: 'primary_db', type: 'PostgreSQLPrimary' },
      { id: 'replica_db', type: 'PostgreSQLReplica' }
    ];

    const { rpsTraffic = 25000, injectFailureNode = null } = simulationOptions;

    // Detect Single Points of Failure (SPOFs)
    const hasLB = nodes.some(n => n.type === 'LoadBalancer');
    const appServerCount = nodes.filter(n => n.type === 'AppServer').length;
    const hasCache = nodes.some(n => n.type.includes('Cache'));
    const hasDBReplica = nodes.filter(n => n.type.includes('DB') || n.type.includes('SQL') || n.type.includes('Mongo')).length > 1;

    const spofs = [];
    if (!hasLB) spofs.push('Missing Load Balancer: Direct traffic to single app server.');
    if (appServerCount < 2) spofs.push('Single App Server: No horizontal failover capacity.');
    if (!hasCache) spofs.push('Missing Cache Layer: Database will bottleneck under read spikes.');
    if (!hasDBReplica) spofs.push('Single Database Node: Data loss risk if primary crashes.');

    // Compute SLA & Latency under load
    let baseLatencyMs = hasCache ? 25 : 85;
    if (rpsTraffic > 20000) baseLatencyMs += Math.round((rpsTraffic / 20000) * 15);
    if (!hasCache) baseLatencyMs += 120;

    let systemAvailabilityPercent = 99.99;
    if (spofs.length > 0) systemAvailabilityPercent -= (spofs.length * 0.9);

    let failureImpact = 'System is healthy and fully redundant.';
    if (injectFailureNode) {
      const isFailedNodeRedundant = injectFailureNode === 'primary_db' ? hasDBReplica : (injectFailureNode === 'app_1' ? appServerCount > 1 : false);
      if (isFailedNodeRedundant) {
        failureImpact = `Injected crash on "${injectFailureNode}": Auto-failover triggered. Zero dropped requests, latency increased by 12ms.`;
      } else {
        failureImpact = `CRITICAL OUTAGE: "${injectFailureNode}" crashed and has no redundancy. 100% of user requests failing (HTTP 502/504).`;
        systemAvailabilityPercent = 0;
      }
    }

    return {
      totalNodes: nodes.length,
      evaluatedRPS: rpsTraffic,
      simulatedLatencyMs: baseLatencyMs,
      availabilitySLA: `${systemAvailabilityPercent.toFixed(2)}%`,
      spofsDetected: spofs,
      resilienceRating: spofs.length === 0 ? 'Tier-1 FAANG Architecture (High Resilience)' : spofs.length <= 2 ? 'Moderate Resilience (Action Required)' : 'High Vulnerability (Immediate Redundancy Needed)',
      failureSimulationReport: failureImpact
    };
  }
}

const whiteboardTopologySimulator = new WhiteboardTopologySimulator();
module.exports = { WhiteboardTopologySimulator, whiteboardTopologySimulator };
