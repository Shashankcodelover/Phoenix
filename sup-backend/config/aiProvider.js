/**
 * Phoenix v2.0: Multi-Provider AI Dispatch
 * 
 * Inspired by The Hackathon Simulator's multi-provider fallback chain.
 * Tries AI providers in priority order and falls back gracefully:
 *   1. Google Gemini (primary — already configured)
 *   2. OpenAI GPT-4o-mini (fallback 1)
 *   3. OpenRouter (fallback 2 — aggregator)
 *   4. Local static responses (always works — no API needed)
 * 
 * If ALL providers fail, returns a helpful static fallback instead of crashing.
 */

// --- Provider Implementations ---

/**
 * Google Gemini provider (primary).
 */
async function callGemini(prompt, systemInstruction = '', jsonMode = false) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your-gemini-api-key-here') {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  if (systemInstruction) {
    requestBody.systemInstruction = { parts: [{ text: systemInstruction }] };
  }

  if (jsonMode) {
    requestBody.generationConfig = { responseMimeType: 'application/json' };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini ${response.status}: ${errText.substring(0, 200)}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

/**
 * OpenAI GPT provider (fallback 1).
 */
async function callOpenAI(prompt, systemInstruction = '', jsonMode = false) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.startsWith('your-')) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  const messages = [];
  if (systemInstruction) {
    messages.push({ role: 'system', content: systemInstruction });
  }
  messages.push({ role: 'user', content: prompt });

  const requestBody = {
    model: 'gpt-4o-mini',
    messages
  };

  if (jsonMode) {
    requestBody.response_format = { type: 'json_object' };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenAI ${response.status}: ${errText.substring(0, 200)}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

/**
 * OpenRouter provider (fallback 2 — aggregates multiple models).
 */
async function callOpenRouter(prompt, systemInstruction = '', jsonMode = false) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey.startsWith('your-')) {
    throw new Error('OPENROUTER_API_KEY not configured');
  }

  const messages = [];
  if (systemInstruction) {
    messages.push({ role: 'system', content: systemInstruction });
  }
  messages.push({ role: 'user', content: prompt });

  const requestBody = {
    model: 'openai/gpt-4o-mini',
    messages
  };

  if (jsonMode) {
    requestBody.response_format = { type: 'json_object' };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://phoenix-interview-prep.app',
        'X-Title': 'Phoenix Interview Prep'
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenRouter ${response.status}: ${errText.substring(0, 200)}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

// --- Provider Registry ---
const PROVIDERS = [
  { name: 'Gemini', fn: callGemini, envKey: 'GEMINI_API_KEY' },
  { name: 'OpenAI', fn: callOpenAI, envKey: 'OPENAI_API_KEY' },
  { name: 'OpenRouter', fn: callOpenRouter, envKey: 'OPENROUTER_API_KEY' }
];

// --- Telemetry Tracking ---
const providerStats = {
  attempts: {},
  successes: {},
  failures: {},
  fallbacksUsed: 0
};

/**
 * Main AI dispatcher — tries providers in order, falls back gracefully.
 * 
 * @param {string} prompt - The user prompt
 * @param {string} systemInstruction - System instruction for the AI
 * @param {boolean} jsonMode - Whether to request JSON output
 * @param {string} fallbackResponse - Static fallback if all providers fail
 * @returns {Object} { text: string, provider: string, isFallback: boolean }
 */
async function callAI(prompt, systemInstruction = '', jsonMode = false, fallbackResponse = null) {
  const errors = [];

  for (const provider of PROVIDERS) {
    // Skip providers without configured API keys
    const key = process.env[provider.envKey];
    if (!key || key.startsWith('your-')) continue;

    providerStats.attempts[provider.name] = (providerStats.attempts[provider.name] || 0) + 1;

    try {
      const text = await provider.fn(prompt, systemInstruction, jsonMode);
      providerStats.successes[provider.name] = (providerStats.successes[provider.name] || 0) + 1;

      return {
        text,
        provider: provider.name,
        isFallback: false
      };
    } catch (err) {
      providerStats.failures[provider.name] = (providerStats.failures[provider.name] || 0) + 1;
      errors.push(`${provider.name}: ${err.message}`);
      console.warn(`[AI Provider] ${provider.name} failed: ${err.message}`);
      // Continue to next provider
    }
  }

  // All providers failed — use static fallback
  providerStats.fallbacksUsed++;
  console.error(`[AI Provider] ALL providers failed. Errors: ${errors.join(' | ')}`);

  if (fallbackResponse) {
    return {
      text: fallbackResponse,
      provider: 'LocalFallback',
      isFallback: true
    };
  }

  // Generic fallback if none provided
  return {
    text: 'I apologize, but I am temporarily unable to process this request. Our AI services are experiencing issues. Please try again in a few moments.',
    provider: 'LocalFallback',
    isFallback: true
  };
}

/**
 * Helper to parse AI response as JSON with cleanup.
 * Handles markdown code blocks that AI sometimes wraps around JSON.
 */
function parseAIJson(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    // Try cleaning markdown wrappers
    const cleaned = text
      .replace(/```json\s*/i, '')
      .replace(/```\s*/g, '')
      .trim();
    return JSON.parse(cleaned);
  }
}

/**
 * Returns current provider statistics for monitoring.
 */
function getProviderStats() {
  return { ...providerStats };
}

module.exports = {
  callAI,
  parseAIJson,
  getProviderStats,
  // Export individual providers for direct use if needed
  callGemini,
  callOpenAI,
  callOpenRouter
};
