/**
 * Phoenix OS: Pillar 2 • Feature 21
 * Problem Statement Deconstructor & Idea Scoring Engine
 *
 * Deconstructs ambiguous hackathon problem statements into core bottlenecks,
 * evaluates 4-vector viability (Feasibility, Novelty, Sponsor Fit, Judge Wow),
 * and generates minimum viable architectures and sponsor bounty stacking plans.
 */

const PRESET_HACKATHON_PROBLEMS = [
  {
    id: 'disaster_relief_agents',
    title: 'Autonomous Multi-Agent Swarms for Disaster Relief & Triage',
    theme: 'AI for Social Good & Crisis Response',
    targetTrack: 'Google Gemini AI & Cloud Infrastructure Track',
    problemStatement: 'During major floods and earthquakes, emergency dispatchers are overwhelmed with fragmented distress signals across social media, cellular SMS, and drone telemetry. Existing central systems fail due to latency and lack of situational synthesis, leading to misallocated rescue personnel and preventable casualties.',
    targetBounties: ['Google Gemini API', 'Supabase Realtime & pgvector', 'Twilio Emergency Webhooks']
  },
  {
    id: 'clinical_trial_copilot',
    title: 'Agentic HealthTech Co-Pilot for Verifiable Patient Matching',
    theme: 'Healthcare & Precision Medicine',
    targetTrack: 'Biotech Innovation & Privacy-Preserving AI',
    problemStatement: '80% of clinical trials fail to meet enrollment deadlines due to archaic paper criteria and HIPAA privacy silos. Patients miss life-saving experimental cancer treatments while researchers waste billions on delayed trials.',
    targetBounties: ['Anthropic Claude API', 'Supabase Secure Row-Level Security', 'Polygon ZK-Proof ID']
  },
  {
    id: 'cross_border_zk_settlement',
    title: 'Sub-Second Micro-Payment Cross-Border Settlement Engine',
    theme: 'Fintech & Global Commerce',
    targetTrack: 'Next-Gen Financial Rails & Developer Tooling',
    problemStatement: 'Emerging market contractors and open-source maintainers lose 7-12% in FX spread and intermediary bank fees on cross-border micro-payouts, waiting up to 5 business days for bank clearance.',
    targetBounties: ['Stripe Treasury & Connect', 'Circle USDC Rails', 'Fastify / Redis Streams']
  }
];

class IdeaDeconstructorEngine {
  /**
   * Return preset benchmark problem statements
   */
  getPresets() {
    return PRESET_HACKATHON_PROBLEMS;
  }

