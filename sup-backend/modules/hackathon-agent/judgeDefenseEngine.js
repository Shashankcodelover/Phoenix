/**
 * Phoenix OS: Pillar 2 • Feature 25
 * Live Demo Defense & Tough Judge Q&A Simulator Engine
 *
 * Simulates real-time multi-agent judge defense against Principal Systems Architects,
 * Security Directors, and Tier-1 VC Partners, providing live scoring, critiques,
 * and final podium probability scorecards.
 */

const JUDGE_PANEL = [
  {
    round: 1,
    roundTitle: 'Round 1: Architecture & Technical Feasibility',
    judgeName: 'Dr. Sanjay Sen',
    judgeTitle: 'Principal Systems Architect (Ex-Google / Cloudflare)',
    avatar: '👨‍💻',
    focus: 'Concurrency, Data Sharding, Microservices & Cache Coherence',
    promptQuestion: 'Your architecture relies heavily on WebSockets and third-party LLM APIs. If 50,000 concurrent emergency dispatch requests hit your gateway simultaneously and the LLM API experiences a 1.2-second latency spike, how does your system prevent catastrophic cascading thread pool starvation?'
  },
  {
    round: 2,
    roundTitle: 'Round 2: Security, Isolation & Failure Stress Test',
    judgeName: 'Elena Rostova',
    judgeTitle: 'Head of Cybersecurity & Threat Research',
    avatar: '👩‍🔬',
    focus: 'Zero-Trust, Prompt Injections, Data Isolation & Memory Safety',
    promptQuestion: 'In a multi-tenant environment handling sensitive telemetry and PII, what cryptographic guardrails prevent an adversary from performing an indirect prompt injection attack through unstructured user distress inputs?'
  },
  {
    round: 3,
    roundTitle: 'Round 3: Unit Economics, Defensibility & Market Moat',
    judgeName: 'Marcus Sterling',
    judgeTitle: 'General Partner at Apex Seed Fund',
    avatar: '💼',
    focus: 'TAM, CAC/LTV, Defensibility & Competitive Moat vs Incumbents',
    promptQuestion: 'What prevents AWS, Google Cloud, or an incumbent enterprise vendor from releasing this exact feature set as a native cloud add-on next quarter? Where is your structural, defensible moat?'
  }
];

const PRESET_DEFENSE_PROJECTS = [
  {
    id: 'disaster_swarm_defense',
    title: 'Aegis: Autonomous Disaster Relief Swarm',
    track: 'AI for Social Good & Emergency Infrastructure',
    description: 'Decentralized Edge LLM Mesh operating over peer-to-peer LoRa radio networks for sub-second disaster triage without cloud connectivity.',
    techStack: 'Gemini 1.5 Flash, Supabase pgvector, Next.js 14, WebSockets, Fastify, Redis',
    sampleAnswers: [
      'We engineered a non-blocking reactive gateway using Fastify with an adaptive token bucket circuit breaker. When downstream LLM latency exceeds 400ms, requests automatically fall back to an in-memory quantized heuristic classifier hosted directly in the edge Node process, maintaining 100k QPS at < 25ms P99 with zero thread starvation.',
      'All incoming telemetry passes through an isolated zero-trust input sanitizer and a local dual-model validator that decouples data payload fields from prompt instructions using strict JSON schema boundaries and AES-256 field-level envelope encryption.',
      'Our moat is our proprietary decentralized peer-to-peer mesh coordination protocol and offline edge state synchronization algorithms, which run on zero-bandwidth hardware where centralized hyperscalers cannot function.'
    ]
  },
  {
    id: 'oncomatch_defense',
    title: 'OncoMatch: ZK Clinical Trials Platform',
    track: 'Biotech Innovation & Privacy-Preserving AI',
    description: 'Zero-knowledge cryptographic patient matching platform connecting cancer patients with experimental oncology trials with zero HIPAA exposure.',
    techStack: 'Polygon ID, Claude 3.5 Sonnet, Supabase RLS, Next.js 14, SnarkJS',
    sampleAnswers: [
      'We run verifiable zk-SNARK circuits entirely in the client browser using WebAssembly. The central server only receives cryptographic verification proofs (32-byte hashes), eliminating database sharding bottlenecks and sensitive state synchronization entirely.',
      'Zero HIPAA or patient PII ever leaves the client machine. The zero-knowledge proof verifies boolean trial eligibility constraints without disclosing medical records, making database breaches mathematically incapable of exposing health identities.',
      'Our moat stems from bilateral hospital network effects and patent-pending multi-variant clinical protocol compilation circuits that reduce zk-proof generation time from minutes to under 800 milliseconds.'
    ]
  }
];

