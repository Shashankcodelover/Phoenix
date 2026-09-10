/**
 * Phoenix Tri-Pillar OS: Pillar 2, Feature 34 — Unit Economics & Monetization Model Sandbox
 * 
 * Provides an institutional SaaS financial model simulating pricing tiers, COGS (AI inference + cloud),
 * CAC payback periods, LTV/CAC ratios, and 12-month MRR/ARR projections for seed-stage investors.
 */

const PRESETS = {
  aegis: {
    id: 'aegis',
    name: 'Aegis Swarm (Hardware-Enabled SaaS / Municipal B2G)',
    projectTitle: 'Aegis Swarm',
    modelType: 'Hybrid B2B / B2G Municipal Subscription',
    pricing: {
      proPrice: 199,              // Professional Station / mo
      enterpriseAnnual: 36000,    // Municipal Fleet Deployment / yr
      setupFee: 5000
    },
    volume: {
      activeUsers: 2400,
      proConversionPct: 6.0,      // 144 stations
      enterpriseClients: 12       // 12 municipal contracts
    },
    costs: {
      aiCostPerUser: 4.50,        // Spatial edge inference + satellite relay bandwidth
      cloudInfraPerUser: 1.80,    // CockroachDB + Redis telemetry cluster
      cac: 420,                   // Field sales & municipal procurement cost
      monthlyChurnPct: 1.5        // Low government churn
    }
  },
  oncomatch: {
    id: 'oncomatch',
    name: 'OncoMatch ZK (B2B Life Sciences / Clinical Trial Protocol)',
    projectTitle: 'OncoMatch ZK',
    modelType: 'Enterprise Life-Sciences SaaS + Per-Match Escrow',
    pricing: {
      proPrice: 499,              // Hospital Oncology Department / mo
      enterpriseAnnual: 75000,    // Pharma Global Trial Pipeline / yr
      setupFee: 15000
    },
    volume: {
      activeUsers: 1200,
      proConversionPct: 8.5,      // 102 hospital clinics
      enterpriseClients: 6        // 6 pharma sponsors
    },
    costs: {
      aiCostPerUser: 8.20,        // Gemini 2.5 Pro medical extraction + zk-SNARK verifier
      cloudInfraPerUser: 3.50,    // High-compliance HIPAA enclave hosting
      cac: 950,                   // Enterprise medical sales cycle
      monthlyChurnPct: 1.2        // Extremely sticky institutional retention
    }
  },
  nexusaudio: {
    id: 'nexusaudio',
    name: 'NexusAudio AI (B2C Prosumer + B2B University Licensing)',
    projectTitle: 'NexusAudio AI',
    modelType: 'Dual-Engine Prosumer Subscription & University Placement B2B',
    pricing: {
      proPrice: 29,               // Individual Pro candidate / mo
      enterpriseAnnual: 18000,    // College Placement Cell licensing / yr
      setupFee: 1000
    },
    volume: {
      activeUsers: 8500,
      proConversionPct: 5.2,      // 442 paying engineers
      enterpriseClients: 15       // 15 engineering universities
    },
    costs: {
      aiCostPerUser: 0.95,        // Voice streaming chunk inference + AST parsing
      cloudInfraPerUser: 0.35,    // WebRTC turn servers + Redis
      cac: 28,                    // Campus ambassador & viral word-of-mouth
      monthlyChurnPct: 4.8        // Normal educational student lifecycle
    }
  }
};

class UnitEconomicsEngine {
  getPresets() {
    return PRESETS;
  }

