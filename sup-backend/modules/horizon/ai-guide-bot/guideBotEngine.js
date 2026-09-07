/**
 * Phoenix Horizon — AI Guide Bot Engine (Zero-Quota Resilient)
 * ============================================================
 * Multi-Tier Intelligent Career Coach:
 * - Tier 3: Cloud LLM Dispatch (Gemini / OpenAI / Groq via callAIForFeature)
 * - Tier 1: Zero-Quota High-Density Semantic Knowledge Engine (Instant, Offline, Pedagogy-First)
 * 
 * Guarantee: The user will NEVER receive a rate-limit error, quota-exceeded message,
 * or broken response, ensuring seamless 2-3 hour daily training sessions.
 */

const { callAIForFeature, parseAIJson } = require('../../../config/aiProvider');
const { findSemanticResponse } = require('./horizonSemanticKnowledge');

/**
 * Process incoming student message with multi-tier resilience.
 */
async function processMessage({ message, userStage, currentPage }) {
  if (!message || typeof message !== 'string') {
    return { success: false, error: 'Message is required.' };
  }

  const stage = userStage || '2nd_pu';
  const page = currentPage || 'world-dashboard';

  // Attempt Tier 3: Cloud LLM with tight timeout
  let cloudSuccess = false;
  try {
    const systemInstruction = `
      You are the Phoenix Horizon Guide Bot, an expert career mentor, technical instructor, and Karnataka KEA counselor.
      The user is at academic stage: ${stage}.
      Current page: ${page}.
      Format your response with rich GitHub markdown, code snippets if technical, and practical action steps.
      Respond in JSON with:
      1. "botReply": Your comprehensive answer.
      2. "focusElements": Array of CSS selectors to highlight (e.g. ["#learningStudio", "#karnatakaVault", "#assessmentArena", "#mentorshipHub", "#codeSandboxCard", "#dailyFocusTimer"]).
    `;

    let timer;
    const timeoutPromise = new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error('AI_TIMEOUT')), 3500);
    });

    const aiPromise = callAIForFeature('conversational', message, systemInstruction, true);

    const result = await Promise.race([aiPromise, timeoutPromise])
      .finally(() => clearTimeout(timer));

    if (result && result.text && !result.isFallback) {
      const parsed = parseAIJson(result.text, { botReply: result.text });
      if (parsed.botReply && parsed.botReply.length > 20) {
        cloudSuccess = true;
        return {
          success: true,
          userStage: stage,
          currentPage: page,
          botReply: parsed.botReply,
          focusElements: parsed.focusElements || [],
          source: result.provider || 'cloud_ai',
          timestamp: new Date().toISOString()
        };
      }
    }
  } catch (err) {
    // Silent catch: fall through to Tier 1 Semantic Engine
  }

  // Tier 1: High-Density Semantic Knowledge Engine Fallback (Instant, Zero Quota)
  const fallback = findSemanticResponse(message, stage);
  return {
    success: true,
    userStage: stage,
    currentPage: page,
    botReply: fallback.botReply,
    topic: fallback.topic,
    focusElements: fallback.focusElements || [],
    source: 'semantic_knowledge_tier1',
    timestamp: new Date().toISOString()
  };
}

module.exports = { processMessage };
