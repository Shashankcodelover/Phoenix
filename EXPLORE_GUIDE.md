# 🧭 EXPLORE_GUIDE.md — Guided Codebase Walkthrough

Welcome to **Project Phoenix v17.0**! This guided tour helps new developers and AI agent sessions navigate the full-stack architecture.

---

## 📍 Step 1: Start Here — Root & Server Gateway
1. **[README.md](README.md)** — High-level architectural ecosystem map and feature breakdown.
2. **[sup-backend/server.js](sup-backend/server.js)** — The Express application entry point, mounting middleware, zero-trust token bucket rate limiters, and route modules.

---

## 📍 Step 2: Enterprise Legal, Privacy & AI Governance
Path: `sup-backend/modules/enterprise/`
1. **[legalComplianceEngine.js](sup-backend/modules/enterprise/legalComplianceEngine.js)** — GDPR Art. 17/20 & India DPDP Act 2023 compliance engine. Generates machine-readable portability archives and cryptographic erasure receipts.
2. **[aiEthicsAuditEngine.js](sup-backend/modules/enterprise/aiEthicsAuditEngine.js)** — EEOC 4/5ths Disparate Impact Ratio (DIR) calculator, EU AI Act XAI Explainability breakdowns, and System Model Card registry.
3. **[cyberSecurityShield.js](sup-backend/modules/enterprise/cyberSecurityShield.js)** — Automated security auditing and vulnerability scanning.

---

## 📍 Step 3: AI Interview Coaching & Copilot Ecosystem
Path: `sup-backend/modules/interview-prep/`
1. **[copilotEngine.js](sup-backend/modules/interview-prep/copilotEngine.js)** — Stealth real-time sub-7-word hints with injection sanitizers.
2. **[agenticInterviewer.js](sup-backend/modules/interview-prep/agenticInterviewer.js)** — Context-aware conversational follow-up questions with sliding-window history.
3. **[patternRecognitionEngine.js](sup-backend/modules/interview-prep/patternRecognitionEngine.js)** — Longitudinal skill tracking across past mock sessions.
4. **[negotiationEngine.js](sup-backend/modules/interview-prep/negotiationEngine.js)** — Salary and equity counter-offer evaluator.
5. **[pacingCoachEngine.js](sup-backend/modules/interview-prep/pacingCoachEngine.js)** — Duration and WPM cadence analyzer.
6. **[depthProberEngine.js](sup-backend/modules/interview-prep/depthProberEngine.js)** — Layered L1 to L5 technical drill generator.
7. **[answerComparisonEngine.js](sup-backend/modules/interview-prep/answerComparisonEngine.js)** — Side-by-side A/B answer metrics comparator.

---

## 📍 Step 4: Frontend UI Portals
Path: `sup-frontend/`
1. **[sup-frontend/enterprise/legal-center.html](sup-frontend/enterprise/legal-center.html)** — Universal Legal, Privacy & AI Ethics Center with 1-click DSAR portal.
2. **[sup-frontend/interview-prep/copilot-studio.html](sup-frontend/interview-prep/copilot-studio.html)** — Interactive AI Copilot, Agentic Prober & Pacing Studio.
3. **[sup-frontend/horizon/world-dashboard.html](sup-frontend/horizon/world-dashboard.html)** — Academic roadmap dashboard with AI Guide Bot.
4. **[sup-frontend/index.html](sup-frontend/index.html)** — Main Phoenix Command Gateway.

---

## 📍 Step 5: Native Test Suite
Path: `sup-backend/test/`
Run all tests:
```bash
cd sup-backend
npm test
```
- **[v17_legal_ai_governance.test.js](sup-backend/test/v17_legal_ai_governance.test.js)** — GDPR, DPDP, EEOC 4/5ths, and XAI test suite.
- **[v16_deep_coaching.test.js](sup-backend/test/v16_deep_coaching.test.js)** — Pattern recognition, pacing, probers, and answer comparator test suite.
- **[v15_agentic_ecosystem.test.js](sup-backend/test/v15_agentic_ecosystem.test.js)** — Copilot, culture fit, and bias mitigator tests.
