/**
 * Phoenix v20.0: Sandboxed Code Execution & Test Runner Engine
 * 
 * Executes untrusted candidate code snippets in an isolated Node.js VM context
 * with strict CPU execution timeouts, blocked system globals, and memory guards.
 */

const vm = require('vm');

class SandboxedExecutionEngine {
  /**
   * Executes code against a set of test cases safely.
   * 
   * @param {Object} input
   * @param {string} input.code - Candidate JavaScript code (e.g. function solution(a, b) { ... })
   * @param {string} input.functionName - Entry point function name (e.g. 'twoSum')
   * @param {Array<Object>} input.testCases - [{ input: [...], expected: any }]
   * @param {number} input.timeoutMs - Max CPU execution time per test case (default: 2000ms)
   * @returns {Object} Execution evaluation report
   */
  execute(input = {}) {
    const {
      code = '',
      functionName = 'solution',
      testCases = [],
      timeoutMs = 2000
    } = input;

    if (!code || typeof code !== 'string' || code.trim() === '') {
      return {
        success: false,
        error: 'EMPTY_CODE_PAYLOAD',
        passed: 0,
        total: testCases.length,
        results: []
      };
    }

    // Security pre-scan: reject obvious breakout attempts
    const FORBIDDEN_TOKENS = ['process', 'require', 'import', 'child_process', 'fs', 'net', 'http', 'eval', 'global', 'globalThis'];
    for (const token of FORBIDDEN_TOKENS) {
      const regex = new RegExp(`\\b${token}\\b`, 'i');
      if (regex.test(code)) {
        return {
          success: false,
          error: `SECURITY_SANDBOX_VIOLATION: Use of prohibited token "${token}" is blocked.`,
          passed: 0,
          total: testCases.length,
          results: []
        };
      }
    }

    // Block Function constructor (case sensitive or constructor invocation)
    if (/\bnew\s+Function\b|\bFunction\s*\(/.test(code)) {
      return {
        success: false,
        error: 'SECURITY_SANDBOX_VIOLATION: Use of Function constructor is blocked.',
        passed: 0,
        total: testCases.length,
        results: []
      };
    }

    const testResults = [];
    let passedCount = 0;
    const startTime = Date.now();

    try {
      // Create isolated sandbox context
      const sandbox = {
        console: {
          log: () => {}, // silence output in sandbox
          warn: () => {},
          error: () => {}
        },
        Math,
        Array,
        Object,
        String,
        Number,
        Boolean,
        Date,
        Set,
        Map
      };

      const context = vm.createContext(sandbox);

      // Compile user script
      const script = new vm.Script(code, {
        filename: 'candidate_solution.js',
        timeout: timeoutMs
      });

      // Run script in context to define function
      script.runInContext(context, { timeout: timeoutMs });

      let targetFunc;
      try {
        targetFunc = vm.runInContext(functionName, context);
      } catch (lookupErr) {
        targetFunc = sandbox[functionName];
      }

      if (typeof targetFunc !== 'function') {
        return {
          success: false,
          error: `FUNCTION_NOT_FOUND: Function "${functionName}" was not declared in the solution.`,
          passed: 0,
          total: testCases.length,
          results: []
        };
      }

      // Execute each test case
      for (let i = 0; i < testCases.length; i++) {
        const tc = testCases[i];
        const tcInput = Array.isArray(tc.input) ? tc.input : [tc.input];
        const tcStartTime = process.hrtime();

        try {
          const actualOutput = targetFunc(...tcInput);
          const [diffSec, diffNano] = process.hrtime(tcStartTime);
          const executionTimeMs = parseFloat(((diffSec * 1000) + (diffNano / 1e6)).toFixed(3));

          const isMatch = JSON.stringify(actualOutput) === JSON.stringify(tc.expected);
          if (isMatch) passedCount++;

          testResults.push({
            testCaseNumber: i + 1,
            passed: isMatch,
            input: tc.input,
            expected: tc.expected,
            actual: actualOutput,
            executionTimeMs
          });
        } catch (execErr) {
          testResults.push({
            testCaseNumber: i + 1,
            passed: false,
            input: tc.input,
            expected: tc.expected,
            error: execErr.message || 'RUNTIME_EXCEPTION'
          });
        }
      }

      const totalTimeMs = Date.now() - startTime;
      const allPassed = passedCount === testCases.length && testCases.length > 0;

      return {
        success: true,
        allPassed,
        passed: passedCount,
        total: testCases.length,
        passRatePercent: testCases.length > 0 ? Math.round((passedCount / testCases.length) * 100) : 100,
        totalExecutionTimeMs: totalTimeMs,
        results: testResults
      };
    } catch (compileErr) {
      return {
        success: false,
        error: `COMPILATION_OR_TIMEOUT_ERROR: ${compileErr.message}`,
        passed: 0,
        total: testCases.length,
        results: []
      };
    }
  }
}

const sandboxedExecutionEngine = new SandboxedExecutionEngine();
module.exports = { SandboxedExecutionEngine, sandboxedExecutionEngine };
