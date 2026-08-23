'use client';

import { useState } from 'react';

export default function FeatureCard({
  id,
  featureNumber,
  title,
  icon = '⚡',
  badge = 'PRODUCTION READY',
  realWorldScenario,
  algorithmConcept,
  defaultExpanded = false,
  accentColor = 'indigo',
  children
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const getBorderHover = () => {
    switch (accentColor) {
      case 'sky': return 'border-sky-500/30 hover:border-sky-500/50';
      case 'emerald': return 'border-emerald-500/30 hover:border-emerald-500/50';
      case 'indigo':
      default: return 'border-indigo-500/30 hover:border-indigo-500/50';
    }
  };

  const getBadgeClass = () => {
    switch (accentColor) {
      case 'sky': return 'bg-sky-500/15 text-sky-300 border-sky-500/35';
      case 'emerald': return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35';
      case 'indigo':
      default: return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/35';
    }
  };

  return (
    <div
      id={`feature-${id}`}
      className={`glass-card p-5 sm:p-6 transition-all bg-slate-900/80 border ${getBorderHover()} mb-6 text-left`}
    >
      {/* Header Bar */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl shrink-0">
            {icon}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              {featureNumber && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/80 font-bold">
                  ENG #{featureNumber}
                </span>
              )}
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold uppercase ${getBadgeClass()}`}>
                {badge}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white font-heading">
              {title}
            </h3>
          </div>
        </div>

        {/* Toggle Expand / Collapse Button */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 shrink-0"
        >
          <span>{isExpanded ? 'Collapse Engine' : 'Explore Engine'}</span>
          <span>{isExpanded ? '▲' : '▼'}</span>
        </button>
      </div>

      {/* Real-World & Algorithm Concept Box (Always visible as a helpful 2-line summary) */}
      <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/5 mb-4 text-xs leading-relaxed space-y-1.5 font-normal">
        {realWorldScenario && (
          <div className="text-slate-300">
            <strong className="text-white font-semibold font-mono">🌐 Real-World: </strong>
            {realWorldScenario}
          </div>
        )}
        {algorithmConcept && (
          <div className="text-slate-400 font-mono text-[11px]">
            <strong className="text-slate-300 font-semibold font-mono">⚡ Logic / Arch: </strong>
            {algorithmConcept}
          </div>
        )}
      </div>

      {/* Interactive Engine Sandbox (Expands when clicked) */}
      {isExpanded && (
        <div className="pt-4 border-t border-white/10 animate-fadeIn">
          {children}
        </div>
      )}
    </div>
  );
}
