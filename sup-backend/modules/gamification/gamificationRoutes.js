const express = require('express');
const {
  getLeaderboard,
  awardXp,
  useStreakFreeze,
  awardTrophy,
  getStats
} = require('./gamificationController');

const router = express.Router();

router.get('/leaderboard', getLeaderboard);
router.post('/award-xp', awardXp);
router.post('/use-streak-freeze', useStreakFreeze);
router.post('/award-trophy', awardTrophy);
router.get('/stats/:userId', getStats);

module.exports = router;
