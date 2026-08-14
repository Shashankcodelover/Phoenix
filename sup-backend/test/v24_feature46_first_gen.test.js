const { describe, it } = require('node:test');
const assert = require('node:assert');

const { FirstGenGraduateEngine } = require('../modules/horizon/firstGenGraduateEngine');

describe('V24 Quality Focus: Feature 46 — First-Generation Graduate Toolkit Engine', () => {
  const engine = new FirstGenGraduateEngine();

  it('evaluates verified first-generation status, ₹1,00,000 4-year tuition concession, and Tahsildar checklist', () => {
    const report = engine.evaluateFirstGenProfile({
      fatherEducation: '10th Standard',
      motherEducation: '8th Standard',
      siblingGraduates: 0,
      annualFamilyIncomeInr: 300000
    });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.isFirstGenEligible, true);
    assert.strictEqual(report.financialAssistance.annualTuitionConcession, '₹25,000/year');
    assert.strictEqual(report.financialAssistance.totalFourYearSavings, '₹1,00,000');
    assert.ok(report.documentChecklist.some(d => d.includes('Tahsildar')));
    assert.strictEqual(report.academicMilestonePlaybook.length, 4);
  });
});
