/**
 * Phoenix Tri-Pillar OS: Pillar 3, Feature 42 — Institutional Tier & Accreditation Matrix
 * 
 * Comprehensive institutional accreditation, NIRF score breakdown, and financial ROI yield
 * calculation engine.
 * 
 * Capabilities:
 * 1. Multi-Accreditation Auditing (NAAC A++, NBA Tier-1 Washington Accord, ABET, NIRF)
 * 2. 5-Pillar NIRF Metric Decomposition (TLR, RPC, GO, OI, PR)
 * 3. 4-Year Tuition vs. Median CTC ROI Yield & Payback Forecaster
 * 4. Institutional Quality Index (IQI) Algorithm (0-100 composite quality score)
 * 5. Head-to-Head Institutional Comparator
 */

const crypto = require('crypto');

const INSTITUTION_MATRIX = [
  {
    code: 'IITB',
    name: 'Indian Institute of Technology Bombay (IIT Bombay)',
    city: 'Mumbai',
    state: 'Maharashtra',
    tierCategory: 'Tier-1 National Apex',
    type: 'Institute of National Importance',
    nirfRank: 3,
    overallNirfScore: 83.2,
    nirfBreakdown: {
      tlr: 88.5, // Teaching, Learning & Resources
      rpc: 84.1, // Research & Professional Practice
      go: 92.4,  // Graduation Outcomes
      oi: 68.2,  // Outreach & Inclusivity
      pr: 87.0   // Perception
    },
    accreditations: {
      naac: 'A++ (Score: 3.82/4.0)',
      nba: 'Tier-1 (Washington Accord Substantial Equivalence)',
      abet: 'Accredited (Select Departments)',
      autonomy: 'Autonomous Central Institute'
    },
    financials: {
      fourYearTuitionInr: 950000,
      hostelFourYearsInr: 240000,
      totalCostInr: 1190000,
      avgPackageLpa: 24.5,
      medianPackageLpa: 20.0,
      highestDomesticLpa: 168.0,
      placementPercentage: 96.2
    }
  },
  {
    code: 'NITK',
    name: 'National Institute of Technology Karnataka (NITK Surathkal)',
    city: 'Surathkal, Mangalore',
    state: 'Karnataka',
    tierCategory: 'Tier-1 National Apex',
    type: 'Institute of National Importance (NIT)',
    nirfRank: 12,
    overallNirfScore: 65.8,
    nirfBreakdown: {
      tlr: 72.4,
      rpc: 58.2,
      go: 86.5,
      oi: 62.1,
      pr: 54.0
    },
    accreditations: {
      naac: 'A+ (Grade 3.48)',
      nba: 'Tier-1 Permanent (All Engineering Branches)',
      abet: 'Eligible',
      autonomy: 'Autonomous Central NIT'
    },
    financials: {
      fourYearTuitionInr: 580000,
      hostelFourYearsInr: 220000,
      totalCostInr: 800000,
      avgPackageLpa: 18.2,
      medianPackageLpa: 15.0,
      highestDomesticLpa: 54.0,
      placementPercentage: 93.8
    }
  },
  {
    code: 'IIITB',
    name: 'International Institute of Information Technology Bangalore',
    city: 'Bengaluru',
    state: 'Karnataka',
    tierCategory: 'Tier-1 Premier Specialised',
    type: 'Deemed to be University (PPP Model)',
    nirfRank: 74,
    overallNirfScore: 48.9,
    nirfBreakdown: {
      tlr: 64.0,
      rpc: 42.1,
      go: 88.2,
      oi: 45.0,
      pr: 46.5
    },
    accreditations: {
      naac: 'A+ (Score: 3.53)',
      nba: 'Accredited (CSE & ECE)',
      abet: 'Specialized Tech Recognized',
      autonomy: 'Deemed Autonomous'
    },
    financials: {
      fourYearTuitionInr: 1600000,
      hostelFourYearsInr: 320000,
      totalCostInr: 1920000,
      avgPackageLpa: 26.4,
      medianPackageLpa: 24.0,
      highestDomesticLpa: 65.0,
      placementPercentage: 98.4
    }
  },
  {
    code: 'RVCE',
    name: 'RV College of Engineering (RVCE Bengaluru)',
    city: 'Bengaluru',
    state: 'Karnataka',
    tierCategory: 'Tier-1 State Premier Autonomous',
    type: 'Private Autonomous Affiliated to VTU',
    nirfRank: 89,
    overallNirfScore: 46.7,
    nirfBreakdown: {
      tlr: 58.2,
      rpc: 36.8,
      go: 84.1,
      oi: 52.0,
      pr: 47.0
    },
    accreditations: {
      naac: 'A+ (Score: 3.42)',
      nba: 'Tier-1 Accredited (All UG Engineering Programs)',
      abet: 'Candidate Status',
      autonomy: 'Autonomous Institution under VTU'
    },
    financials: {
      fourYearTuitionInr: 450000, // KCET Government Quota (COMEDK is ~14.5L)
      hostelFourYearsInr: 280000,
      totalCostInr: 730000,
      avgPackageLpa: 14.8,
      medianPackageLpa: 12.0,
      highestDomesticLpa: 62.0,
      placementPercentage: 94.5
    }
  },
  {
    code: 'BMSCE',
    name: 'BMS College of Engineering, Basavanagudi',
    city: 'Bengaluru',
    state: 'Karnataka',
    tierCategory: 'Tier-1 State Premier Autonomous',
    type: 'Private Aided Autonomous',
    nirfRank: 101,
    overallNirfScore: 44.2,
    nirfBreakdown: {
      tlr: 56.4,
      rpc: 32.1,
      go: 80.5,
      oi: 51.2,
      pr: 42.0
    },
    accreditations: {
      naac: 'A++ (Score: 3.83 Highest in Karnataka)',
      nba: 'Tier-1 Accredited (Major Branches)',
      abet: 'N/A',
      autonomy: 'Autonomous Institution'
    },
    financials: {
      fourYearTuitionInr: 450000,
      hostelFourYearsInr: 260000,
      totalCostInr: 710000,
      avgPackageLpa: 12.4,
      medianPackageLpa: 10.0,
      highestDomesticLpa: 50.0,
      placementPercentage: 89.2
    }
  },
  {
    code: 'UVCE',
    name: 'University Visvesvaraya College of Engineering (UVCE Bengaluru)',
    city: 'Bengaluru',
    state: 'Karnataka',
    tierCategory: 'Government Heritage IIT-Model',
    type: 'State Autonomous Institute of Eminence',
    nirfRank: 125,
    overallNirfScore: 41.5,
    nirfBreakdown: {
      tlr: 52.0,
      rpc: 24.5,
      go: 78.4,
      oi: 58.0,
      pr: 45.0
    },
    accreditations: {
      naac: 'A Grade',
      nba: 'Accredited',
      abet: 'N/A',
      autonomy: 'Autonomous State University on IIT Model'
    },
    financials: {
      fourYearTuitionInr: 120000, // Government nominal fees
      hostelFourYearsInr: 140000,
      totalCostInr: 260000,
      avgPackageLpa: 10.2,
      medianPackageLpa: 8.5,
      highestDomesticLpa: 48.0,
      placementPercentage: 86.5
    }
  }
];

