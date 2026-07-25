/**
 * Phoenix Interactive Guided Tour Engine v3.1
 * Upfront Centered Guided Pointer Spotlight Modal with step-by-step pointers & gamified XP rewards.
 */

class PhoenixGuidedTour {
  constructor() {
    this.currentStep = 0;
    this.steps = [
      {
        title: '👉 Step 1: Universal Developer Identity',
        description: 'Start by filling in your core identity. Your email and name tune your personalized Phoenix AI coach.',
        highlightTarget: 'tb-1'
      },
      {
        title: '👉 Step 2: GitHub & LinkedIn Verification',
        description: 'Provide your GitHub & LinkedIn profiles! Phoenix extracts real commits, repos, and skills to power your STAR story miner.',
        highlightTarget: 'tb-2'
      },
      {
        title: '👉 Step 3: Technical Skills Matrix',
        description: 'Specify your core tech stack (React, Node.js, Python) and select your hackathon team specialty role.',
        highlightTarget: 'tb-3'
      },
      {
        title: '👉 Step 4: Choose Destination World',
        description: 'Pick between Placement World (A-to-Z Interview prep) or Hackathon World (A-to-Z Champion series)!',
        highlightTarget: 'tb-4'
      },
      {
        title: '👉 Step 5: Live Devfolio Challenge Input',
        description: 'Pre-loaded with live Devfolio hackathon data (PushToProd India: Building at the Frontier by Anthropic & Elevation Capital).',
        highlightTarget: 'tb-5'
      },
      {
        title: '👉 Step 6: Launch Portal & Unlock Series!',
        description: 'Click Launch to unlock your personalized A-to-Z accelerator world!',
        highlightTarget: 'tb-6'
      }
    ];
  }

  init() {
    this.createTourOverlay();
  }

  createTourOverlay() {
    if (document.getElementById('tourOverlay')) return;

    // Dark backdrop overlay
    const overlay = document.createElement('div');
    overlay.id = 'tourOverlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(15, 12, 6, 0.75);
      backdrop-filter: blur(6px);
      z-index: 99999;
      display: none;
      align-items: center;
      justify-content: center;
    `;

    // UPFRONT CENTERED MODAL CARD
    const card = document.createElement('div');
    card.id = 'tourTooltipCard';
    card.style.cssText = `
      position: relative;
      background: #FAF9F6;
      border: 3px solid #D4AF37;
      border-radius: 20px;
      padding: 32px;
      width: 90%;
      max-width: 520px;
      box-shadow: 0 20px 60px rgba(212, 175, 55, 0.35);
      z-index: 100000;
      font-family: 'Inter', sans-serif;
      color: #1F1A0E;
      text-align: center;
      animation: modalPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    `;

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <span style="font-size:0.8rem; font-weight:800; color:#B8860B; text-transform:uppercase; letter-spacing:1.5px;" id="tourStepBadge">Step 1 of 6</span>
        <button onclick="window.phoenixTour.endTour()" style="background:none; border:none; color:#7E7560; cursor:pointer; font-weight:700; font-size:1.1rem;">✕</button>
      </div>
      <h3 id="tourTitle" style="font-family:'Space Grotesk', sans-serif; font-size:1.4rem; font-weight:800; color:#D4AF37; margin-bottom:12px;"></h3>
      <p id="tourDesc" style="font-size:0.92rem; color:#4A4231; line-height:1.6; margin-bottom:24px;"></p>
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:0.8rem; font-weight:700; color:#2E7D32; background:rgba(46,125,50,0.1); padding:4px 10px; border-radius:12px;">🎮 +100 XP Onboarding Bonus</span>
        <button class="btn btn-primary" id="tourNextBtn" onclick="window.phoenixTour.nextStep()" style="padding:10px 24px; font-size:0.9rem; font-weight:700; background:linear-gradient(135deg, #D4AF37, #B8860B); color:#FFF; border:none; border-radius:8px; cursor:pointer;">Next Step ➔</button>
      </div>
    `;

    overlay.appendChild(card);
    document.body.appendChild(overlay);
  }

  startTour() {
    this.createTourOverlay();
    this.currentStep = 0;
    document.getElementById('tourOverlay').style.display = 'flex';
    this.renderStep();
  }

  renderStep() {
    const step = this.steps[this.currentStep];
    if (!step) {
      this.endTour();
      return;
    }

    document.getElementById('tourStepBadge').innerText = `Step ${this.currentStep + 1} of ${this.steps.length}`;
    document.getElementById('tourTitle').innerText = step.title;
    document.getElementById('tourDesc').innerText = step.description;

    if (step.highlightTarget && typeof switchTab === 'function') {
      switchTab(this.currentStep + 1);
    }

    if (this.currentStep === this.steps.length - 1) {
      document.getElementById('tourNextBtn').innerText = 'Finish & Launch Portal 🎉';
    } else {
      document.getElementById('tourNextBtn').innerText = 'Next Step ➔';
    }
  }

  nextStep() {
    this.currentStep++;
    if (this.currentStep >= this.steps.length) {
      this.endTour();
    } else {
      this.renderStep();
    }
  }

  endTour() {
    const overlay = document.getElementById('tourOverlay');
    if (overlay) overlay.style.display = 'none';
  }
}

window.phoenixTour = new PhoenixGuidedTour();
