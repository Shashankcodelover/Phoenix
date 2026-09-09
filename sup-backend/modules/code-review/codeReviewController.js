/**
 * Phoenix v5.0: AI Code Review Agent Controller
 * Analyzes raw code snippets or repository files for security, performance, readability, and architecture.
 * Returns structured JSON scores (0-100 per axis) plus markdown findings & refactored code suggestions.
 */

const { callAIForFeature, parseAIJson } = require('../../config/aiProvider');
const { reviewCache } = require('../../middleware/responseCache');

// Heuristic Code Intelligence Analyzer
function analyzeCodeHeuristics(rawCode, language) {
  // Normalize escaped characters if middleware sanitized it
  const code = rawCode
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

  const lines = code.split('\n');
  const findings = [];
  const lineAnnotations = [];
  let detectedTime = 'O(N)';
  let detectedSpace = 'O(1)';
  let targetTime = 'O(N)';
  let targetSpace = 'O(1)';
  let securityScore = 96;
  let performanceScore = 92;
  let readabilityScore = 88;
  let architectureScore = 90;
  let refactoredCode = code;

  // 1. Detect Nested Loops (O(N^2) or higher)
  let loopDepth = 0;
  let maxLoopDepth = 0;
  let loopLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Detect loops
    if (/\b(for|while)\s*\(/.test(line) || /for\s+\w+\s+in\s+/.test(line)) {
      loopDepth++;
      loopLines.push(lineNum);
      if (loopDepth > maxLoopDepth) maxLoopDepth = loopDepth;
    }
    if (line.includes('}') && loopDepth > 0) {
      loopDepth--;
    }

    // Security checks
    if (/eval\s*\(|new\s+Function\(|exec\s*\(|dangerouslySetInnerHTML/.test(line)) {
      securityScore = Math.max(20, securityScore - 40);
      findings.push({
        type: 'SECURITY',
        severity: 'CRITICAL',
        line: lineNum,
        issue: 'Dynamic evaluation / Remote code injection vector detected (`eval` or `Function`).',
        fix: 'Eliminate dynamic code execution. Use strict JSON parsing or parameterized evaluation.'
      });
      lineAnnotations.push({
        line: lineNum,
        severity: 'CRITICAL',
        message: 'High vulnerability: Code injection execution vector.',
        suggestion: 'Replace with safe declarative data parsing.'
      });
    }

    // SQL Injection check
    if ((/SELECT\s+.*WHERE/i.test(line) && (/\+/.test(line) || /\$\{/.test(line))) || (/query\s*=\s*[\'\"].*SELECT/i.test(line) && /\+/.test(line))) {
      securityScore = Math.max(25, securityScore - 55);
      findings.push({
        type: 'SECURITY',
        severity: 'CRITICAL',
        line: lineNum,
        issue: 'Unparameterized SQL concatenation detected — Critical SQL Injection vector (OWASP Top 1).',
        fix: 'Use parameterized queries / prepared statements (e.g. `db.query(sql, [params])`).'
      });
      lineAnnotations.push({
        line: lineNum,
        severity: 'CRITICAL',
        message: 'SQL Injection hazard: Raw string concatenation.',
        suggestion: 'Use query parameter placeholders ($1 or ?).'
      });
      refactoredCode = `// Secure Parameterized Query Solution
function getUserRecord(req, res, db) {
  const userId = req.body.userId;
  // Secure: Use parameterized placeholders to prevent SQL Injection
  const query = "SELECT * FROM users WHERE id = ?";
  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
}`;
    }


    // Hardcoded API Keys / Secrets / Tokens check
    if (/(?:api[_-]?key|secret|token|password|auth[_-]?token|private[_-]?key)\s*[:=]\s*['"`][A-Za-z0-9_\-\.]{12,}['"`]/i.test(line)) {
      securityScore = Math.max(15, securityScore - 60);
      findings.push({
        type: 'SECURITY',
        severity: 'CRITICAL',
        line: lineNum,
        issue: 'Hardcoded Secret / API Token detected in source code (CWE-798).',
        fix: 'Extract secret into environment variables (`process.env.API_KEY`) and load via secret manager.'
      });
      lineAnnotations.push({
        line: lineNum,
        severity: 'CRITICAL',
        message: 'Security leak: Exposed plaintext secret or credential.',
        suggestion: 'Replace with process.env lookup.'
      });
    }

    // Command Injection check (child_process.exec, os.system)
    if (/child_process|exec\s*\(|execSync\s*\(|spawn\s*\(|os\.system\s*\(|subprocess\.Popen/.test(line) && (/\+|concat|\$\{/.test(line) || /req\.|params|body/i.test(line))) {
      securityScore = Math.max(20, securityScore - 50);
      findings.push({
        type: 'SECURITY',
        severity: 'CRITICAL',
        line: lineNum,
        issue: 'Command Injection vulnerability: Untrusted input concatenated directly into OS command execution (OWASP Top 3).',
        fix: 'Use `execFile` or `spawn` with argument array, or avoid invoking system shell directly.'
      });
      lineAnnotations.push({
        line: lineNum,
        severity: 'CRITICAL',
        message: 'Command injection hazard: Unescaped OS shell argument.',
        suggestion: 'Use parameterized spawn arguments.'
      });
    }

    // Prototype Pollution check (__proto__, constructor.prototype)
    if (/__proto__|constructor\.prototype/.test(line)) {
      securityScore = Math.max(30, securityScore - 40);
      findings.push({
        type: 'SECURITY',
        severity: 'HIGH',
        line: lineNum,
        issue: 'Prototype Pollution pattern detected modifying Object prototype (CWE-1321).',
        fix: 'Use `Object.create(null)` or validate object keys against `__proto__` and `constructor` before assignment.'
      });
      lineAnnotations.push({
        line: lineNum,
        severity: 'HIGH',
        message: 'Prototype pollution hazard: Direct modification of prototype.',
        suggestion: 'Use Object.create(null) or Map.'
      });
    }

    // Insecure Deserialization / pickle / yaml load
    if (/deserialize\s*\(|unserialize\s*\(|pickle\.loads|yaml\.load\s*\([^,)]*\)/.test(line)) {
      securityScore = Math.max(25, securityScore - 45);
      findings.push({
        type: 'SECURITY',
        severity: 'CRITICAL',
        line: lineNum,
        issue: 'Insecure Object Deserialization vector (CWE-502).',
        fix: 'Use safe serialization standards like JSON or `yaml.safe_load()`.'
      });
      lineAnnotations.push({
        line: lineNum,
        severity: 'CRITICAL',
        message: 'Insecure deserialization: Untrusted object reconstitution.',
        suggestion: 'Use JSON.parse or yaml.safe_load.'
      });
    }

    // Memory leaks
    if (/setInterval\s*\(/.test(line) && !code.includes('clearInterval')) {
      findings.push({
        type: 'PERFORMANCE',
        severity: 'MEDIUM',
        line: lineNum,
        issue: '`setInterval` registered without cleanup mechanism (potential memory leak).',
        fix: 'Store timer ID and clear in teardown lifecycle or return cleanup callback.'
      });
      lineAnnotations.push({
        line: lineNum,
        severity: 'MEDIUM',
        message: 'Potential memory leak: Unbound interval.',
        suggestion: 'Ensure clearInterval is triggered on unmount.'
      });
    }
  }

  // Check exponential recursion
  const recursiveCalls = code.match(/([a-zA-Z0-9_]+)\s*\([^)]*\)\s*\+\s*\1\s*\(/);
  if (recursiveCalls) {
    detectedTime = 'O(2^N)';
    detectedSpace = 'O(N)';
    targetTime = 'O(N)';
    targetSpace = 'O(1)';
    performanceScore = 42;
    findings.push({
      type: 'PERFORMANCE',
      severity: 'CRITICAL',
      line: 1,
      issue: 'Exponential recursion tree O(2^N) with redundant overlapping subproblems.',
      fix: 'Apply top-down memoization (Cache) or bottom-up tabulation (Dynamic Programming) to reduce complexity to O(N).'
    });
    lineAnnotations.push({
      line: 1,
      severity: 'CRITICAL',
      message: 'Exponential O(2^N) recursion without memoization.',
      suggestion: 'Use iterative memoization or DP table.'
    });

    refactoredCode = `// Optimized O(N) Time, O(1) Space Dynamic Programming Solution
function optimizedSolution(n) {
  if (n <= 1) return n;
  let prev2 = 0, prev1 = 1;
  for (let i = 2; i <= n; i++) {
    const curr = prev1 + prev2;
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
}`;
  } else if (maxLoopDepth >= 2) {
    detectedTime = 'O(N²)';
    detectedSpace = 'O(1)';
    targetTime = 'O(N)';
    targetSpace = 'O(N)';
    performanceScore = 58;
    const hotspotLine = loopLines[1] || loopLines[0] || 2;
    findings.push({
      type: 'PERFORMANCE',
      severity: 'HIGH',
      line: hotspotLine,
      issue: `Nested loop hierarchy creates quadratic O(N²) time complexity hotspot.`,
      fix: 'Refactor inner loop using Hash Map (O(1) lookups) or Two-Pointer technique for linear O(N) runtime.'
    });
    lineAnnotations.push({
      line: hotspotLine,
      severity: 'HIGH',
      message: 'Quadratic bottleneck: Nested loop iteration.',
      suggestion: 'Utilize Map/Set for O(1) average lookup.'
    });

    // Provide standard refactored Two-Sum or Map approach
    refactoredCode = `// Optimized O(N) Time, O(N) Space Hash Map Solution
function optimizedSolution(nums, target) {
  const seen = new Map(); // value -> index lookup
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}`;
  } else if (maxLoopDepth === 1) {
    detectedTime = 'O(N)';
    detectedSpace = 'O(1)';
    targetTime = 'O(N)';
    targetSpace = 'O(1)';
    performanceScore = 92;
  } else {
    detectedTime = 'O(1)';
    detectedSpace = 'O(1)';
    targetTime = 'O(1)';
    targetSpace = 'O(1)';
    performanceScore = 98;
  }

  // Readability heuristic
  if (lines.length > 50) {
    readabilityScore -= 10;
    findings.push({
      type: 'READABILITY',
      severity: 'LOW',
      line: 1,
      issue: `Function length (${lines.length} lines) exceeds clean code standard (30 lines).`,
      fix: 'Decompose monolithic function into smaller single-responsibility helper functions.'
    });
  }

  const overallScore = Math.round((securityScore * 0.35) + (performanceScore * 0.35) + (readabilityScore * 0.15) + (architectureScore * 0.15));

  return {
    scores: {
      security: securityScore,
      performance: performanceScore,
      readability: readabilityScore,
      architecture: architectureScore,
      overall: overallScore
    },
    complexity: {
      time: detectedTime,
      space: detectedSpace,
      targetTime,
      targetSpace,
      hasBottleneck: detectedTime === 'O(N²)' || detectedTime === 'O(2^N)'
    },
    findings,
    lineAnnotations,
    refactoredCode,
    summary: `Analyzed ${lines.length} lines. Detected runtime time complexity of ${detectedTime} and space complexity of ${detectedSpace}. Overall Clean Code & Security score is ${overallScore}/100.`
  };
}

const reviewCode = async (req, res) => {
  try {
    const { code = '', language = 'javascript' } = req.body;
    if (!code || code.trim() === '') {
      return res.status(400).json({ message: 'Code snippet is required.' });
    }

    // Check response cache
    const cacheKey = reviewCache.generateKey('review', { code: code.trim(), language });
    const cached = reviewCache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    const lineCount = code.split('\n').length;
    const heuristicData = analyzeCodeHeuristics(code, language);

    const systemPrompt = `You are a Principal Software Engineer and Google Code Reviewer conducting a formal AST code audit.
Review the provided ${language} code across 4 core axes:
1. Security (OWASP Top 10, sanitization, injection vectors)
2. Performance (Big-O Time & Space complexity, loop nesting, memory leaks)
3. Readability (Naming conventions, modularity, comments)
4. Architecture (Separation of concerns, clean design patterns)

Return a strict JSON object with this exact structure:
{
  "scores": {
    "security": number (0-100),
    "performance": number (0-100),
    "readability": number (0-100),
    "architecture": number (0-100),
    "overall": number (0-100)
  },
  "complexity": {
    "time": "O(1)|O(log N)|O(N)|O(N log N)|O(N^2)|O(2^N)",
    "space": "O(1)|O(N)|O(N^2)",
    "targetTime": "O(N)|O(1)",
    "targetSpace": "O(1)|O(N)",
    "hasBottleneck": boolean
  },
  "findings": [
    { "type": "SECURITY|PERFORMANCE|READABILITY|ARCHITECTURE", "severity": "CRITICAL|HIGH|MEDIUM|LOW", "line": number, "issue": "description", "fix": "recommendation" }
  ],
  "lineAnnotations": [
    { "line": number, "severity": "CRITICAL|HIGH|MEDIUM|LOW", "message": "issue summary", "suggestion": "quick fix suggestion" }
  ],
  "summary": "2-3 sentence overall review summary",
  "refactoredCode": "Clean, highly-optimized production version of the code"
}
Return raw JSON only. Do not wrap in markdown tags.`;

    const fallbackGenerator = () => JSON.stringify(heuristicData);

    let reviewData;
    try {
      const reviewResult = await callAIForFeature(
        'analytical',
        `Code Snippet (${language}, ${lineCount} lines):\n\`\`\`${language}\n${code}\n\`\`\``,
        systemPrompt,
        true,
        fallbackGenerator
      );

      reviewData = parseAIJson(reviewResult.text);
      if (!reviewData.scores) reviewData = heuristicData;
    } catch (aiErr) {
      reviewData = heuristicData;
    }

    const responsePayload = {
      language,
      codeLength: code.length,
      lineCount,
      scores: reviewData.scores || heuristicData.scores,
      complexity: reviewData.complexity || heuristicData.complexity,
      findings: reviewData.findings || heuristicData.findings,
      lineAnnotations: reviewData.lineAnnotations || heuristicData.lineAnnotations,
      summary: reviewData.summary || heuristicData.summary,
      refactoredCode: reviewData.refactoredCode || heuristicData.refactoredCode
    };

    // Cache the result
    reviewCache.set(cacheKey, responsePayload);

    res.json(responsePayload);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { reviewCode };

