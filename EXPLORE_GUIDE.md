# 🧭 EXPLORE_GUIDE.md — Guided Codebase Walkthrough

Welcome to **Project Phoenix v19.0**! This guided tour helps developers and AI agent sessions navigate the full-stack architecture.

---

## 📍 Step 1: Root & Client Router
1. **[README.md](README.md)** — High-level architectural ecosystem map and feature breakdown.
2. **[sup-frontend/phoenix-router.js](sup-frontend/phoenix-router.js)** — Client-Side SPA Component Router enabling zero-reload transitions, dynamic component push/pop, and History API state synchronization.
3. **[sup-backend/server.js](sup-backend/server.js)** — Express application entry point.

---

## 📍 Step 2: AST Complexity, Multi-Agent Panel & IRT Engines
Path: `sup-backend/modules/interview-prep/`
1. **[astComplexityEngine.js](sup-backend/modules/interview-prep/astComplexityEngine.js)** — Static AST analysis for Big-O Time/Space complexity, loop depth, and maintainability scoring.
2. **[multiAgentPanelEngine.js](sup-backend/modules/interview-prep/multiAgentPanelEngine.js)** — 3-person FAANG panel simulator (Bar-Raiser, Tech Lead, Hiring Manager).
3. **[canvasTopologyEngine.js](sup-backend/modules/interview-prep/canvasTopologyEngine.js)** — DFS cycle detector and topology validator for system design diagrams.
4. **[irtAdaptiveEngine.js](sup-backend/modules/interview-prep/irtAdaptiveEngine.js)** — 2-Parameter Item Response Theory (IRT) adaptive question selection.

---

## 📍 Step 3: Real-Time Audio & Fast Vector Engines
Path: `sup-backend/modules/`
1. **[interview-prep/realtimeVoiceEngine.js](sup-backend/modules/interview-prep/realtimeVoiceEngine.js)** — Sub-300ms bidirectional PCM audio stream processing, RMS energy VAD, pitch tremor stress scoring.
2. **[hackathon-agent/hnswVectorEngine.js](sup-backend/modules/hackathon-agent/hnswVectorEngine.js)** — O(log N) approximate nearest neighbor (ANN) k-NN vector search with multi-layer HNSW graph indexing.
3. **[enterprise/tokenMeteringEngine.js](sup-backend/modules/enterprise/tokenMeteringEngine.js)** — Stripe-ready token credit wallet management, tier quotas, and usage-based deduction.

---

## 📍 Step 4: Enterprise Legal, Privacy & AI Governance
Path: `sup-backend/modules/enterprise/`
1. **[legalComplianceEngine.js](sup-backend/modules/enterprise/legalComplianceEngine.js)** — GDPR Art. 17/20 & India DPDP Act 2023 compliance engine.
2. **[aiEthicsAuditEngine.js](sup-backend/modules/enterprise/aiEthicsAuditEngine.js)** — EEOC 4/5ths Disparate Impact Ratio (DIR) calculator, EU AI Act XAI Explainability breakdowns.

---

## 📍 Step 5: Native Test Suite
Path: `sup-backend/test/`
Run all tests:
```bash
cd sup-backend
npm test
```
- **[v19_ast_multi_agent_panel.test.js](sup-backend/test/v19_ast_multi_agent_panel.test.js)** — AST Complexity, Multi-Agent Panel, Canvas Topology, and IRT Adaptive tests.
- **[v18_world_leading_ecosystem.test.js](sup-backend/test/v18_world_leading_ecosystem.test.js)** — Real-time PCM voice, HNSW vector search, B2B token metering tests.
- **[v17_legal_ai_governance.test.js](sup-backend/test/v17_legal_ai_governance.test.js)** — GDPR, DPDP, EEOC 4/5ths, and XAI test suite.
- **[v16_deep_coaching.test.js](sup-backend/test/v16_deep_coaching.test.js)** — Pattern recognition, pacing, probers, and answer comparator test suite.
- **[v15_agentic_ecosystem.test.js](sup-backend/test/v15_agentic_ecosystem.test.js)** — Copilot, culture fit, and bias mitigator tests.
