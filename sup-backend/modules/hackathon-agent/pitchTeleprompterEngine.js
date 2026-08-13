/**
 * Phoenix v23.0: Interactive 3-Minute Pitch Teleprompter Engine
 */

class PitchTeleprompterEngine {
  /**
   * Generates a timed teleprompter script and speech pace milestones for 3-minute hackathon demos.
   */
  generateTeleprompter(project = {}) {
    const {
      title = 'Phoenix Platform',
      tagline = 'Autonomous Career, Hackathon & Enterprise CS Operating System',
      problemStatement = 'Students face fragmented preparation with outdated syllabi, lack of live voice coaching, and no automated hackathon pitch defense.',
      demoKeyAction = 'We stream sub-300ms WebRTC voice coaching while simultaneously analyzing Big-O code complexity and RAG architectural blueprints.'
    } = project;

    const sections = [
      {
        phase: '1. The Hook & Problem (0:00 - 0:45)',
        durationSeconds: 45,
        targetWPM: 130,
        teleprompterScript: `Judges, over 80% of engineering students struggle to bridge the gap between college curriculum and Tier-1 tech interviews. Meet ${title}: the ${tagline}. ${problemStatement}`,
        visualCue: 'Show title slide with problem statistics.'
      },
      {
        phase: '2. Live Demo & Core Innovation (0:45 - 1:45)',
        durationSeconds: 60,
        targetWPM: 140,
        teleprompterScript: `Let us show you how it works in real time. ${demoKeyAction} Notice the instantaneous feedback and zero-reload transitions.`,
        visualCue: 'Switch screen to live interactive UI demo.'
      },
      {
        phase: '3. Technical Architecture & Scalability (1:45 - 2:30)',
        durationSeconds: 45,
        targetWPM: 135,
        teleprompterScript: `Under the hood, we built a Two-Stage Hybrid Vector RAG with Cross-Encoder re-ranking and multi-key auto-failover, supporting 20,000+ users at zero cloud cost.`,
        visualCue: 'Display architecture topology diagram.'
      },
      {
        phase: '4. Market Opportunity & Wrap-Up (2:30 - 3:00)',
        durationSeconds: 30,
        targetWPM: 130,
        teleprompterScript: `With B2B university licensing and freemium pro developer tiers, ${title} is ready to deploy globally today. Thank you, we are now ready for your questions!`,
        visualCue: 'Show closing slide with GitHub and live URL QR code.'
      }
    ];

    return {
      title,
      totalDurationSeconds: 180,
      totalWordsEstimated: 390,
      sections,
      pacingAlarmThresholds: [
        { second: 45, alert: 'WRAP HOOK: Move to Live Demo screen immediately.' },
        { second: 105, alert: 'DEMO HALFWAY: Highlight technical architecture tradeoffs.' },
        { second: 165, alert: '30s WARNING: Conclude with business model and invite Q&A.' }
      ]
    };
  }
}

const pitchTeleprompterEngine = new PitchTeleprompterEngine();
module.exports = { PitchTeleprompterEngine, pitchTeleprompterEngine };
