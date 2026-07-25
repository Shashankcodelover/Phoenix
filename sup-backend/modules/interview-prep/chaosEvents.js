/**
 * Phoenix v2.0: Chaos Engine for Mock Interviews
 * 
 * Inspired by The Hackathon Simulator's Chaos Engine.
 * Injects unexpected events during mock interviews to train students
 * for real-world interview pressure. Each event presents a binary choice
 * with meaningful tradeoffs.
 * 
 * Events are selected using weighted random sampling,
 * and previously triggered events are excluded from the pool.
 */

const CHAOS_EVENTS = [
  {
    id: 'topic_switch',
    name: 'Topic Switcheroo',
    description: 'The interviewer suddenly changes topics mid-question.',
    weight: 20,
    trigger: 'The interviewer interrupts: "Actually, let me switch gears completely. Let\'s talk about something different."',
    choices: [
      {
        label: 'Stay calm and pivot smoothly',
        effect: { communication: +5, technicalDepth: -2 },
        feedback: 'Great composure! Real interviewers often switch topics to test adaptability.'
      },
      {
        label: 'Ask to finish the current topic first',
        effect: { communication: +2, technicalDepth: +3 },
        feedback: 'Bold move. Some interviewers respect candidates who advocate for completing thoughts.'
      }
    ]
  },
  {
    id: 'time_crunch',
    name: 'Time Crunch',
    description: 'The interview is unexpectedly cut short.',
    weight: 15,
    trigger: '"Sorry, I have another meeting in 5 minutes. Can you give me the key points quickly?"',
    choices: [
      {
        label: 'Summarize in 30 seconds — hit only the highlights',
        effect: { communication: +7 },
        feedback: 'Excellent! Being able to compress complex ideas into a clear summary is a top-tier skill.'
      },
      {
        label: 'Ask if you can reschedule to give a proper answer',
        effect: { communication: -2, leadership: +3 },
        feedback: 'Asking to reschedule shows you value quality, but be careful, it can come across as inflexible.'
      }
    ]
  },
  {
    id: 'curveball_question',
    name: 'The Curveball',
    description: 'An unexpected question completely outside your prep area.',
    weight: 20,
    trigger: '"Here\'s a question we don\'t usually ask, but I\'m curious: If you had to explain your project to a 10-year-old, how would you do it?"',
    choices: [
      {
        label: 'Use a creative analogy to simplify',
        effect: { communication: +8 },
        feedback: 'Perfect! The ability to simplify complex concepts is what separates good engineers from great ones.'
      },
      {
        label: 'Politely redirect to a more technical explanation',
        effect: { technicalDepth: +3, communication: -3 },
        feedback: 'You showed technical confidence, but missed a chance to demonstrate communication range.'
      }
    ]
  },
  {
    id: 'requirements_change',
    name: 'Requirements Changed!',
    description: 'The PM just changed the project requirements during your design discussion.',
    weight: 15,
    trigger: '"The product team just told me we need to support 10x the original user count. How does that change your design?"',
    choices: [
      {
        label: 'Adapt the design on the fly — add caching, CDN, and horizontal scaling',
        effect: { systemThinking: +8, technicalDepth: +3 },
        feedback: 'Excellent systems thinking! You showed you can handle ambiguity and scale dynamically.'
      },
      {
        label: 'Push back — ask what trade-offs they\'re willing to accept',
        effect: { leadership: +5, systemThinking: +3 },
        feedback: 'Strong leadership move. Real engineers push back on unreasonable scope changes.'
      }
    ]
  },
  {
    id: 'brain_freeze',
    name: 'Brain Freeze',
    description: 'You suddenly draw a blank on a concept you definitely know.',
    weight: 18,
    trigger: 'You\'re mid-explanation and suddenly forget a key concept. The interviewer is waiting patiently...',
    choices: [
      {
        label: 'Be honest — "Let me think about this for a moment"',
        effect: { communication: +5, technicalDepth: +2 },
        feedback: 'Honesty is respected in interviews. Taking a pause to think shows maturity over rambling.'
      },
      {
        label: 'Talk around it — describe the concept without naming it',
        effect: { communication: +3, technicalDepth: -1 },
        feedback: 'Creative recovery! Sometimes describing the edges of an idea is enough to jog your memory.'
      }
    ]
  },
  {
    id: 'code_bug',
    name: 'The Bug',
    description: 'The interviewer points out a bug in your code solution.',
    weight: 18,
    trigger: '"I think there\'s an edge case you\'re missing here. What happens when the input is empty?"',
    choices: [
      {
        label: 'Walk through the edge case step by step, fix it live',
        effect: { technicalDepth: +8, communication: +3 },
        feedback: 'This is exactly what interviewers want to see! Debugging live shows real problem-solving skills.'
      },
      {
        label: 'Acknowledge the bug and describe how you\'d add tests for it',
        effect: { technicalDepth: +4, builderScore: +4 },
        feedback: 'Good engineering practice! Thinking about testing shows production-level maturity.'
      }
    ]
  },
  {
    id: 'hostile_interviewer',
    name: 'The Skeptic',
    description: 'The interviewer aggressively challenges your approach.',
    weight: 12,
    trigger: '"I\'m not convinced this is the right approach. Can you justify why this is better than alternative X?"',
    choices: [
      {
        label: 'Calmly compare trade-offs between your approach and the alternative',
        effect: { communication: +6, systemThinking: +4 },
        feedback: 'Handling pushback professionally is a CRUCIAL skill. You showed composure and analytical thinking.'
      },
      {
        label: 'Concede that the alternative might be better and explain when you\'d use each',
        effect: { communication: +4, leadership: +3 },
        feedback: 'Flexibility and intellectual humility are underrated. Strong engineers know when their approach isn\'t optimal.'
      }
    ]
  },
  {
    id: 'tech_failure',
    name: 'Technical Difficulties',
    description: 'Your screen share or connection glitches during the interview.',
    weight: 10,
    trigger: '*Simulated connection issue* — Your screen freezes for 5 seconds. The interviewer says "I lost you for a second there."',
    choices: [
      {
        label: 'Quickly summarize what you were showing and continue',
        effect: { communication: +5 },
        feedback: 'Professional recovery! In the remote work era, handling tech glitches gracefully is expected.'
      },
      {
        label: 'Use it as a natural break to re-organize your thoughts',
        effect: { communication: +3, technicalDepth: +2 },
        feedback: 'Smart move — turning an interruption into a strategic pause shows composure.'
      }
    ]
  },
  {
    id: 'pair_programming',
    name: 'Pair Programming Surprise',
    description: 'The interviewer wants to code WITH you instead of watching you.',
    weight: 12,
    trigger: '"Let me share my screen too. Let\'s solve this together — I\'ll write some parts, you write others."',
    choices: [
      {
        label: 'Embrace it — communicate your thinking out loud as you go',
        effect: { communication: +6, leadership: +4 },
        feedback: 'Pair programming tests collaboration skills. Thinking out loud is exactly what they want to see.'
      },
      {
        label: 'Ask clarifying questions about the division of work first',
        effect: { leadership: +5, systemThinking: +2 },
        feedback: 'Great organizational instinct! Setting clear expectations prevents confusion in pair work.'
      }
    ]
  },
  {
    id: 'impossible_question',
    name: 'The Impossible Question',
    description: 'You\'re asked something that has no single correct answer.',
    weight: 10,
    trigger: '"How many golf balls fit in a school bus?" or "How would you move Mount Fuji?"',
    choices: [
      {
        label: 'Break it down with estimation — show your reasoning process',
        effect: { systemThinking: +6, communication: +4 },
        feedback: 'Fermi estimation questions test your reasoning process, not the answer. You nailed the approach.'
      },
      {
        label: 'Ask clarifying questions first — what size bus? What counts as \'fit\'?',
        effect: { communication: +5, leadership: +3 },
        feedback: 'Asking clarifying questions shows you don\'t jump to conclusions. Great engineering mindset.'
      }
    ]
  }
];

