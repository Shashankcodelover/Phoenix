const express = require('express');
const {
  startSession,
  crewVote,
  triggerChaos,
  evaluateSimulation
} = require('./simulatorController');

const router = express.Router();

router.post('/start', startSession);
router.post('/vote', crewVote);
router.get('/chaos', triggerChaos);
router.post('/evaluate', evaluateSimulation);

module.exports = router;
