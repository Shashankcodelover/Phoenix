const { describe, it } = require('node:test');
const assert = require('node:assert');

const { JudgeWhispererEngine, JUDGE_TRAP_CATEGORIES } = require('../modules/hackathon-agent/judgeWhispererEngine');

describe('V24 Quality Focus: Feature 56 — Hackathon Judge Q&A Whisperer Engine', () => {
  const engine = new JudgeWhispererEngine();

  it('generates 15s counter-rebuttal for Wrapper trap emphasizing deterministic AST and multi-fallback routing', () => {
    const report = engine.generateWhisper({ trapKey: 'wrapper_trap' });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.trapKey, 'wrapper_trap');
    assert.ok(report.hudWhisperScript.includes('AST parsing'));
    assert.ok(report.hudWhisperScript.includes('Groq/Gemini'));
    assert.ok(report.podiumConfidenceScore.includes('98/100'));
    assert.ok(report.bodyLanguageGuidance.includes('eye contact'));
  });
});
