/**
 * Phoenix V15: Culture Fit & Core Values Alignment Engine
 * 
 * Evaluates behavioral answers against specific company core values
 * (e.g., Amazon Leadership Principles, Google Googlyness).
 */

const { callAIForFeature, parseAIJson } = require('../../config/aiProvider');

// Database of known company values (hardcoded for now, can be moved to DB)
const COMPANY_VALUES = {
  'amazon': ['Customer Obsession', 'Ownership', 'Invent and Simplify', 'Are Right, A Lot', 'Learn and Be Curious', 'Hire and Develop the Best', 'Insist on Highest Standards', 'Think Big', 'Bias for Action', 'Frugality', 'Earn Trust', 'Dive Deep', 'Have Backbone; Disagree and Commit', 'Deliver Results', 'Strive to be Earth’s Best Employer', 'Success and Scale Bring Broad Responsibility'],
  'google': ['Focus on the user', 'Fast is better than slow', 'Democracy on the web works', 'You can make money without doing evil', 'There’s always more information out there', 'The need for information crosses all borders', 'You can be serious without a suit', 'Great just isn’t good enough', 'Googlyness (ambiguity, teamwork, doing the right thing)'],
  'meta': ['Move Fast', 'Focus on Long-Term Impact', 'Build Awesome Things', 'Live in the Future', 'Be Direct and Respect Your Colleagues', 'Meta, Metamates, Me']
};

/**
 * Score a candidate's answer against a company's core values.
 * 
 * @param {Object} params
 * @param {string} params.company - Target company name
 * @param {string} params.answer - Candidate's behavioral answer
 * @returns {Object} Alignment score and mapped values
 */
async function evaluateCultureFit({ company = 'general', answer = '' }) {
  if (!answer || answer.trim().length < 20) {
    return { success: false, error: 'Answer too short.' };
  }
  // FIX REJECTION #4: Enforce strict max length (5000 chars) to prevent DoS
  if (answer.trim().length > 5000) {
    return { success: false, error: 'Answer too long. Maximum allowed length is 5000 characters.' };
  }

  const normalizedCompany = company.toLowerCase();
  const values = COMPANY_VALUES[normalizedCompany] || ['Teamwork', 'Integrity', 'Problem Solving', 'Adaptability'];

  const prompt = `You are a behavioral culture-fit evaluator for ${company}.
  
COMPANY CORE VALUES:
${values.join(', ')}

CANDIDATE ANSWER:
"${answer}"

Analyze the candidate's answer to see which of the core values they demonstrated, and which ones they violated or missed an opportunity to show.

Return a JSON object:
{
  "alignmentScore": <0-100>,
  "demonstratedValues": [
    { "value": "Value Name", "evidence": "short quote or explanation from the answer" }
  ],
  "missedOpportunities": [
    { "value": "Value Name", "feedback": "how they could have tweaked the answer to hit this value" }
  ],
  "redFlags": ["any concerning statements"]
}`;

  const systemInstruction = 'You are a strict culture-fit evaluator. Map answers to specific corporate values. Return JSON.';

  try {
    const raw = await callAIForFeature(prompt, systemInstruction, 'culture-fit');
    const parsed = parseAIJson(raw);

    if (!parsed || parsed.alignmentScore === undefined) {
      return { success: false, error: 'AI failed to score culture fit.' };
    }

    return {
      success: true,
      company,
      alignmentScore: parsed.alignmentScore,
      demonstratedValues: parsed.demonstratedValues || [],
      missedOpportunities: parsed.missedOpportunities || [],
      redFlags: parsed.redFlags || [],
      metadata: { engine: 'Phoenix Culture Fit Engine v15', timestamp: new Date().toISOString() }
    };
  } catch (err) {
    console.error('[Culture Fit Engine] Failed:', err.message);
    return { success: false, error: err.message };
  }
}

module.exports = { evaluateCultureFit, COMPANY_VALUES };
