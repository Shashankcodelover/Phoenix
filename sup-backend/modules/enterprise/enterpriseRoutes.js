const express = require('express');
const {
  getCandidates,
  requestAccess,
  ghostCodeDetector,
  dsarExport,
  portfolioSummarizer,
  getLegalDocumentHandler,
  dataPortabilityHandler,
  rightToBeForgottenHandler,
  consentHandler,
  disparateImpactHandler,
  explainabilityHandler,
  modelCardHandler
} = require('./enterpriseController');
const { runSecurityAudit } = require('./cyberSecurityShield');

const { protect } = require('../../middleware/authMiddleware');
const { tokenBucketLimiter } = require('../../middleware/rateLimitMiddleware');

const router = express.Router();

// Public Legal Document Reader (No auth required to read ToS or Privacy Notice)
router.get('/legal/document/:docType', getLegalDocumentHandler);
router.get('/legal/document', getLegalDocumentHandler);

// Zero-Trust Protected Enterprise & Legal Actions
router.use(protect);
router.use(tokenBucketLimiter);

router.get('/candidates', getCandidates);
router.post('/request-access', requestAccess);
router.post('/ghost-code', ghostCodeDetector);
router.get('/dsar/:userId', dsarExport);
router.get('/portfolio-summary/:userId', portfolioSummarizer);
router.get('/security-audit', runSecurityAudit);

// Legal Compliance & Privacy Endpoints (GDPR / DPDP / CCPA)
router.post('/legal/data-portability', dataPortabilityHandler);
router.post('/legal/right-to-be-forgotten', rightToBeForgottenHandler);
router.post('/legal/consent', consentHandler);

// AI Ethics & Fairness Endpoints (EEOC / EU AI Act / NYC LL144)
router.post('/ethics/disparate-impact', disparateImpactHandler);
router.post('/ethics/explainability', explainabilityHandler);
router.get('/ethics/model-card', modelCardHandler);

module.exports = router;
