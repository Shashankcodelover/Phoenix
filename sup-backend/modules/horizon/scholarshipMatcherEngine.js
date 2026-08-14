/**
 * Phoenix Apex Ultra: Feature 34 — Karnataka State Scholarship (SSP / NSP) Matcher Engine
 * 
 * Evaluates candidate caste/income/gender criteria to match high-value Karnataka State
 * Scholarship Portal (SSP) and National Scholarship Portal (NSP) schemes (₹25k - ₹75k/year).
 */

const STATE_SCHOLARSHIP_SCHEMES = [
  {
    schemeName: 'Karnataka SSP Post-Matric Scholarship (BCWD)',
    department: 'Backward Classes Welfare Department',
    annualGrantInr: 35000,
    incomeCeilingLpa: 2.5,
    applicableCategories: ['Cat-1', '2A', '2B', '3A', '3B'],
    disbursementType: 'Direct DBT Bank Transfer'
  },
  {
    schemeName: 'Social Welfare SC/ST 100% Fee Reimbursement',
    department: 'Social Welfare Department Karnataka',
    annualGrantInr: 75000,
    incomeCeilingLpa: 10.0,
    applicableCategories: ['SC', 'ST'],
    disbursementType: 'Direct College Fee Waiver + Hosteller Allowance'
  },
  {
    schemeName: 'AICTE Pragati Scholarship for Female Engineers',
    department: 'Ministry of Education & AICTE',
    annualGrantInr: 50000,
    incomeCeilingLpa: 8.0,
    applicableCategories: ['All Categories (Female Candidates)'],
    disbursementType: 'Direct DBT Bank Transfer'
  }
];

class ScholarshipMatcherEngine {
  /**
   * Matches candidate demographic profile against SSP and NSP scholarship schemes.
   */
  matchScholarships(payload = {}) {
    const {
      category = '2A',
      annualIncomeLpa = 2.0,
      gender = 'Female',
      isHosteller = true,
      isNpciBankSeeded = true
    } = payload;

    const matchedSchemes = STATE_SCHOLARSHIP_SCHEMES.filter(scheme => {
      const incomeValid = annualIncomeLpa <= scheme.incomeCeilingLpa;
      const categoryValid =
        scheme.applicableCategories.includes(category) ||
        (gender === 'Female' && scheme.schemeName.includes('Pragati')) ||
        scheme.applicableCategories.includes('All Categories (Female Candidates)');

      return incomeValid && categoryValid;
    });

    const totalEligibleGrant = matchedSchemes.reduce((sum, s) => sum + s.annualGrantInr, 0);

    return {
      success: true,
      candidateProfile: { category, annualIncomeLpa, gender, isHosteller, isNpciBankSeeded },
      totalEligibleAnnualGrantInr: `₹${totalEligibleGrant.toLocaleString('en-IN')}`,
      matchedSchemesCount: matchedSchemes.length,
      matchedSchemes,
      npciSeedingStatus: isNpciBankSeeded ? 'Verified (DBT Ready)' : 'Action Required (Seed Aadhaar at Bank)',
      mandatoryDocuments: [
        'Revenue Department (RD) Caste & Income Certificate Number',
        'Aadhaar-seeded Bank Account passbook with active NPCI mapping',
        'College Admission Fee Receipt & VTU USN / Enrollment Number',
        'Hostel Stay Certificate (if claiming hosteller maintenance allowance)'
      ]
    };
  }
}

const scholarshipMatcherEngine = new ScholarshipMatcherEngine();
module.exports = { ScholarshipMatcherEngine, scholarshipMatcherEngine, STATE_SCHOLARSHIP_SCHEMES };
