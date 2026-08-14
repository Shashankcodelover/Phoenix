/**
 * Phoenix Apex Ultra: Feature 41 — Karnataka Rural & Kannada Medium Reservation Engine
 * 
 * Evaluates KEA 15% Rural, 5% Kannada Medium, and Article 371J Kalyana Karnataka quota eligibility,
 * calculating rank cutoff elevation multipliers and mandatory BEO countersigned document requirements.
 */

class KarnatakaReservationEngine {
  /**
   * Evaluates eligibility for specialized Karnataka horizontal quotas.
   */
  evaluateQuotaEligibility(payload = {}) {
    const {
      ruralStudyYears = 10,
      kannadaMediumYears = 10,
      article371jEligible = false,
      rawKcetRank = 4500
    } = payload;

    const isRuralEligible = ruralStudyYears >= 10;
    const isKannadaMediumEligible = kannadaMediumYears >= 10;

    // Calculate effective rank advantage multiplier (up to 2.4x cutoff expansion)
    let rankAdvantageMultiplier = 1.0;
    if (isRuralEligible) rankAdvantageMultiplier += 0.8;
    if (isKannadaMediumEligible) rankAdvantageMultiplier += 0.4;
    if (article371jEligible) rankAdvantageMultiplier += 1.2;

    const effectiveRank = Math.max(1, Math.round(rawKcetRank / rankAdvantageMultiplier));

    const quotaBadges = [];
    if (isRuralEligible) quotaBadges.push('15% Rural Quota (RC)');
    if (isKannadaMediumEligible) quotaBadges.push('5% Kannada Medium Quota (KMC)');
    if (article371jEligible) quotaBadges.push('Article 371J Kalyana Karnataka (HK)');

    return {
      success: true,
      rawKcetRank,
      effectiveEquivalentRank: effectiveRank,
      rankAdvantageMultiplier: `${rankAdvantageMultiplier.toFixed(1)}x`,
      quotaBadges: quotaBadges.length > 0 ? quotaBadges : ['General Merit (GM Only)'],
      documentChecklist: [
        isRuralEligible ? 'Form-1 Rural Certificate signed by Head of Institution & countersigned by Block Education Officer (BEO)' : null,
        isKannadaMediumEligible ? 'Kannada Medium Study Certificate (1st to 10th Std) countersigned by BEO' : null,
        article371jEligible ? 'Article 371J Eligibility Certificate issued by Assistant Commissioner (Revenue Sub-Division)' : null,
        '7-Year Karnataka Study Certificate including 10th & 12th Marks Cards'
      ].filter(Boolean),
      strategicAdvantageSummary: `With your reservation profile, your KCET Rank of ${rawKcetRank} provides admission cutoffs comparable to Rank ${effectiveRank} in General Merit.`
    };
  }
}

const karnatakaReservationEngine = new KarnatakaReservationEngine();
module.exports = { KarnatakaReservationEngine, karnatakaReservationEngine };
