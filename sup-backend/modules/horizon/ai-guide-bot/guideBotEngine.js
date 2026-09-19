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
 * Recognize user intent from query text
 */
function recognizeIntent(message = '') {
  const lower = (message || '').toLowerCase();
  if (/hello|hi\b|hey|how can you help/i.test(lower)) {
    return { intent: 'greeting', confidence: 0.95 };
  }
  if (/roadmap|plan|schedule|journey/i.test(lower)) {
    return { intent: 'find_roadmap', confidence: 0.92 };
  }
  if (/where is|navigate|radar|find element|scroll/i.test(lower)) {
    return { intent: 'navigate_element', confidence: 0.90 };
  }
  if (/lateral|lateral entry|diploma to engineering/i.test(lower)) {
    return { intent: 'lateral_entry', confidence: 0.94 };
  }
  if (/practice|question|pyq|exam|dcet|kcet/i.test(lower)) {
    return { intent: 'practice_questions', confidence: 0.91 };
  }
  return { intent: 'general_query', confidence: 0.70 };
}

/**
 * Process incoming student message with multi-tier resilience.
 */
async function processMessage({ message, userStage, currentPage }) {
  if (!message || typeof message !== 'string') {
    return { success: false, error: 'Message is required.' };
  }

  const stage = userStage || '2nd_pu';
  const page = currentPage || 'world-dashboard';
  const detectedIntent = recognizeIntent(message);

  // Stage & Intent specific data enrichment
  let extraData = null;
  let focusElements = ['#learningStudio', '#karnatakaVault'];
  let focusAction = 'FOCUS';

  if (detectedIntent.intent === 'find_roadmap') {
    extraData = {
      stage,
      milestones: [
        'Foundation Concepts & Syntax Fluency',
        'Data Structures & Algorithm Drills',
        'State Exam / Placement Sprint Drills',
        'Capstone Architecture & Defense'
      ],
      estimatedHours: 180
    };
    focusElements = ['#roadmapTimeline', '#learningStudio'];
  } else if (detectedIntent.intent === 'navigate_element') {
    focusElements = ['#examRadar', '#assessmentArena'];
    focusAction = 'HIGHLIGHT_AND_SCROLL';
  } else if (detectedIntent.intent === 'lateral_entry') {
    extraData = {
      pathway: 'Diploma 3rd Year to B.E/B.Tech Lateral Entry (2nd Year Direct)',
      exam: 'DCET Karnataka',
      reservedQuota: '10% Supernumerary Engineering Seats'
    };
    focusElements = ['#dcetBridgeCard', '#mentorshipHub'];
  }

  // Attempt Tier 3: Cloud LLM with tight timeout
  try {
    const systemInstruction = `
      You are the Phoenix Horizon Guide Bot, an expert career mentor, technical instructor, and Karnataka KEA counselor.
      The user is at academic stage: ${stage}.
      Current page: ${page}.
      Format your response with rich GitHub markdown, code snippets if technical, and practical action steps.
      Respond in JSON with:
      1. "botReply": Your comprehensive answer.
      2. "focusElements": Array of CSS selectors to highlight.
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
        return {
          success: true,
          userStage: stage,
          currentPage: page,
          intent: detectedIntent,
          data: extraData,
          botReply: parsed.botReply,
          focusElements: parsed.focusElements && parsed.focusElements.length ? parsed.focusElements : focusElements,
          focusAction,
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
  let replyText = fallback.botReply;

  // Enhance reply for diploma practice questions or specific contexts
  if ((stage.includes('diploma') || detectedIntent.intent === 'practice_questions') && !replyText.includes('DCET')) {
    replyText = `### 🎯 High-Yield DCET Practice Questions & Exam Strategy\n\nFor diploma candidates targeting Karnataka engineering lateral entry, practice DCET syllabus PYQs regularly.\n\n${replyText}`;
  }

  return {
    success: true,
    userStage: stage,
    currentPage: page,
    intent: detectedIntent,
    data: extraData,
    botReply: replyText,
    topic: fallback.topic,
    focusElements: fallback.focusElements && fallback.focusElements.length ? fallback.focusElements : focusElements,
    focusAction,
    source: 'semantic_knowledge_tier1',
    timestamp: new Date().toISOString()
  };
}

module.exports = { processMessage, recognizeIntent };
