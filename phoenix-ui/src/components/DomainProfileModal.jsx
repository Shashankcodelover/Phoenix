'use client';

import { useState, useEffect } from 'react';
import { getStoredProfile, saveStoredProfile } from '@/lib/profileStore';

export default function DomainProfileModal({ isOpen, onClose, activeDomain = 'interview' }) {
  const [profile, setProfile] = useState(null);
  const [domain, setDomain] = useState(activeDomain);
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    setProfile(getStoredProfile());
    setDomain(activeDomain);
  }, [isOpen, activeDomain]);

  if (!isOpen || !profile) return null;

  const handleSave = (e) => {
    e.preventDefault();
    saveStoredProfile(profile);
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-950 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-sky-500/10 text-left overflow-y-auto max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-5 mb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-500 p-0.5 flex items-center justify-center text-xl">
              ⚙️
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-heading">
                Candidate Apex Profile Blueprint
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Segmented by domain • Zero cross-pillar data pollution
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Domain Switcher Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-white/10 mb-6 font-mono text-xs">
          <button
            type="button"
            onClick={() => setDomain('interview')}
            className={`flex-1 py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
              domain === 'interview'
                ? 'bg-indigo-500/25 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            💼 Placement &amp; Voice
          </button>
          <button
            type="button"
            onClick={() => setDomain('hackathon')}
            className={`flex-1 py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
              domain === 'hackathon'
                ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🏆 Hackathon OS
          </button>
          <button
            type="button"
            onClick={() => setDomain('horizon')}
            className={`flex-1 py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
              domain === 'horizon'
                ? 'bg-sky-500/25 text-sky-300 border border-sky-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🌅 Horizon Admissions
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Identity Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5">
                CANDIDATE FULL NAME
              </label>
              <input
                type="text"
                value={profile.name || ''}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:border-sky-400 focus:outline-none font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-slate-400 mb-1.5">
                PRIMARY EMAIL
              </label>
              <input
                type="email"
                value={profile.email || ''}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:border-sky-400 focus:outline-none font-medium"
                required
              />
            </div>
          </div>

          {/* 💼 DOMAIN 1: INTERVIEW & PLACEMENT */}
          {domain === 'interview' && (
            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/25 space-y-4">
              <div className="text-xs font-mono font-extrabold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                <span>💼</span> Technical Placement Profile Context
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1 font-semibold">Target Engineering Role</label>
                <input
                  type="text"
                  value={profile.interviewProfile?.targetRole || ''}
                  onChange={(e) => setProfile({
                    ...profile,
                    interviewProfile: { ...profile.interviewProfile, targetRole: e.target.value }
                  })}
                  placeholder="e.g. Senior Distributed Systems / Full-Stack Engineer"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:border-indigo-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1 font-semibold">Target Company Tier</label>
                  <select
                    value={profile.interviewProfile?.targetCompanyTier || 'FAANG / Tier-1 Tech'}
                    onChange={(e) => setProfile({
                      ...profile,
                      interviewProfile: { ...profile.interviewProfile, targetCompanyTier: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:border-indigo-400 focus:outline-none font-mono text-xs"
                  >
                    <option value="FAANG / Tier-1 Tech (Google, Uber, Stripe)">FAANG / Tier-1 Tech (Google, Uber, Stripe)</option>
                    <option value="Series B+ Fast-Growing Unicorns">Series B+ Fast-Growing Unicorns</option>
                    <option value="High-Frequency Trading (HFT / Jane Street)">High-Frequency Trading (HFT / Jane Street)</option>
                    <option value="Early-Stage YC Seed Startups">Early-Stage YC Seed Startups</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1 font-semibold">DSA / LeetCode Rating</label>
                  <input
                    type="text"
                    value={profile.interviewProfile?.dsaProficiency || ''}
                    onChange={(e) => setProfile({
                      ...profile,
                      interviewProfile: { ...profile.interviewProfile, dsaProficiency: e.target.value }
                    })}
                    placeholder="e.g. 350+ Solved, Guardian (2150)"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:border-indigo-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1 font-semibold">System Design Focus Areas</label>
                <input
                  type="text"
                  value={profile.interviewProfile?.systemDesignFocus || ''}
                  onChange={(e) => setProfile({
                    ...profile,
                    interviewProfile: { ...profile.interviewProfile, systemDesignFocus: e.target.value }
                  })}
                  placeholder="e.g. Distributed Caching, Rate Limiters, WebSockets, CRDTs"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:border-indigo-400 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* 🏆 DOMAIN 2: HACKATHON OS */}
          {domain === 'hackathon' && (
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/25 space-y-4">
              <div className="text-xs font-mono font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <span>🏆</span> Hackathon Squad &amp; Project Blueprint
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1 font-semibold">Squad Team Name</label>
                  <input
                    type="text"
                    value={profile.hackathonProfile?.teamName || ''}
                    onChange={(e) => setProfile({
                      ...profile,
                      hackathonProfile: { ...profile.hackathonProfile, teamName: e.target.value }
                    })}
                    placeholder="e.g. Team Phoenix Apex"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:border-emerald-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1 font-semibold">Your Squad Role</label>
                  <select
                    value={profile.hackathonProfile?.squadRole || 'Lead Full-Stack & Systems Architect'}
                    onChange={(e) => setProfile({
                      ...profile,
                      hackathonProfile: { ...profile.hackathonProfile, squadRole: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:border-emerald-400 focus:outline-none font-mono text-xs"
                  >
                    <option value="Lead Full-Stack & Systems Architect">Lead Full-Stack &amp; Systems Architect</option>
                    <option value="Frontend & Interaction Specialist">Frontend &amp; Interaction Specialist</option>
                    <option value="Backend & Database / RAG Engineer">Backend &amp; Database / RAG Engineer</option>
                    <option value="Pitch Specialist & Product Storyteller">Pitch Specialist &amp; Product Storyteller</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1 font-semibold">Active Hackathon Target &amp; Track</label>
                <input
                  type="text"
                  value={profile.hackathonProfile?.targetTrack || ''}
                  onChange={(e) => setProfile({
                    ...profile,
                    hackathonProfile: { ...profile.hackathonProfile, targetTrack: e.target.value }
                  })}
                  placeholder="e.g. Best Multimodal AI & Real-Time Collaboration Hack"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1 font-semibold">Active Project / Prototype Title</label>
                <input
                  type="text"
                  value={profile.hackathonProfile?.activeIdea || ''}
                  onChange={(e) => setProfile({
                    ...profile,
                    hackathonProfile: { ...profile.hackathonProfile, activeIdea: e.target.value }
                  })}
                  placeholder="e.g. NexusAudio — Sub-300ms Multimodal Voice Coaching & CRDT IDE"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:border-emerald-400 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* 🌅 DOMAIN 3: HORIZON ADMISSIONS */}
          {domain === 'horizon' && (
            <div className="p-4 rounded-2xl bg-sky-950/30 border border-sky-500/25 space-y-4">
              <div className="text-xs font-mono font-extrabold text-sky-400 uppercase tracking-wider flex items-center gap-2">
                <span>🌅</span> Karnataka KEA &amp; Admissions Parameters
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1 font-semibold">Entrance Exam</label>
                  <select
                    value={profile.horizonProfile?.stream || 'KCET'}
                    onChange={(e) => setProfile({
                      ...profile,
                      horizonProfile: { ...profile.horizonProfile, stream: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:border-sky-400 focus:outline-none font-mono text-xs"
                  >
                    <option value="KCET">KCET (Karnataka CET)</option>
                    <option value="DCET">DCET (Diploma Lateral Entry)</option>
                    <option value="COMEDK">COMEDK (All India)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1 font-semibold">Karnataka State Rank</label>
                  <input
                    type="number"
                    value={profile.horizonProfile?.candidateRank || 1850}
                    onChange={(e) => setProfile({
                      ...profile,
                      horizonProfile: { ...profile.horizonProfile, candidateRank: Number(e.target.value) }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:border-sky-400 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1 font-semibold">Category Quota</label>
                  <select
                    value={profile.horizonProfile?.categoryQuota || '2A'}
                    onChange={(e) => setProfile({
                      ...profile,
                      horizonProfile: { ...profile.horizonProfile, categoryQuota: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:border-sky-400 focus:outline-none font-mono text-xs"
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
              </div>

              {/* Reservations toggles */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={!!profile.horizonProfile?.hyderabadKarnataka371J}
                    onChange={(e) => setProfile({
                      ...profile,
                      horizonProfile: { ...profile.horizonProfile, hyderabadKarnataka371J: e.target.checked }
                    })}
                    className="rounded bg-slate-900 border-white/20 text-sky-400"
                  />
                  <span>Article 371(J) Hyd-Karnataka Quota</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={!!profile.horizonProfile?.ruralReservation}
                    onChange={(e) => setProfile({
                      ...profile,
                      horizonProfile: { ...profile.horizonProfile, ruralReservation: e.target.checked }
                    })}
                    className="rounded bg-slate-900 border-white/20 text-sky-400"
                  />
                  <span>Rural Medium Quota</span>
                </label>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            {savedToast ? (
              <span className="text-emerald-400 text-xs font-mono flex items-center gap-1.5 animate-pulse">
                ✓ Saved &amp; Synced with Apex AI Engine
              </span>
            ) : (
              <span className="text-slate-500 text-xs font-mono">
                Auto-syncs across all 66 engines
              </span>
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-sky-400 via-indigo-500 to-emerald-400 text-slate-950 hover:brightness-110 transition-all shadow-lg shadow-sky-500/20"
              >
                SAVE BLUEPRINT ➔
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