  /**
   * Deconstruct problem statement and score hackathon idea viability
   */
  deconstructAndScore(payload = {}) {
    const {
      title = 'Custom Hackathon Project',
      problemStatement = '',
      theme = 'Open Innovation',
      targetTrack = 'General Software Track',
      selectedBounties = [],
      teamSize = 4,
      sprintDurationHours = 36
    } = payload;

    const text = `${title} ${problemStatement} ${theme} ${targetTrack}`.toLowerCase();

    // 1. Vector Scoring
    // Technical Feasibility (0-100): Can it be built in 36h without hitting dead ends?
    let feasibilityScore = 88;
    if (text.includes('train custom') || text.includes('hardware robot') || text.includes('new blockchain layer 1')) {
      feasibilityScore = 55; // Overambitious scope trap
    } else if (text.includes('agent') || text.includes('api') || text.includes('stream') || text.includes('realtime')) {
      feasibilityScore = 92;
    }

    // Market Novelty & Differentiation (0-100)
    let noveltyScore = 86;
    if (text.includes('todo') || text.includes('weather') || text.includes('resume builder') || text.includes('generic chatbot')) {
      noveltyScore = 48; // Cliché hackathon project
    } else if (text.includes('swarm') || text.includes('zero-knowledge') || text.includes('clinical') || text.includes('triage')) {
      noveltyScore = 95;
    }

    // Sponsor Bounty Fit (0-100)
    const bountyCount = selectedBounties.length;
    let bountyScore = Math.min(98, 70 + (bountyCount * 9));

    // Judge Wow Factor & Live Demo Memorability (0-100)
    let judgeWowScore = 91;
    if (text.includes('disaster') || text.includes('cancer') || text.includes('settlement') || text.includes('emergency')) {
      judgeWowScore = 96;
    }

    // Composite Calculation (30% Feasibility, 25% Novelty, 25% Bounty, 20% Judge Wow)
    const compositeScore = Math.round(
      (feasibilityScore * 0.30) +
      (noveltyScore * 0.25) +
      (bountyScore * 0.25) +
      (judgeWowScore * 0.20)
    );

    let verdict = 'TIER_1_GRAND_PRIZE_CONTENDER';
    let verdictColor = '#10b981';
    if (compositeScore < 75) {
      verdict = 'NEEDS_STRATEGIC_PIVOT';
      verdictColor = '#f43f5e';
    } else if (compositeScore < 86) {
      verdict = 'COMPETITIVE_TRACK_FINALIST';
      verdictColor = '#38bdf8';
    }

    // Deconstruction Breakdown
    const coreDeconstruction = {
      primaryBottleneck: text.includes('disaster')
        ? 'Fragmented emergency telemetry causing rescue delay and allocation blind spots'
        : (text.includes('clinical') ? 'HIPAA data silos and non-standardized eligibility matching' : 'Exorbitant intermediary FX fees and multi-day settlement latency'),
      targetUsers: text.includes('disaster')
        ? 'First Responders, Incident Commanders, and Displaced Citizens'
        : (text.includes('clinical') ? 'Oncology Clinical Investigators & Chronic Illness Patients' : 'Cross-Border Freelancers & Global Open Source Contributors'),
      killerDifferentiator: text.includes('disaster')
        ? 'Decentralized Edge LLM Swarm operating over mesh radio without internet connectivity'
        : (text.includes('clinical') ? 'Zero-Knowledge Cryptographic Health Proofs matching trials without exposing patient PII' : 'Atomic Sub-Second Stablecoin Settlement with Zero Intermediary FX Margin'),
      hackathonDeathTraps: [
        'Avoid attempting to train custom neural weights during the hackathon sprint — utilize few-shot function calling.',
        'Ensure real-time WebSocket state reflects instantly in the demo UI to wow judges within the first 15 seconds.',
        'Do not spend more than 2 hours configuring CI/CD; focus on live interactive user journey.'
      ]
    };

    // Minimum Viable Architecture Blueprint (MVA)
    const mvArchitecture = {
      frontend: 'Next.js 14 App Router + TailwindCSS + Lucide Icons + Framer Motion (Sub-50ms render)',
      backend: 'Node.js / Express microservices + Fastify Event Gateway + WebSockets',
      aiOrchestration: 'Gemini 1.5 Pro Function Calling + LangChain ReAct Autonomous Agent Loop',
      persistence: 'Supabase PostgreSQL + pgvector for RAG embeddings + Redis for session caching',
      sponsorBountiesTargeted: selectedBounties.length > 0 ? selectedBounties : ['Google Cloud AI Bounty', 'Supabase Realtime Bounty'],
      projectedPrizeStack: `$${(selectedBounties.length || 2) * 5000 + 2500} Total Track Bounties`
    };

    return {
      success: true,
      data: {
        title,
        theme,
        targetTrack,
        compositeScore,
        verdict,
        verdictColor,
        vectors: [
          { name: '36-Hour Technical Feasibility', score: feasibilityScore, weight: '30%', status: feasibilityScore >= 85 ? 'Highly Executable' : 'Scope Risk' },
          { name: 'Market Novelty & Differentiation', score: noveltyScore, weight: '25%', status: noveltyScore >= 85 ? 'Unique Angle' : 'Cliché Risk' },
          { name: 'Sponsor Bounty Alignment', score: bountyScore, weight: '25%', status: bountyScore >= 80 ? 'Multi-Bounty Stacked' : 'Low Sponsor Tie-in' },
          { name: 'Judge Demo Day Wow Factor', score: judgeWowScore, weight: '20%', status: judgeWowScore >= 90 ? 'Standing Ovation Demo' : 'Moderate Appeal' }
        ],
        deconstruction: coreDeconstruction,
        architecture: mvArchitecture,
        meta: {
          sprintDurationHours,
          teamSize,
          calculatedAt: new Date().toISOString()
        }
      }
    };
  }
}

const ideaDeconstructorEngine = new IdeaDeconstructorEngine();

module.exports = {
  IdeaDeconstructorEngine,
  ideaDeconstructorEngine,
  PRESET_HACKATHON_PROBLEMS
};