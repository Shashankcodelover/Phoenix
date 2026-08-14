/**
 * Phoenix Apex Ultra: Feature 28 — Track & Sponsor Bounty Matching Optimizer Engine
 * 
 * Analyzes team tech stack and architecture to identify eligible sponsor bounties (e.g., $5,000 Google Gemini,
 * $3,000 Redis Cache, $4,000 WebRTC) and generates strict sponsor judge compliance rubrics.
 */

const AVAILABLE_SPONSOR_BOUNTIES = [
  {
    sponsor: 'Google Gemini Multimodal AI',
    bountyName: 'Best Production-Grade Gemini 2.5 Real-Time App',
    prizePoolUsd: 5000,
    requiredKeywords: ['gemini', 'multimodal', 'voice', 'ai'],
    complianceRubric: 'Must utilize Gemini API with sub-300ms turn-taking streaming and zero hallucination fallbacks.'
  },
  {
    sponsor: 'Redis In-Memory Data Platform',
    bountyName: 'Best Ultra-Low Latency Caching & Chaos Resilience',
    prizePoolUsd: 3000,
    requiredKeywords: ['redis', 'cache', 'lru', 'cluster'],
    complianceRubric: 'Must demonstrate active Redis cluster caching with 50k+ RPS benchmark proofs in README.'
  },
  {
    sponsor: 'WebRTC & Audio Real-Time Streaming',
    bountyName: 'Best Low-Latency Audio/Video Interactive Experience',
    prizePoolUsd: 4000,
    requiredKeywords: ['webrtc', 'audio', 'stream', 'waveform', 'voice'],
    complianceRubric: 'Must process 16 kHz raw PCM audio stream with real-time dynamic equalizer visualization.'
  }
];

class SponsorBountyMatcherEngine {
  /**
   * Matches team project tags to high-reward sponsor prize pools.
   */
  matchBounties(payload = {}) {
    const {
      projectTags = ['gemini', 'multimodal', 'voice', 'redis', 'cache', 'webrtc', 'nextjs15']
    } = payload;

    const lowerTags = projectTags.map(t => t.toLowerCase());

    const matchedBounties = AVAILABLE_SPONSOR_BOUNTIES.map(bounty => {
      const matchCount = bounty.requiredKeywords.filter(k => lowerTags.includes(k)).length;
      const matchConfidence = matchCount >= 2 ? 'High Match (95%+)' : matchCount === 1 ? 'Partial Match' : 'Unmatched';
      return {
        sponsor: bounty.sponsor,
        bountyName: bounty.bountyName,
        prizeUsd: `$${bounty.prizePoolUsd.toLocaleString()}`,
        prizePoolNumeric: bounty.prizePoolUsd,
        matchConfidence,
        complianceRubric: bounty.complianceRubric,
        isQualified: matchCount >= 2
      };
    });

    const totalEligiblePrizeUsd = matchedBounties
      .filter(b => b.isQualified)
      .reduce((acc, curr) => acc + curr.prizePoolNumeric, 0);

    return {
      success: true,
      matchedBountiesCount: matchedBounties.filter(b => b.isQualified).length,
      totalAddressablePrizePool: `$${totalEligiblePrizeUsd.toLocaleString()} USD`,
      matchedBounties,
      submissionVerificationProtocol: [
        'Ensure sponsor SDK imports are explicitly listed in package.json',
        'Add dedicated #sponsor-integration section in project README.md',
        'Record a dedicated 30-second video demo clip showcasing the sponsor API in action'
      ]
    };
  }
}

const sponsorBountyMatcherEngine = new SponsorBountyMatcherEngine();
module.exports = { SponsorBountyMatcherEngine, sponsorBountyMatcherEngine, AVAILABLE_SPONSOR_BOUNTIES };
