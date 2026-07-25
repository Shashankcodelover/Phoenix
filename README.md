# 🔥 Project Phoenix V3: Ultimate Hackathon & Interview Prep Engine

Project Phoenix is a next-generation platform designed to accelerate student careers through **turn-based hackathon simulations** and **adaptive AI-powered placement preparation**. 

Engineered with Google Senior Engineering standards, Phoenix bridges the gap between theoretical algorithm practice and real-world project building.

---

## 🌟 Key Architectural Capabilities

### 1. 🎮 10-Stage Hackathon Simulator Engine (`/hackathon-agent/simulator.html`)
- **Turn-Based Pipeline:** Guides users through assembly, stack choice, USP definition, slide deck structure, and judge evaluation.
- **🤖 4 AI Teammate Personas:** Alex (The Builder), Maya (The Designer), Rohan (The Founder), and Elena (The AI Dreamer). Teammates react dynamically to your decisions, offering domain feedback and casting crew votes.
- **🎲 Chaos Incident Engine:** Triggers unexpected real-world challenges (API rate limits, Wi-Fi outages, coffee spills, sponsor bounties) with binary trade-offs.
- **⚖️ 5 Specialized AI Judges:** Victoria Vance (VC Investor), Dr. Marcus Vance (Architect), Sarah Lin (Design Lead), Dr. Aris Thorne (AI Specialist), and Gordon Techsy (The Brutal Roaster).
- **📊 Multi-Axis Scoring Matrix:** Calculates scores across Innovation, Execution, Design, and Pitch with judge-specific weighting.

### 2. 🛡️ Hardened Security & Multi-Provider AI Architecture
- **Multi-Provider AI Fallback Router:** Automatically cascades requests across `Gemini-1.5-Flash` → `OpenAI gpt-4o-mini` → `OpenRouter` → `Local Procedural Engine`. Guarantees 100% uptime with 0 application crashes even if API keys are missing or blank.
- **Prompt Injection Shield:** Detects and blocks jailbreak attempts (`ignore previous instructions`, `system override`) before reaching LLMs.
- **XSS & Payload Sanitization:** Recursive HTML stripping and a strict 50KB payload ceiling.
- **Anti-AI Language Filter:** Strips generic AI copywriter jargon ("delve", "realm", "robust", "seamless") for natural, humanized feedback.

### 3. 🔍 AI Code Review Agent (`/hackathon-agent/code-review.html`)
- Audits hackathon code snippets for OWASP security flaws, performance bottlenecks, readability, and modular architecture.

### 4. 💼 Placement & Interview Prep Track
- **Peer-to-Peer Mock Match w/ AI Safety-Net:** Instant AI interviewer takeover if a peer fails to join within 3 minutes.
- **RPG-Style Skill Tree:** 5-tier visual progression system (Foundations → Phoenix Mastery).
- **System Design Whiteboard w/ AI Red Team:** Interactive architectural canvas tested by adversarial AI attacks.
- **Enterprise Recruiter Talent Board:** Anonymized student talent profiles with consent-gated access workflows and FERPA/GDPR DSAR compliance.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or URI)

### Quick Start Setup

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
   *Optionally add your `GEMINI_API_KEY`. If left blank, the system automatically uses the local procedural AI engine!*

4. **Run the server:**
   ```bash
   node server.js
   ```
   *Server will run at `http://localhost:5000`.*

5. **Open Frontend:**
   Open `sup-frontend/dashboard/dashboard.html` or `sup-frontend/hackathon-agent/simulator.html` in your browser.

---

## 📜 License & Compliance
Licensed under the MIT License. Fully compliant with GDPR and FERPA data privacy directives.
