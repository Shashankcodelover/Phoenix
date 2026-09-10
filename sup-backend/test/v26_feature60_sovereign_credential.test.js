const { describe, it } = require('node:test');
const assert = require('node:assert');
const { sovereignCareerCredentialEngine } = require('../modules/horizon/sovereignCareerCredentialEngine');

describe('Feature 60: Universal Sovereign Career Credential Command Center Engine (Pillar 3 Capstone)', () => {
  it('should list all candidate portfolios', () => {
    const portfolios = sovereignCareerCredentialEngine.getAvailablePortfolios();
    assert.ok(Array.isArray(portfolios));
    assert.ok(portfolios.length >= 3);
    assert.ok(portfolios[0].candidateName.includes('Aditya'));
  });

  it('should generate a cryptographically hashed sovereign passport', () => {
    const passport = sovereignCareerCredentialEngine.generateSovereignPassport('PORTFOLIO-2026-NITK-01');
    assert.ok(passport);
    assert.strictEqual(passport.portfolio.candidateName, 'Aditya Shenoy');
    assert.ok(passport.compositeScore > 800);
    assert.ok(passport.sovereignHash.startsWith('0x'));
    assert.strictEqual(passport.sovereignHash.length, 66); // '0x' + 64 hex chars
    assert.ok(passport.pillar3AuditSummary.visaReadinessCleared);
    assert.ok(passport.exportableJsonLd['@context']);
  });

  it('should compute appropriate tier badge for portfolio', () => {
    const passport = sovereignCareerCredentialEngine.generateSovereignPassport('PORTFOLIO-2026-NITK-01');
    assert.ok(passport.tierBadge.includes('DIAMOND') || passport.tierBadge.includes('PLATINUM'));
  });

  it('should fallback gracefully for invalid portfolio id', () => {
    const passport = sovereignCareerCredentialEngine.generateSovereignPassport('NON-EXISTENT-ID');
    assert.ok(passport);
    assert.ok(passport.sovereignHash);
  });
});
