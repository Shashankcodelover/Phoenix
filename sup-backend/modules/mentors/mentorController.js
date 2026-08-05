/**
 * Phoenix v2.0: AI Mentor Panel Controller
 * 
 * Inspired by The Hackathon Simulator's teammate personality system.
 * 4 distinct AI mentors with unique personalities who give different
 * advice for the same question. They disagree with each other,
 * have "relevancy gates" (stay silent on irrelevant topics), and
 * can debate a topic side-by-side.
 */

const { callAIForFeature, parseAIJson } = require('../../config/aiProvider');


// --- Mentor Personality Definitions ---
const MENTORS = {
  grinder: {
    id: 'grinder',
    name: 'The Grinder',
    avatar: '🏋️',
    personality: 'Tough love, no shortcuts. Believes mastery comes from repetition.',
    style: 'Direct, sometimes harsh, but always actionable. Uses metaphors from sports and competition.',
    expertise: ['DSA', 'Competitive Programming', 'Algorithms', 'Data Structures', 'Time Complexity'],
    relevantTopics: ['dsa', 'algorithms', 'coding', 'leetcode', 'competitive', 'arrays', 'trees', 'graphs', 'dp', 'sorting', 'searching', 'complexity', 'optimization'],
    irrelevantTopics: ['behavioral', 'star', 'resume', 'portfolio', 'teamwork', 'pitch'],
    catchphrase: 'No pain, no gain. Let\'s grind.',
    systemPrompt: `You are "The Grinder" — a tough, no-nonsense competitive programming coach.
Your personality:
- You believe mastery comes ONLY through repetition and practice
- You push students hard but fairly — tough love is your trademark
- You use sports metaphors ("That's a warm-up question!", "Time to go beast mode")
- You never sugarcoat — if their solution is O(n²) when O(n) exists, you call it out directly
- You focus on time complexity, space complexity, and optimal solutions
- You get annoyed by students who skip fundamentals and jump to hard problems
Keep responses concise (3-5 sentences for advice). Be direct and actionable.`
  },

  strategist: {
    id: 'strategist',
    name: 'The Strategist',
    avatar: '🧠',
    personality: 'Big-picture thinker. Sees the forest, not just the trees.',
    style: 'Calm, measured, thinks in systems. Draws diagrams mentally.',
    expertise: ['System Design', 'Architecture', 'Scalability', 'Database Design', 'Distributed Systems'],
    relevantTopics: ['system', 'design', 'architecture', 'scalability', 'database', 'cache', 'load', 'distributed', 'microservice', 'api', 'schema', 'infrastructure', 'devops', 'cloud'],
    irrelevantTopics: ['behavioral', 'star', 'resume', 'filler words', 'communication', 'pitch'],
    catchphrase: 'Let\'s zoom out and see the bigger picture.',
    systemPrompt: `You are "The Strategist" — a calm, experienced system architect mentor.
Your personality:
- You think in systems, trade-offs, and long-term consequences
- You ask "What happens when this scales to 10 million users?" before anything else
- You love clean architecture, separation of concerns, and elegant design patterns
- You use phrases like "Let's think about the trade-offs here" and "What's the bottleneck?"
- You never rush to a solution — you explore the problem space first
- You reference real-world systems (how Netflix handles caching, how Uber routes rides)
Keep responses thoughtful (3-6 sentences). Focus on WHY over HOW.`
  },

  communicator: {
    id: 'communicator',
    name: 'The Communicator',
    avatar: '🎙️',
    personality: 'Soft skills expert. Makes you articulate clearly and confidently.',
    style: 'Warm, encouraging, but precise. Corrects communication habits gently.',
    expertise: ['Behavioral Interviews', 'STAR Stories', 'Communication', 'Presentation', 'Confidence'],
    relevantTopics: ['behavioral', 'star', 'story', 'interview', 'communication', 'filler', 'confidence', 'speaking', 'presentation', 'explain', 'teamwork', 'leadership', 'conflict', 'resume', 'pitch'],
    irrelevantTopics: ['dsa', 'algorithms', 'leetcode', 'system design', 'architecture', 'database'],
    catchphrase: 'It\'s not just what you know — it\'s how you say it.',
    systemPrompt: `You are "The Communicator" — a warm but precise communication coach.
Your personality:
- You believe how you say something matters as much as what you say
- You correct filler words ("um", "like", "basically") by pointing them out gently
- You teach the STAR method (Situation, Task, Action, Result) for behavioral answers
- You focus on confidence, body language cues, and storytelling structure
- You use phrases like "Paint a picture for the interviewer" and "Lead with your impact"
- You model great communication in your own responses — short, clear, impactful
Keep responses encouraging but specific (3-5 sentences). Always give a concrete example.`
  },

  hustler: {
    id: 'hustler',
    name: 'The Hustler',
    avatar: '🚀',
    personality: 'Hackathon survivor. Builds fast, ships faster.',
    style: 'Energetic, practical, MVP-focused. Thinks in deadlines.',
    expertise: ['Hackathons', 'Project Building', 'MVP', 'Portfolio', 'Pitching', 'Teamwork'],
    relevantTopics: ['hackathon', 'project', 'build', 'mvp', 'portfolio', 'demo', 'pitch', 'team', 'deadline', 'submission', 'devpost', 'unstop', 'prototype', 'ship', 'deploy', 'github', 'readme'],
    irrelevantTopics: ['dsa', 'algorithms', 'leetcode', 'competitive programming', 'complexity analysis'],
    catchphrase: 'Ship it! You can refactor later.',
    systemPrompt: `You are "The Hustler" — an experienced hackathon veteran and project builder.
Your personality:
- You've won hackathons and you know the strategy behind it
- You believe in "Done is better than perfect" and MVP thinking
- You give advice on what to build, how to scope, and when to cut features
- You focus on impact, demo-ability, and what judges care about
- You use phrases like "Ship it!", "What's your demo story?", "Cut that feature, focus on the core"
- You're energetic, slightly impatient, and always thinking about the deadline
Keep responses action-oriented (3-5 sentences). Every piece of advice should be immediately actionable.`
  }
};

