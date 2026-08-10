/**
 * Phoenix V15: Regional Accent Fairness & Bias Mitigator
 * 
 * Middleware-style function that adjusts speech analysis scoring
 * to prevent penalizing non-native (ESL) English speakers for
 * natural pacing differences or vocabulary thresholds.
 */

/**
 * Adjust speech scores based on the candidate's language profile.
 * 
 * @param {Object} speechAnalysisResult - Result from speechAnalysisEngine.js
 * @param {boolean} isNonNativeSpeaker - Flag indicating if the user is ESL
 * @returns {Object} Adjusted speech analysis result
 */
function mitigateSpeechBias(speechAnalysisResult, isNonNativeSpeaker = false) {
  if (!speechAnalysisResult || !speechAnalysisResult.success) {
    return speechAnalysisResult;
  }

  // FIX REJECTION #9: Use structuredClone instead of JSON.parse/stringify
  const adjusted = structuredClone(speechAnalysisResult);
  
  if (!isNonNativeSpeaker) {
    return adjusted;
  }

  // 1. WPM (Words Per Minute) Adjustment
  // Non-native speakers typically speak 15-20% slower. We adjust the threshold.
  if (adjusted.scores && adjusted.scores.speakingPace) {
    const wpm = adjusted.scores.speakingPace.wordsPerMinute;
    if (wpm >= 90 && wpm < 130) {
      adjusted.scores.speakingPace.assessment = 'OPTIMAL'; // Lowered optimal floor from 100 to 90
    }
  }

  // 2. Vocabulary Richness Adjustment
  // ESL speakers might use simpler vocabulary but effectively.
  if (adjusted.scores && adjusted.scores.vocabularyRichness && typeof adjusted.scores.vocabularyRichness.score === 'number') {
    const oldScore = adjusted.scores.vocabularyRichness.score;
    // Boost vocabulary score by 15% (max 100) for ESL to prevent bias against simpler lexicons
    adjusted.scores.vocabularyRichness.score = Math.min(100, Math.round(oldScore * 1.15));
  }

  // 3. Clarity Score (Sentence Complexity) Adjustment
  // ESL speakers often use shorter sentences. We prevent penalizing "terse" sentences.
  if (adjusted.scores && adjusted.scores.sentenceClarity && typeof adjusted.scores.sentenceClarity.score === 'number') {
    const avgWords = adjusted.scores.sentenceClarity.avgWordsPerSentence;
    if (avgWords < 5) {
      // Originally 60 for "too terse", bump to 80 if ESL as it's clear and direct
      adjusted.scores.sentenceClarity.score = Math.max(adjusted.scores.sentenceClarity.score, 80);
    }
  }

  // 4. Overall Score Recalculation
  // Recalculate overall score with the boosted component scores
  // Assuming equal weights for simplicity in the mitigation layer, 
  // though the original engine uses specific weights. We just apply a small bump.
  if (adjusted.overallScore !== undefined) {
    adjusted.overallScore = Math.min(100, adjusted.overallScore + 5); // Flat +5 bias correction curve
    
    // Update grade
    if (adjusted.overallScore >= 85) adjusted.grade = 'EXCELLENT';
    else if (adjusted.overallScore >= 70) adjusted.grade = 'GOOD';
    else if (adjusted.overallScore >= 50) adjusted.grade = 'NEEDS_IMPROVEMENT';
    else adjusted.grade = 'POOR';
  }
  
  adjusted.metadata = adjusted.metadata || {};
  adjusted.metadata.biasMitigationApplied = true;

  return adjusted;
}

module.exports = { mitigateSpeechBias };
