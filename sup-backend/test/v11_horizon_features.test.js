const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const { evaluateStudentDiagnostic } = require('../modules/horizon/diagnosticEngine');
const { getExamNotifications } = require('../modules/horizon/examRadarEngine');
const { getPyqQuestions, evaluateMockExam } = require('../modules/horizon/pyqDatabase');
const { getSeniorMentors } = require('../modules/horizon/mentorshipEngine');
const { getRoadmap, listRoadmaps } = require('../modules/horizon/roadmapEngine');
const { generateDailyChecklist, generateMonthlyMilestones } = require('../modules/horizon/checklistEngine');
const { getResources } = require('../modules/horizon/resourceRepository');
const { exploreDomainByStage } = require('../modules/horizon/domainExplorer');
const { getGapGuide, listGapGuides } = require('../modules/horizon/gapGuideEngine');

let mongoServer;

test.before(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

test.after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

test('evaluateStudentDiagnostic matches Tech sector correctly', async () => {
  const dummyId = new mongoose.Types.ObjectId().toString();
  const result = await evaluateStudentDiagnostic(dummyId, {
    academicStage: '2nd_pu',
    interests: ['software', 'coding']
  });

  assert.equal(result.success, true);
  assert.equal(result.matchedWorld, 'tech_world');
});

test('evaluateStudentDiagnostic matches Commerce sector correctly', async () => {
  const dummyId = new mongoose.Types.ObjectId().toString();
  const result = await evaluateStudentDiagnostic(dummyId, {
    academicStage: 'commerce',
    interests: ['commerce', 'finance']
  });

  assert.equal(result.success, true);
  assert.equal(result.matchedWorld, 'commerce_world');
});

test('getExamNotifications filters KCET and DCET entrance exams', async () => {
  const allExams = await getExamNotifications({});
  assert.ok(allExams.count >= 4);

  const dcetOnly = await getExamNotifications({ examKey: 'dcet' });
  assert.equal(dcetOnly.exams[0].examName, 'DCET (Diploma Common Entrance Test)');
});

test('getPyqQuestions returns subject-filtered questions', async () => {
  const mathPyqs = await getPyqQuestions({ subject: 'Mathematics' });
  assert.ok(mathPyqs.questions.length > 0);
  assert.ok(mathPyqs.questions[0].subject.includes('Mathematics'));
});

test('evaluateMockExam scores answers correctly', async () => {
  const mockResult = await evaluateMockExam({
    examKey: 'kcet',
    answers: [
      { questionId: 'kcet_math_2025_01', selectedOptionIndex: 0 } // Correct option (8 or -8)
    ]
  });

  assert.equal(mockResult.success, true);
  assert.equal(mockResult.results.correctCount, 1);
  assert.equal(mockResult.results.percentageScore, 100);
});

test('getSeniorMentors returns verified alumni advice cards', async () => {
  const mentors = await getSeniorMentors({ world: 'tech_world' });
  assert.ok(mentors.mentors.length === 1);
  assert.equal(mentors.mentors[0].verifiedAlumni, true);
});

// The remaining tests are for synchronous roadmap/checklist modules
test('getRoadmap and listRoadmaps return 4-phase structured domain roadmaps', () => {
  const list = listRoadmaps({});
  assert.ok(list.count >= 5);

  const webRoadmap = getRoadmap('fullstack_web');
  assert.equal(webRoadmap.success, true);
  assert.equal(webRoadmap.roadmap.phases.length, 4);
  assert.equal(webRoadmap.roadmap.phases[0].name, 'Zero-to-One Foundation');
});

test('generateDailyChecklist returns day-specific tasks with XP rewards', () => {
  const checklist = generateDailyChecklist({ domainKey: 'fullstack_web', phaseId: 1, dayOfMonth: 1 });
  assert.equal(checklist.success, true);
  assert.ok(checklist.dailyTasks.length > 0);
  assert.ok(checklist.totalXpAvailable > 0);
});

test('generateMonthlyMilestones returns phase milestone', () => {
  const milestone = generateMonthlyMilestones({ domainKey: 'fullstack_web', phaseId: 1 });
  assert.equal(milestone.success, true);
  assert.ok(milestone.milestone.xpReward >= 100);
});

test('getResources returns verified learning links per phase', () => {
  const resources = getResources({ domainKey: 'fullstack_web', phase: 1, freeOnly: true });
  assert.equal(resources.success, true);
  assert.ok(resources.count >= 2);
});

test('exploreDomainByStage returns stage-appropriate streams and exams', () => {
  const explore10th = exploreDomainByStage('10th');
  assert.equal(explore10th.success, true);
  assert.ok(explore10th.availableStreams.length >= 3);
});

test('getGapGuide and listGapGuides return A-to-Z domain pathway guides', () => {
  const list = listGapGuides({});
  assert.ok(list.count >= 5);

  const caGuide = getGapGuide('commerce_ca');
  assert.equal(caGuide.success, true);
  assert.ok(caGuide.guide.stepByStepPathway.length >= 4);
  assert.ok(caGuide.guide.topMistakesToAvoid.length >= 3);
});
