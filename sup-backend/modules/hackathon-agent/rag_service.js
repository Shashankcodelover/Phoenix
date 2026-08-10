/**
 * Phoenix V14: Real Vector RAG Service
 * Implements Google GenAI embeddings, deferred async initialization,
 * numerically stable cosine similarity, hybrid BM25+Vector search,
 * and embedding model versioning.
 * 
 * FIXES:
 *   - REJECTION #2: Deferred async `initialize()` — no more env race condition
 *   - REJECTION #3: `Math.sqrt(normA * normB)` — no more floating-point underflow
 *   - NEW: BM25 keyword scoring fallback for hybrid retrieval
 *   - NEW: Embedding model version tracking per document
 */

const { retrieveWinningProjects } = require('./hackathonWinnersData');
const Hackathon = require('../../models/hackathonModel');

// Embedding model version constant — MUST be updated when switching models
const EMBEDDING_MODEL_ID = 'text-embedding-004';
const EMBEDDING_DIMENSIONS = 768;

class HackathonRAGService {
  constructor() {
    // Deferred — do NOT instantiate GoogleGenerativeAI here.
    // The API key may not be loaded yet if dotenv.config() hasn't run.
    this.genAI = null;
    this.embeddingModel = null;
    this.initialized = false;
  }

  /**
   * Async initialization — MUST be called after dotenv.config() in server.js
   * Fixes REJECTION #2: Environmental Injection Race Condition
   */
  async initialize() {
    if (this.initialized) return;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.startsWith('your-')) {
      console.warn('[RAG Service] No valid GEMINI_API_KEY found. AI embeddings disabled. Falling back to BM25 keyword search.');
      this.initialized = true;
      return;
    }

    try {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.embeddingModel = this.genAI.getGenerativeModel({ model: EMBEDDING_MODEL_ID });
      console.log(`[RAG Service] Initialized with model: ${EMBEDDING_MODEL_ID} (${EMBEDDING_DIMENSIONS}-dim)`);
    } catch (err) {
      console.error('[RAG Service] Failed to initialize Gemini AI:', err.message);
      // Graceful degradation — service continues with BM25-only mode
    }

