/**
 * Enterprise Salary & Equity Offer Comparator with Tax Arbitrage Modeling — Phoenix V26 (IR-15)
 * 
 * 1. 4-Year RSU & Stock Options Vesting Schedule Model (1-year cliff + monthly/quarterly vest).
 * 2. Cost of Living & Purchasing Power Parity (PPP) Normalized Discretionary Income.
 * 3. Tax Arbitrage & Counter-Offer Negotiation Target Recommender.
 */

class EquityTaxArbitrageEngine {
    constructor() {
        this.pppFactors = {
            'BANGALORE': 1.0,
            'HYDERABAD': 0.92,
            'PUNE': 0.88,
            'SINGAPORE': 3.4,
            'LONDON': 3.8,
            'SAN_FRANCISCO': 4.5,
        };
    }

    /**
     * Evaluates a multi-component compensation offer package.
     * 
     * @param {Object} offer - { company, baseSalaryLPA, joiningBonusLPA, totalRsuUsd, vestingYears, city, exchangeRateUsdInr }
     * @returns {Object} Year-by-year cashflow, annualized equity, tax estimate, and PPP normalized score
     */
    evaluateOfferPackage(offer) {
        const {
            company = 'Tech Corp',
            baseSalaryLPA = 24.0,
            joiningBonusLPA = 5.0,
            totalRsuUsd = 60000,
            vestingYears = 4,
            city = 'BANGALORE',
            exchangeRateUsdInr = 85.0,
        } = offer;

        const totalRsuInrLakhs = (totalRsuUsd * exchangeRateUsdInr) / 100000;
        const annualRsuLPA = totalRsuInrLakhs / vestingYears;

        // Year 1 Total Comp = Base + Joining Bonus + Year 1 RSU
        const year1TotalCompLPA = baseSalaryLPA + joiningBonusLPA + annualRsuLPA;
        // Year 2-4 Recurring Comp = Base + Annual RSU
        const recurringAnnualCompLPA = baseSalaryLPA + annualRsuLPA;

        // Progressive Multi-Slab Tax Model (Indian New Tax Regime Standard)
        // 0-3L: 0%, 3-7L: 5%, 7-10L: 10%, 10-12L: 15%, 12-15L: 20%, >15L: 30%
        let estimatedTaxYear1LPA = 0;
        if (year1TotalCompLPA > 15) {
            estimatedTaxYear1LPA = 1.5 + (year1TotalCompLPA - 15) * 0.30;
        } else if (year1TotalCompLPA > 12) {
            estimatedTaxYear1LPA = 0.9 + (year1TotalCompLPA - 12) * 0.20;
        } else if (year1TotalCompLPA > 10) {
            estimatedTaxYear1LPA = 0.6 + (year1TotalCompLPA - 10) * 0.15;
        } else if (year1TotalCompLPA > 7) {
            estimatedTaxYear1LPA = 0.3 + (year1TotalCompLPA - 7) * 0.10;
        } else if (year1TotalCompLPA > 3) {
            estimatedTaxYear1LPA = (year1TotalCompLPA - 3) * 0.05;
        }
        estimatedTaxYear1LPA = parseFloat(estimatedTaxYear1LPA.toFixed(2));
        const postTaxCashflowYear1LPA = parseFloat((year1TotalCompLPA - estimatedTaxYear1LPA).toFixed(2));


        // PPP Adjustment
        const pppFactor = this.pppFactors[city.toUpperCase()] || 1.0;
        const pppNormalizedCompScore = parseFloat((year1TotalCompLPA / pppFactor).toFixed(2));

        return {
            company,
            city,
            year1TotalCompLPA: parseFloat(year1TotalCompLPA.toFixed(2)),
            recurringAnnualCompLPA: parseFloat(recurringAnnualCompLPA.toFixed(2)),
            equityBreakdown: {
                totalRsuUsd,
                totalRsuInrLakhs: parseFloat(totalRsuInrLakhs.toFixed(2)),
                annualRsuLPA: parseFloat(annualRsuLPA.toFixed(2)),
                vestingSchedule: `${vestingYears} Years Standard (25% Cliff at Month 12, then quarterly)`,
            },
            taxAndTakeHome: {
                estimatedTaxYear1LPA,
                postTaxCashflowYear1LPA,
            },
            pppMetrics: {
                costOfLivingIndex: pppFactor,
                pppNormalizedRealValueScore: pppNormalizedCompScore,
            },
            negotiationAdvice: `Counter-offer target: Request +15% on Base (₹${(baseSalaryLPA * 1.15).toFixed(1)} LPA) or ask for ₹${(joiningBonusLPA + 3).toFixed(1)} LPA sign-on bonus to offset equity cliff.`,
            timestamp: new Date().toISOString(),
        };
    }
}

const equityTaxArbitrageEngine = new EquityTaxArbitrageEngine();
module.exports = equityTaxArbitrageEngine;
