/**
 * Hackathon Project Explainer & Judge Defense Engine
 * Generates slide scripts, architecture flow walkthroughs, and Q&A defense answers for judges.
 */

const { callAI } = require('../../utils/aiRouter');

async function generateProjectExplainer({ projectTitle, techStack, projectDescription, targetTrack = 'AI/ML' }) {
  const systemPrompt = `You are a World-Champion Hackathon Pitch Coach. Produce a complete "Explainer Package" for the project. Include:
1. 30-Second Elevator Pitch Hook
2. Project Architecture & Data Flow Breakdown (Step-by-step)
3. Presenter Script matching a 5-slide deck
4. Judge Q&A Defense Blueprint (Answers to 4 toughest judge questions).`;

  const fallbackGenerator = () => {
    return JSON.stringify({
      elevatorPitch: `Meet ${projectTitle}! An intelligent platform built with ${techStack.join(', ')} that solves ${projectDescription}. Designed for scale, security, and seamless user onboarding.`,
      architectureFlow: [
        "1. Client Layer: Responsive web frontend captures user inputs & triggers authenticated REST API calls.",
        "2. Security & Routing Layer: Hardened Express gateway with rate limiting and prompt injection shields.",
        "3. Core AI Processing: Multi-provider AI router dispatches vector embeddings and model completions.",
        "4. Storage & Persistence Layer: MongoDB database maintains user state, project telemetry, and scores."
      ],
      presenterScript: [
        { slide: "Slide 1: The Problem", duration: "30s", script: "Good morning judges! Today 80% of developers face massive friction when transitioning from learning to real-world building. Here is why existing solutions fail..." },
        { slide: "Slide 2: Our Solution", duration: "45s", script: `Introducing ${projectTitle}. We built a unified platform using ${techStack.join(', ')} to automate and gamify this entire journey.` },
        { slide: "Slide 3: Technical Architecture", duration: "45s", script: "Under the hood, our architecture utilizes multi-provider AI fallbacks and asynchronous task queuing to guarantee 99.9% uptime." },
        { slide: "Slide 4: Live Demo", duration: "40s", script: "Let's look at the live demo. In just two clicks, a user can run a full simulation and get instant AI feedback." },
        { slide: "Slide 5: Business Impact & Future", duration: "20s", script: "With a B2B talent pipeline model, we project zero marginal cost per user and high enterprise recurring value. Thank you!" }
      ],
      judgeDefenseQa: [
        {
          question: "How does your system handle high user concurrency during peak hackathon submissions?",
          answer: "We implemented sliding-window rate limiting, asynchronous background task queuing, and local procedural AI fallbacks so requests never block the main looper thread."
        },
        {
          question: "Why did you choose your specific tech stack instead of alternative frameworks?",
          answer: `We selected ${techStack.slice(0, 2).join(' and ')} for their high throughput, rich ecosystem, and minimal overhead during rapid prototyping.`
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

  const userPrompt = `Project: ${projectTitle}\nTech Stack: ${techStack.join(', ')}\nDescription: ${projectDescription}\nTrack: ${targetTrack}`;

  const aiText = await callAI({
    prompt: userPrompt,
    systemPrompt,
    timeoutMs: 5000,
    fallbackGenerator
  });

  try {
    return JSON.parse(aiText);
  } catch (e) {
    return JSON.parse(fallbackGenerator());
  }
}

module.exports = { generateProjectExplainer };
