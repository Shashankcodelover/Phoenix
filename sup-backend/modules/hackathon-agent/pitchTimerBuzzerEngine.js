/**
 * Phoenix Apex Ultra: Feature 23 — Stage-Ready 180s Pitch Countdown Timer & Audio Buzzer Engine
 * 
 * Configures synchronized 4-phase 180-second stage presentation timers with Web Audio API
 * tone synthesis frequencies, 30s wrap-up warning cues, and judge Q&A defense countdowns.
 */

const PITCH_PHASES = [
  { phaseNumber: 1, name: 'The Hook & Problem Statement', durationSeconds: 30, color: '#38bdf8', audioCue: 'Soft Bell (880 Hz)' },
  { phaseNumber: 2, name: 'Live Product Demo & Architecture Moat', durationSeconds: 60, color: '#34d399', audioCue: 'Mid Chime (660 Hz)' },
  { phaseNumber: 3, name: 'Unit Economics, TAM & Scalability', durationSeconds: 60, color: '#818cf8', audioCue: 'Traction Pulse (550 Hz)' },
  { phaseNumber: 4, name: 'The Ask & Grand Vision (Wrap-Up)', durationSeconds: 30, color: '#f59e0b', audioCue: 'Warning Triple Chime (440 Hz)' }
];

class PitchTimerBuzzerEngine {
  /**
   * Returns calibrated stage presentation timer configuration and audio cues.
   */
  getTimerConfiguration(payload = {}) {
    const { totalTimeSeconds = 180, qaTimeSeconds = 60 } = payload;

    return {
      success: true,
      totalPitchSeconds: totalTimeSeconds,
      qaDefenseSeconds: qaTimeSeconds,
      phases: PITCH_PHASES,
      audioFrequencies: {
        phaseChangeToneHz: 880,
        warningToneHz: 440,
        timeUpHardStopHz: 220
      },
      stageReadinessTips: [
        'At 02:30 remaining (30s in), you MUST be showing your live product demo.',
        'At 00:30 remaining, transition immediately from tech details to market TAM and your closing ask.'
      ]
    };
  }
}

const pitchTimerBuzzerEngine = new PitchTimerBuzzerEngine();
module.exports = { PitchTimerBuzzerEngine, pitchTimerBuzzerEngine, PITCH_PHASES };
