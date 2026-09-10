/**
 * Feature 58: Salary Purchasing Power & Relocation Comparator (PPP Cost-of-Living Engine)
 * Converts nominal salary offers into real Purchasing Power Parity (PPP) adjusted income,
 * accounting for local income tax brackets, rent indexes, healthcare, and savings potential
 * across major global tech hubs (Bengaluru, Hyderabad, San Francisco, Seattle, London, Munich).
 */

const TECH_HUB_METRICS = {
  BENGALURU: {
    code: 'BENGALURU',
    city: 'Bengaluru',
    country: 'India',
    currency: 'INR',
    fxToUsd: 0.0116, // 1 USD ~ 86 INR
    pppFactorVsUsd: 3.42, // World Bank PPP factor: $1 USD buys equivalent of ~3.42 USD goods in India
    costOfLivingIndex: 28.5, // Base NYC = 100
    rentIndex: 12.4,
    avgTechIncomeTaxPct: 22.0,
    median1BedRentUsd: 420,
    sampleCompanyOffers: [
      { role: 'SDE 1 (Product Unicorn)', nominalLpa: 28.0, bonusLpa: 4.0 },
      { role: 'Member Technical Staff (FAANG)', nominalLpa: 45.0, bonusLpa: 8.0 }
    ]
  },
  HYDERABAD: {
    code: 'HYDERABAD',
    city: 'Hyderabad',
    country: 'India',
    currency: 'INR',
    fxToUsd: 0.0116,
    pppFactorVsUsd: 3.55,
    costOfLivingIndex: 26.2,
    rentIndex: 10.8,
    avgTechIncomeTaxPct: 20.5,
    median1BedRentUsd: 360,
    sampleCompanyOffers: [
      { role: 'Software Engineer (Enterprise)', nominalLpa: 22.0, bonusLpa: 3.0 },
      { role: 'Cloud Systems Engineer', nominalLpa: 36.0, bonusLpa: 5.0 }
    ]
  },
  SAN_FRANCISCO: {
    code: 'SAN_FRANCISCO',
    city: 'San Francisco (Bay Area)',
    country: 'United States',
    currency: 'USD',
    fxToUsd: 1.0,
    pppFactorVsUsd: 1.0,
    costOfLivingIndex: 96.4,
    rentIndex: 82.5,
    avgTechIncomeTaxPct: 37.5, // Federal + CA State + FICA
    median1BedRentUsd: 3100,
    sampleCompanyOffers: [
      { role: 'L4 Software Engineer (Big Tech)', nominalLpa: 175000, bonusLpa: 35000 },
      { role: 'Full Stack Engineer (Series B)', nominalLpa: 145000, bonusLpa: 15000 }
    ]
  },
  SEATTLE: {
    code: 'SEATTLE',
    city: 'Seattle (WA)',
    country: 'United States',
    currency: 'USD',
    fxToUsd: 1.0,
    pppFactorVsUsd: 1.05,
    costOfLivingIndex: 85.2,
    rentIndex: 64.8,
    avgTechIncomeTaxPct: 26.0, // No state income tax in WA
    median1BedRentUsd: 2200,
    sampleCompanyOffers: [
      { role: 'SDE 2 (Cloud / Big Tech)', nominalLpa: 165000, bonusLpa: 30000 },
      { role: 'Backend Engineer', nominalLpa: 140000, bonusLpa: 18000 }
    ]
  },
  LONDON: {
    code: 'LONDON',
    city: 'London',
    country: 'United Kingdom',
    currency: 'GBP',
    fxToUsd: 1.28,
    pppFactorVsUsd: 1.15,
    costOfLivingIndex: 82.0,
    rentIndex: 68.2,
    avgTechIncomeTaxPct: 34.0,
    median1BedRentUsd: 2450,
    sampleCompanyOffers: [
      { role: 'Software Engineer (FinTech)', nominalLpa: 85000, bonusLpa: 12000 },
      { role: 'Senior SDE (Global Tech)', nominalLpa: 115000, bonusLpa: 20000 }
    ]
  },
  MUNICH: {
    code: 'MUNICH',
    city: 'Munich',
    country: 'Germany',
    currency: 'EUR',
    fxToUsd: 1.08,
    pppFactorVsUsd: 1.12,
    costOfLivingIndex: 74.5,
    rentIndex: 48.6,
    avgTechIncomeTaxPct: 41.0, // Solidarität + Krankenkasse + Pension
    median1BedRentUsd: 1650,
    sampleCompanyOffers: [
      { role: 'Software Developer (Automotive)', nominalLpa: 72000, bonusLpa: 8000 },
      { role: 'Robotics Engineer', nominalLpa: 88000, bonusLpa: 10000 }
    ]
  }
};

