'use client';

import { useState } from 'react';

export default function IdeaDeepDiveModal({ idea, onClose, onLockIdea, isLocked }) {
  const [activeTab, setActiveTab] = useState('architecture');

  if (!idea) return null;

  const blueprint = idea.deepBlueprint || {
    systemArchitecture: 'Client UI (Next.js 16) ➔ WebAssembly Heuristic Layer ➔ Sub-30ms P2P Data Mesh ➔ In-Memory Vector Clocks ➔ Multi-Key Zero-Cost AI Failover.',
    targetPersonas: 'Engineering leads, hackathon squads, and operators facing severe latency and coordination friction.',
    buildRoadmap24h: [
      { phase: 'Hour 0-4', goal: 'Scaffold project topology, establish local CRDT vector states & signaling' },
      { phase: 'Hour 4-12', goal: 'Build the core mathematical moat, data processing pipeline & WebAssembly bindings' },
      { phase: 'Hour 12-18', goal: 'Connect Next.js 16 high-contrast UI canvas, live metrics & split copilots' },
      { phase: 'Hour 18-24', goal: 'Run 88-test automated CI validation, prepare 180s stage teleprompter & deploy' }
    ],
    judgeEdgeCases: [
      {
        question: 'How does your engine handle network partition or total venue Wi-Fi outage?',
        answer: 'All mutations persist locally via IndexedDB/LocalStorage with deterministic vector clock reconciliation upon reconnect.'
      },
      {
        question: 'Why is this significantly better than existing commercial SaaS tools?',
        answer: 'Zero-cloud egress ensures $0.00 infrastructure spend while client-side Wasm delivers sub-30ms latency vs 600ms cloud roundtrips.'
      },
      {
        question: 'How do you guarantee data privacy for sensitive enterprise workloads?',
        answer: 'Zero user telemetry leaves the device. Quantized heuristic models run 100% on the client CPU via WebAssembly.'
      }
    ],
    juryScoreBreakdown: { innovation: 25, technicalMoat: 25, socialImpact: 24, presentation: 25 },
    recommendedFileTree: [
      'src/modules/core/engine.js',
      'src/modules/crdt/vector_clocks.js',
      'src/components/telemetry/LiveMetricsCanvas.jsx',
      'src/lib/multiKeyFailover.js'
    ]
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-emerald-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-left">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-start justify-between gap-4 bg-slate-950/80">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold uppercase border border-emerald-500/30">
                DEEP ARCHITECTURAL BLUEPRINT &amp; JURY AUDIT
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-mono text-[10px] font-bold border border-sky-500/30">
                Feasibility: {idea.feasibilityScore}/100
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white font-heading">
              {idea.title}
            </h3>
            <p className="text-xs text-emerald-300 italic mt-0.5 font-medium">
              "{idea.tagline}"
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all font-mono text-sm"
          >
            ✕
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-1 border-b border-white/10 bg-slate-950/50 font-mono text-xs overflow-x-auto no-scrollbar">
          {[
            { id: 'architecture', label: '🏗️ System Topology', desc: 'Architecture Flow' },
            { id: 'roadmap', label: '⏱️ 24h Build Protocol', desc: 'Hour 0-24 Plan' },
            { id: 'defense', label: '🛡️ Judge Defense Matrix', desc: 'Q&A Counter-Proof' },
            { id: 'rubric', label: '📊 Jury Scoring (100/100)', desc: 'Rubric Benchmark' },
            { id: 'files', label: '📁 File Tree & Modules', desc: 'Repo Structure' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl transition-all font-semibold flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-200 font-sans">
          
          {/* TAB 1: SYSTEM TOPOLOGY & TECHNICAL MOAT */}
          {activeTab === 'architecture' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-3">
                <div className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <span>⚡ END-TO-END DATA FLOW TOPOLOGY</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/90 font-mono text-xs text-slate-300 border border-white/10 leading-relaxed">
                  {blueprint.systemArchitecture}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                  <div className="text-[11px] font-mono font-bold text-sky-400 uppercase">
                    🌐 Real-World Pain &amp; Friction
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    {idea.realWorldProblem}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                  <div className="text-[11px] font-mono font-bold text-emerald-400 uppercase">
                    🔒 Proprietary Technical Moat
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    {idea.technicalMoat}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2 font-mono">
                <div className="text-[11px] font-bold text-purple-400 uppercase">
                  🎯 Target Personas &amp; Stakeholders
                </div>
                <p className="text-slate-300 text-xs leading-relaxed font-sans">
                  {blueprint.targetPersonas}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: 24H BUILD PROTOCOL */}
          {activeTab === 'roadmap' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-xs font-mono text-slate-300">
                Phase-by-phase chronological engineering execution plan calibrated for national 24h-48h hackathons:
              </div>

              <div className="space-y-3 font-mono">
                {blueprint.buildRoadmap24h?.map((step, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-white/10 flex items-start gap-4">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold shrink-0 border border-emerald-500/30">
                      {step.phase}
                    </span>
                    <div className="text-slate-200 text-xs font-sans leading-relaxed pt-0.5">
                      {step.goal}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: JUDGE DEFENSE MATRIX */}
          {activeTab === 'defense' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-xs font-mono text-slate-300">
                Pre-rehearsed, high-conviction counter-defenses against tough jury curveballs:
              </div>

              <div className="space-y-3 font-sans">
                {blueprint.judgeEdgeCases?.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                    <div className="text-rose-300 font-bold text-xs flex items-start gap-2">
                      <span className="font-mono text-rose-400">❓ JURY OBJECTION #{idx + 1}:</span>
                      <span>{item.question}</span>
                    </div>
                    <div className="text-emerald-300 text-xs pl-4 border-l-2 border-emerald-500/50 leading-relaxed font-mono">
                      <strong className="text-emerald-400 font-bold">✓ COUNTER-DEFENSE: </strong>
                      {item.answer}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: JURY SCORING RUBRIC */}
          {activeTab === 'rubric' && (
            <div className="space-y-4 animate-fadeIn font-mono">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30">
                  <div className="text-[10px] text-slate-400 uppercase">Innovation</div>
                  <div className="text-2xl font-bold text-emerald-400 mt-1">25 / 25</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Novel Moat</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-sky-500/30">
                  <div className="text-[10px] text-slate-400 uppercase">Technical Depth</div>
                  <div className="text-2xl font-bold text-sky-400 mt-1">25 / 25</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Sub-35ms Wasm</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/30">
                  <div className="text-[10px] text-slate-400 uppercase">Social Impact</div>
                  <div className="text-2xl font-bold text-purple-400 mt-1">24 / 25</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Quantified Friction</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30">
                  <div className="text-[10px] text-slate-400 uppercase">Demo Presentation</div>
                  <div className="text-2xl font-bold text-amber-400 mt-1">25 / 25</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">180s Scripted</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                <div className="text-xs font-bold text-white">🏆 Benchmark Summary:</div>
                <p className="text-slate-300 text-xs leading-relaxed font-sans">
                  This project architecture scores in the <strong>Top 1%</strong> of national submissions for ETHGlobal, Smart India Hackathon (SIH), and HackMIT due to its zero-cloud invariant, mathematical latency moats, and offline resilience.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: RECOMMENDED FILE TREE */}
          {activeTab === 'files' && (
            <div className="space-y-3 animate-fadeIn font-mono">
              <div className="text-xs text-slate-300">
                Recommended project directory structure to scaffold for this exact project:
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-white/15 space-y-1.5 text-xs text-emerald-300">
                {blueprint.recommendedFileTree?.map((filePath, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-slate-500">📄</span>
                    <span>{filePath}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-white/10 bg-slate-950/90 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-white/15 text-slate-300 hover:text-white hover:bg-white/5 transition-all"
          >
            ← Back to All Ideas
          </button>

          <button
            type="button"
            onClick={() => {
              if (onLockIdea) onLockIdea(idea);
              onClose();
            }}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg ${
              isLocked
                ? 'bg-emerald-400 text-slate-950 shadow-emerald-400/30'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
            }`}
          >
            <span>👑</span>
            <span>{isLocked ? 'PROBLEM STATEMENT LOCKED AS SQUAD GOAL ✓' : 'LOCK THIS PROBLEM STATEMENT AS SQUAD GOAL ➔'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
