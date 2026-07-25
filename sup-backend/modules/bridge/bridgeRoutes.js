const express = require('express');
const {
  analyzeProject,
  detectSkillsEndpoint
} = require('./bridgeController');

const router = express.Router();

// POST /api/v1/bridge/analyze — Full Bridge Mode pipeline
router.post('/analyze', analyzeProject);

// POST /api/v1/bridge/detect-skills — Quick skill detection
router.post('/detect-skills', detectSkillsEndpoint);

module.exports = router;