const RELOCATION_PRESETS = [
  {
    id: 'blr_to_bayarea',
    label: 'Bengaluru (₹35 LPA) ➔ San Francisco ($180,000 USD)',
    sourceHub: 'BENGALURU',
    sourceSalaryLocal: 3500000,
    targetHub: 'SAN_FRANCISCO',
    targetSalaryLocal: 180000
  },
  {
    id: 'blr_to_seattle',
    label: 'Bengaluru (₹30 LPA) ➔ Seattle ($165,000 USD - No State Tax)',
    sourceHub: 'BENGALURU',
    sourceSalaryLocal: 3000000,
    targetHub: 'SEATTLE',
    targetSalaryLocal: 165000
  },
  {
    id: 'blr_to_london',
    label: 'Bengaluru (₹28 LPA) ➔ London (£85,000 GBP FinTech)',
    sourceHub: 'BENGALURU',
    sourceSalaryLocal: 2800000,
    targetHub: 'LONDON',
    targetSalaryLocal: 85000
  },
  {
    id: 'hyd_to_munich',
    label: 'Hyderabad (₹24 LPA) ➔ Munich (€75,000 EUR Auto Tech)',
    sourceHub: 'HYDERABAD',
    sourceSalaryLocal: 2400000,
    targetHub: 'MUNICH',
    targetSalaryLocal: 75000
  }
];

class SalaryPppRelocationEngine {
  getTechHubs() {
    return Object.values(TECH_HUB_METRICS);
  }

  getPresets() {
    return RELOCATION_PRESETS;
  }

