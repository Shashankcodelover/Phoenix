const mongoose = require('mongoose');

const interviewSessionSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['MATCHED', 'IN_PROGRESS', 'COMPLETED', 'AI_TAKEOVER'],
    default: 'MATCHED'
  },
  participants: [{
    userId: String,
    name: String,
    targetRole: String,
    roleInInterview: String,
    status: {
      type: String,
      default: 'ACTIVE'
    },
    lastHeartbeat: Date
  }],
  currentQuestion: {
    title: String,
    category: String,
    difficulty: String
  },
  turnHistory: [{
    fromUserId: String,
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  aiSafetyNetActive: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);
