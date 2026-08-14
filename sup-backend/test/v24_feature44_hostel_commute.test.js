const { describe, it } = require('node:test');
const assert = require('node:assert');

const { CampusHostelCommuteEngine, CAMPUS_LIVING_DATA } = require('../modules/horizon/campusHostelCommuteEngine');

describe('V24 Quality Focus: Feature 44 — Karnataka Campus Hostel & Commute Intelligence Engine', () => {
  const engine = new CampusHostelCommuteEngine();

  it('retrieves living economics, Namma Metro transit pass, and curfew rules for RVCE', () => {
    const report = engine.getHostelCommuteProfile({ collegeCode: 'RVCE' });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.collegeCode, 'RVCE');
    assert.ok(report.collegeName.includes('R.V. College'));
    assert.strictEqual(report.livingEconomics.campusHostelAnnualFee, '₹1,25,000');
    assert.strictEqual(report.livingEconomics.annualSavingsChoosingHostel, '₹50,000/year');
    assert.ok(report.nammaMetroTransit.nearestStation.includes('Purple Line'));
    assert.ok(report.campusRulesAndHygiene.curfewInTime.includes('9:30 PM'));
  });
});
