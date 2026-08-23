'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { defaultProfile, saveStoredProfile } from '@/lib/profileStore';
import { ensureAuthToken } from '@/lib/api';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedDomain, setSelectedDomain] = useState('interview'); // 'interview' | 'hackathon' | 'horizon'
  
  const [name, setName] = useState('Shashank J');
  const [email, setEmail] = useState('shashank@phoenix.os');

  // Pillar 1: Interview
  const [targetRole, setTargetRole] = useState('Senior Distributed Systems / Full-Stack Engineer');
  const [targetCompany, setTargetCompany] = useState('FAANG / Tier-1 Tech (Google, Uber, Stripe)');
  const [techStack, setTechStack] = useState('TypeScript, Node.js, React, Redis, Distributed Systems');

  // Pillar 2: Hackathon
  const [teamName, setTeamName] = useState('Team Phoenix Apex');
  const [squadRole, setSquadRole] = useState('Lead Full-Stack & Systems Architect');
  const [targetTrack, setTargetTrack] = useState('Best Multimodal AI & Real-Time Collaboration Hack');

  // Pillar 3: Horizon
  const [candidateRank, setCandidateRank] = useState(1850);
  const [categoryQuota, setCategoryQuota] = useState('2A');
  const [preferredBranch, setPreferredBranch] = useState('Computer Science & Eng (CSE)');

  const handleComplete = async (e) => {
    e.preventDefault();
    await ensureAuthToken();

    const profileData = {
      ...defaultProfile,
      name,
      email,
      activeDomain: selectedDomain,
      interviewProfile: {
        ...defaultProfile.interviewProfile,
        targetRole,
        targetCompanyTier: targetCompany,
        primaryStack: techStack.split(',').map(s => s.trim())
      },
      hackathonProfile: {
        ...defaultProfile.hackathonProfile,
        teamName,
        squadRole,
        targetTrack
      },
      horizonProfile: {
        ...defaultProfile.horizonProfile,
        candidateRank: Number(candidateRank),
        categoryQuota,
        preferredBranches: [preferredBranch]
      }
    };

    saveStoredProfile(profileData);

    // Route to the chosen vault directly
    if (selectedDomain === 'interview') router.push('/vault/interview');
    else if (selectedDomain === 'hackathon') router.push('/vault/hackathon');
    else router.push('/vault/horizon');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 selection:bg-sky-500/30 selection:text-sky-200">
      <div className="ambient-radiance" />

      <div className="w-full max-w-2xl bg-slate-900/90 border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-sky-500/10 text-left relative z-10">
        
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center font-bold text-sm">
              🔥
            </span>
            <div>
              <div className="font-bold text-white">PHOENIX ONBOARDING</div>
              <div className="text-[10px] text-slate-400">Zero Cross-Domain Data Pollution</div>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-white/10 text-slate-300 font-bold">
            STEP {step} OF 2
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                What is your primary goal right now?
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Select your focus so we customize your tools without cluttering you with irrelevant questions.
              </p>
            </div>

            {/* Domain Selection Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Option A: Interview */}
              <div
                onClick={() => setSelectedDomain('interview')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedDomain === 'interview'
                    ? 'bg-indigo-950/50 border-indigo-500 shadow-lg shadow-indigo-500/15'
                    : 'bg-slate-950/60 border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="text-3xl mb-3">💼</div>
                  <h3 className="font-bold text-white text-base mb-1 font-heading">Placement &amp; Voice AI</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    FAANG mock voice interviews, live AI Sentinel prober, and system design whiteboards.
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold text-indigo-400 mt-4">
                  {selectedDomain === 'interview' ? '● SELECTED' : 'SELECT ➔'}
                </span>
              </div>

              {/* Option B: Hackathon */}
              <div
                onClick={() => setSelectedDomain('hackathon')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedDomain === 'hackathon'
                    ? 'bg-emerald-950/50 border-emerald-500 shadow-lg shadow-emerald-500/15'
                    : 'bg-slate-950/60 border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="text-3xl mb-3">🏆</div>
                  <h3 className="font-bold text-white text-base mb-1 font-heading">Hackathon OS</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Discord-style squad chat, split role copilots, 180s stage teleprompter, and Devpost submission.
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 mt-4">
                  {selectedDomain === 'hackathon' ? '● SELECTED' : 'SELECT ➔'}
                </span>
              </div>

              {/* Option C: Horizon */}
              <div
                onClick={() => setSelectedDomain('horizon')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedDomain === 'horizon'
                    ? 'bg-sky-950/50 border-sky-500 shadow-lg shadow-sky-500/15'
                    : 'bg-slate-950/60 border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="text-3xl mb-3">🌅</div>
                  <h3 className="font-bold text-white text-base mb-1 font-heading">Horizon Admissions</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Karnataka KEA KCET/DCET state rank matrices, category quotas, and VTU CGPA converters.
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold text-sky-400 mt-4">
                  {selectedDomain === 'horizon' ? '● SELECTED' : 'SELECT ➔'}
                </span>
              </div>

            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl font-mono font-bold text-xs bg-gradient-to-r from-sky-400 via-indigo-500 to-emerald-400 text-slate-950 hover:brightness-110 transition-all shadow-lg shadow-sky-500/20"
              >
                CONTINUE TO DETAILS ➔
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleComplete} className="space-y-5 animate-fadeIn">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
                Customize your {selectedDomain.toUpperCase()} profile
              </h1>
              <p className="text-slate-400 text-xs font-mono">
                We only ask what is strictly relevant to your chosen domain.
              </p>
            </div>

            {/* Candidate Identity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-bold">FULL NAME</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-sky-400 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-bold">EMAIL</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-sky-400 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* DOMAIN SPECIFIC FIELDS */}
            {selectedDomain === 'interview' && (
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/25 space-y-3 font-mono text-xs">
                <div className="text-indigo-300 font-bold">💼 Interview Parameters:</div>
                <div>
                  <label className="block text-slate-300 mb-1">Target Role</label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-indigo-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Core Tech Stack</label>
                  <input
                    type="text"
                    value={techStack}
                    onChange={(e) => setTechStack(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-indigo-400 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {selectedDomain === 'hackathon' && (
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/25 space-y-3 font-mono text-xs">
                <div className="text-emerald-300 font-bold">🏆 Hackathon Parameters:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1">Squad Name</label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Your Role in Squad</label>
                    <select
                      value={squadRole}
                      onChange={(e) => setSquadRole(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-emerald-400 focus:outline-none"
                    >
                      <option value="Lead Full-Stack & Systems Architect">Lead Full-Stack &amp; Systems Architect</option>
                      <option value="Frontend Specialist">Frontend Specialist</option>
                      <option value="Backend & Database Engineer">Backend &amp; Database Engineer</option>
                      <option value="Pitch & Product Storyteller">Pitch &amp; Product Storyteller</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {selectedDomain === 'horizon' && (
              <div className="p-4 rounded-2xl bg-sky-950/30 border border-sky-500/25 space-y-3 font-mono text-xs">
                <div className="text-sky-300 font-bold">🌅 Karnataka Admissions Parameters:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1">KCET / DCET State Rank</label>
                    <input
                      type="number"
                      value={candidateRank}
                      onChange={(e) => setCandidateRank(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-sky-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Reservation Category</label>
                    <select
                      value={categoryQuota}
                      onChange={(e) => setCategoryQuota(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-sky-400 focus:outline-none"
                    >
                      <option value="GM">General Merit (GM)</option>
                      <option value="2A">Category 2A (2A)</option>
                      <option value="2B">Category 2B (2B)</option>
                      <option value="3A">Category 3A (3A)</option>
                      <option value="3B">Category 3B (3B)</option>
                      <option value="SC">SC / ST</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 flex items-center justify-between border-t border-white/10">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl font-mono text-xs text-slate-400 hover:text-white"
              >
                ← Back
              </button>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl font-mono font-bold text-xs bg-gradient-to-r from-sky-400 via-indigo-500 to-emerald-400 text-slate-950 hover:brightness-110 transition-all shadow-lg shadow-sky-500/20"
              >
                LAUNCH {selectedDomain.toUpperCase()} SUITE ➔
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
