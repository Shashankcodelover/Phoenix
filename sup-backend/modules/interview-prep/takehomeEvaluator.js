/**
 * Phoenix V15: Take-Home Assignment Architecture Evaluator
 * 
 * Evaluates simulated or submitted codebase files for standard software engineering
 * practices (SOLID, DRY, test coverage, architecture).
 */

const { callAIForFeature, parseAIJson } = require('../../config/aiProvider');

/**
 * Evaluate a take-home assignment code submission.
 * 
 * @param {Object} params
 * @param {string} params.repoContext - A stringified summary or key files of the repository
 * @param {string} params.role - Target role (e.g., "Frontend Engineer")
 * @returns {Object} Evaluation report
 */
async function evaluateTakeHomeAssignment({ repoContext = '', role = 'Software Engineer' }) {
  if (!repoContext || repoContext.trim().length < 50) {
    return { success: false, error: 'Repository context too short for evaluation.' };
  }

  const prompt = `You are a Senior Staff Engineer evaluating a take-home assignment submitted by a candidate for the role of ${role}.
  
CODEBASE CONTEXT:
${repoContext.substring(0, 10000)} // truncate to avoid token limits

Evaluate this submission on 4 dimensions:
1. Code Quality & Clean Code (Naming, DRY, formatting)
2. Architecture & Patterns (SOLID, Separation of Concerns)
3. Testing & Edge Cases
4. Production Readiness (Error handling, logging, performance)

Return a JSON object:
{
  "scores": {
    "codeQuality": <0-100>,
    "architecture": <0-100>,
    "testing": <0-100>,
    "productionReadiness": <0-100>
  },
  "overallVerdict": "HIRE|STRONG_HIRE|NO_HIRE|LEAN_HIRE",
  "feedback": {
    "positives": ["p1", "p2"],
    "constructive": ["c1", "c2"]
  },
  "suggestedInterviewQuestions": ["q1 to probe their design choices"]
}`;

  const systemInstruction = 'You are a senior technical reviewer. Score code strictly. Return strict JSON only.';

  try {
    const raw = await callAIForFeature(prompt, systemInstruction, 'takehome-evaluator');
    const parsed = parseAIJson(raw);

    if (!parsed || !parsed.scores) {
      return { success: false, error: 'Failed to generate code evaluation.' };
    }

    return {
      success: true,
      scores: parsed.scores,
      verdict: parsed.overallVerdict || 'NO_HIRE',
      feedback: parsed.feedback || {},
      followUpQuestions: parsed.suggestedInterviewQuestions || [],
      metadata: { engine: 'Phoenix Takehome Evaluator v15', timestamp: new Date().toISOString() }
    };
  } catch (err) {
    console.error('[Takehome Evaluator] Failed:', err.message);
    return { success: false, error: err.message };
  }
}

module.exports = { evaluateTakeHomeAssignment };
