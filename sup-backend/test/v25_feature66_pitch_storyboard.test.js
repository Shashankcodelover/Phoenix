const { describe, it } = require('node:test');
const assert = require('node:assert');

const { PitchStoryboardEngine } = require('../modules/hackathon-agent/pitchStoryboardEngine');

describe('V25 Enterprise Tier: Feature 66 — AI Pitch Video Storyboard & WebVTT Generator', () => {
  const engine = new PitchStoryboardEngine();

  it('generates 4-scene video demo storyboard with timing, narration, and WebVTT subtitles', () => {
    const report = engine.generateStoryboard({
      projectTitle: 'Phoenix Autonomous Platform',
      targetAudience: 'Hackathon Grand Prize Judges',
      keyFeatureHighlight: 'Transactional Outbox & Real-Time Voice AI'
    });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.storyboardScenes.length, 4);
    assert.ok(report.webVttSubtitles.includes('WEBVTT'));
    assert.ok(report.storyboardScenes[1].visualScreenCue.includes('Transactional Outbox'));
    assert.strictEqual(report.videoExportTips.length, 3);
  });
});
