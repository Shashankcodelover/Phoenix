const mongoose = require('mongoose');

const horizonSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    academicStage: {
      type: String,
      enum: ['10th', '1st_pu', '2nd_pu', 'diploma_1', 'diploma_2', 'diploma_3', 'eng_1', 'eng_2', 'eng_3', 'eng_4', 'commerce', 'bio_medical', 'arts_design'],
      required: true,
    },
    selectedWorld: {
      type: String,
      enum: ['tech_world', 'commerce_world', 'bio_world', 'electronics_world', 'arts_world'],
      required: true,
    },
    activeRoadmapId: {
      type: String,
      default: 'foundation_30_day',
    },
    completedChecklistItems: [
      {
        taskId: String,
        completedAt: { type: Date, default: Date.now },
      },
    ],
    pyqBookmarks: [
      {
        questionId: String,
        examKey: String,
        subject: String,
        bookmarkedAt: { type: Date, default: Date.now },
      },
    ],
    examAlertSubscriptions: [
      {
        examKey: String,
        subscribedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);
const examAlertSchema = new mongoose.Schema({
  sector: { type: String, required: true },
  examKey: { type: String, required: true, unique: true },
  examName: { type: String, required: true },
  registrationStartDate: { type: Date },
  registrationEndDate: { type: Date },
  examDate: { type: Date },
  officialLink: { type: String },
  syllabusChanges: { type: String }
}, { timestamps: true });

const mcqBankSchema = new mongoose.Schema({
  questionId: { type: String, required: true, unique: true },
  examKey: { type: String, required: true },
  subject: { type: String, required: true },
  year: { type: Number },
  difficulty: { type: String, enum: ['EASY', 'MEDIUM', 'HARD'] },
  questionText: { type: String, required: true },
  options: [{ type: String }],
  correctOptionIndex: { type: Number, required: true },
  explanation: { type: String }
}, { timestamps: true });

const mentorProfileSchema = new mongoose.Schema({
  mentorId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  currentRole: { type: String, required: true },
  originPath: { type: String, required: true },
  verifiedAlumni: { type: Boolean, default: true },
  top3MistakesToAvoid: [{ type: String }],
  wisdomQuote: { type: String }
}, { timestamps: true });

const HorizonProfile = mongoose.model('HorizonProfile', horizonSchema);
const ExamAlert = mongoose.model('ExamAlert', examAlertSchema);
const MCQBank = mongoose.model('MCQBank', mcqBankSchema);
const MentorProfile = mongoose.model('MentorProfile', mentorProfileSchema);

module.exports = {
  HorizonProfile,
  ExamAlert,
  MCQBank,
  MentorProfile
};
