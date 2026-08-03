/**
 * Phoenix v9.0: Hackathon Pitch Deck & Presenter Blueprint Generator Engine
 * 
 * Generates structured 5-slide presenter scripts, timing allocations,
 * architectural highlights, and Q&A defense cheat sheets for judge rounds.
 */

/**
 * Generates a complete 5-slide pitch presenter blueprint.
 * 
 * @param {Object} input
 * @param {string} input.projectTitle - Project name
 * @param {string} input.problemStatement - Problem being solved
 * @param {Array<string>} input.techStack - Array of tech stack tools
 * @param {string} input.targetTrack - Hackathon prize track e.g. 'AI & Machine Learning'
 * @returns {Object} Structured 5-Slide Presenter Blueprint
 */
function generatePitchDeckBlueprint(input = {}) {
  const {
    projectTitle = 'Phoenix Platform',
    problemStatement = 'Developers struggle to connect interview prep with real hackathon projects.',
    techStack = ['Node.js', 'React', 'MongoDB', 'AI'],
    targetTrack = 'General Innovation'
  } = input;

  const stackString = techStack.join(', ');

  const slides = [
    {
      slideNumber: 1,
      title: 'Slide 1: Hook & Problem Statement',
      durationSeconds: 30,
      presenterScript: `Hello judges! Today, millions of engineering students face a major hurdle: ${problemStatement} Existing static study portals don't offer real-world project building practice.`,
      keyBulletPoints: [
        `Core Pain Point: Disconnected placement study and project building`,
        `Target User Group: Engineering students and job seekers`,
        `Market Urgency: High competition requiring proven project experience`
      ]
    },
    {
      slideNumber: 2,
      title: `Slide 2: Introducing ${projectTitle}`,
      durationSeconds: 45,
      presenterScript: `Meet ${projectTitle} — an autonomous career acceleration engine designed specifically for the ${targetTrack} track. We turn static study into dynamic, turn-based simulations.`,
      keyBulletPoints: [
        `Value Proposition: Autonomous prep & hackathon simulation`,
        `Target Track Alignment: ${targetTrack}`,
        `Key Differentiator: Multi-provider AI dispatch with zero-crash procedural fallback`
      ]
    },
    {
      slideNumber: 3,
      title: 'Slide 3: Technical Architecture & Stack',
      durationSeconds: 45,
      presenterScript: `Architecturally, ${projectTitle} is built on ${stackString}. We incorporate Zero-Trust security headers, prompt injection shields, and an in-memory LRU response cache for optimal performance.`,
      keyBulletPoints: [
        `Core Stack: ${stackString}`,
        `Security & Safety: Prompt Injection Shield & XSS Sanitization`,
        `Efficiency: In-memory LRU cache saving ~60% API quota`
      ]
    },
    {
      slideNumber: 4,
      title: 'Slide 4: Live Demo Walkthrough & Impact Metrics',
      durationSeconds: 45,
      presenterScript: `In our live demonstration, watch how candidate responses get instant prosody analysis, real-time peer matching with AI safety-nets, and 6-axis skill radar matrix updates.`,
      keyBulletPoints: [
        `Live Feature Demo: AI Speech Prosody & System Design SLA Evaluator`,
        `Telemetry Index: 0-100% Placement Readiness Score`,
        `User Impact: 100% test coverage backed by automated Node.js native test runner`
      ]
    },
    {
      slideNumber: 5,
      title: 'Slide 5: Future Roadmap & Q&A Defense',
      durationSeconds: 15,
      presenterScript: `Looking forward, we are deploying WebRTC low-latency streaming and automated E2E DOM test harnesses. Thank you, and we welcome your questions!`,
      keyBulletPoints: [
        `Next Phase: WebRTC P2P streaming and Playwright test harness`,
        `Scalability Goal: Multi-region DB replication`,
        `Call to Action: Try ${projectTitle} live today!`
      ]
    }
  ];

  const totalDurationSeconds = slides.reduce((acc, slide) => acc + slide.durationSeconds, 0);

  return {
    projectTitle,
    targetTrack,
    totalSlides: slides.length,
    totalDurationSeconds,
    recommendedPitchDurationMinutes: '3 Minutes',
    slides,
    judgeQADefenseCheatSheet: [
      { question: 'How do you prevent AI model hallucination?', answer: 'We enforce strict schema parsing guards via parseAIJson and fall back to verified structured local templates.' },
      { question: 'What is your security posture?', answer: 'We implement zero-trust Bearer token validation, prompt injection shields, and payload ceilings capped at 50KB.' }
    ]
  };
}

module.exports = { generatePitchDeckBlueprint };
