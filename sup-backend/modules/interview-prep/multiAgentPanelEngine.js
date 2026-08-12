/**
 * Phoenix v19: Multi-Agent AI Interview Panel Simulator
 * =====================================================
 * Simulates a concurrent 3-person FAANG interview panel:
 *  - Bar-Raiser (Edge cases, fault tolerance, scalability limits)
 *  - Tech Lead (Concurrency, data structures, code maintainability)
 *  - Hiring Manager (Cross-functional ownership, leadership principles, culture)
 */

const PANEL_PERSONAS = {
  BAR_RAISER: {
    name: 'Sarah (Bar-Raiser)',
    focus: 'Scalability, Edge Cases & Failure Modes',
    weight: 0.35,
    promptFocus: 'Challenge the candidate on high-load concurrency, network partition scenarios, and blast radius mitigation.'
  },
  TECH_LEAD: {
    name: 'Marcus (Staff Tech Lead)',
    focus: 'Algorithmic Efficiency & API Architecture',
    weight: 0.35,
    promptFocus: 'Evaluate clean abstraction boundaries, time/space complexity tradeoffs, and code extensibility.'
  },
  HIRING_MANAGER: {
    name: 'Elena (Director of Engineering)',
    focus: 'Leadership, Ownership & Team Execution Velocity',
    weight: 0.30,
    promptFocus: 'Analyze stakeholder alignment, prioritization under ambiguity, and post-mortem learning culture.'
  }
};

/**
 * Evaluates candidate response across the 3 distinct panel perspectives.
 * 
 * @param {Object} input
 * @param {string} input.question - The interview prompt given to candidate
 * @param {string} input.candidateAnswer - Candidate's detailed response
 * @param {string} input.roundType - 'SYSTEM_DESIGN' | 'CODING' | 'BEHAVIORAL'
 * @returns {Object} Multi-agent consensus report
 */
function evaluatePanelConsensus(input = {}) {
  const { question = '', candidateAnswer = '', roundType = 'SYSTEM_DESIGN' } = input;

  if (!candidateAnswer || typeof candidateAnswer !== 'string' || candidateAnswer.trim().length < 20) {
    return {
      success: false,
      error: 'Candidate answer must be at least 20 characters for panel review.'
    };
  }

  const answerLength = candidateAnswer.split(/\s+/).length;
  const lowerAnswer = candidateAnswer.toLowerCase();

  // 1. Bar-Raiser Evaluation
  const hasFailureHandling = lowerAnswer.includes('fallback') || lowerAnswer.includes('retry') || lowerAnswer.includes('circuit breaker') || lowerAnswer.includes('redundant') || lowerAnswer.includes('idempotent');
  const barRaiserScore = Math.min(100, Math.round(50 + (hasFailureHandling ? 35 : 10) + Math.min(15, answerLength / 10)));
  const barRaiserFeedback = hasFailureHandling
    ? 'Solid disaster recovery and resilience thinking. Demonstrated understanding of failure boundaries.'
    : 'Lacks explicit discussion of disaster recovery, network timeouts, and degraded fallback states.';

  // 2. Tech Lead Evaluation
  const hasTechPrecision = lowerAnswer.includes('latency') || lowerAnswer.includes('cache') || lowerAnswer.includes('database') || lowerAnswer.includes('complexity') || lowerAnswer.includes('async') || lowerAnswer.includes('queue');
  const techLeadScore = Math.min(100, Math.round(55 + (hasTechPrecision ? 30 : 10) + Math.min(15, answerLength / 12)));
  const techLeadFeedback = hasTechPrecision
    ? 'Strong technical precision. Architecture shows clean separation of concerns.'
    : 'Needs more concrete specifics on data models, caching layers, and throughput limits.';

  // 3. Hiring Manager Evaluation
  const hasOwnership = lowerAnswer.includes('measured') || lowerAnswer.includes('impact') || lowerAnswer.includes('collaborated') || lowerAnswer.includes('team') || lowerAnswer.includes('priority') || lowerAnswer.includes('delivered');
  const hiringManagerScore = Math.min(100, Math.round(60 + (hasOwnership ? 25 : 10) + Math.min(15, answerLength / 15)));
  const hiringManagerFeedback = hasOwnership
    ? 'Excellent ownership mentality. Framed technical choices around measurable business outcomes.'
    : 'Candidate focused primarily on syntax/mechanics without conveying broader business context.';

  // Composite Weighted Score
  const compositeScore = Math.round(
    (barRaiserScore * PANEL_PERSONAS.BAR_RAISER.weight) +
    (techLeadScore * PANEL_PERSONAS.TECH_LEAD.weight) +
    (hiringManagerScore * PANEL_PERSONAS.HIRING_MANAGER.weight)
  );

  let consensusVerdict = 'LEAN_NO';
  if (compositeScore >= 85) consensusVerdict = 'STRONG_HIRE';
  else if (compositeScore >= 75) consensusVerdict = 'HIRE';
  else if (compositeScore >= 60) consensusVerdict = 'LEAN_HIRE';
  else consensusVerdict = 'NO_HIRE';

  return {
    success: true,
    roundType,
    compositeScore,
    consensusVerdict,
    panelVotes: [
      {
        persona: PANEL_PERSONAS.BAR_RAISER.name,
        score: barRaiserScore,
        vote: barRaiserScore >= 75 ? 'YES' : 'NO',
        feedback: barRaiserFeedback,
        followUpProbe: 'How does your system behave if the primary database partition becomes unreachable for 45 seconds?'
      },
      {
        persona: PANEL_PERSONAS.TECH_LEAD.name,
        score: techLeadScore,
        vote: techLeadScore >= 75 ? 'YES' : 'NO',
        feedback: techLeadFeedback,
        followUpProbe: 'Can you walk through the exact data model and indexing strategy for high-frequency write operations?'
      },
      {
        persona: PANEL_PERSONAS.HIRING_MANAGER.name,
        score: hiringManagerScore,
        vote: hiringManagerScore >= 75 ? 'YES' : 'NO',
        feedback: hiringManagerFeedback,
        followUpProbe: 'If product deadlines were cut in half, what features would you de-scope to maintain SLA guarantees?'
      }
    ],
    summaryRecommendation: `Panel reached consensus: ${consensusVerdict} with composite score of ${compositeScore}/100.`
  };
}

module.exports = {
  evaluatePanelConsensus,
  PANEL_PERSONAS
};
