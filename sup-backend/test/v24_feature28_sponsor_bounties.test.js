const { describe, it } = require('node:test');
const assert = require('node:assert');

const { SponsorBountyMatcherEngine, AVAILABLE_SPONSOR_BOUNTIES } = require('../modules/hackathon-agent/sponsorBountyMatcherEngine');

describe('V24 Quality Focus: Feature 28 — Hackathon Track & Sponsor Bounty Matcher Engine', () => {
  const engine = new SponsorBountyMatcherEngine();

  it('matches eligible sponsor tracks and computes $12,000 addressable prize pool', () => {
    const report = engine.matchBounties({
      projectTags: ['gemini', 'multimodal', 'voice', 'redis', 'cache', 'webrtc', 'audio']
    });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.matchedBountiesCount, 3);
    assert.strictEqual(report.totalAddressablePrizePool, '$12,000 USD');
    assert.strictEqual(report.matchedBounties.length, 3);

    const geminiBounty = report.matchedBounties.find(b => b.sponsor.includes('Gemini'));
    assert.ok(geminiBounty);
    assert.strictEqual(geminiBounty.prizeUsd, '$5,000');
    assert.strictEqual(geminiBounty.isQualified, true);
    assert.ok(geminiBounty.complianceRubric.includes('sub-300ms'));
    assert.strictEqual(report.submissionVerificationProtocol.length, 3);
  });
});
