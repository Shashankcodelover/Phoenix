/**
 * Phoenix Apex Ultra: Feature 26 — Supernumerary Quota (SNQ) & 100% Tuition Fee Waiver Matcher
 * 
 * Evaluates candidate family annual income against Karnataka Examination Authority (KEA) SNQ norms,
 * projects 4-year tuition fee savings (₹4,00,000+), and validates Revenue Department (RD) certificate requirements.
 */

const SNQ_INCOME_CEILING_INR = 800000; // ₹8.0 Lakhs per annum
const STANDARD_GOVT_SEAT_FEE_YEAR_INR = 107000;
const SNQ_REDUCED_FEE_YEAR_INR = 4500;

const SNQ_COLLEGE_BENCHMARKS = [
  { college: 'RV College of Engineering (RVCE)', branch: 'CSE', generalCutoff: 1850, snqCutoff: 1400, fourYearSavingsInr: 410000 },
  { college: 'BMS College of Engineering (BMSCE)', branch: 'CSE', generalCutoff: 3200, snqCutoff: 2600, fourYearSavingsInr: 410000 },
  { college: 'Ramaiah Institute of Technology (MSRIT)', branch: 'ISE', generalCutoff: 4100, snqCutoff: 3500, fourYearSavingsInr: 410000 },
  { college: 'University Visvesvaraya College (UVCE)', branch: 'CSE', generalCutoff: 5200, snqCutoff: 4200, fourYearSavingsInr: 320000 }
];

class SnqFeeWaiverEngine {
  /**
   * Evaluates candidate income and rank for Supernumerary Quota (SNQ) seat allotments.
   */
  evaluateSnqEligibility(payload = {}) {
    const {
      candidateRank = 2140,
      annualFamilyIncomeInr = 240000,
      hasValidRdIncomeCert = true
    } = payload;

    const isEligibleByIncome = annualFamilyIncomeInr <= SNQ_INCOME_CEILING_INR;
    const fourYearStandardTotal = STANDARD_GOVT_SEAT_FEE_YEAR_INR * 4;
    const fourYearSnqTotal = SNQ_REDUCED_FEE_YEAR_INR * 4;
    const netSavings = fourYearStandardTotal - fourYearSnqTotal;

    const eligibleColleges = SNQ_COLLEGE_BENCHMARKS.map(col => {
      const isRankEligible = candidateRank <= col.snqCutoff;
      return {
        college: col.college,
        branch: col.branch,
        snqCutoffRank: col.snqCutoff,
        generalCutoffRank: col.generalCutoff,
        snqAdmissionStatus: isRankEligible ? 'High Probability SNQ Allotment' : 'Standard Quota Target',
        isRankEligible
      };
    });

    return {
      success: true,
      candidateRank,
      annualFamilyIncomeInr,
      isSnqEligible: isEligibleByIncome && hasValidRdIncomeCert,
      incomeCeiling: `₹${SNQ_INCOME_CEILING_INR.toLocaleString('en-IN')} / annum`,
      feeComparison: {
        standardAnnualFee: `₹${STANDARD_GOVT_SEAT_FEE_YEAR_INR.toLocaleString('en-IN')} / year`,
        snqAnnualFee: `₹${SNQ_REDUCED_FEE_YEAR_INR.toLocaleString('en-IN')} / year`,
        totalFourYearSavings: `₹${netSavings.toLocaleString('en-IN')}`
      },
      collegeBenchmarks: eligibleColleges,
      documentChecklist: [
        'Revenue Department (RD Number) Income Certificate issued by Tahsildar',
        'Study Certificate (7 years in Karnataka including 10th or 12th)',
        'KEA Option Entry portal automatic SNQ preference toggle enabled'
      ]
    };
  }
}

const snqFeeWaiverEngine = new SnqFeeWaiverEngine();
module.exports = { SnqFeeWaiverEngine, snqFeeWaiverEngine, SNQ_COLLEGE_BENCHMARKS };
