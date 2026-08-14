const { describe, it } = require('node:test');
const assert = require('node:assert');

const { DemoScriptFallbackEngine, SEVEN_BEAT_DEMO_SCRIPT } = require('../modules/hackathon-agent/demoScriptFallbackEngine');

describe('V24 Quality Focus: Feature 33 — Stage Demo Click-Through Script & Fallback Engine', () => {
  const engine = new DemoScriptFallbackEngine();

  it('generates a 7-beat stage presentation click-through script with exact timing', () => {
    const report = engine.generateDemoScript({ projectName: 'Phoenix Apex Ultra' });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.totalDurationSeconds, 180);
    assert.strictEqual(report.beatsCount, 7);
    assert.strictEqual(report.stageScript.length, 7);

    const wowBeat = report.stageScript.find(b => b.beat === 3);
    assert.ok(wowBeat);
    assert.ok(wowBeat.action.includes('WOW Moat'));

    assert.strictEqual(report.failsafeFallbacks.length, 3);
    const wifiFallback = report.failsafeFallbacks.find(f => f.triggerCondition.includes('Wi-Fi'));
    assert.ok(wifiFallback);
    assert.ok(wifiFallback.immediateAction.includes('localhost:5000'));
  });
});
