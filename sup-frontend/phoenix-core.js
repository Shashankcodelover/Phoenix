/**
 * Phoenix Core — Shared UI Module v2.0
 * 
 * Eliminates code duplication across 30+ pages.
 * Provides: Particles, Auth, Theme, Toast, API, Navigation, Loading states.
 * 
 * Usage: <script src="./phoenix-core.js"></script> (or relative path)
 * Then call: PhoenixCore.init() in your page script.
 */

const PhoenixCore = (() => {
  // ─── Dynamic API Base Resolver (Fixes hardcoded localhost) ───
  const getApiBaseUrl = () => {
    if (window.location.protocol === 'file:') return 'http://localhost:5000/api/v1';
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return `http://${window.location.hostname}:5000/api/v1`;
    }
    return `${window.location.origin}/api/v1`;
  };

  // ─── Particle Background ───
  const Particles = {
    canvas: null,
    ctx: null,
    particles: [],
    running: false,

    init(canvasId = 'particles', count = 50) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      window.addEventListener('resize', () => this.resize());

      this.particles = [];
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          radius: Math.random() * 1.3 + 0.3,
          dx: (Math.random() - 0.5) * 0.18,
          dy: (Math.random() - 0.5) * 0.18,
          opacity: Math.random() * 0.3 + 0.08
        });
      }
      if (!this.running) {
        this.running = true;
        this.animate();
      }
    },

    resize() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    },

    animate() {
      if (!this.ctx || !this.canvas) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      const isDark = document.body.classList.contains('theme-dark-obsidian');
      const baseColor = isDark ? '0, 245, 255' : '0, 112, 243';

      this.particles.forEach(p => {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${baseColor}, ${p.opacity})`;
        this.ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > this.canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > this.canvas.height) p.dy *= -1;
      });

      // Draw connections between nearby particles
      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const dist = Math.hypot(
            this.particles[i].x - this.particles[j].x,
            this.particles[i].y - this.particles[j].y
          );
          if (dist < 100) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
            this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
            this.ctx.strokeStyle = `rgba(${baseColor}, ${0.04 * (1 - dist / 100)})`;
            this.ctx.lineWidth = 0.5;
            this.ctx.stroke();
          }
        }
      }

      requestAnimationFrame(() => this.animate());
    }
  };

  // ─── Theme System ───
  const Theme = {
    current: 'dark-obsidian',
    themes: ['dark-obsidian', 'light-cyan', 'gold-rich'],
    themeLabels: {
      'dark-obsidian': '🖥️ Midnight',
      'light-cyan': '☀️ Light',
      'gold-rich': '✨ Gold'
    },

    init() {
      this.current = localStorage.getItem('phoenixTheme') || 'dark-obsidian';
      this.apply(this.current);
    },

    apply(theme) {
      document.body.classList.remove('theme-light-cyan', 'theme-dark-obsidian', 'theme-gold-rich');
      document.body.classList.add(`theme-${theme}`);
      this.current = theme;
      localStorage.setItem('phoenixTheme', theme);

      // Update toggle button text if it exists
      const btn = document.getElementById('themeToggleBtn');
      if (btn) btn.textContent = this.themeLabels[theme] || theme;
    },

    cycle() {
      const idx = this.themes.indexOf(this.current);
      const next = this.themes[(idx + 1) % this.themes.length];
      this.apply(next);
    }
  };

  // ─── Authentication ───
  const Auth = {
    getToken() {
      return localStorage.getItem('token');
    },
    getUser() {
      try {
        return JSON.parse(localStorage.getItem('user') || '{}');
      } catch { return {}; }
    },
    getUserId() {
      const u = this.getUser();
      return u._id || u.id || null;
    },
    requireAuth(redirectUrl = '../auth/login.html') {
      if (!this.getToken()) {
        window.location.href = redirectUrl;
        return false;
      }
      return true;
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '../auth/login.html';
    },
    bindLogout() {
      const btn = document.getElementById('logoutBtn');
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.logout();
        });
      }
    }
  };

  // ─── Toast Notifications (XSS Hardened) ───
  const Toast = {
    container: null,

    init() {
      if (document.getElementById('phoenix-toast-container')) return;
      this.container = document.createElement('div');
      this.container.id = 'phoenix-toast-container';
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    },

    show(message, type = 'info', duration = 4000) {
      if (!this.container) this.init();
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };

      // XSS Protection: Safely escape message via DOM textNode
      const iconSpan = document.createElement('span');
      iconSpan.className = 'toast-icon';
      iconSpan.textContent = icons[type] || 'ℹ';

      const msgSpan = document.createElement('span');
      msgSpan.className = 'toast-message';
      msgSpan.textContent = String(message);

      const closeBtn = document.createElement('button');
      closeBtn.className = 'toast-close';
      closeBtn.textContent = '×';
      closeBtn.onclick = () => toast.remove();

      toast.appendChild(iconSpan);
      toast.appendChild(msgSpan);
      toast.appendChild(closeBtn);

      this.container.appendChild(toast);
      requestAnimationFrame(() => toast.classList.add('toast-visible'));
      setTimeout(() => {
        toast.classList.remove('toast-visible');
        setTimeout(() => toast.remove(), 300);
      }, duration);
    },

    success(msg, dur) { this.show(msg, 'success', dur); },
    error(msg, dur) { this.show(msg, 'error', dur); },
    warning(msg, dur) { this.show(msg, 'warning', dur); },
    info(msg, dur) { this.show(msg, 'info', dur); }
  };

  // ─── API Helper ───
  const API = {
    get baseUrl() {
      return getApiBaseUrl();
    },

    async request(endpoint, options = {}) {
      const url = `${this.baseUrl}${endpoint}`;
      const token = Auth.getToken();
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(options.headers || {})
      };

      try {
        const res = await fetch(url, { ...options, headers });
        const data = await res.json();
        if (!res.ok) {
          Toast.error(data.message || `Request failed (${res.status})`);
          return { ok: false, data, status: res.status };
        }
        return { ok: true, data, status: res.status };
      } catch (err) {
        Toast.error('Connection error. Is the server running?');
        return { ok: false, data: null, status: 0, error: err };
      }
    },

    get(endpoint) {
      return this.request(endpoint);
    },

    post(endpoint, body) {
      return this.request(endpoint, {
        method: 'POST',
        body: JSON.stringify(body)
      });
    }
  };

  // ─── Mobile Navigation ───
  const Nav = {
    init() {
      const navbar = document.querySelector('.navbar');
      if (!navbar) return;

      if (!document.querySelector('.hamburger-btn')) {
        const hamburger = document.createElement('button');
        hamburger.className = 'hamburger-btn';
        hamburger.id = 'hamburgerBtn';
        hamburger.setAttribute('aria-label', 'Toggle navigation menu');
        hamburger.innerHTML = `<span></span><span></span><span></span>`;
        const navLinks = navbar.querySelector('.nav-links');
        if (navLinks) {
          navbar.insertBefore(hamburger, navLinks);
        }

        hamburger.addEventListener('click', () => {
          hamburger.classList.toggle('is-active');
          navLinks.classList.toggle('nav-open');
          document.body.classList.toggle('nav-overlay-active');
        });

        if (navLinks) {
          navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
              hamburger.classList.remove('is-active');
              navLinks.classList.remove('nav-open');
              document.body.classList.remove('nav-overlay-active');
            });
          });
        }

        document.addEventListener('click', (e) => {
          if (!e.target.closest('.navbar')) {
            hamburger.classList.remove('is-active');
            if (navLinks) navLinks.classList.remove('nav-open');
            document.body.classList.remove('nav-overlay-active');
          }
        });
      }
    }
  };

  // ─── Loading / Skeleton States ───
  const Loading = {
    show(containerId, message = 'Loading...') {
      const el = document.getElementById(containerId);
      if (!el) return;
      el.innerHTML = `
        <div class="loading-state">
          <div class="loading-spinner"></div>
          <p>${message}</p>
        </div>
      `;
    },
    hide(containerId) {
      const el = document.getElementById(containerId);
      if (el) {
        const loader = el.querySelector('.loading-state');
        if (loader) loader.remove();
      }
    }
  };

  // ─── Smooth Page Transitions ───
  const Transitions = {
    init() {
      document.body.classList.add('page-enter');
      document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('javascript')) return;
        link.addEventListener('click', (e) => {
          e.preventDefault();
          document.body.classList.add('page-exit');
          setTimeout(() => { window.location.href = href; }, 250);
        });
      });
    }
  };

  // ─── Master Initializer ───
  function init(options = {}) {
    const {
      particles = true,
      particleCount = 50,
      auth = false,
      authRedirect = '../auth/login.html',
      theme = true,
      nav = true,
      transitions = true
    } = options;

    if (theme) Theme.init();
    if (auth && !Auth.requireAuth(authRedirect)) return;

    Toast.init();
    if (nav) Nav.init();

    if (particles) {
      Particles.init('particles', particleCount);
    }

    Auth.bindLogout();
    if (transitions) Transitions.init();

    if (window.PhoenixBot) {
      PhoenixBot.init();
    } else {
      const botScript = document.createElement('script');
      const relDepth = window.location.pathname.includes('/interview-prep/') || window.location.pathname.includes('/hackathon-agent/') || window.location.pathname.includes('/dashboard/') || window.location.pathname.includes('/profile/') || window.location.pathname.includes('/auth/') || window.location.pathname.includes('/splash/') ? '../phoenix-bot.js' : './phoenix-bot.js';
      botScript.src = relDepth;
      botScript.onload = () => {
        if (window.PhoenixBot) PhoenixBot.init();
      };
      document.head.appendChild(botScript);
    }
  }

  // ─── Guided Onboarding Tour System ───
  const Tour = {
    steps: [
      {
        title: "🔥 Welcome to Project Phoenix!",
        content: "Phoenix is your dual-world platform for Placement Interview Preparation and Hackathon Acceleration. Let's take a quick 45-second tour of what's inside!",
        world: "both",
        icon: "⚡"
      },
      {
        title: "⚔️ Placement & Interview World",
        content: "Master placement rounds with Adaptive Syllabus Roadmaps, Bar-Raiser AI Mock Interviews, ATS Resume Disruption, Peer Matching, and System Design Whiteboards.",
        world: "interview",
        icon: "⚔️"
      },
      {
        title: "🚀 Hackathon & Builder World",
        content: "Discover global hackathons, generate winning project ideas using RAG over past winners, play the 10-stage hackathon game engine, and run AI code audits.",
        world: "hackathon",
        icon: "🚀"
      },
      {
        title: "🤖 Phoenix Copilot & Safety Shield",
        content: "Click the floating AI Copilot button anytime in the bottom-right corner for instant navigation, code assistance, and system guidance. All requests are protected by our Prompt Injection Shield!",
        world: "both",
        icon: "🛡️"
      }
    ],

    currentStep: 0,
    modal: null,

    start() {
      this.currentStep = 0;
      this.render();
    },

    render() {
      let modal = document.getElementById('phoenix-tour-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'phoenix-tour-modal';
        modal.className = 'tour-overlay';
        document.body.appendChild(modal);
      }

      const step = this.steps[this.currentStep];

      modal.innerHTML = `
        <div class="tour-card glass-card">
          <div class="tour-header">
            <span class="tour-icon">${step.icon}</span>
            <h3>${step.title}</h3>
            <button class="tour-close" onclick="Phoenix.Tour.close()">×</button>
          </div>
          <div class="tour-body">
            <p>${step.content}</p>
          </div>
          <div class="tour-footer">
            <div class="tour-dots">
              ${this.steps.map((_, i) => `<span class="tour-dot ${i === this.currentStep ? 'active' : ''}"></span>`).join('')}
            </div>
            <div class="tour-btns">
              ${this.currentStep > 0 ? `<button class="btn btn-sm btn-secondary" onclick="Phoenix.Tour.prev()">Back</button>` : ''}
              ${this.currentStep < this.steps.length - 1 
                ? `<button class="btn btn-sm btn-primary" onclick="Phoenix.Tour.next()">Next</button>` 
                : `<button class="btn btn-sm btn-primary" onclick="Phoenix.Tour.close()">Finish Tour 🚀</button>`}
            </div>
          </div>
        </div>
      `;

      requestAnimationFrame(() => modal.classList.add('active'));
    },

    next() {
      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++;
        this.render();
      }
    },

    prev() {
      if (this.currentStep > 0) {
        this.currentStep--;
        this.render();
      }
    },

    close() {
      const modal = document.getElementById('phoenix-tour-modal');
      if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
      }
      localStorage.setItem('phoenixTourCompleted', 'true');
    }
  };

  // Public API
  return {
    init,
    Particles,
    Theme,
    Auth,
    Toast,
    API,
    Nav,
    Loading,
    Transitions,
    Tour
  };
})();

// Global shorthands & backwards-compatibility functions
window.Phoenix = PhoenixCore;
window.PhoenixAuth = PhoenixCore.Auth;
window.animateParticles = function(canvasId = 'particles', count = 50) {
  if (PhoenixCore && PhoenixCore.Particles) {
    PhoenixCore.Particles.init(canvasId, count);
  }
};
