# 🔥 Project Phoenix v9.0 — Ultimate Autonomous Career Operating System

> **Google & Microsoft Senior Staff Engineering Standards Compliance**  
> A Next-Generation Platform for **Placement Interview Preparation**, **Turn-Based Hackathon Simulations**, **STAR Story Synthesizer**, **Salary & Equity Comp Benchmarking**, **5-Slide Pitch Deck Generator**, **Outbound Signed Webhook Relay**, and **Daily Streak & XP Quests**.

---

## 🌟 Architectural Architecture & Dual-World Design

Project Phoenix bridges the gap between theoretical algorithm practice and real-world project building. The platform is architected into **two distinct, high-fidelity feature ecosystems**:

```
                                🏰 PHOENIX COMMAND PORTAL
                                      (dashboard.html)
                                              │
            ┌─────────────────────────────────┴─────────────────────────────────┐
            ▼                                                                   ▼
┌───────────────────────────────────────┐               ┌───────────────────────────────────────┐
│ ⚔️ PLACEMENT & INTERVIEW WORLD        │               │ 🚀 HACKATHON & BUILDER WORLD          │
├───────────────────────────────────────┤               ├───────────────────────────────────────┤
│ • 🗺️ Adaptive Syllabus Roadmap        │               │ • 💡 AI Idea Generator (Winner RAG)   │
│ • 🎙️ Bar-Raiser AI Mock Simulator     │               │ • 🎮 10-Stage Hackathon Simulator     │
│ • 📄 ATS Resume Diff Engine           │               │ • ⚖️ Live 3-Round AI Judge Defense    │
│ • 📚 200+ Multi-Domain PYQ Bank       │               │ • 🎤 5-Slide Pitch Presenter Blueprint│
│ • 🏢 Company & Role Intelligence      │               │ • 🔍 AI Code Review Audit Agent       │
│ • 📊 Placement Readiness Index        │               │ • ⚡ LRU Response Cache Engine        │
│ • 🌟 STAR Behavioral Story Miner      │               │ • 📡 Outbound Signed Webhook Relay    │
│ • 💰 Salary & Equity Comp Benchmarks  │               │ • 🏆 Daily Streak Multipliers & XP    │
└───────────────────────────────────────┘               └───────────────────────────────────────┘
```

---

## 🧠 Centralized Modular AI Dispatch Core & LRU Response Cache

Phoenix replaces monolithic LLM calls with a **Modular AI Dispatch Engine** combined with **LRU In-Memory Response Caching**:

$$\text{Request} \xrightarrow{\text{LRU Cache Hit?}} \text{Return Cached Payload (0ms)} \xrightarrow{\text{Cache Miss}} \text{Multi-Provider AI Cascade}$$

$$\text{Primary Model} \xrightarrow{\text{fallback}} \text{Gemini Flash} \xrightarrow{\text{fallback}} \text{Groq 70B} \xrightarrow{\text{fallback}} \text{OpenAI} \xrightarrow{\text{fallback}} \text{OpenRouter} \xrightarrow{\text{fallback}} \text{Local Engine}$$

| Feature Slot | Assigned Task | Primary Model | Why Selected |
|---|---|---|---|
| 💡 `creative` | Hackathon Ideas, STAR Stories, Pitches | **Gemini 2.5 Flash** | Top creative reasoning, aware of 2026 tech trends |
| 🧠 `analytical` | Code Reviews, Stage Eval, ATS Diff | **Groq Llama 3.3 70B** | Ultra-fast inference (500 tokens/sec), strict JSON |
| 💬 `conversational` | Mock Interviews, Mentor Panels, Live Defense | **Gemini 2.5 Flash** | High conversational fluency, natural coaching |
| 📋 `structured` | Roadmaps, Schedules, Company Intelligence | **Groq Llama 3.3 70B** | Precise structured data generation |
| 📝 `document` | Resume Tailoring, Revision Sheets | **Gemini 2.5 Flash** | Deep document understanding & Markdown formatting |
| ⚡ `quick` | Phoenix Copilot Bot Assistant | **Groq Llama 3.1 8B** | Sub-second response time for UI navigation |

---

