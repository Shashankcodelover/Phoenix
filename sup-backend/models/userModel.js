const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  // Profile Information
  state: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  skills: {
    type: [String], // Array of skills (e.g., ['JavaScript', 'React', 'Node.js'])
    default: []
  },
  languages: {
    type: [String], // Programming languages (e.g., ['Python', 'Java', 'C++'])
    default: []
  },
  domains: {
    type: [String], // Domains of interest (e.g., ['AI', 'Web Dev', 'Mobile'])
    default: []
  },
  experience: {
    type: String, // 'Beginner', 'Intermediate', 'Advanced'
    default: 'Beginner'
  },
  profilePicture: {
    type: String, // URL to profile picture
    default: ''
  },
  github: {
    type: String,
    default: ''
  },
  portfolio: {
    type: String,
    default: ''
  },
  // Gamification & Career Momentum
  xp: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  streak: {
    type: Number,
    default: 0
  },
  streakFreezeTokens: {
    type: Number,
    default: 2
  },
  rank: {
    type: String,
    enum: ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Phoenix'],
    default: 'Iron'
  },
  trophies: {
    type: [{
      name: { type: String, required: true },
      icon: { type: String, default: '🏆' },
      earnedAt: { type: Date, default: Date.now }
    }],
    default: []
  },
  dailyActivity: {
    type: [{
      date: { type: String, required: true }, // Format: YYYY-MM-DD
      xpEarned: { type: Number, default: 0 }
    }],
    default: []
  },
  skillRadar: {
    dsa: { type: Number, default: 10 },
    os: { type: Number, default: 10 },
    dbms: { type: Number, default: 10 },
    cn: { type: Number, default: 10 },
    systemDesign: { type: Number, default: 10 }
  },
  badges: {
    type: [String],
    default: []
  },
  burnoutRisk: {
    type: Number,
    default: 0 // percentage 0-100
  },
  lastActiveDate: {
    type: Date,
    default: null
  },
  // Interview Prep Engine Context
  resumeText: {
    type: String,
    default: ''
  },
  targetRole: {
    type: String,
    default: ''
  },
  prepTimeFrame: {
    type: Number,
    default: 30 // defaults to 30 days
  },
  skillsProven: {
    type: [String],
    default: []
  },
  // Hack-Auto Agent Team Profile
  teamMembers: {
    type: [{
      name: { type: String, required: true },
      usn: { type: String, default: '' },
      email: { type: String, default: '' },
      github: { type: String, default: '' },
      resumePath: { type: String, default: '' }
    }],
    default: []
  },
  // Portfolio Projects Capture
  portfolioProjects: {
    type: [{
      title: { type: String, required: true },
      description: { type: String, required: true },
      techStack: { type: [String], default: [] },
      outcome: { type: String, default: '' },
      hackathonName: { type: String, default: '' },
      won: { type: Boolean, default: false },
      starStory: { type: String, default: '' }
    }],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);