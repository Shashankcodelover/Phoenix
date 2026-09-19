/**
 * Phoenix v8.0: Peer-to-Peer Mock Interview Room & AI Safety-Net Engine
 * 
 * Manages live peer matching sessions via MongoDB and real-time WebRTC signaling via Socket.io.
 * Includes automated AI Copilot Takeover.
 */

const crypto = require('crypto');
const mongoose = require('mongoose');
const PeerQueue = require('../../models/PeerQueue');
const InterviewSession = require('../../models/InterviewSession');

// In-memory queues & caches for fast signaling and resilient offline/test execution
const WAITING_QUEUE = [];
const ACTIVE_ROOMS = new Map();

const jwt = require('jsonwebtoken');

/**
 * Socket.io setup for real-time signaling.
 */
function setupPeerSignalingSockets(io) {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
      if (!token) return next(new Error('Authentication error: Token missing'));
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.io] Peer connected: ${socket.id} (User: ${socket.userId})`);

    socket.on('join-room', async (roomId) => {
      try {
        const room = await InterviewSession.findOne({ roomId });
        if (!room) return socket.emit('error', 'Room not found');
        
        const isParticipant = room.participants.some(p => p.userId === socket.userId);
        if (!isParticipant) return socket.emit('error', 'Unauthorized to join this room');

        socket.join(roomId);
        console.log(`[Socket.io] Socket ${socket.id} joined room ${roomId}`);
      } catch (err) {
        socket.emit('error', 'Server error joining room');
      }
    });

    // FIX REJECTION #5: WebRTC Room Authorization Verification
    // Prevent unauthorized cross-room SDP/ICE candidate injection by verifying socket room membership
    socket.on('webrtc-offer', (data) => {
      try {
        if (!data || !data.roomId) return socket.emit('error', 'Invalid room identifier');
        if (!socket.rooms.has(data.roomId)) {
          return socket.emit('error', 'Unauthorized: You have not joined this room.');
        }
        socket.to(data.roomId).emit('webrtc-offer', { ...data, senderId: socket.userId || socket.id });
      } catch (e) {
        console.error('[WebRTC Offer Error]', e.message);
      }
    });

    socket.on('webrtc-answer', (data) => {
      try {
        if (!data || !data.roomId) return socket.emit('error', 'Invalid room identifier');
        if (!socket.rooms.has(data.roomId)) {
          return socket.emit('error', 'Unauthorized: You have not joined this room.');
        }
        socket.to(data.roomId).emit('webrtc-answer', { ...data, senderId: socket.userId || socket.id });
      } catch (e) {
        console.error('[WebRTC Answer Error]', e.message);
      }
    });

    socket.on('webrtc-ice-candidate', (data) => {
      try {
        if (!data || !data.roomId) return socket.emit('error', 'Invalid room identifier');
        if (!socket.rooms.has(data.roomId)) {
          return socket.emit('error', 'Unauthorized: You have not joined this room.');
        }
        socket.to(data.roomId).emit('webrtc-ice-candidate', { ...data, senderId: socket.userId || socket.id });
      } catch (e) {
        console.error('[WebRTC ICE Candidate Error]', e.message);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.io] Peer disconnected: ${socket.id}`);
    });
  });
}

/**
 * Finds or creates a peer mock interview room using MongoDB atomic operations.
 * 
 * @param {Object} user - { userId, name, targetRole, skills }
 * @returns {Object} Room matching result payload
 */
