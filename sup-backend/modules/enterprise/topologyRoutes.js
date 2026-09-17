const express = require('express');
const router = express.Router();
const { phoenixTopologyService } = require('../phoenixTopologyService');

// GET /overview
router.get('/overview', (req, res) => {
  res.json({
    success: true,
    nodes: phoenixTopologyService.getNodes(),
    corridors: phoenixTopologyService.getCorridors(),
    telemetry: phoenixTopologyService.getTelemetry()
  });
});

// GET /telemetry
router.get('/telemetry', (req, res) => {
  res.json({
    success: true,
    telemetry: phoenixTopologyService.getTelemetry()
  });
});

// GET /corridors
router.get('/corridors', (req, res) => {
  res.json({
    success: true,
    corridors: phoenixTopologyService.getCorridors()
  });
});

// POST /corridors
router.post('/corridors', (req, res) => {
  try {
    const corridor = phoenixTopologyService.addCorridor(req.body);
    res.status(201).json({
      success: true,
      corridor,
      telemetry: phoenixTopologyService.getTelemetry()
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /corridors/:id/sever
router.post('/corridors/:id/sever', (req, res) => {
  try {
    const corridor = phoenixTopologyService.severCorridor(req.params.id);
    res.json({
      success: true,
      corridor,
      telemetry: phoenixTopologyService.getTelemetry()
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /corridors/:id/restore
router.post('/corridors/:id/restore', (req, res) => {
  try {
    const corridor = phoenixTopologyService.restoreCorridor(req.params.id);
    res.json({
      success: true,
      corridor,
      telemetry: phoenixTopologyService.getTelemetry()
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE /corridors/:id
router.delete('/corridors/:id', (req, res) => {
  const result = phoenixTopologyService.deleteCorridor(req.params.id);
  res.status(result.success ? 200 : 404).json({
    ...result,
    telemetry: phoenixTopologyService.getTelemetry()
  });
});

// GET /nodes
router.get('/nodes', (req, res) => {
  res.json({
    success: true,
    nodes: phoenixTopologyService.getNodes()
  });
});

// POST /nodes
router.post('/nodes', (req, res) => {
  try {
    const node = phoenixTopologyService.addNode(req.body);
    res.status(201).json({
      success: true,
      node,
      telemetry: phoenixTopologyService.getTelemetry()
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE /nodes/:id (Cascading Deletion)
router.delete('/nodes/:id', (req, res) => {
  const result = phoenixTopologyService.deleteNode(req.params.id);
  res.status(result.success ? 200 : 404).json({
    ...result,
    telemetry: phoenixTopologyService.getTelemetry()
  });
});

// POST /ingest
router.post('/ingest', (req, res) => {
  try {
    const { type, format, data } = req.body;
    const payload = typeof data === 'string' ? data : JSON.stringify(data || '');
    const result = phoenixTopologyService.ingestBatch(type || 'corridors', format || 'csv', payload);
    res.json({
      success: true,
      ...result,
      telemetry: phoenixTopologyService.getTelemetry()
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /purge
router.post('/purge', (req, res) => {
  try {
    const result = phoenixTopologyService.universalPurge(req.body.confirmPhrase);
    res.json({
      ...result,
      telemetry: phoenixTopologyService.getTelemetry()
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /reset
router.post('/reset', (req, res) => {
  phoenixTopologyService.resetTopology();
  res.json({
    success: true,
    message: 'Phoenix topology reset to factory default (8 nodes, 6 corridors)',
    telemetry: phoenixTopologyService.getTelemetry()
  });
});

module.exports = router;
