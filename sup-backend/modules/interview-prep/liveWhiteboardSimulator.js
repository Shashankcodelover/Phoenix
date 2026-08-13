/**
 * Phoenix Apex Ultra: Feature 3 — Live System Design Interactive Whiteboard & Chaos Failure Simulator
 * 
 * Simulates real-time global traffic surges (up to 250,000 RPS), detects Single Points of Failure (SPOFs),
 * and executes Chaos Engineering node crashes with live p50/p95/p99 latency and availability SLA tracking.
 */

const ARCHITECTURE_TEMPLATES = {
  video_cdn: {
    id: 'video_cdn',
    name: 'Global Video Streaming CDN & Transcoder',
    description: 'High-throughput low-latency media distribution across edge points of presence.',
    nodes: [
      { id: 'edge_cdn', type: 'EdgeCDN', label: 'Cloudflare / CloudFront CDN', redundancy: 12 },
      { id: 'lb', type: 'LoadBalancer', label: 'Layer 7 Anycast Load Balancer', redundancy: 4 },
      { id: 'auth_app', type: 'AppServer', label: 'User & License Auth Microservice', redundancy: 6 },
      { id: 'transcoder_worker', type: 'WorkerPool', label: 'H.264 / AV1 Video Transcoding Cluster', redundancy: 16 },
      { id: 'metadata_cache', type: 'RedisCache', label: 'Distributed Redis Sharded Cluster', redundancy: 3 },
      { id: 'primary_db', type: 'DistributedDB', label: 'CockroachDB Multi-Region Distributed SQL', redundancy: 3 }
    ]
  },
  fintech_exchange: {
    id: 'fintech_exchange',
    name: 'Real-Time High-Frequency Order Matcher (Fintech)',
    description: 'Ultra-low-latency in-memory matching engine with durable event sourcing.',
    nodes: [
      { id: 'gateway_lb', type: 'LoadBalancer', label: 'Fix Gateway / Anycast LB', redundancy: 4 },
      { id: 'order_engine', type: 'AppServer', label: 'In-Memory Ring Buffer Matching Engine', redundancy: 3 },
      { id: 'kafka_journal', type: 'KafkaBroker', label: 'Kafka Distributed Append-Only Event Log', redundancy: 5 },
      { id: 'state_cache', type: 'RedisCache', label: 'Redis Snapshot Cache', redundancy: 3 },
      { id: 'settlement_db', type: 'PostgreSQLPrimary', label: 'PostgreSQL Ledger (ACID Compliant)', redundancy: 2 }
    ]
  }
};

class LiveWhiteboardSimulator {
  /**
   * Returns all pre-configured system design topology templates.
   */
  getTemplates() {
    return Object.values(ARCHITECTURE_TEMPLATES);
  }

