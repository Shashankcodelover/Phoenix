'use client';

import { useState, useEffect } from 'react';
import { hackathonApi } from '@/lib/api';

export default function CrazyFeaturesLab({ room }) {
  const roomId = room?.roomId || 'ROOM-APEX-1001';
  const problemStatement = room?.lockedProblemStatement || 'NexusAudio: Sub-300ms Multimodal Voice Coaching & CRDT Vector IDE';
  const members = room?.members || [];
  const memberCount = members.length;

  const [filter, setFilter] = useState('all');
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState(new Set(room?.selectedFeatures || ['f1', 'f2', 'f3', 'f4', 'f5']));
  const [activeFeatureSpec, setActiveFeatureSpec] = useState(null);

  const fetchFeatures = async () => {
    setLoading(true);
    try {
      const res = await hackathonApi.getCrazyFeatures({
        problemStatement,
        domain: 'AI & Web'
      });
      setFeatures(res.features || []);
    } catch {
      // Clean fallback with deep specs
      const fallbackList = [
        {
          id: 'f1',
          title: 'Sub-300ms WebRTC Voice Mesh',
          type: 'MVP Must-Have',
          category: 'Core Audio',
          description: 'Peer-to-peer low latency voice channel with zero middleman servers.',
          deepSpec: {
            techStack: 'WebRTC DataChannels + Opus Audio Codec (48kHz, mono, 16kbps)',
            latency: '< 25ms P99 peer-to-peer',
            juryImpact: 'Directly proves real-time zero-cloud media transmission without expensive backend egress.',
            codeSnippet: `const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });\nconst stream = await navigator.mediaDevices.getUserMedia({ audio: true });\nstream.getTracks().forEach(t => pc.addTrack(t, stream));`
          }
        },
        {
          id: 'f2',
          title: 'Real-Time Vector Whiteboard',
          type: 'MVP Must-Have',
          category: 'Collaboration',
          description: 'Multi-cursor collaborative drawing canvas for architecture diagrams.',
          deepSpec: {
            techStack: 'HTML5 Canvas + Yjs CRDT Vector Clocks + LocalStorage BroadcastChannel',
            latency: '< 16ms render loop (60 FPS)',
            juryImpact: 'Demonstrates conflict-free distributed state synchronization during live multi-user editing.',
            codeSnippet: `import * as Y from 'yjs';\nconst ydoc = new Y.Doc();\nconst yarray = ydoc.getArray('canvas_vectors');\nyarray.observe(event => renderCanvas(yarray.toArray()));`
          }
        },
        {
          id: 'f3',
          title: 'AI Sentinel Follow-Up Prober',
          type: 'MVP Must-Have',
          category: 'AI Intelligence',
          description: 'Listens to team discussion and generates technical follow-up questions.',
          deepSpec: {
            techStack: 'Gemini 2.5 Flash / Groq 70B + Structured JSON Output Formatting',
            latency: '< 450ms streaming response',
            juryImpact: 'Automates senior architect code review during live hackathon hacking sessions.',
            codeSnippet: `const prompt = "Analyze discussion: " + context + " -> Return 3 tough architectural questions";\nconst res = await callAI(prompt);`
          }
        },
        {
          id: 'f4',
          title: 'Automated 180s Pitch Teleprompter',
          type: 'MVP Must-Have',
          category: 'Pitch & Demo',
          description: 'Stage-ready timed teleprompter scrolling at 135 WPM.',
          deepSpec: {
            techStack: 'Web Speech API + RequestAnimationFrame Smooth Scroll Engine',
            latency: '< 5ms timer tick',
            juryImpact: 'Guarantees the presenter delivers a 100% synchronized pitch with zero awkward pauses.',
            codeSnippet: `const wpm = 135;\nconst scrollSpeed = (totalWords / 180) * pixelsPerWord;`
          }
        },
        {
          id: 'f5',
          title: 'Devpost Markdown Auto-Generator',
          type: 'MVP Must-Have',
          category: 'Submission',
          description: 'Transforms project specs into a ready-to-paste Devpost submission.',
          deepSpec: {
            techStack: 'Markdown Template Compiler + SVG Architecture Badges',
            latency: '< 10ms generation',
            juryImpact: 'Ensures the submission has complete sections: Inspiration, What it does, How we built it, and Challenges.',
            codeSnippet: `const md = \`# \${title}\\n## Inspiration\\n\${problem}\\n## Tech Stack\\n\${stack}\`;`
          }
        },
        {
          id: 'f6',
          title: 'Wasm Acoustic Breath & Jitter Canceler',
          type: 'Crazy / Wow Factor',
          category: 'Audio DSP',
          description: 'Suppresses nervous breathing and background hackathon room noise directly in WebAssembly.',
          deepSpec: {
            techStack: 'WebAssembly SIMD + RNNoise / Speex DSP C++ Core',
            latency: '< 8ms frame processing',
            juryImpact: 'Jury will be blown away by studio-quality audio in noisy hackathon halls without cloud roundtrips.',
            codeSnippet: `// In-browser WebAssembly DSP Audio Worklet\nclass NoiseCancelerNode extends AudioWorkletNode { ... }`
          }
        },
        {
          id: 'f7',
          title: 'Spontaneous Judge Objection Injector',
          type: 'Crazy / Wow Factor',
          category: 'AI Simulator',
          description: 'Simulates tough judge curveballs midway through your rehearsal.',
          deepSpec: {
            techStack: 'Multi-Agent Persona Orchestrator (Staff Architect, VC, Security Lead)',
            latency: '< 200ms injection',
            juryImpact: 'Prepares the squad for the hardest possible questions during stage Q&A.',
            codeSnippet: `const objection = pickObjection(['Scalability bottleneck', 'Wi-Fi blackout', 'Unit economics']);`
          }
        },
        {
          id: 'f8',
          title: '17,640x SQL Covering Index Synthesizer',
          type: 'Crazy / Wow Factor',
          category: 'Database',
          description: 'Parses raw SQL queries and auto-generates composite covering indexes.',
          deepSpec: {
            techStack: 'AST SQL Query Parser + B-Tree Leaf Node Covering Analyzer',
            latency: '< 1.4ms lookup speedup',
            juryImpact: 'Quantifiable 17,640x performance improvement proven in live automated benchmarks.',
            codeSnippet: `CREATE INDEX idx_covering ON table_name (status, created_at) INCLUDE (id, email);`
          }
        },
        {
          id: 'f9',
          title: 'Discord-Style Split-Channel AI Senior Copilots',
          type: 'Crazy / Wow Factor',
          category: 'Team OS',
          description: 'Private AI mentor channels tailored specifically for Frontend, Backend, and Pitch leads.',
          deepSpec: {
            techStack: 'Role-Conditioned Persona System Prompts + Isolated Channel Buffers',
            latency: '< 50ms local response',
            juryImpact: 'Demonstrates specialized multi-agent workflow division across all team members.',
            codeSnippet: `const coach = role === 'Pitch Lead' ? pitchCopilot : frontendCopilot;`
          }
        },
        {
          id: 'f10',
          title: 'Offline-First LocalStorage Emergency Cache Sync',
          type: 'Crazy / Wow Factor',
          category: 'Resilience',
          description: 'Guarantees the entire demo works even if venue Wi-Fi goes down.',
          deepSpec: {
            techStack: 'IndexedDB / LocalStorage + Merkle-Tree Conflict Resolver',
            latency: '< 2ms local read/write',
            juryImpact: 'Proves 100% demo resilience during disastrous venue connectivity blackouts.',
            codeSnippet: `window.addEventListener('offline', () => enableLocalMutationQueue());`
          }
        }
      ];
      setFeatures(fallbackList);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, [problemStatement]);

  const toggleFeature = (id) => {
    setSelectedFeatures(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredFeatures = filter === 'all' 
    ? features 
    : features.filter(f => f.type === filter);

  const handleExportBlueprint = () => {
    const selectedList = features.filter(f => selectedFeatures.has(f.id));
    const payload = {
      roomId,
      problemStatement,
      activeSquadSize: memberCount,
      squadMembers: members.map(m => ({ name: m.name, role: m.role })),
      totalFeaturesSelected: selectedList.length,
      exportDate: new Date().toISOString(),
      features: selectedList
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Room_${roomId}_Features_Blueprint.json`;
    a.click();
  };

  return (
    <div className="w-full rounded-3xl bg-theme-card border border-emerald-500/25 p-5 sm:p-7 shadow-xl shadow-black/30 text-left space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-theme-glass">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/35 flex items-center justify-center text-2xl shrink-0">
            🚀
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                STEP 5: CRAZY FEATURE LAB
              </span>
              <span className="text-xs text-theme-muted font-mono">
                Room: {roomId} ({memberCount} Member{memberCount > 1 ? 's' : ''})
              </span>
            </div>
            <h3 className="text-xl font-bold text-theme-main font-heading">
              Must-Have vs. Craziest "Wow Factor" Features for "{problemStatement}"
            </h3>
            <p className="text-xs text-theme-muted leading-relaxed mt-0.5 font-medium">
              Select the features your squad will build in Room {roomId}. Click any feature's <strong>"🔍 Deep Spec"</strong> to see implementation pseudo-code, latency trade-offs, and jury scoring impact.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExportBlueprint}
          className="px-4 py-2.5 rounded-xl text-xs font-mono font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 shrink-0"
        >
          <span>📦</span> Export Room Blueprint ({selectedFeatures.size} Selected)
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-xl border transition-all ${
            filter === 'all'
              ? 'bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 border-emerald-500 font-bold'
              : 'bg-slate-100 dark:bg-slate-950 border-theme-glass text-theme-muted hover:text-theme-main'
          }`}
        >
          ✨ All Features ({features.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('MVP Must-Have')}
          className={`px-3 py-1.5 rounded-xl border transition-all ${
            filter === 'MVP Must-Have'
              ? 'bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 border-emerald-500 font-bold'
              : 'bg-slate-100 dark:bg-slate-950 border-theme-glass text-theme-muted hover:text-theme-main'
          }`}
        >
          🟢 Core MVP Must-Have
        </button>
        <button
          type="button"
          onClick={() => setFilter('Crazy / Wow Factor')}
          className={`px-3 py-1.5 rounded-xl border transition-all ${
            filter === 'Crazy / Wow Factor'
              ? 'bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 border-emerald-500 font-bold'
              : 'bg-slate-100 dark:bg-slate-950 border-theme-glass text-theme-muted hover:text-theme-main'
          }`}
        >
          🚀 Crazy "Wow Factor"
        </button>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 font-mono text-xs">
        {filteredFeatures.map((feat) => {
          const isChecked = selectedFeatures.has(feat.id);

          return (
            <div
              key={feat.id}
              className={`p-4 rounded-2xl border transition-all text-left space-y-2 shadow-sm ${
                isChecked
                  ? 'bg-emerald-950/25 dark:bg-emerald-950/40 border-emerald-500/60 shadow-md shadow-emerald-500/10'
                  : 'bg-slate-100/80 dark:bg-slate-950/70 border-theme-glass hover:border-emerald-500/30'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleFeature(feat.id)}
                    className="mt-0.5 rounded bg-slate-200 dark:bg-slate-900 border-theme-glass text-emerald-500 focus:ring-0 cursor-pointer"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="font-bold text-theme-main text-xs truncate font-sans">
                        {feat.title}
                      </span>
                    </div>
                    <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">
                      Category: {feat.category}
                    </div>
                  </div>
                </div>

                <span className={`text-[9px] px-2 py-0.5 rounded border font-bold uppercase shrink-0 ${
                  feat.type === 'MVP Must-Have'
                    ? 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30'
                    : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                }`}>
                  {feat.type}
                </span>
              </div>

              <p className="text-theme-muted text-xs font-sans leading-relaxed pl-6 font-medium">
                {feat.description}
              </p>

              {/* Action: View Deep Feature Spec */}
              <div className="flex items-center justify-between pt-2 border-t border-theme-glass pl-6 text-[10px]">
                <button
                  type="button"
                  onClick={() => setActiveFeatureSpec(feat)}
                  className="text-sky-600 dark:text-sky-400 hover:underline font-bold flex items-center gap-1"
                >
                  <span>🔍</span> View Implementation Spec &amp; Code
                </button>
                <button
                  type="button"
                  onClick={() => toggleFeature(feat.id)}
                  className={`font-bold ${isChecked ? 'text-emerald-600 dark:text-emerald-400' : 'text-theme-subtle'}`}
                >
                  {isChecked ? '✓ Selected for Room' : '+ Add to Squad'}
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Feature Deep Spec Modal */}
      {activeFeatureSpec && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-4 text-left font-sans">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {activeFeatureSpec.category} • {activeFeatureSpec.type}
                </span>
                <h3 className="text-xl font-bold text-white mt-1 font-heading">
                  {activeFeatureSpec.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveFeatureSpec(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center font-mono"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-white/10 font-mono text-slate-300 space-y-1">
                <div className="text-[10px] text-emerald-400 font-bold uppercase">⚡ Technical Stack &amp; Latency:</div>
                <div>{activeFeatureSpec.deepSpec?.techStack || 'WebAssembly + CRDT Vector Clocks'}</div>
                <div className="text-sky-300 font-bold mt-1">Latency Target: {activeFeatureSpec.deepSpec?.latency || '< 30ms P99'}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-white/10 text-slate-300 space-y-1">
                <div className="text-[10px] text-amber-400 font-bold font-mono uppercase">🏆 Jury Scoring &amp; Competitive Moat:</div>
                <p className="leading-relaxed">{activeFeatureSpec.deepSpec?.juryImpact || 'Delivers undeniable live technical depth during 3-minute stage demo.'}</p>
              </div>

              {activeFeatureSpec.deepSpec?.codeSnippet && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-1.5">
                  <div className="text-[10px] text-emerald-400 font-bold font-mono uppercase">💻 Implementation Blueprint / Pseudo-Code:</div>
                  <pre className="p-3 rounded-lg bg-slate-900 font-mono text-[11px] text-emerald-300 overflow-x-auto border border-white/10">
                    {activeFeatureSpec.deepSpec.codeSnippet}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  toggleFeature(activeFeatureSpec.id);
                  setActiveFeatureSpec(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-xs transition-all shadow-md"
              >
                {selectedFeatures.has(activeFeatureSpec.id) ? '✓ Already in Blueprint' : '+ Select Feature for Squad'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
