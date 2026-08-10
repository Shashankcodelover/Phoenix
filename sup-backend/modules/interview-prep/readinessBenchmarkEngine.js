/**
 * Phoenix V15: Readiness Benchmarking Aggregator
 * 
 * Aggregates scores from mock interviews, speech analysis, tech skills,
 * and culture fit to provide a final "% Ready for [Company]" score based
 * on historical data percentiles.
 */

// Historical threshold percentiles (simulated for demonstration)
const COMPANY_THRESHOLDS = {
  'google': { technical: 85, behavioral: 80, systemDesign: 85, speech: 70 },
  'meta': { technical: 80, behavioral: 80, systemDesign: 90, speech: 75 },
  'amazon': { technical: 75, behavioral: 90, systemDesign: 75, speech: 70 },
  'startup': { technical: 70, behavioral: 70, systemDesign: 60, speech: 60 }
};

/**
 * Calculate readiness score based on multiple vectors.
 * 
 * @param {Object} scores 
 * @param {number} scores.technicalScore (0-100)
 * @param {number} scores.behavioralScore (0-100)
 * @param {number} scores.systemDesignScore (0-100)
 * @param {number} scores.speechScore (0-100)
 * @param {string} targetCompany 
 */
function calculateReadinessScore(scores, targetCompany = 'startup') {
  // FIX REJECTION #3: Add type safety to prevent TypeError crash
  const safeTargetCompany = typeof targetCompany === 'string' ? targetCompany.toLowerCase() : 'startup';
  
  const isKnownCompany = Object.keys(COMPANY_THRESHOLDS).includes(safeTargetCompany);
  const normalizedCompany = isKnownCompany ? safeTargetCompany : 'startup';
    
  const thresholds = COMPANY_THRESHOLDS[normalizedCompany];
  
  const techGap = Math.max(0, thresholds.technical - (scores.technicalScore || 0));
  const behGap = Math.max(0, thresholds.behavioral - (scores.behavioralScore || 0));
  const sysGap = Math.max(0, thresholds.systemDesign - (scores.systemDesignScore || 0));
  const speechGap = Math.max(0, thresholds.speech - (scores.speechScore || 0));
  
  // Total possible gap is if the user scores 0 on everything.
  const totalThreshold = thresholds.technical + thresholds.behavioral + thresholds.systemDesign + thresholds.speech;
  const totalGap = techGap + behGap + sysGap + speechGap;
  
  // Readiness is how much of the threshold they've met.
  const rawReadiness = ((totalThreshold - totalGap) / totalThreshold) * 100;
  
  // Apply a steep curve if they miss any threshold by more than 20 points (fatal flaw)
  let penalty = 0;
  const criticalFlaws = [];
  if (techGap > 20) { penalty += 10; criticalFlaws.push('Technical depth is significantly below bar.'); }
  if (behGap > 20) { penalty += 10; criticalFlaws.push('Behavioral alignment is critically low.'); }
  if (sysGap > 20) { penalty += 10; criticalFlaws.push('System Design architecture skills need major improvement.'); }
  
  const finalReadiness = Math.max(0, Math.min(100, Math.round(rawReadiness - penalty)));
  
  let verdict = 'NOT_READY';
  if (finalReadiness >= 95) verdict = 'HIGHLY_COMPETITIVE';
  else if (finalReadiness >= 85) verdict = 'INTERVIEW_READY';
  else if (finalReadiness >= 70) verdict = 'NEEDS_PRACTICE';
  else verdict = 'NOT_READY';

  return {
    success: true,
    targetCompany: normalizedCompany,
    readinessScore: finalReadiness,
    verdict,
    gaps: {
      technical: techGap > 0 ? `Needs +${techGap} pts` : 'Ready',
      behavioral: behGap > 0 ? `Needs +${behGap} pts` : 'Ready',
      systemDesign: sysGap > 0 ? `Needs +${sysGap} pts` : 'Ready',
      speech: speechGap > 0 ? `Needs +${speechGap} pts` : 'Ready'
    },
    criticalFlaws,
    // FIX REJECTION #10: Clearly denote if fallback was used
    metadata: { 
      engine: 'Phoenix Readiness Aggregator v15',
      fallbackUsed: !isKnownCompany,
      fallbackReason: !isKnownCompany ? `Target company '${targetCompany}' not found in thresholds database. Defaulted to startup.` : null
    }
  };
}

module.exports = { calculateReadinessScore, COMPANY_THRESHOLDS };
