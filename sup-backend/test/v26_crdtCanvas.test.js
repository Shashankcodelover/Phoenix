const test = require('node:test');
const assert = require('node:assert/strict');
const crdtCollaborativeCanvas = require('../modules/interview-prep/crdtCollaborativeCanvas');

test('V26 Feature 2: CRDTCollaborativeCanvas synchronizes code deltas and architecture whiteboard nodes', () => {
    const roomId = 'room_canvas_101';
    crdtCollaborativeCanvas.initCanvas(roomId, 'function solve() {}');

    // Candidate edits code
    const edit1 = crdtCollaborativeCanvas.applyCodeDelta(roomId, 'USER_CAND_1', 'function solve() { return true; }', 1);
    assert.equal(edit1.version, 1);
    assert.equal(edit1.vectorClocks['USER_CAND_1'], 2);

    // Interviewer adds a Load Balancer node
    const node1 = { id: 'node_lb', type: 'LOAD_BALANCER', label: 'NGINX Reverse Proxy', x: 100, y: 150 };
    const arch = crdtCollaborativeCanvas.upsertArchitectureNode(roomId, 'USER_INT_1', node1);
    assert.equal(arch.totalNodes, 1);
    assert.equal(arch.nodes[0].label, 'NGINX Reverse Proxy');
});
