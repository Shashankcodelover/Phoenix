const { describe, it } = require('node:test');
const assert = require('node:assert');

const { KeaDocumentOcrEngine } = require('../modules/horizon/keaDocumentOcrEngine');

describe('V24 Quality Focus: Feature 61 — KEA Document Verification OCR Engine', () => {
  const engine = new KeaDocumentOcrEngine();

  it('approves matching candidate records with valid 11-digit RD number', () => {
    const report = engine.validateDocuments({
      aadhaarName: 'Shashank J',
      sslcMarksCardName: 'Shashank J',
      rdCertificateName: 'Shashank J',
      rdNumber: 'RD00381928471'
    });

    assert.strictEqual(report.success, true);
    assert.ok(report.verificationStatus.includes('Approved'));
    assert.strictEqual(report.rdNumberValidation.isValidFormat, true);
    assert.strictEqual(report.similarityScores.aadhaarVsSslc, '100% Match');
  });

  it('detects RD number format error and name mismatch and provides affidavit guidance', () => {
    const report = engine.validateDocuments({
      aadhaarName: 'Shashank Kumar J',
      sslcMarksCardName: 'Shashank J',
      rdCertificateName: 'Sashank J',
      rdNumber: 'INVALID_RD'
    });

    assert.strictEqual(report.success, true);
    assert.ok(report.verificationStatus.includes('Discrepancy Detected'));
    assert.strictEqual(report.rdNumberValidation.isValidFormat, false);
    assert.ok(report.preventiveActionPlan[0].includes('Affidavit'));
  });
});
