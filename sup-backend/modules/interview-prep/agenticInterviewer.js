/**
 * Phoenix V15: Agentic Conversational Interviewer
 * 
 * Instead of static question banks, this engine acts as a dynamic AI agent.
 * It analyzes the candidate's last answer and generates a logical follow-up probe.
 */

const { callAIForFeature, parseAIJson } = require('../../config/aiProvider');

/**
 * Generate a dynamic follow-up question based on the interview context.
 * 
 * @param {Object} params
 * @param {Array} params.conversationHistory - Array of { role: 'interviewer'|'candidate', text: string }
 * @param {string} params.targetRole - e.g. "Product Manager"
 * @returns {Object} The next question and its strategic intent
 */
async function generateNextQuestion({ conversationHistory = [], targetRole = '' }) {
  if (!conversationHistory || conversationHistory.length === 0) {
    return {
      success: false,
      question: 'Can you tell me about yourself?',
      intent: 'Opening question'
    };
  }

  // FIX REJECTION #1: Sliding window to prevent token exhaustion.
  // Keep only the last 10 turns of conversation.
  const MAX_TURNS = 10;
  const recentHistory = conversationHistory.slice(-MAX_TURNS);

  // Format history for the prompt
  const historyText = recentHistory
    .map(turn => `${turn.role.toUpperCase()}: ${turn.text}`)
    .join('\n\n');

  const prompt = `You are a strict, agentic AI interviewer conducting an interview for the role of ${targetRole}.
  
Here is the conversation so far:
${historyText}

Based on the CANDIDATE's last response, generate the NEXT question you should ask.
If their answer was vague, probe deeper for specifics.
If their answer was complete, pivot to a new relevant topic or introduce a constraint (e.g. "What if the database goes down?").

Return a JSON object:
{
  "nextQuestion": "the exact text of the question you will ask",
  "intent": "why you are asking this (e.g., 'Probing for scalability knowledge', 'Pushing for a quantified result')",
  "evaluationOfLastAnswer": "Brief 1-sentence thought on their last response"
}`;

  const systemInstruction = 'You are an adaptive AI interviewer. Never repeat questions. Probe deep. Return strict JSON.';

  try {
    const raw = await callAIForFeature(prompt, systemInstruction, 'agentic-interviewer');
    const parsed = parseAIJson(raw);

    if (!parsed || !parsed.nextQuestion) {
      return { success: false, question: 'Could you elaborate on that?', intent: 'Fallback probe' };
    }

    return {
      success: true,
      question: parsed.nextQuestion,
      intent: parsed.intent || 'Continuing the conversation',
      evaluation: parsed.evaluationOfLastAnswer || '',
      metadata: { engine: 'Phoenix Agentic Interviewer v15', timestamp: new Date().toISOString() }
    };
  } catch (err) {
    console.error('[Agentic Interviewer] Failed:', err.message);
    return { success: false, question: 'Let us move on to the next topic.', intent: 'Fallback due to error' };
  }
}

module.exports = { generateNextQuestion };
