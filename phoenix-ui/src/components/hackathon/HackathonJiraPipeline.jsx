'use client';

import { useState } from 'react';

export default function HackathonJiraPipeline({ room }) {
  const roomId = room?.roomId || 'ROOM-APEX-1001';
  const members = room?.members || [
    { name: 'Shashank J', role: 'Lead Full-Stack & Systems Architect', avatar: '👨‍💻' }
  ];
  const memberCount = members.length;
  const problemStatement = room?.lockedProblemStatement || 'NexusAudio: Sub-300ms Multimodal Voice Coaching & CRDT Vector IDE';

  const [activePhase, setActivePhase] = useState(1);

  // Interactive JIRA Task Board State
  const [tasks, setTasks] = useState([
    // PHASE 1: FOUNDATION & REPO SCAFFOLDING (Hour 0-4)
    {
      id: 'task-1',
      phase: 1,
      title: 'Initialize Next.js 16 + Express Monorepo with Tailwind Tokens',
      assignee: members[0]?.name || 'Shashank J',
      role: 'Lead Architect',
      fileTarget: 'package.json, src/app/layout.jsx, src/app/globals.css',
      priority: 'CRITICAL',
      status: 'DONE',
      estHours: '1.5h'
    },
    {
      id: 'task-2',
      phase: 1,
      title: 'Configure WebRTC Signaling Server & Local In-Memory Store',
      assignee: members[1]?.name || members[0]?.name,
      role: 'Backend & Systems',
      fileTarget: 'sup-backend/modules/hackathon-agent/signalingServer.js',
      priority: 'HIGH',
      status: 'DONE',
      estHours: '2.0h'
    },
    {
      id: 'task-3',
      phase: 1,
      title: 'Draft 180s Opening Hook & 5-Slide Marp Deck Outline',
      assignee: members[2]?.name || members[0]?.name,
      role: 'Pitch & Product Lead',
      fileTarget: 'docs/STAGE_PITCH_180S.md, docs/MARP_SLIDES.md',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      estHours: '1.5h'
    },

    // PHASE 2: CORE ALGORITHMIC MOAT (Hour 4-12)
    {
      id: 'task-4',
      phase: 2,
      title: 'Build Sub-300ms WebAssembly Audio DSP & Noise Suppressor',
      assignee: members[0]?.name || 'Shashank J',
      role: 'Lead Architect',
      fileTarget: 'src/modules/audio/wasmNoiseCanceler.cpp, src/modules/audio/worklet.js',
      priority: 'CRITICAL',
      status: 'IN_PROGRESS',
      estHours: '4.0h'
    },
    {
      id: 'task-5',
      phase: 2,
      title: 'Implement Yjs State-based CRDT Vector Whiteboard Engine',
      assignee: members[1]?.name || members[0]?.name,
      role: 'Frontend Specialist',
      fileTarget: 'src/components/canvas/VectorWhiteboard.jsx, src/lib/crdtMesh.js',
      priority: 'HIGH',
      status: 'TODO',
      estHours: '3.5h'
    },
    {
      id: 'task-6',
      phase: 2,
      title: 'Multi-Key Gemini 2.5 & Groq 70B Failover Router (<2ms LRU Cache)',
      assignee: members[0]?.name || 'Shashank J',
      role: 'Backend / AI',
      fileTarget: 'src/config/multiKeyRouter.js, src/middleware/lruCache.js',
      priority: 'CRITICAL',
      status: 'IN_PROGRESS',
      estHours: '2.5h'
    },

    // PHASE 3: UI CANVAS & REAL-TIME PRESENCE (Hour 12-18)
    {
      id: 'task-7',
      phase: 3,
      title: 'Develop Next.js 16 High-Contrast Glassmorphic Workspace Canvas',
      assignee: members[1]?.name || members[0]?.name,
      role: 'Frontend Specialist',
      fileTarget: 'src/app/workspace/page.jsx, src/components/Navbar.jsx',
      priority: 'HIGH',
      status: 'TODO',
      estHours: '3.0h'
    },
    {
      id: 'task-8',
      phase: 3,
      title: 'Integrate Discord-Style Split-Channel AI Senior Copilot Tabs',
      assignee: members[0]?.name || 'Shashank J',
      role: 'Full-Stack',
      fileTarget: 'src/components/DiscordTeamChat.jsx, src/lib/squadChatEngine.js',
      priority: 'HIGH',
      status: 'TODO',
      estHours: '2.5h'
    },

    // PHASE 4: STRESS TEST & JUDGE REHEARSAL (Hour 18-22)
    {
      id: 'task-9',
      phase: 4,
      title: 'Run 88/88 Automated Unit Tests & 5,000 RPS Stress Simulator',
      assignee: members[0]?.name || 'Shashank J',
      role: 'Lead Architect',
      fileTarget: 'test/v24_prototype_stress.test.js, test/integration.test.js',
      priority: 'CRITICAL',
      status: 'TODO',
      estHours: '2.0h'
    },
    {
      id: 'task-10',
      phase: 4,
      title: 'Live 180s Timed Stage Teleprompter Rehearsal & Judge Objection Drilling',
      assignee: members[2]?.name || members[0]?.name,
      role: 'Pitch & Product Lead',
      fileTarget: 'src/components/hackathon/HackathonRoundTracker.jsx',
      priority: 'CRITICAL',
      status: 'TODO',
      estHours: '2.0h'
    },

    // PHASE 5: PRODUCTION DEPLOY & DEVPOST (Hour 22-24)
    {
      id: 'task-11',
      phase: 5,
      title: 'Compile Devpost README, WebVTT Video Storyboard & Vercel Release',
      assignee: members[0]?.name || 'Shashank J',
      role: 'All Squad Members',
      fileTarget: 'README.md, docs/DEVPOST.md, vercel.json',
      priority: 'HIGH',
      status: 'TODO',
      estHours: '1.5h'
    }
  ]);

  const phases = [
    { id: 1, name: 'Phase 1: Foundation & Scaffold', hours: 'Hour 0 - 4', badge: 'Setup' },
    { id: 2, name: 'Phase 2: Core Engineering & Moat', hours: 'Hour 4 - 12', badge: 'Moat' },
    { id: 3, name: 'Phase 3: UI & Real-Time Sync', hours: 'Hour 12 - 18', badge: 'UI & Sync' },
    { id: 4, name: 'Phase 4: Stress Test & Rehearsal', hours: 'Hour 18 - 22', badge: 'Validation' },
    { id: 5, name: 'Phase 5: Release & Devpost', hours: 'Hour 22 - 24', badge: 'Finale' }
  ];

  const toggleTaskStatus = (taskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      const nextStatus = t.status === 'TODO' ? 'IN_PROGRESS' : t.status === 'IN_PROGRESS' ? 'DONE' : 'TODO';
      return { ...t, status: nextStatus };
    }));
  };

  const filteredTasks = tasks.filter(t => t.phase === activePhase);
  const doneCount = tasks.filter(t => t.status === 'DONE').length;
  const inProgressCount = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const completionPercentage = Math.round((doneCount / tasks.length) * 100);

  const handleExportGithubIssues = () => {
    let md = `# 🚀 Project Phoenix: Sprint Roadmap for ${problemStatement}\n\n`;
    md += `**Room ID:** ${roomId} | **Squad Members:** ${memberCount} | **Progress:** ${completionPercentage}%\n\n`;

    phases.forEach(p => {
      md += `## ${p.name} (${p.hours})\n`;
      const phaseTasks = tasks.filter(t => t.phase === p.id);
      phaseTasks.forEach(t => {
        const check = t.status === 'DONE' ? '[x]' : '[ ]';
        md += `- ${check} **${t.title}** (Assignee: @${t.assignee} [_${t.role}_])\n`;
        md += `  - Target Files: \`${t.fileTarget}\`\n`;
        md += `  - Priority: \`${t.priority}\` | Est: \`${t.estHours}\`\n\n`;
      });
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Room_${roomId}_GitHub_Issues_Roadmap.md`;
    a.click();
  };

  return (
    <div className="w-full rounded-3xl bg-theme-card border border-emerald-500/30 p-5 sm:p-7 shadow-2xl shadow-black/40 text-left space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-theme-glass">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl shrink-0">
            🗺️
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                JIRA SPRINT PIPELINE &amp; FILE STRUCTURE OS
              </span>
              <span className="text-xs text-theme-muted font-mono">
                Room: <strong className="text-theme-main">{roomId}</strong> ({memberCount} Members)
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-theme-main font-heading">
              Chronological 24-Hour Build Pipeline &amp; File Assignments
            </h3>
            <p className="text-xs text-theme-muted leading-relaxed mt-0.5 font-medium">
              Every squad member has specific file ownership, deliverables, and line-by-line tasks for "{problemStatement}". Click any task to toggle status between <strong>TODO</strong>, <strong>IN PROGRESS</strong>, and <strong>DONE</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={handleExportGithubIssues}
            className="px-4 py-2.5 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
          >
            <span>📥</span> Export GitHub Issues / JIRA Markdown
          </button>
        </div>
      </div>

      {/* Sprint Progress Gauge */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-theme-glass flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-4 flex-1 min-w-[260px]">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-theme-main font-bold">Overall 24h Sprint Progress:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{completionPercentage}% Completed</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-400 transition-all duration-500 rounded-full"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <div><span className="text-theme-subtle">Done:</span> <strong className="text-emerald-600 dark:text-emerald-400">{doneCount}</strong></div>
          <div><span className="text-theme-subtle">In Progress:</span> <strong className="text-amber-600 dark:text-amber-400">{inProgressCount}</strong></div>
          <div><span className="text-theme-subtle">Total Tasks:</span> <strong className="text-theme-main">{tasks.length}</strong></div>
        </div>
      </div>

      {/* Phase Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar font-mono text-xs pb-1">
        {phases.map((p) => {
          const isActive = activePhase === p.id;
          const phaseTaskCount = tasks.filter(t => t.phase === p.id).length;
          const phaseDoneCount = tasks.filter(t => t.phase === p.id && t.status === 'DONE').length;

          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setActivePhase(p.id)}
              className={`flex-1 min-w-[170px] p-3 rounded-2xl border text-left transition-all ${
                isActive
                  ? 'bg-emerald-500/20 text-theme-main border-emerald-500 shadow-md font-bold ring-1 ring-emerald-400/50'
                  : 'bg-slate-100 dark:bg-slate-950 border-theme-glass text-theme-muted hover:text-theme-main hover:bg-slate-200/50 dark:hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">{p.badge}</span>
                <span className="text-[10px] text-theme-subtle">{phaseDoneCount}/{phaseTaskCount}</span>
              </div>
              <div className="truncate text-xs font-bold font-sans">{p.name}</div>
              <div className="text-[10px] text-theme-subtle font-normal mt-0.5">{p.hours}</div>
            </button>
          );
        })}
      </div>

      {/* Phase Tasks Grid & Role-to-File Matrix */}
      <div className="space-y-3 font-mono text-xs">
        {filteredTasks.map((task) => {
          const isDone = task.status === 'DONE';
          const isInProgress = task.status === 'IN_PROGRESS';

          return (
            <div
              key={task.id}
              onClick={() => toggleTaskStatus(task.id)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none ${
                isDone
                  ? 'bg-emerald-950/20 dark:bg-emerald-950/30 border-emerald-500/50 opacity-90'
                  : isInProgress
                  ? 'bg-amber-950/15 dark:bg-amber-950/25 border-amber-500/40 shadow-sm'
                  : 'bg-slate-100/70 dark:bg-slate-950/80 border-theme-glass hover:border-emerald-500/30'
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                  isDone
                    ? 'bg-emerald-500 text-slate-950'
                    : isInProgress
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-300 dark:bg-slate-800 text-slate-400'
                }`}>
                  {isDone ? '✓' : isInProgress ? '⟳' : '○'}
                </div>

                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-xs sm:text-sm font-bold font-sans ${isDone ? 'line-through text-theme-subtle' : 'text-theme-main'}`}>
                      {task.title}
                    </span>
                  </div>

                  <div className="text-[11px] text-emerald-700 dark:text-emerald-300 flex flex-wrap items-center gap-2">
                    <span>👤 <strong>{task.assignee}</strong> (<em>{task.role}</em>)</span>
                    <span>•</span>
                    <span className="text-sky-600 dark:text-sky-400">📄 Target Files: <code className="bg-slate-200 dark:bg-slate-900 px-1.5 py-0.5 rounded text-[10px]">{task.fileTarget}</code></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase border ${
                  task.priority === 'CRITICAL'
                    ? 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30'
                    : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30'
                }`}>
                  {task.priority}
                </span>

                <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase ${
                  isDone
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : isInProgress
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-200 dark:bg-slate-800 text-theme-subtle'
                }`}>
                  {task.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
