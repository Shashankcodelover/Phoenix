const { describe, it } = require('node:test');
const assert = require('node:assert');

const { LiveWhiteboardSimulator } = require('../modules/interview-prep/liveWhiteboardSimulator');

describe('V24 Quality Focus: Feature 3 — Live System Design Whiteboard & Chaos Failure Simulator', () => {
  const simulator = new LiveWhiteboardSimulator();

  it('retrieves system design topology templates with redundant nodes', () => {
    const templates = simulator.getTemplates();
    assert.ok(templates.length >= 2);
    assert.strictEqual(templates[0].id, 'video_cdn');
    assert.ok(templates[0].nodes.length >= 5);
  });

  it('simulates 100,000 RPS traffic surge and evaluates low-latency SLA profile', () => {
    const simResult = simulator.simulateChaos({
      templateId: 'video_cdn',
      rpsTraffic: 100000,
      injectedFailure: null
    });

    assert.strictEqual(simResult.success, true);
    assert.strictEqual(simResult.evaluatedRPS, 100000);
    assert.strictEqual(simResult.availabilitySLA, '99.99%');
    assert.strictEqual(simResult.spofVulnerabilities.length, 0);
    assert.ok(simResult.latencyProfile.p50.includes('ms'));
    assert.ok(simResult.architectureGrade.includes('Tier-1'));
  });

  it('executes Chaos Engineering node failure on redundant database and asserts graceful failover', () => {
    const chaosReport = simulator.simulateChaos({
      templateId: 'video_cdn',
      rpsTraffic: 50000,
      injectedFailure: 'primary_db' // CockroachDB redundancy=3
    });

    assert.strictEqual(chaosReport.success, true);
    assert.ok(chaosReport.availabilitySLA.includes('99.95'));
    assert.ok(chaosReport.chaosSimulationSummary.includes('CHAOS EVENT'));
    assert.ok(chaosReport.chaosSimulationSummary.includes('failover in 210ms'));
  });

  it('detects SPOF when single-instance compute or cache fails without redundancy', () => {
    const spofReport = simulator.simulateChaos({
      templateId: 'custom',
      customNodes: [
        { id: 'app_single', type: 'AppServer', label: 'Single Monolith Instance', redundancy: 1 }
      ],
      rpsTraffic: 25000,
      injectedFailure: 'app_single'
    });

    assert.strictEqual(spofReport.availabilitySLA, '0.00%');
    assert.strictEqual(spofReport.droppedRequestsRate, '100.00%');
    assert.ok(spofReport.chaosSimulationSummary.includes('CRITICAL OUTAGE'));
    assert.ok(spofReport.spofVulnerabilities.length >= 2);
  });
});
