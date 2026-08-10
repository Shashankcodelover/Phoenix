/**
 * Phoenix V16: Interview Pattern Recognition Engine
 *
 * Analyzes a candidate's historical mock interview sessions to identify
 * recurring weaknesses, blind spots, and improvement trajectories.
 * Inspired by Codemia.io's longitudinal skill tracking and Hello Interview's
 * gap-analysis dashboards.
 */

/**
 * Analyze patterns across multiple interview sessions.
 *
 * @param {Object} params
 * @param {Array} params.sessions - Array of past session results, each with:
 *   { date, scores: { technical, behavioral, systemDesign, communication }, feedback: [] }
 * @returns {Object} Pattern analysis report
 */
function analyzeInterviewPatterns({ sessions = [] }) {
  if (!Array.isArray(sessions) || sessions.length < 2) {
    return {
      success: false,
      error: 'At least 2 session records are required for pattern analysis.'
    };
  }

  // Cap at 100 sessions to prevent abuse
  // FIX REJECTION #6: Filter out malformed session objects
  const capped = sessions
    .slice(-100)
    .filter(s => s && typeof s === 'object' && s.scores && typeof s.scores === 'object');

  if (capped.length < 2) {
    return {
      success: false,
      error: 'At least 2 valid session records (with scores objects) are required.'
    };
  }

  const dimensions = ['technical', 'behavioral', 'systemDesign', 'communication'];
  const trends = {};
  const weakAreas = [];
  const strongAreas = [];

  for (const dim of dimensions) {
    const values = capped
      .map(s => s.scores?.[dim])
      .filter(v => typeof v === 'number' && Number.isFinite(v));

    if (values.length < 2) {
      trends[dim] = { trend: 'INSUFFICIENT_DATA', avg: 0, delta: 0 };
      continue;
    }

    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    // Compare first half average to second half average for trend direction
    const mid = Math.floor(values.length / 2);
    const firstHalf = values.slice(0, mid);
    const secondHalf = values.slice(mid);
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    const delta = secondAvg - firstAvg;

    let trend = 'STABLE';
    if (delta > 10) trend = 'IMPROVING';
    else if (delta > 5) trend = 'SLIGHTLY_IMPROVING';
    else if (delta < -10) trend = 'DECLINING';
    else if (delta < -5) trend = 'SLIGHTLY_DECLINING';

    trends[dim] = {
      trend,
      avg: Math.round(avg * 10) / 10,
      delta: Math.round(delta * 10) / 10,
      latest: values[values.length - 1],
      earliest: values[0]
    };

    if (avg < 60) weakAreas.push({ dimension: dim, avg: Math.round(avg), trend });
    if (avg >= 80) strongAreas.push({ dimension: dim, avg: Math.round(avg), trend });
  }

  // Consistency score: low variance = high consistency
  const allScores = capped.flatMap(s =>
    dimensions.map(d => s.scores?.[d]).filter(v => typeof v === 'number')
  );
  const mean = allScores.reduce((a, b) => a + b, 0) / (allScores.length || 1);
  const variance = allScores.reduce((sum, v) => sum + (v - mean) ** 2, 0) / (allScores.length || 1);
  const consistencyScore = Math.max(0, Math.round(100 - Math.sqrt(variance)));

  // Generate actionable insights
  const insights = [];
  for (const weak of weakAreas) {
    if (weak.trend === 'DECLINING') {
      insights.push(`URGENT: Your ${weak.dimension} skills are declining (avg ${weak.avg}/100). Prioritize focused practice immediately.`);
    } else {
      insights.push(`Your ${weak.dimension} skills are below bar (avg ${weak.avg}/100). Dedicate 2-3 sessions to targeted drills.`);
    }
  }
  if (consistencyScore < 60) {
    insights.push('Your performance is highly inconsistent across sessions. Focus on building a repeatable preparation routine.');
  }

  return {
    success: true,
    sessionCount: capped.length,
    trends,
    weakAreas,
    strongAreas,
    consistencyScore,
    insights,
    metadata: { engine: 'Phoenix Pattern Recognition v16' }
  };
}

module.exports = { analyzeInterviewPatterns };
