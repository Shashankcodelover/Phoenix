import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="ambient-radiance" />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 flex flex-col items-center justify-center text-center">
        
        {/* Top Tagline */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-6 animate-pulse">
          ⚡ Next.js 15 & TailwindCSS v4 Enterprise Standard
        </div>

        {/* Main Hero Header */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl leading-[1.1] mb-6">
          The Autonomous <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400">Career & Hackathon OS</span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-3xl leading-relaxed mb-12">
          From Pre-University KCET/DCET state rank predictions and verified alumni mentorship, to sub-300ms real-time voice coaching and Discord-style hackathon team workspaces with Split-Chat AI.
        </p>

        {/* The 3 Core Vault Triad Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 text-left">
          
          {/* VAULT 1 */}
          <Link href="/vault/horizon" className="group">
            <div className="glass-card glass-card-hover glow-horizon p-8 h-full flex flex-col justify-between relative overflow-hidden border-sky-500/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-sky-500/20 transition-all" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">🌅</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30">
                    Vault 1
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
                  Horizon Pathways
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  KCET & DCET State Rank Estimator, RVCE/BMSCE Cutoff Predictor, SSP Smart Scholarships & Verified Alumni AMA Threads.
                </p>
              </div>

              <div className="flex items-center gap-2 text-sky-400 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                Enter Horizon Vault ➔
              </div>
            </div>
          </Link>

          {/* VAULT 2 */}
          <Link href="/vault/interview" className="group">
            <div className="glass-card glass-card-hover glow-interview p-8 h-full flex flex-col justify-between relative overflow-hidden border-indigo-500/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-500/20 transition-all" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">💼</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                    Vault 2
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                  Placement & Voice AI
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  &lt;300ms WebRTC Real-Time Voice Coach, Behavioral STAR Matrix Analyzer, Whiteboard Crash Resilience & Salary Negotiator.
                </p>
              </div>

              <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                Enter Placement Vault ➔
              </div>
            </div>
          </Link>

          {/* VAULT 3 */}
          <Link href="/vault/hackathon" className="group">
            <div className="glass-card glass-card-hover glow-hackathon p-8 h-full flex flex-col justify-between relative overflow-hidden border-emerald-500/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/20 transition-all" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">🏆</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Vault 3
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                  Hackathon OS
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Discord-style Team Workspaces, Idea Voting Polls, Role-Based Task Matrix, Split-Chat AI Senior Copilot & 3-Min Teleprompter.
                </p>
              </div>

              <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                Enter Hackathon Vault ➔
              </div>
            </div>
          </Link>

        </div>

        {/* 20k-User Scalability Metrics Banner */}
        <div className="w-full glass-card p-6 border-white/5 flex flex-wrap items-center justify-between gap-6 text-left">
          <div>
            <div className="text-sm font-semibold text-white">Production-Grade Low-Latency Compute Architecture</div>
            <div className="text-xs text-slate-400">Multi-Key Auto Failover • LRU Cache (&lt;2ms) • Zero-Downtime Heuristic Fallback</div>
          </div>
          <div className="flex items-center gap-6 font-mono text-sm">
            <div><span className="text-cyan-400 font-bold">21</span> Test Suites Passed</div>
            <div><span className="text-emerald-400 font-bold">100%</span> Free-Tier Uptime</div>
            <div><span className="text-indigo-400 font-bold">&lt;300ms</span> Voice Latency</div>
          </div>
        </div>

      </main>

      <footer className="border-t border-white/5 py-6 text-center text-xs text-slate-500">
        Project Phoenix v23.0 • Built with Next.js 15, React 19 & TailwindCSS v4
      </footer>
    </div>
  );
}
