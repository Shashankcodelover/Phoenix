/**
 * Phoenix v10.0: Latency Budget & Circuit Breaker Architecture Evaluator Engine
 * 
 * Analyzes microservice topology topologies for latency budget compliance (p50, p95, p99),
 * cascading failure risks, Single Point of Failure (SPOF) vulnerabilities,
 * and circuit breaker health configurations without external API keys.
 */

/**
 * Evaluates architecture topology for latency and resilience risks.
 * 
 * @param {Object} params
 * @param {Array<Object>} params.architectureTopology - List of service node objects
 * @param {number} [params.SLAThresholdMs=250] - Maximum target p95 latency SLA in milliseconds
 * @param {number} [params.retryLimit=3] - Maximum retry attempts configured
 * @returns {Object} Structured latency & circuit breaker evaluation payload
 */
function evaluateLatencyCircuitBreaker({ architectureTopology = [], SLAThresholdMs = 250, retryLimit = 3 }) {
  const nodes = Array.isArray(architectureTopology) && architectureTopology.length > 0
    ? architectureTopology
    : [
        { name: "API Gateway", p50: 15, p95: 35, p99: 70, hasCircuitBreaker: true, hasCache: true, hasReplica: true },
        { name: "Auth Service", p50: 20, p95: 45, p99: 90, hasCircuitBreaker: false, hasCache: true, hasReplica: false },
        { name: "Core DB Cluster", p50: 40, p95: 120, p99: 240, hasCircuitBreaker: false, hasCache: false, hasReplica: true }
      ];

  let totalP50 = 0;
  let totalP95 = 0;
  let totalP99 = 0;
  const spofNodes = [];
  const unprotectedHighLatencyNodes = [];
  let circuitBreakersCount = 0;

  nodes.forEach(node => {
    const p50 = typeof node.p50 === "number" ? node.p50 : 20;
    const p95 = typeof node.p95 === "number" ? node.p95 : 50;
    const p99 = typeof node.p99 === "number" ? node.p99 : 100;

    totalP50 += p50;
    totalP95 += p95;
    totalP99 += p99;

    if (node.hasCircuitBreaker) {
      circuitBreakersCount++;
    }

    // SPOF Detection logic: missing replicas & missing fallback cache
    if (!node.hasReplica && !node.hasCache) {
      spofNodes.push({
        nodeName: node.name || "Unknown Service",
        reason: "Missing both replica redundancy and caching fallback."
      });
    }

    // High latency unprotected node
    if (p95 > 100 && !node.hasCircuitBreaker) {
      unprotectedHighLatencyNodes.push({
        nodeName: node.name || "Unknown Service",
        p95Latency: p95,
        reason: "p95 latency exceeds 100ms without circuit breaker protection."
      });
    }
  });

  // Calculate SLA Violation Risk Percentage
  const slaOverhead = totalP95 - SLAThresholdMs;
  let slaViolationRisk = 0;
  if (slaOverhead > 0) {
    slaViolationRisk = Math.min(100, Math.round((slaOverhead / SLAThresholdMs) * 100) + 30);
  } else {
    slaViolationRisk = Math.max(5, Math.round((totalP95 / SLAThresholdMs) * 25));
  }

  // Determine Circuit Breaker Health Status
  const coverageRatio = nodes.length > 0 ? circuitBreakersCount / nodes.length : 0;
  let circuitBreakerHealth = "DEGRADED";
  if (coverageRatio >= 0.75 && spofNodes.length === 0) {
    circuitBreakerHealth = "OPTIMAL";
  } else if (coverageRatio < 0.33 || spofNodes.length >= 2) {
    circuitBreakerHealth = "CRITICAL";
  }

  // System Stability Score (0-100)
  let stabilityScore = 100 - (spofNodes.length * 20) - (unprotectedHighLatencyNodes.length * 15) - (slaViolationRisk * 0.4);
  stabilityScore = Math.min(100, Math.max(0, Math.round(stabilityScore)));

  // Generate actionable recommendations
  const resilienceRecommendations = [];
  if (spofNodes.length > 0) {
    resilienceRecommendations.push(`Add multi-AZ replicas or Redis caching layer for SPOF nodes: ${spofNodes.map(n => n.nodeName).join(", ")}.`);
  }
  if (unprotectedHighLatencyNodes.length > 0) {
    resilienceRecommendations.push(`Implement Resilience4j / Cockatiel circuit breakers on slow downstream nodes: ${unprotectedHighLatencyNodes.map(n => n.nodeName).join(", ")}.`);
  }
  if (totalP95 > SLAThresholdMs) {
    resilienceRecommendations.push(`Cumulative p95 latency (${totalP95}ms) breaches SLA threshold (${SLAThresholdMs}ms). Introduce asynchronous queueing / background worker pool.`);
  }
  if (resilienceRecommendations.length === 0) {
    resilienceRecommendations.push("Architecture topology demonstrates robust SLA compliance, fault isolation, and circuit breaker redundancy.");
  }

  return {
    success: true,
    totalNodesEvaluated: nodes.length,
    slaTargetMs: SLAThresholdMs,
    latencyMetrics: {
      totalP50Ms: totalP50,
      totalP95Ms: totalP95,
      totalP99Ms: totalP99
    },
    slaViolationRiskPercentage: slaViolationRisk,
    circuitBreakerHealth,
    stabilityScore,
    spofVulnerabilities: spofNodes,
    unprotectedHighLatencyNodes,
    resilienceRecommendations
  };
}

module.exports = {
  evaluateLatencyCircuitBreaker
};
