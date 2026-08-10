/**
 * Phoenix V15: Live Interview Copilot (Stealth Engine)
 * 
 * Provides real-time, low-latency hints during live interviews.
 * Takes transcription chunks (what the interviewer just said, or what the candidate is saying)
 * and generates `< 7 word` course-corrections.
 */

const { callAIForFeature, parseAIJson } = require('../../config/aiProvider');

/**
 * Generate a stealth hint based on the live transcript.
 * 
 * @param {Object} params
 * @param {string} params.interviewerTranscript - What the interviewer just asked
 * @param {string} params.candidateTranscript - What the candidate is currently answering (if any)
 * @param {string} params.targetRole - e.g. "Senior Backend Engineer"
 * @returns {Object} A concise hint to show on screen
 */
async function generateLiveCopilotHint({ interviewerTranscript = '', candidateTranscript = '', targetRole = '' }) {
  if (!interviewerTranscript || interviewerTranscript.trim().length < 5) {
    return { success: false, hint: '', error: 'Interviewer transcript too short.' };
  }

  // FIX REJECTION #2: Sanitize inputs to prevent prompt injection
  const sanitize = (str) => (str || '').replace(/(ignore|system|instruction|prompt|bypass|roleplay)/gi, '[REDACTED]');
  const safeInterviewer = sanitize(interviewerTranscript);
  const safeCandidate = sanitize(candidateTranscript);

  const prompt = `You are a stealth live-interview copilot for a candidate applying for: ${targetRole}.
  
INTERVIEWER JUST SAID:
[[[ ${safeInterviewer} ]]]

CANDIDATE IS CURRENTLY SAYING:
[[[ ${safeCandidate} ]]]

Your goal is to provide a real-time, instantaneous "hint" to the candidate to guide their answer.
RULES:
1. The hint MUST be under 7 words. It will be flashed on their screen.
2. If the candidate is missing a key concept, name it (e.g., "Mention Redis caching", "Discuss edge cases", "Use the STAR method").
3. If the candidate is doing well, say "Keep going" or "Good, wrap up soon".

Return a JSON object:
{
  "hint": "the short text hint",
  "urgency": "LOW|MEDIUM|HIGH",
  "category": "TECHNICAL|BEHAVIORAL|PACING"
}`;

  const systemInstruction = 'You are a real-time interview copilot. Output only strict JSON. Hints must be under 7 words.';

  try {
    const raw = await callAIForFeature(prompt, systemInstruction, 'live-copilot');
    const parsed = parseAIJson(raw);

    if (!parsed || !parsed.hint) {
      return { success: false, hint: '', error: 'AI parsing failed' };
    }

    return {
      success: true,
      hint: parsed.hint,
      urgency: parsed.urgency || 'LOW',
      category: parsed.category || 'TECHNICAL',
      metadata: { engine: 'Phoenix Copilot v15', timestamp: new Date().toISOString() }
    };
  } catch (err) {
    console.error('[Copilot Engine] Failed:', err.message);
    return { success: false, hint: '', error: err.message };
  }
}

module.exports = { generateLiveCopilotHint };
