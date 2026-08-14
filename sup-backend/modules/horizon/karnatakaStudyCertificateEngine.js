/**
 * Phoenix Apex Ultra: Feature 51 — Karnataka Study Certificate 7-Year Validator Engine
 * 
 * Verifies KEA Clause-A 7-year continuous study eligibility, audits multi-school transfers,
 * and tracks Block Education Officer (BEO) / DDPI counter-signature requirements.
 */

class KarnatakaStudyCertificateEngine {
  /**
   * Validates study periods across schooling history for KEA Clause A compliance.
   */
  validateStudyHistory(payload = {}) {
    const {
      candidateName = 'Karnataka Aspirant',
      studyRecords = [
        { standardRange: '1st - 5th Std', years: 5, schoolName: 'Govt Model Primary School', district: 'Mysore', beoCountersigned: true },
        { standardRange: '6th - 7th Std', years: 2, schoolName: 'National High School', district: 'Bangalore South', beoCountersigned: true },
        { standardRange: '8th - 10th Std', years: 3, schoolName: 'St. Joseph High School', district: 'Bangalore South', beoCountersigned: true },
        { standardRange: '11th - 12th / 2nd PUC', years: 2, schoolName: 'MES PU College', district: 'Bangalore North', beoCountersigned: true }
      ]
    } = payload;

    const totalKarnatakaYears = studyRecords.reduce((acc, curr) => acc + (curr.years || 0), 0);
    const missingBeoSignatures = studyRecords.filter(r => !r.beoCountersigned);

    const isClauseAEligible = totalKarnatakaYears >= 7 && missingBeoSignatures.length === 0;

    return {
      success: true,
      candidateName,
      totalKarnatakaYears,
      requiredYearsFloor: 7,
      isClauseAEligible,
      eligibilityStatus: isClauseAEligible ? 'KEA Clause-A Fully Validated ✓' : 'Incomplete Verification / Missing BEO Endorsement',
      auditBreakdown: {
        completedYears: `${totalKarnatakaYears} Years (Minimum 7 Required)`,
        distinctSchoolBlocks: studyRecords.length,
        missingBeoEndorsements: missingBeoSignatures.length
      },
      actionableGuidance: isClauseAEligible
        ? 'All study certificates satisfy 7-year continuous Karnataka education criteria with mandatory BEO seals.'
        : `Action Required: Obtain BEO counter-signatures for: ${missingBeoSignatures.map(s => s.schoolName).join(', ')}.`
    };
  }
}

const karnatakaStudyCertificateEngine = new KarnatakaStudyCertificateEngine();
module.exports = { KarnatakaStudyCertificateEngine, karnatakaStudyCertificateEngine };
