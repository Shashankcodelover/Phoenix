const { describe, it } = require('node:test');
const assert = require('node:assert');

const {
  institutionalGatekeeperEngine,
  EXAM_SCHEMA,
  PRESETS
} = require('../modules/horizon/institutionalGatekeeperEngine');

describe('V26 Feature 47: Institutional Gatekeeper Assessment Engine', () => {
  it('retrieves exam schema with 4 balanced sections', () => {
    const res = institutionalGatekeeperEngine.getExamSchema();
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.schema.totalMarks, 100);
    assert.strictEqual(res.schema.sections.length, 4);
    assert.ok(res.schema.sections.some(s => s.id === 'quant'));
    assert.ok(res.schema.sections.some(s => s.id === 'coding'));
  });

  it('retrieves candidate presets', () => {
    const presets = institutionalGatekeeperEngine.getPresets();
    assert.ok(Array.isArray(presets));
    assert.ok(presets.length >= 3);
    assert.ok(presets.some(p => p.id === 'top_tier_sde'));
    assert.ok(presets.some(p => p.id === 'flagged_integrity'));
  });

  it('accurately evaluates top-tier SDE submission with clean integrity (96% score -> Shortlisted)', () => {
    const res = institutionalGatekeeperEngine.evaluate({
      candidateName: 'Aditya Shenoy',
      usn: '1RV21CS018',
      collegeName: 'RVCE',
      quantScore: 24,
      logicalScore: 23,
      techMcqScore: 25,
      codingTestCasesPassed: 10,
      codingTotalTestCases: 10,
      tabSwitchCount: 0,
      pasteEventsCount: 0,
      timeSpentMins: 72
    });

    assert.strictEqual(res.success, true);
    assert.ok(res.assessmentId.startsWith('GATEKEEPER-'));
    assert.strictEqual(res.scores.totalScore, 97);
    assert.ok(res.scores.percentile >= 90);
    assert.strictEqual(res.verdict.allSectionsPassed, true);
    assert.strictEqual(res.integrity.score, 100);
    assert.strictEqual(res.integrity.status, 'CLEAN_VERIFIED');
    assert.strictEqual(res.verdict.shortlistVerdict, 'SHORTLISTED FOR INTERVIEW (DAY 1)');
  });

  it('correctly catches and flags integrity breach for suspicious tab-switching/copy-paste submission', () => {
    const res = institutionalGatekeeperEngine.evaluate({
      candidateName: 'Rahul Verma',
      usn: '1MS21EC089',
      collegeName: 'MSRIT',
      quantScore: 22,
      logicalScore: 20,
      techMcqScore: 23,
      codingTestCasesPassed: 10,
      codingTotalTestCases: 10,
      tabSwitchCount: 7,
      pasteEventsCount: 5,
      timeSpentMins: 45
    });

    assert.strictEqual(res.success, true);
    assert.ok(res.integrity.score < 60);
    assert.strictEqual(res.integrity.status, 'FLAGGED_PROCTOR_REVIEW');
    assert.strictEqual(res.verdict.shortlistVerdict, 'DISQUALIFIED (INTEGRITY BREACH)');
    assert.ok(res.verdict.recommendation.includes('tab switch'));
  });

  it('identifies borderline candidate who fails sectional cutoff', () => {
    const res = institutionalGatekeeperEngine.evaluate({
      candidateName: 'Pooja R. Hegde',
      usn: '1BM21IS042',
      collegeName: 'BMSCE',
      quantScore: 14, // Fails cutoff (< 15)
      logicalScore: 16,
      techMcqScore: 21,
      codingTestCasesPassed: 7,
      codingTotalTestCases: 10,
      tabSwitchCount: 1,
      pasteEventsCount: 0,
      timeSpentMins: 85
    });

    assert.strictEqual(res.success, true);
    assert.strictEqual(res.sectionalAudit.quant.passed, false);
    assert.strictEqual(res.verdict.allSectionsPassed, false);
    assert.strictEqual(res.verdict.shortlistVerdict, 'BORDERLINE / SECTIONAL RETEST');
  });
});
