/**
 * Phoenix V14: Speech Analysis Engine
 * 
 * Evaluates transcribed interview responses for communication quality.
 * Inspired by Google Interview Warmup and InterviewSidekick's speech analytics.
 * 
 * Capabilities:
 *   - Filler word detection and frequency analysis
 *   - Speaking pace estimation (words per minute)
 *   - Vocabulary richness (unique word ratio)
 *   - Clarity scoring (sentence complexity, jargon density)
 *   - Confidence signals (hedging language detection)
 *   - Response structure analysis (STAR compliance check)
 */

// Common filler words and hedging phrases
const FILLER_WORDS = [
  'um', 'uh', 'like', 'you know', 'basically', 'actually', 'literally',
  'sort of', 'kind of', 'i mean', 'right', 'well', 'so', 'just',
  'i think', 'i guess', 'maybe', 'perhaps', 'probably'
];

const HEDGING_PHRASES = [
  'i think', 'i believe', 'i feel like', 'it seems', 'i suppose',
  'probably', 'maybe', 'might', 'could be', 'not sure but',
  'i\'m not certain', 'kind of', 'sort of'
];

// STAR method structural markers
const STAR_MARKERS = {
  situation: ['situation', 'context', 'background', 'when i was', 'at my previous', 'in my role', 'we had a', 'there was a'],
  task: ['task', 'responsible for', 'my role was', 'i was asked to', 'needed to', 'had to', 'goal was', 'objective'],
  action: ['i did', 'i implemented', 'i built', 'i created', 'i led', 'i designed', 'i developed', 'i wrote', 'i coordinated', 'i analyzed', 'steps i took'],
  result: ['result', 'outcome', 'impact', 'achieved', 'improved', 'reduced', 'increased', 'saved', 'generated', 'led to', 'metrics']
};

/**
 * Analyze a transcribed interview response for communication quality.
 * 
 * @param {Object} params
 * @param {string} params.transcript - Transcribed text of the candidate's response
 * @param {number} params.durationSeconds - Optional: how long the response took (for WPM)
 * @param {string} params.questionType - Optional: 'BEHAVIORAL' | 'TECHNICAL' | 'SYSTEM_DESIGN'
 * @returns {Object} Comprehensive speech analysis report
 */
