const { describe, it } = require('node:test');
const assert = require('node:assert');

const { WinningRepoDecompilerEngine } = require('../modules/hackathon-agent/winningRepoDecompilerEngine');

describe('V26 Feature 37: Hackathon Hall of Fame & Winning Repo Decompiler', () => {
  const engine = new WinningRepoDecompilerEngine();

  it('retrieves Hall of Fame grand prize winning repository presets', () => {
    const presets = engine.getPresets();
    assert.ok(Array.isArray(presets), 'Presets is an array');
    assert.ok(presets.length >= 5, 'Has at least 5 top winning presets');

    const ids = presets.map(p => p.id);
    assert.ok(ids.includes('neurovoice-ai'), 'Includes NeuroVoice AI HackMIT champion');
    assert.ok(ids.includes('medichain-zk'), 'Includes MediChain ZK ETHDenver winner');
    assert.ok(ids.includes('ecofleet-autonomous'), 'Includes EcoFleet CalHacks winner');
    assert.ok(ids.includes('guardianmesh-p2p'), 'Includes GuardianMesh TreeHacks winner');
    assert.ok(ids.includes('sih-agroshield-ai'), 'Includes SIH AgroShield Grand Finale champion');
  });

  it('retrieves exact repository anatomy and secret sauce for a preset', () => {
    const repo = engine.getRepoDetails('neurovoice-ai');
    assert.strictEqual(repo.id, 'neurovoice-ai');
    assert.strictEqual(repo.archetype, 'REALTIME_STREAMING_AGENT');
    assert.ok(repo.demoHook.threeSecondHook.includes('waveform'));
    assert.ok(repo.demoHook.judgeDefenseMoat.includes('WebAssembly'));
    assert.ok(repo.winningPatterns.length >= 2);
    assert.strictEqual(repo.winningPatterns[0].title, 'Zero-Copy Audio Worklet Buffer Chunker');
    assert.ok(repo.stealThisBlueprint.length >= 3);
  });

  it('decompiles repository and returns 5-axis archetype score and actionable blueprint', () => {
    const audit = engine.decompileRepo('guardianmesh-p2p');
    assert.strictEqual(audit.success, true);
    assert.ok(audit.auditId.startsWith('DECOMP-'));
    assert.strictEqual(audit.repository.id, 'guardianmesh-p2p');
    assert.strictEqual(audit.repository.archetypeScores.compositeScore, 99.0);
    assert.strictEqual(audit.repository.archetypeScores.demoHook, 100);
    assert.ok(audit.decompilerInsights.primarySecretSauce.includes('CRDTs'));
    assert.ok(audit.decompilerInsights.sponsorSynergies.length >= 2);
  });

  it('decompiles custom repo URL dynamically with intelligent heuristic scoring', () => {
    const audit = engine.decompileRepo('https://github.com/myteam/hackathon-agent-v1', {
      targetHackathon: 'Google AI Hackathon 2026',
      category: 'Autonomous Multi-Agent Swarm'
    });

    assert.strictEqual(audit.success, true);
    assert.ok(audit.repository.id.startsWith('custom-'));
    assert.ok(audit.repository.name.includes('hackathon-agent-v1'));
    assert.strictEqual(audit.repository.hackathon, 'Google AI Hackathon 2026');
    assert.ok(audit.repository.archetypeScores.compositeScore >= 90);
    assert.ok(audit.repository.winningPatterns.length >= 1);
  });

  it('performs head-to-head comparison between two winning repositories', () => {
    const comp = engine.compareRepos('neurovoice-ai', 'sih-agroshield-ai');
    assert.strictEqual(comp.success, true);
    assert.ok(comp.comparison.repoA);
    assert.ok(comp.comparison.repoB);
    assert.ok(comp.comparison.higherPodiumProbability);
    assert.ok(comp.comparison.synergyAdvice.includes('Combine'));
  });
});
