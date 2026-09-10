const { describe, it } = require('node:test');
const assert = require('node:assert');

const {
  alumniNetworkEngine,
  ALUMNI_DIRECTORY,
  PRESETS
} = require('../modules/horizon/alumniNetworkEngine');

describe('V26 Feature 48: Alumni Mentorship & Career Network Connector', () => {
  it('retrieves alumni directory with multi-faceted filtering', () => {
    const full = alumniNetworkEngine.getDirectory();
    assert.strictEqual(full.success, true);
    assert.ok(Array.isArray(full.alumni));
    assert.ok(full.alumni.length >= 5);

    // Filter by company
    const googleOnly = alumniNetworkEngine.getDirectory({ company: 'Google' });
    assert.strictEqual(googleOnly.matchedCount, 1);
    assert.strictEqual(googleOnly.alumni[0].company, 'Google');
    assert.strictEqual(googleOnly.alumni[0].almaMater, 'RV College of Engineering');

    // Filter by college
    const nitkOnly = alumniNetworkEngine.getDirectory({ college: 'NITK' });
    assert.strictEqual(nitkOnly.matchedCount, 1);
    assert.strictEqual(nitkOnly.alumni[0].name, 'Sneha Nandakumar');
  });

  it('retrieves candidate presets', () => {
    const presets = alumniNetworkEngine.getPresets();
    assert.ok(Array.isArray(presets));
    assert.ok(presets.length >= 3);
    assert.ok(presets.some(p => p.id === 'faang_dist_sys'));
  });

  it('generates high-converting warm intro note using Alma Mater framework', () => {
    const res = alumniNetworkEngine.generateIntroNote({
      alumnusId: 'alum_001',
      studentName: 'Harshith Gowda',
      studentCollege: 'RV College of Engineering',
      studentMajor: 'Computer Science and Engineering',
      targetRole: 'Software Development Engineer - Cloud Systems',
      frameworkKey: 'ALMA_MATER_QUESTION',
      projectHighlight: 'Built an Raft-consensus key-value store in Go'
    });

    assert.strictEqual(res.success, true);
    assert.strictEqual(res.alumnus.company, 'Google');
    assert.ok(res.estimatedResponseRate.includes('92%'));
    assert.ok(res.subject.includes('RV College of Engineering'));
    assert.ok(res.body.includes('Vikramaditya'));
    assert.ok(res.body.includes('Raft-consensus key-value store in Go'));
    assert.ok(res.actionTips.length >= 2);
  });

  it('successfully books 1:1 mentorship session with Google Staff Engineer', () => {
    const booking = alumniNetworkEngine.bookSession({
      alumnusId: 'alum_001',
      studentName: 'Harshith Gowda',
      selectedSlot: 'Sat 10:30 AM IST',
      sessionTopic: 'System Design Mocks',
      candidateNotes: 'Review my distributed cache architecture'
    });

    assert.strictEqual(booking.success, true);
    assert.ok(booking.bookingRef.startsWith('PHX-MENTOR-'));
    assert.strictEqual(booking.status, 'CONFIRMED');
    assert.strictEqual(booking.sessionDetails.mentorCompany, 'Google');
    assert.ok(booking.sessionDetails.meetingLink.includes('meet.google.com'));
    assert.strictEqual(booking.prepChecklist.length, 3);
  });
});
