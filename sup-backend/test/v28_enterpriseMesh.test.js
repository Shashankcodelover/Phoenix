const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert');
const { PhoenixTopologyService } = require('../sup-backend/modules/phoenixTopologyService');

describe('Project Phoenix Enterprise Arena Topology & Governance Mesh', () => {
  let service;

  beforeEach(() => {
    service = new PhoenixTopologyService();
  });

  test('1. Initializes 8 enterprise arena nodes and 6 default interop corridors', () => {
    const nodes = service.getNodes();
    const corridors = service.getCorridors();

    assert.strictEqual(nodes.length, 8, 'Should have exactly 8 enterprise arena nodes');
    assert.strictEqual(corridors.length, 6, 'Should have 6 default interop corridors');

    const horizon = service.getNode('NODE-HORIZON');
    assert.ok(horizon, 'NODE-HORIZON must exist');
    assert.strictEqual(horizon.name, 'Horizon Career Pathways');

    const chaos = service.getNode('NODE-CHAOS');
    assert.ok(chaos, 'NODE-CHAOS must exist');
    assert.strictEqual(chaos.tier, 'Mission-Critical');
  });

  test('2. Live telemetry calculation reflects accurate career pipeline aggregates', () => {
    const telemetry = service.getTelemetry();

    assert.strictEqual(telemetry.governedNodes, 8);
    assert.strictEqual(telemetry.activeCorridors, 6);
    assert.strictEqual(telemetry.totalCorridors, 6);
    assert.ok(telemetry.pipelineSecurityIntegrity >= 99, 'Pipeline integrity must be >= 99%');
    assert.ok(telemetry.interArenaLatencySLA.includes('Sub-20ms SLA'));
    assert.ok(telemetry.totalEvaluations.includes('Candidates Evaluated'));
    assert.strictEqual(telemetry.systemHealth, 'OPTIMAL');
  });

  test('3. Can provision new interop corridor between valid arena nodes', () => {
    const newCorr = service.addCorridor({
      id: 'CORR-PHX-TEST',
      source: 'NODE-CHAOS',
      target: 'NODE-JUDGE',
      protocol: 'PQC-Channel',
      bandwidth: '50 Gbps',
      latency: 5,
      description: 'Chaos resilience telemetry streamed directly into judging engine'
    });

    assert.strictEqual(newCorr.id, 'CORR-PHX-TEST');
    assert.strictEqual(newCorr.status, 'CONNECTED');
    assert.strictEqual(service.getCorridors().length, 7);

    const telemetry = service.getTelemetry();
    assert.strictEqual(telemetry.activeCorridors, 7);
  });

  test('4. Provisioning rejects non-existent arena nodes or self-referential links', () => {
    assert.throws(() => {
      service.addCorridor({
        id: 'CORR-FAIL-1',
        source: 'NODE-NONEXISTENT',
        target: 'NODE-HORIZON'
      });
    }, /Source arena node NODE-NONEXISTENT does not exist/);

    assert.throws(() => {
      service.addCorridor({
        id: 'CORR-FAIL-2',
        source: 'NODE-HORIZON',
        target: 'NODE-HORIZON'
      });
    }, /cannot be the same arena node/);
  });

  test('5. 1-Click Sever control marks corridor severed and degrades integrity', () => {
    const severed = service.severCorridor('CORR-PHX-01');
    assert.strictEqual(severed.status, 'SEVERED');
    assert.strictEqual(severed.integrityScore, 0.0);

    const telemetry = service.getTelemetry();
    assert.strictEqual(telemetry.activeCorridors, 5);
    assert.strictEqual(telemetry.totalCorridors, 6);
    assert.strictEqual(telemetry.systemHealth, 'ATTENTION_REQUIRED');
  });

  test('6. 1-Click Restore control restores corridor connectivity and integrity', () => {
    service.severCorridor('CORR-PHX-01');
    const restored = service.restoreCorridor('CORR-PHX-01');
    assert.strictEqual(restored.status, 'CONNECTED');
    assert.strictEqual(restored.integrityScore, 0.998);

    const telemetry = service.getTelemetry();
    assert.strictEqual(telemetry.activeCorridors, 6);
    assert.strictEqual(telemetry.systemHealth, 'OPTIMAL');
  });

  test('7. 1-Click Drop corridor removes corridor from mesh', () => {
    const res = service.deleteCorridor('CORR-PHX-02');
    assert.strictEqual(res.success, true);
    assert.strictEqual(service.getCorridor('CORR-PHX-02'), null);
    assert.strictEqual(service.getCorridors().length, 5);
  });

  test('8. Cascading deletion of arena node drops node AND all connected corridors', () => {
    // NODE-JUDGE is connected to CORR-PHX-03
    const res = service.deleteNode('NODE-JUDGE');
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.deletedNode.id, 'NODE-JUDGE');
    assert.strictEqual(res.droppedCount, 1);

    const droppedIds = res.droppedCorridors.map(c => c.id);
    assert.ok(droppedIds.includes('CORR-PHX-03'));

    assert.strictEqual(service.getNode('NODE-JUDGE'), null);
    assert.strictEqual(service.getCorridor('CORR-PHX-03'), null);
    assert.strictEqual(service.getCorridors().length, 5);
  });

  test('9. Batch Ingestion supports RFC 4180 CSV with quotes, commas, and trims', () => {
    const csvData = [
      'id,name,tier,category,status,sla,latency,version,evaluations',
      'NODE-SYNTHEDGE,"SynthEdge Arena, Inc.",Enterprise Flagship,AI Testing / Mock,ACTIVE,99.99%,12,v1.0.0,3200',
      'NODE-QUANTUMARENA,"Quantum Arena Grid, Global",Mission-Critical,Security / Grid,ACTIVE,99.999%,5,v2.0.0,5100'
    ].join('\n');

    const result = service.ingestBatch('nodes', 'csv', csvData);
    assert.strictEqual(result.importedCount, 2);
    assert.strictEqual(result.errors.length, 0);

    const synth = service.getNode('NODE-SYNTHEDGE');
    assert.ok(synth);
    assert.strictEqual(synth.name, 'SynthEdge Arena, Inc.');
    assert.strictEqual(service.getNodes().length, 10);
  });

  test('10. Batch Ingestion supports strict JSON payload for corridors', () => {
    const jsonData = JSON.stringify([
      {
        id: 'CORR-INGEST-01',
        source: 'NODE-HORIZON',
        target: 'NODE-WHITEBOARD',
        protocol: 'mTLS-gRPC',
        bandwidth: '100 Gbps',
        latency: 3,
        description: 'Direct high-throughput interactive student whiteboard sync'
      }
    ]);

    const result = service.ingestBatch('corridors', 'json', jsonData);
    assert.strictEqual(result.importedCount, 1);
    assert.strictEqual(result.errors.length, 0);

    const corr = service.getCorridor('CORR-INGEST-01');
    assert.ok(corr);
    assert.strictEqual(corr.bandwidth, '100 Gbps');
  });

  test('11. Batch Ingestion rejects corrupt records and reports detailed errors', () => {
    const corruptCsv = [
      'id,source,target',
      'CORR-VALID,NODE-HORIZON,NODE-PLACEMENT',
      'CORR-INVALID,NODE-NONEXISTENT,NODE-PLACEMENT',
      ',NODE-HORIZON,NODE-PLACEMENT'
    ].join('\n');

    const result = service.ingestBatch('corridors', 'csv', corruptCsv);
    assert.strictEqual(result.importedCount, 1);
    assert.strictEqual(result.errors.length, 2);
    assert.ok(result.errors[0].includes('NODE-NONEXISTENT does not exist'));
  });

  test('12. Universal Purge requires safety confirmation phrase and wipes all entities', () => {
    assert.throws(() => {
      service.universalPurge('WRONG-PHRASE');
    }, /Invalid safety confirmation phrase/);

    const purgeResult = service.universalPurge('PURGE-ALL-PHOENIX-ENTITIES');
    assert.strictEqual(purgeResult.success, true);
    assert.strictEqual(purgeResult.purgedNodes, 8);
    assert.strictEqual(purgeResult.purgedCorridors, 6);

    assert.strictEqual(service.getNodes().length, 0);
    assert.strictEqual(service.getCorridors().length, 0);

    const telemetry = service.getTelemetry();
    assert.strictEqual(telemetry.governedNodes, 0);
    assert.strictEqual(telemetry.activeCorridors, 0);
  });

  test('13. Reset topology restores 8 arena nodes and 6 corridors to factory state', () => {
    service.universalPurge('PURGE-ALL-PHOENIX-ENTITIES');
    service.resetTopology();

    assert.strictEqual(service.getNodes().length, 8);
    assert.strictEqual(service.getCorridors().length, 6);
    const telemetry = service.getTelemetry();
    assert.strictEqual(telemetry.systemHealth, 'OPTIMAL');
  });
});
