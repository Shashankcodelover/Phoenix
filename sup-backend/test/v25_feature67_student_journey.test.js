const { describe, it } = require('node:test');
const assert = require('node:assert');

const { KarnatakaStudentJourneyEngine } = require('../modules/horizon/karnatakaStudentJourneyEngine');

describe('V25 Blockbuster Tier: Feature 67 — Karnataka Engineering Student A-to-Z Roadmap Engine', () => {
  const engine = new KarnatakaStudentJourneyEngine();

  it('generates a complete 6-phase engineering lifecycle for standard candidate', () => {
    const report = engine.generateCompleteRoadmap({
      studentCategory: 'OBC_3B',
      familyIncome: 350000,
      expectedPcmScore: 145,
      boardPercentage: 95,
      isFirstGenGraduate: true,
      isRuralKannadaMedium: true,
      isPwdCandidate: false
    });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.lifecyclePhases.length, 6);
    assert.ok(report.studentProfile.projectedRankBand.length > 0);
    assert.ok(report.lifecyclePhases[0].phaseName.includes('Pre-Exam'));
    assert.ok(report.lifecyclePhases[3].phaseName.includes('Option Entry'));
    assert.ok(report.lifecyclePhases[4].phaseName.includes('Financial Security'));
    assert.ok(report.lifecyclePhases[5].phaseName.includes('Incubators'));
  });

  it('handles PWD candidate profile and provides specialized medical board instructions', () => {
    const report = engine.generateCompleteRoadmap({
      studentCategory: 'PWD',
      isPwdCandidate: true,
      familyIncome: 150000
    });

    assert.strictEqual(report.success, true);
    assert.ok(report.studentProfile.isPwd.includes('5% PWD Horizontal Reservation'));
    assert.ok(report.lifecyclePhases[0].keyDeliverables[1].includes('UDID'));
    assert.ok(report.lifecyclePhases[2].keyDeliverables[2].includes('Medical Board'));
  });
});
