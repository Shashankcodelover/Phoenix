'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ProfileBanner from '@/components/ProfileBanner';
import HackathonPosterScanner from '@/components/hackathon/HackathonPosterScanner';
import TeamServerCreation from '@/components/hackathon/TeamServerCreation';
import IdeaGenerationLab from '@/components/hackathon/IdeaGenerationLab';
import SixDocumentsViewer from '@/components/hackathon/SixDocumentsViewer';
import CrazyFeaturesLab from '@/components/hackathon/CrazyFeaturesLab';
import HackathonJiraPipeline from '@/components/hackathon/HackathonJiraPipeline';
import DiscordTeamChat from '@/components/DiscordTeamChat';
import ProjectOnePager from '@/components/hackathon/ProjectOnePager';
import DeepBuildGuide from '@/components/hackathon/DeepBuildGuide';
import CloudPresentationStudio from '@/components/hackathon/CloudPresentationStudio';
import HackathonRoundTracker from '@/components/hackathon/HackathonRoundTracker';
import SubmissionPackager from '@/components/hackathon/SubmissionPackager';
import HackathonEnginesHub from '@/components/hackathon/HackathonEnginesHub';
import MultiModelMatrix from '@/components/hackathon/MultiModelMatrix';
import { hackathonApi } from '@/lib/api';