async function createOrMatchPeerRoom(user = {}) {
  const { userId = `guest_${crypto.randomUUID()}`, name = 'Anonymous Peer', targetRole = 'Software Engineer', skills = [] } = user;

  // If MongoDB is available, use persistent DB
  if (mongoose.connection && mongoose.connection.readyState === 1 && PeerQueue && InterviewSession) {
    try {
      const existingWait = await PeerQueue.findOne({ userId });
      if (existingWait) {
        const queueCount = await PeerQueue.countDocuments({ status: 'WAITING' });
        return {
          status: 'WAITING',
          message: 'You are currently queued for a peer mock partner.',
          queuePosition: queueCount,
          estimatedWaitSeconds: 15
        };
      }

      const peer = await PeerQueue.findOneAndUpdate(
        { status: 'WAITING', userId: { $ne: userId } },
        { status: 'MATCHED' },
        { sort: { queuedAt: 1 } }
      );

      if (peer) {
        const roomId = `room_${crypto.randomUUID().slice(0, 8)}`;
        const session = new InterviewSession({
          roomId,
          status: 'MATCHED',
          participants: [
            { userId: peer.userId, name: peer.name, targetRole: peer.targetRole, roleInInterview: 'Interviewer', status: 'ACTIVE', lastHeartbeat: new Date() },
            { userId, name, targetRole, roleInInterview: 'Candidate', status: 'ACTIVE', lastHeartbeat: new Date() }
          ],
          currentQuestion: {
            title: 'Design a Scalable Rate Limiter',
            category: 'System Design',
            difficulty: 'Medium'
          }
        });

        await session.save();
        const roomObj = session.toObject ? session.toObject() : session;
        ACTIVE_ROOMS.set(roomId, roomObj);

        return {
          status: 'MATCHED',
          roomId,
          message: `Matched successfully with ${peer.name}!`,
          peer: { name: peer.name, targetRole: peer.targetRole },
          roleAssigned: 'Candidate',
          currentQuestion: session.currentQuestion
        };
      }

      const newWaiter = new PeerQueue({ userId, name, targetRole, skills, status: 'WAITING' });
      await newWaiter.save();

      return {
        status: 'WAITING',
        message: 'Added to live peer matching queue. Waiting for an available partner.',
        queuePosition: await PeerQueue.countDocuments({ status: 'WAITING' }),
        estimatedWaitSeconds: 30
      };
    } catch (err) {
      // Fallback to in-memory below
    }
  }

  // Resilient In-Memory Matching (for tests or disconnected environments)
  const existingWaitIndex = WAITING_QUEUE.findIndex(u => u.userId === userId);
  if (existingWaitIndex !== -1) {
    return {
      status: 'WAITING',
      message: 'You are currently queued for a peer mock partner.',
      queuePosition: existingWaitIndex + 1,
      estimatedWaitSeconds: 15
    };
  }

  const compatibleIndex = WAITING_QUEUE.findIndex(u => u.userId !== userId);
  if (compatibleIndex !== -1) {
    const peer = WAITING_QUEUE.splice(compatibleIndex, 1)[0];
    const roomId = `room_${crypto.randomUUID().slice(0, 8)}`;
    const room = {
      roomId,
      status: 'MATCHED',
      participants: [
        { userId: peer.userId, name: peer.name, targetRole: peer.targetRole, roleInInterview: 'Interviewer', status: 'ACTIVE', lastHeartbeat: Date.now() },
        { userId, name, targetRole, roleInInterview: 'Candidate', status: 'ACTIVE', lastHeartbeat: Date.now() }
      ],
      currentQuestion: {
        title: 'Design a Scalable Rate Limiter',
        category: 'System Design',
        difficulty: 'Medium'
      },
      aiSafetyNetActive: false
    };

    ACTIVE_ROOMS.set(roomId, room);

    return {
      status: 'MATCHED',
      roomId,
      message: `Matched successfully with ${peer.name}!`,
      peer: { name: peer.name, targetRole: peer.targetRole },
      roleAssigned: 'Candidate',
      currentQuestion: room.currentQuestion
    };
  }

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
 */
function sendRoomHeartbeat(roomId, userId) {
  let room = ACTIVE_ROOMS.get(roomId);

  if (!room) {
    return { error: 'ROOM_NOT_FOUND', message: 'The requested interview room does not exist.' };
  }

  const now = Date.now();
  let senderFound = false;
  let peerTimedOut = false;

  room.participants.forEach(p => {
    const pTime = p.lastHeartbeat instanceof Date ? p.lastHeartbeat.getTime() : Number(p.lastHeartbeat);
    if (p.userId === userId) {
      p.lastHeartbeat = now;
      p.status = 'ACTIVE';
      senderFound = true;
    } else {
      if (now - pTime > 30000) {
        p.status = 'DISCONNECTED';
        peerTimedOut = true;
      }
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
    aiSafetyNetActive: !!room.aiSafetyNetActive,
    participants: room.participants.map(p => ({ name: p.name, role: p.roleInInterview, status: p.status }))
  };
}

async function getRoomSession(roomId) {
  if (mongoose.connection && mongoose.connection.readyState === 1 && InterviewSession) {
    return await InterviewSession.findOne({ roomId });
  }
  return ACTIVE_ROOMS.get(roomId) || null;
}

// REST fallbacks for signaling (deprecated in favor of Socket.io)
const peerCandidateMap = new Map();

function handlePeerSignalingOffer(roomId, userId, sdpOffer) {
  return { success: true, roomId, userId, sdp: sdpOffer };
}
function handlePeerSignalingAnswer(roomId, userId, sdpAnswer) {
  return { success: true, roomId, userId, sdp: sdpAnswer };
}
function handleIceCandidate(roomId, userId, candidate) {
  const key = `${roomId}_${userId}`;
  const list = peerCandidateMap.get(key) || [];
  list.push(candidate);
  peerCandidateMap.set(key, list);
  return { success: true, roomId, userId, candidate, count: list.length };
}

module.exports = {
  setupPeerSignalingSockets,
  createOrMatchPeerRoom,
  handlePeerSignalingOffer,
  handlePeerSignalingAnswer,
  handleIceCandidate,
  sendRoomHeartbeat,
  getRoomSession,
  ACTIVE_ROOMS,
  WAITING_QUEUE
};
