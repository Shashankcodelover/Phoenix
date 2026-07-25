/**
 * Phoenix v2.0: Bridge Mode — Hackathon-to-Interview Auto-Connector
 * 
 * THE killer feature no competitor has.
 * After finishing a hackathon, Phoenix automatically:
 *   1. Analyzes the GitHub repo (languages, README, commits)
 *   2. Generates 3 STAR stories from the project
 *   3. Maps proven skills to the interview prep radar
 *   4. Creates practice interview questions specific to the project
 *   5. Generates a 60-second elevator pitch
 * 
 * This is the "Shared Skill Graph" — fully automated.
 */

const { callAI, parseAIJson } = require('../../config/aiProvider');
const { mineSTARStory, rateStoryStrength } = require('../interview-prep/story_miner');

// --- Skill Mapping Registry ---
// Maps technologies/tools to interview competency categories
const SKILL_MAP = {
  // Frontend
  'react': { category: 'Frontend', interviewTopics: ['Virtual DOM', 'State Management', 'Component Lifecycle'] },
  'next.js': { category: 'Frontend', interviewTopics: ['SSR vs CSR', 'API Routes', 'ISR'] },
  'vue': { category: 'Frontend', interviewTopics: ['Reactivity System', 'Composition API'] },
  'angular': { category: 'Frontend', interviewTopics: ['Dependency Injection', 'RxJS', 'Change Detection'] },
  'html': { category: 'Frontend', interviewTopics: ['Semantic HTML', 'Accessibility'] },
  'css': { category: 'Frontend', interviewTopics: ['Flexbox', 'Grid', 'Responsive Design'] },
  'tailwind': { category: 'Frontend', interviewTopics: ['Utility-First CSS', 'Design Systems'] },

  // Backend
  'node.js': { category: 'Backend', interviewTopics: ['Event Loop', 'Streams', 'Clustering'] },
  'express': { category: 'Backend', interviewTopics: ['Middleware', 'REST API Design', 'Error Handling'] },
  'python': { category: 'Backend', interviewTopics: ['GIL', 'Decorators', 'Generators'] },
  'django': { category: 'Backend', interviewTopics: ['ORM', 'MVT Pattern', 'Signals'] },
  'flask': { category: 'Backend', interviewTopics: ['WSGI', 'Blueprints', 'Context Locals'] },
  'java': { category: 'Backend', interviewTopics: ['JVM', 'Garbage Collection', 'Concurrency'] },
  'spring': { category: 'Backend', interviewTopics: ['IoC Container', 'AOP', 'Spring Security'] },
  'go': { category: 'Backend', interviewTopics: ['Goroutines', 'Channels', 'Interfaces'] },
  'rust': { category: 'Backend', interviewTopics: ['Ownership', 'Borrowing', 'Lifetimes'] },

  // Database
  'mongodb': { category: 'Database', interviewTopics: ['Document Model', 'Aggregation Pipeline', 'Sharding'] },
  'postgresql': { category: 'Database', interviewTopics: ['ACID', 'Indexing', 'Query Optimization'] },
  'mysql': { category: 'Database', interviewTopics: ['Joins', 'Normalization', 'Transactions'] },
  'redis': { category: 'Database', interviewTopics: ['Caching Strategies', 'Pub/Sub', 'Data Structures'] },
  'firebase': { category: 'Database', interviewTopics: ['Real-time Database', 'Firestore', 'Security Rules'] },

  // DevOps & Cloud
  'docker': { category: 'DevOps', interviewTopics: ['Containerization', 'Docker Compose', 'Multi-stage Builds'] },
  'kubernetes': { category: 'DevOps', interviewTopics: ['Pod Scheduling', 'Services', 'Ingress'] },
  'aws': { category: 'Cloud', interviewTopics: ['EC2', 'S3', 'Lambda', 'IAM'] },
  'gcp': { category: 'Cloud', interviewTopics: ['App Engine', 'Cloud Run', 'BigQuery'] },
  'ci/cd': { category: 'DevOps', interviewTopics: ['Pipeline Design', 'Blue-Green Deployment'] },

  // AI/ML
  'tensorflow': { category: 'AI/ML', interviewTopics: ['Neural Networks', 'Model Training', 'Transfer Learning'] },
  'pytorch': { category: 'AI/ML', interviewTopics: ['Autograd', 'DataLoaders', 'Model Optimization'] },
  'openai': { category: 'AI/ML', interviewTopics: ['Prompt Engineering', 'Fine-tuning', 'Embeddings'] },
  'langchain': { category: 'AI/ML', interviewTopics: ['RAG', 'Agents', 'Chain Composition'] },

  // Real-time
  'websocket': { category: 'Real-time', interviewTopics: ['Full Duplex', 'Socket.io', 'Scaling WebSockets'] },
  'webrtc': { category: 'Real-time', interviewTopics: ['P2P Communication', 'SFU vs Mesh', 'ICE/STUN/TURN'] },
  'socket.io': { category: 'Real-time', interviewTopics: ['Rooms', 'Namespaces', 'Redis Adapter'] }
};

