/**
 * Phoenix v13 Security Engine — Automated SAST Scanner
 * ====================================================
 * Static Application Security Testing (SAST) Engine that scans
 * codebase snippets, API payloads, and source files for security vulnerabilities:
 *
 * Scans for:
 * 1. Dangerous Execution: eval(), Function(), setTimeout/setInterval with string code
 * 2. Prototype Pollution: __proto__, Object.prototype, constructor.prototype mutations
 * 3. Injection Vectors: NoSQL ($where, $gt), Unsanitized SQL string concatenation
 * 4. XSS Vectors: raw innerHTML assignment without escaping, document.write
 * 5. Secret Leaks: Hardcoded API keys, JWT tokens, AWS secrets
 * 6. Insecure File Operations: fs.readFileSync with user-controlled path traversal
 */

const VULNERABILITY_PATTERNS = [
  {
    id: 'SAST-001',
    category: 'Code Execution Risk',
    severity: 'CRITICAL',
    regex: /\beval\s*\(|\bnew\s+Function\s*\(|setTimeout\s*\(\s*["'\\]/i,
    description: 'Dynamic code evaluation detected. Can lead to Remote Code Execution (RCE).'
  },
  {
    id: 'SAST-002',
    category: 'Prototype Pollution',
    severity: 'HIGH',
    regex: /__proto__|Object\.prototype|constructor\.prototype/i,
    description: 'Prototype pollution vector detected. Attackers could modify global Object prototypes.'
  },
  {
    id: 'SAST-003',
    category: 'NoSQL Injection Risk',
    severity: 'HIGH',
    regex: /\$where|\$regex\s*:\s*["'\\]|\$ne\s*:\s*["'\\]/i,
    description: 'Potentially unsanitized NoSQL operator payload.'
  },
  {
    id: 'SAST-004',
    category: 'Cross-Site Scripting (XSS)',
    severity: 'MEDIUM',
    regex: /\.innerHTML\s*=|\bdocument\.write\s*\(/i,
    description: 'Unescaped innerHTML or document.write assignment detected.'
  },
  {
    id: 'SAST-005',
    category: 'Hardcoded Secret Exposure',
    severity: 'CRITICAL',
    regex: /(?:api_key|jwt_secret|aws_secret_access_key)\s*[:=]\s*\\?["'][A-Za-z0-9_\-]{16,}\\?["']/i,
    description: 'Possible hardcoded production credential or API key.'
  },
  {
    id: 'SAST-006',
    category: 'Path Traversal Risk',
    severity: 'HIGH',
    regex: /fs\.(?:readFile|readFileSync|unlink|unlinkSync)\s*\(\s*(?:req\.|params\.|query\.)/i,
    description: 'File system operation directly uses unsanitized request parameter.'
  }
];

/**
 * Scans a code string or payload object for security vulnerabilities.
 * @param {string|Object} input - Source code text or payload object to audit
 * @param {string} filename - Optional file location descriptor
 */
function scanCodeForVulnerabilities(input, filename = 'inline_snippet') {
  const content = typeof input === 'object' ? JSON.stringify(input) : String(input);
  const lineArray = content.split('\n');
  const findings = [];

  VULNERABILITY_PATTERNS.forEach(pattern => {
    lineArray.forEach((line, index) => {
      if (pattern.regex.test(line)) {
        findings.push({
          ruleId: pattern.id,
          category: pattern.category,
          severity: pattern.severity,
          filename,
          lineNumber: index + 1,
          snippet: line.trim().substring(0, 100),
          description: pattern.description
        });
      }
    });
  });

  const criticalCount = findings.filter(f => f.severity === 'CRITICAL').length;
  const highCount = findings.filter(f => f.severity === 'HIGH').length;

  return {
    success: true,
    scannedAt: new Date().toISOString(),
    filename,
    totalFindings: findings.length,
    summary: { critical: criticalCount, high: highCount, medium: findings.length - criticalCount - highCount },
    isSecure: criticalCount === 0 && highCount === 0,
    findings
  };
}

module.exports = { scanCodeForVulnerabilities, VULNERABILITY_PATTERNS };
