/**
 * AI Teammate Personality Engine
 * 4 AI Teammates: Builder, Designer, Strategist, Dreamer
 * Provides active opinions, domain feedback, and crew voting conflicts.
 */

const TEAMMATES = [
  {
    id: 'builder',
    name: 'Alex (The Builder)',
    role: 'Backend & AI Engineer',
    avatar: '👨‍💻',
    preferredTech: ['Node.js', 'Python', 'PostgreSQL', 'FastAPI', 'Redis'],
    hatedTech: ['Decentralized DB', 'NoCode', 'PHP'],
    evaluate: (selection) => {
      const tech = (selection.techStack || []).join(' ');
      if (/Node|Python|PostgreSQL|FastAPI|Redis/i.test(tech)) {
        return { vote: 'YES', comment: 'Solid tech stack choice. Easy to scale and easy to build cleanly.' };
      }
      return { vote: 'NO', comment: 'This architecture sounds fragile. We are going to hit database locks and race conditions.' };
    }
  },
  {
    id: 'designer',
    name: 'Maya (The Designer)',
    role: 'UI/UX Specialist',
    avatar: '🎨',
    preferredTech: ['React', 'Next.js', 'Tailwind', 'Figma', 'Three.js'],
    hatedTech: ['Headless API only', 'CLI tool', 'Assembly'],
    evaluate: (selection) => {
      const tech = (selection.techStack || []).join(' ');
      if (/React|Next|Tailwind|Vue|Figma/i.test(tech)) {
        return { vote: 'YES', comment: 'Awesome UI capabilities! We can create an incredible dashboard that will wow the judges.' };
      }
      return { vote: 'NO', comment: 'If we build a pure API or CLI tool, the judges won\'t have anything visually exciting to look at!' };
    }
  },
  {
    id: 'strategist',
    name: 'Rohan (The Founder)',
    role: 'Product Strategy & Business',
    avatar: '📈',
    preferredTech: ['Stripe', 'Analytics', 'SaaS', 'B2B', 'Micro-transactions'],
    hatedTech: ['Free open source without monetization', 'Pure academic project'],
    evaluate: (selection) => {
      const usp = selection.usp || '';
      if (/monetiz|B2B|market|subscription|enterprise|growth/i.test(usp)) {
        return { vote: 'YES', comment: 'Great market alignment! VCs love projects with clear recurring revenue potential.' };
      }
      return { vote: 'NO', comment: 'Where is the business model? Thin margins and no monetization strategy will hurt our score.' };
    }
  },
  {
    id: 'dreamer',
    name: 'Elena (The AI Dreamer)',
    role: 'AI & Innovation Researcher',
    avatar: '🚀',
    preferredTech: ['TensorFlow', 'PyTorch', 'Vector DB', 'LLM Agents', 'LangChain'],
    hatedTech: ['Basic CRUD app', 'Static HTML'],
    evaluate: (selection) => {
      const features = (selection.features || []).join(' ');
      if (/AI|Agent|Vector|Neural|LLM|Automated|Autonomous/i.test(features)) {
        return { vote: 'YES', comment: 'Now this is cutting-edge! Using AI agents gives us a massive innovation boost.' };
      }
      return { vote: 'NO', comment: 'This feels like a standard CRUD app. We need more innovation to win 1st place!' };
    }
  }
];

function evaluateCrewVote(selection) {
  const votes = TEAMMATES.map(tm => ({
    id: tm.id,
    name: tm.name,
    role: tm.role,
    avatar: tm.avatar,
    ...tm.evaluate(selection)
  }));

  const yesCount = votes.filter(v => v.vote === 'YES').length;
  const consensus = yesCount >= 3;
  const alignmentBonus = consensus ? 15 : yesCount >= 2 ? 5 : -10;

  return {
    votes,
    yesCount,
    total: votes.length,
    consensus,
    alignmentBonus,
    summary: consensus
      ? '🎉 Crew Consensus Reached! Your team is fully aligned.'
      : '⚠️ Crew Split! Teammates have conflicting opinions on this choice.'
  };
}

module.exports = { TEAMMATES, evaluateCrewVote };
