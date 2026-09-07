/**
 * Phoenix Apex Ultra: Feature 15 — Salary Negotiation & Multi-Offer Comparator Engine
 * 
 * Provides:
 * 1. Multi-offer 4-year Total Comp (TC) modeling with exact vesting schedules (Equal, Amazon 5/15/40/40, Google 33/33/22/12, Stripe 1-year).
 * 2. Post-Tax net estimation & Cost-of-Living (COL) purchasing power normalization (SF Bay Area, NYC, Seattle WA, Austin TX, Remote).
 * 3. Market Percentile benchmarking across Tier-1 tech compensation bands (Google L4-L6, Meta E4-E6, Amazon SDE2-Principal, Unicorns).
 * 4. Executive-level word-for-word counter-offer email generator & phone negotiation playbook.
 */

const FAANG_COMP_BANDS = {
  'google_l4': { company: 'Google', level: 'L4', title: 'Google L4 / Meta E4 / Amazon SDE-2', baseRange: [150000, 190000], rsuRange: [80000, 140000], bonusPct: 15, signonRange: [15000, 45000], p50TC: 265000, p75TC: 295000, p90TC: 330000 },
  'google_l5': { company: 'Google', level: 'L5', title: 'Google L5 / Meta E5 / Senior SDE', baseRange: [195000, 245000], rsuRange: [140000, 240000], bonusPct: 15, signonRange: [30000, 80000], p50TC: 395000, p75TC: 445000, p90TC: 510000 },
  'google_l6': { company: 'Google', level: 'L6', title: 'Google L6 / Meta E6 / Staff SDE', baseRange: [230000, 290000], rsuRange: [220000, 380000], bonusPct: 20, signonRange: [50000, 120000], p50TC: 550000, p75TC: 630000, p90TC: 740000 },
  'meta_e5': { company: 'Meta', level: 'E5', title: 'Meta E5 / Senior Software Engineer', baseRange: [200000, 250000], rsuRange: [160000, 260000], bonusPct: 15, signonRange: [35000, 85000], p50TC: 410000, p75TC: 465000, p90TC: 530000 },
  'amazon_sde2': { company: 'Amazon', level: 'SDE-2', title: 'Amazon SDE-2 (L5)', baseRange: [165000, 195000], rsuRange: [70000, 130000], bonusPct: 0, signonRange: [40000, 90000], p50TC: 260000, p75TC: 290000, p90TC: 325000 },
  'amazon_sde3': { company: 'Amazon', level: 'SDE-3', title: 'Amazon SDE-3 / Principal (L6)', baseRange: [195000, 230000], rsuRange: [150000, 250000], bonusPct: 0, signonRange: [50000, 110000], p50TC: 390000, p75TC: 440000, p90TC: 500000 },
  'startup_unicorn': { company: 'Series C/D Unicorn', level: 'Lead', title: 'High-Growth Tech Unicorn Lead', baseRange: [180000, 225000], rsuRange: [90000, 180000], bonusPct: 10, signonRange: [15000, 40000], p50TC: 320000, p75TC: 375000, p90TC: 440000 }
};

const LOCATIONS = {
  'sf_bay_area': { name: 'San Francisco / Bay Area, CA', stateTaxPct: 9.3, colIndex: 100, label: 'High Tax / High COL' },
  'seattle_wa': { name: 'Seattle, WA', stateTaxPct: 0.0, colIndex: 88, label: '0% State Tax / Moderate-High COL' },
  'nyc_ny': { name: 'New York City, NY', stateTaxPct: 10.5, colIndex: 102, label: 'Highest State + City Tax / High COL' },
  'austin_tx': { name: 'Austin, TX', stateTaxPct: 0.0, colIndex: 74, label: '0% State Tax / Moderate COL' },
  'us_remote': { name: 'US Remote / Low COL Hub', stateTaxPct: 4.5, colIndex: 65, label: 'Low COL Advantage' }
};

const VESTING_SCHEDULES = {
  'equal_25': { name: 'Meta / Standard 4-Year Equal', y1: 0.25, y2: 0.25, y3: 0.25, y4: 0.25 },
  'google_front': { name: 'Google Front-Loaded (33/33/22/12)', y1: 0.33, y2: 0.33, y3: 0.22, y4: 0.12 },
  'amazon_back': { name: 'Amazon Back-Loaded (5/15/40/40)', y1: 0.05, y2: 0.15, y3: 0.40, y4: 0.40 },
  'annual_refresher': { name: 'Standard 4-Year Even (25/yr)', y1: 0.25, y2: 0.25, y3: 0.25, y4: 0.25 }
};

class CompensationNegotiatorEngine {
  /**
   * Return benchmark metadata
   */
  getBenchmarkMeta() {
    return {
      success: true,
      bands: FAANG_COMP_BANDS,
      locations: LOCATIONS,
      vestingSchedules: VESTING_SCHEDULES
    };
  }

