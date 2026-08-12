/**
 * Phoenix v8.0: AI Speech & Voice Prosody Evaluation Engine
 * 
 * Analyzes audio transcription / text response metrics for technical interviews:
 * - Words Per Minute (WPM) speaking rate & pacing score
 * - Filler word density & frequency breakdown
 * - Vocal clarity score (0-100)
 * - Confidence index (0-100)
 * - Tone classification (Assertive, Conversational, Hesitant, Monotone)
 * - Actionable delivery improvement suggestions
 */

const FILLER_DICTIONARY = [
  'um', 'uh', 'like', 'basically', 'actually', 'you know', 'sort of',
  'kind of', 'right', 'mean', 'honestly', 'literally', 'obviously'
];

/**
 * Analyzes speech performance from a transcript text string and audio duration (seconds).
 * 
 * @param {string} transcript - The spoken speech transcript text
 * @param {number} durationSeconds - Total duration of spoken response in seconds (default: estimated from word count)
 * @returns {Object} Structured prosody and delivery evaluation report
 */
function evaluateSpeechProsody(transcript = '', durationSeconds = null) {
  if (!transcript || typeof transcript !== 'string' || transcript.trim() === '') {
    return {
      wpm: 0,
      pacingRating: 'No Speech Detected',
      fillerCount: 0,
      fillerDensity: 0,
      clarityScore: 0,
      confidenceIndex: 0,
      tone: 'Neutral',
      fillersDetected: [],
      feedback: ['Please provide a spoken transcript or audio recording to analyze your speech delivery.']
    };
  }

  const cleanText = transcript.trim();
  const words = cleanText.toLowerCase().split(/[^a-zA-Z0-9']+/).filter(Boolean);
  const totalWords = words.length;

  // Calculate duration if not provided (assume average speaking rate of 130 WPM)
  const estimatedDuration = durationSeconds && durationSeconds > 0 ? durationSeconds : Math.max(5, (totalWords / 130) * 60);
  const durationMinutes = estimatedDuration / 60;

  // Calculate WPM
  const wpm = Math.round(totalWords / durationMinutes);

  // Pacing Rating
  let pacingRating = 'Optimal (120-160 WPM)';
  let pacingPenalty = 0;
  if (wpm < 90) {
    pacingRating = 'Too Slow (<90 WPM)';
    pacingPenalty = 20;
  } else if (wpm < 110) {
    pacingRating = 'Slightly Slow (90-110 WPM)';
    pacingPenalty = 10;
  } else if (wpm > 180) {
    pacingRating = 'Too Fast (>180 WPM)';
    pacingPenalty = 20;
  } else if (wpm > 160) {
    pacingRating = 'Slightly Fast (160-180 WPM)';
    pacingPenalty = 10;
  }

  // Detect Fillers (Single words & multi-word phrases)
  const fillersDetectedMap = {};
  let totalFillers = 0;
  const lowerTranscript = cleanText.toLowerCase();

  FILLER_DICTIONARY.forEach(filler => {
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    const matches = lowerTranscript.match(regex);
    if (matches) {
      const count = matches.length;
      totalFillers += count;
      fillersDetectedMap[filler] = count;
    }
  });

  const fillerDensityPercent = totalWords > 0 ? parseFloat(((totalFillers / totalWords) * 100).toFixed(2)) : 0;

  // Calculate Clarity Score (0-100)
  // Penalize for fillers, extreme WPM, and very short responses
  let clarityScore = 100 - (fillerDensityPercent * 5) - pacingPenalty;
  if (totalWords < 20) clarityScore -= 15;
  clarityScore = Math.max(0, Math.min(100, Math.round(clarityScore)));

  // Calculate Confidence Index (0-100)
  // FIX REJECTION #9: Base confidence deduction on normalized filler density percentage rather than raw count,
  // preventing score collapse on long, articulate responses.
  const assertiveWords = ['definitely', 'concluded', 'implemented', 'designed', 'measured', 'optimized', 'achieved', 'because', 'therefore', 'spearheaded', 'architected'];
  let assertiveCount = 0;
  words.forEach(word => {
    if (assertiveWords.includes(word)) assertiveCount++;
  });

  // Calculate density penalty: normal speech has 1-3% fillers; >5% shows nervousness
  const fillerConfidencePenalty = Math.min(40, Math.round(fillerDensityPercent * 6));
  let confidenceIndex = 80 + Math.min(20, assertiveCount * 3) - fillerConfidencePenalty;
  if (wpm >= 120 && wpm <= 160) confidenceIndex += 10;
  confidenceIndex = Math.max(10, Math.min(100, Math.round(confidenceIndex)));

  // Tone Classification
  let tone = 'Conversational & Professional';
  if (confidenceIndex > 85 && fillerDensityPercent < 2) {
    tone = 'Assertive & Authority';
  } else if (confidenceIndex < 55 || fillerDensityPercent > 6) {
    tone = 'Hesitant & Uncertain';
  } else if (wpm < 100) {
    tone = 'Deliberate & Monotone';
  }

  // Generate Actionable Feedback
  const feedback = [];
  if (wpm < 110) {
    feedback.push('Try to increase your speaking pace slightly. Practicing with a metronome at 130-140 WPM helps build natural fluency.');
  } else if (wpm > 160) {
    feedback.push('You are speaking rapidly. Pause intentionally at key technical terms to give the interviewer time to digest your logic.');
  } else {
    feedback.push('Excellent speaking pace! Your delivery rate falls within the ideal professional interview range.');
  }

  if (totalFillers > 0) {
    const topFillers = Object.entries(fillersDetectedMap)
      .sort((a, b) => b[1] - a[1])
      .map(([word, count]) => `"${word}" (${count}x)`)
      .join(', ');
    feedback.push(`Filler word density is ${fillerDensityPercent}%. Work on substituting ${topFillers} with brief 1-second silent pauses.`);
  } else {
    feedback.push('Zero filler words detected in your response! Your articulation is exceptionally clean.');
  }

  if (assertiveCount === 0) {
    feedback.push('Use active achievement verbs like "designed", "optimized", or "benchmarked" to strengthen your authority.');
  }

  return {
    success: true,
    transcriptLength: totalWords,
    estimatedDurationSeconds: Math.round(estimatedDuration),
    wpm,
    pacingRating,
    fillerCount: totalFillers,
    fillerDensityPercent,
    fillersDetected: fillersDetectedMap,
    clarityScore,
    confidenceIndex,
    tone,
    feedback
  };
}

module.exports = { evaluateSpeechProsody, FILLER_DICTIONARY };
