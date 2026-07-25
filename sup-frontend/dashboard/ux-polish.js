/**
 * PHOENIX Premium UX Polish & Micro-interactions
 * - 60fps Canvas Confetti Engine
 * - Guided Onboarding Tour
 * - Accent Color Theme Switcher
 */

// --- 1. CONFETTI ENGINE ---
function triggerConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#00f5ff', '#7b2ff7', '#f43f5e', '#22c55e', '#ff8a00'];
  const particles = [];

  for (let i = 0; i < 150; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height + 20,
      radius: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      angle: Math.random() * Math.PI - Math.PI,
      speed: Math.random() * 15 + 10,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 10 - 5,
      opacity: 1,
      gravity: 0.25
    });
  }

  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    particles.forEach(p => {
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed + p.gravity;
      p.speed *= 0.98; // Drag
      p.gravity += 0.05;
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.008;

      if (p.opacity > 0) {
        alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fillRect(-p.radius, -p.radius, p.radius * 2, p.radius * 2);
        ctx.restore();
      }
    });

    if (alive) {
      requestAnimationFrame(update);
    } else {
      document.body.removeChild(canvas);
    }
  }

  update();
}

// --- 2. ONBOARDING TOUR ---
const tourSteps = [
  {
    target: 'topXpContainer',
    text: 'This is your Level Momentum Bar. Fill this up by solving DSA, coding mock questions, and building hackathon projects to level up!'
  },
  {
    target: 'badgeRankVal',
    text: 'Your current Badge Rank! Grow your rank from Iron up to Silver, Gold, Platinum, and the ultimate Phoenix!'
  },
  {
    target: 'radarContainer',
    text: 'Your Tech Skill Radar. As you complete adaptive prep roadmaps and check off skills, this spider web chart adjusts dynamically.'
  },
  {
    target: 'heatmapContainer',
    text: 'Your learning contribution heatmap. Green squares indicate days you earned XP. Keep coding to prevent breaks!'
  },
  {
    target: 'hudFreezeVal',
    text: 'Streak Freeze shields. Use these tokens if you take a day off to keep your daily streak count safe.'
  }
];

let currentTourStep = 0;
let tourOverlay = null;

function startOnboardingTour() {
  // Prevent duplicate tours
  if (document.getElementById('tour-overlay')) return;

  // Create overlay
  tourOverlay = document.createElement('div');
  tourOverlay.id = 'tour-overlay';
  tourOverlay.style.position = 'fixed';
  tourOverlay.style.top = '0';
  tourOverlay.style.left = '0';
  tourOverlay.style.width = '100vw';
  tourOverlay.style.height = '100vh';
  tourOverlay.style.background = 'rgba(0,0,0,0.6)';
  tourOverlay.style.zIndex = '99998';
  tourOverlay.style.pointerEvents = 'auto';
  document.body.appendChild(tourOverlay);

  currentTourStep = 0;
  showTourBubble();
}

function showTourBubble() {
  // Remove existing bubble
  const oldBubble = document.getElementById('tour-bubble');
  if (oldBubble) document.body.removeChild(oldBubble);

  if (currentTourStep >= tourSteps.length) {
    // End tour
    if (tourOverlay) document.body.removeChild(tourOverlay);
    triggerConfetti();
    alert('🎉 Onboarding Tour Complete! Good luck on your career journey!');
    return;
  }

  const step = tourSteps[currentTourStep];
  const targetEl = document.getElementById(step.target);

  if (!targetEl) {
    // Skip if element not on page
    currentTourStep++;
    showTourBubble();
    return;
  }

  // Scroll to target element
  targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // Get coordinates
  const rect = targetEl.getBoundingClientRect();

  const bubble = document.createElement('div');
  bubble.id = 'tour-bubble';
  bubble.className = 'glass-card';
  bubble.style.position = 'fixed';
  bubble.style.zIndex = '99999';
  bubble.style.width = '300px';
  bubble.style.padding = '18px';
  bubble.style.border = '1px solid var(--cyan)';
  bubble.style.boxShadow = 'var(--shadow-glow-cyan)';
  bubble.style.background = 'rgba(12, 12, 29, 0.95)';
  bubble.style.pointerEvents = 'auto';

  // Position logic (place below target unless too low)
  let topPos = rect.bottom + window.scrollY + 12;
  let leftPos = rect.left + window.scrollX + (rect.width / 2) - 150;

  if (topPos + 180 > window.innerHeight) {
    topPos = rect.top + window.scrollY - 180;
  }
  leftPos = Math.max(10, Math.min(leftPos, window.innerWidth - 320));

  bubble.style.top = `${topPos}px`;
  bubble.style.left = `${leftPos}px`;

  bubble.innerHTML = `
    <div style="font-size:0.75rem; color:var(--cyan); font-family:'Space Grotesk',sans-serif; text-transform:uppercase; margin-bottom:6px;">Tour Step ${currentTourStep + 1}/${tourSteps.length}</div>
    <p style="font-size:0.85rem; line-height:1.5; color:#fff; margin-bottom:12px;">${step.text}</p>
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <button class="btn btn-secondary" onclick="skipTour()" style="padding:4px 8px; font-size:0.7rem;">Skip</button>
      <button class="btn btn-primary" onclick="nextTourStep()" style="padding:6px 12px; font-size:0.75rem;">Next Step ➜</button>
    </div>
  `;

  document.body.appendChild(bubble);

  // Briefly flash target element
  targetEl.style.transition = 'outline 0.3s ease';
  targetEl.style.outline = '2px solid var(--cyan)';
  targetEl.style.outlineOffset = '4px';
  setTimeout(() => {
    targetEl.style.outline = 'none';
  }, 1000);
}

function nextTourStep() {
  currentTourStep++;
  showTourBubble();
}

function skipTour() {
  const bubble = document.getElementById('tour-bubble');
  if (bubble) document.body.removeChild(bubble);
  if (tourOverlay) document.body.removeChild(tourOverlay);
}

// --- 3. THEME ACCENT SWITCHER ---
function toggleThemeAccent(color) {
  const root = document.documentElement;
  if (color === 'purple') {
    root.style.setProperty('--cyan', '#9b59b6');
    root.style.setProperty('--gradient-brand', 'linear-gradient(135deg, #9b59b6, #7b2ff7)');
  } else if (color === 'emerald') {
    root.style.setProperty('--cyan', '#2ecc71');
    root.style.setProperty('--gradient-brand', 'linear-gradient(135deg, #2ecc71, #27ae60)');
  } else if (color === 'coral') {
    root.style.setProperty('--cyan', '#f43f5e');
    root.style.setProperty('--gradient-brand', 'linear-gradient(135deg, #f43f5e, #ec4899)');
  } else {
    // Default Cyan
    root.style.setProperty('--cyan', '#00f5ff');
    root.style.setProperty('--gradient-brand', 'linear-gradient(135deg, #00f5ff, #7b2ff7)');
  }
}
