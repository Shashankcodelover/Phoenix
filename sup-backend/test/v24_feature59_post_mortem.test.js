const { describe, it } = require('node:test');
const assert = require('node:assert');

const { PostMortemAnalyticsEngine } = require('../modules/hackathon-agent/postMortemAnalyticsEngine');

describe('V24 Quality Focus: Feature 59 — Hackathon Post-Mortem Analytics Engine', () => {
  const engine = new PostMortemAnalyticsEngine();

  it('generates 5-axis retrospective radar and v1.0 production evolution roadmap', () => {
    const report = engine.generatePostMortem({
      projectName: 'Phoenix Apex Platform',
      podiumResult: '1st Place Grand Prize'
    });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.projectName, 'Phoenix Apex Platform');
    assert.ok(report.retrospectiveRadar.technicalMoatScore.includes('96/100'));
    assert.ok(report.judgeSentimentAnalysis.sentiment.includes('Bullish'));
    assert.strictEqual(report.v1ProductionRoadmap.length, 3);
    assert.ok(report.investorSeedReadiness.includes('95/100'));
  });
});
