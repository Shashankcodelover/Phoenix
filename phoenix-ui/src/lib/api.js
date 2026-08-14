/**
 * Phoenix v23.0: Unified Next.js Client API Gateway
 * Communicates with sup-backend (Express / Node.js API on port 5000)
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.message || errBody.error || `HTTP ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn(`[Phoenix API Client] Request to "${endpoint}" failed, using offline fallback:`, err.message);
    throw err;
  }
}

// Vault 1: Horizon APIs
export const horizonApi = {
  estimateRank: (data) => fetchApi('/horizon/entrance/estimate-rank', { method: 'POST', body: JSON.stringify(data) }),
  matchScholarships: (data) => fetchApi('/horizon/scholarships/match', { method: 'POST', body: JSON.stringify(data) }),
  matchMentors: (studentGoal) => fetchApi('/horizon/mentors/match-advisor', { method: 'POST', body: JSON.stringify({ studentGoal }) }),
  getDomainQuiz: (domainKey) => fetchApi(`/horizon/domain-quiz/generate?domainKey=${domainKey}`),
  evaluateQuiz: (domainKey, userAnswers) => fetchApi('/horizon/domain-quiz/evaluate', { method: 'POST', body: JSON.stringify({ domainKey, userAnswers }) }),
  get360Blueprint: (data) => fetchApi('/horizon/diagnostic/360-blueprint', { method: 'POST', body: JSON.stringify(data) }),
  forecastKarnatakaMatrix: (data) => fetchApi('/horizon/rank/karnataka-matrix', { method: 'POST', body: JSON.stringify(data) }),
  getMentorsDirectory: () => fetchApi('/horizon/mentors/directory'),
  dispatchMentorQuestion: (payload) => fetchApi('/horizon/mentors/dispatch-question', { method: 'POST', body: JSON.stringify(payload) }),
  getVernacularGuidance: (payload) => fetchApi('/horizon/vernacular/guidance', { method: 'POST', body: JSON.stringify(payload) }),
  simulateChoiceFilling: (payload) => fetchApi('/horizon/option-entry/simulate-allotment', { method: 'POST', body: JSON.stringify(payload) }),
  getCutoffTrends: (collegeCode) => fetchApi(`/horizon/colleges/cutoff-trends?collegeCode=${collegeCode || 'RVCE'}`),
  predictAdmissionChances: (payload) => fetchApi('/horizon/colleges/predict-admission-chances', { method: 'POST', body: JSON.stringify(payload) }),
  evaluateSnqEligibility: (payload) => fetchApi('/horizon/snq/evaluate-eligibility', { method: 'POST', body: JSON.stringify(payload) }),
  getDiplomaMathBridge: () => fetchApi('/horizon/diploma/math-bridge-curriculum'),
  evaluateDiplomaBridge: (payload) => fetchApi('/horizon/diploma/math-bridge-evaluate', { method: 'POST', body: JSON.stringify(payload) }),
  evaluateBranchSuitability: (payload) => fetchApi('/horizon/branch/suitability-diagnostic', { method: 'POST', body: JSON.stringify(payload) }),
  matchScholarships: (payload) => fetchApi('/horizon/scholarships/match-eligibility', { method: 'POST', body: JSON.stringify(payload) }),
  calculateManagementQuotaFees: (payload) => fetchApi('/horizon/management-quota/calculate-fees', { method: 'POST', body: JSON.stringify(payload) }),
  convertVtuCgpa: (payload) => fetchApi('/horizon/vtu/cgpa-converter', { method: 'POST', body: JSON.stringify(payload) }),
  evaluateKarnatakaReservations: (payload) => fetchApi('/horizon/reservations/evaluate-quota', { method: 'POST', body: JSON.stringify(payload) }),
  getHostelCommuteIntel: (payload) => fetchApi('/horizon/campus-life/hostel-commute-intel', { method: 'POST', body: JSON.stringify(payload) }),
  evaluateFirstGenConcession: (payload) => fetchApi('/horizon/first-gen/evaluate-concession', { method: 'POST', body: JSON.stringify(payload) }),
  getAutonomousFreedomMatrix: (payload) => fetchApi('/horizon/colleges/autonomous-freedom-matrix', { method: 'POST', body: JSON.stringify(payload) }),
  validateStudyCertificate: (payload) => fetchApi('/horizon/verification/validate-study-certificate', { method: 'POST', body: JSON.stringify(payload) }),
  evaluateArticle371jQuota: (payload) => fetchApi('/horizon/reservations/article-371j-quota', { method: 'POST', body: JSON.stringify(payload) }),
  evaluateSportsCulturalQuota: (payload) => fetchApi('/horizon/reservations/sports-cultural-quota', { method: 'POST', body: JSON.stringify(payload) }),
  matchIncubatorGrants: (payload) => fetchApi('/horizon/startup/match-incubator-grant', { method: 'POST', body: JSON.stringify(payload) }),
  validateKeaDocumentOcr: (payload) => fetchApi('/horizon/verification/validate-document-ocr', { method: 'POST', body: JSON.stringify(payload) }),
  evaluateSeatRetentionStrategy: (payload) => fetchApi('/horizon/reservations/seat-retention-strategy', { method: 'POST', body: JSON.stringify(payload) })
};

// Vault 2: Placement & Voice AI APIs
export const interviewApi = {
  evaluateStarAnswer: (question, answer) => fetchApi('/prep/star-story/evaluate', { method: 'POST', body: JSON.stringify({ question, answer }) }),
  simulateWhiteboardResilience: (topology, simulationOptions) => fetchApi('/prep/whiteboard/resilience', { method: 'POST', body: JSON.stringify({ topology, simulationOptions }) }),
  evaluateCompensation: (offerData) => fetchApi('/prep/compensation/evaluate', { method: 'POST', body: JSON.stringify(offerData) }),
  benchmarkCandidate: (metrics) => fetchApi('/prep/benchmark/profile', { method: 'POST', body: JSON.stringify(metrics) }),
  startVoiceSession: (data) => fetchApi('/prep/voice-coach/session/start', { method: 'POST', body: JSON.stringify(data) }),
  processAudioChunk: (sessionId, transcriptSlice, durationSeconds) => fetchApi('/prep/voice-coach/session/chunk', { method: 'POST', body: JSON.stringify({ sessionId, transcriptSlice, durationSeconds }) }),
  triggerInterruption: (sessionId, candidateCurrentPoint) => fetchApi('/prep/voice-coach/session/interruption-test', { method: 'POST', body: JSON.stringify({ sessionId, candidateCurrentPoint }) }),
  finalizeVoiceSession: (sessionId, finalAnswerSample) => fetchApi('/prep/voice-coach/session/finalize', { method: 'POST', body: JSON.stringify({ sessionId, finalAnswerSample }) }),
  getWhiteboardTemplates: () => fetchApi('/prep/whiteboard/templates'),
  simulateChaos: (payload) => fetchApi('/prep/whiteboard/simulate-chaos', { method: 'POST', body: JSON.stringify(payload) }),
  disruptAtsResume: (payload) => fetchApi('/prep/resume/disrupt-ats', { method: 'POST', body: JSON.stringify(payload) }),
  generateCompensationScript: (payload) => fetchApi('/prep/compensation/negotiate-script', { method: 'POST', body: JSON.stringify(payload) }),
  profileAstCode: (payload) => fetchApi('/prep/code/profile-ast', { method: 'POST', body: JSON.stringify(payload) }),
  getSessionHistory: () => fetchApi('/prep/analytics/session-history'),
  recordMockSession: (payload) => fetchApi('/prep/analytics/record-session', { method: 'POST', body: JSON.stringify(payload) }),
  getInstitutionalTelemetry: () => fetchApi('/prep/telemetry/institutional-dashboard'),
  generateAssessment: (payload) => fetchApi('/prep/assessment/generate', { method: 'POST', body: JSON.stringify(payload) }),
  submitAssessment: (payload) => fetchApi('/prep/assessment/submit', { method: 'POST', body: JSON.stringify(payload) }),
  analyzeAudioWaveform: (payload) => fetchApi('/prep/audio/waveform-analyze', { method: 'POST', body: JSON.stringify(payload) }),
  refineStarStory: (payload) => fetchApi('/prep/star/refine-story', { method: 'POST', body: JSON.stringify(payload) }),
  estimateSystemCostSla: (payload) => fetchApi('/prep/system-design/cost-sla-estimate', { method: 'POST', body: JSON.stringify(payload) }),
  simulateCrisisScenario: (payload) => fetchApi('/prep/crisis/simulate-scenario', { method: 'POST', body: JSON.stringify(payload) }),
  analyzeBlindSpotRadar: (payload) => fetchApi('/prep/blind-spots/analyze-radar', { method: 'POST', body: JSON.stringify(payload) }),
  createPeerMockRoom: (payload) => fetchApi('/prep/peer-mock/create-room', { method: 'POST', body: JSON.stringify(payload) }),
  triggerAiTakeover: (payload) => fetchApi('/prep/peer-mock/ai-takeover-trigger', { method: 'POST', body: JSON.stringify(payload) }),
  generateLldScaffold: (payload) => fetchApi('/prep/lld/generate-scaffold', { method: 'POST', body: JSON.stringify(payload) }),
  calculateAggregateMatrix: (payload) => fetchApi('/prep/mock-aggregate/calculate-matrix', { method: 'POST', body: JSON.stringify(payload) }),
  generateEdgeCases: (payload) => fetchApi('/prep/code/generate-edge-cases', { method: 'POST', body: JSON.stringify(payload) }),
  analyzeMemoryLeaks: (payload) => fetchApi('/prep/code/analyze-memory-leaks', { method: 'POST', body: JSON.stringify(payload) }),
  analyzeConcurrencyDeadlock: (payload) => fetchApi('/prep/concurrency/analyze-deadlock', { method: 'POST', body: JSON.stringify(payload) }),
  resolveBehavioralConflict: (payload) => fetchApi('/prep/behavioral/resolve-conflict', { method: 'POST', body: JSON.stringify(payload) }),
  optimizeSqlQuery: (payload) => fetchApi('/prep/database/optimize-sql', { method: 'POST', body: JSON.stringify(payload) }),
  scanOwaspSecurity: (payload) => fetchApi('/prep/security/scan-owasp-vulnerabilities', { method: 'POST', body: JSON.stringify(payload) }),
  simulateRateLimiter: (payload) => fetchApi('/prep/system-design/simulate-rate-limiter', { method: 'POST', body: JSON.stringify(payload) }),
  compensateAudioNoiseFilter: (payload) => fetchApi('/prep/audio/noise-filter-compensate', { method: 'POST', body: JSON.stringify(payload) }),
  simulateTransactionalOutbox: (payload) => fetchApi('/prep/system-design/simulate-transactional-outbox', { method: 'POST', body: JSON.stringify(payload) })
};

// Vault 3: Hackathon OS APIs
export const hackathonApi = {
  createTeam: (data) => fetchApi('/prep/hackathon/team/create', { method: 'POST', body: JSON.stringify(data) }),
  sendTeamMessage: (teamId, content, senderName) => fetchApi('/prep/hackathon/team/message', { method: 'POST', body: JSON.stringify({ teamId, content, senderName }) }),
  generateIdeaPoll: (teamId, theme, prizeTracks) => fetchApi('/prep/hackathon/team/poll/create', { method: 'POST', body: JSON.stringify({ teamId, theme, prizeTracks }) }),
  castVote: (teamId, ideaId) => fetchApi('/prep/hackathon/team/poll/vote', { method: 'POST', body: JSON.stringify({ teamId, ideaId }) }),
  decomposeProject: (teamId, selectedIdea) => fetchApi('/prep/hackathon/team/decompose', { method: 'POST', body: JSON.stringify({ teamId, selectedIdea }) }),
  getSplitChatAdvice: (teamId, userQuery) => fetchApi('/prep/hackathon/team/split-chat', { method: 'POST', body: JSON.stringify({ teamId, userQuery }) }),
  generateTeleprompter: (projectData) => fetchApi('/prep/pitch/teleprompter', { method: 'POST', body: JSON.stringify(projectData) }),
  generate5SlideDeck: (projectData) => fetchApi('/prep/pitch/slide-deck', { method: 'POST', body: JSON.stringify(projectData) }),
  evaluateJudgeDefenseRound: (defenseData) => fetchApi('/prep/hackathon/judge-defense/round', { method: 'POST', body: JSON.stringify(defenseData) }),
  getDisasterRecovery: (projectData) => fetchApi('/prep/hackathon/disaster-recovery', { method: 'POST', body: JSON.stringify(projectData) }),
  generateSubmissionReadme: (projectData) => fetchApi('/prep/hackathon/submission-readme', { method: 'POST', body: JSON.stringify(projectData) }),
  generateDevpostSubmission: (projectData) => fetchApi('/prep/hackathon/devpost-submission', { method: 'POST', body: JSON.stringify(projectData) }),
  exportMarpDeck: (projectData) => fetchApi('/prep/pitch/marp-export', { method: 'POST', body: JSON.stringify(projectData) }),
  analyzeTeamSynergy: (teamData) => fetchApi('/prep/hackathon/team/synergy-analyze', { method: 'POST', body: JSON.stringify(teamData) }),
  getPitchTimerConfig: (timerPayload) => fetchApi('/prep/pitch/timer-config', { method: 'POST', body: JSON.stringify(timerPayload || {}) }),
  matchSponsorBounties: (payload) => fetchApi('/prep/hackathon/sponsor-bounties/match', { method: 'POST', body: JSON.stringify(payload) }),
  searchWinningSolutionsRag: (payload) => fetchApi('/prep/hackathon/solutions/rag-search', { method: 'POST', body: JSON.stringify(payload) }),
  generateStageDemoScript: (payload) => fetchApi('/prep/hackathon/stage-demo/generate-script', { method: 'POST', body: JSON.stringify(payload) }),
  generateJudgeCounterDefense: (payload) => fetchApi('/prep/hackathon/judge-objections/generate-counter-defense', { method: 'POST', body: JSON.stringify(payload) }),
  generateSponsorSdkQuickstart: (payload) => fetchApi('/prep/hackathon/sdk-quickstart/generate', { method: 'POST', body: JSON.stringify(payload) }),
  runPrototypeStressTest: (payload) => fetchApi('/prep/hackathon/prototype/stress-test', { method: 'POST', body: JSON.stringify(payload) }),
  generateIpGovernancePackage: (payload) => fetchApi('/prep/hackathon/governance/generate-ip-package', { method: 'POST', body: JSON.stringify(payload) }),
  whisperJudgeDefense: (payload) => fetchApi('/prep/hackathon/judge/realtime-whisper', { method: 'POST', body: JSON.stringify(payload) }),
  generatePostMortemAnalytics: (payload) => fetchApi('/prep/hackathon/post-mortem/generate-analytics', { method: 'POST', body: JSON.stringify(payload) }),
  generatePwaOfflineBundle: (payload) => fetchApi('/prep/hackathon/offline/generate-pwa-bundle', { method: 'POST', body: JSON.stringify(payload) }),
  generatePitchStoryboard: (payload) => fetchApi('/prep/hackathon/video/generate-pitch-storyboard', { method: 'POST', body: JSON.stringify(payload) })
};












