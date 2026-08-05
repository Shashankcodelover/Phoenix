/**
 * Phoenix v7.0: Comprehensive Intelligence & Engine Unit Test Suite
 * 
 * Tests:
 *   1. LRU Response Cache (hits, misses, key generation)
 *   2. Question Bank Data & Multi-Filtering (DSA, Aptitude, Core CS, System Design)
 *   3. Company Intelligence Engine Profiles
 *   4. Hackathon Winner Solutions RAG Retrieval
 *   5. Live AI Judge Defense Simulator Controller
 *   6. ATS Resume Diff & Optimizer Engine
 *   7. Placement Readiness Index Telemetry Engine
 */

const test = require('node:test');
const assert = require('node:assert/strict');

// Import modules to test using correct relative paths from sup-backend/test/
const { ResponseCache, ideaCache, roadmapCache, reviewCache } = require('../middleware/responseCache');
const { questions: PYQ_DATABASE } = require('../modules/interview-prep/questionBankData');
const { getCompanyProfile, COMPANY_INTELLIGENCE } = require('../modules/interview-prep/companyIntelligence');
const { WINNING_PROJECTS, retrieveWinningProjects } = require('../modules/hackathon-agent/hackathonWinnersData');
const { runJudgeDefenseSim } = require('../modules/hackathon-agent/judgeSimulatorController');
const { generateResumeDiff } = require('../modules/interview-prep/resumeDiffEngine');
const { getReadinessIndex } = require('../modules/gamification/telemetryController');

test('LRU Response Cache Engine Tests', async (t) => {
  await t.test('ResponseCache sets and gets cached values', () => {
    const cache = new ResponseCache({ maxEntries: 5, ttlMs: 10000 });
    const key = cache.generateKey('test', { foo: 'bar' });
    
    assert.equal(cache.get(key), null, 'Initial cache should be empty');
    cache.set(key, { result: 'success' });
    assert.deepEqual(cache.get(key), { result: 'success' }, 'Should return cached object');
    assert.equal(cache.getStats().hits, 1, 'Hit count should be 1');
  });

  await t.test('ResponseCache key generation is deterministic regardless of key order', () => {
    const cache = new ResponseCache();
    const key1 = cache.generateKey('test', { a: 1, b: 2 });
    const key2 = cache.generateKey('test', { b: 2, a: 1 });
    assert.equal(key1, key2, 'Deterministic hashing should produce identical key regardless of object key order');
  });

  await t.test('ResponseCache evicts oldest item when maxEntries is exceeded', () => {
    const cache = new ResponseCache({ maxEntries: 2, ttlMs: 10000 });
    cache.set('key1', 'val1');
    cache.set('key2', 'val2');
    cache.set('key3', 'val3');

    assert.equal(cache.get('key1'), null, 'key1 should be evicted');
    assert.equal(cache.get('key2'), 'val2', 'key2 should remain');
    assert.equal(cache.get('key3'), 'val3', 'key3 should remain');
  });
});

test('Question Bank Data & Intelligence Filtering Tests', async (t) => {
  await t.test('PYQ Database is non-empty and formatted correctly', () => {
    assert.ok(Array.isArray(PYQ_DATABASE), 'PYQ_DATABASE must be an array');
    assert.ok(PYQ_DATABASE.length >= 15, 'PYQ_DATABASE should have comprehensive questions');
    
    const sample = PYQ_DATABASE[0];
    assert.ok(sample.id, 'Question must have id');
    assert.ok(sample.title, 'Question must have title');
    assert.ok(Array.isArray(sample.companyTags), 'Question must have companyTags array');
    assert.ok(Array.isArray(sample.roleTags), 'Question must have roleTags array');
  });

  await t.test('Company filtering returns correct company questions', () => {
    const googleQuestions = PYQ_DATABASE.filter(q => q.companyTags.some(t => t.toLowerCase() === 'google'));
    assert.ok(googleQuestions.length > 0, 'Should find questions tagged with Google');
  });
});

