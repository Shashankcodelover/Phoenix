/**
 * Phoenix OS: Pillar 2 • Feature 24
 * 3-Minute VC Demo Pitch Deck Generator & Slide Structurer Engine
 *
 * Generates calibrated 5-slide demo decks tailored for 3-minute hackathon judge presentations,
 * with precise second-by-second presenter scripts, Marp markdown, and judge defense cheat sheets.
 */

const BENCHMARK_PITCH_PRESETS = [
  {
    id: 'disaster_swarm_pitch',
    title: 'Aegis: Autonomous Disaster Relief Swarm',
    tagline: 'Decentralized Edge LLM Mesh for Sub-Second Emergency Triage',
    track: 'Google Gemini AI & Cloud Infrastructure Track',
    targetAudience: 'Emergency Operations Centers, FEMA, First Responders',
    problem: 'During hurricanes and earthquakes, 911 dispatchers miss 40% of distress calls due to circuit saturation. Central cloud AI fails when fiber backbones sever.',
    solution: 'Aegis deploys autonomous Gemini edge worker swarms over peer-to-peer LoRa radio mesh, triaging 10,000 casualties per second without internet.',
    techStack: 'Google Gemini 1.5 Flash, Supabase pgvector, Next.js 14, WebSockets, Fastify',
    tam: '$18B Global Disaster Management & Public Safety Market',
    bounties: ['Google Cloud AI Bounty', 'Supabase Realtime Bounty']
  },
  {
    id: 'clinical_trial_pitch',
    title: 'OncoMatch: Zero-Knowledge HealthTech Co-Pilot',
    tagline: 'Verifiable Patient-to-Trial Matching with Zero PII Exposure',
    track: 'Biotech Innovation & Privacy-Preserving AI',
    targetAudience: 'Oncology Research Centers, Pharmaceutical Sponsors',
    problem: '80% of oncology trials miss enrollment targets, delaying life-saving therapies by 18 months and costing $1.3B per drug candidate.',
    solution: 'OncoMatch uses zero-knowledge cryptographic proofs to verify patient eligibility criteria against clinical trial protocols without leaking HIPAA records.',
    techStack: 'Polygon ID ZK-Proofs, Anthropic Claude 3.5, Supabase RLS, Next.js',
    tam: '$44B Global Clinical Trials Market',
    bounties: ['Polygon Zero-Knowledge Bounty', 'Supabase Security Bounty']
  },
  {
    id: 'zk_settlement_pitch',
    title: 'SubZero: Sub-Second Micro-Payment Rails',
    tagline: 'Instant Stablecoin Cross-Border Settlement with Zero Intermediary Margin',
    track: 'Fintech & Developer Tooling Track',
    targetAudience: 'Global Freelancers, Open Source Maintainers, Remote Contractors',
    problem: 'Cross-border contractors lose 8-11% of earnings to correspondent banking spreads and wait up to 5 business days for bank clearance.',
    solution: 'SubZero combines Stripe Treasury with Circle USDC rails to execute atomic cross-border payouts in 850ms with 0.1% transaction cost.',
    techStack: 'Stripe Treasury API, Circle Programmable Wallets, Fastify, Redis Streams',
    tam: '$156T Global Cross-Border Payments Flow',
    bounties: ['Stripe Infrastructure Bounty', 'Circle USDC Bounty']
  }
];

class VcPitchDeckEngine {
  /**
   * Return benchmark pitch presets
   */
  getPresets() {
    return BENCHMARK_PITCH_PRESETS;
  }

