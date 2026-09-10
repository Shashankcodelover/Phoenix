/**
 * Phoenix Tri-Pillar OS: Pillar 2, Feature 32 — Live Judge Rubric Scorer & Podium Predictor
 * 
 * Simulates grand jury judging points across standard Hackathon Rubrics:
 * 1. Innovation & Originality (25%)
 * 2. Technical Depth & Execution (25%)
 * 3. Real-World Impact & Feasibility (20%)
 * 4. UI/UX Polish & Experience (15%)
 * 5. Pitch Delivery & Q&A Defense (15%)
 * 
 * Calculates Monte Carlo probabilistic podium finish projections (1st, 2nd, 3rd, Track Winner)
 * benchmarked against standard 120-team hackathon cohorts.
 */

const PRESETS = {
  aegis: {
    id: 'aegis',
    name: 'Aegis Swarm (Smart Cities / SIH Grand Prize)',
    projectTitle: 'Aegis Swarm',
    track: 'Smart Cities & Disaster Logistics',
    cohortSize: 120,
    scores: {
      innovation: 25,     // max 25
      technicalDepth: 25, // max 25
      impact: 20,         // max 20
      design: 13,         // max 15
      pitch: 14           // max 15
    },
    techTags: ['Rust', 'ROS2', 'WebAssembly', 'PX4 Autopilot', 'WebRTC Datachannels'],
    description: 'Decentralized Byzantine Fault-Tolerant drone mesh network coordinating offline disaster triage delivery.'
  },
  oncomatch: {
    id: 'oncomatch',
    name: 'OncoMatch ZK (Healthcare / Imagine Cup Finalist)',
    projectTitle: 'OncoMatch ZK',
    track: 'Healthcare & Life Sciences',
    cohortSize: 150,
    scores: {
      innovation: 24,
      technicalDepth: 24,
      impact: 19,
      design: 14,
      pitch: 14
    },
    techTags: ['Circom', 'snarkJS', 'Groth16', 'Next.js 15', 'Gemini 2.5 Pro'],
    description: 'Zero-Knowledge cryptographic clinical trial matcher ensuring zero genomic data leakage.'
  },
  nexusaudio: {
    id: 'nexusaudio',
    name: 'NexusAudio AI (Developer Tools / Grand Prize)',
    projectTitle: 'NexusAudio AI',
    track: 'Developer Tooling & AI Systems',
    cohortSize: 100,
    scores: {
      innovation: 23,
      technicalDepth: 24,
      impact: 18,
      design: 15,
      pitch: 13
    },
    techTags: ['WebRTC Audio', 'Node.js Express 5', 'Redis Cache', 'AST Engine'],
    description: 'Sub-300ms turn-taking AI mock interviewer with live AST static security and anti-pattern auditor.'
  }
};

class JudgeRubricPodiumEngine {
  getPresets() {
    return PRESETS;
  }

