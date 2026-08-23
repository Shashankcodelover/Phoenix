'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import ProfileBanner from '@/components/ProfileBanner';
import CategoryNav from '@/components/CategoryNav';
import FeatureCard from '@/components/FeatureCard';
import { horizonApi } from '@/lib/api';

export default function ModularHorizonVaultPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  // Categories Definition
  const categories = [
    { id: 'rank', icon: '🎓', title: 'Karnataka Rank Matrix & Estimator', count: 4 },
    { id: 'colleges', icon: '🏛️', title: 'College Cutoff Trends & Probability', count: 5 },
    { id: 'quota', icon: '📋', title: 'Category Quotas & Article 371(J)', count: 4 },
    { id: 'fees', icon: '💰', title: 'Management Fees & Scholarships', count: 4 },
    { id: 'academic', icon: '📐', title: 'VTU CGPA & Diploma Bridges', count: 4 }
  ];

  // 1. Karnataka Matrix State
  const [candidateRank, setCandidateRank] = useState(1850);
  const [categoryQuota, setCategoryQuota] = useState('2A');
  const [preferredBranch, setPreferredBranch] = useState('Computer Science');
  const [matrixResult, setMatrixResult] = useState(null);
  const [loadingMatrix, setLoadingMatrix] = useState(false);

  // 2. VTU CGPA Converter State
  const [cgpa, setCgpa] = useState(8.75);
  const [scheme, setScheme] = useState('2022 Scheme');
  const [vtuResult, setVtuResult] = useState(null);

  // Handlers
  const handleForecastMatrix = async () => {
    setLoadingMatrix(true);
    try {
      const res = await horizonApi.forecastKarnatakaMatrix({
        kcetRank: Number(candidateRank),
        categoryQuota,
        preferredBranch
      });
      setMatrixResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMatrix(false);
    }
  };

  const handleConvertVtu = () => {
    // Official VTU Formula: Percentage = (CGPA - 0.75) * 10
    const calculatedPercentage = ((Number(cgpa) - 0.75) * 10).toFixed(2);
    let classDivision = 'First Class with Distinction (FCD)';
    if (calculatedPercentage < 70) classDivision = 'First Class (FC)';
    if (calculatedPercentage < 60) classDivision = 'Second Class (SC)';

    setVtuResult({
      cgpa: Number(cgpa),
      percentage: `${calculatedPercentage}%`,
      formula: 'Percentage = (CGPA - 0.75) × 10 (Official VTU Regulation)',
      classDivision,
      usEquivalentGpa: (Number(cgpa) / 10 * 4.0).toFixed(2)
    });
  };

  const shouldShow = (catId) => activeCategory === 'all' || activeCategory === catId;

  return (
    <div className="relative min-h-screen flex flex-col selection:bg-sky-500/30 selection:text-sky-200">
      <div className="ambient-radiance" />
      <Navbar activeVault="horizon" />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full">
        
        {/* Domain Profile Context Banner */}
        <ProfileBanner activeVault="horizon" />

        {/* Vault Header Hero */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-theme-glass text-left">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-2xl">🌅</span>
              <span className="text-[11px] font-mono font-extrabold uppercase tracking-widest px-3 py-0.5 rounded-full bg-sky-500/15 text-sky-700 dark:text-sky-400 border border-sky-500/35">
                VAULT 1: HORIZON CAREER &amp; ADMISSIONS OS
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-theme-main tracking-tight font-heading">
              Karnataka Admissions &amp; Career Intelligence Suite
            </h1>
            <p className="text-theme-muted text-xs sm:text-sm max-w-3xl mt-1 font-medium leading-relaxed">
              State rank matrices for 220,000+ candidates, KEA Option Entry simulators, Article 371(J) quota engines, and VTU CGPA converters.
            </p>
          </div>


          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-sky-500/30 text-sky-300 font-bold">
              22 Specialized Engines
            </span>
          </div>
        </div>

        {/* Sticky Modular Category Navigation Pills */}
        <CategoryNav
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          accentColor="sky"
        />

        {/* ══════════════════════════════════════════════════════════
            CATEGORY 1: KARNATAKA RANK MATRIX & ESTIMATOR
            ══════════════════════════════════════════════════════════ */}
        {shouldShow('rank') && (
          <section className="mb-10 text-left">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="text-xl">🎓</span>
              <h2 className="text-lg font-bold text-white font-heading">
                State Rank Matrices &amp; Admission Probability
              </h2>
            </div>

            <FeatureCard
              id="karnataka-rank-matrix"
              featureNumber="01"
              title="Karnataka State KCET / DCET Cohort Rank &amp; College Allocation Matrix"
              icon="🏛️"
              badge="KEA STANDARDS"
              realWorldScenario="Maps your KCET/DCET state rank and reservation category against historical cutoffs across 220+ Karnataka engineering colleges (RVCE, BMSCE, MSRIT, PES) to forecast exact round allocation probabilities."
              algorithmConcept="Normalized cohort percentile matching + Multi-round KEA seat matrix allocation rule evaluation."
              defaultExpanded={true}
              accentColor="sky"
            >
              <div className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1 font-bold">State Rank</label>
                    <input
                      type="number"
                      value={candidateRank}
                      onChange={(e) => setCandidateRank(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-sky-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-bold">Category Quota</label>
                    <select
                      value={categoryQuota}
                      onChange={(e) => setCategoryQuota(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-sky-400 focus:outline-none"
                    >
                      <option value="GM">General Merit (GM)</option>
                      <option value="1G">Category 1 (1G)</option>
                      <option value="2A">Category 2A (2A)</option>
                      <option value="2B">Category 2B (2B)</option>
                      <option value="3A">Category 3A (3A)</option>
                      <option value="3B">Category 3B (3B)</option>
                      <option value="SC">Scheduled Caste (SC)</option>
                      <option value="ST">Scheduled Tribe (ST)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-bold">Preferred Branch</label>
                    <input
                      type="text"
                      value={preferredBranch}
                      onChange={(e) => setPreferredBranch(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-sky-400 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleForecastMatrix}
                  disabled={loadingMatrix}
                  className="w-full py-2.5 rounded-xl font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 transition-all shadow-md shadow-sky-500/20"
                >
                  {loadingMatrix ? '⚡ Evaluating 220,000+ Candidate Cohort...' : '🏛️ FORECAST TOP COLLEGE ALLOCATIONS'}
                </button>

                {matrixResult && (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-sky-500/30 space-y-3">
                    <div className="flex items-center justify-between text-white font-bold">
                      <span>Normalized Score: {matrixResult.normalizedCompositeScore}</span>
                      <span className="text-sky-400">{matrixResult.estimatedRankBracket} Rank Bracket</span>
                    </div>

                    <div className="text-[11px] text-emerald-300 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/25">
                      💡 {matrixResult.counselingAdvice}
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Top Matched Engineering Colleges:</div>
                      {matrixResult.topMatchedColleges?.slice(0, 4).map((c, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between">
                          <div>
                            <div className="font-bold text-white text-xs font-sans">{c.college}</div>
                            <div className="text-[10px] text-slate-400">{c.branch} • Cutoff: #{c.cutoffRankForCategory}</div>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[10px] font-bold">
                            {c.matchProbability}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </FeatureCard>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════
            CATEGORY 2: VTU CGPA & DIPLOMA BRIDGES
            ══════════════════════════════════════════════════════════ */}
        {shouldShow('academic') && (
          <section className="mb-10 text-left">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="text-xl">📐</span>
              <h2 className="text-lg font-bold text-white font-heading">
                Academic Bridges &amp; VTU CGPA Converter
              </h2>
            </div>

            <FeatureCard
              id="vtu-cgpa-converter"
              featureNumber="02"
              title="Official Visvesvaraya Technological University (VTU) CGPA to Percentage Engine"
              icon="🧮"
              badge="VTU OFFICIAL FORMULA"
              realWorldScenario="Accurately converts VTU engineering CGPA into official academic percentage required for corporate campus placements and US 4.0 GPA evaluations."
              algorithmConcept="VTU Regulation Section 20.1 Formula: Percentage = (CGPA - 0.75) * 10."
              defaultExpanded={true}
              accentColor="sky"
            >
              <div className="space-y-3 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1 font-bold">Candidate CGPA (0 - 10.0)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={cgpa}
                      onChange={(e) => setCgpa(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-sky-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-bold">VTU Curriculum Scheme</label>
                    <select
                      value={scheme}
                      onChange={(e) => setScheme(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-sky-400 focus:outline-none"
                    >
                      <option value="2022 Scheme">2022 / 2026 CBCS Scheme</option>
                      <option value="2018 Scheme">2018 CBCS Scheme</option>
                      <option value="Autonomous">Autonomous University Scale</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleConvertVtu}
                  className="w-full py-2.5 rounded-xl font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 transition-all shadow-md shadow-sky-500/20"
                >
                  🧮 CALCULATE OFFICIAL VTU PERCENTAGE &amp; GPA
                </button>

                {vtuResult && (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-sky-500/30 space-y-2">
                    <div className="flex items-center justify-between text-white font-bold text-sm">
                      <span>Percentage: <strong className="text-emerald-400 text-base">{vtuResult.percentage}</strong></span>
                      <span className="text-sky-300">{vtuResult.classDivision}</span>
                    </div>
                    <div className="text-slate-400 text-[11px]">{vtuResult.formula}</div>
                    <div className="p-2 rounded-lg bg-sky-950/30 border border-sky-500/20 text-sky-200 text-[11px]">
                      🌐 US 4.0 Equivalent GPA: <strong>{vtuResult.usEquivalentGpa} / 4.0</strong> (WES Compatible)
                    </div>
                  </div>
                )}
              </div>
            </FeatureCard>
          </section>
        )}

      </main>
    </div>
  );
}
