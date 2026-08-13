const { describe, it } = require('node:test');
const assert = require('node:assert');

const { DemoDisasterRecoveryHub } = require('../modules/hackathon-agent/demoDisasterRecoveryHub');

describe('V24 Quality Focus: Feature 11 — Live Demo Disaster Recovery & Mock Server Fallback Hub', () => {
  const hub = new DemoDisasterRecoveryHub();

  it('generates an emergency offline fallback package with mock payloads and spoken pivot script', () => {
    const recovery = hub.generateRecoveryPackage({
      title: 'NexusAudio',
      endpoints: ['/api/v1/prep/audio-stream/init', '/api/v1/prep/ast/profile']
    });

    assert.strictEqual(recovery.disasterRecoveryActive, true);
    assert.strictEqual(recovery.title, 'NexusAudio');
    assert.ok(recovery.offlineMockPayloads.userProfile);
    assert.ok(recovery.offlineMockPayloads.systemDesignScorecard.sla === '99.99%');
    assert.ok(recovery.spokenRecoveryScript.includes('Judges'));
    assert.ok(recovery.spokenRecoveryScript.includes('offline-first'));
    assert.ok(recovery.disasterPreventionChecklist.length >= 3);
  });

  it('generates standalone executable mockServer.js code with zero npm dependencies', () => {
    const recovery = hub.generateRecoveryPackage({ title: 'NexusAudio' });

    assert.ok(recovery.standaloneMockServerCode.includes("require('http')"));
    assert.ok(recovery.standaloneMockServerCode.includes('createServer'));
    assert.ok(recovery.standaloneMockServerCode.includes('server.listen'));
  });
});
