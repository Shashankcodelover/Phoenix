const { describe, it } = require('node:test');
const assert = require('node:assert');

const { WinningSolutionsRagEngine, WINNING_SOLUTIONS_ARCHIVE } = require('../modules/hackathon-agent/winningSolutionsRagEngine');

describe('V24 Quality Focus: Feature 30 — Winning Hackathon Solutions RAG Vector Archive Engine', () => {
  const engine = new WinningSolutionsRagEngine();

  it('searches the archive and retrieves ETHGlobal and HackMIT grand prize winners with moat breakdowns', () => {
    const report = engine.searchWinningArchive({ query: 'decentralized webrtc p2p' });

    assert.strictEqual(report.success, true);
    assert.ok(report.totalMatched >= 1);
    assert.strictEqual(report.actionableWinningBlueprint.length, 3);

    const medSync = report.topSolutions[0];
    assert.ok(medSync.title.includes('MedSync'));
    assert.ok(medSync.prizeTier.includes('$25,000'));
    assert.ok(medSync.winningSecretMoat.includes('Redis'));
    assert.ok(medSync.judgeWowFactor.includes('ethernet cable'));
  });
});
