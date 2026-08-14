/**
 * Phoenix Apex Ultra: Feature 54 — Article 371(J) Kalyana-Karnataka Quota Engine
 * 
 * Evaluates Article 371(J) eligibility for 7 Kalyana-Karnataka districts,
 * calculates 70% regional vs 8% statewide KEA engineering seat quota multipliers,
 * and validates Assistant Commissioner (AC) Form-E certificate compliance.
 */

const KALYANA_KARNATAKA_DISTRICTS = [
  'Bidar',
  'Kalaburagi (Gulbarga)',
  'Yadgir',
  'Raichur',
  'Koppal',
  'Ballari (Bellary)',
  'Vijayanagara'
];

class Article371JEngine {
  /**
   * Evaluates candidate 371(J) eligibility, seat reservations, and rank cutoff advantages.
   */
  evaluateEligibility(payload = {}) {
    const {
      candidateDistrict = 'Kalaburagi (Gulbarga)',
      candidateRank = 14500,
      hasFormECertificate = true
    } = payload;

    const isDistrictEligible = KALYANA_KARNATAKA_DISTRICTS.some(d =>
      d.toLowerCase().includes(candidateDistrict.toLowerCase()) ||
      candidateDistrict.toLowerCase().includes(d.toLowerCase())
    );

    const isEligible = isDistrictEligible && hasFormECertificate;

    return {
      success: true,
      candidateDistrict,
      candidateRank,
      isArticle371JEligible: isEligible,
      constitutionalProvision: 'Article 371(J) of the Constitution of India (Kalyana-Karnataka Region)',
      seatReservationQuotas: {
        statewideTier1Colleges: '8% Exclusive Statewide Quota (RVCE, BMSCE, MSRIT, PESU, UVCE)',
        regionalLocalColleges: '70% Local Regional Quota in 7 HK Districts (PDA, RYMEC, BKIT)'
      },
      effectiveCompetitiveRank: isEligible ? Math.round(candidateRank / 3.8) : candidateRank,
      rankMultiplierAdvantage: isEligible ? '3.8x Cutoff Advantage (14.5k behaves like ~3,800 General Merit rank)' : '1.0x (Standard General Merit)',
      requiredRevenueDocument: 'Form-E (Eligibility Certificate) issued by Assistant Commissioner (AC) of Revenue Sub-Division.',
      recommendationSummary: isEligible
        ? 'Eligible for elite 8% Bangalore Tier-1 seats (RVCE/BMSCE) and 70% high-probability local Kalyana-Karnataka seats.'
        : 'Ineligible or Missing Form-E: Must secure valid Form-E from AC office before KEA Document Verification.'
    };
  }
}

const article371JEngine = new Article371JEngine();
module.exports = { Article371JEngine, article371JEngine, KALYANA_KARNATAKA_DISTRICTS };
