const { describe, it } = require('node:test');
const assert = require('node:assert');

const { MultiStreamAdmissionsEngine, EXAM_STREAMS } = require('../modules/horizon/multiStreamAdmissionsEngine');

describe('V26 Feature 41: Multi-Stream Admissions & Cutoff Predictor', () => {
  const engine = new MultiStreamAdmissionsEngine();

  it('retrieves supported exam streams and category reservation quotas', () => {
    const data = engine.getStreamsAndQuotas();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.streams));
    assert.ok(data.streams.length >= 4);

    const keys = data.streams.map(s => s.key);
    assert.ok(keys.includes('KCET'));
    assert.ok(keys.includes('COMEDK'));
    assert.ok(keys.includes('JEE_MAIN'));
    assert.ok(keys.includes('GATE'));
  });

  it('retrieves catalog of institutions with NIRF rankings and branches', () => {
    const colleges = engine.getColleges('KCET');
    assert.strictEqual(colleges.success, true);
    assert.ok(colleges.institutions.length >= 5);

    const rvce = colleges.institutions.find(i => i.code === 'RVCE');
    assert.ok(rvce);
    assert.strictEqual(rvce.tier, 'Tier-1 Elite Autonomous');
    assert.ok(rvce.branches.length >= 3);
  });

  it('predicts admissions brackets across Safe, Target, and Reach for rank 3,500 in KCET', () => {
    const pred = engine.predictAdmissions({
      stream: 'KCET',
      candidateRank: 3500,
      categoryQuota: 'GM'
    });

    assert.strictEqual(pred.success, true);
    assert.ok(pred.brackets.safe.length > 0, 'Has safe options');
    assert.ok(pred.brackets.target.length > 0, 'Has target options');
    assert.ok(pred.brackets.reach.length > 0, 'Has reach options');
    assert.ok(pred.optimalChoiceFillingOrder.length > 0);

    // RVCE CSE cutoff is 1850 for GM, so rank 3500 must be in REACH bracket for RVCE CSE
    const rvceCse = pred.brackets.reach.find(o => o.collegeCode === 'RVCE' && o.branchCode === 'CSE');
    assert.ok(rvceCse, 'RVCE CSE is in reach bracket');
    assert.ok(rvceCse.probabilityPercent < 60);

    // MSRIT ECE cutoff is 7800 for GM, so rank 3500 must be SAFE
    const msritEce = pred.brackets.safe.find(o => o.collegeCode === 'MSRIT' && o.branchCode === 'ECE');
    assert.ok(msritEce, 'MSRIT ECE is in safe bracket');
    assert.ok(msritEce.probabilityPercent >= 90);
  });

  it('applies reservation quota multiplier (e.g. 2A or SC) to expand admission chances', () => {
    const predGM = engine.predictAdmissions({ stream: 'KCET', candidateRank: 2500, categoryQuota: 'GM' });
    const pred2A = engine.predictAdmissions({ stream: 'KCET', candidateRank: 2500, categoryQuota: '2A' });

    // For RVCE CSE (base GM 1850, 2A multiplier 1.45 = 2682), rank 2500 is REACH in GM but TARGET/SAFE in 2A
    const rvceGm = predGM.brackets.reach.find(o => o.collegeCode === 'RVCE' && o.branchCode === 'CSE');
    const rvce2A = pred2A.brackets.target.find(o => o.collegeCode === 'RVCE' && o.branchCode === 'CSE') ||
                   pred2A.brackets.safe.find(o => o.collegeCode === 'RVCE' && o.branchCode === 'CSE');

    assert.ok(rvceGm, 'Rank 2500 is reach in GM');
    assert.ok(rvce2A, 'Rank 2500 becomes target/safe under 2A category quota');
  });

  it('predicts JEE Main admissions for NITK Surathkal and IIIT Bangalore', () => {
    const predJee = engine.predictAdmissions({
      stream: 'JEE_MAIN',
      candidateRank: 3000,
      categoryQuota: 'HOME_STATE'
    });

    assert.strictEqual(predJee.success, true);
    assert.ok(predJee.summary.totalOptionsEvaluated >= 3);
  });
});
