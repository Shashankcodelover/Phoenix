const { describe, it } = require('node:test');
const assert = require('node:assert');

const { AudioWaveformPitchEngine } = require('../modules/interview-prep/audioWaveformPitchEngine');

describe('V24 Quality Focus: Feature 20 — Real-Time WebRTC Audio Waveform & Vocal Pitch Gauge', () => {
  const engine = new AudioWaveformPitchEngine();

  it('analyzes stable audio telemetry and rates delivery as Calm & Authoritative with 96% stability', () => {
    const report = engine.analyzeWaveformTelemetry({
      audioDurationMs: 12000,
      sampleRate: 16000,
      rmsEnergy: 0.82,
      avgPitchHz: 142,
      pitchVariance: 6.2
    });

    assert.strictEqual(report.success, true);
    assert.ok(report.sampleRate.includes('16 kHz'));
    assert.strictEqual(report.metrics.pitchStabilityScore, '96% (Executive Stability)');
    assert.strictEqual(report.toneClassification, 'Calm, Authoritative & Executive Presence');
    assert.strictEqual(report.waveformFrequencies.length, 15);
    assert.ok(report.prosodyFeedback.includes('Excellent vocal pitch stability'));
  });

  it('detects high jitter and vocal tremors when pitch variance exceeds thresholds', () => {
    const report = engine.analyzeWaveformTelemetry({
      avgPitchHz: 210,
      pitchVariance: 32.5
    });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.toneClassification, 'High Jitter / Nervous Tremor Detected');
    assert.ok(report.prosodyFeedback.includes('anchor your tone'));
  });
});
