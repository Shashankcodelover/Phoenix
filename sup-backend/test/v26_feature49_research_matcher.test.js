const { describe, it } = require('node:test');
const assert = require('node:assert');

const {
  researchLabMatcherEngine,
  RESEARCH_LABS,
  PRESETS
} = require('../modules/horizon/researchLabMatcherEngine');

describe('V26 Feature 49: Research Publication & Lab Matcher', () => {
  it('retrieves global research labs catalog with PIs and publications', () => {
    const res = researchLabMatcherEngine.getLabsList();
    assert.strictEqual(res.success, true);
    assert.ok(Array.isArray(res.labs));
    assert.ok(res.labs.length >= 5);

    const iisc = res.labs.find(l => l.id === 'iisc_cds_ml');
    assert.ok(iisc);
    assert.strictEqual(iisc.pi, 'Prof. Chiranjib Bhattacharyya');
    assert.ok(iisc.recentPaper.includes('NeurIPS'));

    const stanford = res.labs.find(l => l.id === 'stanford_sail');
    assert.ok(stanford);
    assert.strictEqual(stanford.pi, 'Prof. Christopher Ré');
  });

  it('retrieves candidate presets', () => {
    const presets = researchLabMatcherEngine.getPresets();
    assert.ok(Array.isArray(presets));
    assert.ok(presets.length >= 3);
    assert.ok(presets.some(p => p.id === 'genai_llm_iisc'));
  });

  it('accurately matches student research skills and computes high affinity fit (IISc / ML Lab)', () => {
    const res = researchLabMatcherEngine.match({
      studentSkills: ['Linear Algebra', 'PyTorch', 'Optimization', 'Deep Learning Theory'],
      selectedDomain: 'Foundations of Machine Learning & Kernel Optimization',
      cgpa: 9.35,
      priorPubCount: 1
    });

    assert.strictEqual(res.success, true);
    assert.strictEqual(res.topMatchedLab.id, 'iisc_cds_ml');
    assert.ok(res.topMatchedLab.fitScore >= 85);
    assert.strictEqual(res.topMatchedLab.fitBand, 'High Affinity / Target Lab');
    assert.ok(res.topMatchedLab.matchingSkills.length >= 3);
  });

  it('synthesizes publication-grade research statement & cold professor outreach', () => {
    const res = researchLabMatcherEngine.generateStatement({
      labId: 'iisc_cds_ml',
      studentName: 'Ananya Kulkarni',
      studentCollege: 'RVCE',
      major: 'CSE',
      cgpa: 9.35,
      priorProject: 'Engineered GPU-accelerated sparse matrix kernels',
      proposedExtension: 'Extending your 2024 NeurIPS non-convex framework to multi-agent distributed architectures'
    });

    assert.strictEqual(res.success, true);
    assert.ok(res.subject.includes('Prospective Research Internship'));
    assert.ok(res.statement.includes('Prof. Chiranjib Bhattacharyya'));
    assert.ok(res.statement.includes('NeurIPS 2024'));
    assert.ok(res.statement.includes('sparse matrix kernels'));
    assert.strictEqual(res.protocolChecklist.length, 4);
  });
});
