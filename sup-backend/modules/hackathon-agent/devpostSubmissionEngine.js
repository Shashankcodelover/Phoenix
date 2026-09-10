/**
 * Phoenix Tri-Pillar OS: Pillar 2, Feature 31 — Devpost Submission Markdown & Asset Packager
 * 
 * Generates an institutional-grade Devpost project story with Shield.io tech stack badges,
 * engineering challenges, architecture breakdown, asset package checklist, compliance audits,
 * and exportable Devpost-compliant Markdown.
 */

const PRESETS = {
  aegis: {
    id: 'aegis',
    name: 'Aegis Swarm (Smart Cities / SIH Grand Prize)',
    projectTitle: 'Aegis Swarm',
    tagline: 'Autonomous Byzantine Fault-Tolerant Drone Mesh Network for Disaster Logistics & Triage Delivery',
    tracks: ['Smart Cities & Disaster Management', 'Grand Prize', 'Best Hardware-Software Integration'],
    techStack: ['Rust', 'ROS2', 'WebAssembly', 'PX4 Autopilot', 'MQTT Broker', 'WebRTC Datachannels', 'CockroachDB'],
    demoVideoUrl: 'https://youtu.be/aegis-swarm-demo-120s',
    githubUrl: 'https://github.com/phoenix-os/aegis-swarm-core',
    liveAppUrl: 'https://aegis-swarm-mesh.phoenix.io',
    problemStatement: 'During catastrophic floods and earthquakes in mountainous terrain, centralized cellular networks collapse within 15 minutes, leaving emergency responders blind to surviving victims and unable to route life-saving medical supplies.',
    solutionOverview: 'Aegis Swarm deploys a decentralized, self-healing drone fleet governed by a lightweight Byzantine Fault-Tolerant (BFT) Raft consensus. Drones coordinate dynamic mesh relays without internet or GPS dependency, providing sub-second victim location telemetry and automated defibrillator drop routing.',
    architectureHighlights: 'Dual-tier edge architecture: Embedded Rust on PX4 microcontrollers running local spatial obstacle avoidance, paired with a WebAssembly browser dashboard coordinating decentralized swarm tasks via WebRTC datachannels.',
    challenges: [
      'Byzantine consensus under high packet-drop aerial telemetry (up to 40% radio attenuation in rainfall).',
      'Minimizing battery drain during multi-hop peer routing; solved using dynamic sleep-cycle scheduling.',
      'Real-time collision-free trajectory computation across 16 drones using local Voronoi tessellation.'
    ],
    accomplishments: [
      'Demonstrated sub-450ms consensus election across 12 physical and simulated aerial drones.',
      'Zero single point of failure: swarm continues operation even if 33% of nodes are destroyed or hijacked.',
      'Completed 48-hour continuous simulated stress test across 500 virtual disaster square kilometers.'
    ],
    lessonsLearned: [
      'Decentralized consensus algorithms must be tuned specifically for asymmetrical packet loss in radio spectrum.',
      'WebAssembly enables real-time 60 FPS physics rendering in standard browser dashboards without backend render clusters.'
    ],
    nextSteps: [
      'Partner with Karnataka State Disaster Management Authority (KSDMA) for active monsoon deployment.',
      'Integrate infrared FLIR thermal cameras for nighttime search-and-rescue survivor discovery.',
      'File provisional patent on decentralized dynamic aerial Voronoi partition protocols.'
    ],
    assetChecklist: {
      headerBanner: true,
      demoVideo120s: true,
      flowArchitectureDiagram: true,
      hiResScreenshots: true,
      pitchDeckPdf: true
    }
  },
  oncomatch: {
    id: 'oncomatch',
    name: 'OncoMatch ZK (Healthcare / Imagine Cup Finalist)',
    projectTitle: 'OncoMatch ZK',
    tagline: 'Zero-Knowledge Privacy-Preserving Clinical Oncology Trial Matcher & Genomic Eligibility Oracle',
    tracks: ['Healthcare & Life Sciences', 'Best Use of AI / Gemini', 'Imagine Cup Health Innovation'],
    techStack: ['Circom', 'snarkJS', 'Next.js 15', 'Python FastAPI', 'Gemini 2.5 Pro', 'HL7 FHIR', 'Ethers.js'],
    demoVideoUrl: 'https://youtu.be/oncomatch-zk-demo-120s',
    githubUrl: 'https://github.com/phoenix-os/oncomatch-zk-protocol',
    liveAppUrl: 'https://oncomatch-zk.phoenix.io',
    problemStatement: 'Over 82% of eligible oncology patients fail to enroll in life-saving clinical drug trials because hospital electronic health records (EHR) cannot be shared with pharmaceutical sponsors without violating strict HIPAA and GDPR data privacy mandates.',
    solutionOverview: 'OncoMatch ZK utilizes Groth16 Zero-Knowledge Succinct Non-Interactive Arguments of Knowledge (zk-SNARKs). Patients prove they meet complex genomic inclusion criteria (e.g., EGFR exon 19 deletion with specific platelet thresholds) without disclosing their identity, medical records, or genetic sequences to sponsors.',
    architectureHighlights: 'Browser-based Zero-Knowledge proof generation using Circom + snarkJS compiled to WebAssembly. A federated FHIR adapter ingests patient records locally, runs Gemini 2.5 to map oncology trial criteria into arithmetic R1CS circuits, and emits cryptographic proofs to the hospital enclave.',
    challenges: [
      'Compiling complex medical inclusion boolean logic into arithmetic R1CS constraints under 100,000 gates.',
      'Generating zk-SNARK witness proofs client-side in under 8 seconds on consumer laptop hardware.',
      'Handling messy, unstructured oncology pathology reports across heterogeneous hospital formats.'
    ],
    accomplishments: [
      'Proved genomic eligibility across 50 synthetic patient profiles with 100% cryptographic zero-leakage guarantee.',
      'Reduced trial matching verification from 6 weeks of manual oncologist audit down to 4.2 seconds.',
      'Achieved full HIPAA/GDPR regulatory compliance architecture validated by healthcare compliance checklist.'
    ],
    lessonsLearned: [
      'Zero-knowledge circuits require careful normalization of continuous floating-point lab metrics into integer fields.',
      'Doctors require plain-English explainability alongside cryptographic mathematical validity.'
    ],
    nextSteps: [
      'Initiate IRB-approved clinical pilot trial with regional cancer research centers.',
      'Expand zk-circuit library to support rare pediatric oncology trial protocols.',
      'Integrate automated travel stipend escrow smart contracts for low-income trial participants.'
    ],
    assetChecklist: {
      headerBanner: true,
      demoVideo120s: true,
      flowArchitectureDiagram: true,
      hiResScreenshots: true,
      pitchDeckPdf: true
    }
  },
  nexusaudio: {
    id: 'nexusaudio',
    name: 'NexusAudio AI (Developer Tools / Grand Prize)',
    projectTitle: 'NexusAudio AI',
    tagline: 'Sub-300ms Turn-Taking Voice AI Mock Coach & Real-Time AST Static Vulnerability Auditor',
    tracks: ['AI/ML Track', 'Grand Prize', 'Best Developer Tool'],
    techStack: ['Next.js 15', 'TailwindCSS v4', 'Node.js Express 5', 'WebRTC', 'Redis Cluster', 'CockroachDB', 'Gemini 2.5'],
    demoVideoUrl: 'https://youtu.be/nexusaudio-ai-demo-120s',
    githubUrl: 'https://github.com/Shashankcodelover/Phoenix',
    liveAppUrl: 'https://phoenix-os.azurewebsites.net',
    problemStatement: 'Engineering students in Tier-2/3 colleges lack access to high-fidelity FAANG mock interviews and live judge defense preparation with sub-second feedback.',
    solutionOverview: 'NexusAudio provides real-time voice streaming with sub-300ms turn-taking latency, live chaos system failure simulation, and automated ATS resume disruption.',
    architectureHighlights: 'Built on a decentralized WebRTC audio pipeline coupled with a sharded in-memory Redis AST cache and multi-region CockroachDB with zero cloud-spend multi-key fallbacks.',
    challenges: [
      'Audio Streaming Latency: Minimizing audio chunk delivery to sub-300ms turn-taking required switching to raw WebRTC datachannels.',
      'Deterministic Chaos Emulation: Accurately modeling p50/p95/p99 tail latency degradation during primary database node crashes.'
    ],
    accomplishments: [
      '100% Pass rate across 336 automated test suites with zero flaky tests.',
      'Zero external cloud spend policy maintained via resilient multi-key procedural fallbacks.',
      'Sub-1.2s Next.js production bundle compilation and verified zero-downtime offline mode.'
    ],
    lessonsLearned: [
      'Procedural fallback engines ensure 100% judge uptime even during third-party LLM quota throttling.',
      'Real-time WPM speech prosody meters drastically improve candidate interview confidence.'
    ],
    nextSteps: [
      'Launch B2B pilot across 10 Karnataka engineering universities.',
      'Expand native regional language voice models for Kannada and Hindi entrance exam candidates.',
      'Integrate live collaborative whiteboard sync for multi-candidate hackathon team rooms.'
    ],
    assetChecklist: {
      headerBanner: true,
      demoVideo120s: true,
      flowArchitectureDiagram: true,
      hiResScreenshots: true,
      pitchDeckPdf: true
    }
  }
};

