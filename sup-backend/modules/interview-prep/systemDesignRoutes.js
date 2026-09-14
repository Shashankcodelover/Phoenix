/**
 * systemDesignRoutes.js
 * REST API Routes for Phoenix v27.0 Distributed System Design Chaos Engineering Lab
 */

const express = require('express');
const router = express.Router();
const systemDesignChaosEngine = require('./systemDesignChaosEngine');

// GET /api/v1/system-design/archetypes
router.get('/archetypes', (req, res) => {
  try {
    const archetypes = systemDesignChaosEngine.getArchetypes();
    res.json({
      success: true,
      count: archetypes.length,
      archetypes
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/system-design/archetype/:id
router.get('/archetype/:id', (req, res) => {
  try {
    const arch = systemDesignChaosEngine.getArchetypeById(req.params.id);
    res.json({
      success: true,
      archetype: arch
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/v1/system-design/simulate-load
router.post('/simulate-load', (req, res) => {
  try {
    const { archetypeId, targetQps } = req.body || {};
    const qpsNum = targetQps ? parseInt(targetQps, 10) : 50000;
    const result = systemDesignChaosEngine.simulateLoad(archetypeId || 'uber_dispatch', qpsNum);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/v1/system-design/inject-chaos
router.post('/inject-chaos', (req, res) => {
  try {
    const { archetypeId, faultType } = req.body || {};
    const result = systemDesignChaosEngine.injectChaos(archetypeId || 'uber_dispatch', faultType || 'primary_db_crash');
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
