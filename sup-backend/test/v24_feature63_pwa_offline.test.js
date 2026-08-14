const { describe, it } = require('node:test');
const assert = require('node:assert');

const { PwaOfflineTeleprompterEngine } = require('../modules/hackathon-agent/pwaOfflineTeleprompterEngine');

describe('V24 Quality Focus: Feature 63 — PWA Offline Pitch Teleprompter Engine', () => {
  const engine = new PwaOfflineTeleprompterEngine();

  it('generates offline-first PWA cache configuration and stage disaster-proof guarantee', () => {
    const report = engine.generateOfflineBundle({
      projectName: 'Phoenix Platform',
      audioTonesCached: true
    });

    assert.strictEqual(report.success, true);
    assert.ok(report.offlineReadiness.includes('Disaster-Proof'));
    assert.strictEqual(report.serviceWorkerConfig.cachedRoutes.length, 5);
    assert.ok(report.offlineHardwareCapabilities.stageTeleprompterAutoscroll.includes('60fps'));
  });
});
