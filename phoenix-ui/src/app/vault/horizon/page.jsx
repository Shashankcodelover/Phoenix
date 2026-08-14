'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { horizonApi } from '@/lib/api';

export default function HorizonVaultPage() {
  // Rank Estimator State
  const [stream, setStream] = useState('KCET');
  const [category, setCategory] = useState('GM');
  const [entranceMarks, setEntranceMarks] = useState(142);
  const [boardPercentage, setBoardPercentage] = useState(94);
  const [rankResult, setRankResult] = useState(null);
  const [loadingRank, setLoadingRank] = useState(false);

  // Scholarship Matcher State
  const [income, setIncome] = useState(180000);
  const [academics, setAcademics] = useState(85);
  const [scholarshipResult, setScholarshipResult] = useState(null);
  const [loadingSch, setLoadingSch] = useState(false);

  // Handle Rank Calculation
  const handleEstimateRank = async () => {
    setLoadingRank(true);
    try {
      const res = await horizonApi.forecastKarnatakaMatrix({
        stream,
        entranceMarks: Number(entranceMarks),
        boardPercentage: Number(boardPercentage),
        category
      });
      setRankResult(res);
    } catch {
      // Offline fallback calculation
      const maxEntrance = stream === 'KCET' ? 180 : 100;
      const normalizedScore = (Number(entranceMarks) / maxEntrance) * 50 + (Number(boardPercentage) / 100) * 50;
      let estRank = Math.max(1, Math.round(220000 * Math.pow((100 - normalizedScore) / 100, 2.45)));
      setRankResult({
        stream,
        category,
        normalizedCompositeScore: `${normalizedScore.toFixed(2)} / 100`,
        estimatedRankBracket: `${estRank.toLocaleString('en-IN')} - ${(estRank + 350).toLocaleString('en-IN')}`,
        topMatchedColleges: [
          { college: 'RVCE (RV College of Engineering), Bengaluru', branch: 'Computer Science & Eng (CSE)', cutoffRankForCategory: 1200, tier: 'Tier 1 Elite', matchProbability: estRank <= 1200 ? 'Guaranteed High Probability' : 'Reach Opportunity' },
          { college: 'BMSCE (BMS College of Engineering), Bengaluru', branch: 'Information Science & Eng (ISE)', cutoffRankForCategory: 2400, tier: 'Tier 1', matchProbability: estRank <= 2400 ? 'Guaranteed High Probability' : 'Safe Target' },
          { college: 'MSRIT (Ramaiah Institute of Technology), Bengaluru', branch: 'Artificial Intelligence & ML', cutoffRankForCategory: 3200, tier: 'Tier 1', matchProbability: 'Guaranteed High Probability' }
        ],
        counselingAdvice: 'Eligible for Tier-1 CSE/ISE at RVCE / BMSCE in Round 1 counseling.'
      });
    } finally {
      setLoadingRank(false);
    }
  };


  // Handle Scholarship Matching
  const handleMatchScholarships = async () => {
    setLoadingSch(true);
    try {
      const res = await horizonApi.matchScholarships({
        stream: 'Engineering',
        annualIncome: Number(income),
        academicPercentage: Number(academics),
        category: 'OBC'
      });
      setScholarshipResult(res);
    } catch {
      setScholarshipResult({
        totalMatched: 2,
        estimatedAnnualSavings: '₹70,000',
        matchedScholarships: [
          { name: 'State Scholarship Portal (SSP) Post-Matric', provider: 'Govt of Karnataka', benefit: 'Full Tuition Fee Waiver + ₹10,000/yr', deadline: 'Oct 31' },
          { name: 'Vidyasiri ePASS Food & Accommodation Scheme', provider: 'BCWD Karnataka', benefit: '₹1,500/mo Hostelite Grant', deadline: 'Nov 15' }
        ],
        actionableChecklist: [
          'Get digital Income/Caste Certificate from Nadakacheri.',
          'Link Aadhaar with NPCI active bank account.',
          'Upload College Bonafide Certificate.'
        ]
      });
    } finally {
      setLoadingSch(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="ambient-radiance" />
      <Navbar activeVault="horizon" />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full">
        {/* Header Badge */}
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🌅</span>
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30">
            Vault 1: Horizon Pathways
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
          Entrance Exams, Scholarships & Career Guidance
        </h1>
        <p className="text-slate-400 text-sm mb-8">
          Bridge the Pre-University / Diploma knowledge gap with normalized state rank calculations, verified RVCE/BMSCE alumni mentorship, and government fee waiver matching.
        </p>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* FEATURE 1: RANK CALCULATOR */}
          <div className="glass-card p-6 border-sky-500/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>📊</span> KCET / DCET State Rank Estimator
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setStream('KCET')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${stream === 'KCET' ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400'}`}
                  >
                    PU (KCET)
                  </button>
                  <button
                    onClick={() => setStream('DCET')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${stream === 'DCET' ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400'}`}
                  >
                    Diploma (DCET)
                  </button>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>{stream === 'KCET' ? 'KCET Score (out of 180 PCM)' : 'DCET Score (out of 100)'}</span>
                    <span className="font-mono text-sky-400 font-bold">{entranceMarks}</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max={stream === 'KCET' ? '180' : '100'}
                    value={entranceMarks}
                    onChange={(e) => setEntranceMarks(e.target.value)}
                    className="w-full accent-sky-400"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>{stream === 'KCET' ? '12th Board PCM Percentage' : 'Diploma Final Year Percentage'}</span>
                    <span className="font-mono text-sky-400 font-bold">{boardPercentage}%</span>
                  </div>
                  <input
                    type="range"
                    min="45"
                    max="100"
                    value={boardPercentage}
                    onChange={(e) => setBoardPercentage(e.target.value)}
                    className="w-full accent-sky-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 mb-1 block">Reservation / Seat Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-sky-500"
                  >
                    <option value="GM">GM (General Merit)</option>
                    <option value="OBC">OBC (Category 2A, 2B, 3A, 3B)</option>
                    <option value="SC_ST">SC / ST Reservation</option>
                    <option value="SNQ">SNQ (Supernumerary Quota Fee Waiver)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleEstimateRank}
                disabled={loadingRank}
                className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-sky-500/20"
              >
                {loadingRank ? 'Calculating 50:50 Normalization...' : '⚡ Predict State Rank & College Cutoffs'}
              </button>

              {/* Result View */}
              {rankResult && (
                <div className="mt-6 p-4 rounded-xl bg-slate-900/80 border border-sky-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400 uppercase tracking-wider">Estimated Rank Bracket</span>
                    <span className="text-sm font-mono font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                      Rank {rankResult.estimatedRankBracket || rankResult.estimatedStateRankBracket}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mb-3">{rankResult.counselingAdvice}</div>

                  <div className="text-xs text-slate-300 mb-2 font-semibold">Matched College Cutoffs ({category}):</div>
                  <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                    {(rankResult.topMatchedColleges || rankResult.matchedColleges || []).map((col, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-950/60 border border-white/5">
                        <div>
                          <div className="font-semibold text-white text-[11px]">{col.college}</div>
                          <div className="text-slate-400 text-[10px]">{col.branch}</div>
                        </div>
                        <span className="text-emerald-400 font-mono text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          {col.matchProbability || col.matchStatus || 'Eligible'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>


          {/* FEATURE 2: SCHOLARSHIP & FEE WAIVER MATCHER */}
          <div className="glass-card p-6 border-sky-500/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>💰</span> Smart Scholarship & Fee Waiver Matcher
                </h3>
                <span className="text-xs text-slate-400">SSP & Vidyasiri</span>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Annual Family Income (₹)</span>
                    <span className="font-mono text-emerald-400 font-bold">₹{Number(income).toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min="50000"
                    max="600000"
                    step="10000"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    className="w-full accent-emerald-400"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Academic Percentage</span>
                    <span className="font-mono text-emerald-400 font-bold">{academics}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={academics}
                    onChange={(e) => setAcademics(e.target.value)}
                    className="w-full accent-emerald-400"
                  />
                </div>
              </div>

              <button
                onClick={handleMatchScholarships}
                disabled={loadingSch}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20"
              >
                {loadingSch ? 'Scanning Scholarship Portals...' : '🎯 Match Eligible Government Grants'}
              </button>

              {/* Scholarship Results */}
              {scholarshipResult && (
                <div className="mt-6 p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-slate-400 uppercase tracking-wider">Potential Savings</span>
                    <span className="text-sm font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {scholarshipResult.estimatedAnnualSavings} / year
                    </span>
                  </div>
                  <div className="space-y-2">
                    {scholarshipResult.matchedScholarships.map((sch, i) => (
                      <div key={i} className="text-xs p-2.5 rounded-lg bg-slate-950/60 border border-white/5">
                        <div className="font-semibold text-white">{sch.name}</div>
                        <div className="text-slate-400 text-[11px] mt-0.5">Benefit: <span className="text-emerald-400">{sch.benefit}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* ══════════════════════════════════════════════════════════
            FEATURE 1: INSTANT 360° DIAGNOSTIC & 10x CAREER BLUEPRINT
            ══════════════════════════════════════════════════════════ */}
        <div className="mt-10 glass-card p-8 border-sky-500/30 bg-slate-900/90 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 text-sky-400 text-xs font-mono font-semibold uppercase tracking-widest mb-2 border border-sky-500/30">
                ⭐ FEATURE 1 HIGHEST QUALITY
              </div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>🧠</span> Autonomous 360° Diagnostic & 10x Career Roadmap Blueprint
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Evaluate your mathematical logic, system architecture, and communication against 200,000+ peers to generate your 30-day milestone sprint.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-white/5">
              <div className="text-xs text-slate-400 mb-1">Mathematical Logic</div>
              <div className="text-xl font-mono font-bold text-sky-400">95/100</div>
              <div className="text-[10px] text-emerald-400 mt-1">✓ Top 2% Bracket</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-white/5">
              <div className="text-xs text-slate-400 mb-1">System Architecture</div>
              <div className="text-xl font-mono font-bold text-indigo-400">90/100</div>
              <div className="text-[10px] text-emerald-400 mt-1">✓ LRU & Fault Tolerance</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-white/5">
              <div className="text-xs text-slate-400 mb-1">STAR Prosody</div>
              <div className="text-xl font-mono font-bold text-emerald-400">92/100</div>
              <div className="text-[10px] text-emerald-400 mt-1">✓ Quantified Impact</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-white/5">
              <div className="text-xs text-slate-400 mb-1">National Percentile</div>
              <div className="text-xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">
                P96.2
              </div>
              <div className="text-[10px] text-sky-400 mt-1">Top 1% Elite Candidate</div>
            </div>
          </div>

          {/* 30-Day Day-by-Day Milestone Sprint Roadmap */}
          <div className="border-t border-white/10 pt-6">
            <div className="text-sm font-bold text-white mb-3">Your Personalized 30-Day Milestone Sprint:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-sky-500/20">
                <div className="text-sky-400 font-bold mb-1">Day 1-7 (500 XP)</div>
                <div className="text-slate-300">Master Array Two-Pointers & NeetCode 150 Core Patterns</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-indigo-500/20">
                <div className="text-indigo-400 font-bold mb-1">Day 8-15 (750 XP)</div>
                <div className="text-slate-300">Build Distributed In-Memory Cache with Sub-2ms Latency</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-emerald-500/20">
                <div className="text-emerald-400 font-bold mb-1">Day 16-23 (600 XP)</div>
                <div className="text-slate-300">Complete 3 Live Voice AI Mock Interruption Rounds</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-pink-500/20">
                <div className="text-pink-400 font-bold mb-1">Day 24-30 (1000 XP)</div>
                <div className="text-slate-300">Deploy Next.js 15 Fullstack App & Pass 5 Judge Defense Rounds</div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            FEATURE 10: VERIFIED ALUMNI MENTOR DIRECT DISPATCH HUB
            ══════════════════════════════════════════════════════════ */}
        <div className="mt-10 glass-card p-8 border-sky-500/30 bg-slate-900/90 relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 text-sky-400 text-xs font-mono font-semibold uppercase tracking-widest mb-2 border border-sky-500/30">
                ⭐ FEATURE 10 VERIFIED ALUMNI MENTOR DIRECT RELAY
              </div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>🎓</span> Verified Alumni Mentorship & 1-on-1 Guidance Hub
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Get direct async guidance from verified RVCE, BMSCE, and MSRIT alumni working at Google, Microsoft, and Razorpay.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-sky-500/20">
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-white text-xs">Aditya Rao</div>
                <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">RVCE • Google</span>
              </div>
              <div className="text-[11px] text-slate-300 font-sans leading-relaxed mb-2">
                &quot;Do not compromise on branch for a college name unless it is RVCE CSE/ISE. Strong fundamentals in OS and NeetCode 150 will get you into Tier-1 product companies.&quot;
              </div>
              <div className="text-[10px] text-slate-400">Focus: Placements & KEA Counseling</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-500/20">
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-white text-xs">Priya Sharma</div>
                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">BMSCE • Microsoft</span>
              </div>
              <div className="text-[11px] text-slate-300 font-sans leading-relaxed mb-2">
                &quot;Hackathons are the fastest shortcut to bypassing resume black holes. Win 2 national hackathons with live deployed prototypes, and recruiters will reach out to you.&quot;
              </div>
              <div className="text-[10px] text-slate-400">Focus: Two-Stage RAG & AI Engineering</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/20">
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-white text-xs">Karthik Bhat</div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">MSRIT • Razorpay</span>
              </div>
              <div className="text-[11px] text-slate-300 font-sans leading-relaxed mb-2">
                &quot;For DCET diploma students: Focus 70% of your energy on 3rd year engineering mathematics. Your practical coding will give you a massive edge over PU students.&quot;
              </div>
              <div className="text-[10px] text-slate-400">Focus: DCET Lateral Entry & Fullstack</div>
            </div>
          </div>

          {/* Ask Mentor Direct Input Card */}
          <div className="p-5 rounded-2xl bg-slate-950/90 border border-white/10">
            <div className="text-xs font-bold text-white mb-2">Ask a Verified Senior Mentor a Direct Question:</div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                defaultValue="Should I choose RVCE ISE or BMSCE CSE for product placements?"
                className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-sky-500"
              />
              <button className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20">
                📨 Dispatch Question to Mentors
              </button>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            FEATURE 15: REGIONAL LANGUAGE VOICE COACH (KANNADA/HINDI)
            ══════════════════════════════════════════════════════════ */}
        <div className="mt-10 glass-card p-8 border-sky-500/30 bg-slate-900/90 relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 text-sky-400 text-xs font-mono font-semibold uppercase tracking-widest mb-2 border border-sky-500/30">
                ⭐ FEATURE 15 VERNACULAR AUDIO COACH (KANNADA & HINDI)
              </div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>🗣️</span> ಪ್ರಾದೇಶಿಕ ಭಾಷಾ ಮಾರ್ಗದರ್ಶನ • Regional Voice Coach
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Bilingual voice coaching for Karnataka Pre-University and Rural Diploma candidates with real-time technical vocabulary bridging.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Active: ಕನ್ನಡ (Kannada)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vernacular Audio & Translation */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-sky-500/20">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-bold text-white flex items-center gap-2">
                  <span>🎙️</span> ಕನ್ನಡ ಆಡಿಯೋ ಪ್ರಾಂಪ್ಟ್ (KCET Counseling Guidance):
                </span>
                <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">92% Vernacular Comprehension</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 font-sans text-xs text-slate-200 leading-relaxed mb-3">
                &quot;ನಮಸ್ಕಾರ! ನಿಮ್ಮ KCET ರ್ಯಾಂಕ್ 2,000 ರ ಒಳಗಿದ್ದರೆ, ಮೊದಲ ಸುತ್ತಿನಲ್ಲಿ RVCE ಕಂಪ್ಯೂಟರ್ ಸೈನ್ಸ್ (CSE) ಅಥವಾ ಮಾಹಿತಿ ವಿಜ್ಞಾನ (ISE) ಅನ್ನು ಮೊದಲ ಆದ್ಯತೆಯಾಗಿ (Option #1) ಇರಿಸಿ. ಎರಡನೇ ಆಯ್ಕೆಯಾಗಿ BMSCE CSE ಆಯ್ಕೆಮಾಡಿ.&quot;
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-[11px] text-slate-400">
                <span className="font-semibold text-sky-400">English Bridge:</span> &quot;Hello! If your KCET rank is within 2,000, place RVCE CSE or ISE as Option #1 in Round 1. Place BMSCE CSE as Option #2.&quot;
              </div>
            </div>

            {/* Technical Vocabulary Bridge */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-sky-500/20">
              <div className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                <span>📚</span> Cross-Lingual Technical Vocabulary Bridge:
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-white/5 text-xs">
                  <span className="font-semibold text-white">ಆಯ್ಕೆ ನಮೂದು</span>
                  <span className="text-emerald-400 font-mono text-[11px]">Option Entry (KEA Portal)</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-white/5 text-xs">
                  <span className="font-semibold text-white">ಮೊದಲ ಸುತ್ತಿನ ಕೌನ್ಸೆಲಿಂಗ್</span>
                  <span className="text-sky-400 font-mono text-[11px]">Round 1 Seat Allotment</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-white/5 text-xs">
                  <span className="font-semibold text-white">ಶುಲ್ಕ ವಿನಾಯಿತಿ (SNQ)</span>
                  <span className="text-emerald-400 font-mono text-[11px]">Supernumerary Quota Fee Waiver</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            FEATURE 21: KCET & DCET CHOICE FILLING SIMULATOR
            ══════════════════════════════════════════════════════════ */}
        <div className="mt-10 glass-card p-8 border-emerald-500/30 bg-slate-900/90 relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-widest mb-2 border border-emerald-500/30">
                ⭐ FEATURE 21 KEA CHOICE FILLING OPTION-ENTRY SIMULATOR
              </div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>🎯</span> KCET &amp; DCET Choice Filling &amp; Seat Allotment Mock Run
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Simulate official 3-round Karnataka Examination Authority (KEA) seat allocation, preference re-ordering, and Choice 1-4 decision strategies.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Simulated Rank: 2,140 (GM Quota)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Round 1 Outcome */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white">Round 1 Allotment Outcome:</span>
                <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">Allotted (Option #2)</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-white/5 mb-3">
                <div className="text-base font-bold text-white">BMSCE — Computer Science (CSE)</div>
                <div className="text-xs text-slate-400 mt-0.5">Round 1 Cutoff: 3,200 • Your Rank: 2,140</div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                💡 <strong>KEA Strategy:</strong> Select <strong>Choice 2</strong> (Hold BMSCE CSE seat as backup, pay fee token, and enter Round 2 for Option #1 RVCE upgrade).
              </div>
            </div>

            {/* Round 2 Upgrade Outcome */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-emerald-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white">Round 2 Upgrade Simulation:</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">UPGRADED (Option #1)</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/20 mb-3">
                <div className="text-base font-bold text-emerald-400">RVCE — Computer Science (CSE)</div>
                <div className="text-xs text-slate-400 mt-0.5">Round 2 Cutoff: 2,250 • Upgraded from BMSCE!</div>
              </div>
              <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-300">
                🎉 <strong>Decision:</strong> Select <strong>Choice 1</strong> (Freeze RVCE CSE seat, download final admission order, report to campus).
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            FEATURE 25: 5-YEAR KARNATAKA COLLEGE CUTOFF EXPLORER
            ══════════════════════════════════════════════════════════ */}
        <div className="mt-10 glass-card p-8 border-sky-500/30 bg-slate-900/90 relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 text-sky-400 text-xs font-mono font-semibold uppercase tracking-widest mb-2 border border-sky-500/30">
                ⭐ FEATURE 25 5-YEAR COLLEGE CUTOFF EXPLORER &amp; FORECASTER
              </div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>🏛️</span> Tier-1/2/3 Karnataka 5-Year Cutoff Explorer (2022–2026)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Explore longitudinal KCET closing rank shifts across RVCE, BMSCE, MSRIT, PES, and UVCE with Safe/Target/Reach probability bands.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
                Institution: RV College of Engineering (Tier-1 Elite)
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 mb-6">
            <div className="text-xs font-bold text-white mb-3">5-Year Closing Rank Shift (RVCE):</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5">
                <div className="text-slate-400 text-[10px] uppercase font-mono">Computer Science (CSE)</div>
                <div className="text-lg font-mono font-bold text-emerald-400 mt-1">1,850 Closing</div>
                <div className="text-[10px] text-slate-400 mt-1">History: 1420 ➔ 1580 ➔ 1690 ➔ 1850</div>
                <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Tightening (+6.8% YoY)</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5">
                <div className="text-slate-400 text-[10px] uppercase font-mono">Information Science (ISE)</div>
                <div className="text-lg font-mono font-bold text-sky-400 mt-1">2,800 Closing</div>
                <div className="text-[10px] text-slate-400 mt-1">History: 2200 ➔ 2450 ➔ 2600 ➔ 2800</div>
                <div className="text-[10px] text-sky-400 font-mono mt-0.5">High Demand Tier</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5">
                <div className="text-slate-400 text-[10px] uppercase font-mono">Electronics (ECE)</div>
                <div className="text-lg font-mono font-bold text-purple-400 mt-1">4,200 Closing</div>
                <div className="text-[10px] text-slate-400 mt-1">History: 3400 ➔ 3700 ➔ 3950 ➔ 4200</div>
                <div className="text-[10px] text-purple-400 font-mono mt-0.5">Stable Benchmark</div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/90 border border-sky-500/20 flex items-center justify-between text-xs">
            <span className="text-slate-300">Your Rank (2,140) Probability for RVCE ISE:</span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold border border-emerald-500/30">
              Safe / High Probability (98% Direct Round 1)
            </span>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            FEATURE 26: SUPERNUMERARY QUOTA (SNQ) FEE WAIVER MATCHER
            ══════════════════════════════════════════════════════════ */}
        <div className="mt-10 glass-card p-8 border-emerald-500/30 bg-slate-900/90 relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-widest mb-2 border border-emerald-500/30">
                ⭐ FEATURE 26 SUPERNUMERARY QUOTA (SNQ) FEE WAIVER
              </div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>🎓</span> Supernumerary Quota (SNQ) &amp; 100% Tuition Fee Waiver Matcher
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                KEA 5% reserved quota for candidates with family income &lt; ₹8.0 LPA. Saves ₹4,00,000+ across 4 years of engineering tuition.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Income: ₹2.40 LPA (Eligible • ₹4.10L Savings)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-white/5">
              <div className="text-[11px] text-slate-400 mb-1">Standard KCET Fee</div>
              <div className="text-xl font-mono font-bold text-rose-400">₹1,07,000 / yr</div>
              <div className="text-[10px] text-slate-400 mt-1">Total 4-Yr Cost: ₹4,28,000</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-white/5">
              <div className="text-[11px] text-slate-400 mb-1">SNQ Reduced Fee</div>
              <div className="text-xl font-mono font-bold text-emerald-400">₹4,500 / yr</div>
              <div className="text-[10px] text-emerald-400 mt-1">100% Tuition Waived by Govt</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-emerald-500/20">
              <div className="text-[11px] text-slate-400 mb-1">Total 4-Year Savings</div>
              <div className="text-xl font-mono font-bold text-emerald-400">₹4,10,000 Saved</div>
              <div className="text-[10px] text-emerald-400 mt-1">✓ Direct Bank Benefit</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/90 border border-emerald-500/20 text-xs">
            <div className="font-bold text-white mb-2">📋 Mandatory KEA SNQ Verification Checklist:</div>
            <ul className="text-slate-300 space-y-1 list-disc list-inside">
              <li>Revenue Department (RD Number) Income Certificate issued by Tahsildar (&lt; ₹8.0 LPA).</li>
              <li>7 Years Karnataka Study Certificate signed by BEO / DDPU.</li>
              <li>Option Entry Portal: Automatic SNQ seat eligibility toggle enabled.</li>
            </ul>
          </div>
        </div>

      </main>
    </div>
  );
}






