const express = require('express');
const {
  linkRepo,
  verifyOwnership,
  mineStars,
  getCommitHistory
} = require('./githubController');

const router = express.Router();

router.post('/link-repo', linkRepo);
router.post('/verify-ownership', verifyOwnership);
router.post('/mine-stars', mineStars);
router.get('/commit-history/:userId', getCommitHistory);

module.exports = router;
