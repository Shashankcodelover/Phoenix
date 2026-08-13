const { describe, it } = require('node:test');
const assert = require('node:assert');

const { AtsDisruptorEngine } = require('../modules/interview-prep/atsDisruptorEngine');

describe('V24 Quality Focus: Feature 6 — Automated ATS Resume Disruptor & Markdown Diff Generator', () => {
  const disruptor = new AtsDisruptorEngine();

  it('scans resume keywords against Google SDE benchmarks and detects missing critical terms', () => {
    const report = disruptor.disruptAndOptimize({
      resumeText: 'I built a web app using Node.js and PostgreSQL database with basic user login.',
      targetRole: 'google_sde',
      targetCompany: 'Google'
    });

    assert.strictEqual(report.success, true);
    assert.ok(report.matchedKeywords.includes('PostgreSQL'));
    assert.ok(report.missingKeywords.includes('Distributed Systems'));
    assert.ok(report.originalAtsScore <= 68);
    assert.strictEqual(report.optimizedAtsScore, 96);
  });

  it('converts weak passive bullets to Google XYZ Formula with line-by-line diffs', () => {
    const report = disruptor.disruptAndOptimize({
      resumeText: '- Worked on backend API and connected database for student project.',
      targetRole: 'google_sde'
    });

    assert.strictEqual(report.lineDiffs.length, 2);
    assert.ok(report.lineDiffs[0].original.startsWith('- '));
    assert.ok(report.lineDiffs[0].optimized.startsWith('+ '));
    assert.ok(report.lineDiffs[0].ruleApplied.includes('Google XYZ Formula'));
    assert.ok(report.optimizedResumeMarkdown.includes('## 🚀 CORE TECHNICAL COMPETENCIES'));
  });
});
