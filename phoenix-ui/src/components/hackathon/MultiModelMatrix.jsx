'use client';

export default function MultiModelMatrix() {
  const models = [
    {
      role: 'Idea Synthesis & Web Grounding',
      model: 'Gemini 2.5 Flash + Web Grounding',
      provider: 'Google AI Studio (Free Tier)',
      latency: '< 450ms',
      cost: '$0.00 / Mo',
      purpose: 'Deep research across 2025/2026 Devpost, ETHGlobal, and SIH national winner repositories.'
    },
    {
      role: 'Role-Specific Split Copilots & Code Scaffolds',
      model: 'Groq Llama 3.3 70B Versatile',
      provider: 'Groq Cloud (Free Tier)',
      latency: '< 180ms (320 T/s)',
      cost: '$0.00 / Mo',
      purpose: 'Ultra-fast conversational guidance for Lead Architect, Pitch Lead, and Frontend/Backend engineers.'
    },
    {
      role: 'Judge Objection & Complex Mathematical Moats',
      model: 'DeepSeek R1 / Gemini 2.5 Pro Fallback',
      provider: 'Multi-Key Dynamic Gate',
      latency: '< 750ms',
      cost: '$0.00 / Mo',
      purpose: 'Deep chain-of-thought verification for CAP theorem trade-offs and competitive jury defenses.'
    },
    {
      role: 'Client-Side Noise DSP & State Vectors',
      model: 'WebAssembly SIMD + Yjs CRDT Vector Clocks',
      provider: 'Client-Side Browser CPU',
      latency: '< 8ms Frame Loop',
      cost: '$0.00 / Mo',
      purpose: '100% zero-cloud audio noise suppression and conflict-free collaborative whiteboard drawing.'
    },
    {
      role: '180s Pitch Teleprompter & Marp Deck Generator',
      model: 'Deterministic AST Markdown & HTML Compiler',
      provider: 'In-Memory Client Engine',
      latency: '< 2ms Instant',
      cost: '$0.00 / Mo',
      purpose: 'Compiles project specifications into Marp slides and standalone HTML decks without server roundtrips.'
    }
  ];

  return (
    <div className="w-full rounded-3xl bg-theme-card border border-emerald-500/30 p-5 sm:p-7 shadow-2xl shadow-black/40 text-left space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-theme-glass">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl shrink-0">
            🤖
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                MULTI-MODEL ORCHESTRATION &amp; FREE TIER MATRIX
              </span>
              <span className="text-xs text-theme-muted font-mono">
                Invariant: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">$0.00 Total Cloud Cost</strong>
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-theme-main font-heading">
              Distributed Multi-Model Routing &amp; Token Optimization Engine
            </h3>
            <p className="text-xs text-theme-muted leading-relaxed mt-0.5 font-medium">
              We distribute workloads across multiple specialized free models and client-side WebAssembly heuristics to guarantee maximum performance and 100% uptime with zero cloud expenditure.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            MULTI-KEY FAILOVER: 100% UP
          </span>
        </div>
      </div>

      {/* Model Distribution Table / Cards */}
      <div className="space-y-3 font-mono text-xs">
        {models.map((m, idx) => (
          <div
            key={idx}
            className="p-4 sm:p-5 rounded-2xl bg-slate-100/70 dark:bg-slate-950/80 border border-theme-glass flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
          >
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold uppercase border border-emerald-500/30">
                  {m.role}
                </span>
                <span className="font-bold text-theme-main text-xs sm:text-sm font-sans">
                  {m.model}
                </span>
              </div>
              <p className="text-theme-muted text-xs font-sans leading-relaxed font-medium">
                {m.purpose}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px] shrink-0">
              <div>
                <span className="text-theme-subtle text-[10px] block uppercase">Provider</span>
                <span className="text-theme-main font-bold">{m.provider}</span>
              </div>
              <div>
                <span className="text-theme-subtle text-[10px] block uppercase">Latency</span>
                <span className="text-sky-600 dark:text-sky-400 font-bold">{m.latency}</span>
              </div>
              <div>
                <span className="text-theme-subtle text-[10px] block uppercase">Cost</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{m.cost}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
