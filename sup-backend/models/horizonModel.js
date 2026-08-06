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

module.exports = mongoose.model('HorizonProfile', horizonSchema);
