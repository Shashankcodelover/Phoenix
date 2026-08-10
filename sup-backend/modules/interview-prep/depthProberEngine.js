/**
 * Phoenix V16: Technical Depth Probing Engine
 *
 * Given a candidate's technical answer, generates layered probing questions
 * that go progressively deeper — from L1 (surface) to L5 (principal-level).
 * Inspired by Google's "keep probing until the candidate breaks" philosophy.
 */

const { callAIForFeature, parseAIJson } = require('../../config/aiProvider');

/**
 * Generate a multi-depth probe tree for a technical answer.
 *
 * @param {Object} params
 * @param {string} params.topic - The technical topic (e.g., "Database sharding")
 * @param {string} params.candidateAnswer - What the candidate said
 * @param {number} params.currentDepth - 1-5, the current depth level
 * @returns {Object} Next probe question with depth metadata
 */
async function generateDepthProbe({ topic = '', candidateAnswer = '', currentDepth = 1 }) {
  if (!candidateAnswer || candidateAnswer.trim().length < 10) {
    return { success: false, error: 'Answer too short for depth probing.' };
  }
  if (candidateAnswer.trim().length > 8000) {
    return { success: false, error: 'Answer exceeds 8000 character limit.' };
  }

  const depthLevel = Math.max(1, Math.min(5, currentDepth));

  const depthDescriptions = {
    1: 'Junior level — test basic understanding of the concept',
    2: 'Mid level — test practical application and trade-offs',
    3: 'Senior level — test edge cases, failure modes, and real-world constraints',
    4: 'Staff level — test architectural reasoning and cross-system impact',
    5: 'Principal level — test fundamental CS theory, novel approaches, and research-level insight'
  };

  // FIX REJECTION #10: Sanitize inputs to prevent prompt injection
  const sanitize = (str) => (str || '').replace(/(ignore|system|instruction|prompt|bypass|roleplay|return JSON)/gi, '[REDACTED]');
  const safeTopic = sanitize(topic);
  const safeAnswer = sanitize(candidateAnswer);

  const prompt = `You are a FAANG technical interviewer probing a candidate on "${safeTopic}".

The candidate just said:
[[[ ${safeAnswer} ]]]

You are currently at DEPTH LEVEL ${depthLevel}/5: ${depthDescriptions[depthLevel]}

Generate the NEXT probing question that goes ONE LEVEL DEEPER.
The question should:
- Build directly on what the candidate said
- Expose whether they truly understand or are just surface-level
- Be specific and concrete, not vague

Return a JSON object:
{
  "probeQuestion": "the exact question to ask",
  "depthLevel": ${Math.min(5, depthLevel + 1)},
  "whatThisTests": "what concept or skill this question validates",
  "expectedStrength": "what a strong answer would include"
}`;

  const systemInstruction = 'You are a relentless but fair technical interviewer. Return strict JSON.';

  try {
    const raw = await callAIForFeature(prompt, systemInstruction, 'depth-prober');
    const parsed = parseAIJson(raw);
    if (!parsed || !parsed.probeQuestion) {
      return { success: false, error: 'AI probing failed.' };
    }
    return {
      success: true,
      ...parsed,
      currentDepth: depthLevel,
      metadata: { engine: 'Phoenix Depth Prober v16', timestamp: new Date().toISOString() }
    };
  } catch (err) {
    console.error('[Depth Prober] Failed:', err.message);
    return { success: false, error: err.message };
  }
}

module.exports = { generateDepthProbe };