  /**
   * Compares compensation offers between two tech hubs in PPP terms.
   */
  compareRelocationOffer(params) {
    const {
      sourceHubCode = 'BENGALURU',
      sourceSalaryLocal = 3000000,
      targetHubCode = 'SAN_FRANCISCO',
      targetSalaryLocal = 175000
    } = params;

    const sourceHub = TECH_HUB_METRICS[sourceHubCode] || TECH_HUB_METRICS.BENGALURU;
    const targetHub = TECH_HUB_METRICS[targetHubCode] || TECH_HUB_METRICS.SAN_FRANCISCO;

    // Convert source to USD nominal
    let sourceUsdNominal = 0;
    if (sourceHub.currency === 'INR') sourceUsdNominal = sourceSalaryLocal / 86.0;
    else if (sourceHub.currency === 'GBP') sourceUsdNominal = sourceSalaryLocal * 1.28;
    else if (sourceHub.currency === 'EUR') sourceUsdNominal = sourceSalaryLocal * 1.08;
    else sourceUsdNominal = sourceSalaryLocal;

    // Convert target to USD nominal
    let targetUsdNominal = 0;
    if (targetHub.currency === 'INR') targetUsdNominal = targetSalaryLocal / 86.0;
    else if (targetHub.currency === 'GBP') targetUsdNominal = targetSalaryLocal * 1.28;
    else if (targetHub.currency === 'EUR') targetUsdNominal = targetSalaryLocal * 1.08;
    else targetUsdNominal = targetSalaryLocal;

    // Calculate post-tax net income in USD
    const sourceNetUsd = sourceUsdNominal * (1 - sourceHub.avgTechIncomeTaxPct / 100);
    const targetNetUsd = targetUsdNominal * (1 - targetHub.avgTechIncomeTaxPct / 100);

    // Annual Rent Expense USD
    const sourceAnnualRentUsd = sourceHub.median1BedRentUsd * 12;
    const targetAnnualRentUsd = targetHub.median1BedRentUsd * 12;

    // Discretionary Annual Savings USD (Net - Rent - Basic Living)
    const sourceAnnualSavingsUsd = Math.max(0, sourceNetUsd - sourceAnnualRentUsd - (sourceHub.costOfLivingIndex * 180));
    const targetAnnualSavingsUsd = Math.max(0, targetNetUsd - targetAnnualRentUsd - (targetHub.costOfLivingIndex * 180));

    // PPP Equivalent Salary: Target salary required in source city to maintain same standard of living
    // Ratio = (Target CoL + Rent) / (Source CoL + Rent)
    const sourceComposite = sourceHub.costOfLivingIndex + sourceHub.rentIndex;
    const targetComposite = targetHub.costOfLivingIndex + targetHub.rentIndex;
    const pppMultiplicationRatio = parseFloat((targetComposite / Math.max(1, sourceComposite)).toFixed(2));

    const equivalentSourceSalaryUsd = (targetUsdNominal / pppMultiplicationRatio);
    let equivalentSourceSalaryLocal = equivalentSourceSalaryUsd;
    if (sourceHub.currency === 'INR') equivalentSourceSalaryLocal = equivalentSourceSalaryUsd * 86.0;
    else if (sourceHub.currency === 'GBP') equivalentSourceSalaryLocal = equivalentSourceSalaryUsd / 1.28;
    else if (sourceHub.currency === 'EUR') equivalentSourceSalaryLocal = equivalentSourceSalaryUsd / 1.08;

    const realWealthGrowthFactor = parseFloat((targetAnnualSavingsUsd / Math.max(1, sourceAnnualSavingsUsd)).toFixed(2));

    let verdict = 'NEUTRAL EXPENSE GAIN';
    if (realWealthGrowthFactor >= 1.7) {
      verdict = 'HIGH REAL WEALTH ACCUMULATION';
    } else if (realWealthGrowthFactor < 0.9) {
      verdict = 'PURCHASING POWER EROSION (HIGH LOCAL RENT/TAX)';
    }

    return {
      source: {
        city: sourceHub.city,
        currency: sourceHub.currency,
        salaryLocal: sourceSalaryLocal,
        usdNominal: Math.round(sourceUsdNominal),
        netAnnualUsd: Math.round(sourceNetUsd),
        annualRentUsd: sourceAnnualRentUsd,
        estimatedAnnualSavingsUsd: Math.round(sourceAnnualSavingsUsd)
      },
      target: {
        city: targetHub.city,
        currency: targetHub.currency,
        salaryLocal: targetSalaryLocal,
        usdNominal: Math.round(targetUsdNominal),
        netAnnualUsd: Math.round(targetNetUsd),
        annualRentUsd: targetAnnualRentUsd,
        estimatedAnnualSavingsUsd: Math.round(targetAnnualSavingsUsd)
      },
      pppComparison: {
        costOfLivingRatio: pppMultiplicationRatio,
        targetEquivalentInSourceLocal: Math.round(equivalentSourceSalaryLocal),
        realWealthGrowthFactor,
        verdict,
        breakdownNotes: [
          `${targetHub.city} cost of living is ${pppMultiplicationRatio}x of ${sourceHub.city}.`,
          `Effective income tax rate: ${sourceHub.avgTechIncomeTaxPct}% in ${sourceHub.city} vs ${targetHub.avgTechIncomeTaxPct}% in ${targetHub.city}.`,
          `Annual median 1-bedroom rent: $${sourceAnnualRentUsd.toLocaleString()} vs $${targetAnnualRentUsd.toLocaleString()} USD.`
        ]
      }
    };
  }
}

const salaryPppRelocationEngine = new SalaryPppRelocationEngine();

module.exports = {
  SalaryPppRelocationEngine,
  salaryPppRelocationEngine
};
