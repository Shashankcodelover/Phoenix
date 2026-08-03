const express = require('express');
const {
  getLeaderboard,
  awardXp,
  useStreakFreeze,
  awardTrophy,
  getStats
} = require('./gamificationController');

const { getReadinessIndex } = require('./telemetryController');

const router = express.Router();

const { calculateSkillMatrix } = require('./skillMatrixEngine');

router.get('/leaderboard', getLeaderboard);
router.post('/award-xp', awardXp);
router.post('/use-streak-freeze', useStreakFreeze);
router.post('/award-trophy', awardTrophy);
router.get('/stats/:userId', getStats);
router.get('/readiness-index/:userId', getReadinessIndex);
router.post('/skill-matrix', (req, res) => {
  try {
    const report = calculateSkillMatrix(req.body);
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
