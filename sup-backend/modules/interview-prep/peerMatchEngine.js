/**
 * Phoenix v8.0: Peer-to-Peer Mock Interview Room & AI Safety-Net Engine
 * 
 * Manages live peer matching sessions via MongoDB and real-time WebRTC signaling via Socket.io.
 * Includes automated AI Copilot Takeover.
 */

const crypto = require('crypto');
const PeerQueue = require('../../models/PeerQueue');
const InterviewSession = require('../../models/InterviewSession');

// We still keep a lightweight in-memory cache for ultra-fast signaling,
// but source of truth is MongoDB.
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

    socket.on('webrtc-offer', (data) => {
      try { socket.to(data.roomId).emit('webrtc-offer', data); } catch (e) {}
    });

    socket.on('webrtc-answer', (data) => {
      try { socket.to(data.roomId).emit('webrtc-answer', data); } catch (e) {}
    });

    socket.on('webrtc-ice-candidate', (data) => {
      try { socket.to(data.roomId).emit('webrtc-ice-candidate', data); } catch (e) {}
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

  // Check if user is already waiting
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

  // Look for a compatible waiting peer atomically
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
    ACTIVE_ROOMS.set(roomId, true); // Cache active state

    return {
      status: 'MATCHED',
      roomId,
      message: `Matched successfully with ${peer.name}!`,
      peer: { name: peer.name, targetRole: peer.targetRole },
      roleAssigned: 'Candidate',
      currentQuestion: session.currentQuestion
    };
  }

  // No peer available, push to waiting queue
  const newWaiter = new PeerQueue({ userId, name, targetRole, skills, status: 'WAITING' });
  await newWaiter.save();

  return {
    status: 'WAITING',
    message: 'Added to live peer matching queue. Waiting for an available partner.',
    queuePosition: await PeerQueue.countDocuments({ status: 'WAITING' }),
    estimatedWaitSeconds: 30
  };
}

/**
 * Processes heartbeat signals and triggers AI Copilot Takeover if peer times out (30s).
 */
async function sendRoomHeartbeat(roomId, userId) {
  const session = await InterviewSession.findOne({ roomId });
  if (!session) {
    return { error: 'ROOM_NOT_FOUND', message: 'The requested interview room does not exist.' };
  }

  const now = new Date();
  let senderFound = false;
  let peerTimedOut = false;

  session.participants.forEach(p => {
    if (p.userId === userId) {
      p.lastHeartbeat = now;
      p.status = 'ACTIVE';
      senderFound = true;
    } else {
      if (now - p.lastHeartbeat > 30000) {
        p.status = 'DISCONNECTED';
        peerTimedOut = true;
      }
    }
  });

  if (!senderFound) {
    return { error: 'UNAUTHORIZED_PARTICIPANT', message: 'User is not an active participant in this room.' };
  }

  if (peerTimedOut && !session.aiSafetyNetActive) {
    session.aiSafetyNetActive = true;
    session.status = 'AI_TAKEOVER';
    session.participants.push({
      userId: 'phoenix_ai_copilot',
      name: 'Phoenix AI Bar-Raiser',
      targetRole: 'Senior Staff AI Interviewer',
      roleInInterview: 'AI_Interviewer',
      status: 'ACTIVE',
      lastHeartbeat: now
    });

    // We can simulate streaming AI audio by integrating text-to-speech here
    // For now, the takeover flag signals the frontend to switch to AI chat via Socket.io
  }

  await session.save();

  return {
    roomId: session.roomId,
    status: session.status,
    aiSafetyNetActive: session.aiSafetyNetActive,
    participants: session.participants.map(p => ({ name: p.name, role: p.roleInInterview, status: p.status }))
  };
}

async function getRoomSession(roomId) {
  return await InterviewSession.findOne({ roomId });
}

// REST fallbacks for signaling (deprecated in favor of Socket.io)
function handlePeerSignalingOffer(roomId, userId, sdpOffer) { return { success: true, message: 'Use Socket.io webrtc-offer' }; }
function handlePeerSignalingAnswer(roomId, userId, sdpAnswer) { return { success: true, message: 'Use Socket.io webrtc-answer' }; }
function handleIceCandidate(roomId, userId, candidate) { return { success: true, message: 'Use Socket.io webrtc-ice-candidate' }; }

module.exports = {
  setupPeerSignalingSockets,
  createOrMatchPeerRoom,
  handlePeerSignalingOffer,
  handlePeerSignalingAnswer,
  handleIceCandidate,
  sendRoomHeartbeat,
  getRoomSession,
  ACTIVE_ROOMS
};