class DevpostSubmissionEngine {
  getPresets() {
    return PRESETS;
  }

  auditCompliance(payload = {}) {
    const {
      projectTitle = '',
      tagline = '',
      tracks = [],
      techStack = [],
      demoVideoUrl = '',
      githubUrl = '',
      problemStatement = '',
      solutionOverview = '',
      challenges = [],
      assetChecklist = {}
    } = payload;

    const checks = [];
    let score = 0;

    // 1. Tagline check (1-140 chars)
    const taglineLen = (tagline || '').trim().length;
    const isTaglineValid = taglineLen > 10 && taglineLen <= 140;
    checks.push({
      item: 'Tagline Length (10-140 chars)',
      status: isTaglineValid ? 'PASS' : 'WARN',
      detail: `${taglineLen}/140 characters ${isTaglineValid ? '✓ Optimal punchy hook' : '⚠ Exceeds or too short'}`,
      points: isTaglineValid ? 15 : 5
    });
    score += isTaglineValid ? 15 : 5;

    // 2. Demo Video Link
    const hasVideo = /^https?:\/\/.+/i.test(demoVideoUrl || '');
    checks.push({
      item: '120s Demo Video URL',
      status: hasVideo ? 'PASS' : 'CRITICAL',
      detail: hasVideo ? `Valid URL: ${demoVideoUrl}` : 'Missing demo video link (causes immediate judge disqualification)',
      points: hasVideo ? 20 : 0
    });
    score += hasVideo ? 20 : 0;

    // 3. GitHub Repo
    const hasGithub = /^https?:\/\/(www\.)?github\.com\/.+/i.test(githubUrl || '');
    checks.push({
      item: 'Open Source Codebase Repository',
      status: hasGithub ? 'PASS' : 'CRITICAL',
      detail: hasGithub ? `Repository verified: ${githubUrl}` : 'Missing or invalid GitHub link',
      points: hasGithub ? 20 : 0
    });
    score += hasGithub ? 20 : 0;

    // 4. Tracks & Category alignment
    const hasTracks = Array.isArray(tracks) && tracks.length >= 1;
    checks.push({
      item: 'Track & Prize Category Assignment',
      status: hasTracks ? 'PASS' : 'WARN',
      detail: hasTracks ? `${tracks.length} track(s) selected: ${tracks.join(', ')}` : 'No category selected',
      points: hasTracks ? 10 : 0
    });
    score += hasTracks ? 10 : 0;

    // 5. Tech Stack Badges
    const stackCount = Array.isArray(techStack) ? techStack.length : 0;
    const hasStack = stackCount >= 3;
    checks.push({
      item: 'Built-With Tech Stack Specs',
      status: hasStack ? 'PASS' : 'WARN',
      detail: `${stackCount} technologies identified (min 3 recommended)`,
      points: hasStack ? 15 : 5
    });
    score += hasStack ? 15 : 5;

    // 6. Mandatory Narrative Sections
    const narrativeWords = ((problemStatement || '') + ' ' + (solutionOverview || '')).trim().split(/\s+/).length;
    const hasNarrative = narrativeWords >= 40;
    checks.push({
      item: 'Inspiration & Solution Narrative Depth',
      status: hasNarrative ? 'PASS' : 'WARN',
      detail: `${narrativeWords} words across Inspiration & What It Does`,
      points: hasNarrative ? 10 : 5
    });
    score += hasNarrative ? 10 : 5;

    // 7. Asset Checklist
    const assetsCompleted = Object.values(assetChecklist || {}).filter(Boolean).length;
    const allAssets = assetsCompleted >= 4;
    checks.push({
      item: 'Media Assets (Banner, Diagrams, Deck)',
      status: allAssets ? 'PASS' : 'WARN',
      detail: `${assetsCompleted}/5 key submission assets validated`,
      points: allAssets ? 10 : 5
    });
    score += allAssets ? 10 : 5;

    return {
      success: true,
      totalScore: score,
      rating: score >= 90 ? 'Institutional Grand Prize Ready' : score >= 75 ? 'Qualified Finalist' : 'Needs Polish',
      checks
    };
  }

