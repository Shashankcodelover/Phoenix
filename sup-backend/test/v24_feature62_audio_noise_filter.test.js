const { describe, it } = require('node:test');
const assert = require('node:assert');

const { AudioNoiseFilterEngine } = require('../modules/interview-prep/audioNoiseFilterEngine');

describe('V24 Quality Focus: Feature 62 — WebAssembly Audio Noise Suppression Engine', () => {
  const engine = new AudioNoiseFilterEngine();

  it('filters laptop fan hum and recalibrates vocal pitch stability', () => {
    const report = engine.processAudioStream({
      rawNoiseFloorDb: -36,
      detectedFanHumHz: 120,
      inputPitchVariance: 14.5
    });

    assert.strictEqual(report.success, true);
    assert.ok(report.audioSignalMetrics.notchedFrequencies.includes('120 Hz'));
    assert.ok(report.calibratedPitchTelemetry.deliveryState.includes('Calm'));
  });
});
