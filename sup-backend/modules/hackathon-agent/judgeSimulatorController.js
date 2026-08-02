/**
 * Phoenix v7.0: Live AI Judge Defense Simulator Controller
 * 
 * Simulates a live, multi-round technical & business defense against a world-class
 * hackathon judge panel (combining Google, VC, and Senior Architect personas).
 * 
 * 3 Defense Rounds:
 *   1. Architecture & Tech Choice Defense
 *   2. Concurrency & Failure Stress Test
 *   3. Business Viability & Unit Economics
 */

const { callAIForFeature, parseAIJson } = require('../../config/aiProvider');

/**
 * Conduct a live judge defense simulation round or generate final scorecard.
 * @route POST /api/v1/agent/judge-defense-sim
 */
const runJudgeDefenseSim = async (req, res) => {
  try {
    const {
      projectTitle,
      projectDescription,
      techStack = [],
      targetTrack = 'AI/ML & Cloud',
      currentRound = 1,
      userAnswer = '',
      history = []
    } = req.body;

    if (!projectTitle || !projectDescription) {
      return res.status(400).json({ message: 'projectTitle and projectDescription are required.' });
    }

    const stackList = Array.isArray(techStack) ? techStack.join(', ') : techStack;

    // Final Round (Round 4): Produce Final Verdict Scorecard
    if (currentRound > 3) {
      return generateFinalJudgeVerdict(req, res, { projectTitle, projectDescription, stackList, targetTrack, history });
    }

    // Determine Judge Persona & Prompt based on current round
    let roundTitle = '';
    let judgePersona = '';
    let systemInstruction = '';

    if (currentRound === 1) {
      roundTitle = 'Round 1: Tech Stack & Architecture Justification';
      judgePersona = 'Principal Systems Architect (Ex-Google)';
      systemInstruction = `You are a tough, world-class Principal Systems Architect judging a hackathon pitch.
Examine the project architecture and choice of tech stack (${stackList}).
Ask 1 sharp, direct question challenging why they picked this tech stack over standard alternatives and how their architecture handles state management.`;
    } else if (currentRound === 2) {
      roundTitle = 'Round 2: Concurrency & Failure Stress Test';
      judgePersona = 'Senior Infrastructure & Security Director';
      systemInstruction = `You are a strict Infrastructure Director judging a hackathon pitch.
Evaluate the user's previous answer and challenge them on scaling, high concurrency (100,000 requests/sec), data persistence failures, or security injection vulnerabilities.
Critique their previous response in 2 sentences, then ask 1 tough stress-test question.`;
    } else {
      roundTitle = 'Round 3: Business Model & Unit Economics';
      judgePersona = 'Venture Capital Partner & Product Lead';
      systemInstruction = `You are a VC Partner judging a hackathon pitch.
Evaluate the project's market potential, user acquisition strategy, and monetization model.
Critique their previous response in 2 sentences, then ask 1 final question on customer acquisition cost (CAC) or how this project scales post-hackathon.`;
    }

    const prompt = `
Project: "${projectTitle}"
Track: "${targetTrack}"
Tech Stack: ${stackList}
Description: "${projectDescription}"

Conversation History So Far:
${JSON.stringify(history, null, 2)}

User's Latest Defense Answer: "${userAnswer}"

Respond in strict JSON:
{
  "round": ${currentRound},
  "roundTitle": "${roundTitle}",
  "judgePersona": "${judgePersona}",
  "critique": "2-3 sentences evaluating the user's answer so far (or opening statement for Round 1)",
  "nextQuestion": "The single sharp question for this round",
  "scoreToDate": number (0-100 estimate based on defense quality)
}
Return raw JSON only. Do not wrap in markdown code blocks.`;

    const fallbackGenerator = () => {
      return JSON.stringify({
        round: currentRound,
        roundTitle,
        judgePersona,
        critique: currentRound === 1 
          ? `Welcome team! ${projectTitle} looks interesting on paper.` 
          : `Solid points raised regarding ${stackList}, but let me push harder on reliability.`,
        nextQuestion: currentRound === 1
          ? `Why did you select ${stackList} for ${projectTitle} instead of a standard microservices setup?`
          : currentRound === 2
          ? `If 50,000 users hit your endpoint simultaneously during a live demo, where is the bottleneck?`
          : `What is your cost per active user, and how will you monetize post-hackathon?`,
        scoreToDate: 85
      });
    };

    let resultData;
    try {
      const result = await callAIForFeature(
        'conversational',
        prompt,
        systemInstruction,
        true,
        fallbackGenerator
      );
      resultData = parseAIJson(result.text);
    } catch (err) {
      resultData = JSON.parse(fallbackGenerator());
    }

    res.json({
      projectTitle,
      round: currentRound,
      simState: resultData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Internal Helper: Generate final 0-100 verdict scorecard after Round 3.
 */
async function generateFinalJudgeVerdict(req, res, { projectTitle, projectDescription, stackList, targetTrack, history }) {
  const prompt = `
Analyze the complete 3-round judge defense conversation for:
Project: "${projectTitle}"
Track: "${targetTrack}"
Tech Stack: ${stackList}

Defense History:
${JSON.stringify(history, null, 2)}

Produce a final comprehensive Judge Verdict Scorecard in strict JSON:
{
  "overallScore": number (0-100),
  "verdict": "CHAMPION | RUNNER_UP | HONORABLE_MENTION | REJECTED",
  "scoreBreakdown": {
    "technicalDepth": number (0-100),
    "architectureScale": number (0-100),
    "defenseClarity": number (0-100),
    "businessViability": number (0-100)
  },
  "judgeSummary": "3-4 sentence comprehensive feedback from the panel",
  "keyStrengths": ["strength1", "strength2", "strength3"],
  "criticalGaps": ["gap1", "gap2"],
  "trophyBadge": "🏆 Hackathon Champion | 🥈 Silver Medalist | 📜 Finalist Certificate"
}
Return raw JSON only.`;

  const fallbackVerdict = () => {
    return JSON.stringify({
      overallScore: 88,
      verdict: "RUNNER_UP",
      scoreBreakdown: {
        technicalDepth: 90,
        architectureScale: 85,
        defenseClarity: 88,
        businessViability: 84
      },
      judgeSummary: `Strong technical defense for ${projectTitle}. The team demonstrated deep understanding of ${stackList} and handled scaling questions well.`,
      keyStrengths: ["Clear architectural trade-offs", "Solid concurrency mitigation", "Practical MVP scope"],
      criticalGaps: ["Monetization strategy needs enterprise refinement", "Needs automated regression tests"],
      trophyBadge: "🥈 Silver Medalist"
    });
  };

  let verdictData;
  try {
    const result = await callAIForFeature(
      'analytical',
      prompt,
      'You are a senior hackathon judge panel chairperson. Return strict raw JSON only.',
      true,
      fallbackVerdict
    );
    verdictData = parseAIJson(result.text);
  } catch (err) {
    verdictData = JSON.parse(fallbackVerdict());
  }

  res.json({
    projectTitle,
    round: 4,
    isCompleted: true,
    verdictScorecard: verdictData
  });
}

module.exports = { runJudgeDefenseSim };