test('Company Intelligence Profile Tests', async (t) => {
  await t.test('getCompanyProfile returns valid profile for Google', () => {
    const profile = getCompanyProfile('google');
    assert.equal(profile.companyName, 'Google');
    assert.ok(Array.isArray(profile.hiringRounds), 'Hiring rounds must be array');
    assert.ok(profile.topicWeightages.dsa > 0, 'DSA weightage should be specified');
  });

  await t.test('getCompanyProfile falls back gracefully for unknown company', () => {
    const profile = getCompanyProfile('unknown_company_xyz');
    assert.ok(profile, 'Should return default fallback profile');
    assert.ok(profile.companyName, 'Fallback profile should have companyName');
  });
});

test('Hackathon Winner Solutions RAG Tests', async (t) => {
  await t.test('WINNING_PROJECTS archive contains real winning blueprints', () => {
    assert.ok(Array.isArray(WINNING_PROJECTS), 'WINNING_PROJECTS must be array');
    assert.ok(WINNING_PROJECTS.length >= 5, 'Should contain at least 5 winner blueprints');
  });

  await t.test('retrieveWinningProjects returns relevant results for query', () => {
    const results = retrieveWinningProjects('water contamination', 2);
    assert.ok(Array.isArray(results), 'Results should be array');
    assert.ok(results.length > 0, 'Should retrieve matching winner blueprint for water query');
    assert.ok(results[0].projectTitle.includes('AquaShield') || results[0].winningTrack.includes('Water'), 'Should match water project');
  });
});

test('Live AI Judge Defense Simulator Tests', async (t) => {
  await t.test('runJudgeDefenseSim handles Round 1 response structure', async () => {
    const req = {
      body: {
        projectTitle: 'Test Project',
        projectDescription: 'Test Description',
        techStack: ['Node.js', 'React'],
        currentRound: 1
      }
    };
    const res = {
      json: (data) => {
        assert.equal(data.projectTitle, 'Test Project');
        assert.equal(data.round, 1);
        assert.ok(data.simState, 'simState must be present');
        assert.ok(data.simState.nextQuestion, 'nextQuestion must be present');
      },
      status: () => res
    };

    await runJudgeDefenseSim(req, res);
  });

  await t.test('runJudgeDefenseSim returns final scorecard on Round 4', async () => {
    const req = {
      body: {
        projectTitle: 'Test Project',
        projectDescription: 'Test Description',
        techStack: ['Node.js', 'React'],
        currentRound: 4,
        history: [{ round: 1, userAnswer: 'Answer 1' }]
      }
    };
    const res = {
      json: (data) => {
        assert.equal(data.round, 4);
        assert.equal(data.isCompleted, true);
        assert.ok(data.verdictScorecard, 'verdictScorecard must be present');
        assert.ok(data.verdictScorecard.overallScore >= 0, 'overallScore must be valid');
      },
      status: () => res
    };

    await runJudgeDefenseSim(req, res);
  });
});

test('ATS Resume Diff Engine Tests', async (t) => {
  await t.test('generateResumeDiff returns structured diff analysis', async () => {
    const req = {
      body: {
        resumeText: 'Software Engineer student with experience in React and Node.js.',
        targetCompany: 'Google',
        targetRole: 'SDE-1'
      }
    };
    const res = {
      json: (data) => {
        assert.equal(data.targetCompany, 'Google');
        assert.equal(data.targetRole, 'SDE-1');
        assert.ok(data.analysis, 'analysis must be present');
        assert.ok(data.analysis.originalAtsScore >= 0, 'originalAtsScore must be valid');
        assert.ok(data.analysis.optimizedAtsScore > data.analysis.originalAtsScore, 'optimizedAtsScore should be higher');
      },
      status: () => res
    };

    await generateResumeDiff(req, res);
  });
});

test('Placement Readiness Telemetry Index Tests', async (t) => {
  await t.test('getReadinessIndex calculates readiness percentage and advice', async () => {
    const req = {
      params: { userId: 'guest' },
      query: { targetCompany: 'amazon' }
    };
    const res = {
      json: (data) => {
        assert.equal(data.userId, 'guest');
        assert.equal(data.targetCompany, 'AMAZON');
        assert.ok(data.readinessIndex, 'readinessIndex string must be present');
        assert.ok(data.rawScore >= 0 && data.rawScore <= 100, 'rawScore must be between 0 and 100');
        assert.ok(data.weakestArea, 'weakestArea object must be present');
      },
      status: () => res
    };

    await getReadinessIndex(req, res);
  });
});
