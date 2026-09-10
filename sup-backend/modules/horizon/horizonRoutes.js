const express = require('express');
const router = express.Router();
const horizonController = require('./horizonController');
const { validate, schemas } = require('../../middleware/inputValidator');
const { protect, protectOptional } = require('../../middleware/authMiddleware');

// Diagnostic onboarding assessment
router.post('/diagnostic', protectOptional, validate(schemas.horizonDiagnostic), horizonController.submitDiagnostic);

// Multi-Sector Domain Roadmaps
router.get('/roadmaps', horizonController.getRoadmapsList);
router.get('/roadmaps/:domainKey', horizonController.getRoadmapByKey);

// Daily & Monthly Action Checklists
router.get('/checklists/daily', horizonController.getDailyChecklist);
router.get('/checklists/milestones', horizonController.getMonthlyMilestones);

// Verified Resource & Link Repository
router.get('/resources', horizonController.getResourcesList);

// Entrance Exam Radar alerts (KCET, DCET, NEET, CA, JEE)
router.get('/exams', protectOptional, validate(schemas.horizonExamQuery), horizonController.getExams);

// PYQ Question Bank & Search
router.get('/pyqs', protectOptional, horizonController.getPyqs);

// Timed Mock Exam Submission & Evaluator
router.post('/pyq/evaluate', protectOptional, validate(schemas.horizonPyqSubmit), horizonController.evaluatePyqMock);

// Senior Alumni Mentorship Bridge
router.get('/mentors', protectOptional, horizonController.getMentors);

// Stage-Based Domain Explorer ("What's out there at my stage?")
router.get('/explorer/:stageKey', horizonController.getStageExplorer);

// A-to-Z Gap & Pathway Guides
router.get('/guides', horizonController.getGapGuidesList);
router.get('/guides/:domainKey', horizonController.getGapGuideByKey);

// AI Bot Chat (world-dashboard)
router.post('/bot/chat', protectOptional, horizonController.botChat);

// Daily 2-3 Hour Learning Session Tracker
router.post('/session/log', protectOptional, horizonController.logSession);

// DAY 2: Regional Karnataka Entrance & VTU Engineering Bridges
router.get('/dcet/bridge', protectOptional, horizonController.getDcetBridge);
router.post('/dcet/bridge/evaluate', protectOptional, horizonController.evaluateDcetBridge);
router.get('/colleges/cutoffs', protectOptional, horizonController.getCollegeTrends);
router.post('/colleges/chances', protectOptional, horizonController.predictCollegeChances);
router.post('/scholarships/evaluate', protectOptional, horizonController.evaluateScholarship);
router.post('/karnataka/371j', protectOptional, horizonController.evaluateArticle371J);

// Feature 41: Multi-Stream Admissions & Cutoff Predictor (Public/Optional Auth)
const { multiStreamAdmissionsEngine } = require('./multiStreamAdmissionsEngine');

router.get('/admissions/streams', (req, res) => {
  res.json(multiStreamAdmissionsEngine.getStreamsAndQuotas());
});

router.get('/admissions/colleges', (req, res) => {
  res.json(multiStreamAdmissionsEngine.getColleges(req.query.stream));
});

