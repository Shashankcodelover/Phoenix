/**
 * Phoenix V15: Non-Verbal / Social Presence Scorer
 * 
 * Evaluates candidate confidence and engagement based on (simulated) 
 * visual telemetry such as eye contact consistency, posture shifts, and facial expressions.
 */

/**
 * Score a candidate's non-verbal presence.
 * 
 * @param {Object} telemetry 
 * @param {number} telemetry.eyeContactPercentage (0-100)
 * @param {number} telemetry.postureShiftsPerMinute 
 * @param {number} telemetry.smileFrequency (0-100 scale)
 * @returns {Object} Presence score and feedback
 */
function scoreSocialPresence(telemetry) {
  if (!telemetry || typeof telemetry.eyeContactPercentage !== 'number') {
    return { success: false, error: 'Invalid telemetry data provided.' };
  }

  let { eyeContactPercentage, postureShiftsPerMinute = 0, smileFrequency = 0 } = telemetry;
  
  // FIX REJECTION #6: Clamp inputs to prevent out-of-bounds math
  eyeContactPercentage = Math.max(0, Math.min(100, eyeContactPercentage));
  postureShiftsPerMinute = Math.max(0, postureShiftsPerMinute);
  smileFrequency = Math.max(0, Math.min(100, smileFrequency));
  
  let eyeScore = 100;
  if (eyeContactPercentage < 40) eyeScore = 40;
  else if (eyeContactPercentage < 60) eyeScore = 70;
  else if (eyeContactPercentage > 95) eyeScore = 80; // "Staring" penalty
  
  let postureScore = 100;
  if (postureShiftsPerMinute > 10) postureScore = 50; // Fidgeting
  else if (postureShiftsPerMinute > 5) postureScore = 80;
  else if (postureShiftsPerMinute === 0) postureScore = 85; // Too rigid
  
  let expressionScore = smileFrequency > 70 ? 90 : smileFrequency > 30 ? 100 : 70; // 30-70 is optimal natural variation

  const overallScore = Math.round((eyeScore * 0.5) + (postureScore * 0.3) + (expressionScore * 0.2));

  const feedback = [];
  if (eyeContactPercentage < 60) feedback.push('Maintain more eye contact with the camera to project confidence.');
  if (eyeContactPercentage > 95) feedback.push('Remember to blink and look away naturally occasionally so you don\'t appear to be staring or reading a script.');
  if (postureShiftsPerMinute > 5) feedback.push('You are shifting frequently, which can convey nervousness. Try to ground yourself.');
  if (smileFrequency < 30) feedback.push('Try to smile slightly more during pleasantries to build rapport.');

  return {
    success: true,
    overallScore,
    metrics: { eyeScore, postureScore, expressionScore },
    feedback,
    metadata: { engine: 'Phoenix Social Presence Engine v15' }
  };
}

module.exports = { scoreSocialPresence };
