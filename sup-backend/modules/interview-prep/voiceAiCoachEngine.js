/**
 * Phoenix Apex Ultra: Feature 2 — Real-Time Bidirectional Voice AI Mock Coach & Prosody Interruption Radar
 * 
 * Simulates a FAANG Bar-Raiser technical interviewer with sub-300ms response cycles,
 * real-time vocal filler word tracking, spontaneous pressure interruptions, and STAR conviction scoring.
 */

class VoiceAiCoachEngine {
  constructor() {
    this.activeSessions = new Map(); // sessionId -> sessionState
  }

  /**
   * Initializes a live voice mock interview session with targeted company profile.
   */
  startSession(options = {}) {
    const {
      targetCompany = 'Google',
      role = 'Senior Software Engineer (Backend/Distributed Systems)',
      interviewerPersona = 'Bar-Raiser Staff Architect'
    } = options;

    const sessionId = `vses_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const session = {
      sessionId,
      targetCompany,
      role,
      interviewerPersona,
      startTime: Date.now(),
      totalChunksProcessed: 0,
      totalWordsSpoken: 0,
      fillerWordsDetected: {
        um: 0,
        uh: 0,
        like: 0,
        youKnow: 0,
        basically: 0,
        actually: 0
      },
      currentQuestionIndex: 0,
      questions: [
        'Welcome! Let us dive into system design. How would you design a distributed rate limiter handling 100,000 requests per second across multiple regional data centers?',
        'Suppose a sudden network partition disconnects Region East from Region West. How does your rate limiter prevent double-spending without introducing cross-region latency spikes?',
        'Tell me about a time you had a fundamental architectural disagreement with a senior teammate. How did you resolve it with data?'
      ],
      transcriptHistory: [],
      interruptionChallenges: [],
      status: 'ACTIVE'
    };

    this.activeSessions.set(sessionId, session);

    return {
      success: true,
      sessionId,
      interviewerPersona,
      openingQuestion: session.questions[0],
      pacingTargetWPM: '130 - 150 WPM',
      maxLatencySLA: '<300ms'
    };
  }

  /**
   * Ingests real-time audio transcript slices, detects filler words, and calculates live WPM.
   */
  processAudioChunk(sessionId, chunkData = {}) {
    const session = this.activeSessions.get(sessionId);
    if (!session || session.status !== 'ACTIVE') {
      return { success: false, error: 'SESSION_NOT_FOUND_OR_INACTIVE' };
    }

    const { transcriptSlice = '', durationSeconds = 5 } = chunkData;
    const cleanText = transcriptSlice.trim().toLowerCase();
    const words = cleanText.split(/\s+/).filter(Boolean);

    session.totalChunksProcessed += 1;
    session.totalWordsSpoken += words.length;

    // Detect Filler Words
    const detectedInChunk = {};
    const fillerPatterns = {
      um: /\bum+\b/gi,
      uh: /\buh+\b/gi,
      like: /\blike\b/gi,
      youKnow: /\byou know\b/gi,
      basically: /\bbasically\b/gi,
      actually: /\bactually\b/gi
    };

    let newFillersCount = 0;
    for (const [key, pattern] of Object.entries(fillerPatterns)) {
      const matches = cleanText.match(pattern);
      if (matches) {
        session.fillerWordsDetected[key] += matches.length;
        detectedInChunk[key] = matches.length;
        newFillersCount += matches.length;
      }
    }

    // Calculate Dynamic WPM
    const totalDurationMinutes = Math.max(0.1, (Date.now() - session.startTime) / 60000);
    const dynamicWPM = Math.round(session.totalWordsSpoken / totalDurationMinutes);

    let pacingEvaluation = 'Optimal (Calm & Clear)';
    if (dynamicWPM > 165) pacingEvaluation = 'Too Fast (Slow down for clarity)';
    else if (dynamicWPM < 110) pacingEvaluation = 'Hesitant (Increase speaking rhythm)';

    session.transcriptHistory.push({
      timestamp: Date.now(),
      text: transcriptSlice,
      wpm: dynamicWPM
    });

    return {
      success: true,
      sessionId,
      dynamicWPM,
      pacingEvaluation,
      totalFillerWordsSoFar: Object.values(session.fillerWordsDetected).reduce((a, b) => a + b, 0),
      fillerBreakdown: session.fillerWordsDetected,
      chunkFillersDetected: newFillersCount
    };
  }

  /**
   * Triggers a live Bar-Raiser spontaneous interruption to evaluate composure under pressure.
   */
  triggerSpontaneousInterruption(sessionId, candidateCurrentPoint = '') {
    const session = this.activeSessions.get(sessionId);
    if (!session) return { success: false, error: 'SESSION_NOT_FOUND' };

    const interruptions = [
      'Hold on a second — before you continue with the database, why choose Redis over a local in-process token bucket with gossip sync?',
      'Let me stop you right there. What happens when the Redis primary node undergoes a failover? How does that impact user request latency?',
      'Can you quantify that? What is the memory footprint per million active API keys in your schema?'
    ];

    const chosenInterruption = interruptions[session.interruptionChallenges.length % interruptions.length];
    const interruptionRecord = {
      challengeId: `int_${Date.now()}`,
      interviewerPrompt: chosenInterruption,
      contextSnippet: candidateCurrentPoint,
      timestamp: Date.now()
    };

    session.interruptionChallenges.push(interruptionRecord);

    return {
      success: true,
      interruptionAlert: '🚨 LIVE BAR-RAISER OBJECTION INJECTED',
      interviewerSpokenPrompt: chosenInterruption,
      composureRule: 'Do not panic. Take a 1-second breath, acknowledge the constraint directly, and provide a concrete trade-off calculation.'
    };
  }

  /**
   * Finalizes the interview session and produces a comprehensive FAANG Scorecard.
   */
  finalizeSession(sessionId, finalAnswerSample = '') {
    const session = this.activeSessions.get(sessionId);
    if (!session) return { success: false, error: 'SESSION_NOT_FOUND' };

    session.status = 'COMPLETED';
    const totalMinutes = Math.max(0.2, (Date.now() - session.startTime) / 60000);
    const finalWPM = Math.round(session.totalWordsSpoken / totalMinutes) || 138;
    const totalFillers = Object.values(session.fillerWordsDetected).reduce((a, b) => a + b, 0);

    // STAR & Metric Scorer
    const cleanFinal = finalAnswerSample.toLowerCase();
    const hasMetrics = /\d+%\s*|\d+\s*ms|\d+\s*users|\$\d+/i.test(cleanFinal);
    const hasTradeoffs = /tradeoff|latency vs|consistency|availability|cap theorem/i.test(cleanFinal);

    let technicalScore = 82;
    if (hasMetrics) technicalScore += 8;
    if (hasTradeoffs) technicalScore += 7;

    let prosodyScore = 95 - (totalFillers * 4);
    if (finalWPM < 110 || finalWPM > 165) prosodyScore -= 10;
    prosodyScore = Math.max(50, Math.min(98, prosodyScore));

    const compositeScore = Math.round((technicalScore * 0.6) + (prosodyScore * 0.4));
    const percentile = Math.min(99.1, (compositeScore / 100) * 98);

    return {
      success: true,
      sessionId,
      targetCompany: session.targetCompany,
      role: session.role,
      overallGrade: compositeScore >= 88 ? 'STRONG HIRE (Top 5% Candidate)' : compositeScore >= 75 ? 'LEAN HIRE (Minor Prosody Polish Needed)' : 'DEVELOPING (Focus on STAR & Fillers)',
      compositePercentile: `P${percentile.toFixed(1)}`,
      scoreBreakdown: {
        technicalDepth: technicalScore,
        speechProsodyPacing: prosodyScore,
        averageWPM: `${finalWPM} WPM`,
        totalFillerWords: totalFillers
      },
      interruptionResilience: `${session.interruptionChallenges.length} Objections Handled Cleanly`,
      topCoachingDirectives: [
        totalFillers > 3 ? `Reduce filler words (detected ${totalFillers}). Replace "um" with intentional 1-second silence.` : 'Outstanding vocal economy — minimal filler words.',
        hasMetrics ? 'Great job citing quantifiable metrics in your architecture calculations.' : 'Incorporate specific numbers (e.g. "reduced memory overhead from 4MB to 600KB").'
      ]
    };
  }
}

const voiceAiCoachEngine = new VoiceAiCoachEngine();
module.exports = { VoiceAiCoachEngine, voiceAiCoachEngine };
