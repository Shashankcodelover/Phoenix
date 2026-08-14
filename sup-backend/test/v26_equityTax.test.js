const test = require('node:test');
const assert = require('node:assert/strict');
const equityTaxArbitrageEngine = require('../modules/interview-prep/equityTaxArbitrageEngine');

test('V26 Feature 4: EquityTaxArbitrageEngine models 4-year RSU cashflows and PPP indices', () => {
    const offer = {
        company: 'Google',
        baseSalaryLPA: 30.0,
        joiningBonusLPA: 8.0,
        totalRsuUsd: 80000,
        vestingYears: 4,
        city: 'BANGALORE',
        exchangeRateUsdInr: 85.0,
    };

    const evaluated = equityTaxArbitrageEngine.evaluateOfferPackage(offer);
    assert.equal(evaluated.company, 'Google');
    assert.equal(evaluated.equityBreakdown.totalRsuInrLakhs, 68.0); // 80k * 85 / 100k = 68 Lakhs
    assert.equal(evaluated.equityBreakdown.annualRsuLPA, 17.0); // 68 / 4 = 17 LPA
    assert.equal(evaluated.year1TotalCompLPA, 55.0); // 30 + 8 + 17 = 55 LPA
    assert.ok(evaluated.negotiationAdvice.includes('Counter-offer target'));
});
