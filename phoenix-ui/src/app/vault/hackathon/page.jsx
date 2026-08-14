'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { hackathonApi } from '@/lib/api';

export default function HackathonVaultPage() {
  // Universal Team Chat State
  const [messages, setMessages] = useState([
    { sender: 'Shashank J (Lead)', text: 'Welcome team! Let us finalize our multimodal RAG project for the main AI prize track.' },
    { sender: 'Alex (Backend)', text: 'I have configured the Express event loop and LRU caching layer for sub-2ms response times.' }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  // Idea Voting Poll State
  const [pollIdeas, setPollIdeas] = useState([
    { id: 'idea_1', title: 'NexusAudio — Sub-300ms Multimodal Voice & Collaborative IDE', track: 'Best AI Hack', votes: 3 },
    { id: 'idea_2', title: 'ResilienceMesh — Offline-First P2P Disaster Geofencing', track: 'Best Infra Hack', votes: 1 },
    { id: 'idea_3', title: 'ClashZero — Genetic Algorithm Schedule Conflict Resolver', track: 'Best Dev Tool', votes: 0 }
  ]);
  const [selectedIdeaId, setSelectedIdeaId] = useState('idea_1');

  // Split-Chat Senior Copilot State
  const [splitQuery, setSplitQuery] = useState('');
  const [copilotResponses, setCopilotResponses] = useState([
    { role: 'Senior Staff Engineer', text: 'Senior Copilot Active: I am tracking your team chat. For the NexusAudio IDE, focus on WebRTC audio streaming chunks and avoid premature SQL normalization.' }
  ]);
  const [loadingCopilot, setLoadingCopilot] = useState(false);

  // 3-Minute Teleprompter State
  const [teleprompterActive, setTeleprompterActive] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Handle Team Chat Send
  const handleSendMessage = () => {
    if (!inputMsg.trim()) return;
    setMessages(prev => [...prev, { sender: 'You (Lead Dev)', text: inputMsg }]);
    setInputMsg('');
  };

  // Handle Idea Vote
  const handleVote = (id) => {
    setSelectedIdeaId(id);
    setPollIdeas(prev => prev.map(i => i.id === id ? { ...i, votes: i.votes + 1 } : i));
  };

  // Handle Split-Chat Query
  const handleAskSeniorCopilot = async () => {
    if (!splitQuery.trim()) return;
    const userQ = splitQuery;
    setSplitQuery('');
    setLoadingCopilot(true);

    try {
      const res = await hackathonApi.getSplitChatAdvice('team_nexus_2026', userQ);
      setCopilotResponses(prev => [
        ...prev,
        { role: 'You', text: userQ },
        { role: 'Senior Staff Engineer', text: res.seniorCoachResponse }
      ]);
    } catch {
      setCopilotResponses(prev => [
        ...prev,
        { role: 'You', text: userQ },
        { role: 'Senior Staff Engineer', text: `Senior Architect Advice: For "${userQ}", use an in-memory LRU cache layer and keep your WebRTC audio frame payload under 16KB. Track your assigned task deliverables.` }
      ]);
    } finally {
      setLoadingCopilot(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="ambient-radiance" />
      <Navbar activeVault="hackathon" />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full">
        {/* Header Badge */}
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🏆</span>
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            Vault 3: Hackathon OS
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
          Team Workspaces, Idea Polling & Split-Chat AI Pipeline
        </h1>
        <p className="text-slate-400 text-sm mb-8">
          Collaborate in Discord-style team rooms, vote on winning RAG blueprints, and get private 24/7 Senior Staff Engineer guidance through the dual-pane Split-Chat pipeline.
        </p>

        {/* SECTION 1: IDEA VOTING POLL */}
        <div className="glass-card p-6 border-emerald-500/20 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🗳️</span> Live Team Idea Voting Poll
            </h3>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              Winning: NexusAudio (4 Votes)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pollIdeas.map((idea) => (
              <div
                key={idea.id}
                onClick={() => handleVote(idea.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedIdeaId === idea.id
                    ? 'bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-900/60 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">{idea.track}</span>
                  <span className="text-xs font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                    {idea.votes} Votes
                  </span>
                </div>
                <div className="font-semibold text-white text-sm mb-1">{idea.title}</div>
                <div className="text-xs text-slate-400">Click to cast team vote ➔</div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 1.5: ROLE-BASED TASK DECOMPOSITION MATRIX */}
        <div className="glass-card p-6 border-emerald-500/20 mb-8 bg-slate-900/80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🛠️</span> Autonomous Role-Based Task Decomposition (Scratch to Deploy)
            </h3>
            <span className="text-xs text-slate-400 font-mono">4 Modular Milestones Assigned</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-sky-500/20">
              <div className="text-[11px] font-bold text-sky-400 uppercase tracking-wider mb-1">Role 1: Frontend Lead</div>
              <div className="font-semibold text-white text-xs mb-2">Glassmorphic SPA & Canvas</div>
              <div className="text-[11px] text-slate-400 leading-relaxed mb-3">Build zero-reload UI, CSS tokens, and Web Audio waveform graph.</div>
              <div className="text-[10px] font-mono text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded inline-block">Next.js 15 • Tailwind v4</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-indigo-500/20">
              <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Role 2: Backend Architect</div>
              <div className="font-semibold text-white text-xs mb-2">Event-Loop REST & LRU Cache</div>
              <div className="text-[11px] text-slate-400 leading-relaxed mb-3">Configure token buckets, Express router, and &lt;2ms in-memory cache.</div>
              <div className="text-[10px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded inline-block">Node.js V8 • Express • Redis</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-emerald-500/20">
              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1">Role 3: AI & RAG Engineer</div>
              <div className="font-semibold text-white text-xs mb-2">Two-Stage Vector RAG & Keys</div>
              <div className="text-[11px] text-slate-400 leading-relaxed mb-3">Implement 768-dim embeddings with multi-key pool auto-failover.</div>
              <div className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded inline-block">Gemini AI • Groq 70B • RRF</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-pink-500/20">
              <div className="text-[11px] font-bold text-pink-400 uppercase tracking-wider mb-1">Role 4: Product & Pitch Lead</div>
              <div className="font-semibold text-white text-xs mb-2">5-Slide Deck & Judge Defense</div>
              <div className="text-[11px] text-slate-400 leading-relaxed mb-3">Prepare 3-minute presenter teleprompter script and defense grilling.</div>
              <div className="text-[10px] font-mono text-pink-300 bg-pink-500/10 px-2 py-0.5 rounded inline-block">Teleprompter • Loom • Devpost</div>
            </div>
          </div>
        </div>

        {/* SECTION 2: DUAL-PANE SPLIT-CHAT PIPELINE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          
          {/* PANE 1: UNIVERSAL TEAM CHAT */}
          <div className="glass-card p-6 border-emerald-500/20 flex flex-col h-[480px]">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>💬</span> Universal Team Chat Channel
              </h4>
              <span className="text-[11px] text-slate-400">#team-general</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
              {messages.map((m, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-white/5 text-xs">
                  <span className="font-bold text-emerald-400 mr-2">{m.sender}:</span>
                  <span className="text-slate-200">{m.text}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Message team..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
              >
                Send
              </button>
            </div>
          </div>

          {/* PANE 2: SPLIT-CHAT SENIOR ENGINEER COPILOT */}
          <div className="glass-card p-6 border-emerald-500/20 flex flex-col h-[480px] bg-slate-900/60">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>🧠</span> Senior Staff Engineer AI Copilot
              </h4>
              <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                Tracking Team Context
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
              {copilotResponses.map((r, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl text-xs ${
                    r.role === 'You'
                      ? 'bg-slate-950 border border-white/10 text-slate-300 ml-6'
                      : 'bg-cyan-950/40 border border-cyan-500/30 text-cyan-100'
                  }`}
                >
                  <div className="font-bold text-[11px] mb-1 text-cyan-400">{r.role}</div>
                  <div>{r.text}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask senior lead private coding/arch advice..."
                value={splitQuery}
                onChange={(e) => setSplitQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskSeniorCopilot()}
                className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleAskSeniorCopilot}
                disabled={loadingCopilot}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
              >
                {loadingCopilot ? 'Thinking...' : 'Ask'}
              </button>
            </div>
          </div>

        </div>

        {/* SECTION 3: 3-MINUTE PITCH TELEPROMPTER & 5-SLIDE DECK */}
        <div className="glass-card p-8 border-emerald-500/30 bg-slate-900/90 relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-widest mb-2 border border-emerald-500/30">
                ⭐ FEATURE 5 3-MINUTE PITCH STAGE & SLIDE DECK
              </div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>⏱️</span> Live 3-Minute Pitch Teleprompter & 5-Slide Presenter
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Pacing alarms with target WPM indicators across Hook (45s), Demo (60s), Architecture (45s), and Moat & Q&A (30s).
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setTeleprompterActive(!teleprompterActive)}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg ${
                  teleprompterActive ? 'bg-red-500 text-white shadow-red-500/20' : 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                }`}
              >
                {teleprompterActive ? '⏹ Stop Teleprompter' : '▶ Start 3-Min Pitch Stage'}
              </button>
            </div>
          </div>

          <div className="teleprompter-meter-wrap">
            <div
              className="teleprompter-meter-fill"
              style={{ width: teleprompterActive ? '70%' : '20%' }}
            />
          </div>

          {/* Active Teleprompter Script Card */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-emerald-500/25 my-6">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-emerald-400 uppercase tracking-wider">Active Teleprompter Stage: Phase 2 Live Demo (0:45 - 1:45)</span>
              <span className="font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">Target: 140 WPM</span>
            </div>
            <div className="text-sm text-slate-200 leading-relaxed font-sans mb-3">
              &quot;Judges, let us demonstrate how NexusAudio functions in real time. Notice as we stream WebRTC audio coaching, our AST parser simultaneously profiles Big-O algorithmic complexity with zero dropped frames. Our in-memory LRU cache guarantees sub-2ms response latency.&quot;
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Visual Cue: <span className="text-emerald-400">Switch screen to live interactive WebRTC canvas demo.</span>
            </div>
          </div>

          {/* 4 Phase Breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center mb-6">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-emerald-500/20">
              <div className="text-[11px] text-slate-400">1. Hook & Problem</div>
              <div className="text-xs font-bold text-emerald-400 mt-0.5">0:00 - 0:45 (130 WPM)</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-emerald-500/20">
              <div className="text-[11px] text-slate-400">2. Live Product Demo</div>
              <div className="text-xs font-bold text-emerald-400 mt-0.5">0:45 - 1:45 (140 WPM)</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-emerald-500/20">
              <div className="text-[11px] text-slate-400">3. Technical Architecture</div>
              <div className="text-xs font-bold text-emerald-400 mt-0.5">1:45 - 2:30 (135 WPM)</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-emerald-500/20">
              <div className="text-[11px] text-slate-400">4. Business Moat & Q&A</div>
              <div className="text-xs font-bold text-emerald-400 mt-0.5">2:30 - 3:00 (130 WPM)</div>
            </div>
          </div>

          {/* 5-Slide Pitch Deck Preview */}
          <div className="border-t border-white/10 pt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white">Exportable 5-Slide Pitch Deck (Ready for Marp / Slidev):</span>
              <span className="text-[11px] font-mono text-emerald-400">5/5 Slides Formatted</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 text-left text-xs">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5">
                <div className="text-[10px] text-emerald-400 font-bold mb-1">Slide 1</div>
                <div className="font-semibold text-white text-[11px]">The Hook & TAM</div>
                <div className="text-slate-400 text-[10px] mt-1">$14B Developer EdTech Market</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5">
                <div className="text-[10px] text-emerald-400 font-bold mb-1">Slide 2</div>
                <div className="font-semibold text-white text-[11px]">Core Problem</div>
                <div className="text-slate-400 text-[10px] mt-1">Fragmented Mock Practice</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5">
                <div className="text-[10px] text-emerald-400 font-bold mb-1">Slide 3</div>
                <div className="font-semibold text-white text-[11px]">Product Demo</div>
                <div className="text-slate-400 text-[10px] mt-1">&lt;300ms Voice Stream & AST</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5">
                <div className="text-[10px] text-emerald-400 font-bold mb-1">Slide 4</div>
                <div className="font-semibold text-white text-[11px]">Architecture</div>
                <div className="text-slate-400 text-[10px] mt-1">Multi-Key RAG & Failover</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5">
                <div className="text-[10px] text-emerald-400 font-bold mb-1">Slide 5</div>
                <div className="font-semibold text-white text-[11px]">Unit Economics</div>
                <div className="text-slate-400 text-[10px] mt-1">B2B SaaS ₹1,500/Student</div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            FEATURE 7: MULTIMODAL AI JUDGE DEFENSE GRILLING SIMULATOR
            ══════════════════════════════════════════════════════════ */}
        <div className="glass-card p-8 border-emerald-500/30 bg-slate-900/90 relative overflow-hidden mt-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-widest mb-2 border border-emerald-500/30">
                ⭐ FEATURE 7 5-ROUND JUDGE GRILLING DEFENSE
              </div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>⚖️</span> Live Multimodal AI Judge Defense Simulator
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Survive 5 progressive cross-examination rounds from Staff Architects and Tier-1 VCs to secure the 1st Place Podium trophy.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Round 1 of 5: Technical Moat
              </span>
            </div>
          </div>

          {/* Current Judge Cross-Examination Card */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-emerald-500/25 mb-6">
            <div className="flex items-center justify-between mb-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-base">👨‍⚖️</span>
                <span className="font-bold text-white">Dr. Marcus Vance (Staff Architect, Judge #1)</span>
              </div>
              <span className="text-[10px] font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">Skepticism: High</span>
            </div>

            <div className="text-sm text-slate-200 leading-relaxed font-sans mb-4 p-3.5 rounded-xl bg-slate-900 border border-white/5">
              &quot;How does NexusAudio guarantee sub-300ms response times when 10,000 users connect simultaneously during a network partition? Walk me through your database failover.&quot;
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-semibold block">Candidate Spoken / Written Architecture Defense:</label>
              <textarea
                rows="3"
                defaultValue="We guarantee sub-300ms latency by using WebRTC audio datachannels, an in-memory Redis cluster that caches AST complexity trees, sharding our distributed database, and eliminating single points of failure with multi-key auto-failover."
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-xs font-mono">
                <div>Tech Depth: <span className="text-emerald-400 font-bold">92/100</span></div>
                <div>Moat Defensibility: <span className="text-sky-400 font-bold">88/100</span></div>
                <div>Verdict: <span className="text-emerald-400 font-bold">Grand Prize Contender</span></div>
              </div>

              <button className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20">
                ⚡ Submit Defense to Panel ➔
              </button>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            FEATURE 11: LIVE DEMO DISASTER RECOVERY & MOCK SERVER LAB
            ══════════════════════════════════════════════════════════ */}
        <div className="glass-card p-8 border-emerald-500/30 bg-slate-900/90 relative overflow-hidden mt-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-widest mb-2 border border-emerald-500/30">
                ⭐ FEATURE 11 100% DEMO UPTIME CONTINGENCY
              </div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>🛡️</span> Live Demo Disaster Recovery & Local Mock Server
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Zero-downtime offline fallback suite. If hackathon venue Wi-Fi drops, switch seamlessly with pre-recorded mock payloads and spoken pivot scripts.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Status: Zero-Internet Fallback Ready
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Spoken Judge Pivot Script */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10">
              <div className="text-xs font-bold text-white mb-2 flex items-center gap-2">
                <span>🎙️</span> Spoken Judge Pivot Script (WiFi Drop):
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 font-sans text-xs text-slate-200 leading-relaxed">
                &quot;Judges, while the hackathon venue Wi-Fi is experiencing an intermittent drop, our architecture was built offline-first. Notice as our local in-memory fallback server and Web Audio pipeline process the exact same payload in sub-5ms with zero dropped transactions.&quot;
              </div>
            </div>

            {/* Standalone mockServer.js generator preview */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <span>⚡</span> Emergency Standalone <code className="text-emerald-400 text-[11px]">mockServer.js</code>
                </span>
                <span className="text-[10px] font-mono text-slate-400">Zero Dependencies</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 font-mono text-[11px] text-emerald-300 leading-relaxed max-h-28 overflow-y-auto">
                const http = require(&apos;http&apos;);<br/>
                const server = http.createServer((req, res) =&gt; &#123;<br/>
                &nbsp;&nbsp;res.setHeader(&apos;Content-Type&apos;, &apos;application/json&apos;);<br/>
                &nbsp;&nbsp;res.end(JSON.stringify(&#123; success: true, offlineFallback: true &#125;));<br/>
                &#125;);<br/>
                server.listen(5001);
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            FEATURE 12: AUTOMATED DEVPOST MARKDOWN SUBMISSION & BADGES
            ══════════════════════════════════════════════════════════ */}
        <div className="glass-card p-8 border-emerald-500/30 bg-slate-900/90 relative overflow-hidden mt-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-widest mb-2 border border-emerald-500/30">
                ⭐ FEATURE 12 1-CLICK DEVPOST & BADGES EXPORT
              </div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>📝</span> Automated Devpost Project Story & Shield.io Badges
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Generates complete, judge-optimized project documentation with tech stack badges, engineering bottlenecks, and 90-day post-hackathon roadmap.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Word Count: ~420 Words (3 Min Read)
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/90 border border-emerald-500/25">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-white">Formatted Devpost Project Story (Ready for 1-Click Copy):</span>
              <button className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20">
                📋 Copy Full Devpost Markdown
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-white/5 font-mono text-xs text-slate-300 leading-relaxed max-h-56 overflow-y-auto">
              # NexusAudio AI 🚀<br/>
              &gt; **Sub-300ms Turn-Taking Voice AI Mock Coach &amp; Chaos System Design Simulator**<br/><br/>
              ![Next.js 15](https://img.shields.io/badge/Next.js_15-0F172A?style=for-the-badge&amp;logo=code&amp;logoColor=38BDF8)
              ![TailwindCSS v4](https://img.shields.io/badge/TailwindCSS_v4-0F172A?style=for-the-badge&amp;logo=code&amp;logoColor=38BDF8)
              ![WebRTC](https://img.shields.io/badge/WebRTC-0F172A?style=for-the-badge&amp;logo=code&amp;logoColor=38BDF8)<br/><br/>
              ### 💡 Inspiration<br/>
              Engineering students in Tier-2/3 colleges lack access to high-fidelity FAANG mock interviews and judge defense preparation...<br/><br/>
              ### ⚡ What It Does<br/>
              • 🎙️ Real-Time Voice AI Coach: Low-latency turn-taking streaming with live WPM prosody gauges.<br/>
              • 🏛️ Live System Design Whiteboard: Interactive canvas with high-concurrency traffic stress-testing (5,000 to 250,000 RPS).<br/>
              • ⚖️ 5-Round Judge Defense Grilling: Multimodal simulator mimicking Staff Architects and VC cross-examinations.
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            FEATURE 16: AUTOMATED MARP 5-SLIDE PITCH DECK & HTML EXPORT
            ══════════════════════════════════════════════════════════ */}
        <div className="glass-card p-8 border-emerald-500/30 bg-slate-900/90 relative overflow-hidden mt-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-widest mb-2 border border-emerald-500/30">
                ⭐ FEATURE 16 MARP / SLIDEV & HTML DECK EXPORTER
              </div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>📑</span> Automated Marp 5-Slide Pitch Deck &amp; HTML Presenter
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Zero-setup offline presentation suite. Exports standard Marp Markdown for CLI PDF export, or generates a standalone HTML presenter with keyboard navigation.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Format: 5 Slides (Marp + Standalone HTML)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-white mb-1 flex items-center gap-2">
                  <span>📄</span> Raw Marp Frontmatter Markdown
                </div>
                <p className="text-[11px] text-slate-400 mb-3">
                  Ready to compile into PDF via <code className="text-emerald-400 font-mono">npx @marp-team/marp-cli deck.md --pdf</code>
                </p>
              </div>
              <button className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20">
                📋 Copy Marp Markdown
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-white mb-1 flex items-center gap-2">
                  <span>🌐</span> Standalone Offline HTML Presenter
                </div>
                <p className="text-[11px] text-slate-400 mb-3">
                  Single-file offline HTML deck. Open in any browser during live judge demos with keyboard slide control.
                </p>
              </div>
              <button className="w-full py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md shadow-sky-500/20">
                ⚡ Copy Standalone HTML
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}





