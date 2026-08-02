const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { callAIForFeature, parseAIJson } = require('../config/aiProvider');

describe('AI Dispatch Engine & Fallback Router Tests', () => {
  test('parseAIJson cleanly parses standard JSON string', () => {
    const jsonStr = '{"status": "ok", "score": 95}';
    const parsed = parseAIJson(jsonStr);
    assert.equal(parsed.status, 'ok');
    assert.equal(parsed.score, 95);
  });

  test('parseAIJson strips markdown json code blocks', () => {
    const markdownStr = '```json\n{"summary": "Great portfolio"}\n```';
    const parsed = parseAIJson(markdownStr);
    assert.equal(parsed.summary, 'Great portfolio');
  });

  test('parseAIJson safely handles non-JSON fallback string without throwing', () => {
    const rawFallback = 'Phoenix Offline AI Engine: Procedural fallback answer.';
    const result = parseAIJson(rawFallback, { defaultRole: 'Software Engineer' });
    assert.equal(result.isFallback, true);
    assert.equal(result.defaultRole, 'Software Engineer');
    assert.equal(typeof result.text, 'string');
  });

  test('callAIForFeature executes fallback cascade cleanly when offline', async () => {
    const result = await callAIForFeature(
      'creative',
      'Generate a hackathon idea for climate change',
      'You are a hackathon mentor',
      false,
      'Build a smart energy tracking app'
    );

    assert.ok(result);
    assert.equal(typeof result.text, 'string');
    assert.ok(result.text.length > 0);
    assert.ok(result.provider);
  });
});
