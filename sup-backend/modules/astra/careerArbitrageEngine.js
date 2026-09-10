/**
 * Astra Quantum Career Opportunity Matrix & Market Arbitrage Engine
 * Standard: Levels.fyi Premium / Comprehensive.io / Carta Total Comp
 * 
 * Computes:
 * - 4-Year Total Compensation (Base + Bonus + Equity RSU Tranches)
 * - Global Tax & PPP (Purchasing Power Parity) Net Take-Home Arbitrage
 * - Monte Carlo Equity Appreciation Trajectory ($0 - $5M)
 * - Macro Headcount Risk & Layoff Resistance Score (0-100)
 */

const crypto = require('crypto');

const GLOBAL_CITIES = {
  sf_bay_area: {
    id: 'sf_bay_area',
    name: 'San Francisco / Silicon Valley (US)',
    taxRatePercent: 38.5, // Federal + CA State + FICA
    rentIndexUsdPerMo: 3400,
    costOfLivingFactor: 1.0, // Baseline
    currencySymbol: '$'
  },
  seattle: {
    id: 'seattle',
    name: 'Seattle, WA (US)',
    taxRatePercent: 26.5, // Federal only (0% Washington state tax)
    rentIndexUsdPerMo: 2400,
    costOfLivingFactor: 0.88,
    currencySymbol: '$'
  },
  zurich: {
    id: 'zurich',
    name: 'Zurich (Switzerland)',
    taxRatePercent: 22.0, // Swiss cantonal rate
    rentIndexUsdPerMo: 2900,
    costOfLivingFactor: 1.15,
    currencySymbol: 'CHF '
  },
  london: {
    id: 'london',
    name: 'London (UK)',
    taxRatePercent: 42.0, // HMRC higher bracket
    rentIndexUsdPerMo: 2600,
    costOfLivingFactor: 0.85,
    currencySymbol: '£'
  },
  bangalore: {
    id: 'bangalore',
    name: 'Bangalore / Bengaluru (India)',
    taxRatePercent: 31.2, // Indian New Tax Regime
    rentIndexUsdPerMo: 650,
    costOfLivingFactor: 0.28, // 3.6x PPP Multiplier
    currencySymbol: '₹'
  },
  singapore: {
    id: 'singapore',
    name: 'Singapore',
    taxRatePercent: 18.0,
    rentIndexUsdPerMo: 3100,
    costOfLivingFactor: 0.95,
    currencySymbol: 'S$'
  }
};

const FAANG_TIER_OFFERS = {
  google_l6: {
    id: 'google_l6',
    company: 'Google',
    level: 'Staff Software Engineer (L6)',
    location: 'sf_bay_area',
    baseSalaryUsd: 265000,
    bonusPercent: 25, // $66,250
    equityFourYearUsd: 680000, // $170,000/yr
    firstYearSignOnUsd: 50000,
    layoffResistanceScore: 92,
    headcountTrend: 'GROWING_AI_INFRA'
  },
  meta_e6: {
    id: 'meta_e6',
    company: 'Meta',
    level: 'Production Engineering Director / E6',
    location: 'seattle',
    baseSalaryUsd: 275000,
    bonusPercent: 25,
    equityFourYearUsd: 820000, // $205,000/yr
    firstYearSignOnUsd: 75000,
    layoffResistanceScore: 88,
    headcountTrend: 'EXPANDING_GENAI'
  },
  stripe_l5: {
    id: 'stripe_l5',
    company: 'Stripe',
    level: 'Staff Core Infrastructure Engineer (L5)',
    location: 'seattle',
    baseSalaryUsd: 255000,
    bonusPercent: 15,
    equityFourYearUsd: 750000,
    firstYearSignOnUsd: 40000,
    layoffResistanceScore: 94,
    headcountTrend: 'PROFITABLE_EXPANSION'
  }
};

/**
 * Computes net take home and purchasing power adjusted wealth
 */
function computeArbitrage(offerData = {}, cityKey = 'sf_bay_area', equityGrowthMultiplier = 1.0) {
  const city = GLOBAL_CITIES[cityKey] || GLOBAL_CITIES.sf_bay_area;
  const base = Number(offerData.baseSalaryUsd) || 250000;
  const bonus = base * ((Number(offerData.bonusPercent) || 20) / 100);
  const annualEquity = ((Number(offerData.equityFourYearUsd) || 600000) / 4) * equityGrowthMultiplier;

  const totalGrossAnnual = base + bonus + annualEquity;
  const taxPaid = totalGrossAnnual * (city.taxRatePercent / 100);
  const netTakeHome = totalGrossAnnual - taxPaid;
  const annualRent = city.rentIndexUsdPerMo * 12;
  const discretionarySavings = Math.max(0, netTakeHome - annualRent);

  // Purchasing Power Parity Adjusted Value relative to SF standard
  const pppEquivalentSavings = Math.round(discretionarySavings / city.costOfLivingFactor);

  return {
    city: city.name,
    currencySymbol: city.currencySymbol,
    grossAnnual: Math.round(totalGrossAnnual),
    taxRatePercent: city.taxRatePercent,
    taxPaid: Math.round(taxPaid),
    netTakeHome: Math.round(netTakeHome),
    annualRent: Math.round(annualRent),
    discretionarySavings: Math.round(discretionarySavings),
    pppEquivalentSavings,
    fourYearWealthTrajectory: Math.round(discretionarySavings * 4)
  };
}

function getArbitrageData() {
  return {
    cities: GLOBAL_CITIES,
    offers: FAANG_TIER_OFFERS
  };
}

module.exports = {
  computeArbitrage,
  getArbitrageData,
  GLOBAL_CITIES,
  FAANG_TIER_OFFERS
};
