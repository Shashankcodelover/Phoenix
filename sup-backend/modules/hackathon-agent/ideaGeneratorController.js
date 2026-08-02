/**
 * Phoenix V20: AI Hackathon Idea Generator Controller
 * 
 * Endpoints:
 *   POST /api/agent/generate-ideas  — Generate top 10 winning project ideas for a hackathon
 *   POST /api/agent/refine-ideas    — Refine existing ideas with extra constraints/instructions
 */

const { callAIForFeature, parseAIJson } = require('../../config/aiProvider');


// ──────────────────────────────────────────────
// FALLBACK DATA — used when Gemini API key is missing
// ──────────────────────────────────────────────
const FALLBACK_IDEAS = [
  {
    rank: 1,
    title: "AI-Powered Disaster Relief Coordinator",
    description: "A real-time coordination platform that uses satellite imagery analysis and NLP-based distress signal parsing to automatically dispatch resources to disaster zones. Integrates with government APIs to pull live flood/earthquake data.",
    techStack: ["Python", "TensorFlow", "FastAPI", "React", "PostgreSQL", "WebSocket"],
    whyItWins: "Judges love social impact + cutting-edge AI. Real satellite data makes it feel production-ready, not a toy demo.",
    uniqueAngle: "Offline-first mesh networking mode for areas where internet is down during disasters."
  },
  {
    rank: 2,
    title: "Decentralized Academic Credential Vault",
    description: "Blockchain-anchored verification system where universities mint verifiable credential NFTs. Employers scan a QR code to instantly verify degrees, eliminating fake certificates. Uses zero-knowledge proofs for privacy.",
    techStack: ["Solidity", "Hardhat", "React", "IPFS", "Node.js", "ZK-SNARKs"],
    whyItWins: "Blockchain + education = hot topic. ZK-proofs show deep technical mastery that impresses judges.",
    uniqueAngle: "Privacy-preserving verification — employer confirms 'this person has a CS degree' without seeing GPA or personal details."
  },
  {
    rank: 3,
    title: "Smart Water Quality Monitoring Network",
    description: "IoT sensor network that monitors real-time water quality (pH, turbidity, dissolved oxygen) across a city's water supply. ML models predict contamination events 6 hours before they happen based on upstream patterns.",
    techStack: ["Arduino", "MQTT", "InfluxDB", "Grafana", "Python", "scikit-learn"],
    whyItWins: "Hardware + software integration is rare in hackathons. Predictive ML on time-series data shows strong engineering depth.",
    uniqueAngle: "Crowdsourced citizen reporting layer — anyone can submit a water quality complaint that gets triangulated against sensor data."
  },
  {
    rank: 4,
    title: "AI Legal Document Simplifier for Rural Citizens",
    description: "Multilingual platform that takes complex legal documents (property deeds, government forms, court notices) and converts them to simple language in the user's native tongue. Voice input/output for illiterate users.",
    techStack: ["Gemini API", "React Native", "Node.js", "MongoDB", "Google TTS", "Whisper"],
    whyItWins: "Massive social impact. Multilingual voice I/O demonstrates accessibility-first engineering.",
    uniqueAngle: "Offline mode using on-device small language model for areas with no internet connectivity."
  },
  {
    rank: 5,
    title: "Carbon Footprint Tracker for Supply Chains",
    description: "B2B SaaS dashboard that tracks carbon emissions across a company's entire supply chain. Uses receipt scanning AI and logistics API integrations to automatically calculate Scope 1/2/3 emissions.",
    techStack: ["Next.js", "PostgreSQL", "Python", "OCR", "Chart.js", "Docker"],
    whyItWins: "ESG compliance is a $50B market. Enterprise-grade dashboards with real math impress corporate-sponsored hackathons.",
    uniqueAngle: "Automated regulatory report generation — one click to export BRSR/GRI-compliant sustainability reports."
  },
  {
    rank: 6,
    title: "Peer-to-Peer Mental Health Support Platform",
    description: "Anonymous, AI-moderated support circles where students can share struggles and get peer support. Sentiment analysis flags crisis situations and escalates to trained counselors in real-time.",
    techStack: ["React", "Socket.io", "Node.js", "Hugging Face", "MongoDB", "Twilio"],
    whyItWins: "Mental health in education is a pressing issue. The AI moderation layer shows responsible tech thinking.",
    uniqueAngle: "Gamified wellness challenges — daily mood tracking, breathing exercises, and gratitude journaling with XP rewards."
  },
  {
    rank: 7,
    title: "Autonomous Exam Proctoring System",
    description: "Browser-based exam proctoring that uses face detection, gaze tracking, and audio anomaly detection to flag suspicious behavior — all running locally on the student's device with no cloud uploads for privacy.",
    techStack: ["TensorFlow.js", "MediaPipe", "WebRTC", "React", "Express", "Redis"],
    whyItWins: "On-device ML processing (no cloud) is a privacy-first technical differentiator that resonates with judges.",
    uniqueAngle: "Differential privacy reports — institution gets aggregate cheating statistics without seeing individual student footage."
  },
  {
    rank: 8,
    title: "Smart Parking Finder with Dynamic Pricing",
    description: "Real-time parking availability map using computer vision on existing CCTV feeds. Dynamic pricing algorithm adjusts rates based on demand, time of day, and events nearby.",
    techStack: ["YOLOv8", "OpenCV", "Flask", "React Native", "PostgreSQL", "Stripe"],
    whyItWins: "Computer vision on real video feeds is technically impressive. Revenue model (dynamic pricing) shows business acumen.",
    uniqueAngle: "EV charging station integration — prioritizes spots near chargers for electric vehicles."
  },
  {
    rank: 9,
    title: "Multilingual Meeting Minutes Summarizer",
    description: "Join any Google Meet/Zoom call, transcribe in real-time across 12 languages, generate structured meeting minutes with action items, decisions, and follow-ups automatically assigned to participants.",
    techStack: ["Whisper", "Gemini API", "Chrome Extension", "Node.js", "Firebase", "React"],
    whyItWins: "Immediately useful tool that every company needs. Multilingual support shows scalability thinking.",
    uniqueAngle: "Conflict detection — flags when two action items contradict each other or when deadlines overlap."
  },
  {
    rank: 10,
    title: "Farmer-to-Consumer Direct Marketplace",
    description: "Hyperlocal marketplace connecting farmers directly to consumers within a 50km radius. AI predicts crop yields and suggests optimal pricing. Integrated logistics with local delivery partners.",
    techStack: ["React Native", "Node.js", "MongoDB", "Google Maps API", "Razorpay", "Firebase"],
    whyItWins: "Agricultural tech with direct social impact. Hyperlocal geofencing and pricing AI shows technical sophistication.",
    uniqueAngle: "Crop prediction alerts — consumers can pre-order seasonal produce before harvest, guaranteeing farmer income."
  }
];

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

    // Retrieve active related hackathons from catalog
    const queryContext = `${hackathonName} ${hackathonDescription} ${rules}`;
    const retrievedHacks = ragService.retrieveHackathons(queryContext, 2);

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

RETRIEVED ACTIVE CONTEXT:
The following related active/past hackathons and themes were retrieved from our indexed database catalog to augment your brainstorming:
${JSON.stringify(retrievedHacks, null, 2)}

Generate exactly 10 unique, innovative, REAL-WORLD problem-solving project ideas that would WIN this hackathon. Ensure the ideas incorporate aspects from the retrieved active context to be highly competitive today.

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
      ideas = parsed.ideas || FALLBACK_IDEAS;
    } catch (apiErr) {
      console.warn('AI provider unavailable for idea generation, using fallback:', apiErr.message);
      ideas = FALLBACK_IDEAS;
    }

    res.json({
      message: `Generated ${ideas.length} winning ideas for "${hackathonName}"`,
      hackathonName,
      ideas
    });
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
    } catch (apiErr) {
      console.warn('AI provider unavailable for refinement, using modified fallback:', apiErr.message);
      // Modify fallback ideas to reflect constraints
      refinedIdeas = FALLBACK_IDEAS.map((idea, i) => ({
        ...idea,
        rank: i + 1,
        title: idea.title + ' (Refined)',
        description: idea.description + ` Enhanced with constraint: "${extraConstraints || extraInstructions}".`
      }));
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
