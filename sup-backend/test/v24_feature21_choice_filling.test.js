const { describe, it } = require('node:test');
const assert = require('node:assert');

const { ChoiceFillingSimulatorEngine } = require('../modules/horizon/choiceFillingSimulatorEngine');

describe('V24 Quality Focus: Feature 21 — KCET & DCET Choice Filling Option-Entry Simulator', () => {
  const engine = new ChoiceFillingSimulatorEngine();

  it('simulates Round 1 allotment and upgrades candidate to higher preference in Round 2', () => {
    const report = engine.simulateSeatAllotment({
      candidateRank: 2140,
      categoryQuota: 'GM',
      orderedOptions: [
        { priority: 1, collegeCode: 'RVCE', branch: 'CSE', key: 'RVCE_CSE' },
        { priority: 2, collegeCode: 'BMSCE', branch: 'CSE', key: 'BMSCE_CSE' },
        { priority: 3, collegeCode: 'MSRIT', branch: 'ISE', key: 'MSRIT_ISE' }
      ]
    });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.candidateRank, 2140);
    assert.strictEqual(report.totalOptionsSubmitted, 3);
    assert.strictEqual(report.round1Result.allotted, true);
    assert.strictEqual(report.round1Result.college, 'BMSCE');
    assert.strictEqual(report.round1Result.optionPriority, 2);

    // In Round 2 with cutoff relaxation (2200 * 1.12), rank 2140 upgrades to Option #1 RVCE
    assert.strictEqual(report.round2Result.allotted, true);
    assert.strictEqual(report.round2Result.college, 'RVCE');
    assert.strictEqual(report.round2Result.optionPriority, 1);
    assert.ok(report.keaDecisionStrategy.recommendedChoice.includes('Choice 2'));
  });

  it('handles reservation quotas and asserts correct threshold expansion', () => {
    const report = engine.simulateSeatAllotment({
      candidateRank: 3100,
      categoryQuota: 'OBC_2A',
      orderedOptions: [
        { priority: 1, collegeCode: 'RVCE', branch: 'CSE', key: 'RVCE_CSE' }
      ]
    });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.round1Result.allotted, true);
    assert.strictEqual(report.round1Result.college, 'RVCE');
  });
});