## 🛡️ Google-Grade Security & Zero-Trust Hardening

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 GOOGLE-GRADE SECURITY & ARCHITECTURE HARDENING               │
├───────────────────────┬────────────────────────────┬────────────────────────┤
│ 🛡️ Zero-Trust Auth    │ 🚫 Prompt Injection Shield │ 🔒 Security Headers    │
│ Bearer JWT Protection │ Blocks jailbreaks & XSS    │ HSTS, X-Frame-Options  │
│ Env Secret Binding    │ Payload ceiling < 50KB     │ X-Content-Type Guard   │
└───────────────────────┴────────────────────────────┴────────────────────────┘
```

1. **Zero-Trust JWT Auth Middleware (`authMiddleware.js`)**: All private endpoints enforce `Authorization: Bearer <token>` verification against `process.env.JWT_SECRET`.
2. **Prompt Injection Shield (`promptShield.js`)**: Scans all incoming AI payloads and blocks prompt injection/jailbreak attempts (`ignore previous instructions`, `system override`, `DAN mode`).
3. **XSS & Payload Ceiling Guard**: Strips dangerous HTML/script tags recursively and enforces a **50KB maximum payload ceiling** to protect server memory.
4. **Security Headers**: Injects `Strict-Transport-Security`, `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, and `X-XSS-Protection: 1; mode=block`.

---

## 🚀 Key Feature Ecosystems

### 1. ⚔️ Placement & Interview World (`/interview-prep/`)
- **200+ Multi-Domain PYQ Bank**: Searchable Previous Year Questions across DSA, Aptitude, Core CS (OS, DBMS, CN, OOP), and System Design tagged by company and role.
- **Company & Role Intelligence Engine**: Round-by-round hiring profiles, topic weightages, and strategic interview tips for Google, Amazon, Microsoft, Meta, TCS, Infosys, Flipkart, Paytm, Razorpay, etc.
- **ATS Resume Diff & Optimizer Engine**: Side-by-side line diff showing original vs ATS-hardened bullet points with impact metrics.
- **Placement Readiness Index Telemetry**: Single 0-100% telemetry index with weak-area alerts and weekly momentum velocity.
- **Bar-Raiser AI Mock Simulator**: Interactive mock interviews with difficulty scaling (Foundational → Bar Raiser) and filler word frequency tracking.

### 2. 🚀 Hackathon & Builder World (`/hackathon-agent/`)
- **Live 3-Round AI Judge Defense Simulator**: Interactive live Q&A defense (Architecture $\rightarrow$ Concurrency Stress Test $\rightarrow$ Monetization) yielding a 0-100 verdict scorecard.
- **Hackathon Winner Solutions RAG Archive**: RAG database of 15 real-world winning solutions (SIH, Google Solution Challenge, ETHIndia, Imagine Cup, Flipkart GRiD) injected directly into idea generation prompts.
- **10-Stage Hackathon Game Engine**: Turn-based game loop with 4 AI teammate personas (Alex, Maya, Rohan, Elena), real-world Chaos Events, and specialized AI judges.
- **AI Code Review Audit Agent**: Analyzes code snippets for OWASP security flaws, performance bottlenecks, and architectural clarity with 4-axis JSON scores.

---

## 💻 Installation & Quick Start

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local MongoDB instance or MongoDB Atlas URI

### Setup Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Shashankcodelover/phoenix-interview-prep.git
   cd phoenix-interview-prep
   ```

2. **Install backend dependencies:**
   ```bash
   cd sup-backend
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env` in `sup-backend`:
   ```bash
   cp .env.example .env
   ```
   Configure your keys in `.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/phoenix-prep
   JWT_SECRET=phoenix_super_secret_jwt_key_2026

   # AI Provider Keys (Leave blank for procedural local fallbacks)
   GEMINI_API_KEY=your_gemini_api_key_here
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. **Run Automated Test Suite:**
   ```bash
   npm test
   ```
   *Runs 47 Node.js native unit & integration tests across 15 test suites covering Speech Prosody, P2P Signaling Room Engine, System Design SLA Evaluator, Hackathon Urgency Scorer, Skill Radar Matrix, `/health`, Prompt Shield, Input Validation, LRU Response Cache, PYQ Question Bank, Company Intelligence, Winner RAG, Live Judge Defense, ATS Resume Diff, and Readiness Telemetry.*

5. **Start the backend server:**
   ```bash
   npm start
   ```

6. **Open Frontend:**
   Open `sup-frontend/splash/splash.html` or `sup-frontend/dashboard/dashboard.html` in your browser.

---

## 📜 License & Security Standards
Licensed under the **MIT License**. Built in compliance with **GDPR**, **FERPA**, and **Google Enterprise Security Guidelines**.
