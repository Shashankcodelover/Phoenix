/**
 * Phoenix V16: Negotiation Simulator Engine
 *
 * Simulates salary/offer negotiation scenarios and evaluates the candidate's
 * leverage strategy, counter-offer structure, and tone.
 * Competitive gap: No major interview prep platform offers this (2026).
 */

const { callAIForFeature, parseAIJson } = require('../../config/aiProvider');

/**
 * Evaluate a negotiation response from the candidate.
 *
 * @param {Object} params
 * @param {string} params.scenario - The offer scenario description
 * @param {string} params.candidateResponse - How the candidate responded
 * @param {string} params.targetRole - Target job title
 * @returns {Object} Evaluation with score and coaching
 */
async function evaluateNegotiation({ scenario = '', candidateResponse = '', targetRole = 'Software Engineer' }) {
  if (!candidateResponse || candidateResponse.trim().length < 20) {
    return { success: false, error: 'Response too short for negotiation evaluation.' };
  }
  if (candidateResponse.trim().length > 5000) {
    return { success: false, error: 'Response too long. Max 5000 characters.' };
  }

  // FIX REJECTION #8: Sanitize user input against prompt injection
  const sanitize = (str) => (str || '').replace(/(ignore|system|instruction|prompt|bypass|roleplay|return scores)/gi, '[REDACTED]');
  const safeResponse = sanitize(candidateResponse);
  const safeScenario = sanitize(scenario);

  const prompt = `You are an expert compensation negotiation coach and recruiter.

SCENARIO:
"${safeScenario}"

CANDIDATE'S NEGOTIATION RESPONSE:
"${safeResponse}"

TARGET ROLE: ${targetRole}

Evaluate the candidate's negotiation approach across:
1. Leverage Usage (Did they cite competing offers, market data, or unique skills?)
2. Tone & Professionalism (Confident but not aggressive?)
3. Counter-offer Structure (Did they specify a range or a fixed number? Did they anchor high?)
4. Total Compensation Awareness (Base, equity, signing bonus, PTO, benefits?)
5. Walk-Away Power (Did they establish alternatives?)

Return a JSON object:
{
  "scores": {
    "leverageUsage": <0-100>,
    "tone": <0-100>,
    "counterStructure": <0-100>,
    "totalCompAwareness": <0-100>,
    "walkAwayPower": <0-100>,
    "overall": <0-100>
  },
  "verdict": "STRONG_NEGOTIATOR|COMPETENT|NEEDS_COACHING|WEAK",
  "feedback": {
    "strengths": ["s1"],
    "improvements": ["i1"],
    "suggestedPhrases": ["phrase the candidate could use"]
  }
}`;

  const systemInstruction = 'You are a compensation negotiation expert. Score rigorously. Return strict JSON.';

  try {
    const raw = await callAIForFeature(prompt, systemInstruction, 'negotiation-eval');
    const parsed = parseAIJson(raw);
    if (!parsed || !parsed.scores) {
      return { success: false, error: 'AI negotiation evaluation failed.' };
    }
    return {
      success: true,
      ...parsed,
      metadata: { engine: 'Phoenix Negotiation Simulator v16', timestamp: new Date().toISOString() }
    };
  } catch (err) {
    console.error('[Negotiation Engine] Failed:', err.message);
    return { success: false, error: err.message };
  }
}

module.exports = { evaluateNegotiation };