router.post('/admissions/predict', (req, res) => {
  try {
    const result = multiStreamAdmissionsEngine.predictAdmissions(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Feature 42: Institutional Tier & Accreditation Matrix (Public/Optional Auth)
const { institutionalTierMatrixEngine } = require('./institutionalTierMatrixEngine');

router.get('/tiers/catalog', (req, res) => {
  res.json({ success: true, catalog: institutionalTierMatrixEngine.getCatalog() });
});

router.get('/tiers/college/:code', (req, res) => {
  try {
    const result = institutionalTierMatrixEngine.getInstitution(req.params.code);
    res.json(result);
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
});

router.post('/tiers/compare', (req, res) => {
  try {
    const { colleges } = req.body;
    const result = institutionalTierMatrixEngine.compareInstitutions(colleges);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/tiers/roi-calculator', (req, res) => {
  try {
    const { collegeCode, customTuitionInr } = req.body;
    const inst = institutionalTierMatrixEngine.getInstitution(collegeCode);
    const customRoi = institutionalTierMatrixEngine.calculateRoiMetrics(inst.institution, customTuitionInr);
    res.json({ success: true, college: inst.institution.name, roiMetrics: customRoi });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Feature 43: Scholarship & Financial Aid Eligibility Matcher (Public/Optional Auth)
const { universalScholarshipMatcherEngine } = require('./universalScholarshipMatcherEngine');

router.get('/scholarships/v2/catalog', (req, res) => {
  res.json({ success: true, catalog: universalScholarshipMatcherEngine.getCatalog() });
});

router.get('/scholarships/v2/presets', (req, res) => {
  res.json({ success: true, presets: universalScholarshipMatcherEngine.getPresets() });
});

router.post('/scholarships/v2/match', (req, res) => {
  try {
    const result = universalScholarshipMatcherEngine.matchScholarships(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Feature 44: Branch Transition & Career Pivot Simulator (Public/Optional Auth)
const { branchTransitionEngine } = require('./branchTransitionEngine');

router.get('/branch-pivot/colleges', (req, res) => {
  res.json(branchTransitionEngine.getCollegesAndBranches());
});

router.get('/branch-pivot/presets', (req, res) => {
  res.json({ success: true, presets: branchTransitionEngine.getPresets() });
});

router.post('/branch-pivot/simulate', (req, res) => {
  try {
    const result = branchTransitionEngine.simulate(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Feature 45: Universal Credit Transfer & Transcript Evaluator (Public/Optional Auth)
const { universalTranscriptEvaluatorEngine } = require('./universalTranscriptEvaluatorEngine');

router.get('/transcript-eval/grading-systems', (req, res) => {
  res.json(universalTranscriptEvaluatorEngine.getGradingSystems());
});

router.get('/transcript-eval/presets', (req, res) => {
  res.json({ success: true, presets: universalTranscriptEvaluatorEngine.getPresets() });
});

router.post('/transcript-eval/evaluate', (req, res) => {
  try {
    const result = universalTranscriptEvaluatorEngine.evaluate(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Feature 46: Campus Placement Intelligence & Offer Histograms (Public/Optional Auth)
const { campusPlacementIntelEngine } = require('./campusPlacementIntelEngine');

router.get('/placement-intel/colleges', (req, res) => {
  res.json(campusPlacementIntelEngine.getCollegesList());
});

router.get('/placement-intel/presets', (req, res) => {
  res.json({ success: true, presets: campusPlacementIntelEngine.getPresets() });
});

router.post('/placement-intel/analyze', (req, res) => {
  try {
    const result = campusPlacementIntelEngine.analyze(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Feature 47: Institutional Gatekeeper Assessment Engine (Public/Optional Auth)
const { institutionalGatekeeperEngine } = require('./institutionalGatekeeperEngine');

router.get('/gatekeeper/exam-schema', (req, res) => {
  res.json(institutionalGatekeeperEngine.getExamSchema());
});

router.get('/gatekeeper/presets', (req, res) => {
  res.json({ success: true, presets: institutionalGatekeeperEngine.getPresets() });
});

router.post('/gatekeeper/evaluate', (req, res) => {
  try {
    const result = institutionalGatekeeperEngine.evaluate(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Feature 48: Alumni Mentorship & Career Network Connector (Public/Optional Auth)
const { alumniNetworkEngine } = require('./alumniNetworkEngine');

router.get('/alumni/directory', (req, res) => {
  res.json(alumniNetworkEngine.getDirectory(req.query));
});

router.get('/alumni/presets', (req, res) => {
  res.json({ success: true, presets: alumniNetworkEngine.getPresets() });
});

router.post('/alumni/generate-intro-note', (req, res) => {
  try {
    const result = alumniNetworkEngine.generateIntroNote(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/alumni/book-session', (req, res) => {
  try {
    const result = alumniNetworkEngine.bookSession(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Feature 49: Research Publication & Lab Matcher (Public/Optional Auth)
const { researchLabMatcherEngine } = require('./researchLabMatcherEngine');

router.get('/research/labs', (req, res) => {
  res.json(researchLabMatcherEngine.getLabsList());
});

router.get('/research/presets', (req, res) => {
  res.json({ success: true, presets: researchLabMatcherEngine.getPresets() });
});

router.post('/research/match', (req, res) => {
  try {
    const result = researchLabMatcherEngine.match(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/research/generate-statement', (req, res) => {
  try {
    const result = researchLabMatcherEngine.generateStatement(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Feature 50: Study Abroad & Global MS/PhD Admissions Engine (Public/Optional Auth)
const { studyAbroadEngine } = require('./studyAbroadEngine');
const competitiveExamEngine = require('./competitiveExamPlannerEngine');
const internshipEngine = require('./industryInternshipTrackerEngine');
const skillGapEngine = require('./dynamicSkillGapAuditorEngine');
const sopEngine = require('./highStakesSopSynthesizerEngine');
const lorEngine = require('./facultyLorDrafterEngine');
const visaEngine = require('./visaImmigrationSimulatorEngine');

router.get('/study-abroad/universities', (req, res) => {
  res.json(studyAbroadEngine.getUniversities());
});

router.get('/study-abroad/presets', (req, res) => {
  res.json({ success: true, presets: studyAbroadEngine.getPresets() });
});

router.post('/study-abroad/evaluate', (req, res) => {
  try {
    const result = studyAbroadEngine.evaluate(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Feature 51: Competitive Exam Sprint Planner & Mock Proctor
router.get('/exam-planner/exams', (req, res) => {
  res.json({ success: true, exams: competitiveExamEngine.getExams() });
});

router.get('/exam-planner/presets', (req, res) => {
  res.json({ success: true, presets: competitiveExamEngine.getPresets() });
});

router.post('/exam-planner/sprint-plan', (req, res) => {
  try {
    const plan = competitiveExamEngine.generateSprintPlan(req.body);
    res.json({ success: true, plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/exam-planner/evaluate-mock', (req, res) => {
  try {
    const diagnostic = competitiveExamEngine.evaluateMockPerformance(req.body);
    res.json({ success: true, diagnostic });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Feature 52: Industry Internship Pipeline & Stipend Tracker
router.get('/internships/board', (req, res) => {
  const filter = {
    category: req.query.category,
    minStipend: req.query.minStipend,
    search: req.query.search
  };
  res.json({ success: true, internships: internshipEngine.getInternships(filter) });
});

router.get('/internships/stipend-index', (req, res) => {
  res.json({ success: true, index: internshipEngine.getStipendIndex() });
});

router.get('/internships/presets', (req, res) => {
  res.json({ success: true, presets: internshipEngine.getPresets() });
});

router.post('/internships/referral-pitch', (req, res) => {
  try {
    const pitch = internshipEngine.generateReferralPitch(req.body);
    res.json({ success: true, pitch });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/internships/pipeline-summary', (req, res) => {
  try {
    const summary = internshipEngine.summarizePipeline(req.body.applications);
    res.json({ success: true, summary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Feature 53: Dynamic Skill Gap & Certification Pathway Auditor
router.get('/skill-gap/certifications', (req, res) => {
  res.json({ success: true, certifications: skillGapEngine.getCertifications() });
});

router.get('/skill-gap/archetypes', (req, res) => {
  res.json({ success: true, archetypes: skillGapEngine.getJobArchetypes() });
});

router.get('/skill-gap/presets', (req, res) => {
  res.json({ success: true, presets: skillGapEngine.getPresets() });
});

router.post('/skill-gap/audit', (req, res) => {
  try {
    const result = skillGapEngine.auditSkillGap(req.body);
    res.json({ success: true, audit: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Feature 54: High-Stakes SOP & Personal Statement Synthesizer
router.get('/sop/templates', (req, res) => {
  res.json({ success: true, templates: sopEngine.getTemplates() });
});

router.get('/sop/presets', (req, res) => {
  res.json({ success: true, presets: sopEngine.getPresets() });
});

router.post('/sop/synthesize', (req, res) => {
  try {
    const sop = sopEngine.synthesizeSOP(req.body);
    res.json({ success: true, sop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Feature 55: Faculty Recommendation Letter (LOR) Drafter
router.get('/lor/archetypes', (req, res) => {
  res.json({ success: true, archetypes: lorEngine.getLorArchetypes() });
});

router.get('/lor/presets', (req, res) => {
  res.json({ success: true, presets: lorEngine.getPresets() });
});

router.post('/lor/draft', (req, res) => {
  try {
    const draft = lorEngine.draftLOR(req.body);
    res.json({ success: true, draft });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Feature 56: Visa & Immigration Readiness Simulator
router.get('/visa/categories', (req, res) => {
  res.json({ success: true, categories: visaEngine.getVisaCategories() });
});

router.get('/visa/questions', (req, res) => {
  res.json({ success: true, questions: visaEngine.getMockQuestions() });
});

router.get('/visa/presets', (req, res) => {
  res.json({ success: true, presets: visaEngine.getPresets() });
});

router.post('/visa/evaluate-risk', (req, res) => {
  try {
    const evaluation = visaEngine.evaluateVisaReadiness(req.body);
    res.json({ success: true, evaluation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/visa/score-answer', (req, res) => {
  try {
    const scored = visaEngine.scoreConsularAnswer(req.body.questionId, req.body.answerText);
    res.json({ success: true, scored });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Feature 57: Placement Officer Institutional Analytics Dashboard (TPO Cockpit)
const { tpoAnalyticsDashboardEngine } = require('./tpoAnalyticsDashboardEngine');

router.get('/tpo/summary', (req, res) => {
  res.json({ success: true, summary: tpoAnalyticsDashboardEngine.getInstitutionalSummary() });
});

router.get('/tpo/presets', (req, res) => {
  res.json({ success: true, presets: tpoAnalyticsDashboardEngine.getPresets() });
});

router.get('/tpo/department/:deptCode', (req, res) => {
  try {
    const result = tpoAnalyticsDashboardEngine.filterDepartment(req.params.deptCode);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/tpo/triage', (req, res) => {
  try {
    const triage = tpoAnalyticsDashboardEngine.triageUnplacedStudent(req.body);
    res.json({ success: true, triage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Feature 58: Salary Purchasing Power & Relocation Comparator (PPP Engine)
const { salaryPppRelocationEngine } = require('./salaryPppRelocationEngine');

router.get('/salary-ppp/hubs', (req, res) => {
  res.json({ success: true, hubs: salaryPppRelocationEngine.getTechHubs() });
});

router.get('/salary-ppp/presets', (req, res) => {
  res.json({ success: true, presets: salaryPppRelocationEngine.getPresets() });
});

router.post('/salary-ppp/compare', (req, res) => {
  try {
    const comparison = salaryPppRelocationEngine.compareRelocationOffer(req.body);
    res.json({ success: true, comparison });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Feature 59: Post-Graduation Career Trajectory Forecaster
const { postGradTrajectoryEngine } = require('./postGradTrajectoryEngine');

router.get('/trajectory/tracks', (req, res) => {
  res.json({ success: true, tracks: postGradTrajectoryEngine.getCareerTracks() });
});

router.get('/trajectory/presets', (req, res) => {
  res.json({ success: true, presets: postGradTrajectoryEngine.getPresets() });
});

router.post('/trajectory/forecast', (req, res) => {
  try {
    const forecast = postGradTrajectoryEngine.forecastTrajectory(req.body);
    res.json({ success: true, forecast });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;



