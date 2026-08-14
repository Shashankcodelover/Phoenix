const { describe, it } = require('node:test');
const assert = require('node:assert');

const { EventDrivenOutboxEngine } = require('../modules/interview-prep/eventDrivenOutboxEngine');

describe('V25 Enterprise Tier: Feature 65 — Event-Driven Transactional Outbox Engine', () => {
  const engine = new EventDrivenOutboxEngine();

  it('simulates atomic outbox persistence and verifies network crash CDC recovery', () => {
    const report = engine.simulateOutboxRelay({
      idempotencyKey: 'idem_key_payment_991827',
      aggregateType: 'ORDER_PAYMENT',
      transactionAmountUsd: 250.00,
      simulateNetworkFailureAfterDbCommit: true
    });

    assert.strictEqual(report.success, true);
    assert.ok(report.transactionalPhase.atomicDbTransaction.includes('COMMITTED'));
    assert.ok(report.cdcRelayPhase.dualWriteMitigationResult.includes('0 message loss'));
    assert.ok(report.productionSqlSchema.includes('CREATE TABLE outbox_events'));
  });
});
