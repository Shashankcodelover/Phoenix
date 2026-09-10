const { describe, it } = require('node:test');
const assert = require('node:assert');
const { postGradTrajectoryEngine } = require('../modules/horizon/postGradTrajectoryEngine');

describe('Feature 59: Post-Graduation Career Trajectory Forecaster Engine', () => {
  it('should list all supported career progression tracks', () => {
    const tracks = postGradTrajectoryEngine.getCareerTracks();
    assert.ok(Array.isArray(tracks));
    assert.ok(tracks.length >= 3);
    const ic = tracks.find(t => t.key === 'INDIVIDUAL_CONTRIBUTOR');
    assert.ok(ic);
    assert.ok(ic.ladder.length >= 5);
  });

  it('should return valid trajectory presets', () => {
    const presets = postGradTrajectoryEngine.getPresets();
    assert.ok(Array.isArray(presets));
    assert.ok(presets.length >= 3);
    assert.ok(presets[0].label.includes('FAANG'));
  });

  it('should calculate 10-year trajectory forecast for IC Track', () => {
    const forecast = postGradTrajectoryEngine.forecastTrajectory({
      trackKey: 'INDIVIDUAL_CONTRIBUTOR',
      startingCtcLpa: 22.0,
      upskillCadence: 'HIGH'
    });

    assert.ok(forecast.timeline);
    assert.strictEqual(forecast.timeline.length, 5);
    assert.strictEqual(forecast.timeline[0].totalCtcLpa, 22.0);
    assert.ok(forecast.fiveYearTargetCtcLpa > 50.0);
    assert.ok(forecast.tenYearTargetCtcLpa > 100.0);
    assert.ok(forecast.cagr10YrPct > 10.0);
  });

  it('should scale trajectory based on higher starting salary and cadence', () => {
    const aiForecast = postGradTrajectoryEngine.forecastTrajectory({
      trackKey: 'AI_RESEARCH_SCIENTIST',
      startingCtcLpa: 25.0,
      upskillCadence: 'VERY HIGH'
    });

    assert.strictEqual(aiForecast.trackKey, 'AI_RESEARCH_SCIENTIST');
    assert.ok(aiForecast.tenYearTargetCtcLpa > 150.0);
    assert.ok(aiForecast.timeline[4].equityComponentLpa > 0);
  });
});
