/**
 * Phoenix V16: Deep Coaching & Infrastructure Hardening Tests
 *
 * Tests:
 *   - Pattern Recognition Engine
 *   - Negotiation Simulator
 *   - Pacing Coach
 *   - Depth Prober (input validation)
 *   - Answer Comparison Engine
 *   - RAG Service: cosine overflow guard, dynamic BM25 IDF, corpus stats
 *   - Server: rate limiter counter-based sliding window
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

// ═══════════════════════════════════════════
// 1. Pattern Recognition Engine
// ═══════════════════════════════════════════

describe('Interview Pattern Recognition Engine', () => {
  const { analyzeInterviewPatterns } = require('../modules/interview-prep/patternRecognitionEngine');

  it('rejects input with fewer than 2 sessions', () => {
    const result = analyzeInterviewPatterns({ sessions: [{ scores: { technical: 80 } }] });
    assert.strictEqual(result.success, false);
  });

  it('detects declining trend when second half scores are lower', () => {
    const sessions = [
      { scores: { technical: 90, behavioral: 80, systemDesign: 85, communication: 75 } },
      { scores: { technical: 85, behavioral: 78, systemDesign: 82, communication: 73 } },
      { scores: { technical: 60, behavioral: 55, systemDesign: 50, communication: 45 } },
      { scores: { technical: 55, behavioral: 50, systemDesign: 48, communication: 40 } }
    ];
    const result = analyzeInterviewPatterns({ sessions });
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.trends.technical.trend, 'DECLINING');
    assert.ok(result.weakAreas.length > 0);
  });

  it('detects improving trend when second half scores are higher', () => {
    const sessions = [
      { scores: { technical: 50, behavioral: 40, systemDesign: 45, communication: 50 } },
      { scores: { technical: 55, behavioral: 45, systemDesign: 48, communication: 55 } },
      { scores: { technical: 80, behavioral: 75, systemDesign: 78, communication: 82 } },
      { scores: { technical: 90, behavioral: 85, systemDesign: 88, communication: 90 } }
    ];
    const result = analyzeInterviewPatterns({ sessions });
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.trends.technical.trend, 'IMPROVING');
  });
  it('rejects malformed sessions without valid scores objects', () => {
    const result = analyzeInterviewPatterns({ sessions: [null, { invalid: true }, 'string'] });
    assert.strictEqual(result.success, false);
    assert.match(result.error, /At least 2 valid session records/);
  });
});

// ═══════════════════════════════════════════
// 2. Negotiation Simulator
// ═══════════════════════════════════════════

describe('Negotiation Simulator Engine', () => {
  const { evaluateNegotiation } = require('../modules/interview-prep/negotiationEngine');

  it('rejects short negotiation responses', async () => {
    const result = await evaluateNegotiation({ candidateResponse: 'No thanks.' });
    assert.strictEqual(result.success, false);
  });

  it('rejects responses exceeding 5000 chars', async () => {
    const result = await evaluateNegotiation({ candidateResponse: 'a'.repeat(5001) });
    assert.strictEqual(result.success, false);
  });
});

// ═══════════════════════════════════════════
// 3. Pacing Coach Engine
// ═══════════════════════════════════════════

describe('Interview Pacing Coach', () => {
  const { analyzePacing, OPTIMAL_DURATIONS } = require('../modules/interview-prep/pacingCoachEngine');

  it('rejects empty answer list', () => {
    const result = analyzePacing({ answers: [] });
    assert.strictEqual(result.success, false);
  });

  it('filters out non-object answers and rejects if none valid', () => {
    const result = analyzePacing({ answers: [null, 123, 'invalid'] });
    assert.strictEqual(result.success, false);
    assert.match(result.error, /No valid answer objects provided/);
  });

  it('detects too-fast answers for behavioral questions', () => {
    const result = analyzePacing({
      answers: [{ questionType: 'BEHAVIORAL', durationSeconds: 15, wordCount: 30 }]
    });
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.results[0].assessment, 'TOO_FAST');
    assert.ok(result.results[0].pacingScore < 70);
  });

  it('scores optimal-duration answers highly', () => {
    const result = analyzePacing({
      answers: [{ questionType: 'BEHAVIORAL', durationSeconds: 120, wordCount: 200 }]
    });
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.results[0].assessment, 'OPTIMAL');
    assert.ok(result.results[0].pacingScore >= 90);
  });

  it('exports known optimal duration constants', () => {
    assert.ok(OPTIMAL_DURATIONS.BEHAVIORAL);
    assert.ok(OPTIMAL_DURATIONS.SYSTEM_DESIGN);
  });
});

// ═══════════════════════════════════════════
// 4. Technical Depth Prober (Input Validation)
// ═══════════════════════════════════════════

describe('Technical Depth Prober Input Validation', () => {
  const { generateDepthProbe } = require('../modules/interview-prep/depthProberEngine');

  it('rejects short answers', async () => {
    const result = await generateDepthProbe({ candidateAnswer: 'Redis.' });
    assert.strictEqual(result.success, false);
  });

  it('rejects answers exceeding 8000 chars', async () => {
    const result = await generateDepthProbe({ candidateAnswer: 'x'.repeat(8001) });
    assert.strictEqual(result.success, false);
  });
});

// ═══════════════════════════════════════════
// 5. Answer Comparison Engine
// ═══════════════════════════════════════════

describe('Answer Comparison Engine', () => {
  const { compareAnswers } = require('../modules/interview-prep/answerComparisonEngine');

  it('rejects short original answers', () => {
    const result = compareAnswers({ originalAnswer: 'Hi', improvedAnswer: 'This is a much longer improved answer with detail.' });
    assert.strictEqual(result.success, false);
  });

  it('rejects answers exceeding 10000 chars', () => {
    const result = compareAnswers({ originalAnswer: 'a'.repeat(10001), improvedAnswer: 'Valid improved answer that is long enough.' });
    assert.strictEqual(result.success, false);
    assert.match(result.error, /under 10000 characters/);
  });

  it('correctly splits words using whitespace regex without double escape bug', () => {
    const sample = 'This is a sentence with seven words';
    const result = compareAnswers({ originalAnswer: sample, improvedAnswer: sample });
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.original.wordCount, 7);
  });

  it('detects improvement when quantified results are added', () => {
    const original = 'I worked on a project to improve the system performance at my company during the last quarter.';
    const improved = 'I led a project that reduced API latency by 40% and increased throughput by 3x, serving 2 million users daily. I built the caching layer with Redis and deployed it to production.';
    const result = compareAnswers({ originalAnswer: original, improvedAnswer: improved });
    assert.strictEqual(result.success, true);
    assert.ok(result.improved.score > result.original.score);
    assert.ok(result.delta > 0);
  });
});

// ═══════════════════════════════════════════
// 6. RAG Service: Cosine Overflow & Dynamic BM25
// ═══════════════════════════════════════════

describe('RAG Service Hardened Algorithms', () => {
  const { HackathonRAGService } = require('../modules/hackathon-agent/rag_service');
  const rag = new HackathonRAGService();

  it('cosine similarity handles very large vectors without NaN/Infinity', () => {
    const large = new Array(768).fill(1e150);
    const result = rag.cosineSimilarity(large, large);
    assert.ok(Number.isFinite(result), `Expected finite, got ${result}`);
    assert.ok(result >= -1 && result <= 1, `Expected [-1,1], got ${result}`);
  });

  it('cosine similarity handles zero vectors gracefully', () => {
    const zero = new Array(768).fill(0);
    const nonZero = new Array(768).fill(1);
    assert.strictEqual(rag.cosineSimilarity(zero, nonZero), 0);
    assert.strictEqual(rag.cosineSimilarity(zero, zero), 0);
  });

  it('cosine similarity returns 1 for identical normalized vectors', () => {
    const vec = new Array(768).fill(0).map((_, i) => Math.sin(i));
    const result = rag.cosineSimilarity(vec, vec);
    assert.ok(Math.abs(result - 1) < 0.001, `Expected ~1, got ${result}`);
  });

  it('BM25 with dynamic IDF ranks rare terms higher than common ones', () => {
    const corpusStats = {
      totalDocs: 100,
      docFrequency: { 'the': 95, 'kubernetes': 3 },
      avgDocLen: 50
    };
    const scoreCommon = rag.bm25Score('the', 'the the the document', 50, corpusStats);
    const scoreRare = rag.bm25Score('kubernetes', 'kubernetes deployment guide', 50, corpusStats);
    assert.ok(scoreRare > scoreCommon, `Rare term score (${scoreRare}) should exceed common term score (${scoreCommon})`);
  });

  it('_buildCorpusStats computes correct document frequencies', () => {
    const docs = [
      { name: 'AI Hackathon', description: 'Build with AI', theme: 'AI' },
      { name: 'Web Hackathon', description: 'Build web apps', theme: 'Web' },
      { name: 'AI Challenge', description: 'AI and ML competition', theme: 'AI' }
    ];
    const stats = rag._buildCorpusStats(docs);
    assert.strictEqual(stats.totalDocs, 3);
    assert.ok(stats.docFrequency['ai'] >= 2);
    assert.ok(stats.avgDocLen > 0);
  });
});

// ═══════════════════════════════════════════
// 7. Compensation Benchmark Engine
// ═══════════════════════════════════════════

describe('Compensation Benchmarking Engine', () => {
  const { getCompensationBenchmark } = require('../modules/interview-prep/compBenchmarkingEngine');

  it('computes location adjusted compensation for software_engineer in US SF', () => {
    const result = getCompensationBenchmark({ roleKey: 'software_engineer', locationKey: 'us_sf_ny' });
    assert.strictEqual(result.locationMultiplier, 1.0);
    assert.strictEqual(result.baseSalary.median, 135000);
    assert.strictEqual(result.annualEquity.median, 30000);
    assert.strictEqual(result.estimatedTotalCompensationMedian, 165000);
  });

  it('computes location adjusted compensation for India location multiplier', () => {
    const result = getCompensationBenchmark({ roleKey: 'software_engineer', locationKey: 'india_tech' });
    assert.strictEqual(result.locationMultiplier, 0.35);
    assert.strictEqual(result.baseSalary.median, Math.round(135000 * 0.35));
    assert.ok(result.negotiationTips.length > 0);
  });
});
