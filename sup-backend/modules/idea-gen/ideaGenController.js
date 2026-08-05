const WinnerProject = require('../../models/winnerProjectModel');
const { callAIForFeature, parseAIJson } = require('../../config/aiProvider');


// @desc    Add a past winning project to the RAG catalog
// @route   POST /api/idea-gen/add-winner
const addWinner = async (req, res) => {
  try {
    const { hackathonName, projectTitle, description, techStack, theme, year, placement, sourceUrl } = req.body;
    if (!hackathonName || !projectTitle) {
      return res.status(400).json({ message: 'hackathonName and projectTitle are required.' });
    }

    const winner = await WinnerProject.create({
      hackathonName, projectTitle, description, techStack, theme, year, placement, sourceUrl
    });

    res.status(201).json({ message: 'Winner project added to catalog.', winner });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    List all past winners (RAG catalog)
// @route   GET /api/idea-gen/winners
const getWinners = async (req, res) => {
  try {
    const { theme } = req.query;
    const query = theme ? { theme: new RegExp(theme, 'i') } : {};
    const winners = await WinnerProject.find(query).sort({ year: -1 }).limit(50);
    res.json(winners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate a unique hackathon idea using RAG + current trends
// @route   POST /api/idea-gen/generate
const generateIdea = async (req, res) => {
  try {
    const { hackathonTheme = 'Open Innovation', teamSkills = [], constraints = '' } = req.body;

    // Retrieve relevant past winners from database as context
    const pastWinners = await WinnerProject.find({
      theme: new RegExp(hackathonTheme.split(' ')[0], 'i')
    }).limit(10);

    const winnerContext = pastWinners.length > 0
      ? pastWinners.map(w => `- "${w.projectTitle}" (${w.hackathonName}, ${w.placement}): ${w.description}`).join('\n')
      : 'No matching past winners found in catalog.';

    const prompt = `
      You are a world-class hackathon strategist.

      **Hackathon Theme:** "${hackathonTheme}"
      **Team Skills:** ${teamSkills.join(', ') || 'General full-stack'}
      **Constraints:** ${constraints || 'No specific constraints'}

      **Past winning projects in this theme (for reference, do NOT repeat them):**
      ${winnerContext}

      Generate 3 unique, innovative project ideas that:
      1. Are aligned with current 2025-2026 tech trends (AI agents, edge computing, AR/VR, sustainability, decentralized systems)
      2. Are achievable in a 24-48 hour hackathon sprint
      3. Have a clear, demo-able impact
      4. Are NOT copies of the past winners listed above

      For each idea, provide:
      - **title**: A catchy project name
      - **pitch**: A 2-sentence elevator pitch
      - **techStack**: Recommended technologies
      - **uniqueAngle**: What makes this idea stand out from competitors
      - **mvpScope**: What to build in the first 6 hours

      Output as a JSON array of 3 objects. Do not wrap in markdown.
    `;

    let reply;
    try {
      const result = await callAIForFeature(
        'creative',
        prompt,
        'You are a hackathon innovation strategist. Return raw JSON array only.',
        true
      );
      reply = result.text;
    } catch (apiErr) {
      console.warn('AI provider unavailable, using fallback ideas');
      reply = JSON.stringify([
        {
          title: "EcoTrack AI",
          pitch: "A mobile app that uses phone sensors and AI to calculate your real-time carbon footprint. Gamifies sustainability with weekly challenges.",
          techStack: ["React Native", "TensorFlow Lite", "Firebase"],
          uniqueAngle: "Uses accelerometer + GPS data for transport-mode detection instead of manual logging.",
          mvpScope: "Transport mode classifier + daily score dashboard"
        },
        {
          title: "MeshAlert",
          pitch: "Offline-first emergency communication using Bluetooth mesh networking. Works when cell towers are down during disasters.",
          techStack: ["Flutter", "Bluetooth LE", "SQLite"],
          uniqueAngle: "No internet required. Messages hop between phones in the mesh.",
          mvpScope: "2-device Bluetooth message relay + emergency SOS broadcast"
        },
        {
          title: "CodeMentor AR",
          pitch: "An AR overlay that displays real-time code documentation and error explanations when you point your phone at a screen.",
          techStack: ["ARKit/ARCore", "GPT-4 Vision", "Node.js"],
          uniqueAngle: "Visual debugging — point camera at error, get fix overlay.",
          mvpScope: "Camera capture + error detection + overlay annotation"
        }
      ]);
    }

    let ideas;
    try {
      ideas = JSON.parse(reply);
    } catch (e) {
      reply = reply.replace(/```json/i, '').replace(/```/g, '').trim();
      ideas = JSON.parse(reply);
    }

    res.json({ ideas, pastWinnersUsed: pastWinners.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Seed the winner catalog with initial data
// @route   POST /api/idea-gen/seed
const seedWinners = async (req, res) => {
  try {
    const seeds = [
      { hackathonName: 'Smart India Hackathon 2024', projectTitle: 'FarmGuard AI', description: 'Drone-based crop disease detection using YOLOv8 and thermal imaging.', techStack: ['Python', 'YOLOv8', 'Flask', 'React'], theme: 'Agriculture', year: 2024, placement: '1st' },
      { hackathonName: 'HackMIT 2024', projectTitle: 'SignSpeak', description: 'Real-time sign language to speech translation using MediaPipe hand tracking.', techStack: ['MediaPipe', 'TensorFlow', 'WebRTC', 'Next.js'], theme: 'Accessibility', year: 2024, placement: '1st' },
      { hackathonName: 'ETHGlobal 2024', projectTitle: 'ChainVote', description: 'Decentralized anonymous voting using zero-knowledge proofs on Ethereum.', techStack: ['Solidity', 'zk-SNARKs', 'React', 'Hardhat'], theme: 'Web3', year: 2024, placement: '2nd' },
      { hackathonName: 'Google Solution Challenge 2025', projectTitle: 'AquaLens', description: 'Satellite image analysis for water contamination detection using Gemini vision.', techStack: ['Gemini API', 'Google Earth Engine', 'Flutter'], theme: 'Environment', year: 2025, placement: '1st' },
      { hackathonName: 'MLH Global Hack 2024', projectTitle: 'NeuroNav', description: 'Brain-computer interface for wheelchair navigation using EEG signals.', techStack: ['OpenBCI', 'Python', 'ROS', 'React'], theme: 'Healthcare', year: 2024, placement: 'Finalist' }
    ];

    await WinnerProject.deleteMany({});
    const created = await WinnerProject.insertMany(seeds);
    res.json({ message: `Seeded ${created.length} winner projects.`, projects: created });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addWinner,
  getWinners,
  generateIdea,
  seedWinners
};
