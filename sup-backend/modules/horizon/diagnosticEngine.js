/**
 * Phoenix Horizon — Diagnostic & Sector Match Engine
 * 
 * Maps a student's current stage, interests, and goals to a tailored "World".
 */

const { HorizonProfile } = require('../../models/horizonModel');

const WORLD_MAP = {
  tech_world: {
    name: 'Tech World',
    description: 'The realm of Software Engineering, Data Science, Cyber Security, and AI.',
    domains: ['Full Stack Development', 'AI/ML', 'Cloud Computing', 'Cyber Security']
  },
  commerce_world: {
    name: 'Commerce & Finance World',
    description: 'The realm of Chartered Accountancy, Investment Banking, and Business Strategy.',
    domains: ['CA/CS', 'Investment Banking', 'Actuarial Science', 'FinTech']
  },
  bio_world: {
    name: 'Bio-Medical & Health World',
    description: 'The realm of Medicine, Biotechnology, and Clinical Research.',
    domains: ['MBBS', 'Biotech Research', 'Pharmacy', 'Bioinformatics']
  },
  electronics_world: {
    name: 'Electronics & Hardware World',
    description: 'The realm of VLSI, Embedded Systems, and IoT.',
    domains: ['VLSI Design', 'IoT', 'Robotics', 'Signal Processing']
  },
  arts_world: {
    name: 'Arts & Design World',
    description: 'The realm of UI/UX, Graphic Design, Animation, and Humanities.',
    domains: ['UI/UX Design', 'Animation', 'Journalism', 'Psychology']
  }
};

/**
 * Determine the best world match based on interests and stage.
 */
function matchWorld(interests) {
  let scores = {
    tech_world: 0,
    commerce_world: 0,
    bio_world: 0,
    electronics_world: 0,
    arts_world: 0
  };

  const techKeywords = ['coding', 'computers', 'software', 'ai', 'hacking', 'games', 'tech'];
  const commerceKeywords = ['money', 'business', 'stocks', 'accounts', 'finance', 'commerce'];
  const bioKeywords = ['biology', 'medicine', 'health', 'animals', 'science', 'doctor', 'bio'];
  const electronicsKeywords = ['circuits', 'hardware', 'robotics', 'physics', 'gadgets'];
  const artsKeywords = ['design', 'drawing', 'psychology', 'writing', 'art', 'ui', 'creative'];

  if (Array.isArray(interests)) {
    interests.forEach(interest => {
      const lower = interest.toLowerCase();
      if (techKeywords.some(kw => lower.includes(kw))) scores.tech_world++;
      if (commerceKeywords.some(kw => lower.includes(kw))) scores.commerce_world++;
      if (bioKeywords.some(kw => lower.includes(kw))) scores.bio_world++;
      if (electronicsKeywords.some(kw => lower.includes(kw))) scores.electronics_world++;
      if (artsKeywords.some(kw => lower.includes(kw))) scores.arts_world++;
    });
  }

  // Default to tech_world if no strong match
  let maxScore = -1;
  let bestMatch = 'tech_world';

  for (const [world, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      bestMatch = world;
    }
  }

  return bestMatch;
}

/**
 * Evaluates the student's diagnostic input.
 * In a real scenario, this creates/updates their profile in the DB.
 */
async function evaluateStudentDiagnostic(userId, { academicStage, interests, primaryGoal }) {
  if (!academicStage || !interests) {
    throw new Error('Academic stage and interests are required.');
  }

  const matchedWorld = matchWorld(interests);
  const worldDetails = WORLD_MAP[matchedWorld];

  const mongoose = require('mongoose');
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    try {
      let profile = await HorizonProfile.findOne({ userId });
      if (!profile) {
        profile = new HorizonProfile({
          userId: userId,
          academicStage: academicStage,
          selectedWorld: matchedWorld,
          activeRoadmapId: 'foundation_30_day',
          completedChecklistItems: [],
          pyqBookmarks: [],
          examAlertSubscriptions: []
        });
        await profile.save();
      } else {
        profile.academicStage = academicStage;
        profile.selectedWorld = matchedWorld;
        await profile.save();
      }
    } catch (dbErr) {
      console.warn('[Horizon Diagnostic] DB save skipped:', dbErr.message);
    }
  }

  return {
    success: true,
    matchedWorld: matchedWorld,
    worldName: worldDetails.name,
    worldDescription: worldDetails.description,
    recommendedDomains: worldDetails.domains,
    startingPhase: 'Phase 1: Foundation',
    initialRoadmap: [
      { day: 1, task: 'Explore the domain landscape', completed: false },
      { day: 2, task: 'Join the community forums', completed: false },
      { day: 3, task: 'Review top 3 mistakes to avoid', completed: false }
    ],
    message: 'Diagnostic complete. Welcome to your World.',
    redirectionUrl: `/horizon/world-dashboard.html?world=${matchedWorld}&stage=${academicStage}`
  };
}

module.exports = { evaluateStudentDiagnostic, matchWorld, WORLD_MAP };
