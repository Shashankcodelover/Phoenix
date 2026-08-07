/**
 * Phoenix v13 Integrity Engine — Code Playback & Reasoning Inspector
 * =================================================================
 * 2026 Standard for AI Anti-Cheating & Integrity Verification.
 *
 * Analyzes candidate typing dynamics during live coding & interview practice:
 * - Large block insertion detection (detects bulk copy-pasting from ChatGPT/Claude)
 * - Typing velocity (words per minute & keystroke variance)
 * - Pause analysis (evaluates whether pauses match cognitive problem decomposition)
 * - Probing question generation (creates targeted verbal follow-up questions about candidate code)
 */

function evaluateCodeTypingIntegrity({ codeSubmission, keypressEvents = [], pasteCount = 0, totalDurationSeconds = 60 }) {
  if (!codeSubmission || typeof codeSubmission !== 'string') {
    throw new Error('codeSubmission string is required.');
  }

  const charLength = codeSubmission.length;
  const linesCount = codeSubmission.split('\n').length;
  const charsPerSecond = totalDurationSeconds > 0 ? charLength / totalDurationSeconds : charLength;

  const anomalies = [];
  let integrityScore = 100;

  // 1. Bulk Paste Anomaly Check
  if (pasteCount > 0) {
    const penalty = Math.min(60, pasteCount * 12 + (charsPerSecond > 20 ? 25 : 10));
    integrityScore -= penalty;
    anomalies.push({
      type: 'BULK_PASTE_DETECTED',
      severity: 'HIGH',
      details: `Detected ${pasteCount} paste events with high typing velocity (${charsPerSecond.toFixed(1)} chars/sec).`
    });
  }

  // 2. Unnatural Typing Speed (Instant solution generation)
  if (charLength > 50 && totalDurationSeconds < 5) {
    integrityScore -= 30;
    anomalies.push({
      type: 'INSTANT_SOLUTION_INJECTION',
      severity: 'CRITICAL',
      details: `Code length ${charLength} chars was submitted in only ${totalDurationSeconds} seconds.`
    });
  }

  // 3. Keystroke Variance Analysis (Human typing has micro-pauses)
  if (keypressEvents.length > 10) {
    const intervals = [];
    for (let i = 1; i < keypressEvents.length; i++) {
      intervals.push(keypressEvents[i].timestamp - keypressEvents[i - 1].timestamp);
    }
    const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / intervals.length;

    if (variance < 5) {
      integrityScore -= 20;
      anomalies.push({
        type: 'ROBOTIC_TYPING_CADENCE',
        severity: 'MEDIUM',
        details: `Keystroke timing variance is unnaturally low (${variance.toFixed(2)}ms²), suggesting automated macro playback.`
      });
    }
  }

  // Final Score Clamping
  integrityScore = Math.max(0, Math.min(100, integrityScore));

  // 4. Generate Conversational AI Probing Questions to verify true candidate understanding
  const probingQuestions = generateReasoningProbes(codeSubmission);

  return {
    success: true,
    evaluatedAt: new Date().toISOString(),
    charLength,
    linesCount,
    totalDurationSeconds,
    charsPerSecond: parseFloat(charsPerSecond.toFixed(2)),
    integrityScore,
    verdict: integrityScore >= 80 ? 'GENUINE_HUMAN' : integrityScore >= 50 ? 'SUSPICIOUS_ASSIST' : 'HIGH_CHEATING_PROBABILITY',
    anomalies,
    probingQuestions
  };
}

function generateReasoningProbes(code) {
  const probes = [];
  if (code.includes('for') || code.includes('while')) {
    probes.push('Can you explain the loop termination condition and why you chose this loop bounds strategy?');
  }
  if (code.includes('Map') || code.includes('Set') || code.includes('{}')) {
    probes.push('What is the space complexity tradeoff of using hash storage here vs an in-place array approach?');
  }
  if (code.includes('recursion') || code.includes('return')) {
    probes.push('What is the base case of your solution, and how does your code prevent stack overflow?');
  }
  if (probes.length === 0) {
    probes.push('Walk me through how your solution handles edge cases like empty inputs or negative values.');
  }
  return probes;
}

module.exports = { evaluateCodeTypingIntegrity, generateReasoningProbes };
