/**
 * Phoenix v13 Security Engine — SAST Payload Guard Middleware
 * ==========================================================
 * Automatically scans incoming API payloads for security vulnerabilities (eval, prototype pollution, NoSQL injection, XSS)
 * before processing code submissions or interview practice responses.
 */

const { scanCodeForVulnerabilities } = require('../modules/security/sastSecurityScanner');

function sastPayloadGuard(req, res, next) {
  if (req.method === 'GET' || !req.body) {
    return next();
  }

  const report = scanCodeForVulnerabilities(req.body, `${req.method} ${req.path}`);

  if (!report.isSecure) {
    return res.status(400).json({
      success: false,
      error: 'Security Audit Violation',
      message: 'Payload contains restricted code execution vectors or security vulnerabilities.',
      summary: report.summary,
      findings: report.findings.map(f => ({ ruleId: f.ruleId, category: f.category, severity: f.severity, snippet: f.snippet }))
    });
  }

  next();
}

module.exports = { sastPayloadGuard };
