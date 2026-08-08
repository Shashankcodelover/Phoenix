const mongoose = require('mongoose');

const dispatchedQuestionSchema = new mongoose.Schema({
  questionId: { type: String, required: true, unique: true },
  event: { type: String, default: 'MENTOR_QUESTION_SUBMITTED' },
  student: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    stage: { type: String, required: true }
  },
  mentorId: { type: String, required: true },
  questionText: { type: String, required: true },
  signature: { type: String, required: true },
  status: { type: String, default: 'QUEUED_FOR_MENTOR' },
  estimatedResponseHours: { type: Number, default: 24 }
}, { timestamps: true });

module.exports = mongoose.model('DispatchedQuestion', dispatchedQuestionSchema);