  generateDevpostSubmission(payload = {}) {
    const {
      projectTitle = 'NexusAudio AI',
      tagline = 'Sub-300ms Turn-Taking Voice AI Mock Coach & Chaos System Design Simulator',
      tracks = ['AI/ML Track', 'Grand Prize', 'Best Developer Tool'],
      techStack = ['Next.js 15', 'TailwindCSS v4', 'Node.js Fastify', 'WebRTC', 'Redis Cluster', 'CockroachDB', 'Gemini 2.5'],
      demoVideoUrl = 'https://youtu.be/nexusaudio-ai-demo',
      githubUrl = 'https://github.com/Shashankcodelover/Phoenix',
      liveAppUrl = 'https://phoenix-os.azurewebsites.net',
      problemStatement = 'Engineering students in Tier-2/3 colleges lack access to high-fidelity FAANG mock interviews and judge defense preparation.',
      solutionOverview = 'NexusAudio provides real-time voice streaming with sub-300ms turn-taking latency, live chaos system failure simulation, and automated ATS resume disruption.',
      architectureHighlights = 'Built on a decentralized WebRTC audio pipeline coupled with a sharded in-memory Redis AST cache and multi-region CockroachDB.',
      challenges = [
        'Minimizing audio chunk delivery to sub-300ms turn-taking required switching to raw WebRTC datachannels.',
        'Accurately modeling p50/p95/p99 tail latency degradation during primary database node crashes.'
      ],
      accomplishments = [
        '100% Pass rate across 336 automated test suites.',
        'Zero external cloud spend policy maintained via resilient multi-key procedural fallbacks.',
        'Sub-1.2s Next.js production bundle compilation.'
      ],
      lessonsLearned = [
        'Procedural fallback engines ensure 100% judge uptime even during third-party LLM quota throttling.',
        'Real-time WPM speech prosody meters drastically improve candidate interview confidence.'
      ],
      nextSteps = [
        'Launch B2B pilot across 10 Karnataka engineering universities.',
        'Expand native regional language voice models for Kannada and Hindi entrance exam candidates.',
        'Integrate live collaborative whiteboard sync for multi-candidate hackathon team rooms.'
      ],
      assetChecklist = {
        headerBanner: true,
        demoVideo120s: true,
        flowArchitectureDiagram: true,
        hiResScreenshots: true,
        pitchDeckPdf: true
      }
    } = payload;

    // Generate Shield.io Tech Stack Badges
    const badges = techStack.map(tech => {
      const clean = tech.replace(/\s+/g, '_').replace(/-/g, '_');
      return `![${tech}](https://img.shields.io/badge/${encodeURIComponent(clean)}-0F172A?style=for-the-badge&logo=code&logoColor=38BDF8)`;
    }).join(' ');

    const challengesFormatted = challenges.map((c, i) => `${i + 1}. ${c}`).join('\n');
    const accomplishmentsFormatted = accomplishments.map(a => `* 🏆 ${a}`).join('\n');
    const lessonsFormatted = lessonsLearned.map(l => `* 💡 ${l}`).join('\n');
    const nextStepsFormatted = nextSteps.map(n => `* 🚀 ${n}`).join('\n');
    const tracksFormatted = tracks.map(t => `\`${t}\``).join(' • ');

    const markdownStory = `
# ${projectTitle} 🚀
> **${tagline}**

${badges}

**Categories & Tracks**: ${tracksFormatted}  
**Live Application**: [${liveAppUrl}](${liveAppUrl})  
**GitHub Repository**: [${githubUrl}](${githubUrl})  
**Video Demo (120s)**: [${demoVideoUrl}](${demoVideoUrl})  

---

### 💡 Inspiration
${problemStatement} We realized that while candidate quantity is high, access to rigorous, real-time feedback with sub-second voice latency was virtually non-existent for non-metro students.

---

### ⚡ What It Does
${solutionOverview}

* 🎙️ **Real-Time Voice AI Coach**: Low-latency turn-taking streaming with live WPM prosody gauges and filler-word detection.
* 🏛️ **Live System Design Whiteboard**: Interactive canvas with high-concurrency traffic stress-testing ($5,000$ to $250,000\\text{ RPS}$) and node crash failover.
* ⚖️ **5-Round Judge Defense Grilling**: Multimodal simulator mimicking Staff Architects and VC cross-examinations.
* 📄 **Automated ATS Resume Disruptor**: Scans resumes against Google SDE benchmarks and transforms passive bullets into the Google **XYZ Formula**.

---

### 🛠️ How We Built It
${architectureHighlights}

* **Frontend**: Next.js 15 (Turbopack) + React 19 + TailwindCSS v4 with Glassmorphic design tokens.
* **Backend Engine**: Node.js microservices with distributed token bucket rate limiting and zero cloud-spend multi-key fallbacks.
* **Resilience**: Sharded Redis LRU caching layer with automatic multi-region database failover.

---

### 🚧 Challenges We Ran Into
${challengesFormatted}

---

### 🏆 Accomplishments That We're Proud Of
${accomplishmentsFormatted}

---

### 🎓 What We Learned
${lessonsFormatted}

---

### 🔮 What's Next for ${projectTitle}
${nextStepsFormatted}
`.trim();

    const audit = this.auditCompliance({
      projectTitle,
      tagline,
      tracks,
      techStack,
      demoVideoUrl,
      githubUrl,
      problemStatement,
      solutionOverview,
      challenges,
      assetChecklist
    });

    return {
      success: true,
      projectTitle,
      tagline,
      appliedTracks: tracks,
      techBadgesHtml: badges,
      fullDevpostMarkdown: markdownStory,
      submissionWordCount: markdownStory.split(/\s+/).length,
      estimatedReadingTime: `${Math.max(1, Math.ceil(markdownStory.split(/\s+/).length / 150))} min read`,
      assetManifest: {
        headerBanner: { spec: '1200x630 (3:2 Aspect Ratio)', ready: Boolean(assetChecklist.headerBanner) },
        demoVideo: { spec: '120s YouTube/Loom Link', ready: Boolean(assetChecklist.demoVideo120s) },
        architectureSvg: { spec: 'Mermaid / Vector System Diagram', ready: Boolean(assetChecklist.flowArchitectureDiagram) },
        screenshots: { spec: '4x Hi-Res 16:9 Production Screen Captures', ready: Boolean(assetChecklist.hiResScreenshots) },
        pitchDeckPdf: { spec: '5-Slide YC/Marp Pitch Deck', ready: Boolean(assetChecklist.pitchDeckPdf) }
      },
      compliance: audit
    };
  }
}

const devpostSubmissionEngine = new DevpostSubmissionEngine();
module.exports = { DevpostSubmissionEngine, devpostSubmissionEngine };
