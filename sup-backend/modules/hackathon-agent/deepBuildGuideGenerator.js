/**
 * Phoenix Hackathon OS: Deep Build Guide Generator
 * 
 * Generates a comprehensive, step-by-step execution guide for building the
 * locked hackathon project idea. All content is STRICTLY derived from the
 * exact selected idea — zero assumptions or generic filler.
 * 
 * Covers:
 *   - Complete file/folder structure with purpose of each file
 *   - Step-by-step coding guide with code snippets
 *   - Database schema design (if applicable)
 *   - API endpoint specifications
 *   - Environment setup instructions
 *   - Testing strategy
 *   - Deployment instructions
 */

const { callAIForFeature, parseAIJson } = require('../../config/aiProvider');

/**
 * Generate a Deep Build Guide from the locked idea + one-pager data.
 * @route POST /api/v1/agent/inception/deep-build-guide
 */
const generateDeepBuildGuide = async (req, res) => {
  try {
    const {
      ideaTitle = '',
      ideaDescription = '',
      realWorldProblem = '',
      technicalMoat = '',
      targetUsers = '',
      domain = 'AI & Developer Tools',
      hackathonDuration = '24 hours',
      teamSize = 1,
      techStack = [],
      deepBlueprint = {},
      onePagerData = {}
    } = req.body;

    if (!ideaTitle) {
      return res.status(400).json({ message: 'ideaTitle is required to generate a Deep Build Guide.' });
    }

    const stackList = Array.isArray(techStack) ? techStack.join(', ') : techStack;
    const blueprintArch = deepBlueprint?.systemArchitecture || '';
    const onePagerScope = onePagerData?.scopeAndNoGos?.inScope?.join(', ') || '';
    const onePagerNoGos = onePagerData?.scopeAndNoGos?.noGos?.join(', ') || '';

    const systemPrompt = `You are a Principal Software Architect and hackathon build mentor.
Your task is to generate a DEEP, ACTIONABLE, step-by-step build guide for a specific hackathon project.

CRITICAL RULES:
1. EVERY instruction must be SPECIFIC to the exact project idea — NO generic boilerplate.
2. Include actual code snippets, actual file paths, actual commands.
3. The guide must be so detailed that a competent developer can follow it blindly and produce a working prototype.
4. Respect the scope boundaries defined in the One-Pager — do NOT add features that are marked as "No-Gos".
5. Focus on the EXACT technical moat and architecture described — do not substitute alternative approaches.
6. Return ONLY a valid JSON object with the exact specified structure.`;

    const userPrompt = `Generate a Deep Build Guide for this EXACT hackathon project:

PROJECT CONTEXT:
- Title: "${ideaTitle}"
- Problem: "${realWorldProblem || ideaDescription}"
- Technical Moat: "${technicalMoat}"
- Target Users: "${targetUsers}"
- Architecture: "${blueprintArch}"
- Tech Stack: ${stackList || 'Next.js, Node.js, relevant libraries'}
- Duration: ${hackathonDuration}
- Team Size: ${teamSize}
- In-Scope: ${onePagerScope || 'All core features'}
- No-Gos: ${onePagerNoGos || 'No scope creep'}

Return a JSON object with this EXACT structure:
{
  "projectTitle": "${ideaTitle}",
  "environmentSetup": {
    "prerequisites": ["Node.js 20+", "npm 10+", "Any other specific tools"],
    "installCommands": [
      { "command": "npx create-next-app@latest project-name --typescript --tailwind --eslint --app", "purpose": "Scaffold the frontend" }
    ],
    "envVariables": [
      { "key": "NEXT_PUBLIC_API_URL", "value": "http://localhost:5000", "purpose": "Backend API endpoint" }
    ]
  },
  "folderStructure": [
    { "path": "src/modules/core/engine.ts", "purpose": "Core processing engine implementing the technical moat", "priority": "P0" },
    { "path": "src/components/Dashboard.tsx", "purpose": "Main user-facing dashboard", "priority": "P0" }
  ],
  "buildPhases": [
    {
      "phaseNumber": 1,
      "title": "Phase title",
      "duration": "Hours 0-4",
      "objective": "What this phase accomplishes",
      "tasks": [
        {
          "taskId": "T1.1",
          "title": "Task title",
          "file": "src/path/to/file.ts",
          "description": "Detailed description of what to implement",
          "codeSnippet": "// Key code snippet showing the approach\\nfunction coreEngine() {\\n  // Implementation outline\\n}",
          "testCriteria": "How to verify this task is complete"
        }
      ]
    }
  ],
  "apiSpecification": [
    {
      "method": "POST",
      "endpoint": "/api/v1/process",
      "purpose": "Process incoming data through the core engine",
      "requestBody": { "field": "type - description" },
      "responseBody": { "field": "type - description" }
    }
  ],
  "dataSchema": {
    "description": "Database/storage schema if applicable",
    "models": [
      { "name": "ModelName", "fields": ["id: string (primary key)", "data: object", "createdAt: timestamp"], "storage": "localStorage / MongoDB / PostgreSQL" }
    ]
  },
  "testingStrategy": {
    "unitTests": ["Test description 1", "Test description 2"],
    "integrationTests": ["Integration test description"],
    "demoValidation": ["Manual validation step for the live demo"]
  },
  "deploymentGuide": {
    "platform": "Vercel / Railway / Docker",
    "steps": ["Step 1: ...", "Step 2: ..."],
    "demoUrl": "Expected deployment URL format"
  },
  "criticalWarnings": [
    "Warning about a common pitfall specific to this project"
  ]
}`;

    try {
      const aiResponse = await callAIForFeature('creative', userPrompt, systemPrompt, true);
      const parsed = parseAIJson(aiResponse?.text || aiResponse);

      if (parsed && parsed.projectTitle && parsed.buildPhases) {
        return res.json({
          success: true,
          isLiveAiGenerated: true,
          buildGuide: parsed,
          generatedAt: new Date().toISOString()
        });
      }
    } catch (aiErr) {
      console.warn('[DeepBuildGuide] AI generation failed, using deterministic fallback:', aiErr.message);
    }

    // Deterministic fallback
    const fallback = generateFallbackBuildGuide({
      ideaTitle, ideaDescription, realWorldProblem, technicalMoat,
      targetUsers, domain, hackathonDuration, teamSize, stackList, deepBlueprint
    });

    return res.json({
      success: true,
      isLiveAiGenerated: false,
      buildGuide: fallback,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('[DeepBuildGuide] Fatal error:', error);
    res.status(500).json({ message: error.message });
  }
};

function generateFallbackBuildGuide({ ideaTitle, ideaDescription, realWorldProblem, technicalMoat, targetUsers, domain, hackathonDuration, teamSize, stackList, deepBlueprint }) {
  const fileTree = deepBlueprint?.recommendedFileTree || [];
  const roadmap = deepBlueprint?.buildRoadmap24h || [];
  const moatShort = technicalMoat ? technicalMoat.split('.')[0] : 'core engine';

  return {
    projectTitle: ideaTitle,
    environmentSetup: {
      prerequisites: ['Node.js 20+ (LTS)', 'npm 10+ or pnpm 9+', 'Git 2.40+', 'VS Code with ESLint & Prettier extensions'],
      installCommands: [
        { command: `mkdir ${ideaTitle.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()} && cd $_`, purpose: 'Create project directory' },
        { command: 'npx -y create-next-app@latest ./ --typescript --eslint --app --src-dir', purpose: 'Scaffold Next.js 14+ frontend with App Router' },
        { command: 'npm install zustand @tanstack/react-query lucide-react', purpose: 'Install state management, data fetching, and icon library' },
        { command: 'mkdir -p src/modules/core src/modules/data src/lib src/components/ui', purpose: 'Create module-based folder structure' }
      ],
      envVariables: [
        { key: 'NEXT_PUBLIC_APP_NAME', value: ideaTitle, purpose: 'Application display name' },
        { key: 'NEXT_PUBLIC_API_URL', value: 'http://localhost:5000/api/v1', purpose: 'Backend API base URL' },
        { key: 'DATABASE_URL', value: 'file:./dev.db', purpose: 'Local SQLite database for rapid prototyping' }
      ]
    },
    folderStructure: [
      ...(fileTree.length > 0
        ? fileTree.map((f, i) => ({
            path: f,
            purpose: `Module ${i + 1}: ${f.includes('engine') ? 'Core processing engine' : f.includes('crdt') ? 'CRDT state management' : f.includes('Canvas') || f.includes('component') ? 'UI visualization component' : f.includes('lib') ? 'Utility library' : 'Supporting module'}`,
            priority: i < 2 ? 'P0' : 'P1'
          }))
        : [
            { path: 'src/modules/core/engine.ts', purpose: `Core ${moatShort} engine — the primary technical moat`, priority: 'P0' },
            { path: 'src/modules/core/processor.ts', purpose: 'Data processing pipeline and transformation layer', priority: 'P0' },
            { path: 'src/modules/data/store.ts', purpose: 'State management and data persistence layer', priority: 'P0' },
            { path: 'src/components/Dashboard.tsx', purpose: `Main ${targetUsers || 'user'}-facing dashboard with live metrics`, priority: 'P0' },
            { path: 'src/components/ui/MetricCard.tsx', purpose: 'Reusable metric display card component', priority: 'P1' },
            { path: 'src/lib/utils.ts', purpose: 'Shared utility functions and helpers', priority: 'P1' },
            { path: 'src/app/api/process/route.ts', purpose: 'API route handler for core processing endpoint', priority: 'P0' },
            { path: 'tests/engine.test.ts', purpose: 'Unit tests for the core engine', priority: 'P1' }
          ]
      )
    ],
    buildPhases: roadmap.length > 0
      ? roadmap.map((r, idx) => ({
          phaseNumber: idx + 1,
          title: r.goal?.split(',')[0] || `Phase ${idx + 1}`,
          duration: r.phase || `Phase ${idx + 1}`,
          objective: r.goal || `Complete phase ${idx + 1} deliverables`,
          tasks: [
            {
              taskId: `T${idx + 1}.1`,
              title: `Implement ${r.goal?.split(',')[0] || 'core task'}`,
              file: fileTree[idx] || `src/modules/phase${idx + 1}/index.ts`,
              description: r.goal || 'Implement the core deliverable for this phase.',
              codeSnippet: `// Phase ${idx + 1}: ${r.goal?.split(',')[0] || 'Implementation'}\nexport function init() {\n  // TODO: Implement based on exact project requirements\n  console.log('Phase ${idx + 1} initialized');\n}`,
              testCriteria: `Phase ${idx + 1} deliverable is functional and passes basic smoke tests.`
            }
          ]
        }))
      : [
          {
            phaseNumber: 1,
            title: 'Project Foundation & Core Data Models',
            duration: 'Hours 0-6',
            objective: `Scaffold ${ideaTitle} monorepo, install dependencies, and define core data models and state management.`,
            tasks: [
              {
                taskId: 'T1.1',
                title: 'Initialize project and install dependencies',
                file: 'package.json',
                description: 'Run the scaffold commands, install all required packages, and verify the dev server starts.',
                codeSnippet: '// Verify: npm run dev should start at localhost:3000\n// Then navigate to the page and confirm the default template loads.',
                testCriteria: 'Dev server starts without errors. Default page renders in the browser.'
              },
              {
                taskId: 'T1.2',
                title: `Define core data types for ${moatShort}`,
                file: 'src/modules/core/types.ts',
                description: `Create TypeScript interfaces and types that model the core domain of ${ideaTitle}. These types drive the entire application.`,
                codeSnippet: `export interface CoreState {\n  id: string;\n  timestamp: number;\n  data: Record<string, unknown>;\n  status: 'idle' | 'processing' | 'complete' | 'error';\n}\n\nexport interface ProcessingResult {\n  success: boolean;\n  latencyMs: number;\n  output: unknown;\n}`,
                testCriteria: 'TypeScript compiles without errors. Types are imported in at least one module.'
              }
            ]
          },
          {
            phaseNumber: 2,
            title: `Core Engine: ${moatShort}`,
            duration: 'Hours 6-14',
            objective: `Build the primary technical moat — the ${moatShort} engine that powers ${ideaTitle}.`,
            tasks: [
              {
                taskId: 'T2.1',
                title: `Implement the ${moatShort} engine`,
                file: 'src/modules/core/engine.ts',
                description: `This is the heart of ${ideaTitle}. Implement the core processing logic that delivers the key value proposition: ${technicalMoat || 'breakthrough performance'}.`,
                codeSnippet: `export class CoreEngine {\n  private state: Map<string, unknown> = new Map();\n\n  async process(input: unknown): Promise<ProcessingResult> {\n    const start = performance.now();\n    // Core processing logic here\n    const latencyMs = performance.now() - start;\n    return { success: true, latencyMs, output: result };\n  }\n}`,
                testCriteria: `Engine processes test input and returns results within the claimed latency threshold.`
              }
            ]
          },
          {
            phaseNumber: 3,
            title: 'UI Dashboard & Live Visualization',
            duration: 'Hours 14-20',
            objective: `Build the ${targetUsers || 'user'}-facing dashboard with real-time metrics and interactive controls.`,
            tasks: [
              {
                taskId: 'T3.1',
                title: 'Build the main dashboard layout',
                file: 'src/components/Dashboard.tsx',
                description: `Create a professional, responsive dashboard that showcases the ${ideaTitle} capabilities with live metric counters, status indicators, and interactive controls.`,
                codeSnippet: `'use client';\nimport { useState, useEffect } from 'react';\n\nexport default function Dashboard() {\n  const [metrics, setMetrics] = useState({ latency: 0, throughput: 0 });\n  // Connect to core engine and display live metrics\n  return (\n    <div className="min-h-screen bg-slate-950 text-white p-8">\n      <h1 className="text-3xl font-bold">${ideaTitle} Dashboard</h1>\n      {/* Live metric cards */}\n    </div>\n  );\n}`,
                testCriteria: 'Dashboard renders with live data from the core engine. Responsive on mobile and desktop.'
              }
            ]
          },
          {
            phaseNumber: 4,
            title: 'Testing, Polish & Demo Rehearsal',
            duration: 'Hours 20-24',
            objective: 'Run full test suite, fix edge cases, deploy to staging, and rehearse the 180-second pitch.',
            tasks: [
              {
                taskId: 'T4.1',
                title: 'Run comprehensive test suite',
                file: 'tests/',
                description: 'Execute all unit and integration tests. Fix any failures. Verify all success metrics from the One-Pager.',
                codeSnippet: '// Run: npm test\n// Expected: All tests pass with 0 failures\n// Verify: Core engine latency < claimed threshold',
                testCriteria: 'All tests pass. Demo runs for 180 seconds without crashes.'
              }
            ]
          }
        ],
    apiSpecification: [
      {
        method: 'POST',
        endpoint: '/api/v1/process',
        purpose: `Process input through the ${ideaTitle} core engine`,
        requestBody: { input: 'object - The data to process', options: 'object (optional) - Processing configuration' },
        responseBody: { success: 'boolean', result: 'object - Processing output', latencyMs: 'number - Processing time in milliseconds' }
      },
      {
        method: 'GET',
        endpoint: '/api/v1/metrics',
        purpose: 'Retrieve real-time system performance metrics for the dashboard',
        requestBody: {},
        responseBody: { uptime: 'number - Seconds since start', totalProcessed: 'number', averageLatencyMs: 'number' }
      }
    ],
    dataSchema: {
      description: `Data persistence layer for ${ideaTitle}. Uses lightweight storage suitable for hackathon rapid prototyping.`,
      models: [
        {
          name: 'ProcessingRecord',
          fields: ['id: string (UUID, primary key)', 'input: object (raw input data)', 'output: object (processing result)', 'latencyMs: number', 'status: enum (pending, complete, error)', 'createdAt: timestamp'],
          storage: 'localStorage + IndexedDB (offline-first)'
        }
      ]
    },
    testingStrategy: {
      unitTests: [
        `Core engine processes valid input and returns correct output format`,
        `Core engine handles edge cases (empty input, malformed data) gracefully`,
        `Latency stays within claimed threshold across 100 consecutive operations`
      ],
      integrationTests: [
        `End-to-end flow: UI input → API → Engine → Response → UI update`,
        `System recovers gracefully from simulated network disconnection`
      ],
      demoValidation: [
        `Run the 180-second demo script end-to-end without any crashes`,
        `Verify all live metrics update in real-time on the dashboard`,
        `Test with at least 3 different input scenarios during rehearsal`
      ]
    },
    deploymentGuide: {
      platform: 'Vercel (Frontend) + Railway (Backend if needed)',
      steps: [
        'Push code to GitHub repository',
        'Connect Vercel to the GitHub repo for auto-deployment',
        'Set all environment variables in Vercel dashboard',
        'Verify production build compiles without errors',
        'Test the deployed URL on mobile and desktop browsers',
        'Share the live URL in the hackathon submission form'
      ],
      demoUrl: `https://${ideaTitle.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.vercel.app`
    },
    criticalWarnings: [
      `Do NOT deviate from the defined scope. If a feature is in the "No-Gos" list, do not build it regardless of how "quick" it seems.`,
      `Test the live demo on the EXACT device and browser you will use on stage. Do not assume it works — verify.`,
      `Keep a backup demo video recorded. Venue Wi-Fi failures are common at hackathons.`,
      `Commit and push to Git every 2 hours minimum. Lost code at hour 20 is catastrophic.`
    ]
  };
}

module.exports = { generateDeepBuildGuide };
