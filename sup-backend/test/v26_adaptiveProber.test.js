const test = require('node:test');
const assert = require('node:assert/strict');
const aiAdaptiveKnowledgeProber = require('../modules/interview-prep/aiAdaptiveKnowledgeProber');

test('V26 Feature 3: AIAdaptiveKnowledgeProber generates context-aware deep dive questions', () => {
    const probe = aiAdaptiveKnowledgeProber.generateAdaptiveFollowUp(
        'DISTRIBUTED_SYSTEMS',
        'We will decouple microservices using an Apache Kafka event stream.'
    );

    assert.equal(probe.targetArea, 'MESSAGING');
    assert.ok(probe.followUpQuestion.includes('duplicate message processing'));
    assert.ok(probe.relatedDeepDiveConcepts.length > 0);
    assert.equal(probe.difficultyScore, 8.5);
});
