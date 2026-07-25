const mongoose = require('mongoose');

const winnerProjectSchema = new mongoose.Schema({
  hackathonName: { type: String, required: true },
  projectTitle: { type: String, required: true },
  description: { type: String, default: '' },
  techStack: { type: [String], default: [] },
  theme: { type: String, default: '' },
  year: { type: Number, default: new Date().getFullYear() },
  placement: { type: String, enum: ['1st', '2nd', '3rd', 'Honorable', 'Finalist'], default: 'Finalist' },
  sourceUrl: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('WinnerProject', winnerProjectSchema);
