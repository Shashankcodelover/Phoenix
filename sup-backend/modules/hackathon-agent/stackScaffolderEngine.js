/**
 * Phoenix OS: Pillar 2 • Feature 22
 * Rapid Architecture & Full-Stack Tech Stack Scaffolder Engine
 *
 * Generates turnkey production microservice architectures, Docker Compose files,
 * relational database schemas with vector indexes, and zero-configuration
 * quickstart bootstrap scripts for 36-hour hackathon engineering sprints.
 */

const ARCHETYPE_PRESETS = [
  {
    id: 'agentic_ai_rag',
    name: 'Agentic AI & Multimodal RAG Powerhouse',
    description: 'Next.js 14 frontend with Python FastAPI agent backend, Supabase pgvector embedding store, and Celery background workers.',
    frontend: 'Next.js 14 (App Router, TailwindCSS, Lucide, Framer Motion)',
    backend: 'FastAPI (Python 3.11, Uvicorn, LangChain, Pydantic v2)',
    database: 'PostgreSQL 16 + pgvector (768-dim embeddings)',
    cache: 'Redis 7.2 (Queue & Conversation State)',
    containerOrchestration: 'Docker Compose (4 Services)'
  },
  {
    id: 'realtime_event_mesh',
    name: 'High-Throughput Realtime Event Gateway',
    description: 'React Vite client with Node.js Fastify backend, WebSocket real-time broadcast, Redis Streams pub/sub, and PostgreSQL.',
    frontend: 'React 18 + Vite (TailwindCSS, Zustand, Socket.io-client)',
    backend: 'Node.js 20 + Fastify (TypeScript, Prisma ORM, WebSockets)',
    database: 'PostgreSQL 16 (Relational with JSONB payloads)',
    cache: 'Redis 7.2 (Streams & Pub/Sub broker)',
    containerOrchestration: 'Docker Compose (3 Services)'
  },
  {
    id: 'decentralized_zk_fintech',
    name: 'Web3 & Zero-Knowledge Privacy Vault',
    description: 'Next.js 14 dApp with Foundry Solidity smart contracts, Ethers.js, Polygon ID ZK verifier, and IPFS storage.',
    frontend: 'Next.js 14 (RainbowKit, Wagmi, Ethers.js v6)',
    backend: 'Node.js Express (Relayer & Webhook Verifier)',
    database: 'PostgreSQL + Prisma + IPFS / Pinata decentralized storage',
    cache: 'Redis 7.2 (Nonce tracker & mempool listener)',
    containerOrchestration: 'Docker Compose (3 Services)'
  }
];

class StackScaffolderEngine {
  /**
   * Return archetype presets
   */
  getPresets() {
    return ARCHETYPE_PRESETS;
  }

