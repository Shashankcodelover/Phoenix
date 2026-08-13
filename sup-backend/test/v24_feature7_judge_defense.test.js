const { describe, it } = require('node:test');
const assert = require('node:assert');

const { MultimodalJudgeDefenseEngine } = require('../modules/hackathon-agent/multimodalJudgeDefenseEngine');

describe('V24 Quality Focus: Feature 7 — Live Multimodal AI Judge Defense Grilling Simulator', () => {
  const engine = new MultimodalJudgeDefenseEngine();

  it('conducts Round 1 Tech Lead grilling and evaluates candidate architecture defense', () => {
    const round1 = engine.evaluateDefense({
      projectTitle: 'NexusAudio',
      techStack: 'Node.js, WebRTC, Redis LRU, Two-Stage Vector RAG, Distributed Database',
      candidateResponse: 'We guarantee sub-300ms latency by using WebRTC audio datachannels, an in-memory Redis cluster that caches AST complexity trees, sharding our distributed database, and eliminating single points of failure.',
      currentRound: 1,
      voiceProsody: { confidenceIndex: 92, fillerDensityPercent: 0.5, wpm: 140 }
    });

    assert.strictEqual(round1.projectTitle, 'NexusAudio');
    assert.strictEqual(round1.roundNumber, 1);
    assert.ok(round1.rubricScores.technicalDepth >= 80);
    assert.ok(round1.rubricScores.vocalConviction >= 85);
    assert.ok(round1.nextRound.roundNumber === 2);
    assert.ok(round1.nextRound.question.includes('proprietary moat'));
  });

  it('completes final Round 5 and awards Grand Prize Contender podium verdict', () => {
    const round5 = engine.evaluateDefense({
      projectTitle: 'NexusAudio',
      techStack: 'Next.js 15, Tailwind v4, Fastify, Gemini 2.5',
      candidateResponse: 'With $100k prize funding, we will scale our distributed WebRTC cache architecture across B2B university partnerships in 50 engineering colleges at ₹1,500 per student, reaching 100k active users and achieving $1.2M ARR with zero cloud database cost.',
      currentRound: 5,
      voiceProsody: { confidenceIndex: 95, fillerDensityPercent: 0.2, wpm: 138 }
    });

    assert.strictEqual(round5.roundNumber, 5);
    assert.ok(round5.rubricScores.businessMoat >= 80);
    assert.ok(round5.verdict.includes('Grand Prize Contender'));
    assert.strictEqual(round5.nextRound.status, 'DEFENSE_COMPLETE');
  });
});
