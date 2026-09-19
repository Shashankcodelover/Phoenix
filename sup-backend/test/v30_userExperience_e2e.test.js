const { test, describe } = require('node:test');
const assert = require('node:assert');
const http = require('http');

describe('Project Phoenix v28.5 User Experience, Endpoint Integrity & Depth Tests', () => {
  const userController = require('../modules/user/userController');
  const ideaGenController = require('../modules/idea-gen/ideaGenController');
  const { createOrMatchPeerRoom } = require('../modules/interview-prep/peerMatchEngine');

  test('1. getAllUsers returns rich candidate peer dossiers with roles, levels, and XP', async () => {
    let responseData = null;
    const req = {};
    const res = {
      json: (data) => { responseData = data; return res; },
      status: (code) => res
    };

    await userController.getAllUsers(req, res);
    assert.ok(Array.isArray(responseData), 'Expected array of users');
    assert.ok(responseData.length >= 3, 'Expected at least 3 candidate peers');
    
    const candidate = responseData[0];
    assert.ok(candidate.name, 'Candidate should have a name');
    assert.ok(candidate.targetRole, 'Candidate should have a target role');
    assert.ok(candidate.level >= 1, 'Candidate should have a level >= 1');
    assert.ok(candidate.xp >= 100, 'Candidate should have gamified XP');
  });

  test('2. getWinners returns resilient past hackathon winner blueprints offline', async () => {
    let responseData = null;
    const req = { query: {} };
    const res = {
      json: (data) => { responseData = data; return res; },
      status: (code) => res
    };

    await ideaGenController.getWinners(req, res);
    assert.ok(Array.isArray(responseData), 'Expected array of winners');
    assert.ok(responseData.length >= 3, 'Expected at least 3 winner blueprints');
    assert.ok(responseData[0].projectTitle, 'Expected projectTitle on winner');
    assert.ok(responseData[0].techStack, 'Expected techStack on winner');
  });

  test('3. generateIdea produces 3 carrier-grade, multi-layered hackathon ideas offline', async () => {
    let responseData = null;
    const req = {
      body: {
        hackathonTheme: 'AI Agents & Distributed Systems',
        teamSkills: ['Node.js', 'Go', 'React', 'Docker'],
        constraints: '24-hour sprint'
      }
    };
    const res = {
      json: (data) => { responseData = data; return res; },
      status: (code) => res
    };

    await ideaGenController.generateIdea(req, res);
    assert.ok(responseData, 'Expected responseData');
    assert.ok(Array.isArray(responseData.ideas), 'Expected array of ideas');
    assert.strictEqual(responseData.ideas.length, 3, 'Expected exactly 3 ideas');

    const idea = responseData.ideas[0];
    assert.ok(idea.title, 'Idea should have a title');
    assert.ok(idea.pitch, 'Idea should have an elevator pitch');
    assert.ok(idea.techStack && idea.techStack.length > 0, 'Idea should have recommended techStack');
    assert.ok(idea.uniqueAngle, 'Idea should define a competitive unique moat');
    assert.ok(idea.mvpScope, 'Idea should provide a clear 6-hour MVP scope');
  });

  test('4. Peer Mock matchmaking accepts guest candidate and establishes queue or room', async () => {
    const candidateUser = {
      userId: 'test_guest_' + Date.now(),
      name: 'Preetham (Guest Candidate)',
      targetRole: 'Distributed Systems Engineer'
    };

    const result = await createOrMatchPeerRoom(candidateUser);
    assert.ok(result, 'Expected matching result');
    assert.ok(['WAITING', 'MATCHED'].includes(result.status), `Unexpected status: ${result.status}`);
  });
});
