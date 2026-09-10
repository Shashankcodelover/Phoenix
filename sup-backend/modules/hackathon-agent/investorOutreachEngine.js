/**
 * Phoenix Tri-Pillar OS: Pillar 2, Feature 39 — Post-Hackathon Investor Outreach & Seed Pitch Pack
 * 
 * Automatically converts a winning hackathon prototype into a top-tier institutional seed fundraising pack:
 * 1. Executive Angel One-Pager (Y Combinator & Sequoia standard)
 * 2. 10-Slide Seed Pitch Deck Narrative & Data Architecture
 * 3. 3 Hyper-Personalized Outbound Investor Cold Emails (FOMO, Deep-Tech, Forwardable Blurb)
 * 4. Standard YC Post-Money SAFE Term Sheet Structure
 */

const crypto = require('crypto');

const PRESETS = {
  'ai-developer-os': {
    id: 'ai-developer-os',
    companyName: 'Phoenix OS',
    tagline: 'Autonomous Tri-Pillar Operating System for Engineers & Hackathon Builders',
    targetRound: 'Pre-Seed / Seed',
    targetRaiseUsd: 1200000,
    valuationCapUsd: 10000000,
    discountRate: 20,
    problem: 'Engineering teams and student developers waste 70% of hackathon and prototyping cycles on repetitive boilerplate, configuration debt, and fragmented AI tools.',
    solution: 'An integrated autonomous intelligence layer orchestrating real-time interview prep, hackathon defense systems, and admissions navigation with zero manual setup.',
    traction: 'Won 1st Place Grand Champion across multiple tracks; 2,400 active developers in closed beta; 140+ automated verified test suites.',
    tam: '$48B Global Developer Tools & Educational Tech Market',
    sam: '$9.2B AI-Assisted Prototyping & Coding Tools',
    som: '$620M Collegiate Engineering & Hackathon Cohort Ecosystem',
    moat: 'Proprietary AST code generation heuristics, multi-modal failover recovery pipelines, and localized edge agent runtimes.',
    businessModel: 'Freemium for student developers; $49/mo Pro Builder Tier; $499/mo Institutional Enterprise Hackathon & University License.'
  },
  'edge-iot-robotics': {
    id: 'edge-iot-robotics',
    companyName: 'EcoFleet Swarm',
    tagline: 'Decentralized Autonomous Robotics Swarm for Disaster Response & Logistics',
    targetRound: 'Seed Round',
    targetRaiseUsd: 1500000,
    valuationCapUsd: 12000000,
    discountRate: 20,
    problem: 'Emergency response logistics fail during natural disasters due to destroyed cell towers and centralized navigation blackouts.',
    solution: 'A decentralized peer-to-peer robotic swarm communicating via local-first mesh networks with onboard real-time spatial pathfinding.',
    traction: 'CalHacks Grand Winner; 4 successful physical rover field deployments; letter of intent from municipal emergency management agency.',
    tam: '$32B Disaster Management & Autonomous Logistics Market',
    sam: '$5.8B Tactical Disaster Robotics',
    som: '$340M Municipal & NGO Emergency Fleets',
    moat: 'Patent-pending decentralized collision avoidance algorithm and sub-12ms vector consensus.',
    businessModel: 'Hardware-as-a-Service ($2,500/rover) + $150/mo Fleet Telemetry Cloud Subscription.'
  },
  'fintech-zk-privacy': {
    id: 'fintech-zk-privacy',
    companyName: 'VeriPay ZK',
    tagline: 'Zero-Knowledge Cryptographic Invoice Financing & Audit Protocol',
    targetRound: 'Angel / Pre-Seed',
    targetRaiseUsd: 800000,
    valuationCapUsd: 8000000,
    discountRate: 15,
    problem: 'SMEs wait 60-90 days for invoice payment, while invoice factoring firms require invasive financial disclosures that expose customer lists.',
    solution: 'Zero-knowledge proofs mathematically verify receivables authenticity and creditworthiness without revealing invoices, counterparties, or prices.',
    traction: 'ETHDenver Grand Winner; $1.2M in simulated loan volume verified; 3 SME pilot partners committed.',
    tam: '$3.5T Global Invoice Factoring & Trade Finance',
    sam: '$120B Digital Alternative Lending',
    som: '$18M Web3 & Cross-Border SME Settlement',
    moat: 'Custom Groth16 zk-SNARK circuits optimized for mobile browser verification under 1.2 seconds.',
    businessModel: '0.75% transaction origination fee on funded invoices.'
  }
};

