# Jira Tracker: Phoenix (Unified Interview Prep & Hackathon Command Center)

## 📌 Project Aim & Modern World Relevance
Phoenix merges interview preparation and hackathon lifecycle management into a single platform. Students upload resumes, get AI-generated study roadmaps, discover hackathons, auto-fill applications, and mine their projects into interview stories — all in one gamified feedback loop.

---

## 🔍 V20 Upgrade: Hackathon Command Center

The **Command Center** is the core new feature — a 5-phase end-to-end hackathon lifecycle manager:

1. **Discovery** — Find & configure your target hackathon details
2. **AI Idea Generator** — Gemini generates top 10 winning ideas based on rules/constraints  
3. **Team Polling** — Vote on ideas, declare a winner, refine with extra instructions
4. **Project Roadmap** — Sprint-board task manager with per-member assignments across 5 phases
5. **Individual Guide** — Personalized A-to-Z build instructions for each team member

---

## 🛠️ V20 Upgrade Action Checklist

### Backend
- [x] **Task 1**: Create `ideaGeneratorController.js` — AI idea generation + refinement endpoints
- [x] **Task 2**: Create `roadmapController.js` — Project roadmap + individual member guide endpoints
- [x] **Task 3**: Wire 4 new routes into `agentRoutes.js`

### Frontend
- [x] **Task 4**: Build `command-center.html` — 5-tab phased UI with glassmorphic design
- [x] **Task 5**: Add navigation link in existing `agent.html`

### Documentation
- [x] **Task 6**: Update JIRA_TRACKER.md & EXPLAINER.md
- [x] **Task 7**: Integrate Hackathon Winning AI Prompt Guide into project documentation (`docs/HACKATHON_WINNING_PROMPT_GUIDE.md`) and CEO Checklist.

---

## 🚦 Status Summary
- **Overall Status**: Completed ✅
- **New API Endpoints**: 4 (`generate-ideas`, `refine-ideas`, `project-roadmap`, `member-guide`)
- **New Frontend Pages**: 1 (`command-center.html` with 5 interactive phases)
- **Files Modified**: 1 (`agentRoutes.js`)
- **Files Created**: 5 (2 controllers + 1 HTML page + 1 markdown guide + tracker updates)



