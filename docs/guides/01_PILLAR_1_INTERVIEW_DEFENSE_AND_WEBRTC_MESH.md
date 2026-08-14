# 📹 PILLAR 1: MULTIMODAL AI INTERVIEW DEFENSE & LIVE WEBRTC PEER MESH
### *Step-by-Step Practical Code Navigation & Architectural Defense Manual*

---

## 🧭 1. PILLAR OVERVIEW & SYSTEM FLOW

Pillar 1 provides **live, high-pressure technical mock interviews** connecting candidates with peer interviewers, augmented by an active **Silent AI Sentinel Co-Pilot** and a **Distributed CRDT Collaborative Code & System Architecture Canvas**.

```
  [ Candidate Speech / WebRTC Audio ] ──> [ speechEvaluatorEngine.js ] ──> [ WPM / Prosody Analysis ]
                                                        │
                                                        ▼
  [ Technical Keyword Extraction ]    ──> [ aiAdaptiveKnowledgeProber.js ] ──> [ Graph Deep-Dive Probe ]
                                                        │
                                                        ▼
  [ Silent Sentinel Delivery ]        ──> [ peerInterviewMeshGateway.js ]  ──> [ Interviewer Private UI ]
```

---

## 🚶 2. STEP-BY-STEP PRACTICAL CODE NAVIGATION (START HERE)

### Step 1: Open the Entry Point
* **File to Open**: [`sup-backend/server.js`](file:///d:/users/Shashank%20J/Desktop/my%20stufs/phoenix-interview-prep/sup-backend/server.js#L20-L65)
* **What to Show the Interviewer**:
  > *"Here in `server.js` (lines 20-65), we initialize the HTTP server and attach the Socket.IO WebRTC signaling engine. We define our low-latency room connection handlers here."*

---

### Step 2: Open the Router & API Dispatcher
* **File to Open**: [`sup-backend/modules/interview-prep/prepRoutes.js`](file:///d:/users/Shashank%20J/Desktop/my%20stufs/phoenix-interview-prep/sup-backend/modules/interview-prep/prepRoutes.js#L1-L120)
* **What to Show the Interviewer**:
  > *"Next, open `prepRoutes.js`. Lines 45-80 handle `/api/v2/ir26/mesh/create-room`, `/api/v2/ir26/mesh/ai-sentinel-probe`, and `/api/v2/ir26/crdt/apply-delta`. Every real-time interview action is dispatched through these authenticated endpoints."*

---

### Step 3: Open the WebRTC Signaling & AI Sentinel Gateway (Hero File #1)
* **File to Open**: [`sup-backend/modules/interview-prep/peerInterviewMeshGateway.js`](file:///d:/users/Shashank%20J/Desktop/my%20stufs/phoenix-interview-prep/sup-backend/modules/interview-prep/peerInterviewMeshGateway.js#L1-L90)
* **What to Show the Interviewer**:
  > *"This is `peerInterviewMeshGateway.js`. Notice lines 25-50: It creates room credentials with STUN/TURN ICE configurations for peer-to-peer video streaming. Lines 60-85 contain `generateAISentinelProbe()`, which asynchronously analyzes candidate transcripts and generates targeted follow-up probes without blocking the live audio stream."*

---

### Step 4: Open the Distributed CRDT Whiteboard Engine (Hero File #2)
* **File to Open**: [`sup-backend/modules/interview-prep/crdtCollaborativeCanvas.js`](file:///d:/users/Shashank%20J/Desktop/my%20stufs/phoenix-interview-prep/sup-backend/modules/interview-prep/crdtCollaborativeCanvas.js#L1-L75)
* **What to Show the Interviewer**:
  > *"This is `crdtCollaborativeCanvas.js`. Look at lines 15-45: We use **Lamport Vector Clocks** to ensure candidate and interviewer edits merge deterministically without locks. Even if both users draw architecture blocks simultaneously, state deltas merge via commutative join-semilattice operations with zero race conditions."*

---

### Step 5: Open the Knowledge Graph Concept Prober
* **File to Open**: [`sup-backend/modules/interview-prep/aiAdaptiveKnowledgeProber.js`](file:///d:/users/Shashank%20J/Desktop/my%20stufs/phoenix-interview-prep/sup-backend/modules/interview-prep/aiAdaptiveKnowledgeProber.js#L1-L70)
* **What to Show the Interviewer**:
  > *"Here in `aiAdaptiveKnowledgeProber.js` (lines 20-55), we traverse a multi-hop Computer Science knowledge graph. If the candidate mentions 'Redis Caching', the graph traverses to Cache Stampede and Thundering Herd mitigation, generating L5/L6 Google-level follow-up questions."*

---

### Step 6: Open the Speech Prosody & WPM Analyzer
* **File to Open**: [`sup-backend/modules/interview-prep/speechEvaluatorEngine.js`](file:///d:/users/Shashank%20J/Desktop/my%20stufs/phoenix-interview-prep/sup-backend/modules/interview-prep/speechEvaluatorEngine.js#L1-L85)
* **What to Show the Interviewer**:
  > *"In `speechEvaluatorEngine.js`, we evaluate vocal pacing (words-per-minute), pitch variance, and filler word frequency (`'um'`, `'like'`, `'you know'`), giving candidates objective feedback on their executive presence."*

---

### Step 7: Open the Automated Unit Test Suite
* **File to Open**: [`sup-backend/test/v26_peerMesh.test.js`](file:///d:/users/Shashank%20J/Desktop/my%20stufs/phoenix-interview-prep/sup-backend/test/v26_peerMesh.test.js) & [`sup-backend/test/v26_crdtCanvas.test.js`](file:///d:/users/Shashank%20J/Desktop/my%20stufs/phoenix-interview-prep/sup-backend/test/v26_crdtCanvas.test.js)
* **What to Show the Interviewer**:
  > *"To prove reliability, we run our test suite using `node --test`. All WebRTC signaling, vector clock merges, and AI prober responses pass with 100% pass rates."*

---

## 🎯 TOP 5 INTERVIEW DEFENSE QUESTIONS FOR PILLAR 1

#### Q1: "Why use WebRTC P2P instead of routing audio through an SFU Media Server?"
> **Answer**: *"For 1-on-1 technical mock interviews, a direct WebRTC peer mesh provides sub-50ms glass-to-glass latency with zero server bandwidth costs. The server only handles lightweight SDP signaling, allowing the platform to scale to thousands of simultaneous rooms effortlessly."*

#### Q2: "How does the AI Sentinel co-pilot generate hints without interrupting candidate audio?"
> **Answer**: *"Audio transcription and knowledge graph querying run asynchronously in a background worker. The generated follow-up prompts are pushed silently via WebSocket to the interviewer's private UI pane, preserving a natural conversational flow."*

#### Q3: "How do you prevent split-brain overwrites in your collaborative code editor?"
> **Answer**: *"We use state-based Conflict-Free Replicated Data Types (CRDTs) with Lamport vector clocks in `crdtCollaborativeCanvas.js`. Edges and operations merge deterministically using a commutative join-semilattice, guaranteeing identical state across both screens without locks."*
