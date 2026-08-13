/**
 * Phoenix v21.0: Multimodal Live AI Judge Defense & Rubric Grilling Engine
 * 
 * Simulates intense 5-stage hackathon judge rounds evaluating technical architecture,
 * live demo recovery, vocal conviction, and venture defensibility.
 */

const JUDGE_PERSONAS = {
  TECH_LEAD: { name: 'Dr. Marcus Vance (Staff Architect)', focus: 'Concurrency, Database Sharding, Latency, SPOFs', skepticism: 'High' },
  VENTURE_VC: { name: 'Elena Rostova (Principal Partner at Tier-1 VC)', focus: 'Market Size (TAM), Monetization, Moat, Unit Economics', skepticism: 'Very High' },
  PRODUCT_JUDGE: { name: 'Aarav Mehta (Head of Product Design)', focus: 'User Experience, Accessibility, Friction, Retention', skepticism: 'Medium' }
};

class MultimodalJudgeDefenseEngine {
  /**
   * Conducts a simulated judge round cross-examination.
   * 
   * @param {Object} input
   * @param {string} input.projectTitle - Hackathon project name
   * @param {string} input.techStack - Architecture and tools
   * @param {string} input.candidateResponse - Student's spoken or written answer to judge question
   * @param {number} input.currentRound - 1 to 5
   * @param {Object} input.voiceProsody - Spoken audio metrics (confidence, WPM, fillers)
   * @returns {Object} Comprehensive Judge Evaluation & Next Defense Round
   */
  evaluateDefense(input = {}) {
    const {
      projectTitle = 'Phoenix Platform',
      techStack = 'Node.js, React, WebRTC, Vector RAG, MongoDB',
      candidateResponse = '',
      currentRound = 1,
      voiceProsody = { confidenceIndex: 80, fillerDensityPercent: 1.5, wpm: 135 }
    } = input;

    const roundNumber = Math.min(5, Math.max(1, parseInt(currentRound) || 1));
    const cleanResponse = candidateResponse.trim().toLowerCase();
    const words = cleanResponse.split(/\s+/).filter(Boolean);

    // 1. Technical Depth Scoring
    let techDepthScore = 50;
    const technicalKeywords = ['webrtc', 'crdt', 'latency', 'concurrency', 'sharding', 'cache', 'security', 'token', 'throughput', 'redundant', 'indexing', 'vector', 'rag', 'redis', 'architecture', 'distributed', 'database', 'pipeline'];
    let techMatches = 0;
    technicalKeywords.forEach(kw => {
      if (cleanResponse.includes(kw)) techMatches++;
    });
    techDepthScore += Math.min(45, techMatches * 7);
    if (words.length < 15) techDepthScore -= 20;
    techDepthScore = Math.max(10, Math.min(100, techDepthScore));

    // 2. Commercial / Moat Defensibility
    let moatScore = 55;
    const businessKeywords = ['users', 'retention', 'monetization', 'moat', 'api', 'pricing', 'b2b', 'enterprise', 'scale', 'efficiency', 'cost', 'market', 'free', 'active', 'traffic', 'scaling'];
    let bizMatches = 0;
    businessKeywords.forEach(kw => {
      if (cleanResponse.includes(kw)) bizMatches++;
    });
    moatScore += Math.min(45, bizMatches * 7);
    moatScore = Math.max(10, Math.min(100, moatScore));

    // 3. Multimodal Voice Conviction
    const vocalConviction = Math.round(((voiceProsody.confidenceIndex || 75) * 0.6) + (Math.max(0, 100 - (voiceProsody.fillerDensityPercent || 2) * 10) * 0.4));

    // 4. Composite Judge Rubric Score (0-100)
    const compositeScore = Math.round((techDepthScore * 0.4) + (moatScore * 0.3) + (vocalConviction * 0.3));

    // Generate Dynamic Next Round Judge Question
    const nextQuestions = [
      { round: 1, judge: JUDGE_PERSONAS.TECH_LEAD, question: `How does ${projectTitle} guarantee sub-second response times when 10,000 users connect simultaneously?` },
      { round: 2, judge: JUDGE_PERSONAS.VENTURE_VC, question: `What prevents a competitor from cloning your exact feature set over a weekend? What is your proprietary moat?` },
      { round: 3, judge: JUDGE_PERSONAS.TECH_LEAD, question: `Walk us through what happens if your primary database connection drops during a live demo.` },
      { round: 4, judge: JUDGE_PERSONAS.PRODUCT_JUDGE, question: `What is the single highest-friction point in your onboarding flow, and how did you measure it?` },
      { round: 5, judge: JUDGE_PERSONAS.VENTURE_VC, question: `If given $100k in prize funding today, what is your exact 6-month roadmap to 100,000 monthly active users?` }
    ];

    const currentJudge = nextQuestions[roundNumber - 1].judge;
    const nextRoundObj = roundNumber < 5 ? nextQuestions[roundNumber] : null;

    let verdict = 'Needs Defense Refinement';
    if (compositeScore >= 85) verdict = 'Grand Prize Contender (Top 5% Pitch)';
    else if (compositeScore >= 70) verdict = 'Track Finalist (Strong Execution)';
    else if (compositeScore >= 50) verdict = 'Solid Prototype (Needs Tradeoff Polish)';

    return {
      projectTitle,
      roundNumber,
      evaluatingJudge: currentJudge,
      rubricScores: {
        technicalDepth: techDepthScore,
        businessMoat: moatScore,
        vocalConviction,
        compositeScore
      },
      verdict,
      judgeFeedback: compositeScore >= 75
        ? `Impressive technical articulation of ${techStack}. Your live conviction was sharp.`
        : `Answer was slightly generic. Cite specific architectural tradeoffs or unit economics to convince the panel.`,
      nextRound: nextRoundObj ? {
        roundNumber: nextRoundObj.round,
        judge: nextRoundObj.judge,
        question: nextRoundObj.question
      } : { status: 'DEFENSE_COMPLETE', message: 'All 5 Judge Cross-Examination Rounds Completed.' }
    };
  }
}

const multimodalJudgeDefenseEngine = new MultimodalJudgeDefenseEngine();
module.exports = { MultimodalJudgeDefenseEngine, multimodalJudgeDefenseEngine, JUDGE_PERSONAS };
