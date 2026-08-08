const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

const { synthesizeSTARStory } = require('../modules/interview-prep/starStorySynthesizer');
const { getCompensationBenchmark, SALARY_BENCHMARKS } = require('../modules/interview-prep/compBenchmarkingEngine');
const { generatePitchDeckBlueprint } = require('../modules/hackathon-agent/pitchDeckGenerator');
const { dispatchWebhookEvent, generateSignature, getWebhookLogs } = require('../modules/webhooks/webhookDispatcher');
const { getActiveQuests, getStreakMultiplier } = require('../modules/gamification/questEngine');

describe('STAR Interview Behavioral Story Miner & Synthesizer Tests', () => {
  test('synthesizeSTARStory parses raw context into 4-step STAR framework', () => {
    const input = {
      projectTitle: 'Phoenix Autonomous OS',
      rawContext: 'I built a node.js and redis caching system to eliminate high QPS latency spikes.',
      category: 'Optimization'
    };
    const res = synthesizeSTARStory(input);
    assert.equal(res.projectTitle, 'Phoenix Autonomous OS');
    assert.equal(res.category, 'Optimization');
    assert.ok(res.starFramework.situation.includes('Node.js'));
    assert.ok(res.starFramework.task.length > 0);
    assert.ok(res.starFramework.action.length > 0);
    assert.ok(res.starFramework.result.length > 0);
    assert.ok(res.suggestedFollowUpQuestions.length >= 2);
    assert.ok(res.impactMetricScore >= 80);
  });
});

describe('Salary & Compensation Benchmarking Engine Tests', () => {
  test('getCompensationBenchmark returns localized salary and equity estimates', () => {
    const input = { roleKey: 'software_engineer', locationKey: 'us_sf_ny' };
    const res = getCompensationBenchmark(input);
    assert.equal(res.roleTitle, SALARY_BENCHMARKS.software_engineer.title);
    assert.equal(res.locationMultiplier, 1.0);
    assert.ok(res.baseSalary.median > 100000);
    assert.ok(res.estimatedTotalCompensationMedian > res.baseSalary.median);
    assert.ok(res.negotiationTips.length >= 3);
  });

  test('getCompensationBenchmark applies location multiplier correctly for India tech hub', () => {
    const input = { roleKey: 'senior_software_engineer', locationKey: 'india_tech' };
    const res = getCompensationBenchmark(input);
    assert.equal(res.locationMultiplier, 0.35);
    assert.ok(res.baseSalary.median < SALARY_BENCHMARKS.senior_software_engineer.baseSalaryUsd.median);
  });
});

describe('Hackathon Pitch Deck Generator Engine Tests', () => {
  test.skip('generatePitchDeckBlueprint creates a complete 5-slide presenter blueprint', async () => {
    const input = {
      projectTitle: 'Project Phoenix',
      problemStatement: 'Developers lack automated interview & hackathon practice.',
      techStack: ['Node.js', 'Express', 'React', 'MongoDB'],
      targetTrack: 'AI & Machine Learning'
    };
    const blueprint = await generatePitchDeckBlueprint(input);
    assert.equal(blueprint.projectTitle, 'Project Phoenix');
    assert.equal(blueprint.totalSlides, 5);
    assert.equal(blueprint.slides.length, 5);
    assert.ok(blueprint.totalDurationSeconds > 0);
    assert.ok(blueprint.judgeQADefenseCheatSheet.length >= 2);
    assert.ok(blueprint.slides[0].presenterScript.includes('Developers lack automated'));
  });
});

describe('Webhook Notification Relay & Dispatcher Engine Tests', () => {
  test('generateSignature creates HMAC SHA-256 string', () => {
    const sig = generateSignature('test_payload', 'secret_key');
    assert.equal(typeof sig, 'string');
    assert.equal(sig.length, 64);
  });

  test('dispatchWebhookEvent logs signed payload and returns status', () => {
    const event = {
      eventType: 'INTERVIEW_COMPLETED',
      payload: { score: 95, candidate: 'Alex' },
      targetUrl: 'https://hooks.example.com/interview'
    };
    const res = dispatchWebhookEvent(event);
    assert.ok(res.deliveryId.startsWith('wh_'));
    assert.equal(res.status, 'DELIVERED');
    assert.ok(res.signature.length === 64);

    const logs = getWebhookLogs();
    assert.ok(logs.length > 0);
    assert.equal(logs[0].deliveryId, res.deliveryId);
  });
});

describe('Daily Streak Multiplier & XP Quest Engine Tests', () => {
  test('getStreakMultiplier scales based on active streak days', () => {
    assert.equal(getStreakMultiplier(1), 1.0);
    assert.equal(getStreakMultiplier(3), 1.25);
    assert.equal(getStreakMultiplier(7), 1.5);
    assert.equal(getStreakMultiplier(14), 2.0);
  });

  test('getActiveQuests calculates quest progress and boosted XP rewards', () => {
    const userStats = { streak: 7, completedQuestIds: ['q_dsa_01'] };
    const summary = getActiveQuests(userStats);
    assert.equal(summary.activeStreakDays, 7);
    assert.equal(summary.streakMultiplier, 1.5);
    assert.ok(summary.quests.length >= 4);
    assert.equal(summary.quests[0].isCompleted, true);
    assert.equal(summary.quests[0].status, 'CLAIMED');
    assert.equal(summary.quests[0].boostedXpReward, Math.round(50 * 1.5));
    assert.ok(summary.totalEarnedXp > 0);
  });
});
