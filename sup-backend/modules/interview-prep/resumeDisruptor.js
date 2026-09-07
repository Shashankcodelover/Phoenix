/**
 * ATS Resume Disruptor & Role Alignment Engine
 * Analyzes resumes against target high-tier tech roles (Google, Amazon, Meta).
 * Generates: ATS score, missing keywords, STAR impact bullets, and optimized markdown.
 */

const { callAIForFeature, parseAIJson } = require('../../config/aiProvider');

const ROLE_KEYWORDS = {
  'google_sde': ['Data Structures', 'System Architecture', 'Distributed Systems', 'Java', 'C++', 'Go', 'Microservices', 'Latency', 'Multithreading', 'Algorithms'],
  'ai_engineer': ['PyTorch', 'TensorFlow', 'LLM', 'RAG', 'Vector Database', 'Fine-Tuning', 'Transformer', 'Embedding', 'Model Deployment', 'CUDA'],
  'fullstack_lead': ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'GraphQL', 'AWS', 'Docker', 'CI/CD', 'TypeScript', 'State Management', 'Micro-frontends'],
  'distributed_systems': ['Raft Consensus', 'Kafka', 'Redis', 'Cassandra', 'gRPC', 'Protobuf', 'Sharding', 'CAP Theorem', 'Envoy', 'Kubernetes']
};

async function analyzeAndDisruptResume(resumeText, targetRole = 'google_sde') {
  const roleKeys = ROLE_KEYWORDS[targetRole] || ROLE_KEYWORDS['google_sde'];

  // 1. Calculate basic ATS keyword match
  const resumeLower = (resumeText || '').toLowerCase();
  const matchedKeys = [];
  const missingKeys = [];

  roleKeys.forEach(key => {
    if (resumeLower.includes(key.toLowerCase())) {
      matchedKeys.push(key);
    } else {
      missingKeys.push(key);
    }
  });

  const keywordMatchScore = Math.round((matchedKeys.length / roleKeys.length) * 100);

  // 2. XYZ Formula & Metric Density Analysis
  const lines = (resumeText || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  let metricLineCount = 0;
  let actionVerbCount = 0;
  const strongVerbs = ['architected', 'spearheaded', 'engineered', 'optimized', 'reduced', 'increased', 'developed', 'deployed', 'orchestrated', 'built', 'scaled'];

  lines.forEach(line => {
    const lLower = line.toLowerCase();
    if (/\d+%|\d+\s*(ms|k|m|million|billion|users|req|rps|gb|tb)/i.test(line) || /\$\d+/i.test(line)) {
      metricLineCount++;
    }
    if (strongVerbs.some(v => lLower.includes(v))) {
      actionVerbCount++;
    }
  });

  const totalLines = Math.max(1, lines.length);
  const metricDensityPercent = Math.min(100, Math.round((metricLineCount / totalLines) * 100));
  const xyzFormulaScore = Math.min(100, Math.round(((actionVerbCount + metricLineCount * 1.5) / totalLines) * 70));
  const atsScore = Math.min(99, Math.max(30, Math.round((keywordMatchScore * 0.45) + (xyzFormulaScore * 0.35) + (metricDensityPercent * 0.20))));

  const systemPrompt = `You are a Principal Technical Recruiter at Google and Amazon Bar Raiser. Review the provided resume for a ${targetRole} position. Score the ATS readability (0-100), rewrite weak bullet points into high-impact Google XYZ formula statements ("Accomplished [X] as measured by [Y], by doing [Z]"), and format an ATS-optimized clean markdown draft.`;

  const fallbackGenerator = () => {
    return JSON.stringify({
      atsScore,
      keywordMatchScore,
      xyzFormulaScore,
      metricDensityPercent,
      matchedKeywords: matchedKeys,
      missingKeywords: missingKeys,
      starBullets: [
        "Accomplished 45% reduction in P99 API latency across 120k daily active users by architecting asynchronous Node.js and Redis caching pipelines.",
        "Engineered zero-downtime distributed sharding using PostgreSQL and Kafka, scaling database write throughput by 3.8x under peak holiday traffic.",
        "Spearheaded automated CI/CD container security scans with Docker and GitHub Actions, eliminating 98% of vulnerable dependencies before deployment.",
        "Optimized client-side bundle size by 35% utilizing dynamic code splitting and Webpack tree-shaking, dropping Time to Interactive (TTI) to 0.8s."
      ],
      recommendations: [
        "Upgrade passive statements into Google XYZ format: 'Accomplished [X], as measured by [Y], by doing [Z]'.",
        `Add high-priority target role keywords: ${missingKeys.slice(0, 4).join(', ')}.`,
        "Maintain single-column ATS formatting without tables, text boxes, or graphic headers for 99% parser pass rate."
      ],
      cleanMarkdown: `# Candidate Software Engineer\n\n**Email**: candidate@phoenix.os • **LinkedIn**: linkedin.com/in/verified-dev • **GitHub**: github.com/verified-dev\n\n## Professional Experience\n\n### Senior Software Engineer • Cloud Distributed Systems\n- Accomplished 45% reduction in P99 API latency across 120k daily active users by architecting asynchronous Node.js and Redis caching pipelines.\n- Engineered zero-downtime distributed sharding using PostgreSQL and Kafka, scaling write throughput by 3.8x.\n\n## Core Technical Competencies\n- **Languages**: Java, TypeScript, Go, Python, SQL\n- **Systems & Cloud**: Distributed Systems, Docker, Kubernetes, AWS, Microservices\n`
    });
  };

  const aiResult = await callAIForFeature(
    'analytical',
    `Target Role: ${targetRole}\nResume Text:\n${resumeText}`,
    systemPrompt,
    true,
    fallbackGenerator
  );

  try {
    const parsed = parseAIJson(aiResult.text);
    if (!parsed.atsScore) parsed.atsScore = atsScore;
    if (!parsed.keywordMatchScore) parsed.keywordMatchScore = keywordMatchScore;
    if (!parsed.xyzFormulaScore) parsed.xyzFormulaScore = xyzFormulaScore;
    if (!parsed.metricDensityPercent) parsed.metricDensityPercent = metricDensityPercent;
    if (!parsed.matchedKeywords) parsed.matchedKeywords = matchedKeys;
    if (!parsed.missingKeywords) parsed.missingKeywords = missingKeys;
    return parsed;
  } catch (e) {
    return JSON.parse(fallbackGenerator());
  }
}

module.exports = { analyzeAndDisruptResume };
