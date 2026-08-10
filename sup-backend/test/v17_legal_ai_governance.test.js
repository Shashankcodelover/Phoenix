/**
 * Phoenix v17: Enterprise Legal, Privacy & AI Ethics Test Suite
 * =============================================================
 * Rigorous test coverage for:
 *   1. GDPR Art. 20 / DPDP Sec. 11 Data Portability Archive Generation
 *   2. GDPR Art. 17 / DPDP Sec. 12 Right to be Forgotten Cryptographic Erasure
 *   3. Candidate Consent Logging and Verification
 *   4. Legal Document Policy Synthesizer (ToS & Privacy Charter)
 *   5. EEOC 4/5ths Rule Disparate Impact Ratio Analysis
 *   6. EU AI Act Article 13 Explainable AI (XAI) Factor Weight Generation
 *   7. System Model Card Integrity
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

// ═══════════════════════════════════════════════════════════
// 1. Legal Compliance & Data Privacy Tests
// ═══════════════════════════════════════════════════════════

describe('Enterprise Legal & Privacy Compliance Engine', () => {
  const {
    getLegalDocument,
    generateDataPortabilityArchive,
    executeRightToBeForgotten,
    recordConsentUpdate
  } = require('../modules/enterprise/legalComplianceEngine');

  it('retrieves production Terms of Service document with clauses', () => {
    const doc = getLegalDocument('tos');
    assert.strictEqual(doc.success, true);
    assert.ok(doc.clauses.length >= 4);
    assert.strictEqual(doc.version, '17.0');
  });

  it('generates machine-readable data portability archive with SHA256 integrity hash', () => {
    const mockUser = {
      _id: 'user-12345',
      name: 'Jane Doe',
      email: 'jane@example.com',
      targetRole: 'Senior Backend Engineer',
      skillMatrix: { algorithms: 95, systemDesign: 90 },
      sessions: [{ date: '2026-08-10', score: 88 }]
    };

    const result = generateDataPortabilityArchive(mockUser);
    assert.strictEqual(result.success, true);
    assert.ok(result.exportId.startsWith('DP-'));
    assert.strictEqual(typeof result.checksum, 'string');
    assert.strictEqual(result.checksum.length, 64);
    assert.strictEqual(result.archive.personalInformation.name, 'Jane Doe');
  });

  it('rejects Right to be Forgotten execution without explicit confirmation key', () => {
    const result = executeRightToBeForgotten('user-123', 'wrong_key');
    assert.strictEqual(result.success, false);
    assert.match(result.error, /CONFIRM_PERMANENT_ERASURE/);
  });

  it('executes Right to be Forgotten and issues cryptographic erasure certificate', () => {
    const result = executeRightToBeForgotten('user-123', 'CONFIRM_PERMANENT_ERASURE');
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.status, 'PERMANENTLY_PURGED');
    assert.ok(result.certificateId.startsWith('ERASURE-CERT-'));
    assert.ok(result.cryptographicProofSignature);
    assert.ok(result.erasedEntities.length >= 4);
  });

  it('retrieves cookie policy and AI terms templates', () => {
    const cookies = getLegalDocument('cookiePolicy');
    assert.strictEqual(cookies.success, true);
    assert.ok(cookies.categories.length >= 3);

    const aiTerms = getLegalDocument('aiTerms');
    assert.strictEqual(aiTerms.success, true);
    assert.ok(aiTerms.provisions.length >= 3);
  });

  it('safely handles null/undefined IP addresses in consent tracking without crashing', () => {
    const result = recordConsentUpdate({
      userId: 'user-777',
      consents: { termsOfService: true, privacyPolicy: true },
      ipAddress: null
    });
    assert.strictEqual(result.success, true);
    assert.strictEqual(typeof result.consentRecord.ipHash, 'string');
  });

  it('records consent state and validates mandatory ToS and Privacy acceptance', () => {
    const validConsent = recordConsentUpdate({
      userId: 'user-999',
      consents: { termsOfService: true, privacyPolicy: true, aiAssessmentConsent: true }
    });
    assert.strictEqual(validConsent.success, true);
    assert.strictEqual(validConsent.valid, true);

    const invalidConsent = recordConsentUpdate({
      userId: 'user-999',
      consents: { termsOfService: true, privacyPolicy: false }
    });
    assert.strictEqual(invalidConsent.valid, false);
  });
});

// ═══════════════════════════════════════════════════════════
// 2. AI Ethics, Bias & Explainability Tests
// ═══════════════════════════════════════════════════════════

describe('AI Ethics & Disparate Impact Audit Engine', () => {
  const {
    calculateDisparateImpact,
    generateScoreExplainability,
    getModelCard
  } = require('../modules/enterprise/aiEthicsAuditEngine');

  it('verifies compliance under EEOC 4/5ths rule when pass rates are within 80%', () => {
    const selectionRates = {
      groupA: { total: 100, passed: 80 }, // 80% pass rate
      groupB: { total: 100, passed: 72 }  // 72% pass rate -> 72/80 = 90% (>= 80% compliant)
    };

    const result = calculateDisparateImpact(selectionRates);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.complianceStatus, 'COMPLIANT_EEOC_4_5THS');
    assert.strictEqual(result.violations.length, 0);
  });

  it('safely clamps out-of-bounds demographic pass counts (e.g. passed > total)', () => {
    const selectionRates = {
      groupA: { total: 100, passed: 150 }, // Clamped to 100 (100% pass rate)
      groupB: { total: 100, passed: 85 }   // 85% pass rate -> 85/100 = 85% (Compliant >= 80%)
    };

    const result = calculateDisparateImpact(selectionRates);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.groupAnalysis.groupA.passedCandidates, 100);
    assert.strictEqual(result.complianceStatus, 'COMPLIANT_EEOC_4_5THS');
  });

  it('flags adverse impact when group pass rate falls below 80% of benchmark', () => {
    const selectionRates = {
      benchmark: { total: 100, passed: 90 }, // 90% pass rate
      affectedGroup: { total: 100, passed: 50 } // 50% pass rate -> 50/90 = 55.5% (< 80% violation)
    };

    const result = calculateDisparateImpact(selectionRates);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.complianceStatus, 'ADVERSE_IMPACT_FLAGGED');
    assert.strictEqual(result.violations.length, 1);
    assert.strictEqual(result.violations[0].group, 'affectedGroup');
  });

  it('generates transparent factor breakdown for Explainable AI (XAI) with case-insensitive input', () => {
    const scoreData = {
      scores: {
        situation: 85,
        task: 90,
        action: 80,
        result: 75
      }
    };

    // Test with lowercase 'star'
    const result = generateScoreExplainability({ scoreData, assessmentType: 'star' });
    assert.strictEqual(result.success, true);
    assert.ok(result.primaryDecisionDrivers.length >= 4);
    assert.strictEqual(result.primaryDecisionDrivers[0].factor, 'Situation & Context');
    assert.strictEqual(result.humanInTheLoopEligible, true);
  });

  it('returns valid system Model Card with fairness guarantees', () => {
    const result = getModelCard();
    assert.strictEqual(result.success, true);
    assert.ok(result.modelCard.fairnessMeasures.length >= 3);
    assert.strictEqual(result.modelCard.version, '17.0');
  });
});
