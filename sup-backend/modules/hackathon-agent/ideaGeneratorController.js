/**
 * Phoenix V20: AI Hackathon Idea Generator Controller
 * 
 * Endpoints:
 *   POST /api/agent/generate-ideas  — Generate top 10 winning project ideas for a hackathon
 *   POST /api/agent/refine-ideas    — Refine existing ideas with extra constraints/instructions
 */

const { callAIForFeature, parseAIJson } = require('../../config/aiProvider');
const { ideaCache } = require('../../middleware/responseCache');


// ──────────────────────────────────────────────
// FALLBACK_IDEAS Removed to prevent silent degradation. AI failures will now propagate properly as 503 errors.

// V21: Hackathon RAG Service
const ragService = require('./rag_service');

/**
 * @desc    Generate top 10 hackathon winning ideas using AI
 * @route   POST /api/agent/generate-ideas
 * @access  Public
 */
const generateIdeas = async (req, res) => {
  try {
    const {
      hackathonName = 'General Hackathon',
      hackathonDescription = '',
      rules = '',
      constraints = '',
      teamSkills = [],
      teamSize = 4,
      duration = '24 hours'
    } = req.body;

    // Check response cache first (saves ~60% API quota)
    const cacheKey = ideaCache.generateKey('ideas', { hackathonName, teamSkills, duration, constraints });
    const cached = ideaCache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, cached: true, cacheStats: ideaCache.getStats() });
    }

    // Retrieve active related hackathons & winner blueprints from RAG catalog
    const queryContext = `${hackathonName} ${hackathonDescription} ${rules}`;
    const retrievedHacks = ragService.retrieveHackathons(queryContext, 2);
    const retrievedWinners = ragService.retrieveWinnerSolutions(queryContext, 2);

    let ideas;

    try {
      const prompt = `
You are an elite hackathon strategist who has mentored teams that won at Google, Microsoft, Amazon, and MLH hackathons.

A team is entering this hackathon:
- **Hackathon Name:** ${hackathonName}
- **Description:** ${hackathonDescription}
- **Rules & Theme:** ${rules}
- **Constraints/Restrictions:** ${constraints}
- **Team Skills:** ${teamSkills.join(', ') || 'Full-stack web development'}
- **Team Size:** ${teamSize}
- **Duration:** ${duration}

RETRIEVED RAG CONTEXT (PAST HACKATHON WINNER BLUEPRINTS):
The following real-world winning solutions were retrieved from our Hall-of-Fame database:
${JSON.stringify(retrievedWinners, null, 2)}

RETRIEVED ACTIVE COMPETITIONS CONTEXT:
${JSON.stringify(retrievedHacks, null, 2)}

Generate exactly 10 unique, innovative, REAL-WORLD problem-solving project ideas that would WIN this hackathon. Draw structural inspiration from the retrieved winning blueprints to build unbeatable, award-worthy projects.

For each idea, include:
- rank (1-10, 1 being the strongest)
- title (catchy, professional project name)
- description (3-4 sentences explaining the product, target users, and how it works)
- techStack (array of specific technologies — not vague like "frontend framework")
- whyItWins (1-2 sentences on why judges would pick this over 500 other submissions)
- uniqueAngle (the ONE differentiating feature that makes this idea impossible to ignore)

CRITICAL RULES:
1. Ideas must be BUILDABLE within ${duration} by ${teamSize} people
2. Each idea must solve a REAL problem that affects real people
3. No generic "todo app" or "weather app" level ideas — these must be HACKATHON WINNING caliber
4. Prioritize ideas that combine technical depth with social impact
5. Stay WITHIN the hackathon rules and constraints provided

Return a strict JSON object: { "ideas": [...] }
Do not wrap in markdown code blocks.
`;

      const result = await callAIForFeature(
        'creative',
        prompt,
        'You are the world\'s best hackathon idea strategist. Return strict raw JSON only.',
        true,
        JSON.stringify({ ideas: FALLBACK_IDEAS })
      );

      const parsed = parseAIJson(result.text);
      ideas = parsed.ideas;
      
      if (!ideas || !Array.isArray(ideas)) {
        throw new Error('AI response did not contain valid ideas array');
      }
    } catch (apiErr) {
      console.error('AI provider unavailable for idea generation:', apiErr.message);
      return res.status(503).json({ message: 'AI Service Unavailable. Please try again later.' });
    }

    const responsePayload = {
      message: `Generated ${ideas.length} winning ideas for "${hackathonName}"`,
      hackathonName,
      ideas
    };

    // Store in cache for future requests
    ideaCache.set(cacheKey, responsePayload);

    res.json(responsePayload);
  } catch (error) {
    console.error('Idea generation error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Refine existing ideas with extra constraints/instructions
 * @route   POST /api/agent/refine-ideas
 * @access  Public
 */
const refineIdeas = async (req, res) => {
  try {
    const {
      existingIdeas = [],
      extraInstructions = '',
      extraConstraints = '',
      hackathonName = 'General Hackathon'
    } = req.body;

    if (!extraInstructions && !extraConstraints) {
      return res.status(400).json({ message: 'Provide extraInstructions or extraConstraints to refine ideas.' });
    }

    let refinedIdeas;

    try {
      const prompt = `
You are an elite hackathon strategist. A team has reviewed these initial ideas:

${JSON.stringify(existingIdeas.slice(0, 10), null, 2)}

They want REFINED ideas based on these additional instructions:
- **Extra Instructions:** ${extraInstructions}
- **Extra Constraints:** ${extraConstraints}
- **Hackathon:** ${hackathonName}

Generate 10 NEW refined ideas that incorporate these extra requirements.
Keep the same JSON format: { "ideas": [{ rank, title, description, techStack, whyItWins, uniqueAngle }] }
Return strict JSON only.
`;

      const result = await callAIForFeature(
        'creative',
        prompt,
        'You are a hackathon idea refinement specialist. Return strict raw JSON only.',
        true
      );

      const parsed = parseAIJson(result.text);
      refinedIdeas = parsed.ideas;
      
      if (!refinedIdeas || !Array.isArray(refinedIdeas)) {
        throw new Error('AI response did not contain valid ideas array');
      }
    } catch (apiErr) {
      console.error('AI provider unavailable for refinement:', apiErr.message);
      return res.status(503).json({ message: 'AI Service Unavailable. Please try again later.' });
    }

    res.json({
      message: `Refined ${refinedIdeas.length} ideas with new constraints for "${hackathonName}"`,
      hackathonName,
      ideas: refinedIdeas
    });
  } catch (error) {
    console.error('Idea refinement error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateIdeas,
  refineIdeas
};
