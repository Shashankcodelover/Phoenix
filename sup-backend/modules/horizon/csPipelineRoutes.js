const express = require('express');
const router = express.Router();

// PU CS Module
const { getPuSyllabusGapAnalysis, getPuMonthByMonthRoadmap, getPuEntranceExamPrep, getPuBoardPyqs, getPuResources } = require('./cs-pu/puCurriculumEngine');

// Diploma CS Module
const { getDiplomaSyllabusGapAnalysis, getDiplomaRoadmap, getDcetPrepPlan, getDcetPyqs, getDiplomaResources, getLateralEntryGuide } = require('./cs-diploma/diplomaCurriculumEngine');

// Engineering CS Module
const { getEngSemesterGapAnalysis, getEngRoadmap, evaluatePlacementReadiness } = require('./cs-engineering/engCurriculumEngine');

// AI Guide Bot
const { processMessage } = require('./ai-guide-bot/guideBotEngine');

// ════════════════════════════════════════════════════
// PU CS ROUTES (/api/v1/horizon/cs-pu/*)
// ════════════════════════════════════════════════════
router.get('/cs-pu/gap-analysis', (req, res) => {
  try { res.json(getPuSyllabusGapAnalysis()); }
  catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

router.get('/cs-pu/roadmap', (req, res) => {
  try { res.json(getPuMonthByMonthRoadmap()); }
  catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

router.get('/cs-pu/entrance-exams', (req, res) => {
  try { res.json(getPuEntranceExamPrep(req.query.examKey)); }
  catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

router.get('/cs-pu/pyqs', (req, res) => {
  try { res.json(getPuBoardPyqs(req.query)); }
  catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

router.get('/cs-pu/resources', (req, res) => {
  try { res.json(getPuResources(req.query)); }
  catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ════════════════════════════════════════════════════
// DIPLOMA CS ROUTES (/api/v1/horizon/cs-diploma/*)
// ════════════════════════════════════════════════════
router.get('/cs-diploma/gap-analysis', (req, res) => {
  try { res.json(getDiplomaSyllabusGapAnalysis()); }
  catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

router.get('/cs-diploma/roadmap', (req, res) => {
  try { res.json(getDiplomaRoadmap()); }
  catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

router.get('/cs-diploma/dcet-prep', (req, res) => {
  try { res.json(getDcetPrepPlan()); }
  catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

router.get('/cs-diploma/pyqs', (req, res) => {
  try { res.json(getDcetPyqs(req.query)); }
  catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

router.get('/cs-diploma/resources', (req, res) => {
  try { res.json(getDiplomaResources(req.query)); }
  catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

router.get('/cs-diploma/lateral-entry', (req, res) => {
  try { res.json(getLateralEntryGuide()); }
  catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ════════════════════════════════════════════════════
// ENGINEERING CS ROUTES (/api/v1/horizon/cs-eng/*)
// ════════════════════════════════════════════════════
router.get('/cs-eng/gap-analysis', (req, res) => {
  try { res.json(getEngSemesterGapAnalysis(req.query.semester)); }
  catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

router.get('/cs-eng/roadmap', (req, res) => {
  try { res.json(getEngRoadmap()); }
  catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

router.post('/cs-eng/readiness', (req, res) => {
  try { res.json(evaluatePlacementReadiness(req.body)); }
  catch (e) { res.status(400).json({ success: false, error: e.message }); }
});

// ════════════════════════════════════════════════════
// AI GUIDE BOT (/api/v1/horizon/bot/*)
// ════════════════════════════════════════════════════
router.post('/bot/chat', (req, res) => {
  try {
    const { message, userStage, currentPage } = req.body;
    const result = processMessage({ message, userStage, currentPage });
    res.json(result);
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

module.exports = router;
