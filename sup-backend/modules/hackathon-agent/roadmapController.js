/**
 * Phoenix V20: Project Roadmap & Individual Member Guide Controller
 *
 * Endpoints:
 *   POST /api/agent/project-roadmap  — Generate full project roadmap with task assignments
 *   POST /api/agent/member-guide     — Generate individual A-to-Z build guide for one member
 */

const { callAIForFeature, parseAIJson } = require('../../config/aiProvider');
const { roadmapCache } = require('../../middleware/responseCache');


// ──────────────────────────────────────────────
// FALLBACK DATA
// ──────────────────────────────────────────────
const generateFallbackRoadmap = (projectTitle, teamMembers, durationHours) => {
  const totalPhases = 5;
  const hoursPerPhase = Math.floor(durationHours / totalPhases);

  const phases = [
    {
      phase: 1,
      name: "Foundation & Architecture",
      duration: `${hoursPerPhase} hours`,
      description: "Set up the project repository, initialize the tech stack, design the database schema, and create the system architecture diagram.",
      tasks: teamMembers.map((m, i) => ({
        assignee: m.name || `Member ${i + 1}`,
        task: i === 0
          ? "Initialize Git repo, set up project structure, configure environment variables, and create README"
          : i === 1
          ? "Design and implement database models/schemas with sample seed data"
          : i === 2
          ? "Set up frontend framework boilerplate with routing and navigation structure"
          : "Create API endpoint stubs and configure CORS, middleware, and error handlers",
        priority: "HIGH",
        status: "TODO"
      }))
    },
    {
      phase: 2,
      name: "Core Backend Logic",
      duration: `${hoursPerPhase} hours`,
      description: "Implement the primary business logic, database CRUD operations, authentication, and core API endpoints.",
      tasks: teamMembers.map((m, i) => ({
        assignee: m.name || `Member ${i + 1}`,
        task: i === 0
          ? "Implement authentication flow (signup, login, JWT tokens, middleware guards)"
          : i === 1
          ? "Build core domain API endpoints with input validation and error handling"
          : i === 2
          ? "Integrate third-party APIs and implement data transformation pipelines"
          : "Write database queries, aggregation pipelines, and caching logic",
        priority: "HIGH",
        status: "TODO"
      }))
    },
    {
      phase: 3,
      name: "Frontend UI Development",
      duration: `${hoursPerPhase} hours`,
      description: "Build the user-facing pages, connect frontend to backend APIs, and implement responsive layouts.",
      tasks: teamMembers.map((m, i) => ({
        assignee: m.name || `Member ${i + 1}`,
        task: i === 0
          ? "Build the landing/dashboard page with data visualization components"
          : i === 1
          ? "Create form pages with proper validation, loading states, and error feedback"
          : i === 2
          ? "Implement real-time features (WebSocket connections, live updates, notifications)"
          : "Build profile/settings pages and connect all API endpoints to UI components",
        priority: "MEDIUM",
        status: "TODO"
      }))
    },
    {
      phase: 4,
      name: "Integration & Polish",
      duration: `${hoursPerPhase} hours`,
      description: "Connect all components end-to-end, fix bugs, add error handling, and polish the UI/UX.",
      tasks: teamMembers.map((m, i) => ({
        assignee: m.name || `Member ${i + 1}`,
        task: i === 0
          ? "End-to-end integration testing — verify all user flows work from login to final output"
          : i === 1
          ? "Add loading spinners, toast notifications, empty states, and micro-animations"
          : i === 2
          ? "Mobile responsiveness audit — test and fix layout on tablet and mobile viewports"
          : "Performance optimization — lazy loading, image compression, API response caching",
        priority: "MEDIUM",
        status: "TODO"
      }))
    },
    {
      phase: 5,
      name: "Demo Preparation & Deployment",
      duration: `${hoursPerPhase} hours`,
      description: "Deploy the application, prepare the demo script, create presentation slides, and rehearse the pitch.",
      tasks: teamMembers.map((m, i) => ({
        assignee: m.name || `Member ${i + 1}`,
        task: i === 0
          ? "Deploy backend to cloud (Render/Railway) and frontend to Vercel/Netlify with custom domain"
          : i === 1
          ? "Create 5-slide pitch deck: Problem → Solution → Demo → Tech Architecture → Impact"
          : i === 2
          ? "Record a 2-minute backup demo video in case of live demo failure"
          : "Prepare answers for anticipated judge questions (scalability, monetization, tech choices)",
        priority: "CRITICAL",
        status: "TODO"
      }))
    }
  ];

  return {
    projectTitle,
    totalDuration: `${durationHours} hours`,
    teamSize: teamMembers.length,
    phases,
    winningTips: [
      "Start your demo with the PROBLEM, not the solution — make judges feel the pain first.",
      "Show real data, not lorem ipsum. Seed your database with realistic entries.",
      "Have a fallback demo video recorded in case WiFi dies during presentation.",
      "End your pitch with future roadmap — judges want to see you think beyond the hackathon.",
      "Assign one team member as the 'demo driver' who only presents — don't code during the pitch."
    ]
  };
};