  /**
   * Compare multiple offers side-by-side
   * @param {Array<Object>} offers
   */
  compareOffers(offers = []) {
    if (!offers || !offers.length) {
      return { success: false, error: 'No offers provided for comparison' };
    }

    const analyzedOffers = offers.map((offer, idx) => {
      const company = offer.company || `Offer ${String.fromCharCode(65 + idx)}`;
      const roleLevel = offer.roleLevel || 'google_l5';
      const band = FAANG_COMP_BANDS[roleLevel] || FAANG_COMP_BANDS['google_l5'];
      const locationKey = offer.location || 'sf_bay_area';
      const loc = LOCATIONS[locationKey] || LOCATIONS['sf_bay_area'];
      const vestingKey = offer.vestingSchedule || 'equal_25';
      const vest = VESTING_SCHEDULES[vestingKey] || VESTING_SCHEDULES['equal_25'];

      const base = Number(offer.baseSalary || 0);
      const totalEquityGrant = Number(offer.totalEquityGrant || (offer.annualStockGrant ? offer.annualStockGrant * 4 : 0));
      const annualStockGrant = totalEquityGrant > 0 ? Math.round(totalEquityGrant / 4) : Number(offer.annualStockGrant || 0);
      const bonusPct = offer.bonusPercentage !== undefined ? Number(offer.bonusPercentage) : band.bonusPct;
      const annualBonus = Math.round(base * (bonusPct / 100));
      const signonY1 = Number(offer.signonY1 || offer.signonBonus || 0);
      const signonY2 = Number(offer.signonY2 || 0);

      // Calculate Year 1 - Year 4 compensation
      const y1Equity = Math.round(totalEquityGrant * vest.y1);
      const y2Equity = Math.round(totalEquityGrant * vest.y2);
      const y3Equity = Math.round(totalEquityGrant * vest.y3);
      const y4Equity = Math.round(totalEquityGrant * vest.y4);

      const y1TC = base + annualBonus + y1Equity + signonY1;
      const y2TC = base + annualBonus + y2Equity + signonY2;
      const y3TC = base + annualBonus + y3Equity;
      const y4TC = base + annualBonus + y4Equity;

      const total4YearComp = y1TC + y2TC + y3TC + y4TC;
      const avgAnnualTC = Math.round(total4YearComp / 4);

      // Tax Estimation (Federal avg 24% + state tax)
      const effectiveTaxRate = (24.0 + loc.stateTaxPct) / 100;
      const y1PostTax = Math.round(y1TC * (1 - effectiveTaxRate));
      const avgPostTax = Math.round(avgAnnualTC * (1 - effectiveTaxRate));

      // COL Normalization (Baseline = 100 SF)
      const colAdjustedPurchasingPower = Math.round(avgPostTax * (100 / loc.colIndex));

      // Market Percentile
      let percentile = 65;
      if (y1TC >= band.p90TC) percentile = 94;
      else if (y1TC >= band.p75TC) percentile = 82;
      else if (y1TC >= band.p50TC) percentile = 68;
      else percentile = 48;

      return {
        id: offer.id || `offer-${idx + 1}`,
        company,
        roleTitle: offer.roleTitle || band.title,
        roleLevel,
        location: loc.name,
        locationKey,
        vestingSchedule: vest.name,
        baseSalary: base,
        annualBonus,
        bonusPct,
        totalEquityGrant,
        signonBonus: signonY1,
        signonY2,
        annualBreakdown: {
          year1: { total: y1TC, equity: y1Equity, signon: signonY1, postTax: y1PostTax },
          year2: { total: y2TC, equity: y2Equity, signon: signonY2 },
          year3: { total: y3TC, equity: y3Equity },
          year4: { total: y4TC, equity: y4Equity }
        },
        firstYearTC: y1TC,
        avgAnnualTC,
        total4YearComp,
        postTaxNetAnnual: avgPostTax,
        colAdjustedPurchasingPower,
        marketPercentile: `P${percentile}`,
        percentileNum: percentile,
        taxDeductionRate: `${Math.round(effectiveTaxRate * 100)}%`
      };
    });

    // Determine winners
    const highestY1 = [...analyzedOffers].sort((a, b) => b.firstYearTC - a.firstYearTC)[0];
    const highest4Year = [...analyzedOffers].sort((a, b) => b.total4YearComp - a.total4YearComp)[0];
    const highestPurchasingPower = [...analyzedOffers].sort((a, b) => b.colAdjustedPurchasingPower - a.colAdjustedPurchasingPower)[0];

    return {
      success: true,
      offerCount: analyzedOffers.length,
      offers: analyzedOffers,
      comparisonInsights: {
        highestFirstYear: { company: highestY1.company, amount: highestY1.firstYearTC },
        highestFourYear: { company: highest4Year.company, amount: highest4Year.total4YearComp },
        highestPurchasingPower: { company: highestPurchasingPower.company, amount: highestPurchasingPower.colAdjustedPurchasingPower, location: highestPurchasingPower.location },
        differentialFirstYear: highestY1.firstYearTC - (analyzedOffers.length > 1 ? [...analyzedOffers].sort((a, b) => a.firstYearTC - b.firstYearTC)[0].firstYearTC : 0)
      }
    };
  }

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
    if (currentTotalComp >= band.p90TC || currentTotalComp >= (band.targetTC || band.p75TC) * 1.15) percentile = 96;
    else if (currentTotalComp >= (band.targetTC || band.p75TC)) percentile = 88;
    else if (currentTotalComp >= (band.p50TC || 250000)) percentile = 78;
    else percentile = 54;

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
        ? `Leverage competing offer politely: "I have a competing offer from ${competingCompany} offering $${Number(competingTC).toLocaleString()} total comp, but I prefer your team culture."`
        : 'Emphasize immediate sign: "If we can bridge the gap on annual equity, I will sign the agreement within 24 hours."'
    ];

    const objectionHandling = [
      {
        objection: 'Our initial offer is at the ceiling for this level band.',
        counter: 'Understood. If base salary is fixed by band constraints, can we look at an additional sign-on bonus or upfront RSU refresher grant to bridge the delta?'
      },
      {
        objection: 'We need you to sign within 48 hours or this offer expires.',
        counter: 'I want to be fully transparent: I am eager to join and ready to commit if we align on numbers. Can we extend the deadline by 3 days so we can finalize total compensation?'
      }
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
        objectionPlaybook: objectionHandling,
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
module.exports = { CompensationNegotiatorEngine, compensationNegotiatorEngine, FAANG_COMP_BANDS, LOCATIONS, VESTING_SCHEDULES };
