import Link from 'next/link';

export default function Navbar({ activeVault = null }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-white/10 px-6 py-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
              🔥
            </div>
          </div>
          <div>
            <div className="font-heading font-bold text-lg text-white flex items-center gap-2">
              PHOENIX <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">v23.0</span>
            </div>
            <div className="text-[11px] text-slate-400 tracking-wider">CAREER & HACKATHON OS</div>
          </div>
        </Link>

        {/* Vault Navigation Pills */}
        <nav className="hidden md:flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-2xl border border-white/5">
          <Link
            href="/vault/horizon"
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center gap-2 ${
              activeVault === 'horizon'
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 shadow-lg shadow-sky-500/10'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🌅</span> Vault 1: Horizon
          </Link>

          <Link
            href="/vault/interview"
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center gap-2 ${
              activeVault === 'interview'
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 shadow-lg shadow-indigo-500/10'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>💼</span> Vault 2: Placement
          </Link>

          <Link
            href="/vault/hackathon"
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center gap-2 ${
              activeVault === 'hackathon'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🏆</span> Vault 3: Hackathon OS
          </Link>
        </nav>

        {/* Action Button & Status */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            20K Users Ready
          </div>
        </div>
      </div>
    </header>
  );
}
