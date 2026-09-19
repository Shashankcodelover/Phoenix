const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

// Enterprise Career Governance & Batch Ingestion Engine
class PhoenixCareerGovernanceEngine {
  constructor() {
    this.candidates = [];
    this.pyqs = [];
    this.blueprints = [];
    this.resetToBenchmark();
  }

  resetToBenchmark() {
    this.candidates = [
      { id: 'cand-001', name: 'Preetham J', email: 'preetham@university.edu', cgpa: 8.55, targetRole: 'Full Stack Engineer', verified: true },
      { id: 'cand-002', name: 'Shashank J', email: 'shashank@apex-candidate.dev', cgpa: 8.95, targetRole: 'Google L4 Systems', verified: true },
      { id: 'cand-003', name: 'Elena Rostova', email: 'elena@quantum-grid.io', cgpa: 9.10, targetRole: 'Lead Security Architect', verified: true }
    ];
    this.pyqs = [
      { id: 'PYQ-GOOG-01', company: 'Google', title: 'Design a Distributed Rate Limiter', difficulty: 'Hard' },
      { id: 'PYQ-AMZN-02', company: 'Amazon', title: 'Warehouse Route Scheduling', difficulty: 'Hard' }
    ];
    this.blueprints = [
      { id: 'HACK-01', title: 'NexusVoice AI', track: 'Frontier AI', prize: '$5,000' }
    ];
  }

  getTelemetry() {
    return {
      totalCandidates: this.candidates.length,
      totalPyqs: this.pyqs.length,
      totalBlueprints: this.blueprints.length,
      storageBytesEstimate: JSON.stringify({ c: this.candidates, p: this.pyqs, b: this.blueprints }).length * 2,
      systemHealth: this.candidates.length > 0 ? 'OPTIMAL' : 'PURGED'
    };
  }

  ingestBatch(entityType, format, payload) {
    if (!payload || typeof payload !== 'string' || !payload.trim()) {
      throw new Error('Payload cannot be empty');
    }

    let records = [];
    if (format === 'json') {
      try {
        const parsed = JSON.parse(payload);
        if (!Array.isArray(parsed)) throw new Error('JSON payload must be an array');
        records = parsed;
      } catch (err) {
        return { success: false, importedCount: 0, errors: [err.message] };
      }
    } else if (format === 'csv') {
      const lines = payload.trim().split(/\r?\n/).filter(l => l.trim().length > 0);
      if (lines.length < 2) {
        return { success: false, importedCount: 0, errors: ['CSV must have header and at least 1 record'] };
      }
      const parseRow = (line) => {
        const matches = [];
        let inQuotes = false;
        let cur = '';
        for (let j = 0; j < line.length; j++) {
          const char = line[j];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            matches.push(cur.trim().replace(/^"|"$/g, ''));
            cur = '';
          } else {
            cur += char;
          }
        }
        matches.push(cur.trim().replace(/^"|"$/g, ''));
        return matches;
      };

      const headers = parseRow(lines[0]);
      for (let i = 1; i < lines.length; i++) {
        const cols = parseRow(lines[i]);
        const row = {};
        headers.forEach((h, idx) => row[h] = cols[idx] !== undefined ? cols[idx] : '');
        records.push(row);
      }
    } else {
      throw new Error(`Unsupported format "${format}"`);
    }

    const errors = [];
    let imported = 0;

    records.forEach((rec, idx) => {
      if (!rec.id && !rec.name && !rec.title) {
        errors.push(`Row ${idx + 1}: Missing identifier or required title`);
        return;
      }
      if (entityType === 'candidates') {
        const existingIdx = this.candidates.findIndex(c => (rec.id && c.id === rec.id) || (rec.email && c.email === rec.email));
        if (existingIdx !== -1) {
          this.candidates[existingIdx] = { ...this.candidates[existingIdx], ...rec };
        } else {
          this.candidates.push({ id: rec.id || `cand_${Date.now()}_${idx}`, ...rec });
        }
        imported++;
      } else if (entityType === 'pyqs') {
        this.pyqs.push(rec);
        imported++;
      } else if (entityType === 'blueprints') {
        this.blueprints.push(rec);
        imported++;
      }
    });

