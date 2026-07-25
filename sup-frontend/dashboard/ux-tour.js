/**
 * Phoenix Interactive Guided Tour Engine v3.0
 * Gamified Onboarding Pointer Spotlight with visual callouts and step-by-step guidance.
 */

class PhoenixGuidedTour {
  constructor() {
    this.currentStep = 0;
    this.steps = [
      {
        elementId: 'wizStep1',
        title: '👉 Step 1: Universal Profile Identification',
        description: 'Start by filling in your core identity. Your email and name tune your personal Phoenix AI coach.',
        pointerPosition: 'bottom'
      },
      {
        elementId: 'wizStep2',
        title: '👉 Step 2: GitHub & LinkedIn Verification',
        description: 'Provide your GitHub & LinkedIn profiles! Phoenix extracts real commits and skills to power your STAR story miner.',
        pointerPosition: 'bottom'
      },
      {
        elementId: 'wizStep3',
        title: '👉 Step 3: Technical Skill Matrix',
        description: 'Specify your core tech stack (React, Node.js, Python) and select your hackathon team specialty role.',
        pointerPosition: 'bottom'
      },
      {
        elementId: 'wizStep4',
        title: '👉 Step 4: Choose Destination World',
        description: 'Pick between Placement World (A-to-Z Interview prep) or Hackathon World (A-to-Z Champion series)!',
        pointerPosition: 'top'
      },
      {
        elementId: 'wizStep5',
        title: '👉 Step 5: Demo Event & JD Calibrator',
        description: 'Pre-loaded with live Devfolio data (PushToProd India: Building at the Frontier). Adjust your target statement here.',
        pointerPosition: 'top'
      },
      {
        elementId: 'wizStep6',
        title: '👉 Step 6: Launch Portal & Unlock Series!',
        description: 'Click Launch to unlock your personalized A-to-Z accelerator world!',
        pointerPosition: 'top'
      }
    ];
  }

  init() {
    this.createTourOverlay();
  }

  createTourOverlay() {
    if (document.getElementById('tourOverlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'tourOverlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(31, 26, 14, 0.4);
      z-index: 9999;
      pointer-events: none;
      display: none;
    `;

    const card = document.createElement('div');
    card.id = 'tourTooltipCard';
    card.style.cssText = `
      position: fixed;
      bottom: 40px; right: 40px;
      background: #FAF8F5;
      border: 2px solid #D4AF37;
      border-radius: 16px;
      padding: 24px;
      max-width: 360px;
      box-shadow: 0 10px 40px rgba(184, 134, 11, 0.25);
      z-index: 10000;
      pointer-events: auto;
      font-family: 'Inter', sans-serif;
      color: #1F1A0E;
    `;

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <span style="font-size:0.75rem; font-weight:800; color:#B8860B; text-transform:uppercase; letter-spacing:1px;" id="tourStepBadge">Step 1 of 6</span>
        <button onclick="window.phoenixTour.endTour()" style="background:none; border:none; color:#8C8065; cursor:pointer; font-weight:700;">✕ Skip</button>
      </div>
      <h4 id="tourTitle" style="font-family:'Space Grotesk', sans-serif; font-size:1.1rem; font-weight:700; color:#D4AF37; margin-bottom:8px;"></h4>
      <p id="tourDesc" style="font-size:0.85rem; color:#5C523B; line-height:1.5; margin-bottom:16px;"></p>
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:0.75rem; font-weight:700; color:#2E7D32;">🎮 +100 XP Onboarding Bonus</span>
        <button class="btn btn-primary" id="tourNextBtn" onclick="window.phoenixTour.nextStep()" style="padding:6px 16px; font-size:0.8rem;">Next Step ➔</button>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(card);
  }

  startTour() {
    this.createTourOverlay();
    this.currentStep = 0;
    document.getElementById('tourOverlay').style.display = 'block';
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

    if (this.currentStep === this.steps.length - 1) {
      document.getElementById('tourNextBtn').innerText = 'Finish & Launch 🎉';
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
    const card = document.getElementById('tourTooltipCard');
    if (card) card.style.display = 'none';
    const overlay = document.getElementById('tourOverlay');
    if (overlay) overlay.style.display = 'none';
  }
}

window.phoenixTour = new PhoenixGuidedTour();
