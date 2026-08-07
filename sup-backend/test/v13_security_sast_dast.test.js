const test = require('node:test');
const assert = require('node:assert/strict');

// 1. Token Bucket Rate Limiter
const { TokenBucket, createTokenBucketLimiter, clearBucketStore } = require('../middleware/tokenBucketRateLimiter');

// 2. SAST Security Scanner
const { scanCodeForVulnerabilities } = require('../modules/security/sastSecurityScanner');

// 3. Reasoning Integrity Engine
const { evaluateCodeTypingIntegrity } = require('../modules/interview-prep/reasoningIntegrityEngine');

// 4. Mentor Webhook Relay
const { submitMentorQuestion, getDispatchedQuestions, generateWebhookSignature } = require('../modules/horizon/mentorWebhookRelay');

// 5. Scholarship Predictor
const { predictScholarshipEligibility } = require('../modules/horizon/scholarshipEngine');

// 6. Resource Search Engine
const { searchLearningResources } = require('../modules/horizon/resourceSearchEngine');

// ═══════════════════════════════════════════════════════════
// TOKEN BUCKET RATE LIMITER TESTS
// ═══════════════════════════════════════════════════════════

test('Token Bucket permits allowed request volume and throttles burst overflow', () => {
  const bucket = new TokenBucket({ capacity: 3, refillRatePerSec: 1 });
  assert.equal(bucket.consume(1).allowed, true);
  assert.equal(bucket.consume(1).allowed, true);
  assert.equal(bucket.consume(1).allowed, true);
  
  const overflow = bucket.consume(1);
  assert.equal(overflow.allowed, false);
  assert.ok(overflow.retryAfterSec >= 1);
});

test('Token Bucket Middleware attaches RFC rate limit headers and 429 status', () => {
  clearBucketStore();
  const middleware = createTokenBucketLimiter({ capacity: 2, refillRatePerSec: 1, keyPrefix: 'test_ip' });

  const mockReq = { ip: '192.168.1.100', headers: {} };
  const mockRes = {
    headers: {},
    statusCode: 200,
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; }
  };

  let nextCalled = false;
  middleware(mockReq, mockRes, () => { nextCalled = true; });
  assert.equal(nextCalled, true);
  assert.equal(mockRes.headers['X-RateLimit-Limit'], 2);

  // Consume 2nd token
  nextCalled = false;
  middleware(mockReq, mockRes, () => { nextCalled = true; });
  assert.equal(nextCalled, true);

  // 3rd request should fail with 429
  nextCalled = false;
  middleware(mockReq, mockRes, () => { nextCalled = true; });
  assert.equal(nextCalled, false);
  assert.equal(mockRes.statusCode, 429);
  assert.equal(mockRes.body.error, 'Too Many Requests');
});

// ═══════════════════════════════════════════════════════════
// SAST SECURITY SCANNER TESTS
// ═══════════════════════════════════════════════════════════

test('SAST Scanner detects dynamic code execution (eval/Function)', () => {
  const insecureCode = `
    const userCode = "console.log('hi')";
    eval(userCode);
  `;
  const report = scanCodeForVulnerabilities(insecureCode, 'test_eval.js');
  assert.equal(report.success, true);
  assert.equal(report.isSecure, false);
  assert.ok(report.findings.some(f => f.ruleId === 'SAST-001'));
});

test('SAST Scanner detects Prototype Pollution and hardcoded API keys', () => {
  const payload = {
    code: 'obj.__proto__.admin = true;',
    config: 'const api_key = "AIzaSyD123456789012345678901234567890";'
  };
  const report = scanCodeForVulnerabilities(payload, 'config.json');
  assert.equal(report.isSecure, false);
  assert.ok(report.findings.some(f => f.ruleId === 'SAST-002'));
  assert.ok(report.findings.some(f => f.ruleId === 'SAST-005'));
});

test('SAST Scanner approves safe clean code', () => {
  const cleanCode = `
    function add(a, b) {
      return a + b;
    }
    module.exports = { add };
  `;
  const report = scanCodeForVulnerabilities(cleanCode, 'clean.js');
  assert.equal(report.isSecure, true);
  assert.equal(report.totalFindings, 0);
});

// ═══════════════════════════════════════════════════════════
// CODE PLAYBACK & TYPING INTEGRITY ENGINE TESTS
// ═══════════════════════════════════════════════════════════

test('Integrity Engine flags bulk paste and instant code injection', () => {
  const result = evaluateCodeTypingIntegrity({
    codeSubmission: 'function solve() { return Array.from({length: 100}).map((_, i) => i * 2); }',
    pasteCount: 5,
    totalDurationSeconds: 2
  });

  assert.equal(result.success, true);
  assert.ok(result.integrityScore < 60);
  assert.equal(result.verdict, 'HIGH_CHEATING_PROBABILITY');
  assert.ok(result.anomalies.length >= 2);
  assert.ok(result.probingQuestions.length > 0);
});

test('Integrity Engine scores organic human typing highly', () => {
  const keypresses = Array.from({ length: 20 }, (_, i) => ({ timestamp: i * 150 + Math.random() * 50 }));
  const result = evaluateCodeTypingIntegrity({
    codeSubmission: 'let x = 10; let y = 20;',
    keypressEvents: keypresses,
    pasteCount: 0,
    totalDurationSeconds: 45
  });

  assert.equal(result.success, true);
  assert.equal(result.integrityScore, 100);
  assert.equal(result.verdict, 'GENUINE_HUMAN');
});

// ═══════════════════════════════════════════════════════════
// MENTOR WEBHOOK RELAY TESTS
// ═══════════════════════════════════════════════════════════

test('Mentor Webhook Relay signs payload with HMAC-SHA256 and queues question', () => {
  const res = submitMentorQuestion({
    studentId: 'std_101',
    studentName: 'Rahul Kumar',
    stage: '2nd_pu',
    mentorId: 'm_ananya_google',
    questionText: 'How did you prepare for Google interview during your 3rd year?'
  });

  assert.equal(res.success, true);
  assert.ok(res.record.signature.length > 30);
  assert.equal(res.record.status, 'QUEUED_FOR_MENTOR');

  const history = getDispatchedQuestions({ mentorId: 'm_ananya_google' });
  assert.ok(history.count >= 1);
});

// ═══════════════════════════════════════════════════════════
// SCHOLARSHIP PREDICTOR TESTS
// ═══════════════════════════════════════════════════════════

test('Scholarship Predictor identifies SNQ 95% tuition fee waiver for low income high rank', () => {
  const res = predictScholarshipEligibility({
    academicStage: '2nd_pu',
    familyIncomeLakhs: 2.0,
    entranceRank: 4500,
    isFemale: true
  });

  assert.equal(res.success, true);
  assert.ok(res.eligibleCount >= 2);
  assert.ok(res.eligibleSchemes.some(s => s.schemeId === 'snq_quota'));
});

// ═══════════════════════════════════════════════════════════
// RESOURCE SEARCH ENGINE TESTS
// ═══════════════════════════════════════════════════════════

test('Resource Search Engine filters free learning resources by query and stream', () => {
  const res = searchLearningResources({ query: 'CS50', freeOnly: true });
  assert.equal(res.success, true);
  assert.ok(res.count >= 1);
  assert.ok(res.resources[0].title.includes('CS50'));
});
