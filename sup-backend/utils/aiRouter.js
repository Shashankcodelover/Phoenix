/**
 * Multi-Provider AI Fallback Router Wrapper
 * Delegates to centralized config/aiProvider dispatcher.
 */

const { callAIForFeature } = require('../config/aiProvider');

async function callAI({ prompt, systemPrompt = '', timeoutMs = 5000, fallbackGenerator = null }) {
  const result = await callAIForFeature('creative', prompt, systemPrompt, false, fallbackGenerator);
  return result.text;
}

module.exports = { callAI };
