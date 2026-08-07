/**
 * Phoenix v13 Horizon — Scholarship & Cutoff Predictor Engine
 * =============================================================
 * Provides rank cutoff estimations, fee waiver predictions, and scholarship
 * opportunities for students transitioning between academic stages (PU → Eng, Diploma → B.E via DCET).
 */

const SCHOLARSHIP_SCHEMES = [
  {
    schemeId: 'fee_waiver_ssp',
    name: 'SSP (State Scholarship Portal) Post-Matric Scholarship',
    applicableStages: ['2nd_pu', 'diploma_3', 'eng_2'],
    eligibilityCriteria: 'Family annual income < ₹2.5 Lakhs (SC/ST) or < ₹1.0 Lakh (OBC)',
    benefit: '100% tuition fee reimbursement + maintenance allowance',
    officialUrl: 'https://ssp.postmatric.karnataka.gov.in/'
  },
  {
    schemeId: 'snq_quota',
    name: 'SNQ (Supernumerary Quota) 5% Engineering Fee Concession',
    applicableStages: ['2nd_pu', 'diploma_3'],
    eligibilityCriteria: 'KCET / DCET rank under top 15,000 + Family income < ₹8.0 Lakhs',
    benefit: 'Engineering college tuition fee reduced to ~₹4,500/year',
    officialUrl: 'https://cetonline.karnataka.gov.in/kea/'
  },
  {
    schemeId: 'pragati_aicte',
    name: 'AICTE Pragati Scholarship for Girl Students',
    applicableStages: ['10th', '2nd_pu', 'diploma_3'],
    eligibilityCriteria: 'Female student admitted to 1st year B.E or Diploma + Income < ₹8.0 Lakhs',
    benefit: '₹50,000 per annum for up to 4 years',
    officialUrl: 'https://www.aicte-india.org/'
  }
];

function predictScholarshipEligibility({ academicStage, familyIncomeLakhs, entranceRank, isFemale = false }) {
  if (!academicStage) throw new Error('academicStage is required.');

  const income = parseFloat(familyIncomeLakhs || 5);
  const rank = entranceRank ? parseInt(entranceRank) : null;
  const eligibleSchemes = [];

  SCHOLARSHIP_SCHEMES.forEach(scheme => {
    let isEligible = false;

    if (scheme.schemeId === 'fee_waiver_ssp' && income <= 2.5) {
      isEligible = true;
    } else if (scheme.schemeId === 'snq_quota' && income <= 8.0 && rank && rank <= 20000) {
      isEligible = true;
    } else if (scheme.schemeId === 'pragati_aicte' && isFemale && income <= 8.0) {
      isEligible = true;
    }

    if (isEligible) {
      eligibleSchemes.push(scheme);
    }
  });

  return {
    success: true,
    academicStage,
    familyIncomeLakhs: income,
    entranceRank: rank,
    isFemale,
    eligibleCount: eligibleSchemes.length,
    eligibleSchemes,
    adviceNote: eligibleSchemes.length > 0 
      ? 'You qualify for government scholarships! Apply via SSP portal before December deadline.'
      : 'Keep your entrance exam rank under 20,000 to unlock SNQ 95% tuition fee waiver.'
  };
}

module.exports = { predictScholarshipEligibility, SCHOLARSHIP_SCHEMES };
