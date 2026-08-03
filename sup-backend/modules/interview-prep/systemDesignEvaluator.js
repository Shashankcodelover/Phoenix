/**
 * Phoenix v8.0: Interactive System Design Architecture Evaluator
 * 
 * Evaluates candidate system architecture proposals against target SLAs & constraints:
 * - Throughput & QPS Bottleneck Identification
 * - Latency & SLA Compliance Score (0-100)
 * - Single Point of Failure (SPOF) Risk Scorer
 * - Monthly AWS/GCP Estimated Cloud Cost Calculation
 * - Automated Architectural Tradeoff Recommendations
 */

/**
 * Evaluates a proposed system design architecture layout against scale targets.
 * 
 * @param {Object} proposal
 * @param {number} proposal.targetQps - Peak Queries Per Second (e.g. 50000)
 * @param {Array<string>} proposal.components - Array of component names e.g. ['CDN', 'Load Balancer', 'API Gateway', 'Redis Cache', 'PostgreSQL Primary', 'PostgreSQL Read Replica', 'Kafka Queue']
 * @param {string} proposal.databaseType - 'PostgreSQL' | 'MongoDB' | 'DynamoDB' | 'Cassandra'
 * @param {boolean} proposal.hasCaching - Whether Redis/Memcached layer is present
 * @param {boolean} proposal.hasLoadBalancer - Whether Nginx/ALB is present
 * @param {boolean} proposal.hasQueue - Whether Kafka/RabbitMQ is present
 * @param {boolean} proposal.hasReadReplicas - Whether DB read replicas are present
 * @returns {Object} Comprehensive Architectural Evaluation Report
 */
function evaluateSystemDesign(proposal = {}) {
  const {
    targetQps = 10000,
    components = [],
    databaseType = 'PostgreSQL',
    hasCaching = false,
    hasLoadBalancer = false,
    hasQueue = false,
    hasReadReplicas = false
  } = proposal;

  const componentSet = new Set(components.map(c => c.toLowerCase()));

  // 1. Single Point of Failure (SPOF) Analysis
  const spofRisks = [];
  if (!hasLoadBalancer && !componentSet.has('load balancer') && !componentSet.has('alb')) {
    spofRisks.push('CRITICAL SPOF: No Load Balancer detected. Single application server instance will crash under traffic spikes.');
  }

  if (!hasReadReplicas && !componentSet.has('read replica') && !componentSet.has('replica')) {
    spofRisks.push('HIGH SPOF: Primary Database has no read replicas. Read heavy traffic can lock tables and cause DB outage.');
  }

  if (!hasQueue && targetQps > 10000 && !componentSet.has('kafka') && !componentSet.has('queue')) {
    spofRisks.push('MEDIUM SPOF: High QPS (>10k) without message queue buffer can cause HTTP connection pool exhaustion during spikes.');
  }

  if (!hasCaching && targetQps > 5000 && !componentSet.has('redis') && !componentSet.has('cache')) {
    spofRisks.push('HIGH SPOF: High QPS without Caching layer hits database directly for every read request.');
  }

  // 2. Latency & SLA Compliance Score (0-100)
  let slaScore = 100;
  if (!hasCaching) slaScore -= 20;
  if (!hasLoadBalancer) slaScore -= 25;
  if (!hasReadReplicas) slaScore -= 15;
  if (!hasQueue && targetQps > 15000) slaScore -= 15;

  let estimatedLatencyMs = 250; // default baseline latency
  if (hasCaching && hasLoadBalancer) estimatedLatencyMs = 35;
  else if (hasCaching) estimatedLatencyMs = 65;
  else if (hasLoadBalancer) estimatedLatencyMs = 120;

  slaScore = Math.max(10, Math.min(100, slaScore));

  // 3. QPS Capacity & Bottleneck Identification
  let maxSupportedQps = 2000;
  if (hasLoadBalancer) maxSupportedQps *= 5; // 10,000 QPS
  if (hasCaching) maxSupportedQps *= 4;      // 40,000 QPS
  if (hasReadReplicas) maxSupportedQps *= 2; // 80,000 QPS
  if (hasQueue) maxSupportedQps *= 1.5;      // 120,000 QPS

  const handlesTargetQps = maxSupportedQps >= targetQps;

  // 4. Estimated Cloud Infrastructure Cost (Monthly AWS Estimate)
  let baseCost = 250; // base server cost
  if (hasLoadBalancer) baseCost += 150;
  if (hasCaching) baseCost += 200;
  if (hasQueue) baseCost += 300;
  if (hasReadReplicas) baseCost += 400;
  
  // Multiply cost based on QPS scaling scale
  const qpsCostFactor = Math.ceil(targetQps / 5000);
  const estimatedMonthlyCostUsd = baseCost * Math.max(1, qpsCostFactor * 0.75);

  // 5. Actionable Architectural Recommendations
  const recommendations = [];
  if (spofRisks.length === 0) {
    recommendations.push('Architecture exhibits strong high-availability design with redundant layers and zero single points of failure.');
  } else {
    recommendations.push(`Resolve ${spofRisks.length} SPOF vulnerabilities to achieve 99.99% uptime availability.`);
  }

  if (!handlesTargetQps) {
    recommendations.push(`Current architecture handles up to ${maxSupportedQps.toLocaleString()} QPS, but target is ${targetQps.toLocaleString()} QPS. Add horizontal DB read scaling or a distributed queue.`);
  } else {
    recommendations.push(`Capacity comfortably meets target load of ${targetQps.toLocaleString()} QPS with headroom up to ${maxSupportedQps.toLocaleString()} QPS.`);
  }

  return {
    targetQps,
    maxSupportedQps,
    handlesTargetQps,
    estimatedLatencyMs,
    slaScore,
    spofCount: spofRisks.length,
    spofRisks,
    estimatedMonthlyCostUsd: Math.round(estimatedMonthlyCostUsd),
    recommendations
  };
}

module.exports = { evaluateSystemDesign };
