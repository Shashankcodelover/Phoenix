const { describe, it } = require('node:test');
const assert = require('node:assert');

const { VoiceAiCoachEngine } = require('../modules/interview-prep/voiceAiCoachEngine');

describe('V24 Quality Focus: Feature 2 — Real-Time Bidirectional Voice AI Coach & Interruption Radar', () => {
  const engine = new VoiceAiCoachEngine();
  let sessionId = null;

  it('starts a live voice mock session with FAANG Bar-Raiser profile', () => {
    const session = engine.startSession({
      targetCompany: 'Google',
      role: 'Staff Distributed Systems Engineer',
      interviewerPersona: 'Bar-Raiser Architect'
    });

    assert.strictEqual(session.success, true);
    assert.ok(session.sessionId.startsWith('vses_'));
    assert.ok(session.openingQuestion.includes('distributed rate limiter'));
    assert.strictEqual(session.maxLatencySLA, '<300ms');
    sessionId = session.sessionId;
  });

  it('processes incoming audio transcript chunks, detects filler words, and calculates dynamic WPM', () => {
    const chunkResult = engine.processAudioChunk(sessionId, {
      transcriptSlice: 'Um, basically we can deploy a Redis cluster, but like, you know, we need gossip sync for latency.',
      durationSeconds: 5
    });

    assert.strictEqual(chunkResult.success, true);
    assert.ok(chunkResult.totalFillerWordsSoFar >= 3);
    assert.ok(chunkResult.fillerBreakdown.um >= 1);
    assert.ok(chunkResult.fillerBreakdown.like >= 1);
    assert.ok(chunkResult.dynamicWPM > 0);
  });

  it('triggers spontaneous Bar-Raiser interruption challenges under pressure', () => {
    const interruption = engine.triggerSpontaneousInterruption(sessionId, 'candidate discussing redis clustering');

    assert.strictEqual(interruption.success, true);
    assert.ok(interruption.interruptionAlert.includes('OBJECTION'));
    assert.ok(interruption.interviewerSpokenPrompt.length > 10);
    assert.ok(interruption.composureRule.includes('Do not panic'));
  });

  it('finalizes session and computes composite FAANG percentile scorecard', () => {
    const finalReport = engine.finalizeSession(
      sessionId,
      'We reduced cross-region API latency by 45% using local token buckets and handled 50k users with zero dropped transactions.'
    );

    assert.strictEqual(finalReport.success, true);
    assert.ok(finalReport.compositePercentile.startsWith('P'));
    assert.ok(finalReport.scoreBreakdown.technicalDepth >= 80);
    assert.strictEqual(finalReport.interruptionResilience.includes('1 Objections Handled Cleanly'), true);
    assert.ok(finalReport.topCoachingDirectives.length >= 1);
  });
});
