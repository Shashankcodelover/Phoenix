const User = require('../../models/userModel');
const { callAIForFeature, parseAIJson } = require('../../config/aiProvider');
const { analyzeAndDisruptResume } = require('./resumeDisruptor');


// @desc    Disrupt & Optimize Resume for Target Role
// @route   POST /api/v1/prep/resume-disrupt
const disruptResume = async (req, res) => {
  try {
    const { resumeText = '', targetRole = 'google_sde' } = req.body;
    const analysis = await analyzeAndDisruptResume(resumeText, targetRole);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate a custom interview roadmap
// @route   POST /api/prep/generate-roadmap
// @access  Public
const generateRoadmap = async (req, res) => {
  try {
    const { userId, targetRole, timeFrame, resumeText } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Save preferences
    user.targetRole = targetRole || 'Software Engineer';
    user.prepTimeFrame = parseInt(timeFrame) || 30;
    if (resumeText) user.resumeText = resumeText;
    await user.save();

    const resumeContext = user.resumeText || "No resume uploaded. Generate a standard comprehensive developer path.";
    const duration = user.prepTimeFrame;
    const role = user.targetRole;

    const prompt = `
      You are an expert technical interviewer and placement coordinator. 
      Generate a customized daily preparation roadmap for the role of "${role}" over a timeframe of ${duration} days.
      Use this student's resume context:
      "${resumeContext}"

      The syllabus MUST prioritize high-yield concepts across:
      1. Aptitude (Quantitative, Logical, Verbal)
      2. Data Structures & Algorithms (Arrays, Lists, Trees, Graphs, DP, Sorting, Searching)
      3. Operating Systems (Threads, Processes, Deadlocks, Memory Management)
      4. Database Management Systems (SQL, NoSQL, Normalization, Indexing)
      5. Computer Networks (TCP/IP, HTTP, OSI, Routing)
      6. Object-Oriented Programming (OOP concepts, Design Patterns)
      7. Role-specific stack topics (e.g. React/Node if Frontend/Fullstack, Python/Pytorch if ML, etc.)

      IMPORTANT: Since the duration is ${duration} days, structure the response so it fits exactly ${duration} day-by-day modules.
      Keep it high-yield. Collapsed cramming mode is supported by only focusing on the highest priority items.
      Return a raw JSON object containing an array "roadmap" where each item has:
      - "day": integer (1 to ${duration})
      - "title": string (topic title)
      - "category": string (e.g., "DSA", "OS", "DBMS", "CN", "Aptitude", "OOP", "System Design")
      - "description": string (explanation of what to study and solve)
      - "questions": array of 2 multiple-choice questions for verification, each with:
        - "question": string
        - "options": array of 4 strings
        - "answer": string (must match exactly one of the options)

      Ensure the JSON is strictly valid. Do not wrap in markdown \`\`\`json block.
    `;

    const systemInstruction = "You are a professional roadmap generator. Return strict raw JSON format only.";
    
    const result = await callAIForFeature(
      'structured',
      prompt,
      systemInstruction,
      true
    );

    const roadmapData = parseAIJson(result.text);

    res.json({
      message: "Roadmap generated successfully",
      roadmap: roadmapData.roadmap
    });
  } catch (error) {
    console.error("Roadmap generation error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    AI Mock Interview Chat Handler
// @route   POST /api/prep/mock-interview
// @access  Public
const mockInterview = async (req, res) => {
  try {
    const { message, history = [], targetRole } = req.body;

    const role = targetRole || "Software Engineer";

    // 1. Programmatic Filler Word Detection
    const fillers = ['um', 'like', 'actually', 'basically', 'you know', 'uh', 'so'];
    let fillerCount = 0;
    if (message) {
      const tokens = message.toLowerCase().split(/[^a-zA-Z]+/);
      tokens.forEach(t => {
        if (fillers.includes(t)) fillerCount++;
      });
    }

    // 2. Bar Raiser Difficulty Scaling based on history length
    const turns = history.length;
    let difficulty = 'Foundational';
    if (turns > 8) difficulty = 'Expert (Bar Raiser)';
    else if (turns > 4) difficulty = 'Advanced';
    else if (turns > 2) difficulty = 'Intermediate';

    const prompt = `
      Current user message: "${message}"

      Conversation History:
      ${JSON.stringify(history)}

      Act as a senior technical interviewer conducting a mock interview for the role of "${role}" at a top-tier tech firm.
      You are running in "${difficulty}" difficulty mode.
      
      Ask one question at a time. If the user answers, critique their response (correctness, clarity) and then ask the next question.
      Highlight where they used filler words (such as "um", "like", "actually") to help them reduce communication friction.
      Keep the response encouraging yet technically rigorous.
    `;

    const result = await callAIForFeature(
      'conversational',
      prompt,
      `You are a professional technical interviewer operating in ${difficulty} mode. Keep responses concise and focused.`
    );

    res.json({
      reply: result.text,
      fillerCount,
      difficulty
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Role-based Resume generator / optimizer
// @route   POST /api/prep/tailor-resume
// @access  Public
const tailorResume = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ message: "Both resumeText and jobDescription are required." });
    }

    const prompt = `
      Tailor this engineering student's resume to match this specific job description. Highlight keywords, project achievements, and structure it cleanly.
      
      Resume text:
      "${resumeText}"

      Job Description:
      "${jobDescription}"

      Provide the output in clean, formatted Markdown that the student can copy and download directly. Do not include any meta comments. Focus on producing a clean resume layout.
    `;

    const result = await callAIForFeature(
      'document',
      prompt,
      "You are a professional resume writer. Return a beautifully formatted Markdown resume."
    );
    res.json({ resume: result.text });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Quiz submission handler (awards XP and updates weak topics)
// @route   POST /api/prep/quiz-submit
// @access  Public
const submitQuiz = async (req, res) => {
  try {
    const { userId, answersCorrect, xpEarned } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Award XP
    user.xp = (user.xp || 0) + (parseInt(xpEarned) || 10);
    
    // Level calculation: 100 XP per level
    const newLevel = Math.floor(user.xp / 100) + 1;
    if (newLevel > (user.level || 1)) {
      user.level = newLevel;
    }

    // Update streak logic
    const today = new Date().toDateString();
    if (user.lastActiveDate) {
      const lastActive = new Date(user.lastActiveDate).toDateString();
      const diffTime = Math.abs(new Date(today).getTime() - new Date(lastActive).getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        user.streak = (user.streak || 0) + 1;
      } else if (diffDays > 1) {
        user.streak = 1;
      }
    } else {
      user.streak = 1;
    }
    user.lastActiveDate = new Date();

    await user.save();

    res.json({
      message: "Quiz results processed",
      xp: user.xp,
      level: user.level,
      streak: user.streak
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get company-tagged question bank
const getQuestions = async (req, res) => {
  try {
    const questions = [
      {
        title: "Reverse a Linked List in Groups of Size K",
        company: "Amazon",
        category: "DSA",
        difficulty: "Hard",
        description: "Given a pointer to the head node of a linked list, reverse the nodes of the list k at a time, and return the modified list. k is a positive integer and is less than or equal to the length of the linked list."
      },
      {
        title: "LRU Cache Design & Implementation",
        company: "Google",
        category: "DSA",
        difficulty: "Medium",
        description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement LRUCache class with get(key) and put(key, value) in O(1) time complexity."
      },
      {
        title: "Explain CPU Scheduling & Deadlock Prevention",
        company: "TCS",
        category: "OS",
        difficulty: "Easy",
        description: "What is a deadlock situation? Explain four necessary conditions for deadlocks (Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait) and strategies to prevent them."
      },
      {
        title: "Optimizing Joins in Large SQL Databases",
        company: "Adobe",
        category: "DBMS",
        difficulty: "Medium",
        description: "Explain nested loop joins, hash joins, and sort-merge joins. How do indexes alter database parser cost estimation when fetching millions of records?"
      },
      {
        title: "Three-way Partitioning of Arrays",
        company: "Microsoft",
        category: "DSA",
        difficulty: "Medium",
        description: "Given an array and a range [lowVal, highVal], partition the array such that all elements less than lowVal come first, elements between lowVal and highVal come second, and elements greater than highVal come last."
      }
    ];
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recommended peer matches
const getPeerMatches = async (req, res) => {
  try {
    const peers = [
      { _id: "1", name: "Alice Johnson", targetRole: "Fullstack React Developer", level: 3, xp: 260 },
      { _id: "2", name: "Bob Smith", targetRole: "Machine Learning Engineer", level: 4, xp: 380 },
      { _id: "3", name: "Carol Lee", targetRole: "Mobile Android Programmer", level: 2, xp: 140 }
    ];
    res.json(peers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Calculate time budget allocations using Gemini
const allocatePlanner = async (req, res) => {
  try {
    const { interviewDate, hackathonDate, dailyHours, ratio } = req.body;

    const prepRatio = parseInt(ratio) || 50;
    const hackRatio = 100 - prepRatio;
    const hours = parseFloat(dailyHours) || 4.0;

    const prepHours = (hours * prepRatio / 100).toFixed(1);
    const hackHours = (hours * hackRatio / 100).toFixed(1);

    const prompt = `
      You are an elite academic scheduler.
      A student is preparing for an interview on: ${interviewDate}
      and participating in a hackathon on: ${hackathonDate}
      
      Their daily code prep and build budget is: ${hours} hours.
      The split ratio is:
      - Placement Interview Preparation: ${prepHours} hours/day
      - Hackathon Prototype Development: ${hackHours} hours/day
      
      Generate a prioritized, daily task budget to resolve schedules.
      Return a JSON object containing an array "schedule" where each item has:
      - "title": string (the specific task explanation)
      - "duration": string (e.g. "${prepHours} hrs" or "${hackHours} hrs")
      - "type": string (either "prep" or "hackathon")

      Ensure the JSON is strictly valid. Do not wrap in markdown block.
    `;

    let parsed;
    try {
      const result = await callAIForFeature(
        'structured',
        prompt,
        "You are a professional academic time budget planner. Return strict raw JSON format only.",
        true
      );
      parsed = parseAIJson(result.text);
    } catch (apiErr) {
      console.warn("AI call failed in planner, using fallback static schedule", apiErr);
      return res.json({
        schedule: [
          { title: "Solve 2 LeetCode Medium Hashmap Problems", duration: `${prepHours} hrs`, type: "prep" },
          { title: "Initialize Express Server & Mongoose Schemas", duration: `${hackHours} hrs`, type: "hackathon" },
          { title: "Study Database Normalization & Indexing", duration: `${prepHours} hrs`, type: "prep" },
          { title: "Configure Geofenced Instagram scraper APIs", duration: `${hackHours} hrs`, type: "hackathon" }
        ]
      });
    }

    res.json({ schedule: parsed.schedule });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate high-yield AI revision cheatsheets
// @route   POST /api/prep/revision
// @access  Public
const generateRevisionSheet = async (req, res) => {
  try {
    const { topic, category } = req.body;

    if (!topic || !category) {
      return res.status(400).json({ message: "topic and category are required" });
    }

    const prompt = `
      You are an elite placement trainer. Generate a high-yield interview revision cheatsheet for the following topic:
      
      Topic: "${topic}"
      Category: "${category}"

      Structure the sheets into the following exact sections:
      1. 🔑 Core Concept & Summary (Simplified explanation)
      2. 💡 Typical Interview Questions (Top 3 questions asked on this topic)
      3. 🚀 SDE Answer Templates (Perfect answers using correct terms)
      4. ⚡ Code snippets or pseudo-code (if applicable to DSA/OOP/DBMS, else key diagrams as bullet text)

      Output the result in beautiful, clear Markdown headings. Do not include meta comments.
    `;

    let sheetContent;
    try {
      const result = await callAIForFeature(
        'document',
        prompt,
        "You are a senior technical interview coach. Return response in Markdown only."
      );
      sheetContent = result.text;
    } catch (apiErr) {
      console.warn("Gemini call failed in revision generator, using static fallback", apiErr);
      sheetContent = `### Revision Sheet: ${topic} (Fallback Mode)

**1. Core Concept & Summary:**
* ${topic} is a crucial technical component under the ${category} category. It facilitates efficient data processing and system operations.

**2. Key Interview Questions:**
* What is the basic mechanism of ${topic}?
* How do you optimize systems utilizing ${topic}?
* What are the trade-offs of ${topic}?

**3. Perfect Answer Template:**
* "When explaining ${topic}, I state that it is designed to optimize time and space complexity in systems engineering..."`;
    }

    res.json({ sheet: sheetContent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Analyze audio transcript for pacing, fillers, and confidence
// @route   POST /api/prep/analyze-audio
const analyzeAudio = async (req, res) => {
  try {
    const { transcript = '' } = req.body;
    const fillers = ['um', 'like', 'actually', 'basically', 'you know', 'uh', 'so'];
    let fillerCount = 0;
    
    const words = transcript.toLowerCase().split(/[^a-zA-Z]+/);
    words.forEach(w => {
      if (fillers.includes(w)) fillerCount++;
    });

    const totalWords = words.length;
    // Calculate a mock pacing score (e.g. 130 words per minute average)
    let pacing = 'Normal';
    if (totalWords > 160) pacing = 'Fast';
    if (totalWords < 90) pacing = 'Slow';

    // Confidence drops with high fillers ratio
    const ratio = totalWords > 0 ? (fillerCount / totalWords) : 0;
    let confidence = Math.max(30, Math.floor(100 - (ratio * 300)));

    res.json({
      fillerCount,
      pacing,
      confidenceScore: confidence,
      wordCount: totalWords
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's past interview session metrics for charts
// @route   GET /api/prep/performance-trend/:userId
const getPerformanceTrend = async (req, res) => {
  try {
    // Return sample timeline trend data for user statistics
    const trends = [
      { date: 'Mon', communication: 65, technical: 60, fillers: 12 },
      { date: 'Tue', communication: 70, technical: 62, fillers: 8 },
      { date: 'Wed', communication: 75, technical: 68, fillers: 5 },
      { date: 'Thu', communication: 82, technical: 75, fillers: 3 },
      { date: 'Fri', communication: 88, technical: 80, fillers: 1 }
    ];
    res.json(trends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    System Design Whiteboard question generator
// @route   POST /api/prep/system-design
const generateSystemDesignQuestion = async (req, res) => {
  try {
    const { topic = 'Uber' } = req.body;
    const prompt = `
      You are an elite system architect interviewer. 
      Generate a System Design question scenario for: "Design ${topic}".
      Provide:
      1. Functional requirements (Top 3)
      2. Non-functional requirements (Availability, Scale, Latency limits)
      3. System design constraints (e.g., QPS, Storage estimates)
      
      Output in strict JSON format containing fields: "title", "requirements", "nonFunctional", "constraints".
      Do not include markdown tags.
    `;

    const result = await callAIForFeature(
      'structured',
      prompt,
      "You are a professional system design interviewer. Return raw JSON only.",
      true
    );
    
    const parsed = parseAIJson(result.text);
    res.json(parsed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateRoadmap,
  mockInterview,
  tailorResume,
  disruptResume,
  submitQuiz,
  getQuestions,
  getPeerMatches,
  allocatePlanner,
  generateRevisionSheet,
  analyzeAudio,
  getPerformanceTrend,
  generateSystemDesignQuestion
};
