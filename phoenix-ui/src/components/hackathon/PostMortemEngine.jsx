'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ---------------------------------------------------------------------------
// Data helpers
// ---------------------------------------------------------------------------
const DEFAULT_TIME_PHASES = [
  { id: 'ideation', label: 'Ideation & Planning', hours: 4, color: 'bg-violet-500', emoji: '💡' },
  { id: 'design', label: 'UI/UX Design', hours: 3, color: 'bg-pink-500', emoji: '🎨' },
  { id: 'frontend', label: 'Frontend Build', hours: 8, color: 'bg-sky-500', emoji: '🖥️' },
  { id: 'backend', label: 'Backend & APIs', hours: 10, color: 'bg-amber-500', emoji: '⚙️' },
  { id: 'ai', label: 'AI/ML Integration', hours: 6, color: 'bg-emerald-500', emoji: '🧠' },
  { id: 'testing', label: 'Testing & QA', hours: 2, color: 'bg-red-500', emoji: '🔍' },
  { id: 'presentation', label: 'Demo & Pitch Prep', hours: 3, color: 'bg-orange-500', emoji: '🎤' },
];

const DEFAULT_FEATURES = [
  { id: 1, name: 'Core Algorithm / Engine', planned: true, shipped: true, quality: 90 },
  { id: 2, name: 'User Authentication', planned: true, shipped: true, quality: 80 },
  { id: 3, name: 'Real-time Dashboard', planned: true, shipped: true, quality: 75 },
  { id: 4, name: 'AI Recommendation Engine', planned: true, shipped: false, quality: 0 },
  { id: 5, name: 'Mobile Responsiveness', planned: true, shipped: true, quality: 85 },
  { id: 6, name: 'Data Export / Reports', planned: false, shipped: true, quality: 60 },
];

const DEFAULT_TEAM_SCORES = [
  { id: 'collab', label: 'Team Collaboration', score: 8 },
  { id: 'comm', label: 'Communication', score: 7 },
  { id: 'tech', label: 'Technical Depth', score: 9 },
  { id: 'time', label: 'Time Management', score: 6 },
  { id: 'pres', label: 'Presentation Quality', score: 8 },
  { id: 'innov', label: 'Innovation', score: 9 },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
function ScoreBar({ value, max = 10, color = 'bg-emerald-500' }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </div>
      <span className="text-xs font-mono font-bold text-theme-main w-8 text-right">{value}/{max}</span>
    </div>
  );
}

