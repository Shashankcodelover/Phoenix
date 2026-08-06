/**
 * Phoenix v8.0: Peer-to-Peer Mock Interview Room & AI Safety-Net Engine
 * 
 * Manages live peer matching sessions, room state transitions, WebSocket/HTTP signaling,
 * heartbeat monitoring, and automated AI Copilot Takeover when a peer disconnects or goes silent.
 */

const fs = require('fs');
const path = require('path');

// In-memory active peer room session registry with disk backup
const ACTIVE_ROOMS = new Map();
const WAITING_QUEUE = [];
const BACKUP_FILE = path.join(__dirname, '../../uploads/peer_rooms_backup.json');

// Restore persisted active rooms on module load
try {
  if (fs.existsSync(BACKUP_FILE)) {
    const raw = fs.readFileSync(BACKUP_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      parsed.forEach(([id, room]) => ACTIVE_ROOMS.set(id, room));
    }
  }
} catch (e) {
  // Silent fallback
}

function persistRooms() {
  try {
    const entries = Array.from(ACTIVE_ROOMS.entries());
    fs.writeFileSync(BACKUP_FILE, JSON.stringify(entries), 'utf8');
  } catch (e) {
    // Silent fallback
  }
}

/**
 * Finds or creates a peer mock interview room.
 * 
 * @param {Object} user - { userId, name, targetRole, skills }
 * @returns {Object} Room matching result payload
 */
function createOrMatchPeerRoom(user = {}) {
  const { userId = `guest_${Date.now()}`, name = 'Anonymous Peer', targetRole = 'Software Engineer', skills = [] } = user;

  // Check if user is already waiting in queue
  const existingQueueIndex = WAITING_QUEUE.findIndex(item => item.userId === userId);
  if (existingQueueIndex !== -1) {
    return {
      status: 'WAITING',
      message: 'You are currently queued for a peer mock partner.',
      queuePosition: existingQueueIndex + 1,
      estimatedWaitSeconds: 15
    };
  }

  // Look for a compatible waiting peer in queue
  if (WAITING_QUEUE.length > 0) {
    const peer = WAITING_QUEUE.shift();
    const roomId = `room_${crypto.randomUUID().slice(0, 8)}`;

    const roomState = {
      roomId,
      status: 'MATCHED',
      createdAt: new Date().toISOString(),
      participants: [
        { userId: peer.userId, name: peer.name, targetRole: peer.targetRole, roleInInterview: 'Interviewer', status: 'ACTIVE', lastHeartbeat: Date.now() },
        { userId, name, targetRole, roleInInterview: 'Candidate', status: 'ACTIVE', lastHeartbeat: Date.now() }
      ],
      aiSafetyNetActive: false,
      currentQuestion: {
        title: 'Design a Scalable Rate Limiter',
        category: 'System Design',
        difficulty: 'Medium'
      },
      turnHistory: []
    };

    ACTIVE_ROOMS.set(roomId, roomState);

    return {
      status: 'MATCHED',
      roomId,
      message: `Matched successfully with ${peer.name}!`,
      peer: { name: peer.name, targetRole: peer.targetRole },
      roleAssigned: 'Candidate',
      currentQuestion: roomState.currentQuestion
    };
  }

  // No peer available, push to waiting queue
  WAITING_QUEUE.push({ userId, name, targetRole, skills, queuedAt: Date.now() });

  return {
    status: 'WAITING',
    message: 'Added to live peer matching queue. Waiting for an available partner.',
    queuePosition: WAITING_QUEUE.length,
    estimatedWaitSeconds: 30
  };
}

/**
 * Processes heartbeat signals and triggers AI Copilot Takeover if peer times out (30s).
 * 
 * @param {string} roomId - Active room ID
 * @param {string} userId - Heartbeat sender user ID
 * @returns {Object} Updated room status
 */
function sendRoomHeartbeat(roomId, userId) {
  const room = ACTIVE_ROOMS.get(roomId);
  if (!room) {
    return { error: 'ROOM_NOT_FOUND', message: 'The requested interview room does not exist.' };
  }

  const now = Date.now();
  let senderFound = false;

  room.participants.forEach(p => {
    if (p.userId === userId) {
      p.lastHeartbeat = now;
      p.status = 'ACTIVE';
      senderFound = true;
    }
  });

  if (!senderFound) {
    return { error: 'UNAUTHORIZED_PARTICIPANT', message: 'User is not an active participant in this room.' };
  }

  // Check if any peer has gone silent for >30 seconds
  let peerTimedOut = false;
  room.participants.forEach(p => {
    if (p.userId !== userId && (now - p.lastHeartbeat > 30000)) {
      p.status = 'DISCONNECTED';
      peerTimedOut = true;
    }
  });

  if (peerTimedOut && !room.aiSafetyNetActive) {
    room.aiSafetyNetActive = true;
    room.status = 'AI_TAKEOVER';
    room.participants.push({
      userId: 'phoenix_ai_copilot',
      name: 'Phoenix AI Bar-Raiser',
      targetRole: 'Senior Staff AI Interviewer',
      roleInInterview: 'AI_Interviewer',
      status: 'ACTIVE',
      lastHeartbeat: now
    });
  }

  return {
    roomId: room.roomId,
    status: room.status,
    aiSafetyNetActive: room.aiSafetyNetActive,
    participants: room.participants.map(p => ({ name: p.name, role: p.roleInInterview, status: p.status }))
  };
}

/**
 * Gets active room session state.
 */
function getRoomSession(roomId) {
  return ACTIVE_ROOMS.get(roomId) || null;
}

module.exports = {
  createOrMatchPeerRoom,
  sendRoomHeartbeat,
  getRoomSession,
  ACTIVE_ROOMS,
  WAITING_QUEUE
};
