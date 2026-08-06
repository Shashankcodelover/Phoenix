# PHOENIX INTERVIEW PREP — DAILY OPERATING DIRECTIVES

## DAILY WORKFLOW — ONE COMPLETE THREE-PHASE CYCLE PER DAY

Every session follows a **SINGLE COMPLETE THREE-PHASE CYCLE** combining the **BUILDER**, **REJECTOR**, and **BUILDER (RESOLVER)** identities in strict sequence. This cycle runs **once per day at 9:00 AM** (or when the daily session is started). The standard is **10X improvement per day** — not incremental polish, but measurable, testable, feature-rich advancement.

---

### 🔄 THE COMPLETE DAILY THREE-PHASE CYCLE

```text
                               ┌──────────────────────────────────────────┐
                               │  START DAILY SESSION (09:00 AM Trigger)  │
                               └────────────────────┬─────────────────────┘
                                                    │
                                                    ▼
 ┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
 │  PHASE 1: THE BUILDER — RESEARCH, PLAN & BUILD (BUILDER_PROMPT.md)                               │
 ├──────────────────────────────────────────────────────────────────────────────────────────────────┤
 │  1. Read `AGENT_PROMPTS/BUILDER_PROMPT.md` and adopt the Master Builder Identity.               │
 │  2. Read `REJECTION_REPORT.md` — if yesterday's open items exist, note them for Phase 3.        │
 │  3. Read `docs/upcoming-features/` for the implementation plan & feature backlog.               │
 │  4. RESEARCH: Search the web, study competitors, analyze trends. Produce a CHECKLIST            │
 │     of 10–15 actionable improvements/features with evidence for each.                           │
 │  5. BUILD: Implement a MINIMUM of 5–10 features/improvements from that checklist.               │
 │  6. Move through ALL 6 Builder Roles in sequence:                                               │
 │     • Role 1: Research & Competitive Intelligence (web search, competitor audit)                 │
 │     • Role 2: UI/UX Design (improve interactions, add feedback states)                          │
 │     • Role 3: Software & Feature Engineering (build 5–10 features from checklist)               │
 │     • Role 4: QA / Test Engineering (write tests for EVERY new feature, run full suite)          │
 │     • Role 5: Security Engineering (audit new code for vulnerabilities)                         │
 │     • Role 6: Documentation (update README, TASKS, ROADMAP, CHANGELOG, EXPLORE_GUIDE)           │
 │  7. Commit all Phase 1 work to `daily-improvements` branch.                                     │
 └──────────────────────────────────────────────────┬───────────────────────────────────────────────┘
                                                    │
                                                    ▼
 ┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
 │  PHASE 2: THE REJECTOR — ADVERSARIAL AUDIT (REJECTOR_PROMPT.md)                                  │
 ├──────────────────────────────────────────────────────────────────────────────────────────────────┤
 │  1. Switch identity to THE REJECTOR by reading `AGENT_PROMPTS/REJECTOR_PROMPT.md`.              │
 │  2. Perform a COMPLETE, line-by-line audit of the ENTIRE updated codebase.                      │
 │  3. Find a MINIMUM of 10–15 real, evidenced loopholes/flaws across all 8 categories.            │
 │  4. Score all 8 categories harshly (0–10). Be unsparing.                                        │
 │  5. Update `REJECTION_REPORT.md` at project root with verdict, scores, and all open items.      │
 │  6. Every rejection point MUST have: file path, line number, evidence, severity, reason.        │
 └──────────────────────────────────────────────────┬───────────────────────────────────────────────┘
                                                    │
                                                    ▼
 ┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
 │  PHASE 3: THE BUILDER (RESOLVER) — FIX ALL REJECTIONS & TEST (BUILDER_PROMPT.md)                 │
 ├──────────────────────────────────────────────────────────────────────────────────────────────────┤
 │  1. Switch back to BUILDER identity via `AGENT_PROMPTS/BUILDER_PROMPT.md`.                      │
 │  2. Read the freshly updated `REJECTION_REPORT.md` from Phase 2.                               │
 │  3. FIX EVERY Critical and Major rejection point. Do not skip any.                              │
 │  4. Write or update tests for every fix. Run `npm test` — 100% pass rate required.              │
 │  5. Update documentation to reflect all changes.                                                │
 │  6. Update `REJECTION_REPORT.md` with resolution notes under each fixed item.                   │
 │  7. Final commit to `daily-improvements` with clear message listing what was resolved.          │
 └──────────────────────────────────────────────────┬───────────────────────────────────────────────┘
                                                    │
                                                    ▼
                               ┌──────────────────────────────────────────┐
                               │   END DAILY CYCLE (Final Commit & Report)│
                               └──────────────────────────────────────────┘
```

---

## 📐 DAILY OUTPUT STANDARDS (NON-NEGOTIABLE)

| Metric | Minimum Requirement |
| :--- | :--- |
| **Phase 1 Research Checklist** | 10–15 actionable items with web-sourced evidence |
| **Phase 1 Features Built** | 5–10 new features/improvements implemented |
| **Phase 1 Tests Written** | Unit + integration tests for every new feature |
| **Phase 2 Rejection Points** | 10–15 real, evidenced loopholes found |
| **Phase 2 Scorecard** | All 8 categories scored 0–10, harshly |
| **Phase 3 Fixes Applied** | ALL Critical + Major rejections resolved |
| **Phase 3 Test Pass Rate** | 100% across full test suite |
| **Net Daily Improvement** | 10X measurable advancement over yesterday |

---

## 📌 PERMISSION & SIGN-OFF PROTOCOL

- **Local Execution (Autonomous)**: The agent has full authority to edit files, run tests (`npm test`), create documentation, and commit locally to branch `daily-improvements`.
- **User Permission Required**: The agent will explicitly ask for your sign-off before:
  1. Pushing to any remote GitHub repository (`git push`).
  2. Merging `daily-improvements` into `main`.
  3. Modifying production credentials or environment secrets.

---

## 📁 REFERENCE PROMPT LOCATIONS

- **Builder Prompt**: [`AGENT_PROMPTS/BUILDER_PROMPT.md`](file:///d:/users/Shashank%20J/Desktop/my%20stufs/phoenix-interview-prep/AGENT_PROMPTS/BUILDER_PROMPT.md)
- **Rejector Prompt**: [`AGENT_PROMPTS/REJECTOR_PROMPT.md`](file:///d:/users/Shashank%20J/Desktop/my%20stufs/phoenix-interview-prep/AGENT_PROMPTS/REJECTOR_PROMPT.md)
- **Rejection Report**: [`REJECTION_REPORT.md`](file:///d:/users/Shashank%20J/Desktop/my%20stufs/phoenix-interview-prep/REJECTION_REPORT.md)
- **Implementation Plan**: [`docs/upcoming-features/IMPLEMENTATION_PLAN_CAREER_FOUNDATION.md`](file:///d:/users/Shashank%20J/Desktop/my%20stufs/phoenix-interview-prep/docs/upcoming-features/IMPLEMENTATION_PLAN_CAREER_FOUNDATION.md)
