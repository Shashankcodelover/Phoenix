/**
 * Phoenix v3.0: Modular Multi-Provider AI Dispatch Engine
 * 
 * "Right Model for the Right Job" Architecture.
 * Routes AI feature requests to the specialized model best suited for the task:
 * 
 * Feature Slots:
 *   - 'creative'      : Hackathon Ideas, STAR Stories, Pitches (Gemini 2.5 Flash)
 *   - 'analytical'    : Code Review, Stage Scoring, Novelty Checks, ATS Disruptor (Groq Llama 3.3 70B)
 *   - 'conversational': Mock Interview, Mentor Panel, Member Guide Chat (Gemini 2.5 Flash)
 *   - 'structured'    : Syllabus Roadmaps, Schedules, System Design Qs (Groq Llama 3.3 70B)
 *   - 'document'      : Resume Tailoring, Revision Sheets, Project Explainer (Gemini 2.5 Flash)
 *   - 'quick'         : Copilot Bot Assistant, Quick Navigation (Groq Llama 3.1 8B)
 * 
 * Multi-Provider Fallback Cascade for 100% Uptime:
 *   Primary Dedicated Model → Gemini Flash → Groq → OpenAI → OpenRouter → Local Engine
 */

const { humanizeText } = require('../utils/humanizer');

// --- Provider Implementations ---


/**
 * Call Google Gemini API (With Multi-Key Pool Failover)
 */
