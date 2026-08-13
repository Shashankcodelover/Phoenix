const { describe, it } = require('node:test');
const assert = require('node:assert');

const { AstComplexityProfiler } = require('../modules/interview-prep/astComplexityProfiler');

describe('V24 Quality Focus: Feature 13 — Live AST Complexity & Big-O Real-Time Code Profiler', () => {
  const profiler = new AstComplexityProfiler();

  it('profiles optimal O(N) Hash Map Two-Sum and awards Tier-1 FAANG Optimal grade', () => {
    const report = profiler.profileCode({
      language: 'javascript',
      sourceCode: `
        function twoSum(nums, target) {
          const map = new Map();
          for (let i = 0; i < nums.length; i++) {
            const comp = target - nums[i];
            if (map.has(comp)) return [map.get(comp), i];
            map.set(nums[i], i);
          }
          return [];
        }
      `
    });

    assert.strictEqual(report.success, true);
    assert.strictEqual(report.metrics.timeComplexity, 'O(N)');
    assert.strictEqual(report.metrics.spaceComplexity, 'O(N)');
    assert.strictEqual(report.metrics.isOptimal, true);
    assert.strictEqual(report.faangReadinessGrade, 'Tier-1 FAANG Optimal (Top 5%)');
  });

  it('detects nested loops O(N²) and flags optimization recommendation', () => {
    const report = profiler.profileCode({
      language: 'javascript',
      sourceCode: `
        function bruteForceDuplicates(arr) {
          for (let i = 0; i < arr.length; i++) {
            for (let j = i + 1; j < arr.length; j++) {
              if (arr[i] === arr[j]) return true;
            }
          }
          return false;
        }
      `
    });

    assert.strictEqual(report.metrics.timeComplexity, 'O(N²)');
    assert.strictEqual(report.metrics.isOptimal, false);
    assert.ok(report.optimizations.some(opt => opt.includes('nested loop O(N²)')));
  });
});