class JudgeDefenseEngine {
  /**
   * Return judge panel and preset projects
   */
  getPresets() {
    return {
      judgePanel: JUDGE_PANEL,
      projects: PRESET_DEFENSE_PROJECTS
    };
  }

  /**
   * Evaluate a single defense round
   */
  evaluateDefenseRound(payload = {}) {
    const {
      projectId = 'disaster_swarm_defense',
      round = 1,
      candidateAnswer = ''
    } = payload;

    const judge = JUDGE_PANEL.find(j => j.round === round) || JUDGE_PANEL[0];
    const text = (candidateAnswer || '').toLowerCase();

    // Round scoring heuristics
    let roundScore = 82;
    let critique = '';
    let mood = 'IMPRESSED';

    if (round === 1) {
      if (text.includes('circuit breaker') || text.includes('fallback') || text.includes('heuristic') || text.includes('reactive') || text.includes('p99')) {
        roundScore = 95;
        critique = 'Excellent architectural grasp. Isolating LLM latency with a local heuristic circuit breaker proves enterprise-grade reliability.';
        mood = 'HIGHLY_IMPRESSED';
      } else if (text.length > 50) {
        roundScore = 85;
        critique = 'Reasonable approach, though you should specify exact timeout thresholds and queuing backpressure mechanisms.';
        mood = 'SATISFIED';
      } else {
        roundScore = 65;
        critique = 'Vague response. Did not quantify concurrency limits or provide concrete fallback strategies.';
        mood = 'SKEPTICAL';
      }
    } else if (round === 2) {
      if (text.includes('zero-trust') || text.includes('sanitiz') || text.includes('encryption') || text.includes('isolation') || text.includes('schema')) {
        roundScore = 94;
        critique = 'Robust security defense. Strict schema boundaries and client-side encryption prevent payload injection effectively.';
        mood = 'HIGHLY_IMPRESSED';
      } else {
        roundScore = 78;
        critique = 'Acceptable baseline, but ensure you address prompt escaping and defense-in-depth sanitization.';
        mood = 'CAUTIOUS';
      }
    } else {
      if (text.includes('moat') || text.includes('network effect') || text.includes('patent') || text.includes('proprietary') || text.includes('margin')) {
        roundScore = 96;
        critique = 'Sharp venture conviction. Demonstrating structural defensibility beyond just code solves the classic Big Tech clone risk.';
        mood = 'CONVINCED';
      } else {
        roundScore = 80;
        critique = 'Good ambition, but focus more on data compounding flywheels and switching costs.';
        mood = 'SKEPTICAL';
      }
    }

    const nextJudge = JUDGE_PANEL.find(j => j.round === round + 1);

    return {
      success: true,
      data: {
        roundEvaluated: round,
        judge: judge.judgeName,
        judgeTitle: judge.judgeTitle,
        avatar: judge.avatar,
        score: roundScore,
        critique,
        mood,
        hasCompletedAllRounds: round >= 3,
        nextRound: nextJudge ? {
          round: nextJudge.round,
          roundTitle: nextJudge.roundTitle,
          judgeName: nextJudge.judgeName,
          judgeTitle: nextJudge.judgeTitle,
          avatar: nextJudge.avatar,
          question: nextJudge.promptQuestion
        } : null
      }
    };
  }

  /**
   * Generate comprehensive final judge verdict scorecard
   */
  generateFinalVerdict(payload = {}) {
    const {
      projectTitle = 'Aegis Platform',
      averageScore = 94
    } = payload;

    return {
      success: true,
      data: {
        projectTitle,
        compositeDefenseScore: averageScore,
        podiumProbability: `${Math.min(99, Math.round(averageScore * 1.02))}% Grand Prize Odds`,
        verdict: averageScore >= 90 ? 'UNANIMOUS_PODIUM_WINNER' : 'TOP_3_TRACK_FINALIST',
        verdictColor: averageScore >= 90 ? '#10b981' : '#38bdf8',
        panelRemarks: [
          'Dr. Sanjay Sen: Technical depth is rare for a 36-hour sprint. Flawless backpressure design.',
          'Elena Rostova: Threat modeling and data isolation satisfy enterprise zero-trust standards.',
          'Marcus Sterling: Compelling structural moat. High probability of raising seed round post-hackathon.'
        ],
        investorReadinessScore: '96 / 100 (Silicon Valley Demo Day Standard)'
      }
    };
  }
}

const judgeDefenseEngine = new JudgeDefenseEngine();

module.exports = {
  JudgeDefenseEngine,
  judgeDefenseEngine,
  JUDGE_PANEL,
  PRESET_DEFENSE_PROJECTS
};