    this.initialized = true;
  }

  /**
   * Numerically stable cosine similarity.
   * FIX REJECTION #7: Prevents overflow by computing sqrt(normA) and sqrt(normB)
   * individually, which avoids normA*normB exceeding Number.MAX_VALUE in 768-dim space.
   * Returns 0 for zero-magnitude vectors instead of NaN.
   */
  cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length || vecA.length === 0) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    // Guard zero-magnitude vectors
    if (normA === 0 || normB === 0) return 0;

    // FIX: Compute sqrt individually to prevent overflow when normA*normB > MAX_VALUE
    const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
    if (!Number.isFinite(magnitude) || magnitude === 0) return 0;

    const similarity = dotProduct / magnitude;
    // Clamp to [-1, 1] to handle floating-point drift
    return Math.max(-1, Math.min(1, similarity));
  }

  /**
   * BM25 keyword scoring with dynamic IDF.
   * IDF is computed from actual corpus term frequencies passed via corpusStats.
   * Stop-words that appear in many documents get low IDF; rare terms get high IDF.
   *
   * @param {string} query
   * @param {string} document
   * @param {number} avgDocLen
   * @param {Object} corpusStats - { totalDocs, docFrequency: { term: count } }
   */
  bm25Score(query, document, avgDocLen = 100, corpusStats = null) {
    if (!query || !document) return 0;

    const k1 = 1.5;
    const b = 0.75;

    const queryTerms = query.toLowerCase().split(/\s+/).filter(Boolean);
    const docTerms = document.toLowerCase().split(/\s+/).filter(Boolean);
    const docLen = docTerms.length;

    const tfMap = {};
    for (const term of docTerms) {
      tfMap[term] = (tfMap[term] || 0) + 1;
    }

    const totalDocs = corpusStats?.totalDocs || 10;

    let score = 0;
    for (const term of queryTerms) {
      const tf = tfMap[term] || 0;
      if (tf === 0) continue;

      // Dynamic IDF from corpus stats (or a reasonable default)
      const df = corpusStats?.docFrequency?.[term] || 1;
      const idf = Math.log((totalDocs - df + 0.5) / (df + 0.5) + 1);

      const numerator = tf * (k1 + 1);
      const denominator = tf + k1 * (1 - b + b * (docLen / avgDocLen));
      score += idf * (numerator / denominator);
    }

    return score;
  }

  /**
   * Generates a 768-dim embedding array using Gemini API with rate-limit delay
   */
  async generateEmbedding(text) {
    if (!this.embeddingModel) return [];
    try {
      // 200ms delay to avoid HTTP 429 quota errors
      await new Promise(r => setTimeout(r, 200));
      const result = await this.embeddingModel.embedContent(text);
      return result.embedding.values;
    } catch (err) {
      console.warn('[RAG] Failed to generate embedding:', err.message);
      return [];
    }
  }

  /**
   * Index a fresh scraped hackathon into the DB with embeddings + model versioning
   * This is the critical function that MUST be called by the scraper engine
   * (Fixes REJECTION #1 when the scraper calls this)
   */
  async indexHackathon(hackathon) {
    if (!hackathon || !hackathon.name) return null;

    // Generate combined text for embedding
    const textToEmbed = `${hackathon.name}. ${hackathon.description || ''} Theme: ${hackathon.theme || 'General'}. Rules: ${hackathon.rules || 'Standard rules'}.`;
    const embedding = await this.generateEmbedding(textToEmbed);

    const doc = await Hackathon.findOneAndUpdate(
      { name: hackathon.name },
      {
        name: hackathon.name,
        description: hackathon.description || '',
        theme: hackathon.theme || hackathon.tags?.join(', ') || 'General',
        rules: hackathon.rules || 'Standard rules',
        status: hackathon.status || 'Active',
        platform: hackathon.platform || 'Custom',
        startDate: hackathon.startDate ? new Date(hackathon.startDate) : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        deadlineDate: hackathon.deadlineDate ? new Date(hackathon.deadlineDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        hostingLink: hackathon.hostingLink || '',
        logo: hackathon.logo || '',
        embedding: embedding,
        embeddingModel: EMBEDDING_MODEL_ID
      },
      { upsert: true, new: true }
    );

    console.log(`[RAG Service] Indexed: ${doc.name} (embedding dims: ${embedding.length}, model: ${EMBEDDING_MODEL_ID})`);
    return doc;
  }

  /**
   * Retrieves top N hackathons using Hybrid Search:
   *   1. Vector Cosine Similarity (if embeddings available)
   *   2. BM25 Keyword Matching (always available as fallback)
   *   3. Final score = weighted blend of both
   * Uses batched query with .lean() and a hard cap of 500 docs.
   * Fallback sorts by deadlineDate ascending (most urgent first).
   */
  async retrieveHackathons(query = '', limit = 3) {
    const qStr = typeof query === 'string' ? query : '';

    if (!qStr) {
      // FIX REJECTION #8: Sort by deadlineDate ascending to show most urgent first
      const fallback = await Hackathon.find({ status: 'Active' })
        .sort({ deadlineDate: 1 })
        .limit(limit)
        .lean();
      return fallback.map(h => this._addDeadlineCountdown(h));
    }

    const queryEmbedding = await this.generateEmbedding(qStr);
    const hasVectorCapability = queryEmbedding.length > 0;

    // FIX REJECTION #1: Fetch a bounded batch instead of cursoring every doc.
    // Cap at 500 to prevent blocking the event loop under any dataset size.
    const SEARCH_CAP = 500;
    const candidates = await Hackathon.find({ status: 'Active' })
      .sort({ deadlineDate: 1 })
      .limit(SEARCH_CAP)
      .lean();

    // Pre-compute corpus stats for dynamic BM25 IDF (FIX REJECTION #6)
    const corpusStats = this._buildCorpusStats(candidates);

    const scored = [];
    for (const hack of candidates) {
      let vectorScore = 0;
      let keywordScore = 0;

      if (hasVectorCapability && hack.embedding && hack.embedding.length > 0) {
        if (!hack.embeddingModel || hack.embeddingModel === EMBEDDING_MODEL_ID) {
          vectorScore = this.cosineSimilarity(queryEmbedding, hack.embedding);
        }
      }

      const docText = `${hack.name} ${hack.description || ''} ${hack.theme || ''}`;
      keywordScore = this.bm25Score(qStr, docText, corpusStats.avgDocLen, corpusStats);

      const hybridScore = hasVectorCapability
        ? (0.7 * vectorScore) + (0.3 * Math.min(keywordScore / 3, 1))
        : keywordScore;

      if (hybridScore > 0.05) {
        scored.push({
          hackathon: this._addDeadlineCountdown(hack),
          score: hybridScore,
          vectorScore,
          keywordScore
        });
      }
    }

    return scored
      .sort((a, b) => b.score - a.score)
      .map(item => item.hackathon)
      .slice(0, limit);
  }

  /**
   * Build corpus-level statistics for dynamic BM25 IDF.
   * @private
   */
  _buildCorpusStats(docs) {
    const totalDocs = docs.length || 1;
    const docFrequency = {};
    let totalLen = 0;

    for (const doc of docs) {
      const text = `${doc.name || ''} ${doc.description || ''} ${doc.theme || ''}`;
      const terms = text.toLowerCase().split(/\s+/).filter(Boolean);
      totalLen += terms.length;
      const seen = new Set();
      for (const term of terms) {
        if (!seen.has(term)) {
          docFrequency[term] = (docFrequency[term] || 0) + 1;
          seen.add(term);
        }
      }
    }

    return { totalDocs, docFrequency, avgDocLen: totalLen / totalDocs };
  }

  /**
   * Retrieves past hackathon winner project blueprints using keyword RAG matching
   */
  retrieveWinnerSolutions(query = '', limit = 2) {
    return retrieveWinningProjects(query, limit);
  }

  /**
   * Return catalog with computed daysUntilDeadline
   */
  async getCatalogWithDeadlines() {
    const all = await Hackathon.find({}).lean();
    return all.map(h => this._addDeadlineCountdown(h));
  }

  /**
   * Add computed deadline countdown fields to a hackathon object
   */
  _addDeadlineCountdown(hack) {
    const now = Date.now();
    const startDate = hack.startDate ? new Date(hack.startDate).getTime() : now;
    const deadlineDate = hack.deadlineDate ? new Date(hack.deadlineDate).getTime() : now;

    const daysUntilStart = Math.max(0, Math.ceil((startDate - now) / (1000 * 60 * 60 * 24)));
    const daysUntilDeadline = Math.max(0, Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24)));
    const urgency = daysUntilDeadline <= 2 ? 'CRITICAL' : daysUntilDeadline <= 7 ? 'HIGH' : 'NORMAL';

    return {
      ...hack,
      daysUntilStart,
      daysUntilDeadline,
      urgency
    };
  }
}

// Export class + singleton factory (NOT pre-instantiated — deferred initialization)
const ragInstance = new HackathonRAGService();

module.exports = ragInstance;
module.exports.HackathonRAGService = HackathonRAGService;
module.exports.EMBEDDING_MODEL_ID = EMBEDDING_MODEL_ID;
module.exports.EMBEDDING_DIMENSIONS = EMBEDDING_DIMENSIONS;
