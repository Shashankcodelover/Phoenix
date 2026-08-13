const { describe, it } = require('node:test');
const assert = require('node:assert');

const { HackathonTeamServer } = require('../modules/hackathon-agent/hackathonTeamServer');

describe('V22 Feature Suite — Hackathon Team Server, Idea Polling & Split-Chat OS', () => {
  const server = new HackathonTeamServer();
  const teamId = 'team_nexus_2026';

  it('initializes a hackathon team workspace and adds members', () => {
    const team = server.createOrJoinTeam(teamId, {
      teamName: 'Nexus Builders',
      hackathonEvent: 'MIT Global Hackathon 2026',
      creator: { id: 'lead_dev', name: 'Shashank J', role: 'Full Stack Architect' }
    });

    assert.strictEqual(team.success, true);
    assert.strictEqual(team.teamName, 'Nexus Builders');
    assert.strictEqual(team.memberCount, 1);
    assert.strictEqual(team.members[0].name, 'Shashank J');
  });

  it('broadcasts messages to the Universal Team Chat channel', () => {
    const msg1 = server.sendTeamMessage(teamId, {
      userId: 'lead_dev',
      senderName: 'Shashank J',
      content: 'Hey team, let us pick an AI & WebRTC project for the main prize track!'
    });

    assert.strictEqual(msg1.success, true);
    assert.strictEqual(msg1.message.senderName, 'Shashank J');
    assert.strictEqual(msg1.totalMessages, 1);
  });

  it('generates winning-project RAG ideas and launches team voting poll', () => {
    const poll = server.generateIdeaPoll(teamId, {
      theme: 'Multimodal AI & Real-Time Communication',
      prizeTracks: ['Best AI Hack', 'Best Developer Tool']
    });

    assert.strictEqual(poll.success, true);
    assert.ok(poll.ideas.length >= 3);
    assert.ok(poll.ideas[0].noveltyScore >= 80);
    assert.strictEqual(poll.ideas[0].votes, 0);
  });

  it('casts votes, tallies scores, and updates leading idea', () => {
    const voteResult = server.castIdeaVote(teamId, 'lead_dev', 'idea_1');

    assert.strictEqual(voteResult.success, true);
    assert.strictEqual(voteResult.votedFor, 'idea_1');
    assert.strictEqual(voteResult.leadingIdea.ideaId, 'idea_1');
    assert.strictEqual(voteResult.leadingIdea.votes, 1);
  });

  it('expands selected idea into an end-to-end technical deep-dive specification', () => {
    const idea = { ideaId: 'idea_1', title: 'NexusAudio Real-Time IDE' };
    const spec = server.expandIdeaDeepDive(idea);

    assert.strictEqual(spec.title, 'NexusAudio Real-Time IDE');
    assert.ok(spec.systemArchitecture.frontend.includes('Glassmorphic'));
    assert.ok(spec.databaseSchema.length >= 3);
    assert.ok(spec.demoRoadmap24H.length === 4);
  });

  it('decomposes the project and assigns modular jobs from scratch to deployment', () => {
    const selectedIdea = { ideaId: 'idea_1', title: 'NexusAudio Real-Time IDE' };
    const assignment = server.decomposeAndAssignTasks(teamId, selectedIdea);

    assert.strictEqual(assignment.success, true);
    assert.strictEqual(assignment.totalAssignedTasks, 4);
    assert.ok(assignment.taskAssignments[0].roleTarget.includes('Frontend'));
    assert.ok(assignment.taskAssignments[1].roleTarget.includes('Backend'));
    assert.ok(assignment.taskAssignments[2].roleTarget.includes('AI'));
    assert.ok(assignment.taskAssignments[3].roleTarget.includes('Product'));
  });

  it('provides private, contextual Senior Engineer guidance via Split-Chat pipeline', () => {
    const splitChatAdvice = server.getPersonalizedSeniorCoachAdvice(
      teamId,
      'lead_dev',
      'How should we structure the database and in-memory caching layer?'
    );

    assert.strictEqual(splitChatAdvice.success, true);
    assert.ok(splitChatAdvice.seniorCoachResponse.includes('Senior'));
    assert.ok(splitChatAdvice.teamContextSummary.includes('Tracked'));
    assert.ok(splitChatAdvice.actionableStep.length > 0);
  });
});
