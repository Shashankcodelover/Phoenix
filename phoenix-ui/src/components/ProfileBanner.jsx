'use client';

import { useState, useEffect } from 'react';
import { getStoredProfile } from '@/lib/profileStore';
import DomainProfileModal from '@/components/DomainProfileModal';

export default function ProfileBanner({ activeVault = 'interview' }) {
  const [profile, setProfile] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadProfile = () => {
    setProfile(getStoredProfile());
  };

  useEffect(() => {
    loadProfile();
    const handleUpdate = () => loadProfile();
    window.addEventListener('phoenix_profile_updated', handleUpdate);
    return () => window.removeEventListener('phoenix_profile_updated', handleUpdate);
  }, []);

  if (!profile) return null;

  return (
    <>
      <div className="w-full mb-8 p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-white/10 flex flex-wrap items-center justify-between gap-3 shadow-lg shadow-black/40 text-left">
        
        {/* Left: User Identity + Domain Pill */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-500 p-0.5 flex items-center justify-center text-lg shadow-md">
            {activeVault === 'interview' && '💼'}
            {activeVault === 'hackathon' && '🏆'}
            {activeVault === 'horizon' && '🌅'}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white font-heading">
                {profile.name || 'Candidate'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                PROFILE ACTIVE
              </span>
            </div>

            {/* Dynamic Domain Specific Context Line */}
            <div className="text-xs text-slate-400 font-mono mt-0.5 flex flex-wrap items-center gap-2">
              {activeVault === 'interview' && (
                <>
                  <span className="text-indigo-300 font-semibold">{profile.interviewProfile?.targetRole || 'Distributed Systems Engineer'}</span>
                  <span>•</span>
                  <span className="text-slate-400">{profile.interviewProfile?.targetCompanyTier || 'FAANG / Tier-1'}</span>
                </>
              )}

              {activeVault === 'hackathon' && (
                <>
                  <span className="text-emerald-300 font-semibold">{profile.hackathonProfile?.teamName || 'Team Apex'}</span>
                  <span>•</span>
                  <span className="text-slate-400">{profile.hackathonProfile?.squadRole || 'Lead Architect'}</span>
                </>
              )}

              {activeVault === 'horizon' && (
                <>
                  <span className="text-sky-300 font-semibold">State Rank: #{profile.horizonProfile?.candidateRank || 1850}</span>
                  <span>•</span>
                  <span className="text-slate-400">Category: {profile.horizonProfile?.categoryQuota || '2A'} {profile.horizonProfile?.hyderabadKarnataka371J ? '(371J)' : ''}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Quick Action to open domain modal */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white transition-all flex items-center gap-1.5"
          >
            <span>⚙️</span> Edit {activeVault.toUpperCase()} Profile
          </button>
        </div>

      </div>

      {/* Domain Specific Modal */}
      <DomainProfileModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        activeDomain={activeVault}
      />
    </>
  );
}
