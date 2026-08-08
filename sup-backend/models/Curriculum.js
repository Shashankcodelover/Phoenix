const mongoose = require('mongoose');

const pyqSchema = new mongoose.Schema({
  stage: { type: String, required: true }, // e.g., 'pu', 'diploma'
  chapter: String,
  year: Number,
  question: String,
  modelAnswer: String,
  marks: Number,
  type: String
}, { timestamps: true });

const roadmapSchema = new mongoose.Schema({
  stage: { type: String, required: true, unique: true },
  title: String,
  totalMonths: Number,
  roadmap: mongoose.Schema.Types.Mixed
}, { timestamps: true });

const gapSchema = new mongoose.Schema({
  stage: { type: String, required: true, unique: true },
  reality: mongoose.Schema.Types.Mixed
}, { timestamps: true });

module.exports = {
  PyqBank: mongoose.model('PyqBank', pyqSchema),
  Roadmap: mongoose.model('Roadmap', roadmapSchema),
  CurriculumGap: mongoose.model('CurriculumGap', gapSchema)
};
