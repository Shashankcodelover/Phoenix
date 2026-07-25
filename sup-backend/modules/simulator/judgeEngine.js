/**
 * Judge Simulator Engine
 * 5 Specialized Judge Personalities with custom weight matrices and AI roast generation.
 */

const { callAI } = require('../../utils/aiRouter');

const JUDGES = [
  {
    id: 'vc_investor',
    name: 'Venture Capitalist (Victoria Vance)',
    avatar: '💼',
    weights: { pitch: 0.4, innovation: 0.3, execution: 0.15, design: 0.15 },
    focus: 'Market Opportunity, TAM/SAM, Monetization Strategy'
  },
  {
    id: 'tech_architect',
    name: 'Senior Principal Architect (Dr. Marcus Vance)',
    avatar: '🛠️',
    weights: { execution: 0.45, innovation: 0.25, pitch: 0.15, design: 0.15 },
    focus: 'Database Scalability, API Security, Performance'
  },
  {
    id: 'design_lead',
    name: 'Chief Product Designer (Sarah Lin)',
    avatar: '✨',
    weights: { design: 0.45, pitch: 0.25, innovation: 0.15, execution: 0.15 },
    focus: 'User Onboarding, Micro-animations, Visual Hierarchy'
  },
  {
    id: 'ai_researcher',
    name: 'Lead AI Scientist (Dr. Aris Thorne)',
    avatar: '🧠',
    weights: { innovation: 0.5, execution: 0.25, design: 0.15, pitch: 0.1 },
    focus: 'Novelty of Model Architecture, LLM Agent Autonomy'
  },
  {
    id: 'brutal_roaster',
    name: 'The Brutal Tech Roaster (Gordon Techsy)',
    avatar: '🔥',
    weights: { execution: 0.3, pitch: 0.3, design: 0.2, innovation: 0.2 },
    focus: 'Spotting Over-engineered Hype & Lazy Slide Outlines'
  }
];

async function generateJudgeRoast(judgeId, projectSummary, scores) {
  const judge = JUDGES.find(j => j.id === judgeId) || JUDGES[4];

  const systemPrompt = `You are ${judge.name}, a hackathon judge focused on ${judge.focus}. Evaluate the following project scores (Innovation: ${scores.innovation}, Execution: ${scores.execution}, Design: ${scores.design}, Pitch: ${scores.pitch}, Total: ${scores.total}/100). Deliver a 3-paragraph critique in your distinct voice.`;

  const userPrompt = `Project Title: ${projectSummary.title}\nTech Stack: ${projectSummary.techStack}\nUSP: ${projectSummary.usp}\nFeatures: ${projectSummary.features}`;

  const fallbackGenerator = () => {
    if (scores.total >= 80) {
      return `[${judge.name}]: Impressive work on ${projectSummary.title}! Your execution score of ${scores.execution} and pitch alignment stood out. With minor tweaks to scalable architecture, this could easily win 1st place!`;
    } else if (scores.total >= 60) {
      return `[${judge.name}]: Solid effort on ${projectSummary.title}. The core idea is decent, but your team lost points on technical depth (${scores.execution}/100). Push your tech stack further next time.`;
    }
    return `[${judge.name}]: Look, ${projectSummary.title} has potential, but as it stands, it feels rushed. You scored ${scores.total}/100 overall. Simplify your pitch and focus on one killer feature.`;
  };

  return await callAI({
    prompt: userPrompt,
    systemPrompt,
    timeoutMs: 4000,
    fallbackGenerator
  });
}

module.exports = { JUDGES, generateJudgeRoast };
