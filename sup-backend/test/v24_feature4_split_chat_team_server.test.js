const { describe, it } = require('node:test');
const assert = require('node:assert');

const { HackathonTeamServer } = require('../modules/hackathon-agent/hackathonTeamServer');

describe('V24 Quality Focus: Feature 4 — Discord-Style Hackathon Team Server & Split-Chat AI OS', () => {
  const server = new HackathonTeamServer();
  const teamId = 'team_apex_hack_2026';

  it('creates a Discord-style hackathon team workspace with multi-member profiles', () => {
    const team = server.createOrJoinTeam(teamId, {
      teamName: 'Apex Builders',
      hackathonEvent: 'MIT Global Hackathon 2026',
      creator: { id: 'lead_dev', name: 'Shashank J', role: 'Full Stack Architect', skills: ['React', 'Node.js', 'WebRTC'] }
    });

    assert.strictEqual(team.success, true);
    assert.strictEqual(team.teamName, 'Apex Builders');
    assert.strictEqual(team.memberCount, 1);
    assert.strictEqual(team.members[0].role, 'Full Stack Architect');
  });

  it('broadcasts messages across the Universal Team Chat bus', () => {
    const msg = server.sendTeamMessage(teamId, {
      userId: 'lead_dev',
      senderName: 'Shashank J',
      content: 'Let us build a multimodal voice IDE with AST linting for the AI track!'
    });

    assert.strictEqual(msg.success, true);
    assert.ok(msg.message.messageId.startsWith('msg_'));
    assert.strictEqual(msg.totalMessages, 1);
  });

  it('generates winning RAG idea poll and tallies member votes', () => {
    const poll = server.generateIdeaPoll(teamId, {
      theme: 'Multimodal AI & Distributed Systems',
      prizeTracks: ['Best AI Hack', 'Best Developer Tool']
    });

    assert.strictEqual(poll.success, true);
    assert.ok(poll.ideas.length >= 3);

    const vote = server.castIdeaVote(teamId, 'lead_dev', 'idea_1');
    assert.strictEqual(vote.success, true);
    assert.strictEqual(vote.leadingIdea.ideaId, 'idea_1');
    assert.strictEqual(vote.leadingIdea.votes, 1);
  });

  it('decomposes project into a 4-role milestone matrix from scratch to deployment', () => {
    const selectedIdea = { ideaId: 'idea_1', title: 'NexusAudio Real-Time IDE' };
    const taskMatrix = server.decomposeAndAssignTasks(teamId, selectedIdea);

    assert.strictEqual(taskMatrix.success, true);
    assert.strictEqual(taskMatrix.totalAssignedTasks, 4);
    assert.ok(taskMatrix.taskAssignments[0].roleTarget.includes('Frontend'));
    assert.ok(taskMatrix.taskAssignments[1].roleTarget.includes('Backend'));
    assert.ok(taskMatrix.taskAssignments[2].roleTarget.includes('AI'));
    assert.ok(taskMatrix.taskAssignments[3].roleTarget.includes('Product'));
  });

  it('delivers private, contextual Senior Lead advice in Split-Chat tracking main chat history', () => {
    const advice = server.getPersonalizedSeniorCoachAdvice(
      teamId,
      'lead_dev',
      'What is the optimal caching architecture for sub-2ms responses?'
    );

    assert.strictEqual(advice.success, true);
    assert.ok(advice.seniorCoachResponse.includes('Senior'));
    assert.ok(advice.teamContextSummary.includes('Tracked'));
    assert.ok(advice.actionableStep.length > 0);
  });
});
