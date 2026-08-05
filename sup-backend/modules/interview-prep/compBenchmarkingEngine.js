/**
 * Phoenix v9.0: Salary & Compensation Benchmarking Engine
 * 
 * Provides compensation benchmarks, equity estimates, location multipliers,
 * and negotiation strategies for target engineering roles.
 */

const SALARY_BENCHMARKS = {
  software_engineer: {
    title: 'Software Engineer (L3 / SDE-1)',
    baseSalaryUsd: { min: 110000, median: 135000, max: 165000 },
    equityAnnualUsd: { min: 15000, median: 30000, max: 50000 },
    signingBonusUsd: { min: 10000, median: 20000, max: 35000 }
  },
  senior_software_engineer: {
    title: 'Senior Software Engineer (L5 / SDE-2)',
    baseSalaryUsd: { min: 165000, median: 195000, max: 235000 },
    equityAnnualUsd: { min: 45000, median: 80000, max: 130000 },
    signingBonusUsd: { min: 25000, median: 40000, max: 60000 }
  },
  machine_learning_engineer: {
    title: 'Machine Learning Engineer',
    baseSalaryUsd: { min: 140000, median: 175000, max: 215000 },
    equityAnnualUsd: { min: 30000, median: 60000, max: 100000 },
    signingBonusUsd: { min: 20000, median: 35000, max: 55000 }
  },
  devops_sre: {
    title: 'DevOps / Site Reliability Engineer',
    baseSalaryUsd: { min: 125000, median: 155000, max: 185000 },
    equityAnnualUsd: { min: 20000, median: 40000, max: 70000 },
    signingBonusUsd: { min: 15000, median: 25000, max: 40000 }
  }
};

const LOCATION_MULTIPLIERS = {
  us_sf_ny: { name: 'US (San Francisco / New York)', multiplier: 1.0 },
  us_remote: { name: 'US (Remote / Tier 2 Cities)', multiplier: 0.85 },
  india_tech: { name: 'India (Bangalore / NCR / Remote)', multiplier: 0.35 },
  europe: { name: 'Europe (London / Berlin / Amsterdam)', multiplier: 0.70 }
};

/**
 * Calculates compensation benchmarks and negotiation scripts.
 * 
 * @param {Object} input
 * @param {string} input.roleKey - 'software_engineer' | 'senior_software_engineer' | 'machine_learning_engineer' | 'devops_sre'
 * @param {string} input.locationKey - 'us_sf_ny' | 'us_remote' | 'india_tech' | 'europe'
 * @returns {Object} Compensation Benchmark Report
 */
function getCompensationBenchmark(input = {}) {
  const { roleKey = 'software_engineer', locationKey = 'us_sf_ny' } = input;

  const benchmark = SALARY_BENCHMARKS[roleKey.toLowerCase()] || SALARY_BENCHMARKS.software_engineer;
  const location = LOCATION_MULTIPLIERS[locationKey.toLowerCase()] || LOCATION_MULTIPLIERS.us_sf_ny;

  const m = location.multiplier;

  const adjustedBase = {
    min: Math.round(benchmark.baseSalaryUsd.min * m),
    median: Math.round(benchmark.baseSalaryUsd.median * m),
    max: Math.round(benchmark.baseSalaryUsd.max * m)
  };

  const adjustedEquity = {
    min: Math.round(benchmark.equityAnnualUsd.min * m),
    median: Math.round(benchmark.equityAnnualUsd.median * m),
    max: Math.round(benchmark.equityAnnualUsd.max * m)
  };

  const totalCompensationMedian = adjustedBase.median + adjustedEquity.median;

  return {
    roleTitle: benchmark.title,
    locationName: location.name,
    locationMultiplier: m,
    currency: 'USD',
    baseSalary: adjustedBase,
    annualEquity: adjustedEquity,
    estimatedTotalCompensationMedian: totalCompensationMedian,
    negotiationTips: [
      'Always request an initial offer breakdown separating Base, Equity (RSUs), and Sign-on Bonus.',
      'Highlight competing interview loops or market benchmark metrics to negotiate a 10-15% equity increase.',
      'If base salary is capped by pay bands, pivot negotiation focus to sign-on bonus or additional stock refresher grants.'
    ]
  };
}

module.exports = { getCompensationBenchmark, SALARY_BENCHMARKS, LOCATION_MULTIPLIERS };