class InvestorOutreachEngine {
  constructor() {
    this.presets = PRESETS;
  }

  getPresets() {
    return Object.values(this.presets).map(p => ({
      id: p.id,
      companyName: p.companyName,
      tagline: p.tagline,
      targetRound: p.targetRound,
      targetRaiseUsd: p.targetRaiseUsd,
      valuationCapUsd: p.valuationCapUsd,
      discountRate: p.discountRate,
      traction: p.traction
    }));
  }

  generatePitchPack(inputData = {}) {
    const data = {
      companyName: inputData.companyName || 'My Startup',
      tagline: inputData.tagline || 'Next-generation intelligent platform',
      targetRound: inputData.targetRound || 'Seed',
      targetRaiseUsd: Number(inputData.targetRaiseUsd) || 1000000,
      valuationCapUsd: Number(inputData.valuationCapUsd) || 8000000,
      discountRate: Number(inputData.discountRate) || 20,
      problem: inputData.problem || 'Existing workflows are slow, manual, and cost prohibitive.',
      solution: inputData.solution || 'An automated autonomous system solving the core pain point in seconds.',
      traction: inputData.traction || 'Won 1st place in major hackathon; rapid user adoption.',
      tam: inputData.tam || '$20B Global Addressable Market',
      sam: inputData.sam || '$4B Serviceable Market',
      som: inputData.som || '$300M Beachhead Market',
      moat: inputData.moat || 'Proprietary algorithmic IP and defensible data network effects.',
      businessModel: inputData.businessModel || 'B2B SaaS with tiered monthly subscriptions.'
    };

    const packId = `SEED-PACK-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    // 1. Executive One-Pager
    const onePagerMarkdown = `# Executive Summary: ${data.companyName}
**Tagline:** ${data.tagline}  
**Round:** ${data.targetRound} — Seeking \$${(data.targetRaiseUsd / 1000).toLocaleString()}k on a \$${(data.valuationCapUsd / 1000000).toFixed(1)}M Post-Money SAFE  

---

### 1. The Core Problem
${data.problem}

### 2. Our Solution & Unfair Moat
${data.solution}
- **Defensibility:** ${data.moat}

### 3. Market Size (TAM / SAM / SOM)
- **Total Addressable Market (TAM):** ${data.tam}
- **Serviceable Addressable Market (SAM):** ${data.sam}
- **Serviceable Obtainable Market (SOM):** ${data.som}

### 4. Traction & Momentum
${data.traction}

### 5. Business Model & Unit Economics
${data.businessModel}

### 6. The Ask & Capital Allocation
Raising **\$${(data.targetRaiseUsd / 1000).toLocaleString()}k** to fund 18 months of runway:
- **65% Core Engineering & Product R&D**
- **25% Developer Growth & GTM Acquisition**
- **10% Operations, Legal, & Infrastructure**`;

    // 2. 10-Slide Deck Outline
    const tenSlideDeck = [
      { slide: 1, title: 'Vision & Hook', content: `${data.companyName}: ${data.tagline}` },
      { slide: 2, title: 'The Problem', content: data.problem },
      { slide: 3, title: 'The Solution & Demo', content: data.solution },
      { slide: 4, title: 'Market Opportunity', content: `TAM: ${data.tam} | SOM: ${data.som}` },
      { slide: 5, title: 'Proprietary Technology & Moat', content: data.moat },
      { slide: 6, title: 'Traction & Hackathon Proof', content: data.traction },
      { slide: 7, title: 'Business Model & Unit Economics', content: data.businessModel },
      { slide: 8, title: 'Go-to-Market Engine', content: 'Bottom-up developer PLG + direct institutional partnerships' },
      { slide: 9, title: 'Founding Team & Execution DNA', content: 'Technical founders with proven track record in hackathons and systems engineering' },
      { slide: 10, title: 'The Ask', content: `Raising $${(data.targetRaiseUsd / 1000).toLocaleString()}k on a $${(data.valuationCapUsd / 1000000).toFixed(1)}M Post-Money SAFE` }
    ];

    // 3. 3 Outbound Emails
    const emailTemplates = {
      fomoWinner: {
        subject: `[Fresh Hackathon Grand Winner] ${data.companyName} — Seed Round ($${(data.targetRaiseUsd / 1000).toLocaleString()}k)`,
        body: `Hi [Investor Name],

Our team just won 1st Place Grand Champion at [Hackathon Name] with our project ${data.companyName} (${data.tagline}).

In 36 hours we built a working prototype that:
- Solves: ${data.problem}
- Achieved: ${data.traction}

We're opening a $${(data.targetRaiseUsd / 1000).toLocaleString()}k Pre-Seed round on a $${(data.valuationCapUsd / 1000000).toFixed(1)}M cap SAFE to turn this prototype into the dominant category leader. 40% of the round is already soft-committed by angel mentors from the event.

Would you be open to a 10-minute intro call this Thursday at 2:00 PM PT?

Best,
[Founder Name]
Founder & CEO, ${data.companyName}
Demo Video: [Loom Link]`
      },

      deepTechMoat: {
        subject: `${data.companyName}: Built a defensible moat for ${data.sam.split(' ')[0]}`,
        body: `Hi [Investor Name],

I've been following your thesis on developer infrastructure and early-stage systems bets.

Most solutions in our space suffer because: "${data.problem}".

At ${data.companyName}, we developed an unfair technical advantage: ${data.moat}.

We proved this live on stage at [Hackathon Name], beating out 120+ teams to take the grand prize. We are raising a targeted $${(data.targetRaiseUsd / 1000).toLocaleString()}k seed round and would love to share our technical architecture and 18-month roadmap.

Let me know if you'd like our 1-pager or deck.

Cheers,
[Founder Name]
${data.companyName}`
      },

      forwardableBlurb: {
        subject: `Blurb for intro: ${data.companyName} ($${(data.targetRaiseUsd / 1000).toLocaleString()}k Pre-Seed)`,
        body: `Here is a forwardable blurb for investors:

"${data.companyName} (${data.tagline}) is raising $${(data.targetRaiseUsd / 1000).toLocaleString()}k on a $${(data.valuationCapUsd / 1000000).toFixed(1)}M Post-Money SAFE. They just won 1st Place Grand Champion at [Hackathon], demonstrating a working prototype with ${data.moat}. Targeting a ${data.tam} market with rapid organic developer traction."`
      }
    };

    // 4. Post-Money SAFE Term Sheet Summary
    const safeTermSheet = {
      instrument: 'Y Combinator Post-Money Valuation Cap SAFE',
      investmentAmountUsd: data.targetRaiseUsd,
      valuationCapUsd: data.valuationCapUsd,
      discountRatePercentage: data.discountRate,
      effectiveOwnershipPercentage: Math.round((data.targetRaiseUsd / data.valuationCapUsd) * 1000) / 10,
      proRataRights: 'Standard Major Investor Pro-Rata (investments >= $100k)',
      governance: 'Board Observer rights for lead investor; common founder control preserved'
    };

    return {
      success: true,
      packId,
      createdAt: new Date().toISOString(),
      companyProfile: data,
      onePagerMarkdown,
      tenSlideDeck,
      emailTemplates,
      safeTermSheet
    };
  }
}

const investorOutreachEngine = new InvestorOutreachEngine();
module.exports = { InvestorOutreachEngine, investorOutreachEngine, PRESETS };
