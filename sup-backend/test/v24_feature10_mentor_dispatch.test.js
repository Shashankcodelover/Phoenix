const { describe, it } = require('node:test');
const assert = require('node:assert');

const { MentorDispatchHub } = require('../modules/horizon/mentorDispatchHub');

describe('V24 Quality Focus: Feature 10 — Verified Alumni Mentor Direct Dispatch & Guidance Hub', () => {
  const hub = new MentorDispatchHub();

  it('retrieves the directory of verified alumni mentors from RVCE, BMSCE, and Google', () => {
    const directory = hub.getMentorDirectory();
    assert.strictEqual(directory.success, true);
    assert.strictEqual(directory.totalVerifiedMentors, 3);
    assert.strictEqual(directory.mentors[0].name, 'Aditya Rao');
    assert.ok(directory.mentors[0].almaMater.includes('RVCE'));
    assert.ok(directory.mentors[1].currentRole.includes('Microsoft'));
  });

  it('dispatches a student counseling question and matches verified RVCE Google mentor with actionable guidance', () => {
    const dispatch = hub.dispatchQuestion({
      studentName: 'Rohan Sharma',
      studentStream: 'KCET Pre-University',
      targetDomain: 'counseling',
      question: 'Should I choose RVCE ISE or BMSCE CSE for product company placements?'
    });

    assert.strictEqual(dispatch.success, true);
    assert.ok(dispatch.dispatchRecord.dispatchId.startsWith('dsp_'));
    assert.strictEqual(dispatch.dispatchRecord.matchedMentor.name, 'Aditya Rao');
    assert.ok(dispatch.dispatchRecord.actionableGuidance.includes('RVCE'));
    assert.ok(dispatch.dispatchRecord.suggestedNextSteps.length >= 3);
  });
});
