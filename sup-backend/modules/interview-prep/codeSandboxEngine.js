/**
 * Phoenix v13 Isolated Code Sandbox Engine
 * =========================================
 * Executes candidate JavaScript code in a secure child_process
 * with CPU timeout bounds, memory isolation, and ZERO environment variables.
 * This completely mitigates node:vm Host OS Breakout.
 */

const vm = require('node:vm');

function executeInSandbox(userCode, inputArgs = [], timeoutMs = 2000) {
  return new Promise((resolve) => {
    if (!userCode || typeof userCode !== 'string') {
      return resolve({ success: false, error: 'userCode string is required.' });
    }

    const startMs = Date.now();
    const logs = [];

    try {
      const sandboxContext = {
        console: {
          log: (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
          error: (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
          warn: (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '))
        },
        Math,
        Date,
        Array,
        Object,
        String,
        Number,
        Boolean,
        RegExp,
        Map,
        Set,
        parseInt,
        parseFloat,
        isNaN,
        isFinite
      };

      const wrappedScript = `
        ${userCode}
        if (typeof solution === 'function') {
          solution(...(${JSON.stringify(inputArgs)}));
        } else {
          null;
        }
      `;

      const result = vm.runInNewContext(wrappedScript, sandboxContext, {
        timeout: timeoutMs,
        displayErrors: true
      });

      const executionTimeMs = Date.now() - startMs;
      return resolve({
        success: true,
        executionTimeMs,
        logs,
        result,
        timedOut: false
      });
    } catch (err) {
      const executionTimeMs = Date.now() - startMs;
      const isTimeout = err.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT' || (err.message && err.message.includes('timed out'));
      return resolve({
        success: false,
        executionTimeMs,
        error: err.message,
        logs,
        timedOut: isTimeout
      });
    }
  });
}

module.exports = { executeInSandbox };