const generateFallbackMemberGuide = (memberName, memberRole, projectTitle) => {
  return {
    memberName,
    role: memberRole,
    projectTitle,
    guide: [
      {
        step: 1,
        title: "Understand the Project Architecture",
        description: `Read the project README and understand how ${projectTitle} works end-to-end. Identify which components are your responsibility based on your role as ${memberRole}.`,
        duration: "30 minutes",
        resources: ["Project README.md", "Architecture diagram", "Team Notion/docs page"]
      },
      {
        step: 2,
        title: "Set Up Your Local Development Environment",
        description: "Clone the repository, install dependencies (npm install / pip install), configure environment variables (.env file), and verify the dev server starts without errors.",
        duration: "20 minutes",
        resources: ["Git", "Node.js/Python", ".env.example file"]
      },
      {
        step: 3,
        title: "Implement Your Core Feature",
        description: `As the ${memberRole}, focus on building your primary assigned feature first. Write clean, modular code with proper error handling. Commit frequently with descriptive messages.`,
        duration: "4-6 hours",
        resources: ["VS Code", "Official documentation for your tech stack", "Stack Overflow"]
      },
      {
        step: 4,
        title: "Test Your Feature Independently",
        description: "Use Postman/Thunder Client to test your API endpoints. Write at least 2 edge-case tests. Verify your component works in isolation before integrating.",
        duration: "1 hour",
        resources: ["Postman", "Browser DevTools", "Console logs"]
      },
      {
        step: 5,
        title: "Integrate with Team Members' Code",
        description: "Pull the latest code from main branch. Resolve merge conflicts carefully. Test the integrated flow end-to-end with at least one teammate watching.",
        duration: "1-2 hours",
        resources: ["Git", "Team communication channel"]
      },
      {
        step: 6,
        title: "Polish & Prepare for Demo",
        description: "Add loading states, error messages, and visual polish to your components. Prepare 2-3 talking points about YOUR contribution for the judge Q&A session.",
        duration: "1 hour",
        resources: ["Design system/CSS file", "Pitch deck"]
      }
    ],
    proTips: [
      "Don't try to learn a new framework during the hackathon — use what you already know.",
      "If stuck for more than 20 minutes, ask a teammate or search Stack Overflow. Don't waste time.",
      "Commit every 30 minutes. Small commits = easy rollback if something breaks.",
      "Keep your code modular — if your feature isn't ready, the team should be able to demo without it."
    ]
  };
};

/**
 * @desc    Generate full project roadmap with per-member task assignments
 * @route   POST /api/agent/project-roadmap
 * @access  Public
 */
