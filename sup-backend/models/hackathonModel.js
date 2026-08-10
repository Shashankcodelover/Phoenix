const mongoose = require('mongoose');

const hackathonSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    theme: { type: String },
    rules: { type: String },
    status: { type: String, default: 'Active' },
    platform: { type: String },
    startDate: { type: Date, required: true },
    deadlineDate: { type: Date, required: true },
    logo: { type: String },
    hostingLink: { type: String, trim: true },
    // Vector Embeddings for Semantic RAG Search (using 768 dims for Gemini text-embedding-004)
    embedding: { type: [Number], default: [] },
    // Embedding model version — used to prevent cross-model score pollution
    embeddingModel: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Hackathon', hackathonSchema);