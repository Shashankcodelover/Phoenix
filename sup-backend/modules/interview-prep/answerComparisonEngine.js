/**
 * Phoenix V16: Answer Comparison Engine (A/B Side-by-Side)
 *
 * Takes two versions of an answer (e.g., candidate's draft vs. improved version)
 * and provides a structured comparison, scoring both and highlighting the
 * concrete improvements between them.
 */

/**
 * Compare two answer versions side-by-side.
 *
 * @param {Object} params
 * @param {string} params.originalAnswer - The candidate's first attempt
 * @param {string} params.improvedAnswer - The candidate's second attempt
 * @param {string} params.questionType - 'BEHAVIORAL' | 'TECHNICAL' | 'GENERAL'
 * @returns {Object} Comparison metrics and delta analysis
 */
function compareAnswers({ originalAnswer = '', improvedAnswer = '', questionType = 'GENERAL' }) {
  if (!originalAnswer || originalAnswer.trim().length < 20) {
    return { success: false, error: 'Original answer too short (min 20 chars).' };
  }
  if (!improvedAnswer || improvedAnswer.trim().length < 20) {
    return { success: false, error: 'Improved answer too short (min 20 chars).' };
  }
  // FIX REJECTION #9: Max length guard to prevent event loop blocking
  if (originalAnswer.length > 10000 || improvedAnswer.length > 10000) {
    return { success: false, error: 'Answers must be under 10000 characters each.' };
  }

  const analyze = (text) => {
    const words = text.trim().split(/\s+/).filter(Boolean);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^a-z]/g, '')).filter(Boolean));

    // Quantified result markers
    const quantifiers = text.match(/\d+%|\$[\d,]+|\d+x|\d+ (percent|million|thousand|users|customers|hours|days|months)/gi) || [];

    // Action verb density
    const actionVerbs = ['built', 'created', 'led', 'designed', 'implemented', 'reduced', 'increased', 'achieved', 'launched', 'managed', 'developed', 'optimized', 'architected', 'automated', 'deployed'];
    const actionCount = actionVerbs.filter(v => text.toLowerCase().includes(v)).length;

    return {
      wordCount: words.length,
      sentenceCount: Math.max(1, sentences.length),
      uniqueWordRatio: words.length > 0 ? Math.round((uniqueWords.size / words.length) * 100) : 0,
      quantifiedResults: quantifiers.length,
      actionVerbDensity: actionCount,
      avgSentenceLength: Math.round(words.length / Math.max(1, sentences.length))
    };
  };

  const original = analyze(originalAnswer);
  const improved = analyze(improvedAnswer);

  // Score each version (0-100)
  const score = (metrics) => {
    let s = 50;
    // Word count in sweet spot (100-250)
    if (metrics.wordCount >= 100 && metrics.wordCount <= 250) s += 15;
    else if (metrics.wordCount >= 50) s += 5;
    // Vocabulary richness
    if (metrics.uniqueWordRatio > 60) s += 10;
    else if (metrics.uniqueWordRatio > 40) s += 5;
    // Quantified results (big bonus)
    s += Math.min(15, metrics.quantifiedResults * 5);
    // Action verbs
    s += Math.min(10, metrics.actionVerbDensity * 2);
    return Math.min(100, s);
  };

  const originalScore = score(original);
  const improvedScore = score(improved);
  const delta = improvedScore - originalScore;

  const improvements = [];
  if (improved.wordCount > original.wordCount && original.wordCount < 100) {
    improvements.push(`Added ${improved.wordCount - original.wordCount} more words for depth.`);
  }
  if (improved.quantifiedResults > original.quantifiedResults) {
    improvements.push(`Added ${improved.quantifiedResults - original.quantifiedResults} quantified result(s) — this is critical for STAR answers.`);
  }
  if (improved.actionVerbDensity > original.actionVerbDensity) {
    improvements.push(`Used ${improved.actionVerbDensity - original.actionVerbDensity} more action verbs, projecting stronger ownership.`);
  }
  if (improved.uniqueWordRatio > original.uniqueWordRatio) {
    improvements.push('Improved vocabulary diversity.');
  }

  return {
    success: true,
    original: { ...original, score: originalScore },
    improved: { ...improved, score: improvedScore },
    delta,
    verdict: delta > 15 ? 'SIGNIFICANT_IMPROVEMENT' : delta > 5 ? 'MODERATE_IMPROVEMENT' : delta > 0 ? 'MARGINAL_IMPROVEMENT' : 'NO_IMPROVEMENT',
    improvements,
    metadata: { engine: 'Phoenix Answer Comparator v16' }
  };
}

module.exports = { compareAnswers };
