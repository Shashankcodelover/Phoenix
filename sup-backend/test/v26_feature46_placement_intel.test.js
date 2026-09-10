const { describe, it } = require('node:test');
const assert = require('node:assert');

const {
  campusPlacementIntelEngine,
  PLACEMENT_DATA,
  PRESETS
} = require('../modules/horizon/campusPlacementIntelEngine');

describe('V26 Feature 46: Campus Placement Intelligence & Offer Histograms', () => {
  it('retrieves verified institutional placement catalogs', () => {
    const res = campusPlacementIntelEngine.getCollegesList();
    assert.strictEqual(res.success, true);
    assert.ok(Array.isArray(res.colleges));
    assert.ok(res.colleges.length >= 5);

    const rvce = res.colleges.find(c => c.code === 'RVCE');
    assert.ok(rvce);
    assert.strictEqual(rvce.placementPercentage, 94.2);
    assert.strictEqual(rvce.highestCtcLpa, 62.0);

    const nitk = res.colleges.find(c => c.code === 'NITK');
    assert.ok(nitk);
    assert.strictEqual(nitk.medianCtcLpa, 15.8);
    assert.strictEqual(nitk.tier, 'Institute of National Importance (INI)');
  });

  it('retrieves candidate presets', () => {
    const presets = campusPlacementIntelEngine.getPresets();
    assert.ok(Array.isArray(presets));
    assert.ok(presets.length >= 3);
    assert.ok(presets.some(p => p.id === 'rvce_cs_elite'));
  });

  it('analyzes placement distribution & predicts Super-Dream odds for RVCE CS elite student', () => {
    const res = campusPlacementIntelEngine.analyze({
      collegeCode: 'RVCE',
      branch: 'CSE',
      cgpa: 9.10,
      dsaRating: 1750,
      leetcodeSolved: 380,
      hackathonsWon: 2,
      hasPriorInternship: true
    });

    assert.strictEqual(res.success, true);
    assert.strictEqual(res.college.code, 'RVCE');
    assert.strictEqual(res.college.totalEligibleStudents, 1420);
    assert.ok(Array.isArray(res.college.salaryHistogram));
    assert.strictEqual(res.college.salaryHistogram.length, 7);

    // Tier breakdown checks
    assert.ok(res.college.tierBreakdown.superDream);
    assert.strictEqual(res.college.tierBreakdown.superDream.percent, 28.5);
    assert.ok(res.college.tierBreakdown.superDream.companies.includes('Uber'));

    // Candidate forecast
    assert.strictEqual(res.candidateForecast.targetTierVerdict, 'Super-Dream Tier (> ₹20 LPA)');
    assert.ok(res.candidateForecast.odds.superDreamPct >= 50);
    assert.ok(res.candidateForecast.tacticalDirectives.length >= 1);
  });

  it('accurately adjusts odds and provides off-campus directives for Tier-3 regional student', () => {
    const res = campusPlacementIntelEngine.analyze({
      collegeCode: 'TIER3_VTU',
      branch: 'ISE',
      cgpa: 8.20,
      dsaRating: 1850,
      leetcodeSolved: 450,
      hackathonsWon: 3,
      hasPriorInternship: false
    });

    assert.strictEqual(res.success, true);
    assert.strictEqual(res.college.code, 'TIER3_VTU');
    assert.strictEqual(res.college.tierBreakdown.mass.percent, 70.0);
    assert.ok(res.candidateForecast.tacticalDirectives.some(d => d.includes('off-campus')));
    assert.ok(res.candidateForecast.tacticalDirectives.some(d => d.includes('internship')));
  });
});
