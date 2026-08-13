/**
 * Phoenix v23.0: Offer Negotiation & Compensation Benchmarking Simulator
 */

const MARKET_BENCHMARKS = {
  SDE1: { p25: 1200000, p50: 1800000, p75: 2600000, p90: 3800000 },
  SDE2: { p25: 2400000, p50: 3400000, p75: 4800000, p90: 6500000 },
  LEAD: { p25: 4500000, p50: 6000000, p75: 8500000, p90: 12000000 }
};

class CompensationNegotiatorEngine {
  /**
   * Evaluates a job offer against Bangalore/Tier-1 India tech market percentiles and drafts counter-offer scripts.
   */
  evaluateOffer(offer = {}) {
    const {
      roleLevel = 'SDE1',
      baseSalary = 1800000,
      joiningBonus = 200000,
      stocksEsopsYearly = 400000,
      hasCompetingOffer = false,
      competingTotal = 0
    } = offer;

    const totalCTC = baseSalary + joiningBonus + stocksEsopsYearly;
    const benchmarks = MARKET_BENCHMARKS[roleLevel.toUpperCase()] || MARKET_BENCHMARKS.SDE1;

    let marketPercentile = 50;
    if (totalCTC >= benchmarks.p90) marketPercentile = 92;
    else if (totalCTC >= benchmarks.p75) marketPercentile = 78;
    else if (totalCTC >= benchmarks.p50) marketPercentile = 55;
    else marketPercentile = 30;

    let counterOfferTarget = Math.round(totalCTC * 1.18);
    if (hasCompetingOffer && competingTotal > totalCTC) {
      counterOfferTarget = Math.round(competingTotal * 1.10);
    }

    const script = `Hi [Recruiter Name],\n\nThank you very much for extending this offer for the ${roleLevel} role. I am extremely excited about the team's mission and engineering challenges. After reviewing the complete compensation structure and considering market benchmarks for Tier-1 engineering talent${hasCompetingOffer ? ' as well as a competing offer at ₹' + (competingTotal/100000) + ' LPA' : ''}, I would like to discuss adjusting the base salary to ₹${Math.round(counterOfferTarget * 0.7 / 100000)} LPA or expanding the joining bonus. If we can reach common ground on this figure, I am prepared to sign immediately.\n\nBest regards,\n[Your Name]`;

    return {
      roleLevel,
      currentTotalCTC: `₹${(totalCTC/100000).toFixed(1)} LPA`,
      marketPercentile: `P${marketPercentile}`,
      recommendedCounterTarget: `₹${(counterOfferTarget/100000).toFixed(1)} LPA`,
      negotiationLeverage: hasCompetingOffer ? 'High Leverage (Competing Offer Active)' : (marketPercentile >= 75 ? 'Moderate Leverage (Strong Initial Offer)' : 'High Leverage (Below Market 75th Percentile)'),
      counterOfferScript: script,
      keyNegotiationRules: [
        'Never negotiate over text or email if you can get on a 5-minute phone call.',
        'Always express strong enthusiasm for the role before bringing up numbers.',
        'Trade equity for base salary if you are risk-averse, or maximize RSUs for high-growth tech firms.'
      ]
    };
  }
}

const compensationNegotiatorEngine = new CompensationNegotiatorEngine();
module.exports = { CompensationNegotiatorEngine, compensationNegotiatorEngine, MARKET_BENCHMARKS };
