const { describe, it } = require('node:test');
const assert = require('node:assert');

const { OwaspSecurityScannerEngine, VULNERABILITY_PATTERNS } = require('../modules/interview-prep/owaspSecurityScannerEngine');

describe('V24 Quality Focus: Feature 55 — OWASP Security Scanner Engine', () => {
  const engine = new OwaspSecurityScannerEngine();

  it('scans SSRF cloud metadata vulnerability and produces hardened IP whitelist patch', () => {
    const report = engine.scanCodeSnippet({ vulnerabilityKey: 'ssrf_cloud_metadata' });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.vulnerabilityKey, 'ssrf_cloud_metadata');
    assert.strictEqual(report.cweIdentifier, 'CWE-918');
    assert.ok(report.codeDiffAnalysis.hardenedPatch.includes('isPrivateOrLoopbackIp'));
    assert.ok(report.securityMitigationAdvice.includes('169.254.169.254'));
  });

  it('scans DOM-XSS sink and provides DOMPurify sanitization patch', () => {
    const report = engine.scanCodeSnippet({ vulnerabilityKey: 'xss_dom_injection' });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.cweIdentifier, 'CWE-79');
    assert.ok(report.codeDiffAnalysis.hardenedPatch.includes('DOMPurify.sanitize'));
  });
});
