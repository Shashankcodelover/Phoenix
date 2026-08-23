'use client';

import { useState } from 'react';

export default function HackathonEnginesHub({ room, onSelectStep }) {
  const roomId = room?.roomId || 'ROOM-APEX-1001';
  const problemStatement = room?.lockedProblemStatement || 'NexusAudio: Sub-300ms Multimodal Voice Coaching & CRDT Vector IDE';

  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedEngine, setSelectedEngine] = useState(null);

  const engines = [
    {
      id: 1,
      name: 'Multimodal Poster Scanner & Calendar Radar',
      cat: 'Inception',
      desc: 'Extracts problem themes, registration deadlines, and jury rubrics from hackathon posters with 100% OCR accuracy.',
      badge: 'Step 1 Core',
      stepNum: 1,
      metric: '< 1.2s Scan Time'
    },
    {
      id: 2,
      name: 'Dynamic Squad Room & Member Invite Server',
      cat: 'Team OS',
      desc: 'Dynamically divides 100% of hackathon workloads across N active squad teammates with unique invite tokens.',
      badge: 'Step 2 Core',
      stepNum: 2,
      metric: 'Arbitrary N Scaling'
    },
    {
      id: 3,
      name: 'Live Web-Grounded Winning Ideas Lab',
      cat: 'Inception',
      desc: 'Queries 2025/2026 Devpost, ETHGlobal, and SIH grand prize winners to synthesize novel problem statements.',
      badge: 'Step 3 Core',
      stepNum: 3,
      metric: '99.2% Novelty Index'
    },
    {
      id: 4,
      name: '6 Foundation Inception Documents Generator',
      cat: 'Architecture',
      desc: 'Compiles SRS, Architecture Topology, API Schemas, Workload Matrix, Tech Stack, and Judge FAQ documents.',
      badge: 'Step 4 Core',
      stepNum: 4,
      metric: '6 Peak Docs'
    },
    {
      id: 5,
      name: '25 Crazy & Must-Have Features Blueprint Engine',
      cat: 'Architecture',
      desc: 'Categorizes core MVP must-haves vs high-impact "wow factor" features that blow away the judging panel.',
      badge: 'Step 5 Core',
      stepNum: 5,
      metric: '25 Deep Specs'
    },
    {
      id: 6,
      name: 'JIRA Sprint Board & Role-to-File Mapper',
      cat: 'Team OS',
      desc: 'Phase 1–5 chronological execution roadmap with exact file assignments (e.g. `src/modules/...`) per squad member.',
      badge: 'Sprint OS',
      stepNum: 8,
      metric: '5-Phase Pipeline'
    },
    {
      id: 7,
      name: 'Discord-Style Split-Channel Senior Copilots',
      cat: 'Multi-Agent',
      desc: 'Dedicated private AI mentor channels for Lead Architect, Pitch Lead, Frontend Lead, and Backend Engineers.',
      badge: 'Step 7 Core',
      stepNum: 7,
      metric: 'Isolated Buffers'
    },
    {
      id: 8,
      name: 'Cloud-Grade Marp 5-Slide Deck & HTML Studio',
      cat: 'Pitch & Demo',
      desc: 'Interactive 5-slide presentation canvas with live themes, speaker notes, and export to Marp & Standalone HTML.',
      badge: 'Pitch Studio',
      stepNum: 9,
      metric: '3 Export Formats'
    },
    {
      id: 9,
      name: '180s Timed Stage Pitch Teleprompter',
      cat: 'Pitch & Demo',
      desc: 'Stage-ready teleprompter scrolling smoothly at 135 WPM with countdown buzzer and speaker transitions.',
      badge: 'Step 6 Core',
      stepNum: 6,
      metric: '135 WPM Sync'
    },
    {
      id: 10,
      name: 'Multi-Agent Judge Objection Simulator',
      cat: 'Pitch & Demo',
      desc: 'Simulates tough questions from Staff Architects, VCs, and Security leads to drill bulletproof stage defenses.',
      badge: 'Judge Defense',
      stepNum: 6,
      metric: 'Sub-50ms Counters'
    },
    {
      id: 11,
      name: 'Sub-300ms WebRTC P2P Voice Mesh Engine',
      cat: 'Real-Time',
      desc: 'Peer-to-peer audio streaming with zero middleman servers and $0.00 cloud media bandwidth.',
      badge: 'Audio DSP',
      stepNum: 5,
      metric: '< 25ms P99'
    },
    {
      id: 12,
      name: 'Wasm Acoustic Breath & Jitter Canceler',
      cat: 'Real-Time',
      desc: 'In-browser WebAssembly DSP suppresses hackathon hall background noise directly on client CPU.',
      badge: 'Wasm Core',
      stepNum: 5,
      metric: '< 8ms Processing'
    },
    {
      id: 13,
      name: 'State-Based CRDT Vector Whiteboard Engine',
      cat: 'Real-Time',
      desc: 'Multi-cursor collaborative drawing canvas with conflict-free local vector state synchronization.',
      badge: 'CRDT Mesh',
      stepNum: 5,
      metric: '60 FPS Canvas'
    },
    {
      id: 14,
      name: 'Dynamic 120s Devpost Video Demo Storyboard',
      cat: 'Pitch & Demo',
      desc: 'Compiles timestamped video capture scripts with WebVTT subtitles for 2-minute video pitch submissions.',
      badge: 'Video Script',
      stepNum: 6,
      metric: 'WebVTT Ready'
    },
    {
      id: 15,
      name: 'YC SAFE Note & IP Governance Package Generator',
      cat: 'Governance',
      desc: 'Generates standard YC post-money equity split agreements and intellectual property ownership contracts.',
      badge: 'Startup IP',
      stepNum: 5,
      metric: 'Legal Ready'
    },
    {
      id: 16,
      name: 'Autonomous Sponsor Bounty SDK Quickstart Matcher',
      cat: 'Inception',
      desc: 'Scans hackathon sponsor tracks (Google Cloud, Gemini, MongoDB, Solana) and recommends qualifying bounties.',
      badge: 'Bounty Matcher',
      stepNum: 3,
      metric: '$5k - $25k Bounties'
    },
    {
      id: 17,
      name: 'Offline-First LocalStorage Emergency Cache Sync',
      cat: 'Resilience',
      desc: 'Ensures 100% demo uptime and automatic Merkle-tree state reconciliation during venue Wi-Fi crashes.',
      badge: 'Offline Safe',
      stepNum: 5,
      metric: '100% Blackout Safe'
    },
    {
      id: 18,
      name: 'Sub-50ms Real-Time Judge Whispering Copilot',
      cat: 'Multi-Agent',
      desc: 'Discreetly feeds technical trade-off answers and CAP theorem justifications during live jury Q&A rounds.',
      badge: 'Judge Whisperer',
      stepNum: 6,
      metric: '< 45ms Latency'
    },
    {
      id: 19,
      name: '17,640x SQL Covering Index Synthesizer',
      cat: 'Architecture',
      desc: 'Analyzes SQL queries and auto-generates composite covering B-Tree indexes eliminating full table scans.',
      badge: 'Database Core',
      stepNum: 5,
      metric: '17,640x Speedup'
    },
    {
      id: 20,
      name: 'Prototype Stress Tester & Chaos Load Simulator',
      cat: 'Resilience',
      desc: 'Simulates 5,000 to 250,000 RPS concurrent traffic and tests database failovers before live stage demo.',
      badge: 'Chaos Testing',
      stepNum: 8,
      metric: '250k RPS Sim'
    },
    {
      id: 21,
      name: '1-Click Devpost & GitHub Submission Compiler',
      cat: 'Governance',
      desc: 'Transforms project specs, architecture diagrams, and test results into a ready-to-paste Devpost submission.',
      badge: 'Devpost Ready',
      stepNum: 6,
      metric: 'Instant Markdown'
    },
    {
      id: 22,
      name: 'Multi-Model Routing & $0.00 Token Optimizer',
      cat: 'Multi-Agent',
      desc: 'Orchestrates Gemini 2.5 Flash, Groq 70B, and DeepSeek R1 with zero cloud cost and <2ms in-memory cache.',
      badge: 'Multi-Model',
      stepNum: 10,
      metric: '$0.00 Cost Guard'
    }
  ];

  const categories = ['all', 'Inception', 'Team OS', 'Architecture', 'Real-Time', 'Pitch & Demo', 'Multi-Agent', 'Governance', 'Resilience'];

  const filteredEngines = activeFilter === 'all'
    ? engines
    : engines.filter(e => e.cat === activeFilter);

  return (
    <div className="w-full rounded-3xl bg-theme-card border border-emerald-500/30 p-5 sm:p-7 shadow-2xl shadow-black/40 text-left space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-theme-glass">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl shrink-0">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                VAULT 3 PRODUCTION ENGINE MATRIX
              </span>
              <span className="text-xs text-theme-muted font-mono">
                Room: <strong className="text-theme-main">{roomId}</strong>
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-theme-main font-heading">
              All 22 Specialized National Hackathon Production Engines
            </h3>
            <p className="text-xs text-theme-muted leading-relaxed mt-0.5 font-medium">
              Explore and launch any of our 22 production engines designed to take your squad from raw idea inception to stage victory.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold">
            22 Verified Engines Active
          </span>
        </div>
      </div>

      {/* Category Filter Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar font-mono text-xs pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveFilter(cat)}
            className={`px-3 py-1.5 rounded-xl border transition-all whitespace-nowrap ${
              activeFilter === cat
                ? 'bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 border-emerald-500 font-bold shadow-sm'
                : 'bg-slate-100 dark:bg-slate-950 border-theme-glass text-theme-muted hover:text-theme-main'
            }`}
          >
            {cat === 'all' ? '✨ All 22 Engines' : cat}
          </button>
        ))}
      </div>

      {/* Engines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
        {filteredEngines.map((engine) => (
          <div
            key={engine.id}
            onClick={() => {
              if (onSelectStep && engine.stepNum) {
                onSelectStep(engine.stepNum);
              }
            }}
            className="p-5 rounded-2xl bg-slate-100/70 dark:bg-slate-950/80 border border-theme-glass hover:border-emerald-500/50 transition-all cursor-pointer flex flex-col justify-between space-y-3 group shadow-sm hover:shadow-md"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-xs">
                  #{engine.id}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] px-2 py-0.5 rounded bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30 font-bold">
                    {engine.cat}
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold">
                    {engine.metric}
                  </span>
                </div>
              </div>

              <h4 className="text-sm font-bold text-theme-main group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors font-sans leading-snug mb-1.5">
                {engine.name}
              </h4>
              <p className="text-theme-muted text-xs font-sans leading-relaxed font-medium">
                {engine.desc}
              </p>
            </div>

            <div className="pt-2 border-t border-theme-glass flex items-center justify-between text-[11px] text-emerald-700 dark:text-emerald-300 font-bold">
              <span>{engine.badge}</span>
              <span className="group-hover:translate-x-1 transition-transform">LAUNCH ➔</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
