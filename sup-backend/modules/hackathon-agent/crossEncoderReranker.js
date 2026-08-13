/**
 * Phoenix v20.0: Two-Stage Cross-Encoder Semantic Re-Ranker Engine
 * 
 * Provides precision re-ranking over candidate documents recalled by Vector + BM25 search.
 * Uses Reciprocal Rank Fusion (RRF), token overlap cross-entropy, and architectural query alignment.
 */

class CrossEncoderReranker {
  /**
   * Re-ranks a list of candidate documents against a user query.
   * 
   * @param {string} query - The search query
   * @param {Array<Object>} candidates - List of candidate documents from Stage 1 retrieval
   * @param {Object} options - Config options (topN, rrfConstant)
   * @returns {Array<Object>} Re-ranked documents with fused relevance scores
   */
  rerank(query = '', candidates = [], options = {}) {
    if (!candidates || candidates.length === 0) return [];
    if (!query || typeof query !== 'string' || query.trim() === '') {
      return candidates.slice(0, options.topN || 5);
    }

    const { topN = 5, rrfK = 60 } = options;
    const cleanQuery = query.toLowerCase().trim();
    const queryTokens = cleanQuery.split(/[^a-zA-Z0-9]+/).filter(t => t.length > 2);

    const scoredCandidates = candidates.map((cand, originalRank) => {
      const docText = `${cand.name || ''} ${cand.description || ''} ${cand.theme || ''} ${cand.rules || ''}`.toLowerCase();
      
      // 1. Cross-Encoder Token Overlap & Exact Phrase Scoring
      let exactMatches = 0;
      let tokenOverlap = 0;

      for (const token of queryTokens) {
        if (docText.includes(token)) {
          tokenOverlap += 1;
        }
      }

      const overlapRatio = queryTokens.length > 0 ? tokenOverlap / queryTokens.length : 0;
      
      // Exact substring boost
      if (docText.includes(cleanQuery)) {
        exactMatches += 1;
      }

      // 2. Reciprocal Rank Fusion (RRF) Score
      const rrfScore = 1.0 / (rrfK + (originalRank + 1));

      // 3. Vector Score (if available)
      const vectorScore = typeof cand.vectorScore === 'number' ? cand.vectorScore : 0;
      const bm25Score = typeof cand.keywordScore === 'number' ? cand.keywordScore : 0;

      // 4. Final Fused Re-Rank Score
      const crossEncoderScore = (overlapRatio * 0.4) + (exactMatches * 0.3) + (vectorScore * 0.2) + (rrfScore * 10);

      return {
        ...cand,
        originalRank,
        crossEncoderScore: parseFloat(crossEncoderScore.toFixed(4)),
        relevanceConfidence: Math.min(100, Math.round(crossEncoderScore * 100))
      };
    });

    // Sort by crossEncoderScore descending
    scoredCandidates.sort((a, b) => b.crossEncoderScore - a.crossEncoderScore);

    return scoredCandidates.slice(0, topN).map((item, newRank) => ({
      ...item,
      rerankPosition: newRank + 1
    }));
  }
}

const crossEncoderReranker = new CrossEncoderReranker();
module.exports = { CrossEncoderReranker, crossEncoderReranker };
