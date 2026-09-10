const { describe, it } = require('node:test');
const assert = require('node:assert');

const { GrandChampionTrophyEngine } = require('../modules/hackathon-agent/grandChampionTrophyEngine');

describe('V26 Feature 40: Grand Champion Command Center & Trophy Vault', () => {
  const engine = new GrandChampionTrophyEngine();

  it('retrieves builder grandmaster profile with verified statistics', () => {
    const profile = engine.getProfile();
    assert.strictEqual(profile.builderId, 'phx-builder-001');
    assert.strictEqual(profile.stats.trophiesWon, 6);
    assert.strictEqual(profile.stats.winRate, '100%');
    assert.strictEqual(profile.stats.cumulativePrizesUsd, 124500);
    assert.ok(profile.trophies.length >= 5);
    assert.ok(profile.badges.length >= 6);
  });

  it('cryptographically verifies trophy proof hash with SHA-256 checksum', () => {
    const verification = engine.verifyTrophyProof('TRP-HACKMIT-2026');
    assert.strictEqual(verification.success, true);
    assert.strictEqual(verification.trophyId, 'TRP-HACKMIT-2026');
    assert.strictEqual(verification.event, 'HackMIT 2026');
    assert.strictEqual(verification.prizeUsd, 25000);
    assert.strictEqual(verification.status, 'CRYPTOGRAPHICALLY_VERIFIED');
    assert.ok(verification.auditChecksum.startsWith('0x'));
  });

  it('generates embeddable builder badge HTML and iframe snippet', () => {
    const embed = engine.generateEmbedBadge();
    assert.strictEqual(embed.success, true);
    assert.ok(embed.badgeHtml.includes('phx-builder-badge'));
    assert.ok(embed.badgeHtml.includes('124,500'));
    assert.ok(embed.iframeSnippet.includes('<iframe'));
  });
});
