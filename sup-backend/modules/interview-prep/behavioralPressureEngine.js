/**
 * Phoenix v10.0: Interactive Behavioral Outage Crisis & Pressure Engine
 * 
 * Evaluates candidate responses to high-stress interview curveballs
 * (production outages, executive crunch time, breaking API changes).
 * Computes pressure composure index, technical de-escalation rating,
 * and crisis recovery strategies without external API dependency.
 */

const SCENARIOS = {
  PROD_OUTAGE: {
    title: "Production Database Outage & Spike",
    description: "Database CPU hits 100%, write queries timing out during peak traffic.",
    keyActions: ["triage", "rollback", "read-replica", "rate-limit", "status page"]
  },
  DEADLINE_CRUNCH: {
    title: "Executive Scope Creep 2 Hours Before Launch",
    description: "VP requests major auth change right before scheduled deployment.",
    keyActions: ["tradeoff", "phase-2", "risk assessment", "stakeholder communication"]
  },
  SPEC_AMBIGUITY: {
    title: "Conflicting API Specifications Across Teams",
    description: "Frontend and backend teams implemented mismatched interfaces for release.",
    keyActions: ["contract test", "adapter pattern", "feature flag", "alignment meeting"]
  },
  SECURITY_BREACH: {
    title: "Zero-Day Vulnerability Exploit Alert",
    description: "Suspicious payload traffic detected on authenticated payment endpoints.",
    keyActions: ["revoke keys", "patch", "containment", "audit log", "incident response"]
  }
};

/**
 * Evaluates candidate crisis response under pressure.
 * 
 * @param {Object} params
 * @param {string} params.candidateAnswer - The candidate's response
 * @param {string} [params.crisisScenario] - Scenario key (PROD_OUTAGE, DEADLINE_CRUNCH, etc.)
 * @param {number} [params.reactionTimeSeconds] - Response latency in seconds
 * @returns {Object} Structured behavioral pressure evaluation payload
 */
function evaluateBehavioralPressure({ candidateAnswer = "", crisisScenario = "PROD_OUTAGE", reactionTimeSeconds = 15 }) {
  const scenarioKey = SCENARIOS[crisisScenario] ? crisisScenario : "PROD_OUTAGE";
  const scenario = SCENARIOS[scenarioKey];
  
  const text = (candidateAnswer || "").trim();
  const lowerText = text.toLowerCase();

  // De-escalation & Technical Composure regex indicators
  const composurePatterns = [
    { pattern: /isolate|triage|contain/i, weight: 15, label: "Immediate Isolation & Triage" },
    { pattern: /rollback|revert|backup/i, weight: 15, label: "Safe Rollback & Recovery" },
    { pattern: /communicate|status page|stakeholder|notify/i, weight: 15, label: "Proactive Stakeholder Communication" },
    { pattern: /metrics|logs|datadog|grafana|telemetry|trace/i, weight: 15, label: "Empirical Root-Cause Diagnostics" },
    { pattern: /fallback|circuit breaker|rate limit|degrade/i, weight: 15, label: "Graceful Degradation Mechanism" },
    { pattern: /postmortem|retrospective|root cause|prevention/i, weight: 15, label: "Preventative Post-Incident Action" }
  ];

  // Panic & Weak Composure indicators
  const panicPatterns = [
    { pattern: /\bpanic\b|\bfreak out\b|\bdon't know what to do\b/i, penalty: 20, label: "Overt Panic Expression" },
    { pattern: /\bgave up\b|\bquit\b|\bblame\b|\bnot my fault\b/i, penalty: 25, label: "Shifted Blame / Deflective Attitude" },
    { pattern: /\bscrewed\b|\bdisaster\b|\bhopeless\b/i, penalty: 15, label: "Catastrophizing Language" }
  ];

  let composureScore = 40; // Base score
  const keyStrengths = [];
  const panicFlags = [];

  composurePatterns.forEach(({ pattern, weight, label }) => {
    if (pattern.test(lowerText)) {
      composureScore += weight;
      keyStrengths.push(label);
    }
  });

  panicPatterns.forEach(({ pattern, penalty, label }) => {
    if (pattern.test(lowerText)) {
      composureScore -= penalty;
      panicFlags.push(label);
    }
  });

  // Length check (substantive responses get small boost)
  if (text.length > 200) composureScore += 10;
  if (text.length === 0) composureScore = 0;

  // Clamp 0 to 100
  const finalScore = Math.min(100, Math.max(0, Math.round(composureScore)));

  // Determine Crisis Rating Tier
  let crisisRating = "MODERATE";
  if (finalScore >= 90) crisisRating = "EXEMPLARY";
  else if (finalScore >= 75) crisisRating = "STRONG";
  else if (finalScore >= 55) crisisRating = "MODERATE";
  else crisisRating = "VULNERABLE";

  // Actionable remediation strategies based on performance
  const recommendedStrategy = [
    `Apply the 4-Phase Outage Framework: 1) Stabilize/Rollback -> 2) Communicate -> 3) Root Cause -> 4) Postmortem.`,
    `Focus on empirical telemetry (metrics, logs, traces) over guessing root causes.`,
    `Always state clear fallback & rate-limiting policies when system capacity is degraded.`
  ];

  return {
    success: true,
    scenarioTitle: scenario.title,
    scenarioDescription: scenario.description,
    pressureIndex: finalScore,
    deescalationScore: Math.min(100, Math.max(0, Math.round(finalScore * 0.95))),
    crisisRating,
    reactionTimeSeconds,
    keyStrengths: keyStrengths.length > 0 ? keyStrengths : ["Basic Crisis Awareness"],
    panicFlagsDetected: panicFlags,
    recommendedStrategy
  };
}

module.exports = {
  evaluateBehavioralPressure,
  SCENARIOS
};
