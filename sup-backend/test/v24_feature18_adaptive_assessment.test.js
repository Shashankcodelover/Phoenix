const { describe, it } = require('node:test');
const assert = require('node:assert');

const { AdaptiveCodingAssessmentEngine } = require('../modules/interview-prep/adaptiveCodingAssessmentEngine');

describe('V24 Quality Focus: Feature 18 — Adaptive Technical Coding Assessment Engine', () => {
  const engine = new AdaptiveCodingAssessmentEngine();

  it('generates a calibrated Google Sliding Window assessment with 4 multi-tier test cases', () => {
    const assessment = engine.generateAssessment({
      company: 'Google',
      topic: 'sliding_window'
    });

    assert.strictEqual(assessment.success, true);
    assert.strictEqual(assessment.company, 'Google');
    assert.ok(assessment.title.includes('Longest Substring'));
    assert.strictEqual(assessment.targetComplexity.time, 'O(N)');
    assert.strictEqual(assessment.totalTestCases, 4);
    assert.ok(assessment.testCases.some(tc => tc.type === 'Boundary'));
    assert.ok(assessment.testCases.some(tc => tc.type === 'Large Scale'));
  });

  it('evaluates candidate code submission and asserts 100% test pass rate with runtime profiling', () => {
    const sampleCode = `
      function lengthOfLongestSubstringKDistinct(s, k) {
        if (k === 0 || s.length === 0) return 0;
        let left = 0, maxLen = 0;
        const charMap = new Map();
        for (let right = 0; right < s.length; right++) {
          charMap.set(s[right], (charMap.get(s[right]) || 0) + 1);
          while (charMap.size > k) {
            charMap.set(s[left], charMap.get(s[left]) - 1);
            if (charMap.get(s[left]) === 0) charMap.delete(s[left]);
            left++;
          }
          maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
      }
    `;

    const report = engine.evaluateSubmission({
      assessmentId: 'asmt_101',
      sourceCode: sampleCode,
      language: 'javascript'
    });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.testResults.passRate, '100%');
    assert.strictEqual(report.testResults.passedTests, 4);
    assert.ok(report.executionMetrics.averageRuntimeMs < 10);
    assert.strictEqual(report.executionMetrics.asymptoticComplexityAchieved, 'O(N) Optimal');
    assert.ok(report.assessmentGrade.includes('Tier-1 FAANG Calibrated'));
  });
});