/**
 * Checks if a mentor is relevant to the current topic.
 * Returns true if the mentor should speak, false if they should stay silent.
 */
function isMentorRelevant(mentorId, message) {
  const mentor = MENTORS[mentorId];
  if (!mentor) return false;

  const lowerMessage = message.toLowerCase();

  // Check if the message contains any irrelevant-only topics
  const hasIrrelevantOnly = mentor.irrelevantTopics.some(topic =>
    lowerMessage.includes(topic)
  );
  const hasRelevant = mentor.relevantTopics.some(topic =>
    lowerMessage.includes(topic)
  );

  // If it's ONLY about irrelevant topics (none of their relevant topics match), stay silent
  if (hasIrrelevantOnly && !hasRelevant) return false;

  // General questions are always relevant
  return true;
}

/**
 * Chat with a specific mentor.
 * @route POST /api/v1/mentors/chat
 */
const chatWithMentor = async (req, res) => {
  try {
    const { message, mentorId, context = '', history = [] } = req.body;

    if (!message || !mentorId) {
      return res.status(400).json({ message: 'message and mentorId are required.' });
    }

    const mentor = MENTORS[mentorId];
    if (!mentor) {
      return res.status(400).json({ message: `Unknown mentor: "${mentorId}". Valid options: grinder, strategist, communicator, hustler.` });
    }

    // Relevancy gate — mentor stays silent on irrelevant topics
    if (!isMentorRelevant(mentorId, message)) {
      return res.json({
        mentor: {
          id: mentor.id,
          name: mentor.name,
          avatar: mentor.avatar
        },
        reply: `${mentor.avatar} *${mentor.name} shrugs* — "${message.substring(0, 50)}..." isn't really my area. Try asking ${getSuggestedMentor(message)} about this instead.`,
        isRelevant: false,
        suggestedMentor: getSuggestedMentor(message)
      });
    }

    // Build conversation with history
    const historyContext = history.length > 0
      ? `\nPrevious conversation:\n${history.map(h => `${h.role}: ${h.content}`).join('\n')}`
      : '';

    const prompt = `${context ? `Context about the student: ${context}\n` : ''}${historyContext}\n\nStudent's question: "${message}"\n\nRespond in character. Keep it concise and actionable.`;

    const result = await callAIForFeature(
      'conversational',
      prompt,
      mentor.systemPrompt,
      false,
      `${mentor.catchphrase} Sorry, I'm having trouble thinking right now. Try asking me again in a moment.`
    );

    res.json({
      mentor: {
        id: mentor.id,
        name: mentor.name,
        avatar: mentor.avatar,
        catchphrase: mentor.catchphrase
      },
      reply: result.text,
      provider: result.provider,
      isRelevant: true,
      isFallback: result.isFallback
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all mentors' advice on a single topic (debate mode).
 * @route POST /api/v1/mentors/debate
 */
const mentorDebate = async (req, res) => {
  try {
    const { topic, context = '' } = req.body;

    if (!topic) {
      return res.status(400).json({ message: 'topic is required.' });
    }

    const responses = {};

    // Ask each relevant mentor in parallel
    const mentorIds = Object.keys(MENTORS);
    const promises = mentorIds.map(async (id) => {
      const mentor = MENTORS[id];

      if (!isMentorRelevant(id, topic)) {
        return {
          id,
          reply: `${mentor.avatar} *passes* — Not my area.`,
          isRelevant: false
        };
      }

      const prompt = `${context ? `Context: ${context}\n` : ''}Topic being discussed: "${topic}"\n\nGive your perspective on this topic. Be concise (2-3 sentences max). You may disagree with other mentors if your expertise suggests a different approach.`;

      try {
        const result = await callAIForFeature(
          'conversational',
          prompt,
          mentor.systemPrompt,
          false,
          `${mentor.catchphrase} I'd need to think more about this.`
        );
        return { id, reply: result.text, isRelevant: true };
      } catch (err) {
        return { id, reply: `${mentor.catchphrase} Let me think about that...`, isRelevant: true };
      }
    });

    const results = await Promise.all(promises);

    for (const result of results) {
      const mentor = MENTORS[result.id];
      responses[result.id] = {
        mentor: {
          id: mentor.id,
          name: mentor.name,
          avatar: mentor.avatar
        },
        reply: result.reply,
        isRelevant: result.isRelevant
      };
    }

    res.json({
      topic,
      responses,
      participatingMentors: results.filter(r => r.isRelevant).length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all mentor profiles (for frontend rendering).
 * @route GET /api/v1/mentors/profiles
 */
const getMentorProfiles = (req, res) => {
  const profiles = Object.values(MENTORS).map(m => ({
    id: m.id,
    name: m.name,
    avatar: m.avatar,
    personality: m.personality,
    style: m.style,
    expertise: m.expertise,
    catchphrase: m.catchphrase
  }));
  res.json(profiles);
};

/**
 * Suggests the best mentor for a given message.
 */
function getSuggestedMentor(message) {
  const lower = message.toLowerCase();
  for (const [id, mentor] of Object.entries(MENTORS)) {
    if (mentor.relevantTopics.some(t => lower.includes(t))) {
      return mentor.name;
    }
  }
  return 'The Communicator'; // default
}

module.exports = {
  chatWithMentor,
  mentorDebate,
  getMentorProfiles,
  MENTORS
};
