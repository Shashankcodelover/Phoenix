/**
 * Phoenix Hackathon OS: Student Project One-Pager Generator
 * 
 * Generates a concise, actionable 8-section "Student Project One-Pager" document
 * from the locked hackathon idea. Follows a strict industry-standard template:
 * 
 *   1. Idea Title
 *   2. Problem Statement (plain English)
 *   3. The Solution (macro-level)
 *   4. Scope and "No-Gos"
 *   5. Execution Strategy (step-by-step with AI agent tasks)
 *   6. Timeline and Appetite
 *   7. Success Metrics
 *   8. Risks and "Rabbit Holes"
 * 
 * All content is STRICTLY derived from the exact selected idea — zero assumptions.
 */

const { callAIForFeature, parseAIJson } = require('../../config/aiProvider');

/**
 * Generate a Student Project One-Pager from the locked idea.
 * @route POST /api/v1/agent/inception/one-pager
 */
const generateOnePager = async (req, res) => {
  try {
    const {
      ideaTitle = '',
      ideaDescription = '',
      realWorldProblem = '',
      technicalMoat = '',
      targetUsers = '',
      domain = 'AI & Developer Tools',
      hackathonName = 'National Hackathon 2026',
      hackathonDuration = '24 hours',
      teamSize = 1,
      techStack = [],
      deepBlueprint = {}
    } = req.body;

    if (!ideaTitle) {
      return res.status(400).json({ message: 'ideaTitle is required to generate a One-Pager.' });
    }

    const stackList = Array.isArray(techStack) ? techStack.join(', ') : techStack;
    const blueprintContext = deepBlueprint?.systemArchitecture || '';
    const roadmapContext = deepBlueprint?.buildRoadmap24h?.map(r => `${r.phase}: ${r.goal}`).join('\n') || '';

    const systemPrompt = `You are a world-class hackathon mentor and project documentation specialist.
Your task is to generate a concise, ruthlessly prioritized "Student Project One-Pager" document for the given hackathon project idea.

CRITICAL RULES:
1. Write in PLAIN, SIMPLE ENGLISH. No corporate jargon.
2. Be SPECIFIC to the exact project idea provided — do NOT add assumptions or generic filler.
3. The one-pager must be actionable: a student reading it should know EXACTLY what to build and how.
4. Execution Strategy must include concrete step-by-step tasks, including specific AI agent prompts.
5. Scope/No-Gos must explicitly state what NOT to build to prevent scope creep.
6. Return ONLY a valid JSON object with the exact specified structure.`;

    const userPrompt = `Generate a Student Project One-Pager for this exact hackathon idea:

PROJECT CONTEXT:
- Idea Title: "${ideaTitle}"
- Description: "${ideaDescription || realWorldProblem}"
- Real-World Problem: "${realWorldProblem}"
- Technical Moat: "${technicalMoat}"
- Target Users: "${targetUsers}"
- Domain: "${domain}"
- Hackathon: "${hackathonName}" (Duration: ${hackathonDuration})
- Team Size: ${teamSize} member(s)
- Tech Stack: ${stackList || 'To be determined based on idea requirements'}
- System Architecture: "${blueprintContext}"
- Build Roadmap: ${roadmapContext || 'Not yet defined'}

Return a JSON object with this EXACT structure:
{
  "ideaTitle": "The exact project title",
  "problemStatement": "2-4 sentences in plain English explaining the core problem, who experiences it, and why it's important to solve RIGHT NOW. Include specific data points or statistics.",
  "solution": "2-3 sentences describing the macro-level solution. How does it solve the problem? What makes it unique?",
  "scopeAndNoGos": {
    "inScope": ["Feature/task 1 that IS in scope", "Feature/task 2", "Feature/task 3"],
    "noGos": ["Explicit thing 1 that is OUT of scope and WHY", "Thing 2 out of scope", "Thing 3 out of scope"]
  },
  "executionStrategy": [
    {
      "stepNumber": 1,
      "title": "Step title",
      "description": "What to do in this step",
      "isAgentTask": false,
      "agentPrompt": null
    },
    {
      "stepNumber": 2,
      "title": "Agent-assisted coding step",
      "description": "What the AI agent should generate",
      "isAgentTask": true,
      "agentPrompt": "The exact prompt to give to an AI coding agent for this step"
    }
  ],
  "timelineAndAppetite": {
    "totalDuration": "${hackathonDuration}",
    "phases": [
      { "phase": "Phase name", "duration": "X hours", "deliverable": "What should be done by end of this phase" }
    ],
    "hardConstraint": "A single sentence stating the hard time boundary (e.g., 'This is a 24-hour hackathon. Not 2 days.')"
  },
  "successMetrics": [
    "Measurable success criterion 1 (e.g., 'System handles 1000 concurrent users with <200ms response time')",
    "Measurable success criterion 2",
    "Measurable success criterion 3"
  ],
  "risksAndRabbitHoles": [
    {
      "risk": "Description of the risk or hidden complexity",
      "mitigation": "How to avoid spending too much time on this"
    }
  ]
}`;

    try {
      const aiResponse = await callAIForFeature('creative', userPrompt, systemPrompt, true);
      const parsed = parseAIJson(aiResponse?.text || aiResponse);

      if (parsed && parsed.ideaTitle && parsed.problemStatement) {
        return res.json({
          success: true,
          isLiveAiGenerated: true,
          onePager: parsed,
          generatedAt: new Date().toISOString()
        });
      }
    } catch (aiErr) {
      console.warn('[OnePager] AI generation failed, using deterministic fallback:', aiErr.message);
    }

    // Deterministic fallback
    const fallback = generateFallbackOnePager({
      ideaTitle, ideaDescription, realWorldProblem, technicalMoat,
      targetUsers, domain, hackathonDuration, teamSize, stackList, deepBlueprint
    });

    return res.json({
      success: true,
      isLiveAiGenerated: false,
      onePager: fallback,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('[OnePager] Fatal error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Deterministic fallback One-Pager generator when AI is unavailable.
 */
function generateFallbackOnePager({ ideaTitle, ideaDescription, realWorldProblem, technicalMoat, targetUsers, domain, hackathonDuration, teamSize, stackList, deepBlueprint }) {
  const roadmap = deepBlueprint?.buildRoadmap24h || [];
  const fileTree = deepBlueprint?.recommendedFileTree || [];

  return {
    ideaTitle: ideaTitle || 'Untitled Project',
    problemStatement: realWorldProblem
      ? `${realWorldProblem} This problem directly impacts ${targetUsers || 'end users'} and has significant implications in the ${domain} space. Solving it now is critical because existing solutions fail to address the core latency, cost, or accessibility constraints.`
      : `A critical problem exists in the ${domain} domain where current tools fail to meet performance, cost, or usability requirements for ${targetUsers || 'target users'}. This creates measurable friction and lost productivity.`,
    solution: ideaDescription
      ? `${ideaDescription} The solution leverages ${technicalMoat || 'a novel technical approach'} to deliver breakthrough performance where existing tools fall short.`
      : `${ideaTitle} addresses this gap by implementing ${technicalMoat || 'a novel technical architecture'} that delivers measurable improvements over existing solutions.`,
    scopeAndNoGos: {
      inScope: [
        `Core ${ideaTitle} engine with ${technicalMoat ? technicalMoat.split('.')[0] : 'primary functionality'}`,
        `Basic UI dashboard for ${targetUsers || 'end users'} to interact with the system`,
        `Automated test suite validating core performance claims`,
        `180-second stage pitch demonstration with live working prototype`
      ],
      noGos: [
        'Do NOT build a custom mobile application — focus on web-first responsive UI only',
        'Do NOT attempt to integrate with proprietary third-party APIs that require enterprise licensing',
        'Do NOT spend time on user authentication/authorization — use mock users for the hackathon demo',
        'Do NOT over-engineer deployment — a simple Vercel/Railway deployment is sufficient'
      ]
    },
    executionStrategy: [
      {
        stepNumber: 1,
        title: 'Project Scaffolding & Environment Setup',
        description: `Initialize the monorepo structure with ${stackList || 'the recommended tech stack'}. Set up development environment and install core dependencies.`,
        isAgentTask: true,
        agentPrompt: `Create a new project scaffold for "${ideaTitle}" using ${stackList || 'Next.js, Node.js, and relevant libraries'}. Include package.json, folder structure with src/components/, src/lib/, src/modules/, and a basic README.md.`
      },
      {
        stepNumber: 2,
        title: 'Core Engine Implementation',
        description: `Build the primary ${technicalMoat ? technicalMoat.split('.')[0] : 'core logic'} engine that powers the main value proposition.`,
        isAgentTask: true,
        agentPrompt: `Write the core engine module for "${ideaTitle}" that implements ${technicalMoat || 'the primary business logic'}. Include error handling, input validation, and unit tests.`
      },
      {
        stepNumber: 3,
        title: 'UI Dashboard & Visualization',
        description: `Build the user-facing dashboard that ${targetUsers || 'users'} will interact with during the demo.`,
        isAgentTask: true,
        agentPrompt: `Create a responsive React dashboard for "${ideaTitle}" with real-time data visualization, dark mode support, and live metric counters. Use a professional design system.`
      },
      {
        stepNumber: 4,
        title: 'Integration Testing & Demo Rehearsal',
        description: 'Connect all modules, run integration tests, and rehearse the 180-second stage pitch.',
        isAgentTask: false,
        agentPrompt: null
      }
    ],
    timelineAndAppetite: {
      totalDuration: hackathonDuration || '24 hours',
      phases: roadmap.length > 0
        ? roadmap.map((r, i) => ({
            phase: r.phase || `Phase ${i + 1}`,
            duration: r.phase?.match(/\d+/g)?.join('-') + ' hours' || `${6 * (i + 1)} hours`,
            deliverable: r.goal || `Complete phase ${i + 1} deliverables`
          }))
        : [
            { phase: 'Foundation', duration: '0-6 hours', deliverable: 'Project scaffold, dependencies, and core data models' },
            { phase: 'Core Engine', duration: '6-14 hours', deliverable: 'Primary engine with unit tests passing' },
            { phase: 'UI & Integration', duration: '14-20 hours', deliverable: 'Working dashboard with live data flow' },
            { phase: 'Polish & Pitch', duration: '20-24 hours', deliverable: 'Demo-ready prototype with rehearsed 180s pitch' }
          ],
      hardConstraint: `This is a ${hackathonDuration || '24-hour'} hackathon for a team of ${teamSize}. Every hour counts. Do not scope beyond what can be demonstrated live.`
    },
    successMetrics: [
      `The core ${ideaTitle} engine processes requests with measurable latency under the claimed threshold`,
      `The live demo runs without crashes for the full 180-second stage presentation`,
      `At least 3 judge-facing edge-case questions can be answered with quantified data from the working prototype`,
      `The system handles the expected concurrent user load without degradation`
    ],
    risksAndRabbitHoles: [
      {
        risk: 'Over-engineering the architecture beyond what a hackathon demo requires',
        mitigation: 'Stick to the MVP scope defined in the No-Gos. A working demo beats a perfect architecture.'
      },
      {
        risk: 'Third-party API rate limits or outages during the live demo',
        mitigation: 'Implement local fallback data and cache responses. Never depend on external APIs for the core demo flow.'
      },
      {
        risk: `Spending too much time on UI polish instead of core ${technicalMoat ? 'technical moat' : 'functionality'}`,
        mitigation: 'Use a component library for rapid UI. Focus 70% of time on the core engine, 30% on presentation.'
      },
      {
        risk: 'Venue Wi-Fi instability causing demo failure',
        mitigation: 'Build offline-first where possible. Pre-record a backup demo video as insurance.'
      }
    ]
  };
}

module.exports = { generateOnePager };
