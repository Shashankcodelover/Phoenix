/**
 * Phoenix v19: AST Complexity, Multi-Agent Panel, Canvas Topology & IRT Test Suite
 * ===============================================================================
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

// ═══════════════════════════════════════════
// 1. AST Complexity & Runtime Inspector
// ═══════════════════════════════════════════

describe('AST Complexity & Algorithmic Runtime Inspector (v19)', () => {
  const { analyzeCodeComplexity } = require('../modules/interview-prep/astComplexityEngine');

  it('rejects empty or non-string code payloads', () => {
    const result = analyzeCodeComplexity({ code: '' });
    assert.strictEqual(result.success, false);
    assert.ok(result.error);
  });

  it('detects nested loops as O(N^2) time complexity', () => {
    const code = `
      function twoSum(nums, target) {
        for (let i = 0; i < nums.length; i++) {
          for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] === target) return [i, j];
          }
        }
        return [];
      }
    `;

    const result = analyzeCodeComplexity({ code, language: 'javascript' });
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.metrics.estimatedTimeComplexity, 'O(N^2)');
    assert.strictEqual(result.metrics.maxLoopNestingDepth, 2);
  });

  it('detects single loop with Map as O(N) time and O(N) space complexity', () => {
    const code = `
      function twoSumOptimal(nums, target) {
        const map = new Map();
        for (let i = 0; i < nums.length; i++) {
          const comp = target - nums[i];
          if (map.has(comp)) return [map.get(comp), i];
          map.set(nums[i], i);
        }
        return [];
      }
    `;

    const result = analyzeCodeComplexity({ code, language: 'javascript' });
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.metrics.estimatedTimeComplexity, 'O(N)');
    assert.strictEqual(result.metrics.isOptimal, true);
  });
});

// ═══════════════════════════════════════════
// 2. Multi-Agent AI Interview Panel Simulator
// ═══════════════════════════════════════════

describe('Multi-Agent AI Interview Panel Simulator (v19)', () => {
  const { evaluatePanelConsensus } = require('../modules/interview-prep/multiAgentPanelEngine');

  it('rejects answers shorter than 20 characters', () => {
    const result = evaluatePanelConsensus({ candidateAnswer: 'short answer' });
    assert.strictEqual(result.success, false);
  });

  it('evaluates comprehensive architectural response across all 3 personas', () => {
    const answer = 'We designed a distributed microservice cluster using Redis caching and Kafka message queues. We implemented circuit breaker fallbacks to prevent cascading database failure, and measured a 45% reduction in p99 latency which we delivered ahead of schedule with the team.';

    const result = evaluatePanelConsensus({
      question: 'Design a high-throughput messaging feed.',
      candidateAnswer: answer,
      roundType: 'SYSTEM_DESIGN'
    });

    assert.strictEqual(result.success, true);
    assert.ok(result.compositeScore >= 75);
    assert.ok(result.consensusVerdict === 'HIRE' || result.consensusVerdict === 'STRONG_HIRE');
    assert.strictEqual(result.panelVotes.length, 3);
  });
});

// ═══════════════════════════════════════════
// 3. System Design Canvas Graph & Topology Validator
// ═══════════════════════════════════════════

describe('System Design Canvas Graph & Topology Validator (v19)', () => {
  const { validateArchitectureTopology } = require('../modules/interview-prep/canvasTopologyEngine');

  it('detects direct client-to-database vulnerability as CRITICAL', () => {
    const graph = {
      nodes: [
        { id: 'n1', type: 'CLIENT_BROWSER', label: 'Web Client' },
        { id: 'n2', type: 'POSTGRES_DATABASE', label: 'Main DB' }
      ],
      edges: [
        { from: 'n1', to: 'n2', protocol: 'TCP' }
      ]
    };

    const result = validateArchitectureTopology(graph);
    assert.strictEqual(result.success, true);
    assert.ok(result.issues.some(i => i.severity === 'CRITICAL'));
  });

  it('detects circular dependency deadlocks in microservice graph', () => {
    const graph = {
      nodes: [
        { id: 'n1', type: 'SERVICE_AUTH', label: 'Auth Service' },
        { id: 'n2', type: 'SERVICE_USER', label: 'User Service' }
      ],
      edges: [
        { from: 'n1', to: 'n2', protocol: 'HTTP' },
        { from: 'n2', to: 'n1', protocol: 'HTTP' }
      ]
    };

    const result = validateArchitectureTopology(graph);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.hasCircularDependency, true);
  });
});

// ═══════════════════════════════════════════
// 4. Adaptive Item Response Theory (IRT) Engine
// ═══════════════════════════════════════════

describe('Adaptive IRT Question Recommendation Engine (v19)', () => {
  const { IRTAdaptiveEngine } = require('../modules/interview-prep/irtAdaptiveEngine');

  it('increases candidate theta ability estimate after answering hard question correctly', () => {
    const engine = new IRTAdaptiveEngine();
    const result = engine.updateAbility(0.0, true, { beta: 1.5, alpha: 1.2 });

    assert.strictEqual(result.success, true);
    assert.ok(result.updatedTheta > 0.0, 'Theta should increase after correct answer');
    assert.ok(result.percentileRank > 50);
  });

  it('selects the most informative question maximizing Fisher Information', () => {
    const engine = new IRTAdaptiveEngine();
    const pool = [
      { id: 'q1', difficultyRating: -2.0, discrimination: 1.0, title: 'Easy Array Sum' },
      { id: 'q2', difficultyRating: 0.1, discrimination: 1.5, title: 'Medium LRU Cache' },
      { id: 'q3', difficultyRating: 2.5, discrimination: 1.0, title: 'Hard Distributed Consensus' }
    ];

    const selected = engine.selectNextQuestion(0.0, pool);
    assert.strictEqual(selected.question.id, 'q2', 'Should pick question closest to Theta (0.0) with high discrimination');
  });
});
