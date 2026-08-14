const { describe, it } = require('node:test');
const assert = require('node:assert');

const { PitchTimerBuzzerEngine, PITCH_PHASES } = require('../modules/hackathon-agent/pitchTimerBuzzerEngine');

describe('V24 Quality Focus: Feature 23 — Stage-Ready 180s Pitch Timer & Audio Buzzer Engine', () => {
  const engine = new PitchTimerBuzzerEngine();

  it('returns structured 180s countdown timer configuration across 4 synchronized phases', () => {
    const config = engine.getTimerConfiguration({ totalTimeSeconds: 180, qaTimeSeconds: 60 });

    assert.strictEqual(config.success, true);
    assert.strictEqual(config.totalPitchSeconds, 180);
    assert.strictEqual(config.qaDefenseSeconds, 60);
    assert.strictEqual(config.phases.length, 4);

    const phase1 = config.phases[0];
    assert.strictEqual(phase1.name, 'The Hook & Problem Statement');
    assert.strictEqual(phase1.durationSeconds, 30);

    const phase2 = config.phases[1];
    assert.ok(phase2.name.includes('Live Product Demo'));
    assert.strictEqual(phase2.durationSeconds, 60);
  });

  it('provides exact Web Audio API tone frequencies for phase chimes and hard stop buzzers', () => {
    const config = engine.getTimerConfiguration();

    assert.strictEqual(config.audioFrequencies.phaseChangeToneHz, 880);
    assert.strictEqual(config.audioFrequencies.warningToneHz, 440);
    assert.strictEqual(config.audioFrequencies.timeUpHardStopHz, 220);
    assert.ok(config.stageReadinessTips.length >= 2);
  });
});
