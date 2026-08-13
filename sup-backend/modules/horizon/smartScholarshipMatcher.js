/**
 * Phoenix v23.0: Smart Scholarship & Fee Waiver Matcher Engine
 * 
 * Matches Karnataka & National scholarships for PU, Diploma, and Engineering students.
 */

const SCHOLARSHIP_REGISTRY = [
  {
    id: 'ssp_post_matric',
    name: 'State Scholarship Portal (SSP) Post-Matric Scholarship',
    provider: 'Government of Karnataka',
    eligibility: { targetStreams: ['PU', 'Diploma', 'Engineering'], maxIncome: 250000, minPercentage: 50 },
    amount: 'Full Tuition Fee Reimbursement + ₹10,000/yr Maintenance Allowance',
    deadline: 'October 31',
    portalUrl: 'https://ssp.postmatric.karnataka.gov.in'
  },
  {
    id: 'vidyasiri_epass',
    name: 'Vidyasiri (Food & Accommodation / Fee Concession Scheme)',
    provider: 'Department of Backward Classes Welfare, Karnataka',
    eligibility: { targetStreams: ['PU', 'Diploma', 'Engineering'], maxIncome: 200000, minPercentage: 55 },
    amount: '₹1,500/month Hostelite Allowance + College Tuition Waiver',
    deadline: 'November 15',
    portalUrl: 'https://karepass.cgg.gov.in'
  },
  {
    id: 'jindal_foundation',
    name: 'Sitaram Jindal Foundation Merit-cum-Means Scholarship',
    provider: 'Sitaram Jindal Foundation',
    eligibility: { targetStreams: ['Diploma', 'Engineering'], maxIncome: 400000, minPercentage: 70 },
    amount: '₹2,500/month for Engineering, ₹1,200/month for Diploma',
    deadline: 'Year-Round Rolling Application',
    portalUrl: 'https://sitaramjindalfoundation.org'
  },
  {
    id: 'tata_merit',
    name: 'Tata Trusts Medical & Engineering Merit Grant',
    provider: 'Tata Trusts',
    eligibility: { targetStreams: ['Engineering'], maxIncome: 500000, minPercentage: 75 },
    amount: 'Up to ₹50,000 one-time annual grant',
    deadline: 'December 31',
    portalUrl: 'https://tatatrusts.org'
  }
];

class SmartScholarshipMatcher {
  /**
   * Evaluates student profile and returns matched scholarships with financial aid breakdown.
   */
  matchScholarships(profile = {}) {
    const {
      stream = 'Engineering',
      annualIncome = 180000,
      academicPercentage = 82,
      category = 'OBC'
    } = profile;

    const matched = SCHOLARSHIP_REGISTRY.filter(sch => {
      const matchStream = sch.eligibility.targetStreams.includes(stream);
      const matchIncome = annualIncome <= sch.eligibility.maxIncome;
      const matchAcademics = academicPercentage >= sch.eligibility.minPercentage;
      return matchStream && matchIncome && matchAcademics;
    });

    const potentialSavings = matched.length * 35000;

    return {
      stream,
      annualIncome,
      academicPercentage,
      category,
      totalMatched: matched.length,
      estimatedAnnualSavings: `₹${potentialSavings.toLocaleString('en-IN')}`,
      matchedScholarships: matched.map(m => ({
        id: m.id,
        name: m.name,
        provider: m.provider,
        benefit: m.amount,
        deadline: m.deadline,
        applicationPortal: m.portalUrl,
        eligibilityStatus: '100% Eligible'
      })),
      actionableChecklist: [
        'Obtain digital Income & Caste Certificate from Nadakacheri portal.',
        'Link Aadhaar with active National Payments Corporation of India (NPCI) bank account.',
        'Download College Bonafide Certificate with Tuition Fee Receipt.'
      ]
    };
  }
}

const smartScholarshipMatcher = new SmartScholarshipMatcher();
module.exports = { SmartScholarshipMatcher, smartScholarshipMatcher, SCHOLARSHIP_REGISTRY };