  /**
   * Generate 5-slide deck, Marp markdown, presenter cues, and judge Q&A defense
   */
  generateDeck(payload = {}) {
    const {
      title = 'Phoenix MVP',
      tagline = 'Autonomous Hackathon Innovation Engine',
      track = 'General Innovation',
      problem = 'Teams fail to translate hackathon ideas into winning pitch presentations.',
      solution = 'A calibrated 3-minute VC pitch engine with second-by-second teleprompter pacing.',
      techStack = 'Next.js 14, FastAPI, PostgreSQL, Redis',
      tam = '$10B Addressable Market',
      bounties = ['Sponsor AI Bounty']
    } = payload;

    const slides = [
      {
        slideNumber: 1,
        title: 'The Bleeding Neck Problem',
        timing: '0:00 - 0:30 (30 Seconds)',
        durationSeconds: 30,
        headline: 'A Broken Status Quo Costing Lives & Billions',
        bulletPoints: [
          `Urgent Market Pain: ${problem.substring(0, 100)}...`,
          'Status Quo Flaw: Centralized monolithic legacy software breaks under real-world pressure.',
          'The Urgency: Every hour of delay increases financial and human loss by 18%.'
        ],
        presenterScript: `Judges, imagine a crisis where every single second counts, but the system you rely on fails. ${problem} Today, current solutions are too slow, too fragmented, and completely fail under load. That changes right now.`,
        keyVisual: 'Red metric highlight displaying catastrophic latency & financial loss.'
      },
      {
        slideNumber: 2,
        title: `Introducing ${title}`,
        timing: '0:30 - 1:15 (45 Seconds)',
        durationSeconds: 45,
        headline: tagline,
        bulletPoints: [
          `Breakthrough Innovation: ${solution.substring(0, 110)}...`,
          `Target Track Alignment: Engineered specifically to dominate the ${track}.`,
          'The Unfair Advantage: Sub-second response times with 100% offline fallback resilience.'
        ],
        presenterScript: `Meet ${title} — ${tagline}. Unlike incumbents that take minutes to respond, our architecture handles high-throughput requests in under 100 milliseconds, giving operators instantaneous situational clarity.`,
        keyVisual: 'Split comparison visual: Incumbent vs Phoenix speedup diagram.'
      },
      {
        slideNumber: 3,
        title: 'Turnkey Technical Architecture',
        timing: '1:15 - 2:00 (45 Seconds)',
        durationSeconds: 45,
        headline: 'Built for Production Scalability from Day Zero',
        bulletPoints: [
          `Production Stack: ${techStack}`,
          `Sponsor APIs Integrated: ${bounties.join(' • ')}`,
          'Reliability SLA: Microservice topology with circuit breaker failovers & sub-50ms P99.'
        ],
        presenterScript: `Under the hood, we didn't just build a prototype — we engineered an enterprise-grade system. Powered by ${techStack}, we integrated ${bounties.join(' and ')} to deliver hardened security and instant state synchronization.`,
        keyVisual: 'Clean ASCII / SVG microservice topology flowchart with latency budgets.'
      },
      {
        slideNumber: 4,
        title: 'Live Product Demonstration',
        timing: '2:00 - 2:45 (45 Seconds)',
        durationSeconds: 45,
        headline: 'Real-Time Verification: From Ingestion to Action',
        bulletPoints: [
          'Step 1: Ingests unstructured multimodal data stream in < 80ms.',
          'Step 2: Autonomous ReAct agent synthesizes optimal dispatch resolution.',
          'Step 3: Dispatches verified webhook action with cryptographic audit trail.'
        ],
        presenterScript: `Now watch our live application in action. As I trigger this event, observe how the system ingests the telemetry, executes the agent loop, and produces a verified result in real time with zero lag.`,
        keyVisual: 'Live embedded product screen with real-time WebSocket state ticker.'
      },
      {
        slideNumber: 5,
        title: 'Market Opportunity & Grand Vision',
        timing: '2:45 - 3:00 (15 Seconds)',
        durationSeconds: 15,
        headline: `${tam} — Scalable B2B Unit Economics`,
        bulletPoints: [
          `Total Addressable Market: ${tam}`,
          'Go-To-Market: B2B Enterprise API licensing with high-margin recurring SaaS.',
          'Next 30 Days: Deploying private beta across 5 pilot partners.'
        ],
        presenterScript: `We are attacking a ${tam}. We have built the technology, verified the architecture, and we are ready to scale. Thank you, and we welcome your questions!`,
        keyVisual: 'Market size TAM/SAM circles with pilot partner pipeline.'
      }
    ];

    // Marp Markdown Document
    const marpMarkdown = `---
marp: true
theme: gaia
_class: lead
paginate: true
backgroundColor: #070d18
color: #f8fafc
---

# 🚀 ${title}
### ${tagline}
**Track:** ${track} • **TAM:** ${tam}

---

## ⚡ Slide 1: The Urgent Problem (0:00 - 0:30)
* **Core Pain Point:** ${problem}
* **Current Defect:** Legacy systems fail to scale, causing massive operational friction.
* **Why Now:** Cloud API breakthroughs make real-time edge processing possible for the first time.

---

## 💡 Slide 2: The Solution (0:30 - 1:15)
### ${tagline}
* **The Breakthrough:** ${solution}
* **Unfair Advantage:** 10x faster execution with zero dependency on fragile monolithic servers.
* **Track Fit:** Built from the ground up for ${track}.

---

## 🏛️ Slide 3: Technical Architecture (1:15 - 2:00)
* **Full-Stack:** ${techStack}
* **Sponsor Integrations:** ${bounties.join(', ')}
* **Latency Budget:** Sub-100ms P99 SLA with Redis caching & distributed fault tolerance.

---

## 📱 Slide 4: Live Demonstration (2:00 - 2:45)
* Instant ingestion of real-world payload.
* Autonomous agentic decision matrix execution.
* Verifiable audit log with cryptographic signing.

---

## 📈 Slide 5: Market Traction & Unit Economics (2:45 - 3:00)
* **TAM:** ${tam}
* **Business Model:** Usage-based API tiers + Enterprise SLAs.
* **Ask:** Looking for design partners and seed capital to scale production.
`;

    // Judge Q&A Defense
    const judgeDefense = [
      {
        question: 'How do you handle API rate limits or third-party outages during a crisis?',
        answer: 'We implemented a circuit breaker with an in-memory Redis cache fallback. If the external provider exceeds a 500ms timeout, our offline heuristic engine immediately takes over with zero downtime.'
      },
      {
        question: 'What prevents a well-funded incumbent from copying your solution next quarter?',
        answer: 'Our moat lies in our proprietary data network effects and edge quantization pipeline, which allows sub-100ms inference on commodity hardware without sending raw PII over the wire.'
      },
      {
        question: 'What is your unit economics model when scaling from 100 to 1,000,000 daily queries?',
        answer: 'Our marginal cost per query is $0.0004 due to prompt caching and speculative decoding, yielding an 84% gross margin on our $0.003 tier enterprise API.'
      }
    ];

    return {
      success: true,
      data: {
        title,
        tagline,
        track,
        totalDurationSeconds: 180,
        totalSlides: 5,
        slides,
        marpMarkdown,
        judgeDefense
      }
    };
  }
}

const vcPitchDeckEngine = new VcPitchDeckEngine();

module.exports = {
  VcPitchDeckEngine,
  vcPitchDeckEngine,
  BENCHMARK_PITCH_PRESETS
};