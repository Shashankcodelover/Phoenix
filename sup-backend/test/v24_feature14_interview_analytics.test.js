const { describe, it } = require('node:test');
const assert = require('node:assert');

const { InterviewAnalyticsHub } = require('../modules/interview-prep/interviewAnalyticsHub');

describe('V24 Quality Focus: Feature 14 — Comprehensive AI Mock Interview History & Analytics Engine', () => {
  const hub = new InterviewAnalyticsHub();

  it('retrieves multi-session historical timeline and tracks progression from 68% to 94%', () => {
    const history = hub.getSessionHistory('candidate_01');

    assert.strictEqual(history.success, true);
    assert.strictEqual(history.totalSessionsCompleted, 3);
    assert.strictEqual(history.currentReadinessPercent, '94%');
    assert.ok(history.historicalGrowthDelta.includes('+26% Improvement'));
    assert.strictEqual(history.faangHiringReadiness, 'Tier-1 FAANG Optimal (Top 4% Candidate Cohort)');
    assert.ok(history.currentRadarDimensions.algoComplexity >= 95);
    assert.ok(history.currentRadarDimensions.voiceProsody >= 90);
    assert.ok(history.blindSpotInsights.length >= 3);
  });

  it('records a new mock interview session and returns updated telemetry confirmation', () => {
    const record = hub.recordSession({
      companyTarget: 'Apple CoreOS',
      overallScore: 96,
      dimensions: { algoComplexity: 98, voiceProsody: 95, fillerSuppression: 97, systemDesign: 96, starImpact: 95, composure: 96 },
      keyTakeaway: 'Mastered low-level concurrency and memory management defense.'
    });

    assert.strictEqual(record.success, true);
    assert.ok(record.recordedSession.sessionId.startsWith('sess_'));
    assert.strictEqual(record.recordedSession.companyTarget, 'Apple CoreOS');
    assert.strictEqual(record.updatedReadinessScore, '96%');
    assert.strictEqual(record.status, 'TELEMETRY_UPDATED');
  });
});
