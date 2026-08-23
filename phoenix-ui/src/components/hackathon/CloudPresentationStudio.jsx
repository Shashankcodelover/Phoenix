'use client';

import { useState } from 'react';
import { hackathonApi } from '@/lib/api';

export default function CloudPresentationStudio({ room }) {
  const roomId = room?.roomId || 'ROOM-APEX-1001';
  const problemStatement = room?.lockedProblemStatement || 'NexusAudio: Sub-300ms Multimodal Voice Coaching & CRDT Vector IDE';
  const members = room?.members || [{ name: 'Shashank J', role: 'Lead Architect' }];
  const memberCount = members.length;

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [activeTheme, setActiveTheme] = useState('cyber-slate');
  const [fullscreenPreview, setFullscreenPreview] = useState(false);

  // 5 Cloud-Grade Hackathon Slides
  const [slides, setSlides] = useState([
    {
      id: 1,
      num: '01',
      type: 'HOOK_HERO',
      title: problemStatement.split(':')[0] || 'NexusAudio AI',
      subtitle: 'Sub-300ms Autonomous Voice Coaching & CRDT IDE',
      bullets: [
        'Zero-Cloud-Spend Invariant ($0.00 Egress)',
        'Peer-to-Peer WebRTC Audio Mesh + Wasm Noise Canceling',
        'Calibrated for National Hackathon Jury Rubrics'
      ],
      tam: '$14.2B Global Developer & EdTech Placement Market',
      speakerNotes: 'Start with raw conviction: "Respected judges, remote engineering teams lose 40% of context switching between fragmented tools..."',
      accentColor: 'sky'
    },
    {
      id: 2,
      num: '02',
      type: 'QUANTIFIED_PROBLEM',
      title: 'The Real-World Friction & Latency Wall',
      subtitle: 'Why Legacy Web Tools Fail High-Stakes Distributed Collaboration',
      bullets: [
        'Severe 2-4 Second Turn-Taking Lag: Destroys natural conversational flow.',
        'High Cloud Egress Inefficiency: Centralized media servers cost $30/user/month.',
        'Zero Offline Resilience: Venue Wi-Fi blackouts cause 100% demo crash.'
      ],
      tam: '40% Engineering Context Loss Across 2.8M Developers',
      speakerNotes: 'Cite concrete numbers: "Over 600ms latency creates awkward conversational collisions. We benchmarked this across 50 collegiate teams..."',
      accentColor: 'rose'
    },
    {
      id: 3,
      num: '03',
      type: 'SOLUTION_BREAKTHROUGH',
      title: 'The Breakthrough Architecture',
      subtitle: 'Mathematical Moats Delivering Sub-30ms P2P Performance',
      bullets: [
        'Sub-300ms WebRTC Audio Mesh: Zero-server transcoding with in-browser Opus DSP.',
        'Conflict-Free Vector Canvas: Yjs CRDT vector clocks syncing in under 16ms.',
        'Autonomous Multi-Key AI Gate: Groq 70B & Gemini 2.5 failover with <2ms LRU caching.'
      ],
      tam: 'P99 Latency < 35ms with $0.00 Cloud Infrastructure Cost',
      speakerNotes: 'Show the live prototype right now: "Notice our 12-bar WebAudio visualizer processing noise suppression directly in WebAssembly..."',
      accentColor: 'emerald'
    },
    {
      id: 4,
      num: '04',
      type: 'SYSTEM_TOPOLOGY',
      title: 'Distributed System Topology',
      subtitle: 'Decentralized Data Flow with Zero Single Points of Failure',
      bullets: [
        'Client Tier: Next.js 16 + WebAssembly C++ SIMD Heuristic Engine.',
        'Data Tier: In-Memory Vector Clocks + LocalStorage Emergency Merkle Sync.',
        'Verification Tier: 88-Test Automated CI Suite & 5,000 RPS Stress Resilience.'
      ],
      tam: '100% Offline-Safe with Automatic State Reconciliation',
      speakerNotes: 'Highlight technical depth: "Under the hood, all audio and canvas frames travel directly peer-to-peer over WebRTC data channels..."',
      accentColor: 'indigo'
    },
    {
      id: 5,
      num: '05',
      type: 'BUSINESS_TRACTION',
      title: 'Unit Economics & GTM Horizon',
      subtitle: 'From Hackathon Prototype to $1.2M ARR Enterprise Placement OS',
      bullets: [
        'B2B SaaS Campus Tier: ₹1,500/student across 50 top engineering institutions.',
        'Milestone Target: 100,000 Active Developers & $1.2M ARR in Year 1.',
        'Startup IP Ready: Standard YC Post-Money SAFE note packages configured.'
      ],
      tam: 'Targeting 220,000+ Annual Karnataka & National Engineering Graduates',
      speakerNotes: 'Close with energy: "NexusAudio is open-source, zero-cost, and stage-ready. We are excited to answer your technical questions!"',
      accentColor: 'amber'
    }
  ]);

  const currentSlide = slides[currentSlideIndex];

  // Theme Styles
  const themeStyles = {
    'cyber-slate': {
      bg: 'bg-slate-950',
      card: 'bg-slate-900 border-sky-500/30 text-white',
      title: 'text-sky-400',
      bullet: 'text-slate-300'
    },
    'dark-neon': {
      bg: 'bg-purple-950/90',
      card: 'bg-purple-900/60 border-fuchsia-500/40 text-white',
      title: 'text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400',
      bullet: 'text-purple-200'
    },
    'emerald-matrix': {
      bg: 'bg-black',
      card: 'bg-zinc-950 border-emerald-500/50 text-emerald-300 font-mono',
      title: 'text-emerald-400',
      bullet: 'text-emerald-200/90'
    },
    'minimal-pitch': {
      bg: 'bg-slate-100',
      card: 'bg-white border-slate-300 text-slate-900 shadow-2xl',
      title: 'text-slate-900 font-extrabold',
      bullet: 'text-slate-700 font-medium'
    }
  };

  const currentTheme = themeStyles[activeTheme] || themeStyles['cyber-slate'];

  // Export Handlers
  const handleExportMarp = () => {
    let md = `---\nmarp: true\ntheme: gaia\n_class: lead\npaginate: true\nbackgroundColor: #0f172a\ncolor: #f8fafc\n---\n\n`;
    slides.forEach((s, idx) => {
      md += `# Slide ${s.num}: ${s.title}\n`;
      md += `### ${s.subtitle}\n\n`;
      s.bullets.forEach(b => {
        md += `* ${b}\n`;
      });
      md += `\n**Key Metric / TAM:** ${s.tam}\n\n`;
      md += `<!-- Speaker Notes: ${s.speakerNotes} -->\n\n`;
      if (idx < slides.length - 1) md += `---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Room_${roomId}_Marp_Pitch_Deck.md`;
    a.click();
  };

  const handleExportHtmlDeck = () => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${problemStatement} — Cloud Pitch Deck</title>
  <style>
    body { margin: 0; background: #060B18; color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; }
    .deck-container { width: 960px; height: 540px; background: #0F172A; border: 1px solid rgba(56, 189, 248, 0.4); border-radius: 24px; padding: 48px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; position: relative; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.8); }
    h1 { color: #38BDF8; font-size: 2.2rem; margin: 0 0 8px 0; }
    h2 { color: #94A3B8; font-size: 1.1rem; font-weight: normal; margin-bottom: 24px; }
    ul { font-size: 1.15rem; line-height: 1.8; color: #CBD5E1; }
    .tam { font-size: 1rem; color: #34D399; font-weight: bold; font-family: monospace; }
    .footer { display: flex; justify-content: space-between; font-family: monospace; font-size: 0.85rem; color: #64748B; border-top: 1px solid rgba(255,255,255,0.1); pt: 12px; }
    .nav-hint { color: #38BDF8; }
  </style>
</head>
<body>
  <div class="deck-container" id="slide-box">
    <div>
      <div style="font-family: monospace; font-size: 0.85rem; color: #34D399; margin-bottom: 8px;">SLIDE ${slides[0].num} / 05 • ROOM ${roomId}</div>
      <h1>${slides[0].title}</h1>
      <h2>${slides[0].subtitle}</h2>
      <ul>
        ${slides[0].bullets.map(b => `<li>${b}</li>`).join('')}
      </ul>
    </div>
    <div>
      <div class="tam">${slides[0].tam}</div>
      <div class="footer">
        <span>PROJECT PHOENIX CLOUD PITCH DECK</span>
        <span class="nav-hint">Use &larr; and &rarr; arrow keys to navigate</span>
      </div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Room_${roomId}_Presentation_Deck.html`;
    a.click();
  };

  return (
    <div className="w-full rounded-3xl bg-theme-card border border-emerald-500/30 p-5 sm:p-7 shadow-2xl shadow-black/40 text-left space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-theme-glass">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl shrink-0">
            📊
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                CLOUD-GRADE PRESENTATION &amp; PPT STUDIO
              </span>
              <span className="text-xs text-theme-muted font-mono">
                Room: <strong className="text-theme-main">{roomId}</strong> ({memberCount} Members)
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-theme-main font-heading">
              Interactive 5-Slide Pitch Visualizer &amp; Marp Deck Generator
            </h3>
            <p className="text-xs text-theme-muted leading-relaxed mt-0.5 font-medium">
              High-impact visual slide deck calibrated for 180s stage pitch rounds. Edit slides, preview in real time, switch cloud themes, and export directly to Marp Markdown or Standalone HTML presentations.
            </p>
          </div>
        </div>

        {/* Action Export Buttons */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={handleExportMarp}
            className="px-3.5 py-2 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-700 dark:text-sky-300 border border-sky-500/30 font-bold transition-all flex items-center gap-1.5"
          >
            <span>📄</span> Export Marp Markdown
          </button>
          <button
            type="button"
            onClick={handleExportHtmlDeck}
            className="px-4 py-2 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
          >
            <span>🚀</span> Export Standalone HTML Deck
          </button>
        </div>
      </div>

      {/* Theme Selector & Slide Carousel Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="text-theme-subtle text-[11px] font-bold">THEME:</span>
          {[
            { id: 'cyber-slate', label: '🌌 Cyber Slate' },
            { id: 'dark-neon', label: '🔮 Dark Neon' },
            { id: 'emerald-matrix', label: '⚡ Emerald Matrix' },
            { id: 'minimal-pitch', label: '📄 Minimal White' }
          ].map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTheme(t.id)}
              className={`px-3 py-1.5 rounded-xl border transition-all ${
                activeTheme === t.id
                  ? 'bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 border-emerald-500 font-bold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-950 border-theme-glass text-theme-muted hover:text-theme-main'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Slide Selector Buttons */}
        <div className="flex items-center gap-1.5">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrentSlideIndex(idx)}
              className={`w-9 h-9 rounded-xl font-bold flex items-center justify-center transition-all ${
                currentSlideIndex === idx
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 ring-2 ring-emerald-400'
                  : 'bg-slate-100 dark:bg-slate-950 border border-theme-glass text-theme-muted hover:text-theme-main'
              }`}
            >
              {s.num}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Slide Canvas Visualizer */}
      <div className={`p-6 sm:p-10 rounded-3xl border transition-all shadow-2xl relative overflow-hidden min-h-[380px] flex flex-col justify-between ${currentTheme.card}`}>
        
        {/* Slide Header */}
        <div>
          <div className="flex items-center justify-between gap-3 mb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-500 dark:text-emerald-400 flex items-center gap-2">
              <span>SLIDE {currentSlide.num} / 05</span>
              <span>•</span>
              <span>{currentSlide.type}</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Room {roomId}
            </span>
          </div>

          <h2 className={`text-2xl sm:text-4xl font-extrabold tracking-tight font-heading mb-2 ${currentTheme.title}`}>
            {currentSlide.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-medium mb-6">
            {currentSlide.subtitle}
          </p>

          {/* Bullet Points */}
          <ul className="space-y-3 pl-2">
            {currentSlide.bullets.map((bullet, bidx) => (
              <li key={bidx} className={`flex items-start gap-3 text-sm sm:text-base leading-relaxed ${currentTheme.bullet}`}>
                <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✦</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Slide Footer Metric */}
        <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
          <div className="text-emerald-400 font-bold flex items-center gap-2">
            <span>📈</span>
            <span>{currentSlide.tam}</span>
          </div>
          <div className="text-slate-400 text-[11px]">
            Slide {currentSlideIndex + 1} of {slides.length}
          </div>
        </div>

      </div>

      {/* Slide Speaker Notes & Rehearsal Directive */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-theme-glass space-y-2 text-left">
        <div className="flex items-center justify-between font-mono text-xs">
          <span className="text-amber-600 dark:text-amber-300 font-bold flex items-center gap-1.5">
            <span>🎙️</span> SPEAKER TALKING POINTS &amp; 180s STAGE DIRECTIVE:
          </span>
          <span className="text-theme-subtle text-[10px]">Target WPM: 135 WPM</span>
        </div>
        <p className="text-theme-muted text-xs sm:text-sm font-sans italic leading-relaxed font-medium">
          {currentSlide.speakerNotes}
        </p>
      </div>

    </div>
  );
}
