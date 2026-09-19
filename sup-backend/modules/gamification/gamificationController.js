const User = require('../../models/userModel');

// @desc    Get global leaderboard filtered by target role and experience
// @route   GET /api/gamification/leaderboard
// @access  Public
const getLeaderboard = async (req, res) => {
  try {
    const { role, experience } = req.query;
    const mongoose = require('mongoose');
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        let query = {};
        if (role) query.targetRole = new RegExp(role, 'i');
        if (experience) query.experience = experience;

        const users = await User.find(query)
          .select('name email xp level streak rank targetRole experience')
          .sort({ xp: -1 })
          .limit(50);
        if (users && users.length > 0) return res.json(users);
      } catch (dbErr) {
        // Fall back to benchmark
      }
    }

    const benchmarkLeaderboard = [
      { name: 'Elena Rostova', targetRole: 'High-Frequency FinTech Systems', experience: 'Advanced', rank: 'Phoenix', xp: 940, level: 9, streak: 24 },
      { name: 'Bob Smith', targetRole: 'Machine Learning & RAG Engineer', experience: 'Advanced', rank: 'Platinum', xp: 780, level: 7, streak: 18 },
      { name: 'Carol Lee', targetRole: 'Distributed Systems & Go Specialist', experience: 'Intermediate', rank: 'Gold', xp: 620, level: 6, streak: 12 },
      { name: 'Alice Johnson', targetRole: 'Fullstack React Developer', experience: 'Intermediate', rank: 'Gold', xp: 510, level: 5, streak: 9 },
      { name: 'Devon Patel', targetRole: 'Cloud Native DevOps Architect', experience: 'Beginner', rank: 'Silver', xp: 380, level: 3, streak: 5 }
    ];

    res.json(benchmarkLeaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Award XP and dynamically update levels and ranks
// @route   POST /api/gamification/award-xp
// @access  Public
const awardXp = async (req, res) => {
  try {
    const { userId, amount, actionType, skillCategory } = req.body;
    if (!userId || !amount) {
      return res.status(400).json({ message: 'userId and amount are required.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // 1. Award XP
    user.xp = (user.xp || 0) + parseInt(amount);

    // 2. Recalculate Level (100 XP per level)
    const oldLevel = user.level || 1;
    const newLevel = Math.floor(user.xp / 100) + 1;
    let leveledUp = false;
    if (newLevel > oldLevel) {
      user.level = newLevel;
      leveledUp = true;
    }

    // 3. Recalculate Rank based on level
    if (user.level >= 50) user.rank = 'Phoenix';
    else if (user.level >= 35) user.rank = 'Platinum';
    else if (user.level >= 20) user.rank = 'Gold';
    else if (user.level >= 10) user.rank = 'Silver';
    else if (user.level >= 5) user.rank = 'Bronze';
    else user.rank = 'Iron';

    // 4. Update Daily Activity Heatmap
    const today = new Date().toISOString().split('T')[0];
    const activityIndex = user.dailyActivity.findIndex(a => a.date === today);
    if (activityIndex > -1) {
      user.dailyActivity[activityIndex].xpEarned += parseInt(amount);
    } else {
      user.dailyActivity.push({ date: today, xpEarned: parseInt(amount) });
    }

    // 5. Update Skill Radar if a specific category is provided
    if (skillCategory && user.skillRadar) {
      const cat = skillCategory.toLowerCase();
      if (cat === 'dsa') user.skillRadar.dsa = Math.min(100, (user.skillRadar.dsa || 10) + 5);
      else if (cat === 'os') user.skillRadar.os = Math.min(100, (user.skillRadar.os || 10) + 5);
      else if (cat === 'dbms') user.skillRadar.dbms = Math.min(100, (user.skillRadar.dbms || 10) + 5);
      else if (cat === 'cn') user.skillRadar.cn = Math.min(100, (user.skillRadar.cn || 10) + 5);
      else if (cat === 'systemdesign') user.skillRadar.systemDesign = Math.min(100, (user.skillRadar.systemDesign || 10) + 5);
    }

    // Update streak logic
    const todayString = new Date().toDateString();
    if (user.lastActiveDate) {
      const lastActive = new Date(user.lastActiveDate).toDateString();
      const diffTime = Math.abs(new Date(todayString).getTime() - new Date(lastActive).getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        user.streak = (user.streak || 0) + 1;
      } else if (diffDays > 1) {
        user.streak = 1;
      }
    } else {
      user.streak = 1;
    }
    user.lastActiveDate = new Date();

    await user.save();

    res.json({
      message: leveledUp ? '🎉 LEVEL UP!' : 'XP Awarded successfully',
      leveledUp,
      xp: user.xp,
      level: user.level,
      rank: user.rank,
      streak: user.streak,
      dailyActivity: user.dailyActivity,
      skillRadar: user.skillRadar
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Use a streak freeze token to protect active streaks
// @route   POST /api/gamification/use-streak-freeze
// @access  Public
const useStreakFreeze = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (!user.streakFreezeTokens || user.streakFreezeTokens <= 0) {
      return res.status(400).json({ message: 'No streak freeze tokens available.' });
    }

    user.streakFreezeTokens -= 1;
    // Set last active date to yesterday so today is counted as active
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    user.lastActiveDate = yesterday;

    await user.save();

    res.json({
      message: 'Streak freeze token activated! Your streak is safe.',
      streakFreezeTokens: user.streakFreezeTokens,
      lastActiveDate: user.lastActiveDate
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Award a trophy to a user
// @route   POST /api/gamification/award-trophy
// @access  Public
const awardTrophy = async (req, res) => {
  try {
    const { userId, name, icon } = req.body;
    if (!userId || !name) {
      return res.status(400).json({ message: 'userId and name are required.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.trophies.push({ name, icon: icon || '🏆', earnedAt: new Date() });
    await user.save();

    res.json({
      message: '🏆 Trophy awarded!',
      trophies: user.trophies
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user gamification stats
// @route   GET /api/gamification/stats/:userId
// @access  Public
const getStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const mongoose = require('mongoose');

    if (!userId || userId.startsWith('guest_') || !mongoose.isValidObjectId(userId)) {
      return res.json({
        xp: 520,
        level: 4,
        streak: 7,
        streakFreezeTokens: 2,
        rank: 'Gold',
        trophies: [{ name: 'Apex Innovator', icon: '🏆', earnedAt: new Date() }],
        skillRadar: { dsa: 85, os: 80, dbms: 88, cn: 78, systemDesign: 90 },
        dailyActivity: [{ date: new Date().toISOString().split('T')[0], xpEarned: 120 }]
      });
    }

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      const user = await User.findById(userId).select('xp level streak streakFreezeTokens rank trophies dailyActivity skillRadar badges burnoutRisk');
      if (user) return res.json(user);
    }

    res.json({
      xp: 250,
      level: 2,
      streak: 3,
      streakFreezeTokens: 1,
      rank: 'Silver',
      trophies: [],
      skillRadar: { dsa: 70, os: 65, dbms: 70, cn: 60, systemDesign: 75 },
      dailyActivity: []
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getLeaderboard,
  awardXp,
  useStreakFreeze,
  awardTrophy,
  getStats
};
