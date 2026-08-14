const { describe, it } = require('node:test');
const assert = require('node:assert');

const { StarStoryRefinerEngine } = require('../modules/interview-prep/starStoryRefinerEngine');

describe('V24 Quality Focus: Feature 22 — AI Behavioral STAR Story Refiner Engine', () => {
  const engine = new StarStoryRefinerEngine();

  it('refines raw unstructured narrative into 4-pillar STAR format with power metrics', () => {
    const report = engine.refineBehavioralStory({
      companyTarget: 'Amazon SDE-2 Bar-Raiser',
      principle: 'Bias for Action',
      rawStory: 'I worked on caching to make backend faster.'
    });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.starScore, '95/100 (FAANG High-Impact)');
    assert.ok(report.structuredSTAR.situation.includes('45,000 requests/minute'));
    assert.ok(report.structuredSTAR.task.includes('sub-100ms response times'));
    assert.ok(report.structuredSTAR.action.includes('Redis LRU'));
    assert.ok(report.structuredSTAR.result.includes('Reduced P99 API latency by 76%'));
    assert.strictEqual(report.powerMetricsInjected.length, 3);
    assert.ok(report.speechCoachDeliveryTip.includes('Lead with the metric'));
  });
});
