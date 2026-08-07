# 🗺️ ROADMAP & SYSTEM DATA FLOW — Project Phoenix v13.0

## 📐 End-to-End System Architecture

```text
 📱 CLIENT UI LAYER (Glassmorphic SPA / PWA)
 ├── onboarding.html (Frictionless 3-Click Stage Diagnostic)
 ├── world-dashboard.html (Stage Roadmap, Daily Checklist, AI Guide Bot)
 └── index.html (Main Career & Hackathon Gateway)
       │
       ▼
 🛡️ SECURITY & TRAFFIC GATEWAY
 ├── InputSanitizer & PromptShield (Zero-Trust Input Injection Protection)
 ├── TokenBucketRateLimiter (Atomic Token Refill, Burst Allowance, 429 Retry-After)
 └── PayloadSigner & HMAC Verification
       │
       ▼
 ⚙️ APPLICATION ENGINE LAYER
 ├── CS Academic Pipelines:
 │   ├── cs-pu/puCurriculumEngine.js (2-Year Roadmap, KCET/COMEDK/JEE, Board PYQs)
 │   ├── cs-diploma/diplomaCurriculumEngine.js (3-Year Roadmap, DCET, Lateral Entry Guide)
 │   └── cs-engineering/engCurriculumEngine.js (8-Sem Placement Roadmap, Readiness Index)
 ├── AI & Assessment Engines:
 │   ├── ai-guide-bot/guideBotEngine.js (Intent Recognition, Live Page Element Focusing)
 │   ├── interview-prep/reasoningIntegrityEngine.js (Code Playback, Typing Cadence, AI Probing)
 │   ├── security/sastSecurityScanner.js (Automated SAST Security Auditing)
 │   ├── horizon/mentorWebhookRelay.js (Signed Senior Mentor Question Relay)
 │   └── horizon/scholarshipEngine.js (SSP & SNQ Fee Waiver Predictor)
 └── Multi-Provider AI Cascade Engine (Gemini 2.5 → Groq 70B → Groq 8B → OpenAI → OpenRouter → Local)
```

---

## 🚀 2026 Competitive Differentiation

1. **Integrity-First AI Probing (vs Old Surveillance)**: Instead of invasive webcam spying, Phoenix tracks code typing dynamics (keystroke variance, bulk paste) and issues conversational AI reasoning probes.
2. **Zero-Friction Frictionless Diagnostic**: Matches candidates to exact academic roadmaps (PU, Diploma, B.Tech) in 3 clicks.
3. **10K Free User Scalability**: 5-tier AI model fallback cascade guarantees 100% platform availability free of cost.
