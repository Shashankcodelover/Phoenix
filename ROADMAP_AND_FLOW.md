# 🗺️ ROADMAP_AND_FLOW.md — Architectural Vision, Tech Stack Rationale & Data Flow

---

## 🎯 1. Why Project Phoenix Exists

Traditional interview prep platforms (LeetCode, HackerRank, Interviewing.io) focus on isolated coding puzzles in a vacuum. Real-world engineering candidates fail not from lack of LeetCode practice, but because:
1. **They freeze under production outage pressure** during behavioral/system design curveball questions.
2. **They lack real-time architectural resilience awareness** (p95/p99 latency budgets, SPOFs, circuit breaker fallbacks).
3. **They struggle to synthesize technical achievements** into clear STAR behavioral stories and high-impact salary negotiations.

Project Phoenix solves this by creating a unified dual-world operating system: an **Interview Placement Engine** coupled with an **Autonomous Hackathon & Builder Simulator**.

---

## 🛠️ 2. Tech Stack & Architectural Rationale

| Layer | Technology | Architectural Rationale |
| :--- | :--- | :--- |
| **Backend API** | Node.js (v18+) & Express | Event-driven, non-blocking I/O ideal for real-time interview telemetry, streaming responses, and lightweight microservices. |
| **Database** | MongoDB & Mongoose | Flexible JSON schema modeling for dynamic question banks, candidate progress telemetry, and user profiles. |
| **Validation & Security** | Custom Lightweight Schema & Prompt Shield | Zero external dependency schema validator (`inputValidator.js`) and prompt injection shield (`promptShield.js`) to block malicious payloads cleanly. |
| **Caching Layer** | In-Memory LRU Cache | In-memory LRU cache (`responseCache.js`) reduces AI provider latency and saves API quota usage on repeated queries. |
| **Frontend UI** | Vanilla HTML5, CSS3 & Modern JavaScript | Fast loading, low cognitive load, zero build step overhead for immediate accessibility under interview stress. |
| **Testing** | Node.js Native Test Runner (`node:test`) | Fast, zero-dependency test runner executing 60 tests under 2 seconds. |

---

## 🔄 3. End-to-End Data & User Flow

```text
[ User / Candidate ]
         │
         ▼
[ Frontend Portal (sup-frontend/dashboard.html) ]
         │
         ├── 1. Enters Practice Session / Answer / System Diagram
         ▼
[ Express API Gateway (server.js) ]
         │
         ├── 2. Input Security Middleware (inputSanitizer & inputValidator)
         ├── 3. Prompt Shield Verification (promptShield.js)
         │
         ├── 4. LRU Cache Check (responseCache.js)
         │        ├── (Hit)  ──> Return Cached Response Immediately
         │        └── (Miss) ──> Dispatch to Feature Engine
         │
         ├── 5. Autonomous Feature Engines
         │        ├── Behavioral Pressure Engine (behavioralPressureEngine.js)
         │        ├── Latency & Circuit Breaker Engine (latencyCircuitBreakerEngine.js)
         │        ├── Speech & Vocal Prosody Evaluator (speechEvaluatorEngine.js)
         │        ├── STAR Story Synthesizer (starStorySynthesizer.js)
         │        └── AI Judge Simulator (judgeSimulatorController.js)
         │
         └── 6. Returns Structured Telemetry & Actionable Recommendations
```

---

## 🚀 4. Competitive Differentiation (Role 1 Benchmark)

- **vs. LeetCode**: Beyond static pass/fail unit tests, Phoenix evaluates system SLA latency limits, SPOFs, and vocal/behavioral composure under stress.
- **vs. Exponent / Interviewing.io**: Provides offline-capable, instant automated telemetry (STAR frameworks, salary benchmarks, circuit breaker health) without waiting for peer scheduling.
- **vs. Generic AI Chatbots**: Uses structured domain-specific fallback cascades and input security shields rather than unpredictable raw chat outputs.