class InstitutionalTierMatrixEngine {
  constructor() {
    this.matrix = INSTITUTION_MATRIX;
  }

  getCatalog() {
    return this.matrix.map(inst => {
      const roi = this.calculateRoiMetrics(inst);
      return {
        code: inst.code,
        name: inst.name,
        city: inst.city,
        tierCategory: inst.tierCategory,
        type: inst.type,
        nirfRank: inst.nirfRank,
        overallNirfScore: inst.overallNirfScore,
        naac: inst.accreditations.naac,
        nba: inst.accreditations.nba,
        totalCostInr: inst.financials.totalCostInr,
        medianPackageLpa: inst.financials.medianPackageLpa,
        roiYear1Percent: roi.roiYear1Percent,
        paybackMonths: roi.paybackMonths,
        institutionalQualityIndex: roi.institutionalQualityIndex
      };
    });
  }

  getInstitution(code) {
    const inst = this.matrix.find(i => i.code.toUpperCase() === code.toUpperCase());
    if (!inst) {
      throw new Error(`Institution code "${code}" not found.`);
    }
    const roi = this.calculateRoiMetrics(inst);
    return {
      success: true,
      institution: inst,
      roiMetrics: roi
    };
  }

  calculateRoiMetrics(inst, customTuitionInr = null) {
    const totalCost = customTuitionInr !== null ? Number(customTuitionInr) : inst.financials.totalCostInr;
    const medianAnnualSalary = inst.financials.medianPackageLpa * 100000;

    // ROI Year 1 (% of total degree cost earned in Year 1 gross salary)
    const roiYear1Percent = Math.round((medianAnnualSalary / totalCost) * 100);

    // Payback period in months (assumes 65% in-hand after taxes & basic living expenses allocated to debt)
    const annualNetSavings = medianAnnualSalary * 0.65;
    const paybackYears = Math.round((totalCost / annualNetSavings) * 100) / 100;
    const paybackMonths = Math.round(paybackYears * 12);

    // 10-year cumulative net earnings (assuming 10% annual salary growth)
    let cumulative10YearGross = 0;
    let currentSalary = medianAnnualSalary;
    for (let i = 0; i < 10; i++) {
      cumulative10YearGross += currentSalary;
      currentSalary *= 1.10;
    }
    const tenYearNetWealthInr = Math.round(cumulative10YearGross - totalCost);

    // Institutional Quality Index (IQI): 0 to 100
    // Weighted formula: Graduation Outcomes (35%) + Research (25%) + TLR (20%) + Perception (10%) + ROI Multiplier (10%)
    const b = inst.nirfBreakdown;
    const rawIqi = (b.go * 0.35) + (b.rpc * 0.25) + (b.tlr * 0.20) + (b.pr * 0.10) + (Math.min(100, roiYear1Percent * 0.3) * 0.10);
    const institutionalQualityIndex = Math.round(rawIqi * 10) / 10;

    return {
      totalCostInr: totalCost,
      medianAnnualSalaryInr: medianAnnualSalary,
      roiYear1Percent,
      paybackYears,
      paybackMonths,
      tenYearNetWealthInr,
      institutionalQualityIndex,
      verdict: roiYear1Percent >= 200 ? 'Exceptional High-Yield ROI (>200%)' : roiYear1Percent >= 100 ? 'Solid Tier-1 Investment (100-200%)' : 'Moderate Capital Yield'
    };
  }

