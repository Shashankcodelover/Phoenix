/**
 * Phoenix v13 Isolated Code Sandbox Engine
 * =========================================
 * Executes candidate JavaScript code in a secure Node.js `node:vm` context
 * with CPU timeout bounds, memory isolation, and output capture.
 */

const vm = require('node:vm');

function executeInSandbox(userCode, inputArgs = [], timeoutMs = 2000) {
  if (!userCode || typeof userCode !== 'string') {
    throw new Error('userCode string is required.');
  }

  const logs = [];
  const sandboxConsole = {
    log: (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
    error: (...args) => logs.push(`[ERROR] ${args.join(' ')}`),
    warn: (...args) => logs.push(`[WARN] ${args.join(' ')}`)
  };

  const sandboxContext = vm.createContext({
    console: sandboxConsole,
    inputArgs,
    result: null,
    Math,
    Array,
    Object,
    String,
    Number,
    Boolean,
    JSON,
    Date,
    RegExp,
    Set,
    Map
  });

  const wrappedCode = `
    try {
      ${userCode}
      if (typeof solution === 'function') {
        result = solution(...inputArgs);
      }
    } catch (err) {
      console.error(err.message);
    }
  `;

  const startMs = Date.now();
  try {
    const script = new vm.Script(wrappedCode);
    script.runInContext(sandboxContext, { timeout: timeoutMs });
    const executionTimeMs = Date.now() - startMs;

    return {
      success: true,
      executionTimeMs,
      logs,
      result: sandboxContext.result,
      timedOut: false
    };
  } catch (err) {
    return {
      success: false,
      executionTimeMs: Date.now() - startMs,
      error: err.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT' ? 'Execution Timed Out (Infinite loop or CPU limit exceeded)' : err.message,
      logs,
      timedOut: err.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT'
    };
  }
}

module.exports = { executeInSandbox };
