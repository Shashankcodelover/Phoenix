import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ activeVault = null }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-slate-950/85 border-b border-white/10 px-4 sm:px-8 py-3.5 transition-all shadow-2xl shadow-black/60">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo & Version Pill */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-400 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-sky-500/25 group-hover:scale-105 transition-all">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400">
              🔥
            </div>
          </div>
          <div>
            <div className="font-heading font-extrabold text-lg text-white flex items-center gap-2 tracking-tight">
              PHOENIX <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-sky-500/15 text-sky-400 border border-sky-500/30 font-bold">APEX v25.0</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 tracking-wider flex items-center gap-1.5">
              <span>66 ENGINES</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400">3 PILLARS</span>
            </div>
          </div>
        </Link>

        {/* Vault Navigation Capsule Tabs */}
        <nav className="hidden md:flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-white/8 shadow-inner shadow-black/40">
          <Link
            href="/vault/horizon"
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono tracking-wide transition-all flex items-center gap-2 ${
              activeVault === 'horizon'
                ? 'bg-sky-500/25 text-sky-300 border border-sky-500/50 shadow-lg shadow-sky-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="text-sm">🌅</span> Vault 1: Horizon
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">22</span>
          </Link>

          <Link
            href="/vault/interview"
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono tracking-wide transition-all flex items-center gap-2 ${
              activeVault === 'interview'
                ? 'bg-indigo-500/25 text-indigo-300 border border-indigo-500/50 shadow-lg shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="text-sm">💼</span> Vault 2: Placement AI
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">22</span>
          </Link>

          <Link
            href="/vault/hackathon"
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono tracking-wide transition-all flex items-center gap-2 ${
              activeVault === 'hackathon'
                ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/50 shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="text-sm">🏆</span> Vault 3: Hackathon OS
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">22</span>
          </Link>
        </nav>

        {/* Actions Bar */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />

          <Link
            href="/onboarding"
            className="hidden sm:flex px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 hover:text-white transition-all items-center gap-1.5 shadow-sm"
          >
            <span>⚙️</span> Profile
          </Link>

          <Link
            href="/"
            className="md:hidden text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-300"
          >
            Vaults ➔
          </Link>
        </div>

      </div>
    </header>
  );
}

