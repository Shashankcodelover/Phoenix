/**
 * Phoenix Apex Ultra: Feature 9 — Compensation & Stock Equity Counter-Offer Negotiation Script Generator
 * 
 * Benchmarks candidate offers against Tier-1 FAANG compensation bands, calculates market percentile,
 * and drafts executive-grade, word-for-word counter-offer negotiation scripts.
 */

const FAANG_COMP_BANDS = {
  'google_l4': { title: 'Google L4 / Amazon SDE-2', baseRange: [140000, 185000], rsuRange: [75000, 130000], signonRange: [15000, 45000], targetTC: 280000 },
  'google_l5': { title: 'Google L5 / Senior Software Engineer', baseRange: [190000, 240000], rsuRange: [140000, 220000], signonRange: [30000, 75000], targetTC: 420000 },
  'startup_lead': { title: 'High-Growth Tech Unicorn Lead', baseRange: [160000, 210000], rsuRange: [50000, 120000], signonRange: [10000, 35000], targetTC: 310000 }
};

class CompensationNegotiatorEngine {
  /**
   * Evaluates job offer, calculates market percentile, and generates counter-offer scripts.
   */
  evaluateAndGenerateScript(offerPayload = {}) {
    const {
      company = 'Google',
      roleLevel = 'google_l4',
      baseSalary = 150000,
      annualStockGrant = 80000,
      signonBonus = 20000,
      hasCompetingOffer = true,
      competingCompany = 'Microsoft',
      competingTC = 275000
    } = offerPayload;

    const band = FAANG_COMP_BANDS[roleLevel] || FAANG_COMP_BANDS['google_l4'];
    const currentTotalComp = Number(baseSalary) + Number(annualStockGrant) + Number(signonBonus);

    // Calculate Market Percentile
    let percentile = 72;
    if (currentTotalComp >= band.targetTC * 1.15) percentile = 96;
    else if (currentTotalComp >= band.targetTC) percentile = 88;
    else if (currentTotalComp >= band.targetTC * 0.9) percentile = 78;
    else if (currentTotalComp < band.targetTC * 0.8) percentile = 54;

    // Counter-Offer Targets
    const counterBaseTarget = Math.round(Number(baseSalary) * 1.10);
    const counterRsuTarget = Math.round(Number(annualStockGrant) * 1.25);
    const counterSignonTarget = Math.round(Number(signonBonus) * 1.50);
    const counterTotalComp = counterBaseTarget + counterRsuTarget + counterSignonTarget;
    const additionalAnnualValue = counterTotalComp - currentTotalComp;

    // Executive Word-for-Word Email Script
    const emailTemplate = `Subject: Following up on Offer & Total Rewards — [Your Name]

Dear [Recruiter Name],

Thank you very much for extending the offer to join ${company} as ${band.title}. I am genuinely excited about the team's roadmap, particularly the engineering challenges around distributed systems and low-latency architecture.

After reviewing the total compensation structure and benchmarking against active discussions with ${hasCompetingOffer ? competingCompany : 'peer Tier-1 engineering organizations'}, I would like to explore adjusting the equity and base package to better reflect market alignment.

Specifically, I am targeting:
• Base Salary: $${counterBaseTarget.toLocaleString()} (reflecting specialized systems expertise)
• Annual Equity (RSUs): $${counterRsuTarget.toLocaleString()} / year ($${(counterRsuTarget * 4).toLocaleString()} 4-year grant)
• Sign-on Bonus: $${counterSignonTarget.toLocaleString()}

If we can reach total compensation of $${counterTotalComp.toLocaleString()}, I would be thrilled to sign immediately and decline all other active interview pipelines.

Thank you again for your partnership throughout this process. I look forward to your thoughts!

Warm regards,
[Your Name]`;

    // Phone Negotiation Strategy
    const phoneTalkingPoints = [
      'Lead with enthusiasm: Reiterate that this company is your #1 top choice.',
      `Anchor high on equity: "I am confident in ${company}'s long-term stock trajectory, so I prefer higher RSU weighting."`,
      hasCompetingOffer
        ? `Leverage competing offer politely: "I have a competing offer from ${competingCompany} offering $${competingTC.toLocaleString()} total comp, but I prefer your team culture."`
        : 'Emphasize immediate sign: "If we can bridge the gap on annual equity, I will sign the agreement within 24 hours."'
    ];

    return {
      success: true,
      company,
      roleLevel: band.title,
      currentOffer: {
        base: `$${Number(baseSalary).toLocaleString()}`,
        equity: `$${Number(annualStockGrant).toLocaleString()}/yr`,
        signon: `$${Number(signonBonus).toLocaleString()}`,
        totalFirstYearComp: `$${currentTotalComp.toLocaleString()}`
      },
      marketBenchmark: {
        percentile: `P${percentile}`,
        evaluation: percentile >= 85 ? 'Competitive Offer (Top 15% Band)' : 'Under-Benchmarked (High Negotiation Leverage)'
      },
      counterOfferRecommendation: {
        recommendedBase: `$${counterBaseTarget.toLocaleString()}`,
        recommendedEquity: `$${counterRsuTarget.toLocaleString()}/yr`,
        recommendedSignon: `$${counterSignonTarget.toLocaleString()}`,
        recommendedTotalComp: `$${counterTotalComp.toLocaleString()}`,
        potentialUpside: `+$${additionalAnnualValue.toLocaleString()} / year`
      },
      negotiationArtifacts: {
        recruiterEmailTemplate: emailTemplate,
        phoneNegotiationKeypoints: phoneTalkingPoints,
        riskLevel: 'LOW / SAFE (Standard Industry Counter-Offer Window)'
      }
    };
  }

  /**
   * Domestic & Global Offer Evaluator and Script Synthesizer
   */
  evaluateOffer(payload = {}) {
    const {
      roleLevel = 'SDE1',
      baseSalary = 1600000,
      joiningBonus = 200000,
      stocksEsopsYearly = 300000,
      hasCompetingOffer = false,
      competingTotal = 0
    } = payload;

    const totalInr = Number(baseSalary) + Number(joiningBonus) + Number(stocksEsopsYearly);
    const lpa = (totalInr / 100000).toFixed(1) + ' LPA';
    const hasLeverage = hasCompetingOffer || totalInr < 2000000;

    return {
      roleLevel,
      currentTotalCTC: `${lpa} ($${Math.round(totalInr / 83).toLocaleString()})`,
      negotiationLeverage: hasLeverage ? 'High (Strong Upward Mobility)' : 'Moderate',
      counterOfferScript: `I am thrilled by this offer. Given my active discussions and competing offer of ₹${(Number(competingTotal || 0)/100000).toFixed(1)} LPA, I would like to explore bridging the base to ₹${((totalInr * 1.15)/100000).toFixed(1)} LPA.`
    };
  }
}

const compensationNegotiatorEngine = new CompensationNegotiatorEngine();
module.exports = { CompensationNegotiatorEngine, compensationNegotiatorEngine };
