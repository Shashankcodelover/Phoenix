import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      <div className="ambient-radiance" />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 flex flex-col items-center justify-center text-center">
        
        {/* Top Aggressive Cyber Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold tracking-wider mb-6 shadow-lg shadow-cyan-500/10">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>APEX STANDARD • ZERO-COST 20,000+ USER INFRASTRUCTURE</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl leading-[1.08] mb-6">
          The Unfair Advantage for <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400">
            Top 1% Engineers & Builders
          </span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-3xl leading-relaxed mb-12">
          A high-intensity autonomous platform unifying Karnataka state entrance rank prediction, &lt;300ms real-time voice interview coaching, and Discord-style hackathon team workspaces with Split-Chat Senior AI Copilots.
        </p>

        {/* 3 Core Vault Triad Mega Cards */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 text-left">
          
          {/* VAULT 1: HORIZON */}
          <Link href="/vault/horizon" className="group">
            <div className="glass-card glass-card-hover glow-horizon p-8 h-full flex flex-col justify-between border-sky-500/25">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    🌅
                  </div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30">
                    Vault 1
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
                  Horizon Career Pathways
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                  KCET & DCET State Rank Normalization Engine, RVCE/BMSCE Cutoff Radar, SSP Smart Scholarships & Verified RVCE/Google Alumni Mentorship AMAs.
                </p>

                {/* Telemetry Preview Pills */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-950/60 border border-white/5 font-mono">
                    <span className="text-slate-400">RVCE CSE Cutoff Match</span>
                    <span className="text-emerald-400 font-bold">98.4% Odds</span>
                  </div>
                  <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-950/60 border border-white/5 font-mono">
                    <span className="text-slate-400">SSP Govt Fee Waiver</span>
                    <span className="text-sky-400 font-bold">100% Eligible</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sky-400 text-sm font-bold group-hover:translate-x-1.5 transition-transform font-mono">
                LAUNCH HORIZON PORTAL ➔
              </div>
            </div>
          </Link>

          {/* VAULT 2: INTERVIEW SPRINT */}
          <Link href="/vault/interview" className="group">
            <div className="glass-card glass-card-hover glow-interview p-8 h-full flex flex-col justify-between border-indigo-500/25">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    💼
                  </div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                    Vault 2
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                  Placement & Voice AI
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                  &lt;300ms WebRTC Real-Time Voice Coach, Behavioral STAR Matrix Analyzer, 100k RPS Whiteboard Topology Simulator & Tech Salary Negotiator.
                </p>

                {/* Telemetry Preview Pills */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-950/60 border border-white/5 font-mono">
                    <span className="text-slate-400">Real-Time Audio Latency</span>
                    <span className="text-emerald-400 font-bold">185ms (Sub-300ms)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-950/60 border border-white/5 font-mono">
                    <span className="text-slate-400">FAANG STAR Score</span>
                    <span className="text-indigo-400 font-bold">P94 Percentile</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold group-hover:translate-x-1.5 transition-transform font-mono">
                LAUNCH PLACEMENT SPRINT ➔
              </div>
            </div>
          </Link>

          {/* VAULT 3: HACKATHON OS */}
          <Link href="/vault/hackathon" className="group">
            <div className="glass-card glass-card-hover glow-hackathon p-8 h-full flex flex-col justify-between border-emerald-500/25">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    🏆
                  </div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Vault 3
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                  Hackathon OS
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                  Discord-style Team Workspaces, Real-Time Idea Voting Polls, Role Decomposition, Dual-Pane Split-Chat AI Senior Copilot & 3-Min Pitch Clock.
                </p>

                {/* Telemetry Preview Pills */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-950/60 border border-white/5 font-mono">
                    <span className="text-slate-400">Team Split-Chat Copilot</span>
                    <span className="text-emerald-400 font-bold">24/7 Contextual</span>
                  </div>
                  <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-950/60 border border-white/5 font-mono">
                    <span className="text-slate-400">Judge Defense Rounds</span>
                    <span className="text-emerald-400 font-bold">5 Progressive Sims</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold group-hover:translate-x-1.5 transition-transform font-mono">
                LAUNCH HACKATHON ROOM ➔
              </div>
            </div>
          </Link>

        </div>

        {/* Global Live Infrastructure Stats */}
        <div className="w-full glass-card p-6 border-white/10 flex flex-wrap items-center justify-between gap-6 text-left relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Autonomous Multi-Key Failover Engine (Groq 70B & Gemini 2.5)
            </div>
            <div className="text-xs text-slate-400 mt-1 font-mono">
              In-Memory LRU Cache (&lt;2ms) • Zero-Downtime Heuristic Fallback • 100% Free Tier Zero Cloud Spend
            </div>
          </div>
          <div className="flex items-center gap-8 font-mono text-xs">
            <div>
              <div className="text-slate-400 text-[10px] uppercase">QA Verification</div>
              <span className="text-cyan-400 font-bold text-base">21/21 Pass</span>
            </div>
            <div>
              <div className="text-slate-400 text-[10px] uppercase">Concurrent Cap</div>
              <span className="text-emerald-400 font-bold text-base">20,000+</span>
            </div>
            <div>
              <div className="text-slate-400 text-[10px] uppercase">API Cost</div>
              <span className="text-indigo-400 font-bold text-base">$0.00 / Mo</span>
            </div>
          </div>
        </div>

      </main>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500 font-mono">
        PROJECT PHOENIX v24.0 • APEX ULTRA STANDARD • NEXT.JS 15 & REACT 19
      </footer>
    </div>
  );
}
