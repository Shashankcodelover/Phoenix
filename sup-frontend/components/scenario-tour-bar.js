/**
 * scenario-tour-bar.js
 * Phoenix Carrier-Grade Evaluator Sandbox Scenario Tour Bar
 * Provides 1-click zero-setup demonstration walkthroughs across all 3 pillars and governance mesh.
 */

(function () {
  'use strict';

  // ── Web Audio Acoustic Feedback ──
  class PhoenixSoundEngine {
    constructor() {
      this.ctx = null;
      this.muted = localStorage.getItem('phoenix_audio_muted') === 'true';
    }

    init() {
      if (!this.ctx && typeof window !== 'undefined') {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggleMute() {
      this.muted = !this.muted;
      localStorage.setItem('phoenix_audio_muted', this.muted ? 'true' : 'false');
      return !this.muted;
    }

    playTone(freq = 440, type = 'sine', duration = 0.12, gainVal = 0.08) {
      if (this.muted) return;
      try {
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {}
    }

    playSuccessChime() {
      if (this.muted) return;
      this.playTone(523.25, 'triangle', 0.15, 0.09); // C5
      setTimeout(() => this.playTone(659.25, 'triangle', 0.15, 0.09), 80); // E5
      setTimeout(() => this.playTone(783.99, 'triangle', 0.25, 0.1), 160); // G5
    }

    playWarpTone() {
      if (this.muted) return;
      this.playTone(330, 'sawtooth', 0.1, 0.06);
      setTimeout(() => this.playTone(440, 'sine', 0.15, 0.08), 70);
      setTimeout(() => this.playTone(880, 'sine', 0.2, 0.07), 140);
    }

    playClickChirp() {
      if (this.muted) return;
      this.playTone(880, 'sine', 0.04, 0.04);
    }
  }

  const sound = new PhoenixSoundEngine();

  // ── Scenarios Definition ──
  const SCENARIOS = [
    {
      id: 'sc-horizon',
      emoji: '🌅',
      name: 'Horizon: KCET/DCET Bridge',
      badge: 'Pillar 1',
      badgeClass: 'badge-cyan',
      description: 'Karnataka Regional Entrance (KCET/DCET), Supernumerary Seat Matcher & Syllabus Gap Radar',
      targetPath: 'horizon/world-dashboard.html',
      profile: {
        name: 'Preetham J',
        email: 'preetham@university.edu',
        github: 'https://github.com/Shashankcodelover',
        linkedin: 'https://linkedin.com/in/preetham-j',
        portfolio: 'https://preetham-portfolio.dev',
        skills: ['C++', 'Python', 'Web Basics', 'Math', 'Physics'],
        teamSpecialty: 'The Builder (Backend / Infra / Scalability)',
        targetDescription: 'Targeting Karnataka KCET Top 500 & DCET Lateral Entry Bridge to CSE with AI & ML.',
        destinationWorld: 'horizon'
      }
    },
    {
      id: 'sc-placement',
      emoji: '💼',
      name: 'Interview: FAANG 7d Sprint',
      badge: 'Pillar 2',
      badgeClass: 'badge-indigo',
      description: '200+ PYQ Question Bank, Sub-300ms Voice Coach, AST Code Sandbox & System Design Canvas',
      targetPath: 'interview-prep/roadmap.html',
      profile: {
        name: 'Shashank J',
        email: 'shashank@apex-candidate.dev',
        github: 'https://github.com/Shashankcodelover',
        linkedin: 'https://linkedin.com/in/shashank-j',
        portfolio: 'https://shashankj.tech',
        skills: ['TypeScript', 'Node.js', 'React', 'Go', 'Distributed Systems', 'PostgreSQL', 'Redis'],
        teamSpecialty: 'The Builder (Backend / Infra / Scalability)',
        targetDescription: 'Google L4 Systems & Amazon Senior Backend Engineer role. Focusing on high QPS concurrency, Raft consensus, and LeetCode Hard DSA.',
        destinationWorld: 'interview'
      }
    },
    {
      id: 'sc-hackathon',
      emoji: '🏆',
      name: 'Hackathon: 36h War Room',
      badge: 'Pillar 3',
      badgeClass: 'badge-coral',
      description: 'Anthropic Frontier AI Project, 4-Pillar Team Matcher, 5-Slide Pitch Deck & AI Judge Defense',
      targetPath: 'hackathon-agent/command-center.html',
      profile: {
        name: 'Apex Innovator',
        email: 'founder@phoenix-nexus.ai',
        github: 'https://github.com/Shashankcodelover',
        linkedin: 'https://linkedin.com/in/preetham-j',
        portfolio: 'https://preetham-portfolio.dev',
        skills: ['Python', 'FastAPI', 'Claude 3.7 API', 'Vector RAG', 'WebSockets', 'Next.js 15'],
        teamSpecialty: 'The AI Dreamer (LLM / RAG / Vector DB)',
        targetDescription: 'Push to Prod Hackathon (Anthropic & Elevation Capital): Autonomous Multi-Agent Voice Coach with CRDT Zero-Latency Workspace.',
        destinationWorld: 'hackathon'
      }
    },
    {
      id: 'sc-mesh',
      emoji: '🌐',
      name: 'Enterprise Topology Mesh',
      badge: 'Governance',
      badgeClass: 'badge-blue',
      description: '8 Engineering Arenas, 6 PQC Interop Corridors, 1-Click Sever/Restore & Sub-20ms SLA Telemetry',
      targetPath: 'enterprise/mesh.html',
      profile: null
    }
  ];

  // Helper to compute correct relative path
  function getRelativePrefix() {
    const p = window.location.pathname;
    if (p.includes('/horizon/') || p.includes('/interview-prep/') || p.includes('/hackathon-agent/') || p.includes('/enterprise/') || p.includes('/dashboard/') || p.includes('/profile/') || p.includes('/auth/') || p.includes('/splash/')) {
      return '../';
    }
    return './';
  }

  function activateScenario(scId) {
    const sc = SCENARIOS.find(s => s.id === scId);
    if (!sc) return;

    sound.playWarpTone();

    if (sc.profile) {
      try {
        localStorage.setItem('userProfile', JSON.stringify(sc.profile));
        localStorage.setItem('onboardingCompleted', 'true');
        localStorage.setItem('phoenix_active_scenario', sc.id);
      } catch (e) {}
    }

    // Toast notification if Phoenix.Toast exists
    if (window.Phoenix && window.Phoenix.Toast) {
      window.Phoenix.Toast.success(`Activated ${sc.name}! Loading scenario...`);
    }

    const prefix = getRelativePrefix();
    const dest = prefix + sc.targetPath;

    setTimeout(() => {
      window.location.href = dest;
    }, 300);
  }

  // ── Render Bar ──
  function injectTourBar() {
    if (document.getElementById('phoenixScenarioTourBar')) return;

    const prefix = getRelativePrefix();
    const bar = document.createElement('aside');
    bar.id = 'phoenixScenarioTourBar';
    bar.className = 'phoenix-tour-bar';
    bar.setAttribute('aria-label', 'Evaluator Sandbox Scenario Tour Bar');

    const audioIcon = sound.muted ? '🔇' : '🔊';

    bar.innerHTML = `
      <div class="ptb-inner">
        <div class="ptb-label-group">
          <span class="ptb-pulse-dot"></span>
          <span class="ptb-brand">⚡ EVALUATOR TOUR</span>
        </div>
        <div class="ptb-scenarios">
          ${SCENARIOS.map(sc => `
            <button type="button" class="ptb-btn" data-scid="${sc.id}" title="${sc.description}">
              <span class="ptb-emoji">${sc.emoji}</span>
              <span class="ptb-name">${sc.name}</span>
              <span class="ptb-badge ${sc.badgeClass}">${sc.badge}</span>
            </button>
          `).join('')}
        </div>
        <div class="ptb-actions">
          <a href="${prefix}enterprise/governance.html" class="ptb-tool-btn" title="Open Enterprise Career Data Governance & Storage Studio">
            🛡️ <span class="ptb-hide-mobile">Governance</span>
          </a>
          <button type="button" class="ptb-tool-btn ptb-audio-toggle" id="ptbAudioToggle" title="Toggle Sound Feedback">
            ${audioIcon}
          </button>
        </div>
      </div>
    `;

    // Inject styles
    const style = document.createElement('style');
    style.textContent = `
      .phoenix-tour-bar {
        position: sticky;
        top: 0;
        left: 0;
        right: 0;
        z-index: 10000;
        background: rgba(10, 15, 30, 0.92);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        border-bottom: 1px solid rgba(0, 217, 255, 0.28);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
        color: #e2e8f0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 0.82rem;
      }
      .ptb-inner {
        max-width: 1400px;
        margin: 0 auto;
        padding: 6px 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        flex-wrap: wrap;
      }
      .ptb-label-group {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 800;
        letter-spacing: 0.6px;
        font-size: 0.72rem;
        color: #00d9ff;
        text-transform: uppercase;
        white-space: nowrap;
      }
      .ptb-pulse-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #00d9ff;
        box-shadow: 0 0 10px #00d9ff;
        animation: ptbPulse 1.8s infinite;
      }
      @keyframes ptbPulse {
        0% { transform: scale(0.95); opacity: 0.7; }
        50% { transform: scale(1.3); opacity: 1; }
        100% { transform: scale(0.95); opacity: 0.7; }
      }
      .ptb-scenarios {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        flex: 1;
        justify-content: center;
      }
      .ptb-btn {
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: #f1f5f9;
        padding: 4px 10px;
        border-radius: 6px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 0.76rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.18s ease;
        text-decoration: none;
        white-space: nowrap;
      }
      .ptb-btn:hover {
        background: rgba(0, 217, 255, 0.15);
        border-color: #00d9ff;
        transform: translateY(-1px);
        box-shadow: 0 2px 10px rgba(0, 217, 255, 0.25);
      }
      .ptb-emoji { font-size: 0.95rem; }
      .ptb-badge {
        font-size: 0.65rem;
        font-weight: 700;
        padding: 1px 6px;
        border-radius: 999px;
        text-transform: uppercase;
      }
      .badge-cyan { background: rgba(0, 217, 255, 0.2); color: #38bdf8; border: 1px solid rgba(0, 217, 255, 0.4); }
      .badge-indigo { background: rgba(99, 102, 241, 0.2); color: #a5b4fc; border: 1px solid rgba(99, 102, 241, 0.4); }
      .badge-coral { background: rgba(244, 63, 94, 0.2); color: #fda4af; border: 1px solid rgba(244, 63, 94, 0.4); }
      .badge-blue { background: rgba(168, 85, 247, 0.2); color: #d8b4fe; border: 1px solid rgba(168, 85, 247, 0.4); }
      .ptb-actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .ptb-tool-btn {
        background: rgba(255, 255, 255, 0.07);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: #cbd5e1;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 0.74rem;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        text-decoration: none;
        transition: all 0.15s ease;
      }
      .ptb-tool-btn:hover {
        background: rgba(255, 255, 255, 0.14);
        color: #ffffff;
      }
      @media (max-width: 860px) {
        .ptb-hide-mobile { display: none; }
        .ptb-inner { justify-content: center; }
      }
    `;

    document.head.appendChild(style);

    // Insert as the first element of body
    if (document.body.firstChild) {
      document.body.insertBefore(bar, document.body.firstChild);
    } else {
      document.body.appendChild(bar);
    }

    // Attach click listeners
    bar.querySelectorAll('.ptb-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const scid = btn.getAttribute('data-scid');
        activateScenario(scid);
      });
    });

    const audioToggle = document.getElementById('ptbAudioToggle');
    if (audioToggle) {
      audioToggle.addEventListener('click', () => {
        const unmuted = sound.toggleMute();
        audioToggle.textContent = unmuted ? '🔊' : '🔇';
        sound.playClickChirp();
      });
    }
  }

  // Initialize on DOMContentLoaded or immediately if ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectTourBar);
  } else {
    injectTourBar();
  }

  // Expose global controller
  window.PhoenixTourBar = {
    activateScenario,
    sound
  };

})();
