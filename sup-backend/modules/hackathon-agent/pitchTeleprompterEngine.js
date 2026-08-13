/**
 * Phoenix Apex Ultra: Feature 5 — 3-Minute Hackathon Pitch Teleprompter & 5-Slide Deck Engine
 * 
 * Generates timed 180-second teleprompter scripts with target WPMs and audio pacing alerts,
 * alongside complete 5-slide presentation decks ready for Marp / Slidev.
 */

class PitchTeleprompterEngine {
  /**
   * Generates a timed teleprompter script and speech pace milestones for 3-minute hackathon demos.
   */
  generateTeleprompter(project = {}) {
    const {
      title = 'NexusAudio — Multimodal IDE',
      tagline = 'Sub-300ms Collaborative Voice IDE with AST Complexity Profiling',
      problemStatement = 'Developers lose 35% of hackathon build time debugging distributed state synchronization and lack real-time code complexity linting.',
      demoKeyAction = 'We stream WebRTC audio coaching while our AST parser profiles Big-O complexity in sub-15ms.'
    } = project;

    const sections = [
      {
        phase: '1. The Hook & Problem (0:00 - 0:45)',
        durationSeconds: 45,
        targetWPM: 130,
        teleprompterScript: `Judges, over 80% of distributed hackathon teams struggle with uncoordinated builds and zero real-time code profiling. Meet ${title}: the ${tagline}. ${problemStatement}`,
        visualCue: 'Show title slide with problem statistics and market size.'
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

  /**
   * Generates a 5-Slide Pitch Deck formatted in Markdown for Marp / Slidev.
   */
  generate5SlideDeck(project = {}) {
    const {
      title = 'NexusAudio',
      tagline = 'Sub-300ms Collaborative Voice IDE with AST Complexity Profiling',
      teamMembers = 'Shashank J (Lead Architect), Alex (Backend), Dev (Frontend)',
      demoUrl = 'https://phoenixprep.tech'
    } = project;

    const slides = [
      {
        slideNumber: 1,
        title: `${title} — The Hook`,
        bullets: [tagline, 'Bridging the 2-Year Curriculum Gap & Supercharging Developer Workspaces', `Team: ${teamMembers}`]
      },
      {
        slideNumber: 2,
        title: 'The Problem & Market Opportunity',
        bullets: ['80% of engineering candidates fail technical interviews due to uncalibrated mock practice', 'Hackathon builders lack real-time architectural guidance', '$14B Global EdTech & Developer Tool TAM']
      },
      {
        slideNumber: 3,
        title: 'Live Product Demo & Innovation',
        bullets: ['Sub-300ms WebRTC Voice Coaching with Prosody Interruption Radar', 'Live AST Big-O Complexity Profiling ($O(N)$ vs $O(N^2)$)', 'Discord-Style Split-Chat Senior AI Copilot']
      },
      {
        slideNumber: 4,
        title: 'Technical Architecture & High Scalability',
        bullets: ['Two-Stage Hybrid Vector RAG with Reciprocal Rank Fusion (RRF)', 'Multi-Key Auto-Failover Engine (Groq 70B + Gemini 2.5)', 'In-Memory LRU Caching for <2ms Responses at Zero Cloud Spend']
      },
      {
        slideNumber: 5,
        title: 'Business Model & Unit Economics',
        bullets: ['B2B University Licensing: ₹1,500/student/year', 'Freemium Pro Developer Tier ($19/month)', `Live Production Demo: ${demoUrl}`]
      }
    ];

    return {
      title,
      totalSlides: 5,
      slides,
      marpMarkdown: slides.map(s => `--- \n# Slide ${s.slideNumber}: ${s.title}\n\n${s.bullets.map(b => `- ${b}`).join('\n')}`).join('\n\n')
    };
  }
}

const pitchTeleprompterEngine = new PitchTeleprompterEngine();
module.exports = { PitchTeleprompterEngine, pitchTeleprompterEngine };
