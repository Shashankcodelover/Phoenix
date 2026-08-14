const { describe, it } = require('node:test');
const assert = require('node:assert');

const {
  isSafePublicUrl,
  dispatchWebhookEvent,
  generateSignature,
  getWebhookLogs
} = require('../modules/webhooks/webhookDispatcher');

describe('V24 Security Hardening: Ethical Audit Loophole Verifications', () => {

  describe('SEC-02: SSRF Guard on Outbound Webhooks', () => {
    it('blocks AWS/GCP cloud metadata IP (169.254.169.254)', () => {
      assert.strictEqual(isSafePublicUrl('http://169.254.169.254/latest/meta-data'), false);
    });

    it('blocks localhost and loopback IPv4/IPv6 addresses', () => {
      assert.strictEqual(isSafePublicUrl('http://127.0.0.1:8080/internal-admin'), false);
      assert.strictEqual(isSafePublicUrl('http://localhost:5000/api/keys'), false);
    });

    it('blocks private RFC-1918 subnets (10.x, 192.168.x, 172.16-31.x)', () => {
      assert.strictEqual(isSafePublicUrl('http://10.0.0.5:9200/_search'), false);
      assert.strictEqual(isSafePublicUrl('http://192.168.1.100/config'), false);
      assert.strictEqual(isSafePublicUrl('http://172.20.0.2:6379'), false);
    });

    it('allows valid public HTTPS listener endpoints', () => {
      assert.strictEqual(isSafePublicUrl('https://api.github.com/webhooks/events'), true);
      assert.strictEqual(isSafePublicUrl('https://hooks.slack.com/services/T00/B00/X00'), true);
    });

    it('rejects SSRF attempt via dispatchWebhookEvent gracefully without server crash', () => {
      const result = dispatchWebhookEvent({
        eventType: 'TEST_EVENT',
        payload: { attempt: 'exfiltrate' },
        targetUrl: 'http://169.254.169.254/latest/user-data'
      });

      assert.strictEqual(result.success, false);
      assert.ok(result.error.includes('SSRF_VIOLATION'));
    });
  });

  describe('SEC-03: HMAC SHA-256 Cryptographic Signing', () => {
    it('generates consistent 64-char hex signature for identical payload', () => {
      const payload = JSON.stringify({ event: 'MOCK_COMPLETED', score: 98 });
      const sig1 = generateSignature(payload, 'custom_secret_key_123');
      const sig2 = generateSignature(payload, 'custom_secret_key_123');
      assert.strictEqual(sig1, sig2);
      assert.strictEqual(sig1.length, 64);
    });

    it('dispatches valid public event and logs delivery audit', () => {
      const result = dispatchWebhookEvent({
        eventType: 'INTERVIEW_COMPLETED',
        payload: { candidateId: 'cand_882', status: 'STRONG_HIRE' },
        targetUrl: 'https://api.phoenix-prep.com/webhooks/listener'
      });

      assert.strictEqual(result.success, true);
      assert.strictEqual(result.status, 'DELIVERED');
      assert.ok(result.signature.length === 64);
      assert.ok(getWebhookLogs().length > 0);
    });
  });

});
