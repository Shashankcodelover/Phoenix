/**
 * Phoenix AI Bot Controller
 * Universal Assistant Backend Endpoint
 */

const express = require('express');
const router = express.Router();
const aiProvider = require('../modules/aiProvider');

const SYSTEM_PROMPT = `
You are Phoenix Copilot, an elite AI Career & Hackathon Assistant for the Phoenix Platform built to Google Senior Staff Engineer standards.
You help engineering students with interview prep, hackathons, roadmaps, ATS resumes, system design, and platform navigation.

Your goal is to answer the user's query AND optionally return an actionable command to execute on the frontend interface.

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

Possible Actions you can return in your response:
1. {"type": "NAVIGATE", "payload": "/interview-prep/practice.html"}
2. {"type": "TOGGLE_THEME"}
3. {"type": "SHOW_STATS"}
4. {"type": "NONE"}

ALWAYS respond in valid JSON matching this exact structure:
{
  "text": "Your helpful, concise, encouraging response to the user.",
  "action": { "type": "ACTION_TYPE", "payload": "OPTIONAL_PAYLOAD" }
}
`;

router.post('/assistant', async (req, res) => {
  try {
    const { query, currentPath, userProfile } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const contextMessage = `
Current Page Location: ${currentPath || 'Unknown'}
User Context: Name=${userProfile?.name || 'Developer'}, TargetRole=${userProfile?.targetRole || 'Software Engineer'}, XP=${userProfile?.xp || 0}, Level=${userProfile?.level || 1}
User Message: "${query}"
`;

    const prompt = `${SYSTEM_PROMPT}\n\n${contextMessage}\n\nRespond ONLY with the JSON format.`;
    
    let rawReply = await aiProvider.generateText(prompt);
    
    // Clean up codeblock markers if Gemini wraps JSON in ```json
    rawReply = rawReply.replace(/```json/gi, '').replace(/```/g, '').trim();

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(rawReply);
    } catch (parseErr) {
      parsedResponse = {
        text: rawReply,
        action: { type: 'NONE' }
      };
    }

    res.json(parsedResponse);
  } catch (err) {
    console.error('[BotController Error]:', err);
    res.status(500).json({
      text: "I'm having trouble connecting to my central neural network right now. Please ensure server.js is running!",
      action: { type: 'NONE' }
    });
  }
});

module.exports = router;
