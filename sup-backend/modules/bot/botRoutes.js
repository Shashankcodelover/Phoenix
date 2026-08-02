/**
 * Phoenix AI Copilot Bot Controller
 * Universal Assistant Backend Endpoint
 */

const express = require('express');
const router = express.Router();
const { callAIForFeature, parseAIJson } = require('../../config/aiProvider');

const SYSTEM_PROMPT = `
You are Phoenix Copilot, an elite AI Assistant for the Phoenix Career & Hackathon Accelerator platform.
Your goal is to assist engineering students with interview prep, system design, hackathons, team matching, ATS resumes, and platform navigation.

Platform Navigation Map:
- Landing Page: /index.html
- Dashboard: /dashboard/dashboard.html
- Adaptive Syllabus Roadmap: /interview-prep/roadmap.html
- AI Mock Interview Simulator: /interview-prep/practice.html
- Resume Optimizer: /interview-prep/resume.html
- Company Question Bank: /interview-prep/questions.html
- Peer Mock Matching: /interview-prep/peer-match.html
- Schedule & Time Allocator: /interview-prep/planner.html
- Hack-Auto Scraper Agent: /hackathon-agent/agent.html
- Hackathon Command Center: /hackathon-agent/command-center.html
- Hackathon Discovery Feed: /hackathon-agent/view.html
- Team Roster: /hackathon-agent/team.html
- Discord War Room: /hackathon-agent/chat.html
- Portfolio Capture: /hackathon-agent/portfolio.html
- User Profile: /profile/profile.html

Actions you can trigger on the user's interface:
1. {"type": "NAVIGATE", "payload": "/interview-prep/practice.html"}
2. {"type": "TOGGLE_THEME"}
3. {"type": "SHOW_STATS"}
4. {"type": "NONE"}

ALWAYS return a JSON object with this exact schema:
{
  "text": "Your helpful, enthusiastic, professional advice or answer.",
  "action": { "type": "NAVIGATE" | "TOGGLE_THEME" | "SHOW_STATS" | "NONE", "payload": "URL_OR_DATA_STRING" }
}
`;

router.post('/assistant', async (req, res) => {
  try {
    const { query, currentPath, userProfile } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const contextMessage = `
Current Page: ${currentPath || 'Unknown'}
User State: Name=${userProfile?.name || 'Developer'}, TargetRole=${userProfile?.targetRole || 'Software Engineer'}, XP=${userProfile?.xp || 0}, Level=${userProfile?.level || 1}
User Prompt: "${query}"
`;

    const prompt = `${contextMessage}\n\nRespond ONLY with the raw JSON object. Do not include markdown code block syntax.`;
    
    const fallbackObj = JSON.stringify({
      text: "I am Phoenix Copilot. How can I assist you with your hackathon or interview prep today?",
      action: { type: "NONE" }
    });

    const result = await callAIForFeature(
      'quick',
      prompt,
      SYSTEM_PROMPT,
      true,
      fallbackObj
    );

    let parsedResponse;
    try {
      parsedResponse = parseAIJson(result.text);
    } catch (parseErr) {
      parsedResponse = {
        text: result.text,
        action: { type: 'NONE' }
      };
    }

    res.json(parsedResponse);
  } catch (err) {
    console.error('[BotRoutes Error]:', err);
    res.status(500).json({
      text: "Connection to central AI engine interrupted. Please verify backend service availability.",
      action: { type: 'NONE' }
    });
  }
});

module.exports = router;
