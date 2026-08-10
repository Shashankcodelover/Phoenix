/**
 * Phoenix V15: Agentic Ecosystem Integration Tests
 * 
 * Tests:
 *   - Live Interview Copilot
 *   - Agentic Conversational Interviewer
 *   - Case Study & Guesstimate Simulator
 *   - Culture Fit & Core Values Alignment Engine
 *   - Readiness Benchmarking Aggregator
 *   - Regional Accent Fairness & Bias Mitigator
 *   - Non-Verbal / Social Presence Scorer
 *   - Take-Home Assignment Evaluator
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

// ═══════════════════════════════════════════
// 1. Live Interview Copilot Tests
// ═══════════════════════════════════════════

describe('Live Interview Copilot (Stealth Engine)', () => {
  const { generateLiveCopilotHint } = require('../modules/interview-prep/copilotEngine');

  it('rejects empty transcripts', async () => {
    const result = await generateLiveCopilotHint({ interviewerTranscript: '' });
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.hint, '');
  });
});

// ═══════════════════════════════════════════
// 2. Agentic Conversational Interviewer Tests
// ═══════════════════════════════════════════

describe('Agentic Conversational Interviewer', () => {
  const { generateNextQuestion } = require('../modules/interview-prep/agenticInterviewer');

  it('falls back to opening question if history is empty', async () => {
    const result = await generateNextQuestion({ conversationHistory: [] });
    assert.strictEqual(result.success, false);
    assert.match(result.question, /tell me about yourself/i);
  });
});

// ═══════════════════════════════════════════
// 3. Case Study & Guesstimate Simulator Tests
// ═══════════════════════════════════════════

describe('Case Study & Guesstimate Simulator', () => {
  const { evaluateCaseStudy } = require('../modules/interview-prep/caseStudyEngine');

  it('rejects short case study answers', async () => {
    const result = await evaluateCaseStudy({ prompt: 'Market size for EVs?', response: 'It is big.' });
    assert.strictEqual(result.success, false);
  });
});

// ═══════════════════════════════════════════
// 4. Culture Fit Alignment Tests
// ═══════════════════════════════════════════

describe('Culture Fit & Core Values Alignment', () => {
  const { evaluateCultureFit, COMPANY_VALUES } = require('../modules/interview-prep/cultureFitEngine');

  it('exports known company values', () => {
    assert.ok(COMPANY_VALUES['amazon'].length > 0);
    assert.ok(COMPANY_VALUES['google'].length > 0);
  });

  it('rejects short behavioral answers', async () => {
    const result = await evaluateCultureFit({ company: 'Amazon', answer: 'I work hard.' });
    assert.strictEqual(result.success, false);
  });
});

// ═══════════════════════════════════════════
// 5. Readiness Benchmarking Tests
// ═══════════════════════════════════════════

describe('Readiness Benchmarking Aggregator', () => {
  const { calculateReadinessScore } = require('../modules/interview-prep/readinessBenchmarkEngine');

  it('calculates 100% readiness for perfect scores', () => {
    const scores = { technicalScore: 100, behavioralScore: 100, systemDesignScore: 100, speechScore: 100 };
    const result = calculateReadinessScore(scores, 'google');
    assert.strictEqual(result.readinessScore, 100);
    assert.strictEqual(result.verdict, 'HIGHLY_COMPETITIVE');
  });

  it('applies penalty for critical flaws (>20pt gap)', () => {
    // Amazon technical threshold is 75. We score 50 (gap of 25)
    const scores = { technicalScore: 50, behavioralScore: 100, systemDesignScore: 100, speechScore: 100 };
    const result = calculateReadinessScore(scores, 'amazon');
    assert.ok(result.criticalFlaws.length > 0);
    assert.match(result.criticalFlaws[0], /Technical depth/i);
    assert.ok(result.readinessScore < 95); // Penalized
  });
});

// ═══════════════════════════════════════════
// 6. Bias Mitigator Tests
// ═══════════════════════════════════════════

describe('Regional Accent Fairness & Bias Mitigator', () => {
  const { mitigateSpeechBias } = require('../modules/interview-prep/biasMitigatorEngine');

  it('returns original object if not ESL speaker', () => {
    const input = { success: true, overallScore: 70 };
    const result = mitigateSpeechBias(input, false);
    assert.deepStrictEqual(result, input);
  });

  it('boosts vocabulary and overall score for ESL speakers', () => {
    const input = { 
      success: true, 
      overallScore: 70,
      scores: { vocabularyRichness: { score: 60 } } 
    };
    const result = mitigateSpeechBias(input, true);
    assert.strictEqual(result.overallScore, 75); // Flat +5 boost
    assert.strictEqual(result.scores.vocabularyRichness.score, Math.round(60 * 1.15));
    assert.strictEqual(result.metadata.biasMitigationApplied, true);
  });
});

// ═══════════════════════════════════════════
// 7. Non-Verbal Presence Scorer Tests
// ═══════════════════════════════════════════

describe('Non-Verbal / Social Presence Scorer', () => {
  const { scoreSocialPresence } = require('../modules/interview-prep/presenceScorerEngine');

  it('rejects invalid telemetry', () => {
    const result = scoreSocialPresence({});
    assert.strictEqual(result.success, false);
  });

  it('penalizes low eye contact', () => {
    const telemetry = { eyeContactPercentage: 30, postureShiftsPerMinute: 2, smileFrequency: 50 };
    const result = scoreSocialPresence(telemetry);
    assert.strictEqual(result.metrics.eyeScore, 40);
    assert.ok(result.feedback.some(f => f.includes('eye contact')));
  });

  it('penalizes high fidgeting', () => {
    const telemetry = { eyeContactPercentage: 70, postureShiftsPerMinute: 15, smileFrequency: 50 };
    const result = scoreSocialPresence(telemetry);
    assert.strictEqual(result.metrics.postureScore, 50);
    assert.ok(result.feedback.some(f => f.includes('shifting frequently')));
  });
});

// ═══════════════════════════════════════════
// 8. Take-Home Assignment Evaluator Tests
// ═══════════════════════════════════════════

describe('Take-Home Assignment Evaluator Input Validation', () => {
  const { evaluateTakeHomeAssignment } = require('../modules/interview-prep/takehomeEvaluator');

  it('rejects short repository context', async () => {
    const result = await evaluateTakeHomeAssignment({ repoContext: 'print("hello world")' });
    assert.strictEqual(result.success, false);
  });
});
