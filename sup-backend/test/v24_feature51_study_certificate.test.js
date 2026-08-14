const { describe, it } = require('node:test');
const assert = require('node:assert');

const { KarnatakaStudyCertificateEngine } = require('../modules/horizon/karnatakaStudyCertificateEngine');

describe('V24 Quality Focus: Feature 51 — Karnataka Study Certificate 7-Year Validator Engine', () => {
  const engine = new KarnatakaStudyCertificateEngine();

  it('validates multi-school 12-year timeline and confirms KEA Clause-A eligibility with BEO seals', () => {
    const report = engine.validateStudyHistory({
      candidateName: 'Rohan Gowda',
      studyRecords: [
        { standardRange: '1st - 5th Std', years: 5, schoolName: 'Mysore Model School', district: 'Mysore', beoCountersigned: true },
        { standardRange: '6th - 10th Std', years: 5, schoolName: 'Bangalore High School', district: 'Bangalore South', beoCountersigned: true },
        { standardRange: '11th - 12th / 2nd PUC', years: 2, schoolName: 'National PU College', district: 'Bangalore South', beoCountersigned: true }
      ]
    });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.candidateName, 'Rohan Gowda');
    assert.strictEqual(report.totalKarnatakaYears, 12);
    assert.strictEqual(report.isClauseAEligible, true);
    assert.ok(report.eligibilityStatus.includes('Clause-A Fully Validated'));
    assert.strictEqual(report.auditBreakdown.missingBeoEndorsements, 0);
  });

  it('flags missing BEO counter-signature when candidate has unverified school block', () => {
    const report = engine.validateStudyHistory({
      candidateName: 'Pooja Patil',
      studyRecords: [
        { standardRange: '1st - 5th Std', years: 5, schoolName: 'Belgaum School', district: 'Belgaum', beoCountersigned: false },
        { standardRange: '6th - 10th Std', years: 5, schoolName: 'Hubli School', district: 'Dharwad', beoCountersigned: true }
      ]
    });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.isClauseAEligible, false);
    assert.strictEqual(report.auditBreakdown.missingBeoEndorsements, 1);
    assert.ok(report.actionableGuidance.includes('Belgaum School'));
  });
});
