const express = require('express');
const {
  startSimulation,
  advanceStage,
  resolveChaos,
  getCompanies,
  getSessionStatus
} = require('./simController');

const router = express.Router();

// GET /api/v1/interview-sim/companies — Get available companies
router.get('/companies', getCompanies);

// POST /api/v1/interview-sim/start — Start a new simulation
router.post('/start', startSimulation);

// POST /api/v1/interview-sim/advance — Submit response and advance to next stage
router.post('/advance', advanceStage);

// POST /api/v1/interview-sim/chaos-resolve — Resolve a chaos event
router.post('/chaos-resolve', resolveChaos);

// GET /api/v1/interview-sim/status/:sessionId — Check session status
router.get('/status/:sessionId', getSessionStatus);

module.exports = router;
