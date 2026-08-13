const { describe, it } = require('node:test');
const assert = require('node:assert');

const { SmartScholarshipMatcher } = require('../modules/horizon/smartScholarshipMatcher');
const { MentorExchangeEngine } = require('../modules/horizon/mentorExchangeEngine');
const { DomainSkillQuizEngine } = require('../modules/horizon/domainSkillQuizEngine');

const { StarStoryMatrixEngine } = require('../modules/interview-prep/starStoryMatrixEngine');
const { WhiteboardTopologySimulator } = require('../modules/interview-prep/whiteboardTopologySimulator');
const { CompensationNegotiatorEngine } = require('../modules/interview-prep/compensationNegotiatorEngine');

const { PitchTeleprompterEngine } = require('../modules/hackathon-agent/pitchTeleprompterEngine');
const { DemoDisasterRecoveryHub } = require('../modules/hackathon-agent/demoDisasterRecoveryHub');
const { SubmissionGeneratorEngine } = require('../modules/hackathon-agent/submissionGeneratorEngine');

describe('V23 Feature Suite — Vault Triad Next-Level Breakthrough Engines', () => {

  // ══════════════════════════════════════════════════════════
  // VAULT 1: HORIZON (ENTRANCE & CAREER PATHWAYS)
  // ══════════════════════════════════════════════════════════
  describe('1. Vault 1 (Horizon Pathways & Scholarships)', () => {
    const scholarshipMatcher = new SmartScholarshipMatcher();
    const mentorEngine = new MentorExchangeEngine();
    const quizEngine = new DomainSkillQuizEngine();

    it('matches Karnataka scholarships and calculates fee waiver savings', () => {
      const matchReport = scholarshipMatcher.matchScholarships({
        stream: 'Engineering',
        annualIncome: 150000,
        academicPercentage: 85,
        category: 'OBC'
      });

      assert.ok(matchReport.totalMatched >= 2);
      assert.ok(matchReport.matchedScholarships[0].name.includes('SSP') || matchReport.matchedScholarships[0].name.includes('Vidyasiri'));
      assert.ok(matchReport.actionableChecklist.length === 3);
    });

    it('matches verified alumni mentors and dispatches student questions', () => {
      const matchResult = mentorEngine.matchMentor('KCET Top 500 Strategy');
      assert.ok(matchResult.recommendedMentors.length >= 1);
      assert.ok(matchResult.suggestedQuestions.length >= 2);

      const submitResult = mentorEngine.submitQuestion({
        studentId: 'student_123',
        mentorId: matchResult.recommendedMentors[0].id,
        question: 'How to manage time between Board exams and KCET?'
      });
      assert.strictEqual(submitResult.success, true);
      assert.strictEqual(submitResult.thread.status, 'DISPATCHED_TO_MENTOR');
    });

    it('generates domain readiness quiz and evaluates submission score', () => {
      const quiz = quizEngine.generateAssessment('cybersecurity');
      assert.strictEqual(quiz.domainKey, 'cybersecurity');
      assert.ok(quiz.questions.length >= 2);

      const evaluation = quizEngine.evaluateSubmission('cybersecurity', [0, 0]);
      assert.strictEqual(evaluation.scorePercent, 100);
      assert.strictEqual(evaluation.correctCount, 2);
      assert.ok(evaluation.skillLevel.includes('Advanced'));
    });
  });

  // ══════════════════════════════════════════════════════════
  // VAULT 2: INTERVIEW SPRINT OS (PLACEMENT & VOICE AI)
  // ══════════════════════════════════════════════════════════
  describe('2. Vault 2 (Interview Sprint & Behavioral Impact)', () => {
    const starEngine = new StarStoryMatrixEngine();
    const whiteboardSim = new WhiteboardTopologySimulator();
    const compEngine = new CompensationNegotiatorEngine();

    it('scores behavioral STAR answers with quantified impact detection', () => {
      const result = starEngine.evaluateStarAnswer(
        'Tell me about a time you optimized a slow system.',
        'During my previous internship when the team was facing heavy traffic, I was tasked with fixing API bottlenecks. I built an in-memory Redis caching layer and optimized SQL indexing, which resulted in reduced API latency by 45% and scaled our throughput to 10k users.'
      );

      assert.strictEqual(result.starCompliance.situation, true);
      assert.strictEqual(result.starCompliance.task, true);
      assert.strictEqual(result.starCompliance.action, true);
      assert.strictEqual(result.starCompliance.result, true);
      assert.strictEqual(result.starCompliance.quantifiedMetrics, true);
      assert.ok(result.starScore >= 90);
      assert.ok(result.rating.includes('Exemplary'));
    });

    it('simulates system design whiteboard resilience and database crash failover', () => {
      const resilienceReport = whiteboardSim.simulateResilience(
        {
          nodes: [
            { id: 'lb', type: 'LoadBalancer' },
            { id: 'app1', type: 'AppServer' },
            { id: 'app2', type: 'AppServer' },
            { id: 'cache', type: 'RedisCache' },
            { id: 'primary_db', type: 'PostgreSQLPrimary' },
            { id: 'replica_db', type: 'PostgreSQLReplica' }
          ]
        },
        { rpsTraffic: 30000, injectFailureNode: 'primary_db' }
      );

      assert.strictEqual(resilienceReport.totalNodes, 6);
      assert.strictEqual(resilienceReport.spofsDetected.length, 0);
      assert.ok(resilienceReport.failureSimulationReport.includes('Auto-failover triggered'));
    });

    it('benchmarks compensation offers and drafts counter-offer negotiation scripts', () => {
      const negotiationReport = compEngine.evaluateOffer({
        roleLevel: 'SDE1',
        baseSalary: 1600000,
        joiningBonus: 200000,
        stocksEsopsYearly: 300000,
        hasCompetingOffer: true,
        competingTotal: 2500000
      });

      assert.strictEqual(negotiationReport.roleLevel, 'SDE1');
      assert.ok(negotiationReport.currentTotalCTC.includes('21.0 LPA'));
      assert.ok(negotiationReport.negotiationLeverage.includes('High'));
      assert.ok(negotiationReport.counterOfferScript.includes('competing offer'));
    });
  });

  // ══════════════════════════════════════════════════════════
  // VAULT 3: HACKATHON OS (TEAM SERVER & PITCHING)
  // ══════════════════════════════════════════════════════════
  describe('3. Vault 3 (Hackathon OS & Live Pitch)', () => {
    const teleprompter = new PitchTeleprompterEngine();
    const recoveryHub = new DemoDisasterRecoveryHub();
    const submissionGen = new SubmissionGeneratorEngine();

    it('generates 3-minute pitch teleprompter milestones and pacing alerts', () => {
      const script = teleprompter.generateTeleprompter({
        title: 'Phoenix AI',
        tagline: 'Enterprise Career & Hackathon OS'
      });

      assert.strictEqual(script.totalDurationSeconds, 180);
      assert.strictEqual(script.sections.length, 4);
      assert.strictEqual(script.pacingAlarmThresholds.length, 3);
    });

    it('creates instant offline mock datasets and spoken disaster recovery scripts', () => {
      const pkg = recoveryHub.generateRecoveryPackage({ title: 'Phoenix AI' });
      assert.strictEqual(pkg.disasterRecoveryActive, true);
      assert.ok(pkg.offlineMockPayloads.systemDesignScorecard.sla.includes('99.99%'));
      assert.ok(pkg.spokenRecoveryScript.includes('procedural fallbacks'));
    });

    it('compiles compliant Devpost markdown submission and project badges', () => {
      const submission = submissionGen.generateSubmission({
        title: 'Phoenix AI Platform',
        tagline: 'Autonomous CS Operating System'
      });

      assert.ok(submission.devpostFormattedMarkdown.includes('# 🚀 Phoenix AI Platform'));
      assert.ok(submission.badges.length >= 3);
      assert.ok(submission.recommendedPrizeTracks.includes('Best Use of AI'));
    });
  });
});
