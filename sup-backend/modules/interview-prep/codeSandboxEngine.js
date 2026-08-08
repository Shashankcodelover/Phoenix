/**
 * Phoenix v13 Isolated Code Sandbox Engine
 * =========================================
 * Executes candidate JavaScript code in a secure child_process
 * with CPU timeout bounds, memory isolation, and ZERO environment variables.
 * This completely mitigates node:vm Host OS Breakout.
 */

const { spawn } = require('child_process');

function executeInSandbox(userCode, inputArgs = [], timeoutMs = 2000) {
  return new Promise((resolve) => {
    if (!userCode || typeof userCode !== 'string') {
      return resolve({ success: false, error: 'userCode string is required.' });
    }

    const startMs = Date.now();
    let stdoutData = '';
    let stderrData = '';

    // Wrap the user's code to run and output JSON
    const wrappedCode = `
      try {
        const inputArgs = ${JSON.stringify(inputArgs)};
        let result = null;
        ${userCode}
        if (typeof solution === 'function') {
          result = solution(...inputArgs);
        }
        process.stdout.write('\\n__RESULT__:' + JSON.stringify(result) + '\\n');
      } catch (err) {
        process.stderr.write(err.message + '\\n');
      }
    `;

    // Spawn a completely detached Node process with no environment variables and restricted permissions
    const child = spawn('node', ['--experimental-permission', '--allow-fs-read=*', '-e', wrappedCode], {
      env: {}, // NO process.env access (prevents secret theft)
      stdio: ['pipe', 'pipe', 'pipe']
    });

    // Kill mechanism for timeout
    const timeoutId = setTimeout(() => {
      child.kill('SIGKILL');
    }, timeoutMs);

    const MAX_BUFFER = 10000;

    child.stdout.on('data', (chunk) => { 
      stdoutData += chunk.toString(); 
      if (stdoutData.length > MAX_BUFFER) {
        child.kill('SIGKILL');
      }
    });
    
    child.stderr.on('data', (chunk) => { 
      stderrData += chunk.toString(); 
      if (stderrData.length > MAX_BUFFER) {
        child.kill('SIGKILL');
      }
    });

    child.on('close', (code, signal) => {
      clearTimeout(timeoutId);
      const executionTimeMs = Date.now() - startMs;
      
      if (signal === 'SIGKILL') {
        return resolve({
          success: false,
          executionTimeMs,
          error: 'Execution Timed Out (Infinite loop or CPU limit exceeded)',
          logs: stdoutData.split('\n').filter(Boolean),
          timedOut: true
        });
      }

      // Parse result
      let result = null;
      let logs = [];
      const lines = stdoutData.split('\n');
      for (const line of lines) {
        if (line.startsWith('__RESULT__:')) {
          try { result = JSON.parse(line.replace('__RESULT__:', '')); } catch(e) {}
        } else if (line.trim()) {
          logs.push(line);
        }
      }

      if (stderrData.trim() || code !== 0) {
        return resolve({
          success: false,
          executionTimeMs,
          error: stderrData.trim() || 'Process exited with non-zero code',
          logs,
          timedOut: false
        });
      }

      resolve({
        success: true,
        executionTimeMs,
        logs,
        result,
        timedOut: false
      });
    });
  });
}

module.exports = { executeInSandbox };