  /**
   * Runs high-concurrency traffic and Chaos Engineering node failure simulation.
   * 
   * @param {Object} payload - {
   *   templateId: string,
   *   customNodes: Array,
   *   rpsTraffic: number, // e.g. 50000 to 250000
   *   injectedFailure: string // null | 'primary_db' | 'metadata_cache' | 'edge_cdn' | 'lb'
   * }
   */
  simulateChaos(payload = {}) {
    const {
      templateId = 'video_cdn',
      customNodes = null,
      rpsTraffic = 50000,
      injectedFailure = null
    } = payload;

    const template = ARCHITECTURE_TEMPLATES[templateId] || ARCHITECTURE_TEMPLATES.video_cdn;
    const nodes = customNodes || template.nodes;

    // 1. Detect Single Points of Failure (SPOFs)
    const spofs = [];
    const lbNodes = nodes.filter(n => n.type.toLowerCase().includes('loadbalancer') || n.type.toLowerCase().includes('lb'));
    const cacheNodes = nodes.filter(n => n.type.toLowerCase().includes('cache') || n.type.toLowerCase().includes('redis'));
    const dbNodes = nodes.filter(n => n.type.toLowerCase().includes('db') || n.type.toLowerCase().includes('sql'));
    const appNodes = nodes.filter(n => n.type.toLowerCase().includes('app') || n.type.toLowerCase().includes('worker') || n.type.toLowerCase().includes('engine'));

    if (lbNodes.length === 0) spofs.push('Missing Load Balancer: Direct traffic to app tier creates instant bottleneck.');
    if (cacheNodes.length === 0) spofs.push('Missing Caching Layer: High-read traffic will exhaust DB connection pool.');
    if (dbNodes.length < 2) spofs.push('Single Database Node: Lack of replica/multi-region cluster risks total data blackout.');
    if (appNodes.length < 2) spofs.push('Single Compute Instance: Cannot scale horizontally or survive node reboot.');

    // 2. Compute Latency Metrics under Load
    const hasCache = cacheNodes.length > 0;
    const cacheRedundancy = cacheNodes.reduce((sum, n) => sum + (n.redundancy || 1), 0);

    let p50 = hasCache ? 12 : 65;
    let p95 = hasCache ? 28 : 140;
    let p99 = hasCache ? 45 : 320;

    // Traffic Scaling Penalty
    if (rpsTraffic > 50000) {
      const surgeFactor = (rpsTraffic - 50000) / 50000;
      p50 += Math.round(surgeFactor * 4);
      p95 += Math.round(surgeFactor * 12);
      p99 += Math.round(surgeFactor * 25);
    }

    // 3. Chaos Failure Injection Impact
    let availabilitySLA = 99.99;
    let droppedRequestsPercent = 0.00;
    let chaosDiagnosticReport = 'System is healthy with all redundant clusters operational.';

    if (injectedFailure && injectedFailure !== 'none') {
      const targetNode = nodes.find(n => n.id === injectedFailure || n.type.toLowerCase().includes(injectedFailure));
      const redundancy = targetNode ? (targetNode.redundancy || 1) : 1;

      if (redundancy > 1) {
        // Redundant node crash: Auto-failover handles it cleanly
        p95 += 14;
        p99 += 28;
        availabilitySLA = 99.95;
        droppedRequestsPercent = 0.02;
        chaosDiagnosticReport = `CHAOS EVENT: Crashed "${targetNode ? targetNode.label : injectedFailure}". Automatic health-check heartbeat triggered failover in 210ms. 0.02% dropped in-flight packets, remaining ${redundancy - 1} nodes absorbed traffic load seamlessly.`;
      } else {
        // Non-redundant node crash: Critical Outage
        availabilitySLA = 0.00;
        droppedRequestsPercent = 100.00;
        p50 = 5000;
        p95 = 10000;
        p99 = 15000;
        chaosDiagnosticReport = `CRITICAL OUTAGE: Crashed "${targetNode ? targetNode.label : injectedFailure}". Single Point of Failure (SPOF) with redundancy=1. 100% of user traffic failing with HTTP 503/504 Gateway Timeouts.`;
      }
    }

    // 4. Compute Architecture Rating
    let architectureGrade = 'Tier-1 FAANG Architecture (Production Ready)';
    if (availabilitySLA < 90) architectureGrade = 'Catastrophic Outage (Immediate Redundancy Fix Required)';
    else if (spofs.length > 0) architectureGrade = 'Moderate Vulnerability (SPOFs Detected)';
    else if (p99 > 100) architectureGrade = 'High Latency Under Load (Optimize Caching Strategy)';

    return {
      success: true,
      templateName: template.name,
      evaluatedRPS: Number(rpsTraffic),
      activeNodeCount: nodes.length,
      latencyProfile: {
        p50: `${p50}ms`,
        p95: `${p95}ms`,
        p99: `${p99}ms`
      },
      availabilitySLA: `${availabilitySLA.toFixed(2)}%`,
      droppedRequestsRate: `${droppedRequestsPercent.toFixed(2)}%`,
      spofVulnerabilities: spofs,
      architectureGrade,
      chaosSimulationSummary: chaosDiagnosticReport,
      recommendedOptimizations: [
        hasCache ? 'Cache topology is optimal with distributed key sharding.' : 'Introduce an in-memory Redis cluster to absorb read spikes.',
        'Configure circuit breakers with Exponential Backoff + Jitter to prevent cascading retry storms.'
      ]
    };
  }
}

const liveWhiteboardSimulator = new LiveWhiteboardSimulator();
module.exports = { LiveWhiteboardSimulator, liveWhiteboardSimulator, ARCHITECTURE_TEMPLATES };
