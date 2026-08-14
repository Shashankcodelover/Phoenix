const { describe, it } = require('node:test');
const assert = require('node:assert');

const { TeamSynergyEngine, WINNING_ARCHETYPES } = require('../modules/hackathon-agent/teamSynergyEngine');

describe('V24 Quality Focus: Feature 19 — Hackathon Team Role Synergy & Skill Recommender', () => {
  const engine = new TeamSynergyEngine();

  it('evaluates complete 4-member team and achieves 100/100 synergy with Grand Prize podium probability', () => {
    const report = engine.evaluateTeamSynergy({
      members: [
        { name: 'Alex', primarySkills: ['React', 'Next.js 15', 'TailwindCSS v4', 'UI/UX'] },
        { name: 'David', primarySkills: ['Node.js', 'Redis', 'CockroachDB', 'Distributed Systems'] },
        { name: 'Priya', primarySkills: ['Python', 'LangChain', 'Two-Stage RAG', 'AST Parsing'] },
        { name: 'Sneha', primarySkills: ['Pitch Decks', 'VC Valuation', 'Marp Slides', 'Public Speaking'] }
      ]
    });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.teamSize, 4);
    assert.strictEqual(report.synergyScore, '100/100');
    assert.ok(report.podiumWinProbability.includes('Grand Prize Podium Contender'));
    assert.strictEqual(report.missingArchetypes.length, 0);
    assert.strictEqual(report.recommendedSprintDeliverables.length, 4);
  });

  it('detects missing pitch lead archetype when team is 100% engineering heavy', () => {
    const report = engine.evaluateTeamSynergy({
      members: [
        { name: 'Alex', primarySkills: ['React', 'Next.js 15'] },
        { name: 'David', primarySkills: ['Node.js', 'Distributed'] }
      ]
    });

    assert.strictEqual(report.success, true);
    assert.ok(report.missingArchetypes.some(role => role.includes('Pitch Lead')));
    assert.ok(Number(report.synergyScore.split('/')[0]) < 80);
  });
});
