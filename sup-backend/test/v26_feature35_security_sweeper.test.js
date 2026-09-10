const { describe, it } = require('node:test');
const assert = require('node:assert');

const { SecuritySweeperEngine } = require('../modules/hackathon-agent/securitySweeperEngine');

describe('V26 Feature 35: Codebase Security & Pre-Demo Vulnerability Sweeper', () => {
  const engine = new SecuritySweeperEngine();

  it('retrieves benchmark presets with vulnerable and hardened code examples', () => {
    const presets = engine.getPresets();
    assert.ok(presets.vulnerable, 'Vulnerable preset exists');
    assert.ok(presets.partial, 'Partial preset exists');
    assert.ok(presets.hardened, 'Hardened preset exists');

    assert.ok(presets.vulnerable.code.includes('exec('));
    assert.ok(presets.hardened.code.includes('spawn('));
  });

  it('audits vulnerable code snippet and flags all 5 critical threat classes', () => {
    const presets = engine.getPresets();
    const result = engine.sweepCodebase({ code: presets.vulnerable.code });

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.isCleared, false);
    assert.ok(result.securityScore <= 25, `Expected low score for vulnerable code, got ${result.securityScore}`);
    assert.ok(result.vulnerabilities.length >= 4, `Expected at least 4 vulnerabilities, got ${result.vulnerabilities.length}`);

    // Verify presence of specific vulnerability types
    const types = result.vulnerabilities.map(v => v.type);
    assert.ok(types.includes('EXPOSED_CREDENTIAL'));
    assert.ok(types.includes('COMMAND_INJECTION'));
    assert.ok(types.includes('SQL_INJECTION'));
    assert.ok(types.includes('PERMISSIVE_CORS'));
    assert.ok(types.includes('ARBITRARY_CODE_EXECUTION'));

    // Check certificate structure
    const cert = result.clearanceCertificate;
    assert.strictEqual(cert.status, 'ACTION_REQUIRED');
    assert.ok(cert.certId.startsWith('PHX-SEC-'));
    assert.ok(cert.sha256Checksum);
    assert.ok(result.patchedCode.length > 0);
  });

  it('verifies 100% clean clearance certificate on hardened production code', () => {
    const presets = engine.getPresets();
    const result = engine.sweepCodebase({ code: presets.hardened.code });

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.isCleared, true);
    assert.strictEqual(result.securityScore, 100);
    assert.strictEqual(result.vulnerabilities.length, 0);
    assert.strictEqual(result.clearanceCertificate.status, 'PASSED_CLEAN');
    assert.strictEqual(result.clearanceCertificate.rating, 'Institutional Grade');
  });
});
