# 🧭 EXPLORE_GUIDE.md — Guided Codebase Walkthrough

Welcome to **Project Phoenix**! This guided tour helps new developers and AI agent sessions understand the repository structure quickly.

---

## 📍 Step 1: Start Here — Root & Server Gateway
1. **[README.md](README.md)** — Project overview and high-level architectural ecosystem map.
2. **[sup-backend/server.js](sup-backend/server.js)** — The Express application entry point. Look here to see middleware initialization, security shield registration, and route mounting.

---

## 📍 Step 2: Input Security & Middleware Pipeline
1. **[sup-backend/middleware/inputValidator.js](sup-backend/middleware/inputValidator.js)** — Schema validation middleware enforcing required fields, string lengths, array bounds, and stripping unknown properties.
2. **[sup-backend/middleware/promptShield.js](sup-backend/middleware/promptShield.js)** — Zero-trust prompt injection shield scanning payloads for malicious injection patterns.
3. **[sup-backend/middleware/responseCache.js](sup-backend/middleware/responseCache.js)** — In-memory LRU cache engine preventing redundant AI provider calls.

---

## 📍 Step 3: Core Interview & Placement Feature Modules
Path: `sup-backend/modules/interview-prep/`

1. **[behavioralPressureEngine.js](sup-backend/modules/interview-prep/behavioralPressureEngine.js)** — Evaluates candidate answers under simulated production outage stress and computes crisis composure ratings.
2. **[latencyCircuitBreakerEngine.js](sup-backend/modules/interview-prep/latencyCircuitBreakerEngine.js)** — Analyzes microservice topology for p95/p99 latency budgets, SPOF vulnerabilities, and circuit breaker health.
3. **[speechEvaluatorEngine.js](sup-backend/modules/interview-prep/speechEvaluatorEngine.js)** — Analyzes vocal prosody, WPM speech pacing, filler word frequency, and confidence indices.
4. **[starStorySynthesizer.js](sup-backend/modules/interview-prep/starStorySynthesizer.js)** — Formats raw project achievements into structured 4-step STAR stories.
5. **[compBenchmarkingEngine.js](sup-backend/modules/interview-prep/compBenchmarkingEngine.js)** — Localized salary and equity compensation benchmarks across global tech hubs.
6. **[prepController.js](sup-backend/modules/interview-prep/prepController.js)** & **[prepRoutes.js](sup-backend/modules/interview-prep/prepRoutes.js)** — Request handling and API endpoint definitions.

---

## 📍 Step 4: Frontend UI Portals
Path: `sup-frontend/`

1. **[sup-frontend/dashboard/dashboard.html](sup-frontend/dashboard/dashboard.html)** — The main Phoenix Command Portal interface.
2. **[sup-frontend/interview-prep/practice.html](sup-frontend/interview-prep/practice.html)** — Interactive mock interview practice environment.
3. **[sup-frontend/interview-prep/system-design.html](sup-frontend/interview-prep/system-design.html)** — System design architecture evaluation workspace.

---

## 📍 Step 5: Native Test Suite
Path: `sup-backend/test/`

Run all tests via:
```bash
npm test
```
- **[v10_features.test.js](sup-backend/test/v10_features.test.js)** — Tests for behavioral pressure and latency circuit breaker engines.
- **[v9_features.test.js](sup-backend/test/v9_features.test.js)** — Tests for STAR story synthesizer, comp benchmarking, pitch decks, webhooks, and quest engines.
