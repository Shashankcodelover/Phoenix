const test = require('node:test');
const assert = require('node:assert/strict');
const peerInterviewMeshGateway = require('../modules/interview-prep/peerInterviewMeshGateway');

test('V26 Feature 1: PeerInterviewMeshGateway creates room and generates AI sentinel probes', () => {
    const room = peerInterviewMeshGateway.createInterviewRoom('USER_INT_1', 'USER_CAND_1', 'SYSTEMS_DESIGN', 'TECHNICAL_ROUND_2');
    assert.ok(room.roomId.startsWith('room_phx_'));
    assert.ok(room.joinUrlCandidate.includes('role=candidate'));
    assert.equal(room.iceServers.length, 2);

    // AI Sentinel probe for Redis cache
    const probe = peerInterviewMeshGateway.generateAISentinelProbe(room.roomId, 'I will use a Redis cache cluster in front of PostgreSQL.');
    assert.ok(probe.suggestedProbe.includes('Cache Stampede'));

    // Both peers join
    peerInterviewMeshGateway.recordPeerPresence(room.roomId, 'USER_INT_1', 18, 0);
    const joinStatus = peerInterviewMeshGateway.recordPeerPresence(room.roomId, 'USER_CAND_1', 22, 0);
    assert.equal(joinStatus.allPeersConnected, true);
    assert.equal(joinStatus.status, 'IN_PROGRESS');
});
