/**
 * Hackathon Project Explainer & Judge Defense Engine (v5.0)
 * Generates slide scripts, architecture flow walkthroughs, competitor differentiation, monetization blueprints, and Q&A defense answers for judges.
 */

const { callAIForFeature, parseAIJson } = require('../../config/aiProvider');

async function generateProjectExplainer({ projectTitle, techStack = [], projectDescription, targetTrack = 'AI/ML' }) {
  const stackList = Array.isArray(techStack) ? techStack : [techStack];

  const systemPrompt = `You are a World-Champion Hackathon Pitch Coach. Produce a complete "Explainer Package" for the project. Return a strict JSON object containing:
1. elevatorPitch: 30-Second Elevator Pitch Hook
2. architectureFlow: Array of step-by-step data flow statements
3. presenterScript: Array of slide objects ({ slide, duration, script }) for a 5-slide deck
4. competitorDifferentiation: Array of 3 points explaining why existing tools fail and why this product wins
5. monetizationBlueprint: 2-3 sentence business model strategy
6. judgeDefenseQa: Array of 4 Q&A objects ({ question, answer }) addressing tough technical & business questions.`;

  const fallbackGenerator = () => {
    return JSON.stringify({
      elevatorPitch: `Meet ${projectTitle}! An intelligent platform built with ${stackList.join(', ')} that solves ${projectDescription}. Designed for scale, security, and zero marginal cost onboarding.`,
      architectureFlow: [
        "1. Client Layer: Responsive web frontend captures user inputs & triggers authenticated REST API calls.",
        "2. Security & Routing Layer: Hardened Express gateway with rate limiting, prompt injection shields, and LRU response caching.",
        "3. Core AI Processing: Multi-provider AI router dispatches vector embeddings and model completions with 0ms fallbacks.",
        "4. Storage & Persistence Layer: MongoDB database maintains user state, project telemetry, and competency scores."
      ],
      presenterScript: [
        { slide: "Slide 1: The Problem", duration: "30s", script: "Good morning judges! Today 80% of developers face massive friction when transitioning from learning to real-world building. Here is why existing solutions fail..." },
        { slide: "Slide 2: Our Solution", duration: "45s", script: `Introducing ${projectTitle}. We built a unified platform using ${stackList.join(', ')} to automate and gamify this entire journey.` },
        { slide: "Slide 3: Technical Architecture", duration: "45s", script: "Under the hood, our architecture utilizes multi-provider AI fallbacks and asynchronous task queuing to guarantee 99.9% uptime." },
        { slide: "Slide 4: Live Demo", duration: "40s", script: "Let's look at the live demo. In just two clicks, a user can run a full simulation and get instant AI feedback." },
        { slide: "Slide 5: Business Impact & Future", duration: "20s", script: "With a B2B talent pipeline model, we project zero marginal cost per user and high enterprise recurring value. Thank you!" }
      ],
      competitorDifferentiation: [
        "Shared Skill Graph — Uniquely connects hackathon project builds directly into interview prep radar scores.",
        "Zero-Cost Architecture — In-memory LRU response caching + multi-provider fallback cascade keeps operating costs at $0.",
        "End-to-End Simulation — Bridges real-time project creation with 8-stage interactive mock interview defense."
      ],
      monetizationBlueprint: "Freemium for students with campus ambassador referral growth. B2B Enterprise tier charges recruiters for verified candidate skill telemetry & automated technical screening.",
      judgeDefenseQa: [
        {
          question: "How does your system handle high user concurrency during peak hackathon submissions?",
          answer: "We implemented sliding-window rate limiting, in-memory LRU response caching, and local procedural AI fallbacks so requests never block the main thread."
        },
        {
          question: "Why did you choose your specific tech stack instead of alternative frameworks?",
          answer: `We selected ${stackList.slice(0, 2).join(' and ') || 'Node.js and Express'} for their high throughput, rich ecosystem, and minimal overhead during rapid prototyping.`
        },
        {
          question: "What prevents prompt injection or malicious code inputs?",
          answer: "All payloads pass through recursive XSS sanitization, a 50KB payload ceiling, and a specialized prompt injection shield before reaching any LLM."
        },
        {
          question: "How do you intend to monetize this project post-hackathon?",
          answer: "Through an enterprise talent board subscription model where recruiters pay for access to verified, anonymized candidate skill snapshots."
        }
      ]
    });
  };

  const userPrompt = `Project: ${projectTitle}\nTech Stack: ${stackList.join(', ')}\nDescription: ${projectDescription}\nTrack: ${targetTrack}`;

  const aiResult = await callAIForFeature(
    'document',
    userPrompt,
    systemPrompt,
    true,
    fallbackGenerator
  );

  try {
    return parseAIJson(aiResult.text);
  } catch (e) {
    return parseAIJson(fallbackGenerator());
  }
}

module.exports = { generateProjectExplainer };
