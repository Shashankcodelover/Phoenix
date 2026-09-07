const mongoose = require('mongoose');
const User = require('../../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// In-Memory Fallback Registry (Zero-Downtime / Resilient Auth)
const inMemoryUsers = new Map();

// Helper to check DB readiness
const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;
const getJwtSecret = () => process.env.JWT_SECRET || 'phoenix_hyper_secure_jwt_secret_2026';

// SIGNUP
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // RFC 5322 Email Format Validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    const cleanEmail = String(email).trim().toLowerCase();
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ message: "Invalid email address format." });
    }

    // Password Complexity & Length Enforcement (Min 8 chars)
    if (typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long." });
    }

    // Check existing user
    if (isDbConnected()) {
      const userExists = await User.findOne({ email: cleanEmail });
      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }
    } else if (inMemoryUsers.has(cleanEmail)) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let createdUser = null;
    if (isDbConnected()) {
      createdUser = await User.create({
        name: String(name).trim(),
        email: cleanEmail,
        password: hashedPassword
      });
    } else {
      createdUser = {
        _id: 'mem_' + Date.now(),
        name: String(name).trim(),
        email: cleanEmail,
        password: hashedPassword,
        skills: ['Full-Stack', 'Distributed Systems'],
        xp: 100,
        streak: 1
      };
      inMemoryUsers.set(cleanEmail, createdUser);
    }

    // Generate token so user is automatically logged in
    const token = jwt.sign(
      { id: createdUser._id },
      getJwtSecret(),
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        _id: createdUser._id,
        id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = String(email || '').trim().toLowerCase();

    // Find user (MongoDB or Memory)
    let user = null;
    if (isDbConnected()) {
      user = await User.findOne({ email: cleanEmail });
    } else {
      user = inMemoryUsers.get(cleanEmail);
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      getJwtSecret(),
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GUEST / AUTO-SESSION (Instant Zero-Friction JWT)
const guestSession = async (req, res) => {
  try {
    const { name = 'Apex Engineer', targetDomain = 'interview' } = req.body || {};
    const guestEmail = 'guest_candidate@phoenix.os';

    let user = null;
    if (isDbConnected()) {
      try {
        user = await User.findOne({ email: guestEmail });
        if (!user) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash('GuestApex2026!', salt);
          user = await User.create({
            name,
            email: guestEmail,
            password: hashedPassword,
            state: 'Karnataka',
            domains: [targetDomain],
            skills: ['JavaScript', 'TypeScript', 'Node.js', 'React', 'Distributed Systems'],
            experience: 'Advanced',
            targetRole: 'Senior Full-Stack / Distributed Systems Engineer'
          });
        }
      } catch (dbErr) {
        user = null;
      }
    }

    if (!user) {
      user = inMemoryUsers.get(guestEmail);
      if (!user) {
        user = {
          _id: 'guest_' + Date.now(),
          name,
          email: guestEmail,
          domains: [targetDomain],
          skills: ['JavaScript', 'TypeScript', 'Node.js', 'React', 'Distributed Systems'],
          targetRole: 'Senior Full-Stack / Distributed Systems Engineer',
          xp: 480,
          streak: 5
        };
        inMemoryUsers.set(guestEmail, user);
      }
    }

    const token = jwt.sign(
      { id: user._id },
      getJwtSecret(),
      { expiresIn: "30d" }
    );

    res.json({
      message: "Guest session initialized",
      token,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        domains: user.domains || [targetDomain],
        skills: user.skills || ['JavaScript', 'TypeScript'],
        targetRole: user.targetRole || 'Software Engineer'
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { signup, login, guestSession };