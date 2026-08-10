/**
 * Phoenix V15: Case Study & Guesstimate Simulator (PM/Consulting)
 * 
 * Interactive simulator for product management case studies and consulting guesstimates.
 * Evaluates the candidate's framework, MECE (Mutually Exclusive, Collectively Exhaustive) structure,
 * and logical tree breakdown.
 */

const { callAIForFeature, parseAIJson } = require('../../config/aiProvider');

/**
 * Evaluate a case study or guesstimate response.
 * 
 * @param {Object} params
 * @param {string} params.prompt - The case study question (e.g., "Estimate the market size for flying cars in 2030")
 * @param {string} params.response - The candidate's answer/framework breakdown
 * @param {string} params.type - 'GUESSTIMATE' | 'PRODUCT_DESIGN' | 'MARKET_ENTRY'
 * @returns {Object} Evaluation rubric and scores
 */
async function evaluateCaseStudy({ prompt = '', response = '', type = 'GUESSTIMATE' }) {
  if (!response || response.trim().length < 30) {
    return { success: false, error: 'Response too short for meaningful case study evaluation.' };
  }
  // FIX REJECTION #8: Enforce max bounds to prevent token exhaustion
  if (response.trim().length > 10000 || prompt.trim().length > 2000) {
    return { success: false, error: 'Input too long. Max prompt 2000 chars, max response 10000 chars.' };
  }

  const aiPrompt = `You are an MBB (McKinsey, BCG, Bain) consulting partner or FAANG Product Leader evaluating a case study.

CASE PROMPT (${type}):
"${prompt}"

CANDIDATE RESPONSE:
"${response}"

Evaluate the response against standard case/PM frameworks (e.g., MECE, CIRCLES, Porter's 5 Forces).
Return a JSON object:
{
  "scores": {
    "structure": <0-100>,
    "logicAndMath": <0-100>,
    "creativity": <0-100>,
    "overall": <0-100>
  },
  "feedback": {
    "strengths": ["point 1", "point 2"],
    "weaknesses": ["point 1", "point 2"],
    "missingEdgeCases": ["edge case 1"]
  },
  "meceAnalysis": "Is the breakdown Mutually Exclusive and Collectively Exhaustive? Briefly explain."
}`;

  const systemInstruction = 'You are an elite PM/Consulting interviewer. Score rigorously. Output strict JSON only.';

  try {
    const raw = await callAIForFeature(aiPrompt, systemInstruction, 'case-study-evaluator');
    const parsed = parseAIJson(raw);

    if (!parsed || !parsed.scores) {
      return { success: false, error: 'Failed to generate case evaluation.' };
    }

    return {
      success: true,
      scores: parsed.scores,
      feedback: parsed.feedback || {},
      meceAnalysis: parsed.meceAnalysis || 'N/A',
      metadata: { engine: 'Phoenix Case Study Engine v15', timestamp: new Date().toISOString() }
    };
  } catch (err) {
    console.error('[Case Study Engine] Failed:', err.message);
    return { success: false, error: err.message };
  }
}

module.exports = { evaluateCaseStudy };