function HoursBar({ hours, maxHours, color }) {
  const pct = Math.round((hours / maxHours) * 100);
  return (
    <div className="flex-1 h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export default function PostMortemEngine({ onNext, onBack }) {
  // Time allocation editable state
  const [phases, setPhases] = useState(DEFAULT_TIME_PHASES);

  // Feature completion state
  const [features, setFeatures] = useState(DEFAULT_FEATURES);

  // Team performance scores
  const [teamScores, setTeamScores] = useState(DEFAULT_TEAM_SCORES);

  // Retrospective notes (3-column)
  const [retro, setRetro] = useState({
    www: '',   // What Went Well
    di: '',    // Delta / Improvements
    ai: '',    // Action Items
  });

  // Overall hackathon score (1-10)
  const [overallScore, setOverallScore] = useState(8);

  const [exported, setExported] = useState(false);

  const totalHours = phases.reduce((s, p) => s + p.hours, 0);
  const maxHours = Math.max(...phases.map((p) => p.hours));
  const shippedFeatures = features.filter((f) => f.shipped).length;
  const plannedShipped = features.filter((f) => f.planned && f.shipped).length;
  const plannedTotal = features.filter((f) => f.planned).length;
  const avgQuality = Math.round(
    features.filter((f) => f.shipped).reduce((s, f) => s + f.quality, 0) /
      Math.max(shippedFeatures, 1)
  );
  const avgTeamScore = (
    teamScores.reduce((s, t) => s + t.score, 0) / teamScores.length
  ).toFixed(1);

  const updatePhaseHours = (id, val) =>
    setPhases((prev) =>
      prev.map((p) => (p.id === id ? { ...p, hours: Math.max(0, Number(val)) } : p))
    );

  const toggleFeatureShipped = (id) =>
    setFeatures((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, shipped: !f.shipped, quality: !f.shipped ? 75 : 0 } : f
      )
    );

  const updateFeatureQuality = (id, val) =>
    setFeatures((prev) =>
      prev.map((f) => (f.id === id ? { ...f, quality: Math.min(100, Math.max(0, Number(val))) } : f))
    );

  const updateTeamScore = (id, val) =>
    setTeamScores((prev) =>
      prev.map((t) => (t.id === id ? { ...t, score: Math.min(10, Math.max(1, Number(val))) } : t))
    );

  const handleExport = useCallback(() => {
    const summary = {
      exportedAt: new Date().toISOString(),
      overallScore,
      timeAllocation: phases.map((p) => ({ phase: p.label, hours: p.hours, percent: `${Math.round((p.hours / totalHours) * 100)}%` })),
      featureVelocity: { planned: plannedTotal, shipped: plannedShipped, bonus: features.filter((f) => !f.planned && f.shipped).length, avgQualityPct: avgQuality },
      teamScores: teamScores.map((t) => ({ metric: t.label, score: `${t.score}/10` })),
      avgTeamScore,
      retrospective: { whatWentWell: retro.www, improvements: retro.di, actionItems: retro.ai },
    };
    const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hackathon-postmortem-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  }, [phases, features, teamScores, retro, overallScore, totalHours, plannedTotal, plannedShipped, avgQuality, avgTeamScore]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="w-full rounded-3xl bg-theme-card border border-emerald-500/30 p-5 sm:p-7 shadow-xl shadow-black/30 text-left space-y-6">
        <div className="flex items-start gap-3.5 pb-4 border-b border-theme-glass">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl shrink-0">🔬</div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">STEP 13: POST-MORTEM</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-500/20 text-slate-500 dark:text-slate-400">
                {totalHours}h tracked · {shippedFeatures} features shipped
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-theme-main font-heading">Hackathon Post-Mortem Analytics &amp; Retrospective</h3>
            <p className="text-xs text-theme-muted leading-relaxed mt-0.5 font-medium">
              Analyze time allocation, feature velocity, team performance, and document lessons learned. Export a structured JSON report.
            </p>
          </div>
        </div>

        {/* Overall Score Selector */}
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-xs font-mono font-bold text-theme-muted uppercase tracking-wider">Overall Hackathon Score:</span>
          <div className="flex gap-1.5">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <motion.button
                key={n}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setOverallScore(n)}
                className={`w-8 h-8 rounded-lg font-mono text-xs font-bold transition-all ${
                  overallScore >= n
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-theme-muted hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {n}
              </motion.button>
            ))}
          </div>
          <span className="text-lg font-bold text-emerald-500 font-mono">{overallScore}/10</span>
        </div>

        {/* === SECTION 1: Time Allocation === */}
        <div>
          <h4 className="text-sm font-bold text-theme-main font-heading mb-3 flex items-center gap-2">
            <span className="text-base">⏱️</span> Time Allocation Breakdown
            <span className="ml-auto text-xs font-mono text-theme-muted">{totalHours}h total</span>
          </h4>
          <div className="space-y-2.5">
            {phases.map((phase, i) => (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3"
              >
                <span className="text-base w-5 shrink-0">{phase.emoji}</span>
                <span className="text-xs font-medium text-theme-muted w-36 shrink-0">{phase.label}</span>
                <HoursBar hours={phase.hours} maxHours={maxHours} color={phase.color} />
                <div className="flex items-center gap-1 shrink-0">
                  <input
                    type="number"
                    min="0"
                    max="48"
                    value={phase.hours}
                    onChange={(e) => updatePhaseHours(phase.id, e.target.value)}
                    className="w-10 text-center text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 border border-theme-glass rounded-lg px-1 py-0.5 text-theme-main focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                  <span className="text-xs text-theme-muted">h</span>
                  <span className="text-xs font-mono text-theme-muted w-8 text-right">
                    {totalHours > 0 ? Math.round((phase.hours / totalHours) * 100) : 0}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* === SECTION 2: Feature Velocity === */}
        <div>
          <h4 className="text-sm font-bold text-theme-main font-heading mb-3 flex items-center gap-2">
            <span className="text-base">🚀</span> Feature Completion Velocity
            <span className="ml-auto text-xs font-mono text-emerald-500 font-bold">
              {plannedShipped}/{plannedTotal} planned · Avg quality {avgQuality}%
            </span>
          </h4>
          <div className="overflow-x-auto rounded-2xl border border-theme-glass">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-theme-glass bg-slate-50 dark:bg-slate-900/50">
                  <th className="text-left px-3 py-2 font-mono text-theme-muted">Feature</th>
                  <th className="px-3 py-2 font-mono text-theme-muted">Planned</th>
                  <th className="px-3 py-2 font-mono text-theme-muted">Shipped</th>
                  <th className="px-3 py-2 font-mono text-theme-muted">Quality %</th>
                </tr>
              </thead>
              <tbody>
                {features.map((f, i) => (
                  <motion.tr
                    key={f.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    className="border-b border-theme-glass last:border-0 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors"
                  >
                    <td className="px-3 py-2 font-medium text-theme-main">{f.name}</td>
                    <td className="px-3 py-2 text-center">
                      <span className={`px-1.5 py-0.5 rounded font-mono ${f.planned ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400' : 'bg-slate-500/15 text-slate-500'}`}>
                        {f.planned ? 'Yes' : 'Bonus'}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button
                        onClick={() => toggleFeatureShipped(f.id)}
                        className={`px-2 py-0.5 rounded font-mono font-bold transition-all ${f.shipped ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/30' : 'bg-red-500/15 text-red-500 hover:bg-red-500/25'}`}
                      >
                        {f.shipped ? '✓ Done' : '✗ Cut'}
                      </button>
                    </td>
                    <td className="px-3 py-2 text-center">
                      {f.shipped ? (
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={f.quality}
                          onChange={(e) => updateFeatureQuality(f.id, e.target.value)}
                          className="w-14 text-center text-xs font-mono bg-slate-100 dark:bg-slate-800 border border-theme-glass rounded px-1 py-0.5 text-theme-main outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      ) : (
                        <span className="text-theme-muted">—</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* === SECTION 3: Team Performance === */}
        <div>
          <h4 className="text-sm font-bold text-theme-main font-heading mb-3 flex items-center gap-2">
            <span className="text-base">👥</span> Team Performance Ratings
            <span className="ml-auto text-xs font-mono text-amber-500 font-bold">avg {avgTeamScore}/10</span>
          </h4>
          <div className="grid sm:grid-cols-2 gap-3">
            {teamScores.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.06 }}
                className="space-y-1"
              >
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-theme-muted">{t.label}</span>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={t.score}
                    onChange={(e) => updateTeamScore(t.id, e.target.value)}
                    className="w-10 text-center text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 border border-theme-glass rounded px-1 text-theme-main outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <ScoreBar
                  value={t.score}
                  color={t.score >= 8 ? 'bg-emerald-500' : t.score >= 5 ? 'bg-amber-500' : 'bg-red-500'}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* === SECTION 4: Retrospective Notes === */}
        <div>
          <h4 className="text-sm font-bold text-theme-main font-heading mb-3 flex items-center gap-2">
            <span className="text-base">📝</span> Retrospective Notes
          </h4>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { key: 'www', label: '✅ What Went Well', placeholder: 'Strong ideation, fast MVP turnaround, solid team synergy...', border: 'border-emerald-500/30', badge: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' },
              { key: 'di', label: '🔁 Delta / Improvements', placeholder: 'Time management on backend, earlier testing, clearer role assignments...', border: 'border-amber-500/30', badge: 'bg-amber-500/15 text-amber-600 dark:text-amber-400' },
              { key: 'ai', label: '🎯 Action Items', placeholder: '1. Set hard deadlines per feature\n2. Prototype before building\n3. Practice pitch twice minimum...', border: 'border-sky-500/30', badge: 'bg-sky-500/15 text-sky-600 dark:text-sky-400' },
            ].map((col, i) => (
              <motion.div
                key={col.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.07 }}
                className={`rounded-2xl border ${col.border} bg-theme-card p-3 space-y-2`}
              >
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${col.badge}`}>
                  {col.label}
                </span>
                <textarea
                  value={retro[col.key]}
                  onChange={(e) => setRetro((prev) => ({ ...prev, [col.key]: e.target.value }))}
                  placeholder={col.placeholder}
                  rows={5}
                  className="w-full bg-transparent text-xs text-theme-muted font-medium resize-none outline-none placeholder:text-theme-muted/50 leading-relaxed"
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Export Button */}
        <div className="flex justify-center pt-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleExport}
            className="px-6 py-2.5 rounded-xl font-mono font-bold text-xs bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 transition-all flex items-center gap-2 shadow-lg shadow-black/20"
          >
            <span>📦</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={exported ? 'done' : 'export'}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
              >
                {exported ? '✓ Exported!' : 'Export Post-Mortem Report (JSON)'}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-xl font-mono text-xs text-theme-subtle hover:text-theme-main transition-colors"
        >
          ← Back to Submission Packager
        </button>
        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
          className="px-6 py-3 rounded-xl font-mono font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
        >
          <span>NEXT: EXPLORE 22 PRODUCTION ENGINES &amp; MULTI-MODEL MATRIX</span>
          <span>➔</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
