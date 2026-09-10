const { describe, it } = require('node:test');
const assert = require('node:assert');

const {
  universalTranscriptEvaluatorEngine,
  GRADING_SYSTEMS,
  MS_CS_PREREQUISITES
} = require('../modules/horizon/universalTranscriptEvaluatorEngine');

describe('V26 Feature 45: Universal Credit Transfer & Transcript Evaluator', () => {
  it('retrieves grading systems catalog and prerequisites list', () => {
    const res = universalTranscriptEvaluatorEngine.getGradingSystems();
    assert.strictEqual(res.success, true);
    assert.ok(Array.isArray(res.systems));
    assert.ok(res.systems.length >= 4);
    assert.ok(res.systems.some(s => s.key === 'US_WES'));
    assert.ok(res.systems.some(s => s.key === 'GERMAN_BAVARIAN'));

    assert.ok(Array.isArray(res.prerequisitesList));
    assert.strictEqual(res.prerequisitesList.length, 10);
  });

  it('retrieves presets', () => {
    const presets = universalTranscriptEvaluatorEngine.getPresets();
    assert.ok(Array.isArray(presets));
    assert.ok(presets.length >= 3);
    assert.ok(presets.some(p => p.id === 'vtu_cs_high'));
  });

  it('accurately evaluates WES, Bavarian, and ECTS conversions for top-tier student (8.85 CGPA, 168 credits)', () => {
    const res = universalTranscriptEvaluatorEngine.evaluate({
      cgpa: 8.85,
      totalCreditsEarned: 168,
      completedCourseIds: [
        'math_calc', 'math_la', 'math_prob', 'math_discrete',
        'cs_dsa', 'cs_os', 'cs_arch', 'cs_dbms', 'cs_networks', 'cs_theory'
      ]
    });

    assert.strictEqual(res.success, true);
    assert.strictEqual(res.conversions.wesGpa, 3.8);
    assert.strictEqual(res.conversions.wesLetter, 'A- / B+ (Very Good)');
    // Bavarian for 8.85: 1 + 3 * (10 - 8.85) / 6 = 1 + 3 * 1.15 / 6 = 1 + 0.575 = 1.58
    assert.strictEqual(res.conversions.germanBavarian, 1.58);
    assert.strictEqual(res.conversions.totalEcts, 252);
    assert.strictEqual(res.conversions.ukClassification, 'First-Class Honours (1st)');

    // 100% prerequisite fulfillment
    assert.strictEqual(res.prerequisites.fulfilledCount, 10);
    assert.strictEqual(res.prerequisites.missingCount, 0);
    assert.strictEqual(res.prerequisites.fulfillmentPct, 100);
    assert.strictEqual(res.levelingRecommendations.length, 0);
  });

  it('accurately detects missing prerequisite gaps and recommends leveling courses for pivoting student', () => {
    const res = universalTranscriptEvaluatorEngine.evaluate({
      cgpa: 8.20,
      totalCreditsEarned: 164,
      completedCourseIds: [
        'math_calc', 'math_la', 'math_prob',
        'cs_dsa', 'cs_arch', 'cs_networks'
      ]
    });

    assert.strictEqual(res.success, true);
    assert.strictEqual(res.conversions.wesGpa, 3.6);
    assert.strictEqual(res.prerequisites.fulfilledCount, 6);
    assert.strictEqual(res.prerequisites.missingCount, 4);
    assert.strictEqual(res.prerequisites.fulfillmentPct, 60);

    assert.strictEqual(res.levelingRecommendations.length, 4);
    assert.ok(res.levelingRecommendations.some(r => r.course.includes('Operating Systems')));
    assert.ok(res.levelingRecommendations.some(r => r.course.includes('Automata')));

    assert.ok(Array.isArray(res.documentChecklist));
    assert.ok(res.documentChecklist.length >= 5);
  });
});
