const { describe, it } = require('node:test');
const assert = require('node:assert');

const { SqlOptimizerEngine } = require('../modules/interview-prep/sqlOptimizerEngine');

describe('V24 Quality Focus: Feature 52 — SQL Query Optimizer & Index Tuning Engine', () => {
  const engine = new SqlOptimizerEngine();

  it('transforms Seq Scan on 10M rows into B-Tree Index Scan with 17,640x speedup', () => {
    const report = engine.optimizeQuery({
      sqlQuery: 'SELECT user_id, email, status FROM users WHERE created_at >= NOW() - INTERVAL 7 DAY AND status = "ACTIVE";',
      tableSizeRows: 10000000
    });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.unoptimizedExecutionPlan.nodeType.includes('Seq Scan'), true);
    assert.strictEqual(report.optimizedExecutionPlan.speedupFactor, '17,640x');
    assert.ok(report.optimizedExecutionPlan.indexDefinition.includes('idx_users_status_created_at'));
    assert.ok(report.optimizedExecutionPlan.indexDefinition.includes('INCLUDE'));
    assert.strictEqual(report.tuningRuleBreakdown.length, 3);
  });
});