    return {
      success: errors.length === 0,
      importedCount: imported,
      errors
    };
  }

  exportSnapshot() {
    return {
      version: '29.0.0',
      exportedAt: new Date().toISOString(),
      platform: 'Phoenix Autonomous Career & Placement OS',
      payload: {
        candidates: [...this.candidates],
        pyqs: [...this.pyqs],
        blueprints: [...this.blueprints]
      }
    };
  }

  importSnapshot(snapshot) {
    if (!snapshot || !snapshot.payload) {
      throw new Error('Invalid snapshot bundle structure');
    }
    this.candidates = snapshot.payload.candidates || [];
    this.pyqs = snapshot.payload.pyqs || [];
    this.blueprints = snapshot.payload.blueprints || [];
    return { success: true, totalEntities: this.candidates.length + this.pyqs.length + this.blueprints.length };
  }

  universalPurge(safetyPhrase) {
    if (safetyPhrase !== 'PURGE PHOENIX CAREER STORE') {
      throw new Error('Invalid safety confirmation phrase. Exact match required.');
    }
    const count = this.candidates.length + this.pyqs.length + this.blueprints.length;
    this.candidates = [];
    this.pyqs = [];
    this.blueprints = [];
    return { success: true, purgedCount: count };
  }
}

describe('Project Phoenix Enterprise Career Data Governance & Batch Ingestion Tests', () => {
  let engine;

  beforeEach(() => {
    engine = new PhoenixCareerGovernanceEngine();
  });

  test('1. Initializes default benchmark profiles and calculates telemetry', () => {
    const tel = engine.getTelemetry();
    assert.strictEqual(tel.totalCandidates, 3);
    assert.strictEqual(tel.totalPyqs, 2);
    assert.strictEqual(tel.totalBlueprints, 1);
    assert.ok(tel.storageBytesEstimate > 0);
    assert.strictEqual(tel.systemHealth, 'OPTIMAL');
  });

  test('2. Batch Ingestion accepts RFC 4180 CSV for candidates and deduplicates', () => {
    const csv = [
      'id,name,email,cgpa,targetRole',
      'cand-001,"Preetham J, Lead",preetham@university.edu,8.55,"Principal Distributed Systems"',
      'cand-004,Satya Nadella,satya@microsoft.com,9.8,"Chief Executive Engineer"'
    ].join('\n');

    const result = engine.ingestBatch('candidates', 'csv', csv);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.importedCount, 2);
    assert.strictEqual(engine.candidates.length, 4); // 1 updated, 1 added

    const updated = engine.candidates.find(c => c.id === 'cand-001');
    assert.strictEqual(updated.name, 'Preetham J, Lead');
  });

  test('3. Batch Ingestion accepts Strict JSON array for PYQ questions', () => {
    const jsonPayload = JSON.stringify([
      { id: 'PYQ-META-01', company: 'Meta', title: 'Distributed Memcached Scaling', difficulty: 'Hard' },
      { id: 'PYQ-APPL-02', company: 'Apple', title: 'Low Power BLE Buffer Ingestion', difficulty: 'Medium' }
    ]);

    const result = engine.ingestBatch('pyqs', 'json', jsonPayload);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.importedCount, 2);
    assert.strictEqual(engine.pyqs.length, 4);
  });

  test('4. Batch Ingestion rejects malformed records and reports errors', () => {
    const malformedCsv = [
      'id,name',
      ',',
      'cand-valid,Valid User'
    ].join('\n');

    const result = engine.ingestBatch('candidates', 'csv', malformedCsv);
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.importedCount, 1);
    assert.strictEqual(result.errors.length, 1);
  });

  test('5. Snapshot Export and Import maintains data fidelity', () => {
    const snapshot = engine.exportSnapshot();
    assert.ok(snapshot.exportedAt);
    assert.strictEqual(snapshot.version, '29.0.0');

    // Mutate state
    engine.candidates.pop();
    assert.strictEqual(engine.candidates.length, 2);

    // Restore
    const restoreRes = engine.importSnapshot(snapshot);
    assert.strictEqual(restoreRes.success, true);
    assert.strictEqual(engine.candidates.length, 3);
  });

  test('6. Universal Purge requires exact phrase and cleanly wipes store', () => {
    assert.throws(() => {
      engine.universalPurge('WRONG PHRASE');
    }, /Invalid safety confirmation phrase/);

    const purgeRes = engine.universalPurge('PURGE PHOENIX CAREER STORE');
    assert.strictEqual(purgeRes.success, true);
    assert.strictEqual(purgeRes.purgedCount, 6);

    const tel = engine.getTelemetry();
    assert.strictEqual(tel.totalCandidates, 0);
    assert.strictEqual(tel.systemHealth, 'PURGED');
  });

  test('7. Benchmark Factory Restore brings back sovereign profiles', () => {
    engine.universalPurge('PURGE PHOENIX CAREER STORE');
    assert.strictEqual(engine.candidates.length, 0);

    engine.resetToBenchmark();
    assert.strictEqual(engine.candidates.length, 3);
    assert.strictEqual(engine.candidates[0].name, 'Preetham J');
  });
});
