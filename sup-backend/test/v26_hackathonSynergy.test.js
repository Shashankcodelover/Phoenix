const test = require('node:test');
const assert = require('node:assert/strict');
const hackathonTeamSynergyEngine = require('../modules/interview-prep/hackathonTeamSynergyEngine');

test('V26 Feature 5: HackathonTeamSynergyEngine forms balanced 4-pillar hackathon squads', () => {
    const hackerPool = [
        { usn: '4JC21CS001', name: 'Shashank', primarySkill: 'BACKEND_INFRA', secondarySkill: 'AI_ML' },
        { usn: '4JC21CS002', name: 'Preetham', primarySkill: 'FRONTEND_UI', secondarySkill: 'DESIGN' },
        { usn: '4JC21CS003', name: 'Aditya', primarySkill: 'AI_ML', secondarySkill: 'RESEARCH' },
        { usn: '4JC21CS004', name: 'Sneha', primarySkill: 'PITCH_PRODUCT', secondarySkill: 'MANAGEMENT' },
    ];

    const result = hackathonTeamSynergyEngine.assembleOptimalSquad(hackerPool);
    assert.equal(result.totalMembers, 4);
    assert.equal(result.roleCoveragePercentage, 100.0);
    assert.equal(result.teamSynergyScore, 100);
    assert.equal(result.isPodiumReady, true);
    assert.equal(result.status, 'GRAND_PRIZE_CONTENDER_SQUAD');
});