  /**
   * Generate complete boilerplate files and architecture specifications
   */
  generateScaffold(payload = {}) {
    const {
      archetypeId = 'agentic_ai_rag',
      projectName = 'phoenix-apex-mvp',
      enableDocker = true,
      enableAuth = true,
      enableVectorDB = true
    } = payload;

    const archetype = ARCHETYPE_PRESETS.find(a => a.id === archetypeId) || ARCHETYPE_PRESETS[0];

    // 1. Docker Compose
    const dockerCompose = `version: '3.8'

services:
  app-frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
      - NODE_ENV=development
    depends_on:
      - app-backend
    restart: unless-stopped

  app-backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/${projectName.replace(/[^a-zA-Z0-9_]/g, '_')}
      - REDIS_URL=redis://redis:6379/0
      - GEMINI_API_KEY=\${GEMINI_API_KEY}
    depends_on:
      - db
      - redis
    restart: unless-stopped

  db:
    image: pgvector/pgvector:pg16
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=${projectName.replace(/[^a-zA-Z0-9_]/g, '_')}
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./init-schema.sql:/docker-entrypoint-initdb.d/init-schema.sql
    restart: unless-stopped

  redis:
    image: redis:7.2-alpine
    ports:
      - "6379:6379"
    restart: unless-stopped

volumes:
  pgdata:
`;

    // 2. Database Schema SQL
    const schemaSql = `-- Phoenix OS Rapid Scaffolder: ${archetype.name}
-- Target Database: PostgreSQL 16 + pgvector

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Users & Auth Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(128) NOT NULL,
    role VARCHAR(32) DEFAULT 'builder',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Core Domain Records
CREATE TABLE IF NOT EXISTS project_artifacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    artifact_type VARCHAR(64) NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    embedding vector(768),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Fast HNSW Cosine Index for Sub-Millisecond Semantic Search
CREATE INDEX IF NOT EXISTS idx_artifacts_embedding 
ON project_artifacts USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Real-Time Audit Log
CREATE TABLE IF NOT EXISTS audit_events (
    id BIGSERIAL PRIMARY KEY,
    event_type VARCHAR(64) NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`;

    // 3. Environment Example
    const envExample = `# ===============================================
# ${archetype.name} — Hackathon Quickstart Env
# Project: ${projectName}
# ===============================================

# Port Configuration
PORT=8000
FRONTEND_PORT=3000

# Database & Cache
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/${projectName.replace(/[^a-zA-Z0-9_]/g, '_')}
REDIS_URL=redis://localhost:6379/0

# Sponsor API Keys
GEMINI_API_KEY=your_gemini_api_key_here
STRIPE_SECRET_KEY=sk_test_mock_secret
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Security & JWT
JWT_SECRET=super_secure_hackathon_demo_jwt_secret_xyz789
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
`;

    // 4. Quickstart Bootstrap Script
    const quickstartSh = `#!/usr/bin/env bash
# ===============================================
# ⚡ Phoenix 1-Click Hackathon Dev Launcher
# Project: ${projectName}
# Archetype: ${archetype.name}
# ===============================================

set -e

echo "🔥 [1/4] Bootstrapping Docker containers (Postgres + Redis)..."
docker-compose up -d db redis

echo "⏳ Waiting for PostgreSQL to become ready..."
until docker exec $(docker-compose ps -q db) pg_isready -U postgres; do
  sleep 1
done

echo "📦 [2/4] Installing backend & frontend dependencies..."
if [ -d "backend" ]; then
  cd backend && npm install || pip install -r requirements.txt && cd ..
fi
if [ -d "frontend" ]; then
  cd frontend && npm install && cd ..
fi

echo "🗄️ [3/4] Running initial SQL schema migrations..."
docker exec -i $(docker-compose ps -q db) psql -U postgres -d ${projectName.replace(/[^a-zA-Z0-9_]/g, '_')} < init-schema.sql

echo "🚀 [4/4] Starting microservices in development mode..."
docker-compose up app-frontend app-backend

echo "✅ All services running! Open http://localhost:3000 to view your live demo."
`;

    // 5. Architecture Topology Spec
    const architectureSpec = `# 🏛️ Architecture Specification: ${projectName}
## Archetype: ${archetype.name}

### 📐 Subsystem Topology
\`\`\`
[ Client Browser (Next.js 14) ]
       │ (Sub-50ms SSR & WebSocket Bridge)
       ▼
[ Envoy / Fastify API Gateway (Port 8000) ]
       ├───► [ Redis 7.2 (Pub/Sub & Vector Cache) ]
       ├───► [ Agent Worker Pool (Gemini 1.5 Function Calling) ]
       └───► [ PostgreSQL 16 + HNSW pgvector (Port 5432) ]
\`\`\`

### ⏱️ Latency Budget (< 200ms P99)
- Gateway Authentication Check: < 5ms
- Cache Lookup (Redis): < 3ms
- Vector Cosine Similarity Query: < 15ms
- LLM Token Stream (First Chunk): < 140ms
- Total Live Demo Latency: ~ 163ms P99 SLA
`;

    return {
      success: true,
      data: {
        archetype,
        projectName,
        files: [
          { name: 'docker-compose.yml', language: 'yaml', content: dockerCompose },
          { name: 'init-schema.sql', language: 'sql', content: schemaSql },
          { name: '.env.example', language: 'shell', content: envExample },
          { name: 'quickstart.sh', language: 'bash', content: quickstartSh },
          { name: 'architecture-spec.md', language: 'markdown', content: architectureSpec }
        ],
        summary: {
          totalFilesGenerated: 5,
          dockerServices: 4,
          schemaTables: 3,
          vectorDimension: '768 (pgvector HNSW)'
        }
      }
    };
  }
}

const stackScaffolderEngine = new StackScaffolderEngine();

module.exports = {
  StackScaffolderEngine,
  stackScaffolderEngine,
  ARCHETYPE_PRESETS
};