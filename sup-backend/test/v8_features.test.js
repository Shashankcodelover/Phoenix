const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

const { evaluateSpeechProsody } = require('../modules/interview-prep/speechEvaluatorEngine');
const { createOrMatchPeerRoom, sendRoomHeartbeat, ACTIVE_ROOMS, WAITING_QUEUE } = require('../modules/interview-prep/peerMatchEngine');
const { evaluateSystemDesign } = require('../modules/interview-prep/systemDesignEvaluator');
const { searchAndRankHackathons } = require('../modules/hackathon-agent/hackathonScraperEngine');
const { calculateSkillMatrix } = require('../modules/gamification/skillMatrixEngine');

describe('AI Speech & Vocal Prosody Evaluation Engine Tests', () => {
  test('evaluateSpeechProsody handles empty transcript gracefully', () => {
    const res = evaluateSpeechProsody('');
    assert.equal(res.wpm, 0);
    assert.equal(res.pacingRating, 'No Speech Detected');
    assert.equal(res.clarityScore, 0);
  });

  test('evaluateSpeechProsody calculates WPM, filler count, and tone', () => {
    const transcript = "Um like I basically designed a scalable Microservices architecture using Node.js and Redis cache you know.";
    const res = evaluateSpeechProsody(transcript, 10);
    assert.ok(res.wpm > 0);
    assert.ok(res.fillerCount >= 4);
    assert.ok(res.fillerDensityPercent > 0);
    assert.ok(res.clarityScore <= 100);
    assert.ok(res.feedback.length > 0);
  });
});

describe('Peer Mock Interview Room & AI Safety-Net Engine Tests', () => {
  test.skip('createOrMatchPeerRoom places user in waiting queue when alone', async () => {
    const u1 = { userId: 'u_test_1', name: 'Alice', targetRole: 'Backend Engineer' };
    const res = await createOrMatchPeerRoom(u1);
    assert.equal(res.status, 'WAITING');
    assert.ok(res.queuePosition >= 1);
  });

  test.skip('createOrMatchPeerRoom matches two queued users into an active room', async () => {
    const u2 = { userId: 'u_test_2', name: 'Bob', targetRole: 'Frontend Engineer' };
    const res = await createOrMatchPeerRoom(u2);
    assert.equal(res.status, 'MATCHED');
    assert.ok(res.roomId);
    assert.equal(res.peer.name, 'Alice');
  });

  test.skip('sendRoomHeartbeat triggers AI Takeover when peer is silent', async () => {
    const u1 = { userId: 'u_p1', name: 'Carol' };
    const u2 = { userId: 'u_p2', name: 'Dave' };

    WAITING_QUEUE.length = 0; // reset
    createOrMatchPeerRoom(u1);
    const match = createOrMatchPeerRoom(u2);
    const roomId = match.roomId;

    // Simulate 35s delay for peer
    const room = ACTIVE_ROOMS.get(roomId);
    room.participants[0].lastHeartbeat = Date.now() - 35000;

    const hb = sendRoomHeartbeat(roomId, 'u_p2');
    assert.equal(hb.status, 'AI_TAKEOVER');
    assert.ok(hb.aiSafetyNetActive);
  });
});

describe('Interactive System Design Architecture Evaluator Tests', () => {
  test('evaluateSystemDesign detects SPOFs when load balancer and replicas are missing', () => {
    const proposal = {
      targetQps: 20000,
      components: ['API Gateway', 'PostgreSQL Primary'],
      hasCaching: false,
      hasLoadBalancer: false,
      hasReadReplicas: false
    };
    const report = evaluateSystemDesign(proposal);
    assert.ok(report.spofCount >= 2);
    assert.equal(report.handlesTargetQps, false);
    assert.ok(report.slaScore < 60);
    assert.ok(report.estimatedMonthlyCostUsd > 0);
  });

  test('evaluateSystemDesign awards high SLA score to fully redundant design', () => {
    const proposal = {
      targetQps: 50000,
      components: ['ALB', 'Redis Cache', 'Kafka Queue', 'PostgreSQL Primary', 'Read Replica'],
      hasCaching: true,
      hasLoadBalancer: true,
      hasQueue: true,
      hasReadReplicas: true
    };
    const report = evaluateSystemDesign(proposal);
    assert.equal(report.spofCount, 0);
    assert.equal(report.handlesTargetQps, true);
    assert.ok(report.slaScore >= 80);
    assert.ok(report.estimatedLatencyMs < 50);
  });
});

describe('Hackathon Scraper & Urgency Match Scorer Engine Tests', () => {
  test.skip('searchAndRankHackathons matches candidate skills and ranks feed', () => {
    const query = {
      userSkills: ['AI', 'React', 'Node.js'],
      preferredMode: 'All',
      minPrize: 10000
    };
    const result = searchAndRankHackathons(query);
    assert.ok(result.totalFound > 0);
    assert.ok(result.rankedHackathons[0].matchPercent > 0);
    assert.ok(result.rankedHackathons[0].urgencyLevel);
  });
});

describe('Unified Skill Radar Mastery Matrix Engine Tests', () => {
  test('calculateSkillMatrix computes 6-axis radar scores, rank tier, and remedies', () => {
    const stats = {
      dsaScore: 90,
      systemDesignScore: 85,
      securityScore: 80,
      communicationScore: 50,
      pitchScore: 40,
      csFundamentalsScore: 75
    };
    const report = calculateSkillMatrix(stats);
    assert.ok(report.overallMasteryScore >= 70);
    assert.equal(report.weakestArea.key, 'pitch');
    assert.ok(report.remedies.length > 0);
    assert.ok(report.earnedBadges.length > 0);
  });
});
