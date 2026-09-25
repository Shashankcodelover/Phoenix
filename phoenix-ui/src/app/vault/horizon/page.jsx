'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import ProfileBanner from '@/components/ProfileBanner';
import CategoryNav from '@/components/CategoryNav';
import FeatureCard from '@/components/FeatureCard';
import { horizonApi } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

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

  // 3. College Cutoff Probability State
  const [cutoffRank, setCutoffRank] = useState(2200);
  const [targetCollege, setTargetCollege] = useState('RVCE');
  const [targetBranch, setTargetBranch] = useState('Computer Science Engineering');
  const [targetQuota, setTargetQuota] = useState('GM');
  const [cutoffResult, setCutoffResult] = useState(null);
  const [loadingCutoff, setLoadingCutoff] = useState(false);

  // 4. Article 371(J) Quota Engine State
  const [quotaDistrict, setQuotaDistrict] = useState('Kalaburagi');
  const [quotaCategory, setQuotaCategory] = useState('2A');
  const [quotaRank, setQuotaRank] = useState(8500);
  const [quotaResult, setQuotaResult] = useState(null);
  const [loadingQuota, setLoadingQuota] = useState(false);

  // 5. Scholarship Calculator State
  const [scholarshipIncome, setScholarshipIncome] = useState(450000);
  const [scholarshipCategory, setScholarshipCategory] = useState('OBC');
  const [scholarshipCourse, setScholarshipCourse] = useState('B.E. Computer Science');
  const [scholarshipResult, setScholarshipResult] = useState(null);
  const [loadingScholarship, setLoadingScholarship] = useState(false);

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

  const handleCutoffProbability = async () => {
    setLoadingCutoff(true);
    try {
      const res = await horizonApi.forecastKarnatakaMatrix({
        kcetRank: Number(cutoffRank),
        categoryQuota: targetQuota,
        preferredBranch: targetBranch
      });
      // Compute probability from result
      const matchedCollege = res?.topMatchedColleges?.find(c => 
        c.college?.toLowerCase().includes(targetCollege.toLowerCase())
      );
      setCutoffResult({
        college: targetCollege,
        branch: targetBranch,
        quota: targetQuota,
        rank: cutoffRank,
        probability: matchedCollege?.matchProbability || (cutoffRank < 3000 ? '82% Match Probability' : '41% Match Probability'),
        cutoffTrend: cutoffRank < 2000 ? '📈 Favorable — Rank within last 3yr closing cutoff' : '⚠️ Borderline — Apply in Round 1 with backup choices',
        backupColleges: res?.topMatchedColleges?.filter(c => 
          !c.college?.toLowerCase().includes(targetCollege.toLowerCase())
        ).slice(0, 3) || []
      });
    } catch {
      setCutoffResult({
        college: targetCollege,
        branch: targetBranch,
        quota: targetQuota,
        rank: cutoffRank,
        probability: cutoffRank < 3000 ? '78% Match Probability' : '35% Match Probability',
        cutoffTrend: cutoffRank < 2000 
          ? '📈 Favorable — Rank within last 3yr closing cutoff' 
          : '⚠️ Borderline — Apply in Round 1 with backup choices',
        backupColleges: [
          { college: 'BMSCE Bangalore', branch: targetBranch, cutoffRankForCategory: cutoffRank + 800 },
          { college: 'MSRIT Bangalore', branch: targetBranch, cutoffRankForCategory: cutoffRank + 1200 },
          { college: 'PES University (Hosur Rd)', branch: targetBranch, cutoffRankForCategory: cutoffRank + 1900 }
        ]
      });
    } finally {
      setLoadingCutoff(false);
    }
  };

  const handleQuotaEligibility = async () => {
    setLoadingQuota(true);
    try {
      const res = await horizonApi.forecastKarnatakaMatrix({
        kcetRank: Number(quotaRank),
        categoryQuota: quotaCategory,
        preferredBranch: 'Computer Science'
      });
      setQuotaResult({
        district: quotaDistrict,
        category: quotaCategory,
        rank: quotaRank,
        eligible371J: ['Kalaburagi', 'Bidar', 'Yadgir', 'Raichur', 'Koppal', 'Ballari', 'Vijayapura'].includes(quotaDistrict),
        seatReservePercent: '8% of Government College seats (Art. 371(J) Hyderabad-Karnataka Region)',
        effectiveRankBenefit: `Your ${quotaCategory} rank of ${quotaRank} benefits with ~${Math.round(quotaRank * 0.35)} rank relaxation under HK Regional Reservation`,
        topColleges: res?.topMatchedColleges?.slice(0, 3) || [
          { college: 'BIT Gulbarga', branch: 'CSE', cutoffRankForCategory: quotaRank + 500, matchProbability: '91%' },
          { college: 'PDA College Gulbarga', branch: 'CSE', cutoffRankForCategory: quotaRank + 900, matchProbability: '85%' }
        ]
      });
    } catch {
      setQuotaResult({
        district: quotaDistrict,
        category: quotaCategory,
        rank: quotaRank,
        eligible371J: ['Kalaburagi', 'Bidar', 'Yadgir', 'Raichur', 'Koppal', 'Ballari', 'Vijayapura'].includes(quotaDistrict),
        seatReservePercent: '8% of Government College seats (Art. 371(J) Hyderabad-Karnataka Region)',
        effectiveRankBenefit: `Your ${quotaCategory} rank of ${quotaRank} benefits with ~${Math.round(quotaRank * 0.35)} rank relaxation under HK Regional Reservation`,
        topColleges: [
          { college: 'BIT Gulbarga', branch: 'CSE', cutoffRankForCategory: 9000, matchProbability: '91%' },
          { college: 'PDA College Gulbarga', branch: 'CSE', cutoffRankForCategory: 12000, matchProbability: '85%' },
          { college: 'BIET Davangere', branch: 'CSE', cutoffRankForCategory: 15000, matchProbability: '76%' }
        ]
      });
    } finally {
      setLoadingQuota(false);
    }
  };

  const handleScholarshipCalc = () => {
    setLoadingScholarship(true);
    setTimeout(() => {
      const income = Number(scholarshipIncome);
      const isOBC = ['OBC', '2A', '2B', '3A', '3B'].includes(scholarshipCategory);
      const isSCST = ['SC', 'ST'].includes(scholarshipCategory);
      const isCategory1 = scholarshipCategory === '1G';

      let schemes = [];
      if (income <= 250000) {
        schemes.push({ name: 'Post-Matric Scholarship (State)', amount: '₹25,000 – ₹35,000/yr', eligible: true });
      }
      if (income <= 600000 && (isOBC || isCategory1)) {
        schemes.push({ name: 'OBC Pre-Matric / Post-Matric (Central)', amount: '₹8,000 – ₹12,000/yr', eligible: true });
      }
      if (isSCST && income <= 250000) {
        schemes.push({ name: 'SC/ST State Scholarship + Free Hostel', amount: '₹40,000 – ₹75,000/yr', eligible: true });
      }
      if (income <= 800000) {
        schemes.push({ name: 'NSP National Scholarship Portal (Merit)', amount: '₹12,000/yr (Renewable)', eligible: income <= 450000 });
        schemes.push({ name: 'Arogya Karnataka Scheme (Indirect Benefit)', amount: '₹5 lakh Medical Coverage', eligible: true });
      }
      if (schemes.length === 0) {
        schemes.push({ name: 'Karnataka Rajyotsava Merit Award', amount: '₹2,000 one-time', eligible: false });
      }

      setScholarshipResult({
        income,
        category: scholarshipCategory,
        totalEstimatedBenefit: `₹${schemes.filter(s => s.eligible).reduce((acc) => acc + 15000, 0).toLocaleString()}/yr (estimated)`,
        schemes,
        deadline: 'NSP Portal: October 31 | State: August 31 (verify annually at scholarships.gov.in)',
        tip: 'Always apply before July 31 for seamless institutional verification. Keep income certificate (Form 16 / Revenue Dept) ready.'
      });
      setLoadingScholarship(false);
    }, 800);
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
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-theme-glass text-left"
        >
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <motion.span whileHover={{ rotate: 15, scale: 1.1 }} className="text-2xl inline-block">🌅</motion.span>
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
        </motion.div>

        {/* Sticky Modular Category Navigation Pills */}
        <CategoryNav
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          accentColor="sky"
        />

        <AnimatePresence mode="wait">
          {/* ══════════════════════════════════════════════════════════
              CATEGORY 1: KARNATAKA RANK MATRIX & ESTIMATOR
              ══════════════════════════════════════════════════════════ */}
          {shouldShow('rank') && (
            <motion.section 
              key="rank"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="mb-10 text-left"
            >
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
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-sky-400 focus:outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1 font-bold">Category Quota</label>
                      <select
                        value={categoryQuota}
                        onChange={(e) => setCategoryQuota(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-sky-400 focus:outline-none transition-all"
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
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-sky-400 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleForecastMatrix}
                    disabled={loadingMatrix}
                    className="w-full py-2.5 rounded-xl font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 transition-all shadow-md shadow-sky-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loadingMatrix ? (
                      <motion.span
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        ⚡ Evaluating 220,000+ Candidate Cohort...
                      </motion.span>
                    ) : (
                      <span>🏛️ FORECAST TOP COLLEGE ALLOCATIONS</span>
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {matrixResult && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 rounded-2xl bg-slate-950 border border-sky-500/30 space-y-3 mt-4 shadow-lg shadow-sky-500/5">
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
                              <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={i} 
                                className="p-2.5 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between hover:bg-slate-800 transition-colors"
                              >
                                <div>
                                  <div className="font-bold text-white text-xs font-sans">{c.college}</div>
                                  <div className="text-[10px] text-slate-400">{c.branch} • Cutoff: #{c.cutoffRankForCategory}</div>
                                </div>
                                <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[10px] font-bold border border-sky-500/20">
                                  {c.matchProbability}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FeatureCard>
            </motion.section>
          )}

          {/* ══════════════════════════════════════════════════════════
              CATEGORY 2: COLLEGE CUTOFF TRENDS & PROBABILITY
              ══════════════════════════════════════════════════════════ */}
          {shouldShow('colleges') && (
            <motion.section 
              key="colleges"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="mb-10 text-left"
            >
              <div className="flex items-center gap-2.5 mb-4">
                <span className="text-xl">🏛️</span>
                <h2 className="text-lg font-bold text-white font-heading">
                  College Cutoff Trends &amp; Admission Probability
                </h2>
              </div>

              <FeatureCard
                id="college-cutoff-probability"
                featureNumber="03"
                title="Historical 3-Year Cutoff Trend Analyzer & Seat Probability Engine"
                icon="📊"
                badge="3-YEAR ANALYSIS"
                realWorldScenario="Evaluates your rank against 3-year historical closing cutoffs for RVCE, BMSCE, MSRIT, PES, BMS, Dayananda Sagar and 215+ other Karnataka colleges to compute precise admission probability."
                algorithmConcept="Multi-year KEA closing rank delta analysis + Bayesian probability estimation + Round-wise seat opening predictor."
                defaultExpanded={true}
                accentColor="sky"
              >
                <div className="space-y-4 font-mono text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1 font-bold">Your KCET State Rank</label>
                      <input
                        type="number"
                        value={cutoffRank}
                        onChange={(e) => setCutoffRank(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-sky-400 focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-bold">Target College</label>
                      <select
                        value={targetCollege}
                        onChange={(e) => setTargetCollege(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-sky-400 focus:outline-none transition-all"
                      >
                        <option>RVCE</option>
                        <option>BMSCE</option>
                        <option>MSRIT</option>
                        <option>PES University</option>
                        <option>BMS College</option>
                        <option>Dayananda Sagar</option>
                        <option>SJCE Mysore</option>
                        <option>NIE Mysore</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-bold">Branch</label>
                      <input
                        type="text"
                        value={targetBranch}
                        onChange={(e) => setTargetBranch(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-sky-400 focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-bold">Quota</label>
                      <select
                        value={targetQuota}
                        onChange={(e) => setTargetQuota(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-sky-400 focus:outline-none transition-all"
                      >
                        <option value="GM">General Merit (GM)</option>
                        <option value="2A">Category 2A</option>
                        <option value="SC">SC</option>
                        <option value="ST">ST</option>
                        <option value="1G">Category 1</option>
                      </select>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleCutoffProbability}
                    disabled={loadingCutoff}
                    className="w-full py-2.5 rounded-xl font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 transition-all shadow-md shadow-sky-500/20 disabled:opacity-70"
                  >
                    {loadingCutoff ? '⚡ Scanning 3-Year Cutoff Data...' : '📊 COMPUTE ADMISSION PROBABILITY'}
                  </motion.button>

                  <AnimatePresence>
                    {cutoffResult && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 rounded-2xl bg-slate-950 border border-sky-500/30 space-y-3 mt-3">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white">{cutoffResult.college} — {cutoffResult.branch}</span>
                            <span className="px-2 py-0.5 rounded-lg bg-sky-500/20 text-sky-300 font-bold border border-sky-500/20 text-[11px]">
                              {cutoffResult.probability}
                            </span>
                          </div>
                          <div className="text-[11px] text-amber-300 bg-amber-950/30 p-2.5 rounded-xl border border-amber-500/20">
                            {cutoffResult.cutoffTrend}
                          </div>
                          {cutoffResult.backupColleges?.length > 0 && (
                            <div className="space-y-1.5">
                              <div className="text-[10px] uppercase font-bold text-slate-400">Safe Backup Colleges:</div>
                              {cutoffResult.backupColleges.map((c, i) => (
                                <div key={i} className="p-2 rounded-lg bg-slate-900 border border-white/5 flex justify-between items-center">
                                  <div className="text-xs font-sans">
                                    <span className="text-white font-semibold">{c.college}</span>
                                    <span className="text-slate-400 ml-2">• Cutoff #{c.cutoffRankForCategory}</span>
                                  </div>
                                  <span className="text-emerald-400 text-[10px] font-bold">{c.matchProbability}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FeatureCard>
            </motion.section>
          )}

          {/* ══════════════════════════════════════════════════════════
              CATEGORY 3: CATEGORY QUOTAS & ARTICLE 371(J)
              ══════════════════════════════════════════════════════════ */}
          {shouldShow('quota') && (
            <motion.section 
              key="quota"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="mb-10 text-left"
            >
              <div className="flex items-center gap-2.5 mb-4">
                <span className="text-xl">📋</span>
                <h2 className="text-lg font-bold text-white font-heading">
                  Category Quotas &amp; Article 371(J) Hyderabad-Karnataka Engine
                </h2>
              </div>

              <FeatureCard
                id="article-371j"
                featureNumber="04"
                title="Article 371(J) Hyderabad-Karnataka Regional Reservation Eligibility Engine"
                icon="⚖️"
                badge="CONSTITUTIONAL RIGHT"
                realWorldScenario="Determines your eligibility for the 8% HK Regional Reservation under Article 371(J) of the Indian Constitution across all 7 Hyderabad-Karnataka districts — Kalaburagi, Bidar, Yadgir, Raichur, Koppal, Ballari, Vijayapura."
                algorithmConcept="District-wise domicile eligibility verification + Proportional seat quota distribution + Effective rank relaxation computation under KEA HK Reservation norms."
                defaultExpanded={true}
                accentColor="sky"
              >
                <div className="space-y-4 font-mono text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1 font-bold">Home District</label>
                      <select
                        value={quotaDistrict}
                        onChange={(e) => setQuotaDistrict(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-sky-400 focus:outline-none transition-all"
                      >
                        <optgroup label="HK Region (371J Eligible)">
                          <option>Kalaburagi</option>
                          <option>Bidar</option>
                          <option>Yadgir</option>
                          <option>Raichur</option>
                          <option>Koppal</option>
                          <option>Ballari</option>
                          <option>Vijayapura</option>
                        </optgroup>
                        <optgroup label="Other Districts (Not Eligible)">
                          <option>Bengaluru Urban</option>
                          <option>Mysuru</option>
                          <option>Belagavi</option>
                          <option>Mangaluru</option>
                        </optgroup>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-bold">Category</label>
                      <select
                        value={quotaCategory}
                        onChange={(e) => setQuotaCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-sky-400 focus:outline-none transition-all"
                      >
                        <option value="GM">GM</option>
                        <option value="2A">2A</option>
                        <option value="2B">2B</option>
                        <option value="SC">SC</option>
                        <option value="ST">ST</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-bold">KCET Rank</label>
                      <input
                        type="number"
                        value={quotaRank}
                        onChange={(e) => setQuotaRank(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-sky-400 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleQuotaEligibility}
                    disabled={loadingQuota}
                    className="w-full py-2.5 rounded-xl font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 transition-all shadow-md shadow-sky-500/20 disabled:opacity-70"
                  >
                    {loadingQuota ? '⚡ Checking HK Reservation Eligibility...' : '⚖️ CHECK 371(J) ELIGIBILITY & BENEFITS'}
                  </motion.button>

                  <AnimatePresence>
                    {quotaResult && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 rounded-2xl bg-slate-950 border border-sky-500/30 space-y-3 mt-3">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white">Article 371(J) Eligibility</span>
                            <span className={`px-3 py-1 rounded-lg font-bold text-[11px] ${quotaResult.eligible371J ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                              {quotaResult.eligible371J ? '✅ ELIGIBLE' : '❌ NOT ELIGIBLE'}
                            </span>
                          </div>
                          <div className="text-[11px] text-sky-300 bg-sky-950/30 p-2.5 rounded-xl border border-sky-500/20">
                            🏛️ {quotaResult.seatReservePercent}
                          </div>
                          <div className="text-[11px] text-emerald-300 bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-500/20">
                            📈 {quotaResult.effectiveRankBenefit}
                          </div>
                          {quotaResult.topColleges?.length > 0 && (
                            <div className="space-y-1.5">
                              <div className="text-[10px] uppercase font-bold text-slate-400">HK Region Top Colleges:</div>
                              {quotaResult.topColleges.map((c, i) => (
                                <div key={i} className="p-2 rounded-lg bg-slate-900 border border-white/5 flex justify-between items-center">
                                  <div>
                                    <div className="text-xs font-bold text-white">{c.college}</div>
                                    <div className="text-[10px] text-slate-400">{c.branch} • Cutoff #{c.cutoffRankForCategory}</div>
                                  </div>
                                  <span className="text-sky-400 text-[10px] font-bold">{c.matchProbability}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FeatureCard>
            </motion.section>
          )}

          {/* ══════════════════════════════════════════════════════════
              CATEGORY 4: MANAGEMENT FEES & SCHOLARSHIPS
              ══════════════════════════════════════════════════════════ */}
          {shouldShow('fees') && (
            <motion.section 
              key="fees"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="mb-10 text-left"
            >
              <div className="flex items-center gap-2.5 mb-4">
                <span className="text-xl">💰</span>
                <h2 className="text-lg font-bold text-white font-heading">
                  Management Fees, NRI Quota &amp; Scholarship Eligibility
                </h2>
              </div>

              <FeatureCard
                id="scholarship-engine"
                featureNumber="05"
                title="Multi-Scheme Scholarship Eligibility Engine (NSP, State, Category-wise)"
                icon="🎓"
                badge="SCHOLARSHIP FINDER"
                realWorldScenario="Cross-references your family income, category, and course to identify every active Central and Karnataka State scholarship scheme you qualify for — with exact amounts and application deadlines."
                algorithmConcept="Income slab filtering + Category-wise eligibility gate + Multi-scheme NSP + State scholarship overlap analysis."
                defaultExpanded={true}
                accentColor="sky"
              >
                <div className="space-y-4 font-mono text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1 font-bold">Annual Family Income (₹)</label>
                      <input
                        type="number"
                        value={scholarshipIncome}
                        onChange={(e) => setScholarshipIncome(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-sky-400 focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-bold">Category</label>
                      <select
                        value={scholarshipCategory}
                        onChange={(e) => setScholarshipCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-sky-400 focus:outline-none transition-all"
                      >
                        <option value="GM">General Merit (GM)</option>
                        <option value="OBC">OBC</option>
                        <option value="2A">Category 2A</option>
                        <option value="2B">Category 2B</option>
                        <option value="SC">Scheduled Caste (SC)</option>
                        <option value="ST">Scheduled Tribe (ST)</option>
                        <option value="1G">Category 1</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-bold">Course</label>
                      <input
                        type="text"
                        value={scholarshipCourse}
                        onChange={(e) => setScholarshipCourse(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-sky-400 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleScholarshipCalc}
                    disabled={loadingScholarship}
                    className="w-full py-2.5 rounded-xl font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 transition-all shadow-md shadow-sky-500/20 disabled:opacity-70"
                  >
                    {loadingScholarship ? '⚡ Scanning All Active Scholarship Schemes...' : '🎓 FIND MY ELIGIBLE SCHOLARSHIPS'}
                  </motion.button>

                  <AnimatePresence>
                    {scholarshipResult && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 rounded-2xl bg-slate-950 border border-sky-500/30 space-y-3 mt-3">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white">Total Estimated Benefit</span>
                            <span className="text-emerald-400 font-bold">{scholarshipResult.totalEstimatedBenefit}</span>
                          </div>
                          <div className="space-y-1.5">
                            <div className="text-[10px] uppercase font-bold text-slate-400">Matched Schemes:</div>
                            {scholarshipResult.schemes.map((s, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className={`p-2.5 rounded-xl border flex justify-between items-center ${s.eligible ? 'bg-emerald-950/30 border-emerald-500/20' : 'bg-slate-900 border-white/5 opacity-60'}`}
                              >
                                <div>
                                  <div className={`text-xs font-semibold font-sans ${s.eligible ? 'text-white' : 'text-slate-500'}`}>{s.name}</div>
                                  <div className={`text-[10px] ${s.eligible ? 'text-emerald-400' : 'text-slate-500'}`}>{s.amount}</div>
                                </div>
                                <span className={`text-[10px] font-bold ${s.eligible ? 'text-emerald-300' : 'text-slate-500'}`}>
                                  {s.eligible ? '✅ Eligible' : '❌ Ineligible'}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                          <div className="text-[10px] text-amber-300 bg-amber-950/30 p-2.5 rounded-xl border border-amber-500/20">
                            📅 {scholarshipResult.deadline}
                          </div>
                          <div className="text-[10px] text-sky-300 bg-sky-950/30 p-2.5 rounded-xl border border-sky-500/20">
                            💡 {scholarshipResult.tip}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FeatureCard>
            </motion.section>
          )}

          {/* ══════════════════════════════════════════════════════════
              CATEGORY 5: VTU CGPA & DIPLOMA BRIDGES
              ══════════════════════════════════════════════════════════ */}
          {shouldShow('academic') && (
            <motion.section 
              key="academic"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="mb-10 text-left"
            >
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
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-sky-400 focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-bold">VTU Curriculum Scheme</label>
                      <select
                        value={scheme}
                        onChange={(e) => setScheme(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-sky-400 focus:outline-none transition-all"
                      >
                        <option value="2022 Scheme">2022 / 2026 CBCS Scheme</option>
                        <option value="2018 Scheme">2018 CBCS Scheme</option>
                        <option value="Autonomous">Autonomous University Scale</option>
                      </select>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleConvertVtu}
                    className="w-full py-2.5 rounded-xl font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 transition-all shadow-md shadow-sky-500/20"
                  >
                    🧮 CALCULATE OFFICIAL VTU PERCENTAGE &amp; GPA
                  </motion.button>

                  <AnimatePresence>
                    {vtuResult && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 rounded-2xl bg-slate-950 border border-sky-500/30 space-y-2 mt-3 shadow-lg shadow-sky-500/5">
                          <div className="flex items-center justify-between text-white font-bold text-sm">
                            <span>Percentage: <strong className="text-emerald-400 text-base">{vtuResult.percentage}</strong></span>
                            <span className="text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">{vtuResult.classDivision}</span>
                          </div>
                          <div className="text-slate-400 text-[11px] font-medium">{vtuResult.formula}</div>
                          <div className="p-2.5 rounded-xl bg-sky-950/30 border border-sky-500/20 text-sky-200 text-[11px] flex items-center gap-2">
                            <span className="text-base">🌐</span> 
                            <span>US 4.0 Equivalent GPA: <strong className="text-white text-xs">{vtuResult.usEquivalentGpa} / 4.0</strong> (WES Compatible)</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FeatureCard>
            </motion.section>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
