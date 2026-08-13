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

        {/* SECTION 3: 3-MINUTE PITCH TELEPROMPTER */}
        <div className="glass-card p-6 border-emerald-500/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>⏱️</span> 3-Minute Live Hackathon Pitch Teleprompter
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Pacing alarm countdowns: Hook (45s), Live Demo (60s), Architecture (45s), Moat & Q&A (30s).</p>
            </div>
            <button
              onClick={() => setTeleprompterActive(!teleprompterActive)}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                teleprompterActive ? 'bg-red-500 text-white' : 'bg-emerald-500 text-slate-950'
              }`}
            >
              {teleprompterActive ? '⏹ Reset Teleprompter' : '▶ Start 3-Min Pitch Timer'}
            </button>
          </div>

          <div className="teleprompter-meter-wrap">
            <div
              className="teleprompter-meter-fill"
              style={{ width: teleprompterActive ? '65%' : '15%' }}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center mt-4">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-emerald-500/20">
              <div className="text-[11px] text-slate-400">1. Hook & Problem</div>
              <div className="text-sm font-bold text-emerald-400">0:00 - 0:45</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-emerald-500/20">
              <div className="text-[11px] text-slate-400">2. Live Interactive Demo</div>
              <div className="text-sm font-bold text-emerald-400">0:45 - 1:45</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-emerald-500/20">
              <div className="text-[11px] text-slate-400">3. Technical Architecture</div>
              <div className="text-sm font-bold text-emerald-400">1:45 - 2:30</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-emerald-500/20">
              <div className="text-[11px] text-slate-400">4. Business Moat & Q&A</div>
              <div className="text-sm font-bold text-emerald-400">2:30 - 3:00</div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
