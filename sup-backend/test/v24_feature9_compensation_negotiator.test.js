const { describe, it } = require('node:test');
const assert = require('node:assert');

const { CompensationNegotiatorEngine } = require('../modules/interview-prep/compensationNegotiatorEngine');

describe('V24 Quality Focus: Feature 9 — Compensation & Stock Equity Negotiation Engine', () => {
  const engine = new CompensationNegotiatorEngine();

  it('benchmarks Google L4 offer, calculates market percentile, and produces counter-offer targets', () => {
    const report = engine.evaluateAndGenerateScript({
      company: 'Google',
      roleLevel: 'google_l4',
      baseSalary: 155000,
      annualStockGrant: 85000,
      signonBonus: 25000,
      hasCompetingOffer: true,
      competingCompany: 'Meta',
      competingTC: 285000
    });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.company, 'Google');
    assert.ok(report.marketBenchmark.percentile.startsWith('P'));
    assert.ok(report.counterOfferRecommendation.recommendedBase.includes('$'));
    assert.ok(report.counterOfferRecommendation.recommendedEquity.includes('$'));
    assert.ok(report.counterOfferRecommendation.potentialUpside.includes('+'));
  });

  it('drafts executive recruiter counter-offer email script citing competing leverage', () => {
    const report = engine.evaluateAndGenerateScript({
      company: 'Google',
      roleLevel: 'google_l4',
      baseSalary: 145000,
      annualStockGrant: 75000,
      signonBonus: 15000,
      hasCompetingOffer: true,
      competingCompany: 'Microsoft',
      competingTC: 260000
    });

    const email = report.negotiationArtifacts.recruiterEmailTemplate;
    assert.ok(email.includes('Subject: Following up on Offer'));
    assert.ok(email.includes('Microsoft'));
    assert.ok(email.includes('Base Salary:'));
    assert.ok(email.includes('Annual Equity (RSUs):'));
    assert.ok(report.negotiationArtifacts.phoneNegotiationKeypoints.length >= 3);
    assert.ok(report.negotiationArtifacts.riskLevel.includes('LOW / SAFE'));
  });
});