/**
 * Selects a random chaos event using weighted sampling.
 * Excludes events that have already been triggered.
 * 
 * @param {Array} excludeIds - IDs of events to exclude
 * @param {number} triggerChance - Probability (0-1) of triggering an event (default: 0.25)
 * @returns {Object|null} The selected event, or null if no event triggers
 */
function selectChaosEvent(excludeIds = [], triggerChance = 0.25) {
  // Roll for trigger chance
  if (Math.random() > triggerChance) return null;

  // Filter available events
  const available = CHAOS_EVENTS.filter(e => !excludeIds.includes(e.id));
  if (available.length === 0) return null;

  // Weighted random selection
  const totalWeight = available.reduce((sum, e) => sum + e.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const event of available) {
    roll -= event.weight;
    if (roll <= 0) {
      return {
        id: event.id,
        name: event.name,
        description: event.description,
        trigger: event.trigger,
        choices: event.choices.map(c => ({
          label: c.label,
          // Don't reveal the effects until the choice is made
        }))
      };
    }
  }

  return available[0]; // fallback
}

/**
 * Resolves a chaos event choice and returns the effects.
 * 
 * @param {string} eventId - The chaos event ID
 * @param {number} choiceIndex - 0 or 1
 * @returns {Object} { effect, feedback } or null if invalid
 */
function resolveChaosChoice(eventId, choiceIndex) {
  const event = CHAOS_EVENTS.find(e => e.id === eventId);
  if (!event) return null;

  const choice = event.choices[choiceIndex];
  if (!choice) return null;

  return {
    eventName: event.name,
    chosenAction: choice.label,
    effect: choice.effect,
    feedback: choice.feedback
  };
}

/**
 * Returns all chaos events (for admin/debug purposes).
 */
function getAllChaosEvents() {
  return CHAOS_EVENTS.map(e => ({
    id: e.id,
    name: e.name,
    description: e.description,
    weight: e.weight
  }));
}

module.exports = {
  CHAOS_EVENTS,
  selectChaosEvent,
  resolveChaosChoice,
  getAllChaosEvents
};
