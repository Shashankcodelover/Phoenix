import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col selection:bg-sky-500/30 selection:text-sky-200">
      <div className="ambient-radiance" />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-14 flex flex-col items-center justify-center text-center">
        
        {/* Top Aggressive Cyber Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 dark:bg-slate-900/90 bg-sky-50 border border-sky-500/40 text-sky-600 dark:text-sky-400 text-xs font-mono font-bold tracking-wider mb-8 shadow-xl shadow-sky-500/10">
          <span className="w-2 h-2 rounded-full bg-sky-500 dark:bg-sky-400 animate-ping"></span>
          <span>APEX PLATFORM STANDARD • 66 SPECIALIZED PRODUCTION ENGINES</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-theme-main max-w-5xl leading-[1.08] mb-6 font-heading">
          The Continuous Continuum for <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-indigo-400 to-emerald-500 dark:from-sky-400 dark:via-indigo-300 dark:to-emerald-400">
            Top 1% Engineers &amp; Founders
          </span>
        </h1>

        <p className="text-theme-muted text-base sm:text-lg max-w-3xl leading-relaxed mb-12 font-medium">
          An autonomous platform connecting Karnataka state academic strategy, sub-300ms real-time WebRTC voice coaching, and Discord-style hackathon team split-chat AI copilots with $0.00 zero cloud spend.
        </p>

        {/* 3 Core Vault Triad Mega Cards */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 text-left">
          
          {/* VAULT 1: HORIZON */}
          <Link href="/vault/horizon" className="group">
            <div className="glass-card glass-card-hover glow-horizon p-8 h-full flex flex-col justify-between border-sky-500/30 bg-theme-card">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-13 h-13 rounded-2xl bg-sky-500/15 border border-sky-500/35 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-lg shadow-sky-500/15">
                    🌅
                  </div>
                  <span className="text-xs font-mono font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-500/40">
                    22 Features
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-theme-main mb-2 group-hover:text-sky-500 dark:group-hover:text-sky-300 transition-colors font-heading">
                  Horizon Career OS
                </h3>
                <p className="text-theme-muted text-xs sm:text-sm leading-relaxed mb-6">
                  KCET/DCET Option-Entry Simulators, BEO Document OCR Validation, Choice 2 Seat Retention Radars &amp; DST NIDHI-TBI Grants.
                </p>

                {/* Telemetry Preview Pills */}
                <div className="space-y-2.5 mb-6">
                  <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-950/70 border border-sky-500/20 font-mono">
                    <span className="text-theme-subtle">Choice 2 Seat Retention</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">100% Protected 🛡️</span>
                  </div>
                  <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-950/70 border border-sky-500/20 font-mono">
                    <span className="text-theme-subtle">BEO Document OCR Match</span>
                    <span className="text-sky-600 dark:text-sky-400 font-bold">100% Clearance</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 text-sm font-bold group-hover:translate-x-2 transition-transform font-mono pt-4 border-t border-theme-glass">
                EXPLORE 22 HORIZON ENGINES ➔
              </div>
            </div>
          </Link>

          {/* VAULT 2: INTERVIEW SPRINT */}
          <Link href="/vault/interview" className="group">
            <div className="glass-card glass-card-hover glow-interview p-8 h-full flex flex-col justify-between border-indigo-500/30 bg-theme-card">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-13 h-13 rounded-2xl bg-indigo-500/15 border border-indigo-500/35 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-lg shadow-indigo-500/15">
                    💼
                  </div>
                  <span className="text-xs font-mono font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/40">
                    22 Features
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-theme-main mb-2 group-hover:text-indigo-500 dark:group-hover:text-indigo-300 transition-colors font-heading">
                  Placement &amp; Voice AI
                </h3>
                <p className="text-theme-muted text-xs sm:text-sm leading-relaxed mb-6">
                  &lt;300ms WebRTC Voice Coach with Wasm Noise Filtering, Transactional Outbox CDC Relays, 17,640x SQL Covering Indexes &amp; Redis Rate Limiters.
                </p>

                {/* Telemetry Preview Pills */}
                <div className="space-y-2.5 mb-6">
                  <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-950/70 border border-indigo-500/20 font-mono">
                    <span className="text-theme-subtle">Transactional Outbox CDC</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">0 Dual-Write Loss ✓</span>
                  </div>
                  <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-950/70 border border-indigo-500/20 font-mono">
                    <span className="text-theme-subtle">B-Tree SQL Execution</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">17,640x Speedup</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-sm font-bold group-hover:translate-x-2 transition-transform font-mono pt-4 border-t border-theme-glass">
                EXPLORE 22 INTERVIEW ENGINES ➔
              </div>
            </div>
          </Link>

          {/* VAULT 3: HACKATHON OS */}
          <Link href="/vault/hackathon" className="group">
            <div className="glass-card glass-card-hover glow-hackathon p-8 h-full flex flex-col justify-between border-emerald-500/30 bg-theme-card">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-13 h-13 rounded-2xl bg-emerald-500/15 border border-emerald-500/35 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-lg shadow-emerald-500/15">
                    🏆
                  </div>
                  <span className="text-xs font-mono font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40">
                    22 Features
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-theme-main mb-2 group-hover:text-emerald-500 dark:group-hover:text-emerald-300 transition-colors font-heading">
                  Hackathon OS &amp; IP
                </h3>
                <p className="text-theme-muted text-xs sm:text-sm leading-relaxed mb-6">
                  Discord Split-Chat AI Copilots, 120s Devpost Pitch Video Storyboards, 180s PWA Offline Pitch Teleprompters &amp; YC SAFE Note Packages.
                </p>

                {/* Telemetry Preview Pills */}
                <div className="space-y-2.5 mb-6">
                  <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-950/70 border border-emerald-500/20 font-mono">
                    <span className="text-theme-subtle">120s Video Storyboard</span>
                    <span className="text-cyan-600 dark:text-cyan-400 font-bold">WebVTT Ready ✓</span>
                  </div>
                  <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-950/70 border border-emerald-500/20 font-mono">
                    <span className="text-theme-subtle">PWA Stage Teleprompter</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">100% Offline Safe</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-bold group-hover:translate-x-2 transition-transform font-mono pt-4 border-t border-theme-glass">
                EXPLORE 22 HACKATHON ENGINES ➔
              </div>
            </div>
          </Link>

        </div>

        {/* Global Live Infrastructure Bar */}
        <div className="w-full glass-card p-6 border-theme-glass flex flex-wrap items-center justify-between gap-6 text-left relative overflow-hidden bg-theme-card">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div>
            <div className="text-sm font-bold text-theme-main flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
              Autonomous Multi-Key Failover Engine (Groq 70B &amp; Gemini 2.5)
            </div>
            <div className="text-xs text-theme-subtle mt-1 font-mono">
              In-Memory LRU Cache (&lt;2ms) • Zero-Downtime Heuristic Fallback • $0.00 Cloud Spend Invariant
            </div>
          </div>
          <div className="flex items-center gap-8 font-mono text-xs">
            <div>
              <div className="text-theme-subtle text-[10px] uppercase">Test Coverage</div>
              <span className="text-cyan-600 dark:text-cyan-400 font-bold text-base">88/88 Pass</span>
            </div>
            <div>
              <div className="text-theme-subtle text-[10px] uppercase">Engine Total</div>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-base">66 Engines</span>
            </div>
            <div>
              <div className="text-theme-subtle text-[10px] uppercase">Cloud Cost</div>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold text-base">$0.00 / Mo</span>
            </div>
          </div>
        </div>

      </main>

      <footer className="border-t border-theme-glass py-6 text-center text-xs text-theme-subtle font-mono">
        PROJECT PHOENIX v25.0 APEX ENTERPRISE • NEXT.JS 16 &amp; REACT 19 • 66 VERIFIED PRODUCTION ENGINES
      </footer>
    </div>
  );
}
