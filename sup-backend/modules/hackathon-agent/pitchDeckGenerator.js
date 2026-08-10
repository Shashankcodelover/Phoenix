/**
 * Phoenix v9.0: Hackathon Pitch Deck & Presenter Blueprint Generator Engine
 * 
 * Generates structured 5-slide presenter scripts, timing allocations,
 * architectural highlights, and Q&A defense cheat sheets for judge rounds.
 * Integrates real LLM generation via aiProvider.
 */

const { callAIForFeature, parseAIJson } = require('../../config/aiProvider');

/**
 * Generates a complete 5-slide pitch presenter blueprint.
 * 
 * @param {Object} input
 * @param {string} input.projectTitle - Project name
 * @param {string} input.problemStatement - Problem being solved
 * @param {Array<string>} input.techStack - Array of tech stack tools
 * @param {string} input.targetTrack - Hackathon prize track e.g. 'AI & Machine Learning'
 * @returns {Promise<Object>} Structured 5-Slide Presenter Blueprint
 */
async function generatePitchDeckBlueprint(input = {}) {
  const {
    projectTitle = 'Phoenix Platform',
    problemStatement = 'Developers struggle to connect interview prep with real hackathon projects.',
    techStack = ['Node.js', 'React', 'MongoDB', 'AI'],
    targetTrack = 'General Innovation'
  } = input;

  const stackString = techStack.join(', ');

  const systemPrompt = `You are a professional hackathon presentation coach.
Create a structured 5-slide pitch deck blueprint in JSON format.
The JSON must have the following structure:
{
  "projectTitle": "string",
  "targetTrack": "string",
  "totalSlides": 5,
  "totalDurationSeconds": 180,
  "recommendedPitchDurationMinutes": "3 Minutes",
  "slides": [
    {
      "slideNumber": number,
      "title": "string",
      "durationSeconds": number,
      "presenterScript": "string",
      "keyBulletPoints": ["string", "string", "string"]
    }
  ],
  "judgeQADefenseCheatSheet": [
    { "question": "string", "answer": "string" }
  ]
}`;

  const prompt = `Generate a 5-slide pitch deck for:
Project Title: ${projectTitle}
Target Track: ${targetTrack}
Tech Stack: ${stackString}
Problem Statement: ${problemStatement}
Make the script engaging, professional, and tailored to the tech stack. Provide 3 likely QA questions.`;

  // Fallback in case of failure
  const fallbackGenerator = () => JSON.stringify({
    projectTitle,
    targetTrack,
    totalSlides: 5,
    totalDurationSeconds: 180,
    recommendedPitchDurationMinutes: '3 Minutes',
    slides: [
      {
        slideNumber: 1,
        title: 'Slide 1: Hook & Problem Statement',
        durationSeconds: 30,
        presenterScript: `Hello judges! Today we are addressing: ${problemStatement}`,
        keyBulletPoints: ['Core Pain Point', 'Target User Group', 'Market Urgency']
      },
      {
        slideNumber: 2,
        title: `Slide 2: Introducing ${projectTitle}`,
        durationSeconds: 45,
        presenterScript: `Meet ${projectTitle} — an autonomous engine designed specifically for the ${targetTrack} track.`,
        keyBulletPoints: ['Value Proposition', `Target Track Alignment: ${targetTrack}`, 'Key Differentiator']
      },
      {
        slideNumber: 3,
        title: 'Slide 3: Technical Architecture & Stack',
        durationSeconds: 45,
        presenterScript: `Architecturally, ${projectTitle} is built on ${stackString}.`,
        keyBulletPoints: [`Core Stack: ${stackString}`, 'Security & Safety', 'Efficiency']
      },
      {
        slideNumber: 4,
        title: 'Slide 4: Live Demo Walkthrough',
        durationSeconds: 45,
        presenterScript: `In our live demonstration, watch how the user interacts with our core features.`,
        keyBulletPoints: ['Live Feature Demo', 'User Impact', 'Performance']
      },
      {
        slideNumber: 5,
        title: 'Slide 5: Future Roadmap & Q&A',
        durationSeconds: 15,
        presenterScript: `Looking forward, we are deploying more features. Thank you, and we welcome your questions!`,
        keyBulletPoints: ['Next Phase', 'Scalability Goal', 'Call to Action']
      }
    ],
    judgeQADefenseCheatSheet: [
      { question: 'What is your tech stack?', answer: `We use ${stackString}` }
    ]
  });

  try {
    const result = await callAIForFeature(
      'creative',
      prompt,
      systemPrompt,
      true
    );

    const parsed = parseAIJson(result.text);
    if (!parsed || !parsed.slides) {
      throw new Error('AI response did not contain valid slide array');
    }
    return parsed;
  } catch (apiErr) {
    console.error('AI provider unavailable for pitch deck generation:', apiErr.message);
    return {
      success: false,
      message: 'AI Service Unavailable. Please try again later.'
    };
  }
}

module.exports = { generatePitchDeckBlueprint };
