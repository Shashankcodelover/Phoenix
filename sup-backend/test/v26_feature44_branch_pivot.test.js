const { describe, it } = require('node:test');
const assert = require('node:assert');

const {
  branchTransitionEngine,
  INSTITUTION_RULES,
  MINOR_DEGREE_PATHWAY,
  INDUSTRY_BRIDGE_CURRICULUM
} = require('../modules/horizon/branchTransitionEngine');

describe('V26 Feature 44: Branch Transition & Career Pivot Simulator', () => {
  it('retrieves institution lists with cutoffs and vacancy trends', () => {
    const res = branchTransitionEngine.getCollegesAndBranches();
    assert.strictEqual(res.success, true);
    assert.ok(Array.isArray(res.colleges));
    assert.ok(res.colleges.length >= 5);

    const rvce = res.colleges.find(c => c.code === 'RVCE');
    assert.ok(rvce);
    assert.strictEqual(rvce.minEligibilityCgpa, 8.50);
    assert.ok(rvce.branches.some(b => b.code === 'CSE' && b.cutoffCgpa === 9.68));

    const nitk = res.colleges.find(c => c.code === 'NITK');
    assert.ok(nitk);
    assert.strictEqual(nitk.policyType, 'Institute of National Importance (INI)');
  });

  it('retrieves candidate presets', () => {
    const presets = branchTransitionEngine.getPresets();
    assert.ok(Array.isArray(presets));
    assert.ok(presets.length >= 4);
    assert.ok(presets.some(p => p.id === 'rvce_mech_to_cse'));
  });

  it('evaluates high feasibility for top-tier CGPA exceeding branch cutoff (NITK ECE to CSE 9.80)', () => {
    const res = branchTransitionEngine.simulate({
      collegeCode: 'NITK',
      currentBranch: 'ECE',
      targetBranch: 'CSE',
      cgpa: 9.80,
      category: 'GM',
      backlogsCount: 0
    });

    assert.strictEqual(res.success, true);
    assert.strictEqual(res.eligibleToApply, true);
    assert.strictEqual(res.feasibility, 'SAFE_HIGH');
    assert.ok(res.probabilityScore >= 85);
    assert.strictEqual(res.cutoffThreshold, 9.75);
    assert.ok(res.actionAdvice.length >= 2);
  });

  it('correctly disqualifies candidate with active backlogs', () => {
    const res = branchTransitionEngine.simulate({
      collegeCode: 'PESU',
      currentBranch: 'MECH',
      targetBranch: 'CSE',
      cgpa: 8.90,
      category: 'GM',
      backlogsCount: 1
    });

    assert.strictEqual(res.success, true);
    assert.strictEqual(res.eligibleToApply, false);
    assert.strictEqual(res.feasibility, 'INELIGIBLE');
    assert.strictEqual(res.probabilityScore, 0);
    assert.ok(res.verdictSummary.includes('active backlog'));
    assert.ok(res.minorDegreeAlternative);
    assert.strictEqual(res.minorDegreeAlternative.totalCredits, 18);
  });

  it('evaluates borderline/reach candidate and returns NEP 2020 Minor Degree curriculum and bridge plan', () => {
    const res = branchTransitionEngine.simulate({
      collegeCode: 'BMSCE',
      currentBranch: 'CIVIL',
      targetBranch: 'AIML',
      cgpa: 8.70,
      category: 'OBC',
      backlogsCount: 0
    });

    assert.strictEqual(res.success, true);
    assert.strictEqual(res.eligibleToApply, true);
    assert.ok(['BORDERLINE_TARGET', 'HIGH_REACH'].includes(res.feasibility));
    assert.ok(res.probabilityScore > 0 && res.probabilityScore < 80);

    // Verify NEP 2020 Minor Degree details
    assert.ok(res.minorDegreeAlternative);
    assert.strictEqual(res.minorDegreeAlternative.curriculum.length, 5);
    assert.strictEqual(res.minorDegreeAlternative.curriculum[0].courseCode, 'CSM301');

    // Verify 4-phase bridge curriculum
    assert.ok(Array.isArray(res.bridgeRoadmap));
    assert.strictEqual(res.bridgeRoadmap.length, 4);
    assert.ok(res.bridgeRoadmap[0].phase.includes('Algorithmic Foundations'));
  });
});