const generateProjectRoadmap = async (req, res) => {
  try {
    const {
      projectTitle = 'Untitled Project',
      projectDescription = '',
      techStack = [],
      teamMembers = [{ name: 'Developer 1' }],
      durationHours = 24,
      hackathonName = ''
    } = req.body;

    // Check response cache first
    const cacheKey = roadmapCache.generateKey('roadmap', { projectTitle, techStack, durationHours, teamSize: teamMembers.length });
    const cached = roadmapCache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    let roadmap;

    try {
      const prompt = `
You are a senior engineering manager at Google who has led hackathon teams to victory.

Generate a detailed project execution roadmap for this hackathon project:

**Project:** ${projectTitle}
**Description:** ${projectDescription}
**Tech Stack:** ${techStack.join(', ') || 'To be decided'}
**Team Members:** ${teamMembers.map((m, i) => `${m.name || 'Member ' + (i+1)} (${m.role || 'Developer'})`).join(', ')}
**Total Duration:** ${durationHours} hours
**Hackathon:** ${hackathonName}

Return a JSON object with this exact structure:
{
  "projectTitle": "${projectTitle}",
  "totalDuration": "${durationHours} hours",
  "teamSize": ${teamMembers.length},
  "phases": [
    {
      "phase": 1,
      "name": "Phase name",
      "duration": "X hours",
      "description": "What happens in this phase",
      "tasks": [
        {
          "assignee": "Member name",
          "task": "Specific task description",
          "priority": "HIGH|MEDIUM|LOW|CRITICAL",
          "status": "TODO"
        }
      ]
    }
  ],
  "winningTips": ["tip1", "tip2", "tip3", "tip4", "tip5"]
}

RULES:
- Create exactly 5 phases that span the full ${durationHours} hours
- Every team member must have exactly ONE task per phase
- Tasks must be SPECIFIC (not "do frontend stuff" but "Build the dashboard page with Chart.js bar graphs")
- Include 5 winning tips specific to this project type
- Return strict JSON only
`;

      const result = await callAIForFeature(
        'structured',
        prompt,
        'You are a Google engineering manager. Return strict raw JSON only.',
        true
      );

      roadmap = parseAIJson(result.text);
    } catch (apiErr) {
      console.warn('AI provider unavailable for roadmap, using fallback:', apiErr.message);
      roadmap = generateFallbackRoadmap(projectTitle, teamMembers, durationHours);
    }

    const responsePayload = {
      message: `Roadmap generated for "${projectTitle}" (${durationHours}h, ${teamMembers.length} members)`,
      roadmap
    };
    roadmapCache.set(cacheKey, responsePayload);
    res.json(responsePayload);
  } catch (error) {
    console.error('Roadmap generation error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Generate individual A-to-Z build guide for one team member
 * @route   POST /api/agent/member-guide
 * @access  Public
 */
const generateMemberGuide = async (req, res) => {
  try {
    const {
      memberName = 'Developer',
      memberRole = 'Full Stack Developer',
      projectTitle = 'Hackathon Project',
      projectDescription = '',
      techStack = [],
      assignedTasks = [],
      durationHours = 24
    } = req.body;

    let guide;

    try {
      const prompt = `
You are a senior mentor guiding a student through their FIRST hackathon.

Generate a personalized, step-by-step A-to-Z build guide for this team member:

**Member:** ${memberName}
**Role:** ${memberRole}
**Project:** ${projectTitle}
**Description:** ${projectDescription}
**Tech Stack:** ${techStack.join(', ')}
**Their Assigned Tasks:** ${assignedTasks.join('; ') || 'General development'}
**Total Hackathon Duration:** ${durationHours} hours

Return a JSON object:
{
  "memberName": "${memberName}",
  "role": "${memberRole}",
  "projectTitle": "${projectTitle}",
  "guide": [
    {
      "step": 1,
      "title": "Step title",
      "description": "Detailed description of what to do, how to do it, and why",
      "duration": "estimated time",
      "resources": ["helpful links or tools"]
    }
  ],
  "proTips": ["tip1", "tip2", "tip3", "tip4"]
}

RULES:
- Include 6-8 clear steps covering the ENTIRE hackathon journey
- Each step must be actionable (not vague like "write code")
- Include estimated time for each step
- Include 4 practical pro tips
- Return strict JSON only
`;

      const result = await callAIForFeature(
        'structured',
        prompt,
        'You are a hackathon mentor. Return strict raw JSON only.',
        true
      );

      guide = parseAIJson(result.text);
    } catch (apiErr) {
      console.warn('AI provider unavailable for member guide, using fallback:', apiErr.message);
      guide = generateFallbackMemberGuide(memberName, memberRole, projectTitle);
    }

    res.json({
      message: `Build guide generated for ${memberName} (${memberRole})`,
      guide
    });
  } catch (error) {
    console.error('Member guide generation error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Chat with the personal AI guide agent sharing team and hackathon context
 * @route   POST /api/agent/member-guide-chat
 * @access  Public
 */
const memberGuideChat = async (req, res) => {
  try {
    const {
      memberName = 'Developer',
      memberRole = 'Full Stack Developer',
      projectTitle = 'Hackathon Project',
      projectDescription = '',
      techStack = [],
      assignedTasks = [],
      chatHistory = [],
      userMessage = ''
    } = req.body;

    if (!userMessage) {
      return res.status(400).json({ message: 'User message is required.' });
    }

    let reply;

    try {
      const chatContext = chatHistory.map(m => `${m.role === 'user' ? 'Student' : 'Mentor'}: ${m.text}`).join('\n');
      
      const prompt = `
You are an elite hackathon mentor and expert software architect guiding a student named ${memberName} (Role: ${memberRole}) in a hackathon.
The team is building a project called "${projectTitle}" (${projectDescription}) using the tech stack: ${techStack.join(', ')}.
The student's specific assigned tasks are: ${assignedTasks.join('; ')}.

Your response must combine:
1. **The Substack prompt / Replit Agent brief rules**: Help the student modularize their code, design clean data structures, and give step-by-step instructions.
2. **The Notion Ultimate Hackathon Winning Strategy**: Advise them to focus on the core demo flow, bypass complicated setups, write modular code, seed clean database mocks, and think about the problem definition first.
3. **Collaboration & Connectivity**: Remind them how their work connects with the other team members who are using the same overall workflow.

Here is the conversation history:
${chatContext}

Student: ${userMessage}
Mentor:`;

      const result = await callAIForFeature(
        'conversational',
        prompt,
        'You are a supportive, technically expert hackathon mentor who explains things clearly (like to a 12-year-old) and gives code pointers.',
        false
      );
      reply = result.text;
    } catch (apiErr) {
      console.warn('AI provider unavailable for guide chat, using fallback:', apiErr.message);
      // fallback reply
      reply = `Hey ${memberName}! As a ${memberRole} working on "${projectTitle}", it's crucial to focus on the core demo flow (a key Notion hackathon strategy). Since your tasks are: "${assignedTasks.join(', ')}", here is a quick tip: write modular functions and set up sample mockup JSON data first so your teammates aren't blocked. Let me know if you need specific template codes or schema ideas!`;
    }

    res.json({ reply });
  } catch (error) {
    console.error('Member guide chat error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate a structured pitch deck plan and presenter script
// @route   POST /api/agent/pitch-planner
const generatePitchPlan = async (req, res) => {
  try {
    const { projectTitle = 'Untitled', projectDescription = '', techStack = [], teamMembers = [] } = req.body;

    const prompt = `
      You are an expert venture capitalist and presentation coach.
      Generate a winning 5-slide pitch structure, scripts, and video fallback instructions for:
      Project: "${projectTitle}"
      Description: "${projectDescription}"
      Tech Stack: ${techStack.join(', ')}
      Team Roles: ${teamMembers.map(m => `${m.name} (${m.role})`).join(', ')}

      Output format must be strict JSON containing:
      - "slides": Array of 5 slide objects, each with "title", "focus", and "points" (Array of 3 strings).
      - "scripts": Array of dialogue sections. Each section has "speaker" (Member name) and "lines" (Dialogue text).
      - "videoChecklist": Array of 4 testing checklist items for the backup demo recording.

      Do not wrap in markdown tags.
    `;

    let reply;
    try {
      const result = await callAIForFeature(
        'creative',
        prompt,
        'You are a presentation pitch coach. Return raw JSON format only.',
        true
      );
      reply = result.text;
    } catch (err) {
      // Fallback
      reply = JSON.stringify({
        slides: [
          { title: "1. The Big Problem", focus: "Pain Point", points: ["Current solutions are clunky", "Users waste hours daily", "Manual setup is error-prone"] },
          { title: "2. The Phoenix Solution", focus: "Value Prop", points: ["Auto-fills and organizes details", "Provides instant guidance", "Zero setup required"] },
          { title: "3. Technical Architecture", focus: "Tech Stack", points: ["Frontend: CSS Glassmorphism", "Backend: Node/Express API", "AI: Gemini Orchestration"] },
          { title: "4. Live Demonstration", focus: "Flow Mock", points: ["Sign up and complete checklist", "Trigger automated scans", "Interact with AI coach"] },
          { title: "5. Future Growth & Horizon", focus: "Impact", points: ["Add automated alerts", "Support third-party platforms", "Introduce mobile companion app"] }
        ],
        scripts: teamMembers.map((m, i) => ({
          speaker: m.name || `Member ${i+1}`,
          lines: `Hello! I am acting as the ${m.role || 'Developer'}. Today I will present how our technical solution solves the primary bottleneck. Let us jump right in.`
        })),
        videoChecklist: [
          "Ensure your mock DB has at least 5 populated entries beforehand.",
          "Check that screen recorder captures audio and local console outputs.",
          "Limit demo video to maximum 120 seconds length.",
          "Host the file on a fast-loading drive link or Youtube (unlisted)."
        ]
      });
    }

    const parsed = parseAIJson(reply);
    res.json(parsed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateProjectRoadmap,
  generateMemberGuide,
  memberGuideChat,
  generatePitchPlan
};