/**
 * Run the full Bridge Mode pipeline on a hackathon project.
 * @route POST /api/v1/bridge/analyze
 */
const analyzeProject = async (req, res) => {
  try {
    const { 
      projectTitle, 
      projectDescription, 
      techStack = [], 
      hackathonName = '', 
      repoUrl = '',
      outcome = '' 
    } = req.body;

    if (!projectTitle || !projectDescription) {
      return res.status(400).json({ message: 'projectTitle and projectDescription are required.' });
    }

    // --- Step 1: Extract Tech Stack Skills ---
    const detectedSkills = detectSkills(projectDescription, techStack);

    // --- Step 2: Mine STAR Stories (local + AI enhanced) ---
    const localStar = mineSTARStory(projectDescription + ' ' + outcome);
    const localStrength = rateStoryStrength(localStar);

    // Generate 3 AI-enhanced STAR stories
    let aiStories;
    try {
      aiStories = await generateSTARStories(projectTitle, projectDescription, techStack, outcome, hackathonName);
    } catch (err) {
      // Fallback to local mining
      aiStories = [
        { angle: 'Technical Challenge', ...localStar },
        { angle: 'Team Leadership', situation: localStar.situation, task: 'Lead the team to deliver on time.', action: localStar.action, result: localStar.result },
        { angle: 'Problem Solving', situation: localStar.situation, task: localStar.task, action: 'Applied creative problem solving.', result: localStar.result }
      ];
    }

    // --- Step 3: Map to Interview Skills Radar ---
    const skillRadarUpdates = mapToRadar(detectedSkills);

    // --- Step 4: Generate Practice Interview Questions ---
    let interviewQuestions;
    try {
      interviewQuestions = await generateInterviewQuestions(projectTitle, techStack, projectDescription);
    } catch (err) {
      interviewQuestions = getStaticQuestions(techStack);
    }

    // --- Step 5: Generate Elevator Pitch ---
    let elevatorPitch;
    try {
      elevatorPitch = await generateElevatorPitch(projectTitle, projectDescription, techStack, outcome);
    } catch (err) {
      elevatorPitch = `I built ${projectTitle} during ${hackathonName || 'a hackathon'} using ${techStack.join(', ')}. ${outcome || 'The project solved a real-world problem.'}`;
    }

    res.json({
      projectTitle,
      hackathonName,
      pipeline: {
        step1_skills: {
          detected: detectedSkills,
          totalSkills: detectedSkills.length
        },
        step2_stories: {
          stories: aiStories,
          localStrength: localStrength,
          totalStories: aiStories.length
        },
        step3_radarUpdates: skillRadarUpdates,
        step4_interviewQuestions: interviewQuestions,
        step5_elevatorPitch: elevatorPitch
      },
      summary: {
        skillsProven: detectedSkills.map(s => s.name),
        storiesGenerated: aiStories.length,
        radarBoosts: Object.entries(skillRadarUpdates)
          .filter(([_, v]) => v > 0)
          .map(([k, v]) => `${k}: +${v}`)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Quick skill detection from a project (lightweight endpoint).
 * @route POST /api/v1/bridge/detect-skills
 */
const detectSkillsEndpoint = (req, res) => {
  try {
    const { description = '', techStack = [] } = req.body;
    const skills = detectSkills(description, techStack);
    res.json({ skills });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Internal Helpers ---

function detectSkills(description, techStack) {
  const detected = [];
  const lowerDesc = (description || '').toLowerCase();
  const allTerms = [...techStack.map(t => t.toLowerCase()), ...lowerDesc.split(/\s+/)];

  for (const [techKey, info] of Object.entries(SKILL_MAP)) {
    if (allTerms.some(term => term.includes(techKey) || techKey.includes(term))) {
      detected.push({
        name: techKey,
        category: info.category,
        interviewTopics: info.interviewTopics,
        proven: true
      });
    }
  }

  return detected;
}

function mapToRadar(detectedSkills) {
  const updates = { dsa: 0, os: 0, dbms: 0, cn: 0, systemDesign: 0 };

  for (const skill of detectedSkills) {
    switch (skill.category) {
      case 'Frontend':
      case 'Backend':
        updates.dsa += 3;
        updates.systemDesign += 2;
        break;
      case 'Database':
        updates.dbms += 5;
        updates.systemDesign += 2;
        break;
      case 'DevOps':
      case 'Cloud':
        updates.systemDesign += 5;
        updates.os += 3;
        break;
      case 'Real-time':
        updates.cn += 5;
        updates.systemDesign += 3;
        break;
      case 'AI/ML':
        updates.dsa += 4;
        updates.systemDesign += 2;
        break;
    }
  }

  return updates;
}

async function generateSTARStories(title, description, techStack, outcome, hackathon) {
  const prompt = `Based on this hackathon project, generate exactly 3 STAR interview stories from different angles.

Project: "${title}"
Description: "${description}"
Tech Stack: ${techStack.join(', ')}
Outcome: "${outcome}"
Hackathon: "${hackathon}"

Each story should have a different angle:
1. Technical Challenge — focus on a hard technical problem you solved
2. Team Leadership — focus on teamwork, delegation, or conflict resolution
3. Innovation — focus on creative thinking or unique approach

Return a JSON array of 3 objects, each with: "angle", "situation", "task", "action", "result".`;

  const result = await callAI(prompt, 'You are a professional interview coach. Generate realistic, specific STAR stories. Return JSON only.', true,
    JSON.stringify([
      { angle: 'Technical Challenge', situation: `During ${hackathon}, our team needed to build ${title}.`, task: 'Deliver a working prototype using ' + techStack.join(', '), action: description.substring(0, 200), result: outcome || 'Successfully delivered the project.' }
    ])
  );

  const parsed = parseAIJson(result.text);
  return Array.isArray(parsed) ? parsed : [parsed];
}

async function generateInterviewQuestions(title, techStack, description) {
  const prompt = `Generate 5 interview questions a senior engineer might ask about this hackathon project:
Project: "${title}"
Tech: ${techStack.join(', ')}
Description: "${description.substring(0, 500)}"

Return a JSON array of objects with: "question", "difficulty" (easy/medium/hard), "category" (technical/behavioral/design).`;

  const result = await callAI(prompt, 'You are a senior technical interviewer. Return JSON array only.', true,
    JSON.stringify(getStaticQuestions(techStack))
  );

  return parseAIJson(result.text);
}

async function generateElevatorPitch(title, description, techStack, outcome) {
  const prompt = `Generate a 60-second elevator pitch for this hackathon project. It should be conversational, enthusiastic, and hit: Problem, Solution, Impact, Tech.

Project: "${title}"
Description: "${description.substring(0, 500)}"
Tech: ${techStack.join(', ')}
Outcome: "${outcome}"

Return a single string — the pitch script. Keep it under 150 words.`;

  const result = await callAI(prompt, 'You are a pitch coach. Write natural, engaging pitches. Return plain text only.');
  return result.text;
}

function getStaticQuestions(techStack) {
  return [
    { question: `Why did you choose ${techStack[0] || 'this tech stack'} for this project?`, difficulty: 'easy', category: 'technical' },
    { question: 'What was the hardest technical challenge you faced and how did you solve it?', difficulty: 'medium', category: 'technical' },
    { question: 'How would you scale this project to handle 100x the current load?', difficulty: 'hard', category: 'design' },
    { question: 'Tell me about a disagreement within your team and how you resolved it.', difficulty: 'medium', category: 'behavioral' },
    { question: 'If you had one more week, what would you add or change?', difficulty: 'easy', category: 'behavioral' }
  ];
}

module.exports = {
  analyzeProject,
  detectSkillsEndpoint,
  SKILL_MAP
};
