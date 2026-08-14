const { describe, it } = require('node:test');
const assert = require('node:assert');

const { RegionalVoiceCoachEngine } = require('../modules/horizon/regionalVoiceCoachEngine');

describe('V24 Quality Focus: Feature 15 — Regional Language Voice & Guidance Coach (Kannada & Hindi)', () => {
  const engine = new RegionalVoiceCoachEngine();

  it('processes Kannada KCET counseling audio prompt and returns bilingual guidance with technical vocabulary bridge', () => {
    const report = engine.processVernacularGuidance({
      language: 'kannada',
      topic: 'counseling'
    });

    assert.strictEqual(report.success, true);
    assert.ok(report.selectedLanguage.includes('Kannada'));
    assert.ok(report.vernacularPrompt.includes('KCET'));
    assert.ok(report.audioResponseTranscript.includes('RVCE'));
    assert.ok(report.englishTranslation.includes('Option #1'));
    assert.ok(report.technicalGlossaryBridge.length >= 2);
    assert.strictEqual(report.confidenceBoostMetric, '92% Vernacular Comprehension');
  });

  it('processes Hindi technical placement query and translates data structure concepts', () => {
    const report = engine.processVernacularGuidance({
      language: 'hindi',
      topic: 'counseling'
    });

    assert.strictEqual(report.success, true);
    assert.ok(report.selectedLanguage.includes('Hindi'));
    assert.ok(report.audioResponseTranscript.includes('डेटा स्ट्रक्चर्स'));
    assert.ok(report.englishTranslation.includes('Data Structures'));
    assert.ok(report.technicalGlossaryBridge.some(item => item.english === 'Data Structures'));
  });
});
