const { describe, it } = require('node:test');
const assert = require('node:assert');

const { InstantDiagnostic360 } = require('../modules/horizon/instantDiagnostic360');

describe('V24 Quality Focus: Feature 1 — Instant 360° Diagnostic & 10x Career Blueprint', () => {
  const engine = new InstantDiagnostic360();

  it('evaluates high-performing candidate and awards Top 1% Tier', () => {
    const report = engine.evaluate360({
      stage: 'Engineering',
      aptitudeAnswers: [0, 0, 0, 0, 0, 0], // all correct
      communicationSample: 'When our primary database crashed during high traffic, I implemented an in-memory LRU cache and optimized indexes which resulted in reducing latency by 45% for 20k users.',
      academicMarks: 92,
      annualIncome: 180000,
      targetDream: 'Google SDE-1'
    });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.candidateProfile.stage, 'Engineering');
    assert.ok(report.candidateProfile.compositeScore >= 85);
    assert.ok(report.candidateProfile.readinessTier.includes('Top 1%') || report.candidateProfile.readinessTier.includes('Tier-1'));
    assert.strictEqual(report.skillRadar.mathematicalLogic >= 80, true);
    assert.strictEqual(report.skillRadar.communicationProsody >= 85, true);
  });

  it('accurately captures government financial aid and scholarship eligibility', () => {
    const aidReport = engine.evaluate360({
      stage: 'Diploma',
      aptitudeAnswers: [0, 1, 0, 1, 0, 0],
      communicationSample: 'I built a basic fullstack app.',
      academicMarks: 82,
      annualIncome: 150000, // < ₹2.5 Lakh
      targetDream: 'DCET Top 100 Rank'
    });

    assert.ok(aidReport.financialAidPackage.totalEstimatedGrants.includes('₹'));
    assert.ok(aidReport.financialAidPackage.eligiblePrograms.length >= 1);
    assert.ok(aidReport.financialAidPackage.eligiblePrograms[0].name.includes('SSP') || aidReport.financialAidPackage.eligiblePrograms[0].name.includes('Jindal'));
  });

  it('generates day-by-day 30-day milestone sprint with XP rewards', () => {
    const report = engine.evaluate360({
      stage: 'PU',
      academicMarks: 88,
      annualIncome: 300000,
      targetDream: 'RVCE CSE via KCET'
    });

    assert.strictEqual(report.customized30DaySprint.length, 4);
    assert.ok(report.customized30DaySprint[0].focus.includes('Mathematical Foundation'));
    assert.ok(report.customized30DaySprint[3].focus.includes('Portfolio') || report.customized30DaySprint[3].focus.includes('Defense'));
    assert.ok(report.conversionHook.verifiedBadgeId.startsWith('phx_cert_'));
  });
});
