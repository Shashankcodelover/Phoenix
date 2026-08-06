# 🗺️ IMPLEMENTATION PLAN — Phoenix Horizon (Universal Career Foundation Ecosystem)

> **Target Release**: v11.0.0  
> **Status**: APPROVED FOR SPRINT EXECUTION  
> **Spec Reference**: [`UNIVERSAL_CAREER_FOUNDATION_ECOSYSTEM.md`](file:///d:/users/Shashank%20J/Desktop/my%20stufs/phoenix-interview-prep/docs/upcoming-features/UNIVERSAL_CAREER_FOUNDATION_ECOSYSTEM.md)  
> **Rejection Fix Reference**: [`REJECTION_REPORT.md` (Finding #7)](file:///d:/users/Shashank%20J/Desktop/my%20stufs/phoenix-interview-prep/REJECTION_REPORT.md)

---

## 🎯 1. Overview & Problem Statement

Project Phoenix currently excels at senior interview placement preparation. However, it suffers from a major gap identified in the **Rejection Audit (Finding #7)**: the claimed "Universal Career Foundation Engine" for early students (10th grade, Pre-University, Diploma, Commerce, Bio/Medical, Arts) exists strictly as a vision document without executable code.

This implementation plan outlines the concrete, step-by-step engineering tasks to build **Phoenix Horizon (v11.0.0)** — converting the specification into production backend modules, schemas, APIs, test suites, and frontend UI portals.

---

## 🏗️ 2. Architectural Design & Component Breakdown

```text
[ User / Student ]
       │
       ▼
[ Frictionless Onboarding UI (sup-frontend/horizon/onboarding.html) ]
       │
       ├── 1. 3-Step Diagnostic Assessment Submission
       ▼
[ Horizon Express Gateway (sup-backend/modules/horizon/horizonRoutes.js) ]
       │
       ├── 2. Input Security & Schema Validation (inputValidator.js)
       ├── 3. JWT Auth Guard (authMiddleware.js)
       │
       ├── 4. Diagnostic & Sector Match Engine (diagnosticEngine.js)
       ├── 5. Multi-Sector Roadmap Generator (roadmapEngine.js)
       ├── 6. Exam Radar & PYQ Engine (examRadarEngine.js & pyqDatabase.js)
       └── 7. Senior Mentorship Bridge (mentorshipEngine.js)
       │
       ▼
[ MongoDB Horizon Schema (sup-backend/models/horizonModel.js) ]
```

---

## 🛠️ 3. Step-by-Step Proposed Changes

### Phase 1: Database Schemas & Data Models

#### [NEW] [`sup-backend/models/horizonModel.js`](file:///d:/users/Shashank%20J/Desktop/my%20stufs/phoenix-interview-prep/sup-backend/models/horizonModel.js)
Create Mongoose schemas for Horizon student profiles and exam progress tracking:
- `userStage`: Enum (`10th`, `1st_pu`, `2nd_pu`, `diploma_1`, `diploma_2`, `diploma_3`, `eng_1`, `eng_2`, `eng_3`, `eng_4`, `commerce`, `bio_medical`, `arts_design`).
- `selectedWorld`: Enum (`tech_world`, `commerce_world`, `bio_world`, `electronics_world`, `arts_world`).
- `activeRoadmapId`: String.
- `completedChecklistItems`: Array of task IDs.
- `pyqBookmarks`: Array of PYQ IDs.

---

### Phase 2: Core Feature Engines (Backend Modules)

#### [NEW] [`sup-backend/modules/horizon/diagnosticEngine.js`](file:///d:/users/Shashank%20J/Desktop/my%20stufs/phoenix-interview-prep/sup-backend/modules/horizon/diagnosticEngine.js)
- Implement `evaluateStudentDiagnostic({ academicStage, interests, primaryGoal })`:
  - Returns recommended `matchedWorld`, `startingPhase`, `recommendedDomains`, and initial 30-day roadmap.

#### [NEW] [`sup-backend/modules/horizon/examRadarEngine.js`](file:///d:/users/Shashank%20J/Desktop/my%20stufs/phoenix-interview-prep/sup-backend/modules/horizon/examRadarEngine.js)
- Implement `getExamNotifications({ sector, examKey })`:
  - Returns active exam alerts for **KCET**, **DCET**, **NEET-UG**, **CA Foundation**, **JEE Main**, **COMEDK**.
  - Provides registration start/end dates, syllabus changes, and official portal links.

#### [NEW] [`sup-backend/modules/horizon/pyqDatabase.js`](file:///d:/users/Shashank%20J/Desktop/my%20stufs/phoenix-interview-prep/sup-backend/modules/horizon/pyqDatabase.js)
- Implement 500+ PYQ question repository categorized by `exam`, `year`, `subject`, `topic`, `difficulty`.
- Implement `runTimedMockExam({ examKey, subject, timeLimitMinutes })`.

#### [NEW] [`sup-backend/modules/horizon/mentorshipEngine.js`](file:///d:/users/Shashank%20J/Desktop/my%20stufs/phoenix-interview-prep/sup-backend/modules/horizon/mentorshipEngine.js)
- Implement `getVerifiedSeniorProfiles({ targetRoute })`:
  - Returns verified senior alumni profiles, "Top 3 Mistakes to Avoid", and route wisdom cards.

---

### Phase 3: Validation Schemas & Controller API Wiring

#### [MODIFY] [`sup-backend/middleware/inputValidator.js`](file:///d:/users/Shashank%20J/Desktop/my%20stufs/phoenix-interview-prep/sup-backend/middleware/inputValidator.js)
Register new schemas:
- `horizonDiagnostic`: `{ academicStage: required, interests: array, primaryGoal: string }`
- `horizonExamQuery`: `{ sector: string, examKey: string }`
- `horizonPyqSubmit`: `{ examKey: string, answers: array }`

#### [NEW] [`sup-backend/modules/horizon/horizonController.js`](file:///d:/users/Shashank%20J/Desktop/my%20stufs/phoenix-interview-prep/sup-backend/modules/horizon/horizonController.js)
Implement endpoints:
- `POST /api/v1/horizon/diagnostic`
- `GET /api/v1/horizon/roadmaps/:domainKey`
- `GET /api/v1/horizon/exams`
- `POST /api/v1/horizon/pyq/mock-exam`
- `GET /api/v1/horizon/mentors`

#### [NEW] [`sup-backend/modules/horizon/horizonRoutes.js`](file:///d:/users/Shashank%20J/Desktop/my%20stufs/phoenix-interview-prep/sup-backend/modules/horizon/horizonRoutes.js)
Mount routes cleanly with `validate()` and `protect` auth middleware.

#### [MODIFY] [`sup-backend/server.js`](file:///d:/users/Shashank%20J/Desktop/my%20stufs/phoenix-interview-prep/sup-backend/server.js)
Mount `app.use('/api/v1/horizon', horizonRoutes);` and update server health payload to `v11.0.0`.

---

### Phase 4: Frontend Portals

#### [NEW] [`sup-frontend/horizon/onboarding.html`](file:///d:/users/Shashank%20J/Desktop/my%20stufs/phoenix-interview-prep/sup-frontend/horizon/onboarding.html)
- 3-step diagnostic assessment UI with smooth progress animations.

#### [NEW] [`sup-frontend/horizon/world-dashboard.html`](file:///d:/users/Shashank%20J/Desktop/my%20stufs/phoenix-interview-prep/sup-frontend/horizon/world-dashboard.html)
- Multi-world dashboard showing phased roadmaps, daily/monthly checklists, exam notification radar, and senior mentorship bridge.

---

## 🧪 4. Verification Plan

### Automated Test Suite
- [NEW] Create [`sup-backend/test/v11_horizon_features.test.js`](file:///d:/users/Shashank%20J/Desktop/my%20stufs/phoenix-interview-prep/sup-backend/test/v11_horizon_features.test.js) covering:
  - `evaluateStudentDiagnostic` sector matching.
  - `getExamNotifications` KCET/DCET/NEET/CA date payload structure.
  - `pyqDatabase` scoring logic and explanation retrieval.
  - HTTP endpoint integration tests via `supertest`.
- Run `npm test` and verify **100% pass rate across all suites**.

### Manual Verification
1. Open `http://localhost:5000/api/v1/health` and confirm `horizonStatus: 'ACTIVE'`.
2. Complete 3-step diagnostic flow on `sup-frontend/horizon/onboarding.html` and verify smooth instant redirection to `world-dashboard.html`.
