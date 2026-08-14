import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col selection:bg-sky-500/30 selection:text-sky-200">
      <div className="ambient-radiance" />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-14 flex flex-col items-center justify-center text-center">
        
        {/* Top Aggressive Cyber Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-sky-500/35 text-sky-400 text-xs font-mono font-bold tracking-wider mb-8 shadow-xl shadow-sky-500/10">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
          <span>APEX PLATFORM STANDARD • 63 SPECIALIZED PRODUCTION ENGINES</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl leading-[1.08] mb-6 font-heading">
          The Continuous Continuum for <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-emerald-400">
            Top 1% Engineers &amp; Founders
          </span>
        </h1>

        <p className="text-slate-300 text-base sm:text-lg max-w-3xl leading-relaxed mb-12 font-normal">
          An autonomous platform connecting Karnataka state academic strategy, sub-300ms real-time WebRTC voice coaching, and Discord-style hackathon team split-chat AI copilots with $0.00 zero cloud spend.
        </p>

        {/* 3 Core Vault Triad Mega Cards */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 text-left">
          
          {/* VAULT 1: HORIZON */}
          <Link href="/vault/horizon" className="group">
            <div className="glass-card glass-card-hover glow-horizon p-8 h-full flex flex-col justify-between border-sky-500/30 bg-slate-900/80">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-13 h-13 rounded-2xl bg-sky-500/15 border border-sky-500/35 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-lg shadow-sky-500/15">
                    🌅
                  </div>
                  <span className="text-xs font-mono font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40">
                    21 Features
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-sky-300 transition-colors font-heading">
                  Horizon Career OS
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                  KCET/DCET Option-Entry Simulators, BEO Document OCR Validation, 371(J) Quota Forecasters, SNQ Fee Waivers &amp; DST NIDHI-TBI Incubator Grants.
                </p>

                {/* Telemetry Preview Pills */}
                <div className="space-y-2.5 mb-6">
                  <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-950/70 border border-sky-500/20 font-mono">
                    <span className="text-slate-400">KEA Option-Entry Allotment</span>
                    <span className="text-emerald-400 font-bold">Round 2 Upgrade ✓</span>
                  </div>
                  <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-950/70 border border-sky-500/20 font-mono">
                    <span className="text-slate-400">BEO Document OCR Match</span>
                    <span className="text-sky-400 font-bold">100% Clearance</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sky-400 text-sm font-bold group-hover:translate-x-2 transition-transform font-mono pt-4 border-t border-white/5">
                EXPLORE 21 HORIZON ENGINES ➔
              </div>
            </div>
          </Link>

          {/* VAULT 2: INTERVIEW SPRINT */}
          <Link href="/vault/interview" className="group">
            <div className="glass-card glass-card-hover glow-interview p-8 h-full flex flex-col justify-between border-indigo-500/30 bg-slate-900/80">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-13 h-13 rounded-2xl bg-indigo-500/15 border border-indigo-500/35 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-lg shadow-indigo-500/15">
                    💼
                  </div>
                  <span className="text-xs font-mono font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                    21 Features
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors font-heading">
                  Placement &amp; Voice AI
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                  &lt;300ms WebRTC Voice Coach with Wasm Noise Filtering, 17,640x SQL Covering Index Optimizers, AST Memory Profilers &amp; Token Bucket Rate Limiters.
                </p>

                {/* Telemetry Preview Pills */}
                <div className="space-y-2.5 mb-6">
                  <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-950/70 border border-indigo-500/20 font-mono">
                    <span className="text-slate-400">WebRTC Voice Latency</span>
                    <span className="text-emerald-400 font-bold">185ms (Sub-300ms)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-950/70 border border-indigo-500/20 font-mono">
                    <span className="text-slate-400">B-Tree SQL Execution</span>
                    <span className="text-indigo-400 font-bold">17,640x Speedup</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold group-hover:translate-x-2 transition-transform font-mono pt-4 border-t border-white/5">
                EXPLORE 21 INTERVIEW ENGINES ➔
              </div>
            </div>
          </Link>

          {/* VAULT 3: HACKATHON OS */}
          <Link href="/vault/hackathon" className="group">
            <div className="glass-card glass-card-hover glow-hackathon p-8 h-full flex flex-col justify-between border-emerald-500/30 bg-slate-900/80">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-13 h-13 rounded-2xl bg-emerald-500/15 border border-emerald-500/35 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-lg shadow-emerald-500/15">
                    🏆
                  </div>
                  <span className="text-xs font-mono font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    21 Features
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors font-heading">
                  Hackathon OS &amp; IP
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                  Discord-Style Split-Chat Team Copilots, 180s PWA Offline Pitch Teleprompters, Live Judge Trap Whisperers &amp; YC SAFE Note Scaffolders.
                </p>

                {/* Telemetry Preview Pills */}
                <div className="space-y-2.5 mb-6">
                  <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-950/70 border border-emerald-500/20 font-mono">
                    <span className="text-slate-400">PWA Stage Teleprompter</span>
                    <span className="text-emerald-400 font-bold">100% Offline Ready</span>
                  </div>
                  <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-950/70 border border-emerald-500/20 font-mono">
                    <span className="text-slate-400">Judge Defense Whisper</span>
                    <span className="text-cyan-400 font-bold">Sub-50ms HUD</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold group-hover:translate-x-2 transition-transform font-mono pt-4 border-t border-white/5">
                EXPLORE 21 HACKATHON ENGINES ➔
              </div>
            </div>
          </Link>

        </div>

        {/* Global Live Infrastructure Bar */}
        <div className="w-full glass-card p-6 border-white/10 flex flex-wrap items-center justify-between gap-6 text-left relative overflow-hidden bg-slate-950/90">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Autonomous Multi-Key Failover Engine (Groq 70B &amp; Gemini 2.5)
            </div>
            <div className="text-xs text-slate-400 mt-1 font-mono">
              In-Memory LRU Cache (&lt;2ms) • Zero-Downtime Heuristic Fallback • $0.00 Cloud Spend Invariant
            </div>
          </div>
          <div className="flex items-center gap-8 font-mono text-xs">
            <div>
              <div className="text-slate-400 text-[10px] uppercase">Test Coverage</div>
              <span className="text-cyan-400 font-bold text-base">84/84 Pass</span>
            </div>
            <div>
              <div className="text-slate-400 text-[10px] uppercase">Engine Total</div>
              <span className="text-emerald-400 font-bold text-base">63 Engines</span>
            </div>
            <div>
              <div className="text-slate-400 text-[10px] uppercase">Cloud Cost</div>
              <span className="text-indigo-400 font-bold text-base">$0.00 / Mo</span>
            </div>
          </div>
        </div>

      </main>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500 font-mono">
        PROJECT PHOENIX v24.0 APEX ULTRA • NEXT.JS 15 &amp; REACT 19 • 63 VERIFIED PRODUCTION ENGINES
      </footer>
    </div>
  );
}
