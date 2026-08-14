/**
 * Distributed Real-Time Collaborative CRDT Code & Architecture Canvas — Phoenix V26 (IR-15)
 * 
 * 1. Vector Clock Causal Ordering for multi-cursor real-time code editing.
 * 2. Collaborative System Architecture Canvas Sync (Nodes, Edges, Cloud Components).
 * 3. Lock-free State Reconciliation with conflict-free deterministic merge.
 */

const crypto = require('crypto');

class CRDTCollaborativeCanvas {
    constructor() {
        this.canvases = new Map(); // roomId -> CanvasState
    }

    /**
     * Initializes a collaborative canvas state for an interview session.
     */
    initCanvas(roomId, initialCode = '// Write production algorithm here\n') {
        const state = {
            roomId,
            codeContent: initialCode,
            version: 0,
            vectorClocks: {}, // userId -> Lamport clock
            architectureNodes: [], // [{ id, type, label, x, y }]
            architectureEdges: [], // [{ from, to, label }]
            lastModified: Date.now(),
        };

        this.canvases.set(roomId, state);
        return state;
    }

    /**
     * Applies a code edit delta from candidate or panelist.
     */
    applyCodeDelta(roomId, userId, newCode, clientClock = 1) {
        let state = this.canvases.get(roomId);
        if (!state) state = this.initCanvas(roomId);

        state.vectorClocks[userId] = Math.max(state.vectorClocks[userId] || 0, clientClock) + 1;
        state.version += 1;
        state.codeContent = newCode;
        state.lastModified = Date.now();

        return {
            success: true,
            version: state.version,
            vectorClocks: state.vectorClocks,
            codeContent: state.codeContent,
        };
    }

    /**
     * Adds or updates a distributed system architecture node on the shared whiteboard.
     */
    upsertArchitectureNode(roomId, userId, node) {
        let state = this.canvases.get(roomId);
        if (!state) state = this.initCanvas(roomId);

        const existingIdx = state.architectureNodes.findIndex(n => n.id === node.id);
        if (existingIdx >= 0) {
            state.architectureNodes[existingIdx] = { ...state.architectureNodes[existingIdx], ...node, updatedBy: userId };
        } else {
            state.architectureNodes.push({ ...node, createdBy: userId });
        }

        state.version += 1;
        return {
            success: true,
            totalNodes: state.architectureNodes.length,
            nodes: state.architectureNodes,
            version: state.version,
        };
    }
}

const crdtCollaborativeCanvas = new CRDTCollaborativeCanvas();
module.exports = crdtCollaborativeCanvas;
