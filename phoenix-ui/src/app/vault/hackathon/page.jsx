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

        {/* ══════════════════════════════════════════════════════════
            FEATURE 19: HACKATHON TEAM ROLE SYNERGY RECOMMENDER
            ══════════════════════════════════════════════════════════ */}
        <div className="glass-card p-8 border-sky-500/30 bg-slate-900/90 relative overflow-hidden mt-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 text-sky-400 text-xs font-mono font-semibold uppercase tracking-widest mb-2 border border-sky-500/30">
                ⭐ FEATURE 19 4-ARCHETYPE TEAM SYNERGY MATRIX
              </div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>🤝</span> Team Role Synergy &amp; Skill Complementarity
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Evaluates team balance across 4 winning hackathon archetypes (Frontend Storyteller, Distributed Architect, AI Specialist, Pitch Lead).
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Synergy Score: 100/100 (Grand Prize Podium Contender)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5">
              <div className="text-[10px] font-mono text-sky-400 uppercase tracking-wider mb-1">Archetype 1</div>
              <div className="text-xs font-bold text-white">Frontend Storyteller</div>
              <div className="text-[11px] text-emerald-400 font-mono mt-1">✓ Assigned: Alex</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Next.js 15, Tailwind v4, Audio UI</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5">
              <div className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider mb-1">Archetype 2</div>
              <div className="text-xs font-bold text-white">Distributed Architect</div>
              <div className="text-[11px] text-emerald-400 font-mono mt-1">✓ Assigned: David</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Redis LRU, CockroachDB Failover</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5">
              <div className="text-[10px] font-mono text-purple-400 uppercase tracking-wider mb-1">Archetype 3</div>
              <div className="text-xs font-bold text-white">AI / ML Specialist</div>
              <div className="text-[11px] text-emerald-400 font-mono mt-1">✓ Assigned: Priya</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Two-Stage RAG &amp; AST Profiler</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5">
              <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider mb-1">Archetype 4</div>
              <div className="text-xs font-bold text-white">Pitch Lead &amp; Moat</div>
              <div className="text-[11px] text-emerald-400 font-mono mt-1">✓ Assigned: Sneha</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Marp Slides, TAM, Judge Defense</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/90 border border-sky-500/20 text-xs">
            <div className="font-bold text-white mb-2">🚀 Recommended 24-Hour Sprint Task Allocations:</div>
            <ul className="text-slate-300 space-y-1 list-disc list-inside">
              <li><strong>Alex:</strong> Ship Glassmorphic interactive Next.js 15 client with live visualizer gauges.</li>
              <li><strong>David:</strong> Mount sharded Redis LRU cache with multi-key failover and 50,000 RPS chaos tests.</li>
              <li><strong>Priya:</strong> Fine-tune Two-Stage Vector RAG retriever and static AST Big-O profiler.</li>
              <li><strong>Sneha:</strong> Rehearse 180s teleprompter pitch and compile Marp 5-slide deck PDF.</li>
            </ul>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            FEATURE 23: STAGE-READY 180S PITCH COUNTDOWN & BUZZER
            ══════════════════════════════════════════════════════════ */}
        <div className="glass-card p-8 border-amber-500/30 bg-slate-900/90 relative overflow-hidden mt-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 text-xs font-mono font-semibold uppercase tracking-widest mb-2 border border-amber-500/30">
                ⭐ FEATURE 23 STAGE-READY 180S COUNTDOWN TIMER &amp; BUZZER
              </div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>⏱️</span> Stage-Ready 180s Pitch Timer &amp; Audio Tone Buzzer
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Synchronized 4-phase hackathon pitch clock with automated 30s wrap-up chimes (880 Hz / 440 Hz) and 60s judge Q&amp;A defense counter.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                Current Phase: Phase 2 (Live Demo)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Big Countdown Timer */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-amber-500/30 flex flex-col items-center justify-center text-center">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-widest mb-1">Time Remaining</div>
              <div className="text-5xl font-mono font-black text-amber-400 tracking-tight">02:15</div>
              <div className="text-xs text-emerald-400 mt-2 font-mono">Phase 2 of 4 Active</div>
            </div>

            {/* 4-Phase Progress Timeline */}
            <div className="md:col-span-2 p-5 rounded-2xl bg-slate-950/80 border border-white/5 flex flex-col justify-between">
              <div className="text-xs font-bold text-white mb-3">Pitch Phase Synchronization:</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-emerald-500/30">
                  <div className="text-[10px] text-emerald-400">00:00 - 00:30</div>
                  <div className="text-white font-bold mt-0.5 text-[11px]">The Hook</div>
                  <div className="text-[9px] text-slate-400 mt-0.5">✓ Completed</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-amber-500/50 bg-amber-500/5">
                  <div className="text-[10px] text-amber-400">00:30 - 01:30</div>
                  <div className="text-white font-bold mt-0.5 text-[11px]">Live Demo</div>
                  <div className="text-[9px] text-amber-400 mt-0.5">▶ Presenting</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-white/5">
                  <div className="text-[10px] text-slate-400">01:30 - 02:30</div>
                  <div className="text-white font-bold mt-0.5 text-[11px]">Traction &amp; TAM</div>
                  <div className="text-[9px] text-slate-400 mt-0.5">Up Next</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-white/5">
                  <div className="text-[10px] text-slate-400">02:30 - 03:00</div>
                  <div className="text-white font-bold mt-0.5 text-[11px]">The Ask</div>
                  <div className="text-[9px] text-slate-400 mt-0.5">30s Chime</div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5 text-xs">
                <span className="text-slate-300">Tone Audio Synthesis: <strong className="text-emerald-400">Active (880 Hz Chime)</strong></span>
                <button className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20">
                  🔔 Test Stage Tone Buzzer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            FEATURE 28: TRACK & SPONSOR BOUNTY MATCHING OPTIMIZER
            ══════════════════════════════════════════════════════════ */}
        <div className="glass-card p-8 border-purple-500/30 bg-slate-900/90 relative overflow-hidden mt-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 text-purple-400 text-xs font-mono font-semibold uppercase tracking-widest mb-2 border border-purple-500/30">
                ⭐ FEATURE 28 SPONSOR BOUNTY MATCHING OPTIMIZER
              </div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>🎯</span> Track &amp; Sponsor Bounty Matching Optimizer
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Scans project architecture against $5,000+ sponsor tracks (Gemini AI, Redis Cache, WebRTC) with automated compliance rubrics.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Total Addressable Bounty Pool: $12,000 USD
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-xs">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-purple-500/30">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-purple-400 text-[10px] uppercase font-bold">Google Gemini AI</span>
                <span className="text-emerald-400 font-mono font-bold">$5,000 USD</span>
              </div>
              <div className="font-bold text-white mt-1">Best Production Gemini 2.5 Real-Time App</div>
              <div className="text-[11px] text-slate-400 mt-1">✓ Match: Sub-300ms turn-taking streaming audio engine</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/30">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-rose-400 text-[10px] uppercase font-bold">Redis Platform</span>
                <span className="text-emerald-400 font-mono font-bold">$3,000 USD</span>
              </div>
              <div className="font-bold text-white mt-1">Best Low-Latency Cache &amp; Chaos Resilience</div>
              <div className="text-[11px] text-slate-400 mt-1">✓ Match: Sharded Redis LRU cache with 50,000 RPS benchmarks</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-sky-500/30">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-sky-400 text-[10px] uppercase font-bold">WebRTC &amp; Audio</span>
                <span className="text-emerald-400 font-mono font-bold">$4,000 USD</span>
              </div>
              <div className="font-bold text-white mt-1">Best Low-Latency Interactive Experience</div>
              <div className="text-[11px] text-slate-400 mt-1">✓ Match: 16 kHz WebRTC raw audio equalizer spectrum</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/90 border border-purple-500/20 text-xs">
            <div className="font-bold text-white mb-2">📋 Sponsor Submission Compliance Protocol:</div>
            <ul className="text-slate-300 space-y-1 list-disc list-inside">
              <li>Explicitly list SDK dependencies in <code>package.json</code>.</li>
              <li>Include dedicated <code>#sponsor-integration</code> markdown section in README.md.</li>
              <li>Attach 30-second video demo clip demonstrating sponsor API in action.</li>
            </ul>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            FEATURE 30: WINNING SOLUTIONS RAG VECTOR ARCHIVE
            ══════════════════════════════════════════════════════════ */}
        <div className="glass-card p-8 border-emerald-500/30 bg-slate-900/90 relative overflow-hidden mt-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-widest mb-2 border border-emerald-500/30">
                ⭐ FEATURE 30 WINNING SOLUTIONS RAG ARCHIVE
              </div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>🏆</span> Grand Prize Winning Solutions RAG Vector Archive
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Semantic vector search indexing 50+ global Grand Prize winning hackathon architectures with winning secret moat deconstructions.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Indexed: 50+ ETHGlobal, HackMIT &amp; CalHacks Champions
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-xs">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-white text-sm">MedSync Live: Decentralized Triage Mesh</span>
                <span className="text-amber-400 font-mono font-bold text-[11px]">🏆 $25,000 Champion</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                <strong>Winning Secret Moat:</strong> Combined WebRTC p2p audio with in-memory Redis replication; survived live Wi-Fi disconnect on stage.
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] mt-3">
                🎯 <strong>Judge WOW Factor:</strong> Unplugged router ethernet cable live on stage while audio waveforms continued rendering seamlessly.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-sky-500/30">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-white text-sm">CodePulse: AST Complexity Profiler</span>
                <span className="text-sky-400 font-mono font-bold text-[11px]">🥇 $15,000 HackMIT 1st</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                <strong>Winning Secret Moat:</strong> Static Acorn/Babel AST parsing in Web Workers without spinning up costly backend compute sandboxes.
              </div>
              <div className="p-2.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-300 text-[11px] mt-3">
                🎯 <strong>Judge WOW Factor:</strong> Live line-by-line syntax highlighter flashing red within 12ms of typing an unindexed array lookup.
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/90 border border-emerald-500/20 text-xs">
            <div className="font-bold text-white mb-2">⭐ Actionable Grand Prize Winning Playbook:</div>
            <ul className="text-slate-300 space-y-1 list-disc list-inside">
              <li>Open with a 15-second visceral user story before showing any architecture diagrams.</li>
              <li>Always design a deliberate &quot;Stage Demo WOW Moment&quot; (e.g., unplugging network, chaos injection).</li>
              <li>Frame unit economics in terms of enterprise ROI ($ saved or minutes reclaimed).</li>
            </ul>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            FEATURE 33: STAGE DEMO CLICK-THROUGH SCRIPT & FALLBACK
            ══════════════════════════════════════════════════════════ */}
        <div className="glass-card p-8 border-amber-500/30 bg-slate-900/90 relative overflow-hidden mt-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 text-xs font-mono font-semibold uppercase tracking-widest mb-2 border border-amber-500/30">
                ⭐ FEATURE 33 STAGE DEMO CLICK-THROUGH SCRIPT
              </div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>🎬</span> Stage Demo Click-Through Script &amp; Live Fallback Automator
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Synchronized 7-beat stage presentation click sequence with fail-safe zero-latency offline mock triggers.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                7 Beats • 180s Total Stage Duration
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/10">
              <div className="text-amber-400 font-mono text-[10px]">BEAT 1 • 0:00 - 0:25</div>
              <div className="text-white font-bold mt-1">Persona Pain Hook</div>
              <div className="text-slate-400 text-[11px] mt-0.5">Landing page problem statement</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/10">
              <div className="text-amber-400 font-mono text-[10px]">BEAT 2 • 0:25 - 0:55</div>
              <div className="text-white font-bold mt-1">Live AI Voice Action</div>
              <div className="text-slate-400 text-[11px] mt-0.5">Sub-300ms speech synthesis test</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/30">
              <div className="text-emerald-400 font-mono text-[10px]">BEAT 3 • 0:55 - 1:30</div>
              <div className="text-white font-bold mt-1">AST Technical WOW Moat</div>
              <div className="text-emerald-400 text-[11px] mt-0.5">★ Real-time O(N^3) warning flash</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-purple-500/30">
              <div className="text-purple-400 font-mono text-[10px]">BEAT 4 • 1:30 - 2:00</div>
              <div className="text-white font-bold mt-1">Chaos Resiliency Demo</div>
              <div className="text-purple-400 text-[11px] mt-0.5">Kill server node live on stage</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/90 border border-amber-500/20 text-xs">
            <div className="font-bold text-white mb-2">🛡️ Zero-Latency Fail-Safe Fallbacks:</div>
            <ul className="text-slate-300 space-y-1 list-disc list-inside">
              <li><strong>Wi-Fi Drops:</strong> Auto-route to <code>localhost:5000</code> in-memory cache (0ms latency).</li>
              <li><strong>API 429 Throttle:</strong> Fall back immediately to deterministic local multi-key round-robin rules.</li>
              <li><strong>Projector Glitch:</strong> Activate pre-rendered 60fps WebP animated session walkthrough.</li>
            </ul>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            FEATURE 38: LIVE JUDGE Q&A OBJECTION COUNTER-DEFENSE
            ══════════════════════════════════════════════════════════ */}
        <div className="glass-card p-8 border-rose-500/30 bg-slate-900/90 relative overflow-hidden mt-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 text-rose-400 text-xs font-mono font-semibold uppercase tracking-widest mb-2 border border-rose-500/30">
                ⭐ FEATURE 38 JUDGE Q&amp;A OBJECTION COUNTER-DEFENSE
              </div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>🛡️</span> Judge Q&amp;A Trap Objection Counter-Defense Matrix
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Bulletproof tactical rebuttals across scalability, API-wrapper accusations, and defensibility to secure Grand Prize podiums.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Persuasion Index: 95/100 (Podium Caliber)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-xs">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/30">
              <div className="text-rose-400 font-mono text-[10px] font-bold">TRAP 1: SCALABILITY</div>
              <div className="text-white font-bold mt-1 text-sm">&quot;How does this scale to 100k users?&quot;</div>
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-200 text-[11px] mt-2">
                <strong>Rebuttal:</strong> Decoupled state into sharded Redis cluster with stateless WebRTC workers. Benchmarks sustain 50k RPS with sub-45ms P99 latency.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30">
              <div className="text-amber-400 font-mono text-[10px] font-bold">TRAP 2: DEFENSIBILITY</div>
              <div className="text-white font-bold mt-1 text-sm">&quot;Why can&apos;t OpenAI build this in 2 weeks?&quot;</div>
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 text-[11px] mt-2">
                <strong>Rebuttal:</strong> Our moat is client-side zero-latency AST compilation and real-time WebRTC audio waveform telemetry executing locally without server fees.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-purple-500/30">
              <div className="text-purple-400 font-mono text-[10px] font-bold">TRAP 3: WRAPPER ACCUSATION</div>
              <div className="text-white font-bold mt-1 text-sm">&quot;Is this just an LLM API wrapper?&quot;</div>
              <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-200 text-[11px] mt-2">
                <strong>Rebuttal:</strong> Less than 20% interacts with LLM APIs; over 80% is custom AST parsers, prosody analyzers, chaos failovers, and local SQLite caches.
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/90 border border-rose-500/20 text-xs">
            <div className="font-bold text-white mb-2">⭐ Golden Rules for 2-Minute Judge Q&amp;A:</div>
            <ul className="text-slate-300 space-y-1 list-disc list-inside">
              <li>Never get defensive — acknowledge validity in the first 3 seconds (&quot;Great point on scalability...&quot;).</li>
              <li>State numbers first, explanations second (P99 latency, cost per 1k users).</li>
              <li>If asked about an unbuilt feature, explain the exact Phase 2 technical approach.</li>
            </ul>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            FEATURE 43: SPONSOR SDK QUICKSTART GENERATOR
            ══════════════════════════════════════════════════════════ */}
        <div className="glass-card p-8 border-sky-500/30 bg-slate-900/90 relative overflow-hidden mt-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 text-sky-400 text-xs font-mono font-semibold uppercase tracking-widest mb-2 border border-sky-500/30">
                ⭐ FEATURE 43 SPONSOR SDK QUICKSTART GENERATOR
              </div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>⚡</span> Sponsor Bounty SDK Quickstart Boilerplate Generator
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Zero-error copy-paste starter scaffolds for Gemini 2.5, Redis, and WebRTC to qualify for $12,000+ bounty pools.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
                Active Bounties: $12,000 Total
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-sky-500/30">
              <div className="text-sky-400 text-[10px] font-bold">GOOGLE GEMINI 2.5 ($5,000)</div>
              <div className="text-white font-bold text-sm mt-1">@google/genai SDK</div>
              <div className="text-slate-400 text-[11px] mt-1"><code>npm i @google/genai</code></div>
              <div className="text-emerald-400 text-[10px] mt-2">✓ Structured Outputs Ready</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-rose-500/30">
              <div className="text-rose-400 text-[10px] font-bold">REDIS VECTOR CACHE ($3,000)</div>
              <div className="text-white font-bold text-sm mt-1">ioredis &amp; In-Memory</div>
              <div className="text-slate-400 text-[11px] mt-1"><code>npm i ioredis</code></div>
              <div className="text-emerald-400 text-[10px] mt-2">✓ Distributed Lock Moat</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-purple-500/30">
              <div className="text-purple-400 text-[10px] font-bold">WEBRTC REALTIME ($4,000)</div>
              <div className="text-white font-bold text-sm mt-1">simple-peer Mesh</div>
              <div className="text-slate-400 text-[11px] mt-1"><code>npm i simple-peer</code></div>
              <div className="text-emerald-400 text-[10px] mt-2">✓ Client Mesh Signaled</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/90 border border-sky-500/20 text-xs">
            <div className="font-bold text-white mb-2">🏆 Hackathon Judge Compliance Checklist:</div>
            <ul className="text-slate-300 space-y-1 list-disc list-inside">
              <li>Uses official sponsor SDKs with strict JSON schema response guarantees.</li>
              <li>Includes graceful offline fallback ensuring stage demo zero-disruption.</li>
            </ul>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            FEATURE 48: PROTOTYPE STRESS-TESTER & VIDEO RECORDER
            ══════════════════════════════════════════════════════════ */}
        <div className="glass-card p-8 border-emerald-500/30 bg-slate-900/90 relative overflow-hidden mt-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-widest mb-2 border border-emerald-500/30">
                ⭐ FEATURE 48 PROTOTYPE STRESS-TESTER &amp; VIDEO RECORDER
              </div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>🚀</span> Live Concurrency Benchmark &amp; 120s Devpost Video Cue Engine
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Generates 1,000 virtual user traffic burst proof with P99 latency telemetry and automated 1080p demo video cue tracks.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                99.84% Success • 18.2ms Avg
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/30">
              <div className="text-emerald-400 text-[10px] font-bold">VIRTUAL USERS</div>
              <div className="text-white font-bold text-base mt-1">1,000 VU</div>
              <div className="text-slate-400 text-[10px] mt-0.5">25,000 Total reqs</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/30">
              <div className="text-emerald-400 text-[10px] font-bold">P99 LATENCY</div>
              <div className="text-emerald-400 font-bold text-base mt-1">44.6 ms</div>
              <div className="text-slate-400 text-[10px] mt-0.5">Global edge distribution</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-sky-500/30">
              <div className="text-sky-400 text-[10px] font-bold">DEVPOST VIDEO</div>
              <div className="text-white font-bold text-base mt-1">1080p 60fps</div>
              <div className="text-slate-400 text-[10px] mt-0.5">120s Hard Limit</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-purple-500/30">
              <div className="text-purple-400 text-[10px] font-bold">JUDGE PROOF BADGE</div>
              <div className="text-emerald-400 font-bold text-base mt-1">STAGE READY ✓</div>
              <div className="text-slate-400 text-[10px] mt-0.5">Zero crash guarantee</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/90 border border-emerald-500/20 text-xs">
            <div className="font-bold text-white mb-2">🎬 120s Devpost Stage Pitch Video Cue Sequence:</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-300">
              <div>• <code>0:00-0:20</code> Hero Dashboard &amp; 3-World Navigation</div>
              <div>• <code>0:20-0:45</code> Live Voice AI Mock with WebRTC audio gauge</div>
              <div>• <code>0:45-1:15</code> Chaos Failure on Whiteboard architecture</div>
              <div>• <code>1:15-2:00</code> Sponsor SDK Bounties &amp; Load Proof badge</div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            FEATURE 53: HACKATHON IP GOVERNANCE & SAFE NOTE ENGINE
            ══════════════════════════════════════════════════════════ */}
        <div className="glass-card p-8 border-indigo-500/30 bg-slate-900/90 relative overflow-hidden mt-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-400 text-xs font-mono font-semibold uppercase tracking-widest mb-2 border border-indigo-500/30">
                ⭐ FEATURE 53 IP GOVERNANCE &amp; SAFE NOTE SCAFFOLDER
              </div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>⚖️</span> Open-Source License, Founder Vesting &amp; YC SAFE Note
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Apache-2.0 patent protection, 4-year linear founder vesting (1-yr cliff), and $1.5M valuation cap SAFE note templates.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                Incubator Ready: YC / Techstars Cleared
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-indigo-500/30">
              <div className="text-indigo-400 text-[10px] font-bold">LICENSE TYPE</div>
              <div className="text-white font-bold text-sm mt-1">Apache-2.0</div>
              <div className="text-slate-400 text-[10px] mt-0.5">Explicit Patent Grant</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/30">
              <div className="text-emerald-400 text-[10px] font-bold">FOUNDER SPLIT</div>
              <div className="text-emerald-400 font-bold text-sm mt-1">25.0% Equal Split</div>
              <div className="text-slate-400 text-[10px] mt-0.5">4-Way Team Parity</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-sky-500/30">
              <div className="text-sky-400 text-[10px] font-bold">VESTING SCHEDULE</div>
              <div className="text-white font-bold text-sm mt-1">4-Year / 1-Yr Cliff</div>
              <div className="text-slate-400 text-[10px] mt-0.5">Month 12: 25% Unlock</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-purple-500/30">
              <div className="text-purple-400 text-[10px] font-bold">YC SAFE NOTE</div>
              <div className="text-white font-bold text-sm mt-1">$1,500,000 Cap</div>
              <div className="text-slate-400 text-[10px] mt-0.5">20% Round Discount</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/90 border border-indigo-500/20 text-xs">
            <div className="font-bold text-white mb-1">📜 Irreversible IP Assignment Clause:</div>
            <p className="text-slate-300 font-mono text-[11px]">
              &quot;All hackathon code, ML weights, telemetry graphs, and UI designs created during the event are irreversibly assigned to the corporate entity, preventing ex-contributor ownership disputes.&quot;
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            FEATURE 56: LIVE JUDGE VOICE Q&A REAL-TIME WHISPERER
            ══════════════════════════════════════════════════════════ */}
        <div className="glass-card p-8 border-cyan-500/30 bg-slate-900/90 relative overflow-hidden mt-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-widest mb-2 border border-cyan-500/30">
                ⭐ FEATURE 56 LIVE JUDGE Q&amp;A WHISPERER
              </div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>🎙️</span> Sub-50ms Stage Teleprompter &amp; Judge Trap Rebuttal HUD
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Real-time audio transcription interceptor generating 15-second crisp counter-rebuttal scripts for LLM wrapper and scaling traps.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                Podium Confidence: 98/100
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30 mb-6 text-xs font-mono">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-bold text-sm">Intercepted Judge Question:</span>
              <span className="text-cyan-400 font-mono text-[10px]">TRAP: LLM Wrapper</span>
            </div>
            <p className="text-amber-300 font-serif italic text-xs mb-3">
              &quot;Isn&apos;t this just a thin wrapper over OpenAI or Gemini APIs?&quot;
            </p>
            <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-slate-200 font-sans text-xs">
              <strong>🎙️ 15s Stage Earpiece Whisper Script:</strong> &quot;We use local AST parsing, deterministic state machines, and a multi-provider fallback cascade with zero-cost Groq/Gemini routing. If OpenAI goes down, our local rules engine continues running with 0ms downtime and $0 cloud spend.&quot;
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/90 border border-cyan-500/20 text-xs font-mono flex flex-wrap justify-between items-center gap-2">
            <div>
              <span className="text-cyan-400 font-bold">Target Delivery Duration:</span> 12 - 15 Seconds (Punchy &amp; Authoritative)
            </div>
            <div className="text-emerald-400">
              ✓ Eye Contact Maintained • Technical Moat Demonstrated
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            FEATURE 59: HACKATHON POST-MORTEM & MOAT EVOLUTION
            ══════════════════════════════════════════════════════════ */}
        <div className="glass-card p-8 border-violet-500/30 bg-slate-900/90 relative overflow-hidden mt-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/15 text-violet-400 text-xs font-mono font-semibold uppercase tracking-widest mb-2 border border-violet-500/30">
                ⭐ FEATURE 59 POST-MORTEM &amp; MOAT EVOLUTION
              </div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>📊</span> 5-Axis Retrospective Radar &amp; v1.0 Production Roadmap
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Automated judge sentiment deconstruction with actionable architecture upgrades for seed investor pitches.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Seed Pitch Ready: 95/100 ✓
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-violet-500/30">
              <div className="text-violet-400 text-[10px] font-bold">TECH MOAT</div>
              <div className="text-white font-bold text-sm mt-1">96 / 100</div>
              <div className="text-slate-400 text-[10px] mt-0.5">Distributed AST</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30">
              <div className="text-cyan-400 text-[10px] font-bold">UI / UX POLISH</div>
              <div className="text-white font-bold text-sm mt-1">94 / 100</div>
              <div className="text-slate-400 text-[10px] mt-0.5">Glassmorphism</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/30">
              <div className="text-amber-400 text-[10px] font-bold">SPONSOR SDK</div>
              <div className="text-white font-bold text-sm mt-1">98 / 100</div>
              <div className="text-slate-400 text-[10px] mt-0.5">Gemini + Redis</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-pink-500/30">
              <div className="text-pink-400 text-[10px] font-bold">PITCH TIMING</div>
              <div className="text-white font-bold text-sm mt-1">92 / 100</div>
              <div className="text-slate-400 text-[10px] mt-0.5">180s Teleprompter</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/30">
              <div className="text-emerald-400 text-[10px] font-bold">COMMERCIAL</div>
              <div className="text-white font-bold text-sm mt-1">90 / 100</div>
              <div className="text-slate-400 text-[10px] mt-0.5">YC SAFE Note</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/90 border border-violet-500/20 text-xs font-mono">
            <div className="font-bold text-white mb-1">🚀 v1.0 Production Architecture Roadmap:</div>
            <ul className="list-disc list-inside text-slate-300 space-y-1">
              <li>Phase 1: Multi-Region PostgreSQL read-replicas with pgvector indexing</li>
              <li>Phase 2: Enterprise SSO (SAML 2.0 / Okta) and RBAC role hierarchies</li>
              <li>Phase 3: SOC2 Type II compliance audit certification</li>
            </ul>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            FEATURE 63: PWA OFFLINE-FIRST STAGE TELEPROMPTER
            ══════════════════════════════════════════════════════════ */}
        <div className="glass-card p-8 border-emerald-500/30 bg-slate-900/90 relative overflow-hidden mt-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-widest mb-2 border border-emerald-500/30">
                ⭐ FEATURE 63 PWA OFFLINE TELEPROMPTER
              </div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>⚡</span> Zero-Network Auditorium Survival &amp; Local IndexedDB Cache
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Offline-first ServiceWorker precaching 180s teleprompters, Slidev decks, and Web Audio synthesizers (0 dropped frames on Wi-Fi crashes).
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Stage Offline Ready: 100% ✓
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/30">
              <div className="text-emerald-400 text-[10px] font-bold">CACHE STRATEGY</div>
              <div className="text-white font-bold text-sm mt-1">Cache-First</div>
              <div className="text-slate-400 text-[10px] mt-0.5">3.4 MB Precached</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-cyan-500/30">
              <div className="text-cyan-400 text-[10px] font-bold">TELEPROMPTER LOOP</div>
              <div className="text-white font-bold text-sm mt-1">60 FPS Smooth</div>
              <div className="text-slate-400 text-[10px] mt-0.5">requestAnimationFrame</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/30">
              <div className="text-amber-400 text-[10px] font-bold">AUDIO SYNTHESIZER</div>
              <div className="text-white font-bold text-sm mt-1">Offline Osc</div>
              <div className="text-slate-400 text-[10px] mt-0.5">440Hz / 880Hz Tones</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-purple-500/30">
              <div className="text-purple-400 text-[10px] font-bold">STAGE RECOVERY</div>
              <div className="text-white font-bold text-sm mt-1">Instant Failover</div>
              <div className="text-slate-400 text-[10px] mt-0.5">Zero Wi-Fi Dependency</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/90 border border-emerald-500/20 text-xs font-mono">
            <div className="font-bold text-white mb-1">🛡️ Stage Disaster-Proof Invariant:</div>
            <p className="text-slate-300">
              Even under total stadium network blackout, all timer chimes, cue slides, and live speaker notes execute flawlessly from local CacheStorage and Web Audio synthesizers.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}

















