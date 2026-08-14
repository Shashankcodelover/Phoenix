/**
 * Phoenix Apex Ultra: Feature 36 — Management Quota Fee & 4-Year COA Forecaster Engine
 * 
 * Accurately models institutional donation, annual tuition, Bangalore living expenses,
 * and post-graduation salary ROI payback periods for Karnataka private engineering colleges.
 */

const MANAGEMENT_QUOTA_COLLEGES = [
  {
    collegeCode: 'RVCE',
    collegeName: 'R.V. College of Engineering, Bangalore',
    branch: 'CSE',
    oneTimeDonationInr: 2000000,
    annualTuitionInr: 450000,
    annualLivingExpensesInr: 180000,
    avgPlacementPackageLpa: 16.5
  },
  {
    collegeCode: 'BMSCE',
    collegeName: 'B.M.S. College of Engineering, Basavanagudi',
    branch: 'CSE',
    oneTimeDonationInr: 1600000,
    annualTuitionInr: 350000,
    annualLivingExpensesInr: 160000,
    avgPlacementPackageLpa: 14.0
  },
  {
    collegeCode: 'PESU',
    collegeName: 'PES University, Ring Road Campus',
    branch: 'CSE',
    oneTimeDonationInr: 1200000,
    annualTuitionInr: 480000,
    annualLivingExpensesInr: 190000,
    avgPlacementPackageLpa: 15.2
  }
];

class ManagementQuotaFeeEngine {
  /**
   * Calculates 4-year Total Cost of Attendance (COA) and estimated ROI payback period.
   */
  calculateCostOfAttendance(payload = {}) {
    const { collegeCode = 'RVCE' } = payload;
    const college = MANAGEMENT_QUOTA_COLLEGES.find(c => c.collegeCode === collegeCode) || MANAGEMENT_QUOTA_COLLEGES[0];

    const fourYearTuition = college.annualTuitionInr * 4;
    const fourYearLiving = college.annualLivingExpensesInr * 4;
    const totalInvestmentInr = college.oneTimeDonationInr + fourYearTuition + fourYearLiving;

    // Net annual savings post-tax assumption (60% of gross placement)
    const annualNetSavings = (college.avgPlacementPackageLpa * 100000) * 0.6;
    const paybackYears = (totalInvestmentInr / annualNetSavings).toFixed(1);

    return {
      success: true,
      collegeName: college.collegeName,
      branch: college.branch,
      breakdown: {
        oneTimeInstitutionalDonation: `₹${college.oneTimeDonationInr.toLocaleString('en-IN')}`,
        fourYearTuitionFee: `₹${fourYearTuition.toLocaleString('en-IN')} (₹${(college.annualTuitionInr / 100000).toFixed(1)}L/yr)`,
        fourYearLivingAndHostel: `₹${fourYearLiving.toLocaleString('en-IN')} (₹${(college.annualLivingExpensesInr / 100000).toFixed(1)}L/yr)`,
        totalCostOfAttendance: `₹${totalInvestmentInr.toLocaleString('en-IN')}`
      },
      roiAnalysis: {
        avgPlacementPackageLpa: `${college.avgPlacementPackageLpa} LPA`,
        estimatedPaybackPeriodYears: `${paybackYears} Years`,
        investmentVerdict: parseFloat(paybackYears) <= 5.0 ? 'High ROI (Tier-1 Tier Return)' : 'Moderate ROI'
      }
    };
  }
}


const managementQuotaFeeEngine = new ManagementQuotaFeeEngine();
module.exports = { ManagementQuotaFeeEngine, managementQuotaFeeEngine, MANAGEMENT_QUOTA_COLLEGES };
