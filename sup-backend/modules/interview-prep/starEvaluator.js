/**
 * Phoenix V14: STAR Framework Auto-Evaluator
 * 
 * Provides quantitative scoring of behavioral interview answers
 * against the STAR (Situation, Task, Action, Result) framework.
 * 
 * Inspired by GoodSpace and ClavPrep's framework-based feedback systems.
 * 
 * Scoring Dimensions:
 *   - Situation clarity (0-25)
 *   - Task specificity (0-25)
 *   - Action detail & ownership (0-25)
 *   - Result quantification (0-25)
 *   - Bonus: Metrics, impact, learning
 */

const { callAIForFeature, parseAIJson } = require('../../config/aiProvider');

/**
 * Evaluate a behavioral interview answer against the STAR framework.
 * Uses AI for deep semantic analysis with structured rubric scoring.
 * 
 * @param {Object} params
 * @param {string} params.question - The behavioral interview question asked
 * @param {string} params.answer - The candidate's response
 * @param {string} params.targetRole - Optional: role context for relevance scoring
 * @returns {Object} Detailed STAR evaluation with scores and coaching
 */
async function evaluateSTAR({ question = '', answer = '', targetRole = '' }) {
  if (!answer || answer.trim().length < 30) {
    return {
      success: false,
      error: 'Answer must be at least 30 characters for meaningful STAR evaluation.',
      totalScore: 0
    };
  }

  if (!question) {
    return {
      success: false,
      error: 'The original interview question is required for contextual evaluation.',
      totalScore: 0
    };
  }

  const roleContext = targetRole ? `The candidate is interviewing for: ${targetRole}.` : '';

  const prompt = `You are an expert behavioral interview coach using the STAR (Situation, Task, Action, Result) framework.

INTERVIEW QUESTION: "${question}"
${roleContext}

CANDIDATE'S ANSWER:
"${answer}"

Evaluate this answer against the STAR framework with strict, honest scoring. Do NOT inflate scores.

Return a raw JSON object:
{
  "situation": {
    "score": <0-25>,
    "present": true/false,
    "excerpt": "the specific part of the answer that describes the situation (or empty string)",
    "feedback": "what was good and what could be improved"
  },
  "task": {
    "score": <0-25>,
    "present": true/false,
    "excerpt": "the specific part describing the task",
    "feedback": "assessment"
  },
  "action": {
    "score": <0-25>,
    "present": true/false,
    "excerpt": "the specific part describing actions taken",
    "feedback": "assessment — did they show personal ownership with 'I' statements?",
    "usesFirstPerson": true/false
  },
  "result": {
    "score": <0-25>,
    "present": true/false,
    "excerpt": "the specific part describing results/outcomes",
    "feedback": "assessment — are results quantified with specific metrics?",
    "hasMetrics": true/false,
    "metricsFound": ["metric1", "metric2"]
  },
  "bonusPoints": {
    "showsLearning": true/false,
    "showsImpact": true/false,
    "relevantToRole": true/false,
    "bonusScore": <0-10>
  },
  "overallFeedback": "2-3 sentence overall assessment",
  "improvedVersion": "A rewritten version of the answer that demonstrates perfect STAR structure"
}

SCORING RULES:
- 0-5: Component completely missing or irrelevant
- 6-12: Component present but vague/generic
- 13-18: Component well-articulated with some specificity
- 19-25: Component excellent with concrete details, metrics, and clear ownership
- Return strict valid JSON only.`;

  const systemInstruction = 'You are a strict behavioral interview evaluator. Score honestly using the STAR rubric. Return raw JSON only.';

  try {
    const raw = await callAIForFeature(prompt, systemInstruction, 'star-evaluator');
    const parsed = parseAIJson(raw);

    if (!parsed || !parsed.situation || !parsed.task || !parsed.action || !parsed.result) {
      return {
        success: false,
        error: 'AI returned malformed STAR evaluation. Please retry.',
        totalScore: 0
      };
    }

    const totalScore = (parsed.situation.score || 0) +
                       (parsed.task.score || 0) +
                       (parsed.action.score || 0) +
                       (parsed.result.score || 0) +
                       (parsed.bonusPoints?.bonusScore || 0);

    const maxScore = 100 + 10; // 25*4 + 10 bonus
    const normalizedScore = Math.round((totalScore / maxScore) * 100);

    let grade = 'F';
    if (normalizedScore >= 90) grade = 'A+';
    else if (normalizedScore >= 80) grade = 'A';
    else if (normalizedScore >= 70) grade = 'B';
    else if (normalizedScore >= 60) grade = 'C';
    else if (normalizedScore >= 50) grade = 'D';

    // Compute component completeness
    const components = ['situation', 'task', 'action', 'result'];
    const presentComponents = components.filter(c => parsed[c]?.present);
    const missingComponents = components.filter(c => !parsed[c]?.present);

    return {
      success: true,
      question,
      totalScore,
      normalizedScore,
      grade,
      components: {
        situation: parsed.situation,
        task: parsed.task,
        action: parsed.action,
        result: parsed.result
      },
      bonusPoints: parsed.bonusPoints || {},
      completeness: {
        present: presentComponents,
        missing: missingComponents,
        percentage: Math.round((presentComponents.length / 4) * 100)
      },
      overallFeedback: parsed.overallFeedback || '',
      improvedVersion: parsed.improvedVersion || '',
      metadata: {
        engine: 'Phoenix STAR Evaluator v14',
        targetRole: targetRole || 'General',
        evaluatedAt: new Date().toISOString()
      }
    };

  } catch (err) {
    console.error('[STAR Evaluator] AI call failed:', err.message);
    return {
      success: false,
      error: `STAR evaluation failed: ${err.message}`,
      totalScore: 0
    };
  }
}

module.exports = { evaluateSTAR };
