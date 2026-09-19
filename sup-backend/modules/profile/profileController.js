const User = require('../../models/userModel');
const fs = require('fs');
const path = require('path');

const mongoose = require('mongoose');

// @desc    Get user profile
// @route   GET /api/profile/:userId
// @access  Public
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || userId.startsWith('guest_') || !mongoose.isValidObjectId(userId)) {
      return res.json({
        _id: userId || 'guest_evaluator',
        id: userId || 'guest_evaluator',
        name: 'Evaluator / Demo Candidate',
        email: 'evaluator@phoenix.os',
        xp: 500,
        level: 3,
        streak: 7,
        skills: ['JavaScript', 'TypeScript', 'Node.js', 'React', 'Distributed Systems'],
        targetRole: 'Senior Full-Stack / Distributed Systems Engineer',
        prepTimeFrame: '4 weeks',
        resumeText: 'Experienced full-stack engineer with expertise in Node.js microservices, distributed caching, and WebRTC signaling.'
      });
    }

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      const user = await User.findById(userId).select('-password');
      if (user) {
        return res.json(user);
      }
    }

    res.json({
      _id: userId,
      id: userId,
      name: 'Verified Candidate',
      email: 'candidate@phoenix.os',
      xp: 350,
      level: 2,
      streak: 4,
      skills: ['Full-Stack', 'Distributed Systems']
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/profile/:userId
// @access  Public
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.body.userId;
    if (!userId) {
      return res.status(400).json({ message: 'Missing userId parameter' });
    }

    let { name, state, bio, skills, languages, domains, experience, github, portfolio } = req.body;

    console.log('updateUserProfile called for', userId, 'body', req.body, 'file', req.file && req.file.path);

    // form-data may send JSON strings for arrays
    const parseArrayField = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val;
      try {
        return JSON.parse(val);
      } catch (e) {
        // fall back to comma split
        return String(val).split(',').map(s => s.trim()).filter(s => s);
      }
    };

    skills = parseArrayField(skills);
    languages = parseArrayField(languages);
    domains = parseArrayField(domains);

    let updateData = {
      name,
      state,
      bio,
      skills,
      languages,
      domains,
      experience,
      github,
      portfolio
    };

    // remove undefined values so existing fields are not overwritten
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) delete updateData[key];
    });

    if (req.file) {
      // verify file exists before saving path
      if (fs.existsSync(req.file.path)) {
        // Save relative path from project root for static file serving
        // req.file.path is absolute, we need it relative to uploads folder
        const relativePath = path.relative(process.cwd(), req.file.path).replace(/\\/g, '/');
        updateData.profilePicture = relativePath;
        console.log('Profile picture saved at:', relativePath);
      } else {
        console.warn('Uploaded file does not exist at', req.file.path);
      }
    }

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTeammateRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;
    const { domain } = req.query;

    if (!userId || userId.startsWith('guest_') || !mongoose.isValidObjectId(userId)) {
      return res.json([
        { _id: 'rec_1', name: 'Dr. Sarah Connor', state: 'Karnataka', experience: 'Staff Engineer (8+ yrs)', skills: ['System Design', 'Go', 'Kubernetes', 'Raft'] },
        { _id: 'rec_2', name: 'Arjun Rao', state: 'Karnataka', experience: 'Senior AI Researcher', skills: ['Python', 'PyTorch', 'Vector DBs', 'LangGraph'] },
        { _id: 'rec_3', name: 'Maya Lin', state: 'Telangana', experience: 'Lead Fullstack Developer', skills: ['React', 'Next.js', 'WebSockets', 'TailwindCSS'] },
        { _id: 'rec_4', name: 'Rohan Sharma', state: 'Maharashtra', experience: 'FinTech & Security Lead', skills: ['Smart Contracts', 'Solidity', 'Circom', 'Rust'] }
      ]);
    }

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        let query = { _id: { $ne: userId } };
        if (domain) query.domains = domain;
        const recommendations = await User.find(query).select('-password').limit(10).lean();
        if (recommendations && recommendations.length > 0) return res.json(recommendations);
      } catch (dbErr) {}
    }

    res.json([
      { _id: 'rec_1', name: 'Dr. Sarah Connor', state: 'Karnataka', experience: 'Staff Engineer (8+ yrs)', skills: ['System Design', 'Go', 'Kubernetes', 'Raft'] },
      { _id: 'rec_2', name: 'Arjun Rao', state: 'Karnataka', experience: 'Senior AI Researcher', skills: ['Python', 'PyTorch', 'Vector DBs', 'LangGraph'] },
      { _id: 'rec_3', name: 'Maya Lin', state: 'Telangana', experience: 'Lead Fullstack Developer', skills: ['React', 'Next.js', 'WebSockets', 'TailwindCSS'] }
    ]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add portfolio project
// @route   POST /api/profile/portfolio
// @access  Public
const addPortfolioProject = async (req, res) => {
  try {
    const { userId, title, description, techStack, outcome } = req.body;
    if (!userId || !title || !description) {
      return res.status(400).json({ message: "Missing required project fields" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.portfolioProjects.push({ title, description, techStack, outcome });
    await user.save();

    res.status(201).json(user.portfolioProjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get portfolio projects
// @route   GET /api/profile/portfolio/:userId
// @access  Public
const getPortfolioProjects = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.portfolioProjects || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getTeammateRecommendations,
  addPortfolioProject,
  getPortfolioProjects
};
