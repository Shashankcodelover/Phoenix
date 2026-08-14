const { describe, it } = require('node:test');
const assert = require('node:assert');

const { LldScaffoldEngine, LLD_TEMPLATES } = require('../modules/interview-prep/lldScaffoldEngine');

describe('V24 Quality Focus: Feature 37 — Low-Level System Design (LLD) Scaffold Engine', () => {
  const engine = new LldScaffoldEngine();

  it('generates production-grade Parking Lot LLD scaffold with Strategy and Factory patterns', () => {
    const report = engine.generateScaffold({ problemKey: 'parking-lot', language: 'TypeScript' });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.problemKey, 'parking-lot');
    assert.ok(report.problemName.includes('Parking Lot'));
    assert.ok(report.designPatterns.some(p => p.includes('Strategy')));
    assert.ok(report.solidPrinciplesApplied.some(s => s.includes('Single Responsibility')));
    assert.ok(report.coreClasses.includes('ParkingLot'));
    assert.ok(report.codeSnippet.includes('PricingStrategy'));
  });

  it('generates Splitwise expense splitting scaffold with composite and observer patterns', () => {
    const report = engine.generateScaffold({ problemKey: 'splitwise', language: 'TypeScript' });

    assert.strictEqual(report.success, true);
    assert.ok(report.problemName.includes('Splitwise'));
    assert.ok(report.codeSnippet.includes('EqualSplit'));
  });
});