export default function HackathonVaultPage() {
  const [currentStep, setCurrentStep] = useState(1);

  // Centralized Dynamic Room State
  const [room, setRoom] = useState({
    roomId: 'ROOM-APEX-4821',
    squadName: 'Team Phoenix Nexus',
    hackathonName: 'National AI Breakthrough Hackathon 2026',
    activeDomain: 'AI & Developer Tools',
    lockedProblemStatement: 'NexusAudio: Sub-300ms Multimodal Voice Coaching & CRDT Vector IDE',
    currentRound: 'ROUND_3_STAGE_PITCH',
    members: [
      {
        id: 'mem_1',
        name: 'Shashank J',
        role: 'Lead Full-Stack & Systems Architect',
        skills: 'React, Node.js, WebRTC, CRDTs',
        avatar: '👨‍💻',
        isLeader: true,
        status: 'Online'
      }
    ],
    selectedFeatures: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f10'],
    ideaVotes: { idea_1: 1 }
  });

  // Fetch or initialize room on mount
  useEffect(() => {
    const initRoom = async () => {
      try {
        const res = await hackathonApi.createRoom({
          squadName: 'Team Phoenix Nexus',
          leaderName: 'Shashank J',
          leaderRole: 'Lead Full-Stack & Systems Architect'
        });
        if (res.success && res.room) {
          setRoom(res.room);
        }
      } catch (err) {
        console.log('Room initialized locally');
      }
    };
    initRoom();
  }, []);

  const handleRoomUpdate = (updatedRoom) => {
    setRoom(prev => ({ ...prev, ...updatedRoom }));
  };

  const handleUpdatePoster = (posterData) => {
    setRoom(prev => ({
      ...prev,
      posterData,
      hackathonName: posterData.hackathonName || prev.hackathonName
    }));
  };

  const handleProblemStatementLocked = (idea) => {
    setRoom(prev => ({
      ...prev,
      lockedProblemStatement: idea.title
    }));
    setCurrentStep(4);
  };

  const handleRoundChange = (roundKey) => {
    setRoom(prev => ({ ...prev, currentRound: roundKey }));
  };

  const memberCount = room.members?.length || 1;

  const steps = [
    { num: 1, icon: '📋', title: 'Poster Radar', subtitle: 'Extract deadlines' },
    { num: 2, icon: '🎮', title: 'Squad Workspace', subtitle: `${memberCount} Member${memberCount > 1 ? 's' : ''} Joined` },
    { num: 3, icon: '💡', title: 'AI Idea Lab', subtitle: `${memberCount} Member${memberCount > 1 ? 's' : ''} Voting` },
    { num: 4, icon: '📚', title: '6 Foundation Docs', subtitle: `Calibrated for ${memberCount} Peers` },
    { num: 5, icon: '🚀', title: '25 Crazy Features', subtitle: 'Room Blueprint' },
    { num: 6, icon: '🗺️', title: 'JIRA Sprint Board', subtitle: 'Phase 1-5 Roadmap' },
    { num: 7, icon: '💬', title: 'Discord Squad Room', subtitle: `${memberCount} Copilots Active` },
    { num: 8, icon: '📝', title: 'Project One-Pager', subtitle: '8-Section Blueprint' },
    { num: 9, icon: '🏗️', title: 'Deep Build Guide', subtitle: 'Code-Level Execution' },
    { num: 10, icon: '📊', title: 'Cloud PPT Studio', subtitle: 'Marp & HTML Deck' },
    { num: 11, icon: '🎤', title: 'Stage Pitch Suite', subtitle: '180s Script & Defense' },
    { num: 12, icon: '📦', title: 'Submission Packager', subtitle: 'README & Devpost' },
    { num: 13, icon: '🔬', title: 'Post-Mortem', subtitle: 'Analytics & Retro' },
    { num: 14, icon: '⚡', title: '22 Engines Matrix', subtitle: 'Production Hub' }
  ];

  return (
    <div className="relative min-h-screen flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      <div className="ambient-radiance" />
      <Navbar activeVault="hackathon" />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full">
        
        {/* Domain Profile Context Banner */}
        <ProfileBanner activeVault="hackathon" />

        {/* Vault Header Hero with Room ID */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-theme-glass text-left">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-2xl">🏆</span>
              <span className="text-[11px] font-mono font-extrabold uppercase tracking-widest px-3 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/35">
                VAULT 3: HACKATHON OS • NATIONAL HACKATHON WINNING PIPELINE
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-theme-main tracking-tight font-heading">
              National Hackathon OS: From Inception to Grand Finale
            </h1>
            <p className="text-theme-muted text-xs sm:text-sm max-w-3xl mt-1 font-medium leading-relaxed">
              Arbitrary member scaling, mathematical workload division, peak-quality foundation documents, 180s stage pitch scripts, and real-time Discord copilots synchronized to Room <strong className="text-emerald-600 dark:text-emerald-300 font-mono font-bold">{room.roomId}</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-100/80 dark:bg-slate-900 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
              ROOM: {room.roomId}
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-100/80 dark:bg-slate-900 border border-theme-glass text-theme-main font-semibold shadow-sm">
              👥 {memberCount} Active Teammate{memberCount > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Step-by-Step Interactive Progress Stepper */}
        <div className="mb-8 p-2 rounded-2xl bg-theme-card border border-theme-glass shadow-xl overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 min-w-[1080px] font-mono text-xs">
            {steps.map((s) => {
              const isActive = currentStep === s.num;
              const isPassed = currentStep > s.num;

              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => setCurrentStep(s.num)}
                  className={`flex-1 p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                    isActive
                      ? 'bg-emerald-500/25 text-theme-main border-emerald-500 shadow-md shadow-emerald-500/15 font-bold ring-1 ring-emerald-400/50'
                      : isPassed
                      ? 'bg-slate-100 dark:bg-slate-900/90 text-emerald-700 dark:text-emerald-300 border-theme-glass'
                      : 'bg-transparent text-theme-subtle border-transparent hover:text-theme-main hover:bg-slate-100/50 dark:hover:bg-white/5'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                    isActive ? 'bg-emerald-500 text-slate-950 shadow-md' : isPassed ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-slate-200 dark:bg-slate-800 text-theme-subtle'
                  }`}>
                    {isPassed ? '✓' : s.num}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-xs font-heading font-bold">{s.title}</div>
                    <div className="truncate text-[9px] text-theme-subtle font-normal">{s.subtitle}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Step Content Container */}
        <div className="space-y-6 animate-fadeIn">
          
          {/* STEP 1: POSTER SCANNER & CALENDAR RADAR */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <HackathonPosterScanner room={room} onUpdatePoster={handleUpdatePoster} />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 rounded-xl font-mono font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  <span>NEXT: SQUAD SERVER &amp; DYNAMIC MEMBER INVITES</span>
                  <span>➔</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SQUAD SERVER & INVITES */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <TeamServerCreation room={room} onRoomUpdate={handleRoomUpdate} />
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 rounded-xl font-mono text-xs text-theme-subtle hover:text-theme-main"
                >
                  ← Back to Poster Scan
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 rounded-xl font-mono font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  <span>NEXT: START IDEA GENERATION ROUND ({memberCount} MEMBERS)</span>
                  <span>➔</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: 5-6 WINNING IDEAS LAB & POLLING */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <IdeaGenerationLab room={room} onProblemStatementLocked={handleProblemStatementLocked} />
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 rounded-xl font-mono text-xs text-theme-subtle hover:text-theme-main"
                >
                  ← Back to Squad Server
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-3 rounded-xl font-mono font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  <span>NEXT: VIEW 6 FOUNDATION DOCUMENTS</span>
                  <span>➔</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: 6 INCEPTION FOUNDATION DOCUMENTS */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <SixDocumentsViewer room={room} />
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2 rounded-xl font-mono text-xs text-theme-subtle hover:text-theme-main"
                >
                  ← Back to Idea Lab
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="px-6 py-3 rounded-xl font-mono font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  <span>NEXT: GENERATE 25 CRAZY &amp; MUST-HAVE FEATURES</span>
                  <span>➔</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: 25 CRAZY & MUST-HAVE FEATURES LAB */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <CrazyFeaturesLab room={room} />
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-4 py-2 rounded-xl font-mono text-xs text-theme-subtle hover:text-theme-main"
                >
                  ← Back to 6 Foundation Docs
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(6)}
                  className="px-6 py-3 rounded-xl font-mono font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  <span>NEXT: OPEN JIRA SPRINT ROADMAP &amp; FILE STRUCTURE</span>
                  <span>➔</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: JIRA SPRINT BOARD & FILE MAPPER */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <HackathonJiraPipeline room={room} />
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="px-4 py-2 rounded-xl font-mono text-xs text-theme-subtle hover:text-theme-main"
                >
                  ← Back to 25 Crazy Features
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(7)}
                  className="px-6 py-3 rounded-xl font-mono font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  <span>NEXT: OPEN DISCORD SQUAD ROOM ({memberCount} COPILOTS)</span>
                  <span>➔</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 7: DISCORD SQUAD ROOM */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <DiscordTeamChat room={room} />
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(6)}
                  className="px-4 py-2 rounded-xl font-mono text-xs text-theme-subtle hover:text-theme-main"
                >
                  ← Back to JIRA Sprint Board
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(8)}
                  className="px-6 py-3 rounded-xl font-mono font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  <span>NEXT: GENERATE PROJECT ONE-PAGER</span>
                  <span>➔</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 8: PROJECT ONE-PAGER */}
          {currentStep === 8 && (
            <div className="space-y-4">
              <ProjectOnePager room={room} />
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(7)}
                  className="px-4 py-2 rounded-xl font-mono text-xs text-theme-subtle hover:text-theme-main"
                >
                  ← Back to Discord Squad Room
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(9)}
                  className="px-6 py-3 rounded-xl font-mono font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  <span>NEXT: OPEN DEEP BUILD GUIDE</span>
                  <span>➔</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 9: DEEP BUILD GUIDE */}
          {currentStep === 9 && (
            <div className="space-y-4">
              <DeepBuildGuide room={room} />
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(8)}
                  className="px-4 py-2 rounded-xl font-mono text-xs text-theme-subtle hover:text-theme-main"
                >
                  ← Back to Project One-Pager
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(10)}
                  className="px-6 py-3 rounded-xl font-mono font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  <span>NEXT: OPEN CLOUD PRESENTATION &amp; PPT STUDIO</span>
                  <span>➔</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 10: CLOUD PRESENTATION & PPT STUDIO */}
          {currentStep === 10 && (
            <div className="space-y-4">
              <CloudPresentationStudio room={room} />
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(9)}
                  className="px-4 py-2 rounded-xl font-mono text-xs text-theme-subtle hover:text-theme-main"
                >
                  ← Back to Deep Build Guide
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(11)}
                  className="px-6 py-3 rounded-xl font-mono font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  <span>NEXT: OPEN STAGE PITCH SUITE (180s SCRIPT &amp; DEFENSE)</span>
                  <span>➔</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 11: STAGE PITCH SUITE & ROUND TRACKER */}
          {currentStep === 11 && (
            <div className="space-y-4">
              <HackathonRoundTracker room={room} onRoundChange={handleRoundChange} />
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(10)}
                  className="px-4 py-2 rounded-xl font-mono text-xs text-theme-subtle hover:text-theme-main"
                >
                  ← Back to Cloud Presentation Studio
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(12)}
                  className="px-6 py-3 rounded-xl font-mono font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  <span>NEXT: PACKAGE SUBMISSION (README &amp; DEVPOST)</span>
                  <span>➔</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 12: SUBMISSION PACKAGER */}
          {currentStep === 12 && (
            <div className="space-y-4">
              <SubmissionPackager room={room} />
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(11)}
                  className="px-4 py-2 rounded-xl font-mono text-xs text-theme-subtle hover:text-theme-main"
                >
                  ← Back to Stage Pitch Suite
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(13)}
                  className="px-6 py-3 rounded-xl font-mono font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  <span>NEXT: POST-MORTEM ANALYTICS &amp; RETRO</span>
                  <span>➔</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 13: POST-MORTEM ANALYTICS (Placeholder — uses Engines Hub for now) */}
          {currentStep === 13 && (
            <div className="space-y-4">
              <div className="w-full rounded-3xl bg-theme-card border border-emerald-500/30 p-5 sm:p-7 shadow-xl shadow-black/30 text-left space-y-5">
                <div className="flex items-start gap-3.5 pb-4 border-b border-theme-glass">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl shrink-0">🔬</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">STEP 13: POST-MORTEM</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-theme-main font-heading">Hackathon Post-Mortem Analytics &amp; Retrospective</h3>
                    <p className="text-xs text-theme-muted leading-relaxed mt-0.5 font-medium">
                      Team performance analytics, time allocation breakdown, feature completion rates, and retrospective notes. Coming soon.
                    </p>
                  </div>
                </div>
                <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-dashed border-theme-glass text-center space-y-3">
                  <div className="text-4xl">🔬</div>
                  <h4 className="text-sm font-bold text-theme-main font-heading">Post-Mortem Engine</h4>
                  <p className="text-xs text-theme-muted max-w-md mx-auto leading-relaxed">
                    After your hackathon concludes, this engine will generate a comprehensive retrospective covering time management, feature velocity, team dynamics, and improvement areas for your next competition.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(12)}
                  className="px-4 py-2 rounded-xl font-mono text-xs text-theme-subtle hover:text-theme-main"
                >
                  ← Back to Submission Packager
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(14)}
                  className="px-6 py-3 rounded-xl font-mono font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  <span>NEXT: EXPLORE 22 PRODUCTION ENGINES &amp; MULTI-MODEL MATRIX</span>
                  <span>➔</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 14: 22 ENGINES HUB & MULTI-MODEL MATRIX */}
          {currentStep === 14 && (
            <div className="space-y-6">
              <HackathonEnginesHub room={room} onSelectStep={setCurrentStep} />
              <MultiModelMatrix />
              <div className="flex justify-start">
                <button
                  type="button"
                  onClick={() => setCurrentStep(13)}
                  className="px-4 py-2 rounded-xl font-mono text-xs text-theme-subtle hover:text-theme-main"
                >
                  ← Back to Post-Mortem Analytics
                </button>
              </div>
            </div>
          )}

        </div>

      </main>
    </div>
  );
}
