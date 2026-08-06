# 🔥 Phoenix Interview Prep — Setup & Standard File Inventory Guide

Welcome to **Project Phoenix** — the AI-Powered Interview Preparation, ATS Resume Analyzer, and Hackathon Intelligence Platform! This document provides a complete setup walkthrough, environment variable reference, and a comprehensive inventory of all core files and their specific roles.

---

## 📋 Quick Setup Walkthrough

### Method 1: Using Docker (Recommended — Instant Setup)

The easiest way to run the entire Phoenix stack (Express API + Frontend + MongoDB 6.0) is using Docker Compose:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Shashankcodelover/phoenix-interview-prep.git
   cd phoenix-interview-prep
   ```

2. **Configure Environment Variables**:
   ```bash
   cp .env.example .env
   ```

3. **Build & Start Containers**:
   ```bash
   docker-compose up -d --build
   ```

4. **Access the Application**:
   - ⚙️ **Backend API Server**: `http://localhost:5000`
   - 🍃 **MongoDB Database**: `localhost:27017`

---

### Method 2: Manual Local Development Setup

If you prefer running Node.js directly on your local machine:

1. **Install Dependencies**:
   ```bash
   cd sup-backend
   npm install
   ```

2. **Seed Sample Interview Questions & Hackathons**:
   ```bash
   npm run seed
   ```

3. **Start Backend API Server**:
   ```bash
   npm start
   ```

4. **Run 55-Suite Native Unit & Integration Test Suite**:
   ```bash
   npm test
   ```

5. **Open Frontend**:
   Open `sup-frontend/index.html` in your web browser or serve via Live Server.

---

## 🔑 Environment Variables Configuration (`.env`)

Copy `.env.example` to `.env` before running the system. Here is a breakdown of every variable and its role:

| Variable Name | Default Value | Purpose & Role |
| :--- | :--- | :--- |
| `PORT` | `5000` | Specifies the port number the Phoenix Express API server listens on. |
| `NODE_ENV` | `development` | Defines execution mode (`development` or `production`). |
| `MONGO_URI` | `mongodb://localhost:27017/phoenix-prep` | MongoDB database connection URI for users, resumes, and question banks. |
| `JWT_SECRET` | `phoenix_super_secret_jwt_key_2026` | Secret key used for signing and verifying JWT authentication tokens. |
| `GEMINI_API_KEY` | `""` | Google Gemini AI API key for mock interview generation and resume analysis. |
| `GROQ_API_KEY` | `""` | Groq AI API key for fast Llama-3 model inference fallback. |
| `OPENAI_API_KEY` | `""` | Optional OpenAI API key for GPT-4 model fallback routing. |
| `OPENROUTER_API_KEY` | `""` | Optional OpenRouter API key for multi-provider AI model fallback. |

---

## 📁 Standard Repository File Inventory & Roles

This repository maintains a clean, modular structure. Below is the list of key project files and the specific role each file plays:

| File / Directory | Role & Purpose in Architecture |
| :--- | :--- |
| **`docker-compose.yml`** | Multi-container Docker configuration linking Express API backend with MongoDB 6.0 service. |
| **`sup-backend/Dockerfile`** | Docker build recipe for compiling Node.js Express backend into a container image. |
| **`sup-backend/server.js`** | Express application entry point defining REST API endpoints, security headers, and AI router. |
| **`sup-backend/seed.js`** | Database seeding script loading 200+ previous year interview questions & hackathon data into MongoDB. |
| **`sup-backend/test/`** | Contains native automated test suite executing 55 unit and integration tests across 15 suites. |
| **`sup-frontend/index.html`** | Single Page Application entry point for Phoenix interview prep dashboard. |
| **`sup-frontend/phoenix.css`** | Enterprise design system stylesheet defining light/dark themes, glassmorphism, and responsive layouts. |
| **`sup-frontend/phoenix-core.js`** | Client-side application controller managing UI state, API fetches, and interactive modules. |
| **`CEO_EVALUATION_CHECKLIST.md`** | Comprehensive architectural evaluation checklist tracking code quality, security, and feature readiness. |
| **`JIRA_TRACKER.md`** | Sprint task tracker documenting completed modules, bug fixes, and feature roadmap. |
| **`GROWTH_STRATEGY.md`** | Strategic roadmap detailing user acquisition, enterprise pitch deck templates, and monetization strategy. |
| **`FEATURE_EXPLORATION_GUIDE.md`** | Feature walkthrough detailing AI Judge simulator, ATS resume diff engine, and skill radar matrix. |
| **`EXPLAINER.md`** | High-level system architecture document detailing multi-provider AI fallback engine and LRU caching. |
| **`CHANGELOG_DAILY.md`** | Daily development log recording technical findings, refactoring progress, and quality gate results. |
| **`README.md`** | Primary project overview, feature highlights, tech stack reference, and quick-start links. |
| **`SETUP.md`** | Complete setup guide, `.env.example` environment variable reference, and file inventory breakdown. |
