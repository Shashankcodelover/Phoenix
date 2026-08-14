const { describe, it } = require('node:test');
const assert = require('node:assert');

const { PeerMockRoomEngine } = require('../modules/interview-prep/peerMockRoomEngine');

describe('V24 Quality Focus: Feature 35 — Peer Mock Video Room & AI Takeover Engine', () => {
  const engine = new PeerMockRoomEngine();

  it('creates peer mock room with WebRTC signaling endpoint and 20s armed AI takeover', () => {
    const room = engine.createMockRoom({ topic: 'Hard Graph Algorithms', candidateRole: 'L6 Staff' });

    assert.strictEqual(room.success, true);
    assert.ok(room.roomId.startsWith('PEER-ROOM-'));
    assert.strictEqual(room.aiTakeoverArmed, true);
    assert.strictEqual(room.silenceTimeoutSeconds, 20);
    assert.ok(room.roomWebRtcSignalingEndpoint.includes(room.roomId));
  });

  it('triggers seamless AI bar-raiser takeover when peer disconnects', () => {
    const takeover = engine.triggerAiTakeover({ roomId: 'PEER-ROOM-99K2', reason: 'Peer Disconnected' });

    assert.strictEqual(takeover.success, true);
    assert.strictEqual(takeover.takeoverActive, true);
    assert.ok(takeover.interviewerReplacedBy.includes('Phoenix Voice AI'));
    assert.strictEqual(takeover.seamlessTransitionMs, 240);
  });
});
