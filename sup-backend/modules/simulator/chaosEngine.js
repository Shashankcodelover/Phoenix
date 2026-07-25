/**
 * Chaos Event Engine
 * Random unexpected incidents during hackathon game simulation.
 */

const CHAOS_EVENTS = [
  {
    id: 'api_rate_limit',
    title: '🚨 API Key Rate Limited!',
    description: 'Your primary AI model API key exceeded quota 2 hours before submission deadline.',
    optionA: { label: 'Switch to local fallback engine (-5% Innovation, 0 Time lost)', effect: { innovation: -5, timeCost: 0 } },
    optionB: { label: 'Spend 30 mins upgrading to paid tier (-30 mins, +10% Execution)', effect: { execution: 10, timeCost: 30 } }
  },
  {
    id: 'wifi_outage',
    title: '📡 Venue Wi-Fi Outage!',
    description: 'The hackathon venue Wi-Fi router overheated and crashed.',
    optionA: { label: 'Tether to phone mobile hotspot (-15 mins, 0 penalty)', effect: { execution: 0, timeCost: 15 } },
    optionB: { label: 'Work on local offline mock data (-10% Realism, 0 Time lost)', effect: { execution: -10, timeCost: 0 } }
  },
  {
    id: 'spilled_coffee',
    title: '☕ Spilled Energy Drink!',
    description: 'A teammate accidentally knocked over a Red Bull onto the frontend developer\'s laptop.',
    optionA: { label: 'Use backup laptop & restore git commit (-20 mins)', effect: { execution: -5, timeCost: 20 } },
    optionB: { label: 'Pair program on single machine (+10% Team Alignment, -15 mins)', effect: { execution: 5, timeCost: 15 } }
  },
  {
    id: 'sponsor_challenge',
    title: '🎁 Surprise Sponsor Track Unlocked!',
    description: 'A sponsor announced a $5,000 bounty for integration with their API.',
    optionA: { label: 'Pivoting to integrate sponsor API (+15% Innovation, -25 mins)', effect: { innovation: 15, timeCost: 25 } },
    optionB: { label: 'Ignore sponsor track, focus on core pitch (+10% Pitch Score)', effect: { pitch: 10, timeCost: 0 } }
  },
  {
    id: 'judge_mandate',
    title: '⚡ Judge Surprise Mandate!',
    description: 'Lead judge announced that all submissions must include a live deployment link.',
    optionA: { label: 'Deploy to Vercel/Render immediately (-15 mins, +10% Execution)', effect: { execution: 10, timeCost: 15 } },
    optionB: { label: 'Risk running local demo only (-15% Judge Favorability)', effect: { pitch: -15, timeCost: 0 } }
  }
];

function triggerRandomChaos() {
  const randomIndex = Math.floor(Math.random() * CHAOS_EVENTS.length);
  return CHAOS_EVENTS[randomIndex];
}

module.exports = { CHAOS_EVENTS, triggerRandomChaos };
