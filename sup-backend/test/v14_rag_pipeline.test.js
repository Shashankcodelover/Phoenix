/**
 * Phoenix V14: RAG Pipeline Integration Tests
 * 
 * Tests:
 *   - Cosine similarity numerical stability (REJECTION #3)
 *   - BM25 keyword scoring
 *   - Hybrid search ranking
 *   - RAG service deferred initialization (REJECTION #2)
 *   - Embedding model versioning
 *   - Speech analysis engine
 *   - STAR evaluator input validation
 *   - Resume interview generator input validation
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

// ═══════════════════════════════════════════
// 1. Cosine Similarity Tests (REJECTION #3)
// ═══════════════════════════════════════════

describe('Cosine Similarity (Numerically Stable)', () => {
  const { HackathonRAGService } = require('../modules/hackathon-agent/rag_service');
  const rag = new HackathonRAGService();

  it('returns 1.0 for identical vectors', () => {
    const vec = [0.5, 0.3, 0.8, 0.1, 0.9];
    const score = rag.cosineSimilarity(vec, vec);
    assert.ok(Math.abs(score - 1.0) < 0.0001, `Expected ~1.0, got ${score}`);
  });

  it('returns 0 for orthogonal vectors', () => {
    const a = [1, 0, 0];
    const b = [0, 1, 0];
    const score = rag.cosineSimilarity(a, b);
    assert.strictEqual(score, 0);
  });

  it('returns 0 for zero-magnitude vectors (no NaN)', () => {
    const zero = [0, 0, 0, 0];
    const vec = [1, 2, 3, 4];
    const score = rag.cosineSimilarity(zero, vec);
    assert.strictEqual(score, 0);
    assert.ok(!isNaN(score), 'Must not return NaN');
  });

  it('returns 0 for mismatched dimensions', () => {
    const a = [1, 2, 3];
    const b = [1, 2];
    assert.strictEqual(rag.cosineSimilarity(a, b), 0);
  });

  it('returns 0 for null/undefined inputs', () => {
    assert.strictEqual(rag.cosineSimilarity(null, [1, 2]), 0);
    assert.strictEqual(rag.cosineSimilarity([1, 2], undefined), 0);
    assert.strictEqual(rag.cosineSimilarity(null, null), 0);
  });

  it('handles high-dimensional vectors (768-dim) without underflow', () => {
    // Generate two random 768-dim vectors with small magnitudes
    const dim = 768;
    const vecA = Array.from({ length: dim }, () => (Math.random() - 0.5) * 0.001);
    const vecB = Array.from({ length: dim }, () => (Math.random() - 0.5) * 0.001);
    
    const score = rag.cosineSimilarity(vecA, vecB);
    assert.ok(!isNaN(score), 'Must not return NaN for small-magnitude 768-dim vectors');
    assert.ok(typeof score === 'number', 'Must return a number');
    assert.ok(score >= -1.01 && score <= 1.01, `Score ${score} out of [-1, 1] range`);
  });

  it('returns negative for opposing vectors', () => {
    const a = [1, 0, 0];
    const b = [-1, 0, 0];
    const score = rag.cosineSimilarity(a, b);
    assert.ok(score < 0, `Expected negative, got ${score}`);
  });
});

// ═══════════════════════════════════════════
// 2. BM25 Keyword Scoring Tests
// ═══════════════════════════════════════════

describe('BM25 Keyword Scoring', () => {
  const { HackathonRAGService } = require('../modules/hackathon-agent/rag_service');
  const rag = new HackathonRAGService();

  it('scores > 0 for matching keywords', () => {
    const score = rag.bm25Score('AI hackathon', 'This is an AI-powered hackathon event');
    assert.ok(score > 0, `Expected positive score, got ${score}`);
  });

  it('scores 0 for no matching keywords', () => {
    const score = rag.bm25Score('blockchain crypto', 'This is a cooking recipe website');
    assert.strictEqual(score, 0);
  });

  it('scores 0 for empty inputs', () => {
    assert.strictEqual(rag.bm25Score('', 'some document'), 0);
    assert.strictEqual(rag.bm25Score('query', ''), 0);
    assert.strictEqual(rag.bm25Score('', ''), 0);
  });

  it('ranks more relevant documents higher', () => {
    const query = 'machine learning AI hackathon';
    const docA = 'Join our machine learning AI hackathon this weekend';
    const docB = 'Annual cooking competition event this weekend';
    
    const scoreA = rag.bm25Score(query, docA);
    const scoreB = rag.bm25Score(query, docB);
    assert.ok(scoreA > scoreB, `docA (${scoreA}) should score higher than docB (${scoreB})`);
  });
});

// ═══════════════════════════════════════════
// 3. RAG Service Deferred Init (REJECTION #2)
// ═══════════════════════════════════════════

describe('RAG Service Deferred Initialization', () => {
  const { HackathonRAGService } = require('../modules/hackathon-agent/rag_service');

  it('starts uninitialized', () => {
    const rag = new HackathonRAGService();
    assert.strictEqual(rag.initialized, false);
    assert.strictEqual(rag.genAI, null);
    assert.strictEqual(rag.embeddingModel, null);
  });

  it('initialize() sets initialized to true even without API key', async () => {
    const rag = new HackathonRAGService();
    // No GEMINI_API_KEY set — should gracefully fall back
    const originalKey = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;
    
    await rag.initialize();
    assert.strictEqual(rag.initialized, true);
    assert.strictEqual(rag.genAI, null); // No API key → no AI client
    
    // Restore
    if (originalKey) process.env.GEMINI_API_KEY = originalKey;
  });

  it('generateEmbedding returns empty array when not initialized with AI', async () => {
    const rag = new HackathonRAGService();
    await rag.initialize(); // Without API key
    const embedding = await rag.generateEmbedding('test text');
    assert.deepStrictEqual(embedding, []);
  });
});

// ═══════════════════════════════════════════
// 4. Embedding Model Versioning
// ═══════════════════════════════════════════

describe('Embedding Model Versioning', () => {
  const { EMBEDDING_MODEL_ID, EMBEDDING_DIMENSIONS } = require('../modules/hackathon-agent/rag_service');

  it('exports EMBEDDING_MODEL_ID as a non-empty string', () => {
    assert.ok(typeof EMBEDDING_MODEL_ID === 'string');
    assert.ok(EMBEDDING_MODEL_ID.length > 0);
  });

  it('exports EMBEDDING_DIMENSIONS as 768', () => {
    assert.strictEqual(EMBEDDING_DIMENSIONS, 768);
  });
});

// ═══════════════════════════════════════════
// 5. Speech Analysis Engine Tests
// ═══════════════════════════════════════════

describe('Speech Analysis Engine', () => {
  const { analyzeSpeech } = require('../modules/interview-prep/speechAnalysisEngine');

  it('rejects empty/short transcripts', () => {
    const result = analyzeSpeech({ transcript: '' });
    assert.strictEqual(result.success, false);
  });

  it('detects filler words in transcript', () => {
    const result = analyzeSpeech({
      transcript: 'Um, basically, I like, you know, implemented a system that was um basically a microservice architecture. I think it was like really good actually.',
      questionType: 'TECHNICAL'
    });
    assert.strictEqual(result.success, true);
    assert.ok(result.scores.fillerWords.totalCount > 0, 'Should detect filler words');
    assert.ok(result.scores.fillerWords.score < 80, 'Filler score should be penalized');
  });

  it('detects STAR compliance for behavioral answers', () => {
    const goodSTAR = `In my previous role at Google, we had a situation where our deployment pipeline was failing 30% of the time. 
    My task was to identify the root cause and implement a fix. 
    I analyzed the CI/CD logs, identified a race condition in our integration tests, and implemented a retry mechanism with exponential backoff. 
    The result was that deployment failures reduced from 30% to 2%, saving the team approximately 15 hours per week.`;
    
    const result = analyzeSpeech({
      transcript: goodSTAR,
      questionType: 'BEHAVIORAL'
    });
    
    assert.strictEqual(result.success, true);
    assert.ok(result.scores.starCompliance.coverage >= 50, `STAR coverage should be >= 50%, got ${result.scores.starCompliance.coverage}%`);
  });

  it('calculates WPM when duration is provided', () => {
    const result = analyzeSpeech({
      transcript: 'This is a test transcript with enough words to calculate the speaking pace.',
      durationSeconds: 5
    });
    assert.ok(result.scores.speakingPace.wordsPerMinute > 0, 'WPM should be calculated');
  });

  it('generates coaching tips for poor responses', () => {
    const result = analyzeSpeech({
      transcript: 'Um, I think maybe I sort of did something.',
      questionType: 'BEHAVIORAL'
    });
    assert.ok(result.coachingTips.length > 0, 'Should generate coaching tips');
  });

  it('provides overall grade', () => {
    const result = analyzeSpeech({
      transcript: 'I implemented a distributed caching layer using Redis that reduced API response times by 40% across 12 microservices, handling 50,000 requests per second at peak load.',
      questionType: 'TECHNICAL'
    });
    assert.ok(['EXCELLENT', 'GOOD', 'NEEDS_IMPROVEMENT', 'POOR'].includes(result.grade));
  });
});

// ═══════════════════════════════════════════
// 6. STAR Evaluator Input Validation
// ═══════════════════════════════════════════

describe('STAR Evaluator Input Validation', () => {
  const { evaluateSTAR } = require('../modules/interview-prep/starEvaluator');

  it('rejects empty answers', async () => {
    const result = await evaluateSTAR({ question: 'Tell me about a challenge', answer: '' });
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.totalScore, 0);
  });

  it('rejects missing question', async () => {
    const result = await evaluateSTAR({ question: '', answer: 'I once led a team of 5 engineers to deliver a project on time.' });
    assert.strictEqual(result.success, false);
  });

  it('rejects too-short answers', async () => {
    const result = await evaluateSTAR({ question: 'Tell me about a time...', answer: 'I did good work.' });
    assert.strictEqual(result.success, false);
  });
});

// ═══════════════════════════════════════════
// 7. Resume Interview Generator Input Validation
// ═══════════════════════════════════════════

describe('Resume Interview Generator Input Validation', () => {
  const { generateResumeInterviewQuestions } = require('../modules/interview-prep/resumeInterviewGenerator');

  it('rejects empty resume', async () => {
    const result = await generateResumeInterviewQuestions({ resumeText: '' });
    assert.strictEqual(result.success, false);
    assert.deepStrictEqual(result.questions, []);
  });

  it('rejects too-short resume', async () => {
    const result = await generateResumeInterviewQuestions({ resumeText: 'Short.' });
    assert.strictEqual(result.success, false);
  });
});