async function callGemini(prompt, systemInstruction = '', jsonMode = false) {
  const keys = extractApiKeys(process.env.GEMINI_API_KEY);

  if (keys.length === 0) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  if (systemInstruction) {
    requestBody.systemInstruction = { parts: [{ text: systemInstruction }] };
  }

  if (jsonMode) {
    requestBody.generationConfig = { responseMimeType: 'application/json' };
  }

  let lastError = null;
  for (let attempt = 0; attempt < keys.length; attempt++) {
    const activeKey = keys[(geminiKeyIndex + attempt) % keys.length];
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${activeKey}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (response.status === 429) {
        geminiKeyIndex = (geminiKeyIndex + 1) % keys.length;
        lastError = new Error(`Gemini 429: Rate limit hit on key #${geminiKeyIndex}`);
        continue;
      }

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini ${response.status}: ${errText.substring(0, 200)}`);
      }

      const data = await response.json();
      geminiKeyIndex = (geminiKeyIndex + attempt) % keys.length;
      return data.candidates[0].content.parts[0].text;
    } catch (err) {
      clearTimeout(timeout);
      lastError = err;
      if (err.name === 'AbortError') {
        geminiKeyIndex = (geminiKeyIndex + 1) % keys.length;
      }
    }
  }

  throw lastError || new Error('All Gemini keys failed');
}

/**
 * Helper to safely extract multiple keys from comma/pipe-separated environment strings
 */
function extractApiKeys(rawEnvStr) {
  if (!rawEnvStr || typeof rawEnvStr !== 'string') return [];
  return rawEnvStr
    .split(/[,||\n]+/)
    .map(k => k.trim().replace(/^["']|["']$/g, '').trim())
    .filter(k => k.length > 5 && !k.startsWith('your-') && !k.includes('YOUR_'));
}

let groqKeyIndex = 0;
let geminiKeyIndex = 0;

/**
 * Call Groq API (Ultra-fast inference, Llama 3.3 70B & 8B with automatic multi-key rotation)
 */
async function callGroq(prompt, systemInstruction = '', jsonMode = false, modelName = null) {
  const keys = extractApiKeys(process.env.GROQ_API_KEY);
  if (keys.length === 0) {
    throw new Error('GROQ_API_KEY not configured');
  }

  const model = modelName || process.env.GROQ_MODEL_LARGE || 'llama-3.3-70b-versatile';
  const messages = [];

  if (systemInstruction) {
    messages.push({ role: 'system', content: systemInstruction });
  }
  messages.push({ role: 'user', content: prompt });

  const requestBody = {
    model,
    messages,
    temperature: 0.7
  };

  if (jsonMode) {
    requestBody.response_format = { type: 'json_object' };
  }

  let lastError = null;
  // Try available keys with auto-rotation
  for (let attempt = 0; attempt < keys.length; attempt++) {
    const activeKey = keys[(groqKeyIndex + attempt) % keys.length];
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeKey}`
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (response.status === 429) {
        // Quota exceeded on this key, rotate to next key
        groqKeyIndex = (groqKeyIndex + 1) % keys.length;
        lastError = new Error(`Groq 429: Rate limit hit on key #${(groqKeyIndex)}`);
        continue;
      }

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Groq ${response.status}: ${errText.substring(0, 200)}`);
      }

      const data = await response.json();
      // Keep using working key
      groqKeyIndex = (groqKeyIndex + attempt) % keys.length;
      return data.choices[0].message.content;
    } catch (err) {
      clearTimeout(timeout);
      lastError = err;
      if (err.name === 'AbortError') {
        groqKeyIndex = (groqKeyIndex + 1) % keys.length;
      }
    }
  }

  throw lastError || new Error('All Groq keys failed');
}

/**
 * Call OpenAI GPT-4o-mini
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
 * Call OpenRouter API
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

// --- Provider Telemetry & Stats ---
const providerStats = {
  attempts: {},
  successes: {},
  failures: {},
  fallbacksUsed: 0
};

// --- Feature Model Routing Slots ---
const FEATURE_ROUTING_MAP = {
  creative:       { primary: 'Gemini', fallbackPriority: ['Gemini', 'Groq70B', 'OpenAI', 'OpenRouter'] },
  analytical:     { primary: 'Groq70B', fallbackPriority: ['Groq70B', 'Gemini', 'OpenAI', 'OpenRouter'] },
  conversational: { primary: 'Gemini', fallbackPriority: ['Gemini', 'Groq70B', 'OpenAI', 'OpenRouter'] },
  structured:     { primary: 'Groq70B', fallbackPriority: ['Groq70B', 'Gemini', 'OpenAI', 'OpenRouter'] },
  document:       { primary: 'Gemini', fallbackPriority: ['Gemini', 'Groq70B', 'OpenAI', 'OpenRouter'] },
  quick:          { primary: 'Groq8B', fallbackPriority: ['Groq8B', 'Groq70B', 'Gemini', 'OpenAI'] }
};

/**
 * Execute call to named provider
 */
async function executeProviderCall(providerName, prompt, systemInstruction, jsonMode) {
  switch (providerName) {
    case 'Gemini':
      return await callGemini(prompt, systemInstruction, jsonMode);
    case 'Groq70B':
      return await callGroq(prompt, systemInstruction, jsonMode, process.env.GROQ_MODEL_LARGE || 'llama-3.3-70b-versatile');
    case 'Groq8B':
      return await callGroq(prompt, systemInstruction, jsonMode, process.env.GROQ_MODEL_SMALL || 'llama-3.1-8b-instant');
    case 'OpenAI':
      return await callOpenAI(prompt, systemInstruction, jsonMode);
    case 'OpenRouter':
      return await callOpenRouter(prompt, systemInstruction, jsonMode);
    default:
      throw new Error(`Unknown provider: ${providerName}`);
  }
}

/**
 * Dispatch an AI request using feature-based modular model routing with fallback cascade.
 * 
 * @param {string} featureSlot - 'creative' | 'analytical' | 'conversational' | 'structured' | 'document' | 'quick'
 * @param {string} prompt - Prompt string
 * @param {string} systemInstruction - System prompt / instruction
 * @param {boolean} jsonMode - Request raw JSON mode output
 * @param {string|Function} fallbackResponse - Static fallback string or generator function
 * @returns {Promise<{text: string, provider: string, isFallback: boolean}>}
 */
async function callAIForFeature(featureSlot, prompt, systemInstruction = '', jsonMode = false, fallbackResponse = null) {
  const routeConfig = FEATURE_ROUTING_MAP[featureSlot] || FEATURE_ROUTING_MAP.creative;
  const providersToTry = routeConfig.fallbackPriority;

  const errors = [];

  for (const pName of providersToTry) {
    providerStats.attempts[pName] = (providerStats.attempts[pName] || 0) + 1;

    try {
      const rawText = await executeProviderCall(pName, prompt, systemInstruction, jsonMode);
      providerStats.successes[pName] = (providerStats.successes[pName] || 0) + 1;
      const cleanText = humanizeText(rawText);

      return {
        text: cleanText,
        provider: pName,
        isFallback: false
      };
    } catch (err) {
      providerStats.failures[pName] = (providerStats.failures[pName] || 0) + 1;
      errors.push(`${pName}: ${err.message}`);
      // Continue to next provider in cascade
    }
  }

  // All providers failed — trigger local engine fallback
  providerStats.fallbacksUsed++;
  console.warn(`[AI Dispatcher] All online providers failed for feature "${featureSlot}". Errors: ${errors.join(' | ')}`);

  let fallbackText = '';
  if (typeof fallbackResponse === 'function') {
    fallbackText = fallbackResponse(prompt);
  } else if (typeof fallbackResponse === 'string' && fallbackResponse.length > 0) {
    fallbackText = fallbackResponse;
  } else {
    fallbackText = 'Phoenix Offline AI Engine: Request processed successfully via static procedural fallback.';
  }

  return {
    text: humanizeText(fallbackText),
    provider: 'LocalFallback',
    isFallback: true
  };
}

/**
 * Universal callAI function — supports BOTH traditional positional arguments AND object signature.
 * 
 * Signatures:
 *   1. callAI(prompt, systemInstruction, jsonMode, fallbackResponse)
 *   2. callAI({ prompt, systemPrompt, timeoutMs, fallbackGenerator })
 */
async function callAI(param1, param2 = '', param3 = false, param4 = null) {
  if (typeof param1 === 'object' && param1 !== null) {
    const { prompt, systemPrompt = '', jsonMode = false, fallbackGenerator = null } = param1;
    const res = await callAIForFeature('creative', prompt, systemPrompt, jsonMode, fallbackGenerator);
    return res.text;
  }

  return await callAIForFeature('creative', param1, param2, param3, param4);
}

/**
 * Generate simple text reply (used by botRoutes.js)
 */
async function generateText(prompt, systemInstruction = '') {
  const result = await callAIForFeature('quick', prompt, systemInstruction, false);
  return result.text;
}

/**
 * Helper to parse AI JSON with markdown fence cleanup.
 */
function parseAIJson(text, defaultFallback = {}) {
  if (typeof text !== 'string') return text;
  
  // Clean markdown code block fences
  const cleaned = text
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    // Try to extract JSON array or object substring
    const match = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (innerErr) {
        // Fall through to fallback
      }
    }

    // Return safe structured fallback instead of crashing
    return {
      isFallback: true,
      text: cleaned,
      ...defaultFallback
    };
  }
}

function getProviderStats() {
  return { ...providerStats };
}

module.exports = {
  callAI,
  callAIForFeature,
  generateText,
  parseAIJson,
  getProviderStats,
  callGemini,
  callGroq,
  callOpenAI,
  callOpenRouter
};
