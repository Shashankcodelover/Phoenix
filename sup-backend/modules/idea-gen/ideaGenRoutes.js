const express = require('express');
const {
  addWinner,
  getWinners,
  generateIdea,
  seedWinners
} = require('./ideaGenController');

const router = express.Router();

router.post('/add-winner', addWinner);
router.get('/winners', getWinners);
router.post('/generate', generateIdea);
router.post('/seed', seedWinners);

module.exports = router;