  evaluateRubricAndPredictPodium(payload = {}) {
    const {
      projectTitle = 'Aegis Swarm',
      track = 'Grand Prize',
      cohortSize = 120,
      scores = {
        innovation: 24,
        technicalDepth: 24,
        impact: 18,
        design: 14,
        pitch: 14
      }
    } = payload;

    // Normalize and clamp scores
    const inn = Math.min(25, Math.max(0, Number(scores.innovation) || 0));
    const tech = Math.min(25, Math.max(0, Number(scores.technicalDepth) || 0));
    const imp = Math.min(20, Math.max(0, Number(scores.impact) || 0));
    const des = Math.min(15, Math.max(0, Number(scores.design) || 0));
    const pit = Math.min(15, Math.max(0, Number(scores.pitch) || 0));

    const totalScore = Number((inn + tech + imp + des + pit).toFixed(1));

    // Rubric Breakdown
    const rubricBreakdown = [
      {
        pillar: 'Innovation & Originality',
        score: inn,
        maxScore: 25,
        weight: '25%',
        percentage: Math.round((inn / 25) * 100),
        feedback: inn >= 23 
          ? 'Exceptional problem angle with zero direct off-the-shelf equivalents in current hackathon circuit.' 
          : 'Competent concept, but judges may draw comparisons to existing commercial developer platforms.'
      },
      {
        pillar: 'Technical Depth & Execution',
        score: tech,
        maxScore: 25,
        weight: '25%',
        percentage: Math.round((tech / 25) * 100),
        feedback: tech >= 23 
          ? 'Deep systems engineering with real-time protocol handling, low latency guarantees, and robust fault-tolerance.' 
          : 'Frontend looks great, but requires deeper architectural safeguards against edge failure modes.'
      },
      {
        pillar: 'Real-World Impact & Feasibility',
        score: imp,
        maxScore: 20,
        weight: '20%',
        percentage: Math.round((imp / 20) * 100),
        feedback: imp >= 18 
          ? 'Immediate deployability in critical enterprise/governmental workflows with quantifiable metric improvements.' 
          : 'High theoretical impact; articulate unit economics and customer onboarding friction.'
      },
      {
        pillar: 'UI/UX Polish & Interactive Demo',
        score: des,
        maxScore: 15,
        weight: '15%',
        percentage: Math.round((des / 15) * 100),
        feedback: des >= 13 
          ? 'Glassmorphic design tokens, responsive typography, and sub-100ms micro-interactions make live judging effortless.' 
          : 'Refine error feedback toasts and ensure contrast ratios satisfy institutional accessibility standards.'
      },
      {
        pillar: 'Pitch Delivery & Defense Quality',
        score: pit,
        maxScore: 15,
        weight: '15%',
        percentage: Math.round((pit / 15) * 100),
        feedback: pit >= 13 
          ? 'Punchy 120-second problem-solution hook with flawless technical justification during cross-examination.' 
          : 'Rehearse teleprompter cue transitions to ensure demo does not run over the strict buzzer time.'
      }
    ];

    // Markov Monte Carlo Podium Projection
    // Cohort mean mu = 71.5, sigma = 10.8
    // Calculate z-score relative to hackathon distribution
    const mu = 71.5;
    const sigma = 10.8;
    const z = (totalScore - mu) / sigma;

    // Standard Normal CDF approximation (Abramowitz & Stegun)
    const t = 1 / (1 + 0.2316419 * Math.abs(z));
    const d = 0.3989423 * Math.exp(-z * z / 2);
    let p = 1 - d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    if (z < 0) p = 1 - p;

    // Monte Carlo simulation with 10,000 runs against cohort size
    const simulations = 10000;
    let firstPlaceWins = 0;
    let secondPlaceWins = 0;
    let thirdPlaceWins = 0;
    let trackWins = 0;

    // Deterministic pseudo-random seed generator based on totalScore and cohortSize
    let seed = Math.round(totalScore * 100 + cohortSize);
    const pseudoRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    for (let i = 0; i < simulations; i++) {
      let betterTeams = 0;
      for (let j = 0; j < cohortSize - 1; j++) {
        // Box-Muller transform for normal distribution
        const u1 = Math.max(0.0001, pseudoRandom());
        const u2 = pseudoRandom();
        const randNorm = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        const competitorScore = mu + randNorm * sigma;
        if (competitorScore > totalScore) {
          betterTeams++;
        }
      }

      if (betterTeams === 0) firstPlaceWins++;
      else if (betterTeams === 1) secondPlaceWins++;
      else if (betterTeams === 2) thirdPlaceWins++;
      else if (betterTeams <= Math.ceil(cohortSize * 0.08)) trackWins++;
    }

    const firstPlaceProb = Math.min(99.4, Math.max(0.1, Number(((firstPlaceWins / simulations) * 100).toFixed(1))));
    const secondPlaceProb = Math.min(99.4, Math.max(0.1, Number(((secondPlaceWins / simulations) * 100).toFixed(1))));
    const thirdPlaceProb = Math.min(99.4, Math.max(0.1, Number(((thirdPlaceWins / simulations) * 100).toFixed(1))));
    const trackProb = Math.min(99.4, Math.max(0.1, Number(((trackWins / simulations) * 100).toFixed(1))));
    const totalPodiumProb = Math.min(99.9, Math.max(0.2, Number((firstPlaceProb + secondPlaceProb + thirdPlaceProb).toFixed(1))));

    // Simulated Judge Jury Deliberations
    const juryDeliberations = [
      {
        judge: 'Dr. Vikram Rao',
        role: 'Grand Jury Lead & FAANG Principal Architect',
        avatarColor: '#38bdf8',
        verdict: totalScore >= 90 ? 'Strong Champion Endorsement' : 'Conditionally Approved',
        comment: totalScore >= 90
          ? `Outstanding architectural hygiene. The team implemented zero-downtime offline fallbacks and demonstrated clean AST parsing. This is easily in the top 1% of submissions I have audited this season.`
          : `The core idea is promising, but I want to see how the system handles Byzantine nodes under 30% packet loss during live triage routing.`
      },
      {
        judge: 'Elena Rostova',
        role: 'Managing Partner, Frontier Ventures (Tier-1 Seed VC)',
        avatarColor: '#c084fc',
        verdict: totalScore >= 88 ? 'Term Sheet Candidate' : 'High Product Potential',
        comment: totalScore >= 88
          ? `Their TAM positioning is razor-sharp. Instead of a generic hackathon widget, they engineered a defensible data moat with real institutional switching costs.`
          : `Make sure the 120-second demo leads with customer pain and quantifiable cost savings rather than jumping straight into database schemas.`
      },
      {
        judge: 'Marcus Chen',
        role: 'Developer Relations Director (Global Cloud Sponsor)',
        avatarColor: '#10b981',
        verdict: totalScore >= 85 ? 'Track Prize Front-Runner' : 'Eligible for Sponsor Bounty',
        comment: totalScore >= 85
          ? `They didn't just paste an API key; they leveraged deep WebRTC datachannel streaming and distributed Redis caching. Super impressed with SDK integration depth.`
          : `To lock in the sponsor bounty, ensure the GitHub README includes the official sponsor badge and direct reproduction instructions.`
      }
    ];

    // Actionable Rubric Remediation
    const remediationActions = [];
    if (inn < 25) {
      remediationActions.push({
        pillar: 'Innovation',
        gain: `+${25 - inn} pts`,
        action: 'Emphasize the counter-intuitive technical breakthrough in your 15-second elevator pitch hook.'
      });
    }
    if (tech < 25) {
      remediationActions.push({
        pillar: 'Technical Depth',
        gain: `+${25 - tech} pts`,
        action: 'Mount live chaos stress testing to demonstrate sub-300ms recovery during primary node crash.'
      });
    }
    if (imp < 20) {
      remediationActions.push({
        pillar: 'Impact',
        gain: `+${20 - imp} pts`,
        action: 'Cite specific regulatory compliance frameworks (e.g. HIPAA / NDMA guidelines) in the project slide deck.'
      });
    }
    if (des < 15) {
      remediationActions.push({
        pillar: 'Design',
        gain: `+${15 - des} pts`,
        action: 'Add animated SVG telemetry state visualizers to illustrate real-time background task execution.'
      });
    }
    if (pit < 15) {
      remediationActions.push({
        pillar: 'Pitch Defense',
        gain: `+${15 - pit} pts`,
        action: 'Rehearse pre-emptive answers for the top 3 tough judge objections regarding scale and monetization.'
      });
    }

    return {
      success: true,
      projectTitle,
      track,
      cohortSize,
      compositeScore: `${totalScore}/100`,
      numericScore: totalScore,
      percentileRank: `Top ${(Math.max(0.1, (1 - p) * 100)).toFixed(1)}%`,
      statusRating: totalScore >= 92 ? 'Grand Prize Front-Runner' : totalScore >= 82 ? 'Solid Podium Contender' : 'Finalist Candidate',
      rubricBreakdown,
      podiumProjections: {
        firstPlaceGrandPrize: `${firstPlaceProb}%`,
        secondPlaceRunnerUp: `${secondPlaceProb}%`,
        thirdPlaceBronze: `${thirdPlaceProb}%`,
        trackBountyWinner: `${trackProb}%`,
        overallPodiumProbability: `${totalPodiumProb}%`
      },
      juryDeliberations,
      remediationActions
    };
  }
}

const judgeRubricPodiumEngine = new JudgeRubricPodiumEngine();
module.exports = { JudgeRubricPodiumEngine, judgeRubricPodiumEngine };