  calculateEconomics(payload = {}) {
    const {
      projectTitle = 'Aegis Swarm',
      modelType = 'B2B Enterprise SaaS',
      pricing = {
        proPrice: 199,
        enterpriseAnnual: 36000,
        setupFee: 5000
      },
      volume = {
        activeUsers: 2400,
        proConversionPct: 6.0,
        enterpriseClients: 12
      },
      costs = {
        aiCostPerUser: 4.50,
        cloudInfraPerUser: 1.80,
        cac: 420,
        monthlyChurnPct: 1.5
      }
    } = payload;

    const proP = Math.max(1, Number(pricing.proPrice) || 29);
    const entP = Math.max(100, Number(pricing.enterpriseAnnual) || 12000);
    const entMonthly = entP / 12;

    const totalUsers = Math.max(10, Number(volume.activeUsers) || 1000);
    const convPct = Math.min(100, Math.max(0.1, Number(volume.proConversionPct) || 5.0));
    const proPayingUsers = Math.round(totalUsers * (convPct / 100));
    const entClients = Math.max(0, Number(volume.enterpriseClients) || 5);

    const proMrr = proPayingUsers * proP;
    const entMrr = entClients * entMonthly;
    const totalMrr = Math.round(proMrr + entMrr);
    const arr = Math.round(totalMrr * 12);

    const aiCost = Math.max(0.01, Number(costs.aiCostPerUser) || 1.0);
    const cloudCost = Math.max(0.01, Number(costs.cloudInfraPerUser) || 0.5);
    const totalMonthlyCogs = Math.round(totalUsers * (aiCost + cloudCost));
    const grossProfit = Math.max(0, totalMrr - totalMonthlyCogs);
    const grossMarginPct = Number(((grossProfit / (totalMrr || 1)) * 100).toFixed(1));

    const totalPayingAccounts = proPayingUsers + entClients;
    const arpuMonthly = totalPayingAccounts > 0 ? Number((totalMrr / totalPayingAccounts).toFixed(2)) : proP;

    const churnPct = Math.min(50, Math.max(0.5, Number(costs.monthlyChurnPct) || 3.0));
    const churnDecimal = churnPct / 100;
    const grossMarginDecimal = grossMarginPct / 100;

    // LTV = (ARPU * Gross Margin) / Churn Rate
    const ltv = Math.round((arpuMonthly * grossMarginDecimal) / churnDecimal);

    const cac = Math.max(1, Number(costs.cac) || 50);
    const ltvCacRatio = Number((ltv / cac).toFixed(1));

    // Payback Months = CAC / (ARPU * Gross Margin)
    const paybackMonths = Number((cac / ((arpuMonthly * grossMarginDecimal) || 1)).toFixed(1));

    // 12-Month Projections Table
    const monthlyRunway = [];
    let currentUsers = totalUsers;
    for (let m = 1; m <= 12; m++) {
      const growthRate = 1 + (0.12 - (m * 0.003)); // decelerating healthy growth
      currentUsers = Math.round(currentUsers * growthRate);
      const mProUsers = Math.round(currentUsers * (convPct / 100));
      const mEntClients = Math.round(entClients * (1 + (m * 0.08)));
      const mMrr = Math.round((mProUsers * proP) + (mEntClients * entMonthly));
      const mCogs = Math.round(currentUsers * (aiCost + cloudCost));
      const mGross = Math.round(mMrr - mCogs);
      monthlyRunway.push({
        month: `Month ${m}`,
        users: currentUsers,
        payingAccounts: mProUsers + mEntClients,
        mrr: `$${mMrr.toLocaleString()}`,
        cogs: `$${mCogs.toLocaleString()}`,
        grossProfit: `$${mGross.toLocaleString()}`,
        margin: `${Math.round((mGross / (mMrr || 1)) * 100)}%`
      });
    }

    // Venture Readiness Rating
    let ventureRating = 'Solid Seed Contender';
    if (ltvCacRatio >= 4.0 && grossMarginPct >= 75 && paybackMonths <= 8) {
      ventureRating = 'Tier-1 Venture Quality (Top 1% Metric Profile)';
    } else if (ltvCacRatio >= 3.0 && grossMarginPct >= 65) {
      ventureRating = 'Strong Venture Scalability Profile';
    }

    return {
      success: true,
      projectTitle,
      modelType,
      summary: {
        totalMrr: `$${totalMrr.toLocaleString()}`,
        projectedArr: `$${arr.toLocaleString()}`,
        grossProfitMonthly: `$${grossProfit.toLocaleString()}`,
        grossMargin: `${grossMarginPct}%`,
        arpu: `$${arpuMonthly} / mo`,
        ltv: `$${ltv.toLocaleString()}`,
        cac: `$${cac}`,
        ltvCacRatio: `${ltvCacRatio}x`,
        paybackMonths: `${paybackMonths} months`,
        ventureRating
      },
      tiers: {
        pro: {
          price: `$${proP}/mo`,
          subscribers: proPayingUsers,
          monthlyRevenue: `$${Math.round(proMrr).toLocaleString()}`
        },
        enterprise: {
          contractValue: `$${entP.toLocaleString()}/yr`,
          clients: entClients,
          monthlyRevenue: `$${Math.round(entMrr).toLocaleString()}`
        }
      },
      costBreakdown: {
        totalCogs: `$${totalMonthlyCogs.toLocaleString()}/mo`,
        aiCost: `$${Math.round(totalUsers * aiCost).toLocaleString()}/mo (${Math.round((aiCost / (aiCost + cloudCost)) * 100)}%)`,
        cloudCost: `$${Math.round(totalUsers * cloudCost).toLocaleString()}/mo (${Math.round((cloudCost / (aiCost + cloudCost)) * 100)}%)`
      },
      projections12Month: monthlyRunway
    };
  }
}

const unitEconomicsEngine = new UnitEconomicsEngine();
module.exports = { UnitEconomicsEngine, unitEconomicsEngine };
