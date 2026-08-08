/**
 * Phoenix V21: Real Vector RAG Service
 * Implements Google GenAI embeddings and in-memory cosine similarity search.
 */

const { retrieveWinningProjects } = require('./hackathonWinnersData');
const Hackathon = require('../../models/hackathonModel');
const { GoogleGenerativeAI } = require('@google/generative-ai');

class HackathonRAGService {
  constructor() {
    this.genAI = null;
    this.embeddingModel = null;
    
    // Initialize Gemini only if API key is present
    if (process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.startsWith('your-')) {
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      this.embeddingModel = this.genAI.getGenerativeModel({ model: "text-embedding-004" });
    }
  }

  /**
   * Helper to compute cosine similarity between two vectors
   */
  cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Generates a 768-dim embedding array using Gemini API
   */
  async generateEmbedding(text) {
    if (!this.embeddingModel) return [];
    try {
      const result = await this.embeddingModel.embedContent(text);
      return result.embedding.values;
    } catch (err) {
      console.warn('[RAG] Failed to generate embedding:', err.message);
      return [];
    }
  }

  /**
   * Index a fresh scraped hackathon into the DB with embeddings
   */
  async indexHackathon(hackathon) {
    if (!hackathon || !hackathon.name) return;
    
    // Generate combined text for embedding
    const textToEmbed = `${hackathon.name}. ${hackathon.description} Theme: ${hackathon.theme}. Rules: ${hackathon.rules}.`;
    const embedding = await this.generateEmbedding(textToEmbed);

    const doc = await Hackathon.findOneAndUpdate(
      { name: hackathon.name }, // Use name as unique identifier for upsert
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
        embedding: embedding
      },
      { upsert: true, new: true }
    );
    console.log(`[RAG Service] Indexed to DB: ${doc.name}`);
  }

  /**
   * Retrieves top N hackathons using Vector Cosine Similarity
   */
  async retrieveHackathons(query = '', limit = 3) {
    const qStr = typeof query === 'string' ? query : '';
    
    // Fetch all active hackathons from MongoDB
    let allHackathons = await Hackathon.find({ status: 'Active' }).lean();

    if (!qStr || !this.embeddingModel) {
      // Fallback: just return latest if no query or no API key
      return allHackathons.map(h => this._addDeadlineCountdown(h)).slice(0, limit);
    }

    // 1. Generate embedding for user query
    const queryEmbedding = await this.generateEmbedding(qStr);

    if (queryEmbedding.length === 0) {
      // Fallback if embedding failed
      return allHackathons.map(h => this._addDeadlineCountdown(h)).slice(0, limit);
    }

    // 2. Perform Cosine Similarity against all documents
    const scored = allHackathons.map(hack => {
      let score = 0;
      if (hack.embedding && hack.embedding.length > 0) {
        score = this.cosineSimilarity(queryEmbedding, hack.embedding);
      }
      return { hackathon: this._addDeadlineCountdown(hack), score };
    });

    // 3. Sort by similarity score
    return scored
      .filter(item => item.score > 0.3) // Similarity Threshold
      .sort((a, b) => b.score - a.score)
      .map(item => item.hackathon)
      .slice(0, limit);
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

// Global single instance
const ragInstance = new HackathonRAGService();

module.exports = ragInstance;
