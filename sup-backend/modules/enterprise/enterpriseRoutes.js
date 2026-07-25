const express = require('express');
const {
  getCandidates,
  requestAccess,
  ghostCodeDetector,
  dsarExport,
  portfolioSummarizer
} = require('./enterpriseController');
const { runSecurityAudit } = require('./cyberSecurityShield');

const router = express.Router();

router.get('/candidates', getCandidates);
router.post('/request-access', requestAccess);
router.post('/ghost-code', ghostCodeDetector);
router.get('/dsar/:userId', dsarExport);
router.get('/portfolio-summary/:userId', portfolioSummarizer);
router.get('/security-audit', runSecurityAudit);

module.exports = router;