  compareInstitutions(codeList = ['RVCE', 'BMSCE']) {
    const validCodes = codeList.map(c => c.toUpperCase());
    const selected = this.matrix.filter(i => validCodes.includes(i.code));

    if (selected.length < 2) {
      throw new Error('Please provide at least 2 valid institution codes to compare.');
    }

    const comparisons = selected.map(inst => ({
      code: inst.code,
      name: inst.name,
      tier: inst.tierCategory,
      nirfRank: inst.nirfRank,
      naac: inst.accreditations.naac,
      nba: inst.accreditations.nba,
      totalCostInr: inst.financials.totalCostInr,
      avgPackageLpa: inst.financials.avgPackageLpa,
      medianPackageLpa: inst.financials.medianPackageLpa,
      roi: this.calculateRoiMetrics(inst)
    }));

    // Find winner by Institutional Quality Index and by ROI
    const sortedByIqi = [...comparisons].sort((a, b) => b.roi.institutionalQualityIndex - a.roi.institutionalQualityIndex);
    const sortedByRoi = [...comparisons].sort((a, b) => b.roi.roiYear1Percent - a.roi.roiYear1Percent);

    return {
      success: true,
      comparedCount: comparisons.length,
      institutions: comparisons,
      analysis: {
        academicQualityWinner: sortedByIqi[0].name,
        financialRoiWinner: sortedByRoi[0].name,
        recommendation: `${sortedByIqi[0].name} leads on overall research and graduation outcomes, while ${sortedByRoi[0].name} provides maximum financial return per rupee invested.`
      }
    };
  }
}

const institutionalTierMatrixEngine = new InstitutionalTierMatrixEngine();
module.exports = { InstitutionalTierMatrixEngine, institutionalTierMatrixEngine, INSTITUTION_MATRIX };
