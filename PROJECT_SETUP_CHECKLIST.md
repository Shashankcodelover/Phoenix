# 📋 PROJECT_SETUP_CHECKLIST.md — Phoenix Local Setup & Verification Checklist

This is a literal, step-by-step checklist to get **Project Phoenix** running locally from zero.

---

## 🛠️ Step 1: System Prerequisites
- [x] **Node.js**: `v18.0.0` or higher installed (`node -v`).
- [x] **npm**: `v9.0.0` or higher installed (`npm -v`).
- [x] **Git**: `v2.30.0` or higher installed (`git --version`).
- [ ] *(Optional)* **Docker & Docker Compose**: For containerized deployment (`docker --version`).

---

## ⚙️ Step 2: Environment Configuration
1. Create local `.env` file from standard template:
   ```bash
   cp .env.example .env
   ```
2. Verify required environment variables inside `.env`:
   - `PORT`: `5000` (Default API server port)
   - `MONGO_URI`: `mongodb://localhost:27017/phoenix` or MongoDB Atlas URI
   - `JWT_SECRET`: Standard random secret string for JWT authentication
   - *(Optional)* `GEMINI_API_KEY`, `GROQ_API_KEY`, `OPENAI_API_KEY`: API keys for live online AI providers (system cascades cleanly to local heuristics if omitted).

---

## 🧪 Step 3: Run Automated Test Verification
Run the root test runner to execute all 60 native unit & integration tests:
```bash
npm test
```
**Expected Outcome**:
```text
ℹ tests 60
ℹ suites 17
ℹ pass 60
ℹ fail 0
```

---

## 🚀 Step 4: Launch Backend Server
```bash
npm start
```
**Verification Check**:
Open browser or run curl command to confirm system health:
```bash
curl http://localhost:5000/health
```
**Expected Response**:
```json
{
  "status": "V5 Production",
  "uptime": 1.234
}
```

---

## 🌐 Step 5: Launch Frontend Application
Open `sup-frontend/dashboard/dashboard.html` or `sup-frontend/index.html` in your web browser (or serve using Live Server / python HTTP server):
```bash
# Optional simple HTTP server
npx serve sup-frontend -p 3000
```
Visit `http://localhost:3000` to interact with the full UI dashboard.
