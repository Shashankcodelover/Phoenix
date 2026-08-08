const test = require('node:test');
const assert = require('node:assert/strict');

// 1. Token Bucket Rate Limiter
const { TokenBucket, createTokenBucketLimiter, clearBucketStore } = require('../middleware/tokenBucketRateLimiter');

// 2. SAST Security Scanner & Middleware Guard
const { scanCodeForVulnerabilities } = require('../modules/security/sastSecurityScanner');
const { sastPayloadGuard } = require('../middleware/sastPayloadGuard');

// 3. Reasoning Integrity Engine
const { evaluateCodeTypingIntegrity } = require('../modules/interview-prep/reasoningIntegrityEngine');

// 4. Mentor Webhook Relay
const { submitMentorQuestion, getDispatchedQuestions, generateWebhookSignature } = require('../modules/horizon/mentorWebhookRelay');

// 5. Scholarship Predictor
const { predictScholarshipEligibility } = require('../modules/horizon/scholarshipEngine');

// 6. Resource Search Engine
const { searchLearningResources } = require('../modules/horizon/resourceSearchEngine');

// 7. WebRTC Peer Signaling & Code Sandbox
const { handlePeerSignalingOffer, handlePeerSignalingAnswer, handleIceCandidate, createOrMatchPeerRoom } = require('../modules/interview-prep/peerMatchEngine');
const { executeInSandbox } = require('../modules/interview-prep/codeSandboxEngine');

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
// SAST SECURITY SCANNER & PAYLOAD GUARD TESTS
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

test('SAST Payload Guard Middleware blocks malicious request payloads', () => {
  const mockReq = { method: 'POST', path: '/api/v1/horizon/security/scan', body: { codeSnippet: 'eval("alert(1)")' } };
  const mockRes = {
    statusCode: 200,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; }
  };
  let nextCalled = false;
  sastPayloadGuard(mockReq, mockRes, () => { nextCalled = true; });
  assert.equal(nextCalled, false);
  assert.equal(mockRes.statusCode, 400);
  assert.equal(mockRes.body.error, 'Security Audit Violation');
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

// ═══════════════════════════════════════════════════════════
// WEBRTC SIGNALING & ISOLATED SANDBOX TESTS
// ═══════════════════════════════════════════════════════════

test.skip('Peer Match Engine handles WebRTC SDP offer, answer, and ICE candidate signaling', () => {
  const user1 = { userId: 'u1', name: 'Alice' };
  const user2 = { userId: 'u2', name: 'Bob' };
  
  createOrMatchPeerRoom(user1);
  const matchResult = createOrMatchPeerRoom(user2);
  assert.equal(matchResult.status, 'MATCHED');

  const roomId = matchResult.roomId;
  const offerRes = handlePeerSignalingOffer(roomId, 'u1', { sdp: 'v=0...' });
  assert.equal(offerRes.success, true);

  const answerRes = handlePeerSignalingAnswer(roomId, 'u2', { sdp: 'v=0...' });
  assert.equal(answerRes.success, true);

  const iceRes = handleIceCandidate(roomId, 'u1', { candidate: 'candidate:1...' });
  assert.equal(iceRes.success, true);
  assert.equal(iceRes.count, 1);
});

test.skip('Code Sandbox Engine executes JavaScript in isolated child_process context', async () => {
  const code = `
    function solution(a, b) {
      console.log('Computing sum...');
      return a + b;
    }
  `;
  const result = await executeInSandbox(code, [10, 20]);
  assert.equal(result.success, true);
  assert.equal(result.result, 30);
  assert.ok(result.logs.includes('Computing sum...'));
});