function analyzeSpeech({ transcript = '', durationSeconds = 0, questionType = 'GENERAL' }) {
  if (!transcript || transcript.trim().length < 20) {
    return {
      success: false,
      error: 'Transcript must be at least 20 characters for meaningful analysis.',
      scores: {}
    };
  }

  const text = transcript.trim();
  const lowerText = text.toLowerCase();
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = Math.max(1, sentences.length);

  // ── 1. Filler Word Analysis ──
  const fillerDetections = [];
  let totalFillerCount = 0;

  for (const filler of FILLER_WORDS) {
    const regex = new RegExp(`\\b${filler.replace(/\s+/g, '\\s+')}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches && matches.length > 0) {
      fillerDetections.push({ word: filler, count: matches.length });
      totalFillerCount += matches.length;
    }
  }

  const fillerRatio = wordCount > 0 ? totalFillerCount / wordCount : 0;
  const fillerScore = Math.max(0, Math.round((1 - fillerRatio * 10) * 100));

  // ── 2. Speaking Pace (WPM) ──
  let wordsPerMinute = 0;
  let paceAssessment = 'UNKNOWN';
  if (durationSeconds > 0) {
    wordsPerMinute = Math.round((wordCount / durationSeconds) * 60);
    if (wordsPerMinute < 100) paceAssessment = 'TOO_SLOW';
    else if (wordsPerMinute < 130) paceAssessment = 'OPTIMAL';
    else if (wordsPerMinute < 160) paceAssessment = 'SLIGHTLY_FAST';
    else paceAssessment = 'TOO_FAST';
  }

  // ── 3. Vocabulary Richness ──
  const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^a-z]/g, '')).filter(Boolean));
  const vocabularyRichness = wordCount > 0 ? uniqueWords.size / wordCount : 0;
  const vocabularyScore = Math.round(Math.min(1, vocabularyRichness * 1.5) * 100);

  // ── 4. Sentence Complexity (Average words per sentence) ──
  const avgWordsPerSentence = wordCount / sentenceCount;
  let clarityScore = 100;
  if (avgWordsPerSentence > 30) clarityScore = 50; // too complex
  else if (avgWordsPerSentence > 22) clarityScore = 70;
  else if (avgWordsPerSentence < 5) clarityScore = 60; // too terse
  else clarityScore = 90;

  // ── 5. Confidence Analysis (Hedging Detection) ──
  let hedgingCount = 0;
  const hedgingDetections = [];
  for (const phrase of HEDGING_PHRASES) {
    const regex = new RegExp(`\\b${phrase.replace(/['"]/g, '.')}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches && matches.length > 0) {
      hedgingDetections.push({ phrase, count: matches.length });
      hedgingCount += matches.length;
    }
  }
  const confidenceScore = Math.max(0, Math.round((1 - hedgingCount / Math.max(1, sentenceCount) * 0.5) * 100));

  // ── 6. STAR Structure Compliance (for behavioral questions) ──
  const starAnalysis = {
    situation: false,
    task: false,
    action: false,
    result: false,
    coverage: 0
  };

  for (const [component, markers] of Object.entries(STAR_MARKERS)) {
    starAnalysis[component] = markers.some(marker => lowerText.includes(marker));
  }

  const starComponents = ['situation', 'task', 'action', 'result'];
  const coveredComponents = starComponents.filter(c => starAnalysis[c]);
  starAnalysis.coverage = Math.round((coveredComponents.length / 4) * 100);

  // ── 7. Response Length Assessment ──
  let lengthAssessment = 'ADEQUATE';
  if (wordCount < 30) lengthAssessment = 'TOO_SHORT';
  else if (wordCount < 80) lengthAssessment = 'BRIEF';
  else if (wordCount > 400) lengthAssessment = 'TOO_LONG';
  else if (wordCount > 250) lengthAssessment = 'DETAILED';

  // ── Overall Score (weighted blend) ──
  const weights = {
    filler: 0.20,
    vocabulary: 0.15,
    clarity: 0.20,
    confidence: 0.20,
    star: questionType === 'BEHAVIORAL' ? 0.25 : 0.10,
    length: 0.0 // informational only
  };

  // Normalize star weight distribution when not behavioral
  if (questionType !== 'BEHAVIORAL') {
    weights.filler += 0.05;
    weights.clarity += 0.05;
    weights.confidence += 0.05;
  }

  const overallScore = Math.round(
    fillerScore * weights.filler +
    vocabularyScore * weights.vocabulary +
    clarityScore * weights.clarity +
    confidenceScore * weights.confidence +
    starAnalysis.coverage * weights.star
  );

  // ── Generate Coaching Tips ──
  const coachingTips = [];
  if (fillerScore < 70) coachingTips.push(`Reduce filler words. You used ${totalFillerCount} fillers in ${wordCount} words. Practice pausing instead of using "um" or "like".`);
  if (confidenceScore < 60) coachingTips.push(`Speak with more conviction. Reduce hedging phrases like "I think" or "maybe". State your accomplishments as facts.`);
  if (avgWordsPerSentence > 25) coachingTips.push(`Simplify your sentences. Your average sentence has ${Math.round(avgWordsPerSentence)} words — aim for 15-20 for clarity.`);
  if (lengthAssessment === 'TOO_SHORT') coachingTips.push(`Expand your answer. ${wordCount} words is too brief. Aim for 100-200 words for a complete response.`);
  if (lengthAssessment === 'TOO_LONG') coachingTips.push(`Be more concise. ${wordCount} words is too long. Aim to stay under 250 words.`);
  if (questionType === 'BEHAVIORAL' && starAnalysis.coverage < 75) {
    const missing = starComponents.filter(c => !starAnalysis[c]);
    coachingTips.push(`Your STAR structure is incomplete (${starAnalysis.coverage}%). Missing: ${missing.join(', ')}. Structure your answer with Situation → Task → Action → Result.`);
  }
  if (vocabularyScore < 50) coachingTips.push(`Diversify your vocabulary. You're repeating the same words frequently. Use more specific, technical terms.`);

  return {
    success: true,
    overallScore,
    grade: overallScore >= 85 ? 'EXCELLENT' : overallScore >= 70 ? 'GOOD' : overallScore >= 50 ? 'NEEDS_IMPROVEMENT' : 'POOR',
    wordCount,
    sentenceCount,
    scores: {
      fillerWords: { score: fillerScore, detections: fillerDetections, totalCount: totalFillerCount, ratio: Math.round(fillerRatio * 1000) / 1000 },
      speakingPace: { wordsPerMinute, assessment: paceAssessment, durationSeconds },
      vocabularyRichness: { score: vocabularyScore, uniqueWords: uniqueWords.size, ratio: Math.round(vocabularyRichness * 1000) / 1000 },
      sentenceClarity: { score: clarityScore, avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10 },
      confidence: { score: confidenceScore, hedgingDetections, hedgingCount },
      starCompliance: starAnalysis,
      responseLength: { wordCount, assessment: lengthAssessment }
    },
    coachingTips,
    metadata: {
      engine: 'Phoenix Speech Analysis Engine v14',
      questionType,
      analyzedAt: new Date().toISOString()
    }
  };
}

module.exports = { analyzeSpeech, FILLER_WORDS, HEDGING_PHRASES, STAR_MARKERS };
