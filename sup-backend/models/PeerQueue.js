const mongoose = require('mongoose');

const peerQueueSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  targetRole: {
    type: String,
    default: 'Software Engineer'
  },
  skills: [String],
  queuedAt: {
    type: Date,
    default: Date.now,
    expires: 3600 // Auto-delete document after 1 hour (MongoDB TTL index)
  },
  status: {
    type: String,
    enum: ['WAITING', 'MATCHED'],
    default: 'WAITING'
  }
});

module.exports = mongoose.model('PeerQueue', peerQueueSchema);
