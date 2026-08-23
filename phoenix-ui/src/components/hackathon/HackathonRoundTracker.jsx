'use client';

import { useState, useEffect } from 'react';
import { hackathonApi } from '@/lib/api';

export default function HackathonRoundTracker({ room, onRoundChange }) {
  const roomId = room?.roomId || 'ROOM-APEX-1001';
  const members = room?.members || [];
  const memberCount = members.length;
  const problemStatement = room?.lockedProblemStatement || 'NexusAudio: Sub-300ms Multimodal Voice Coaching & CRDT Vector IDE';

  const [activeRound, setActiveRound] = useState(room?.currentRound || 'ROUND_3_STAGE_PITCH');
  const [roundAssets, setRoundAssets] = useState(null);
  const [loading, setLoading] = useState(false);
  const [teleprompterActive, setTeleprompterActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(180);
  const [timerRunning, setTimerRunning] = useState(false);

  const rounds = [
    { id: 'ROUND_1_INCEPTION', num: 'R1', name: 'Inception & PPT Submission', desc: '5-slide narrative & problem hook' },
    { id: 'ROUND_2_MENTORING', num: 'R2', name: 'Mid-Sprint Mentor Check', desc: 'Architecture validation & trade-offs' },
    { id: 'ROUND_3_STAGE_PITCH', num: 'R3', name: 'Stage Pitch & Demo Rehearsal', desc: '180s script & judge defense' },
    { id: 'ROUND_4_FINALE', num: 'R4', name: 'Grand Finale & Deployment', desc: 'Vercel, Docker & Devpost release' }
  ];

  const fetchRoundAssets = async (roundKey) => {
    setLoading(true);
    try {
      const res = await hackathonApi.getRoomRoundAssets(roomId, roundKey);
      if (res.success) {
        setRoundAssets(res);
      }
    } catch {
      // Clean fallback
      setRoundAssets({
        stageScript180s: {
          totalDurationSeconds: 180,
          targetWpm: 135,
          sections: [
            {
              timestamp: '00:00 - 00:30',
              speaker: members[0]?.name || 'Lead Presenter',
              phase: 'Opening Hook & Pain Point',
              script: `Respected judges, remote engineering teams lose 40% of architectural context switching between Zoom, Figma, and VSCode. Existing SaaS tools charge $30/month with over 600ms latency. Today, our ${memberCount}-member squad built ${problemStatement} — a zero-cloud-egress workspace with sub-300ms WebRTC audio and collaborative CRDT whiteboard at $0.00 infrastructure cost.`
            },
            {
              timestamp: '00:30 - 01:15',
              speaker: members[1]?.name || members[0]?.name,
              phase: 'Live Working Demonstration',
              script: `Let us show you this live. Here are our ${memberCount} teammates connected in Room ${roomId}. As I draw this system topology node, delta vectors sync peer-to-peer in under 20ms. Notice our 12-bar WebAudio visualizer processing acoustic noise suppression directly in WebAssembly.`
            },
            {
              timestamp: '01:15 - 02:15',
              speaker: members[2]?.name || members[0]?.name,
              phase: 'Technical Architecture & Competitive Moat',
              script: `Under the hood, all audio and canvas frames travel directly peer-to-peer over WebRTC data channels with zero media server transcoding. Our embedded Gemini AI Senior Copilot evaluates system trade-offs in sub-50ms. We validated this with an 88-test automated test suite.`
            },
            {
              timestamp: '02:15 - 03:00',
              speaker: members[0]?.name,
              phase: 'Vision & Q&A Transition',
              script: `NexusAudio is 100% free, open-source, and offline-resilient. We are excited to take your technical questions on scalability and concurrency!`
            }
          ]
        },
        judgeCounterDefense: [
          {
            id: 'q1',
            judgeQuestion: '"How does your WebRTC mesh scale when team size grows beyond 10 members?"',
            counterDefense: '"For hackathon squads (2-6 members), full P2P mesh offers lowest latency (<30ms) at $0 cost. For larger enterprise rooms, our architecture transitions to a Selective Forwarding Unit (SFU) using mediasoup with zero client-side architectural rewrites."',
            confidenceScore: 98
          },
          {
            id: 'q2',
            judgeQuestion: '"What happens if the venue Wi-Fi crashes midway through your presentation?"',
            counterDefense: '"We designed an offline-first LocalStorage and IndexedDB emergency cache. All local canvas changes and audio buffers queue locally and auto-reconcile using Merkle trees once connection recovers."',
            confidenceScore: 96
          },
          {
            id: 'q3',
            judgeQuestion: '"Why wouldn\'t users just use Discord voice combined with Excalidraw?"',
            counterDefense: '"Discord and Excalidraw have zero code AST context. Our Central AI Copilot reads live code state and whiteboards simultaneously to generate architectural follow-ups in real time."',
            confidenceScore: 95
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoundAssets(activeRound);
  }, [roomId, activeRound, memberCount]);

  const handleSelectRound = async (roundKey) => {
    setActiveRound(roundKey);
    try {
      await hackathonApi.setRoomRound(roomId, roundKey);
      if (onRoundChange) onRoundChange(roundKey);
    } catch {}
  };

  // 180s Rehearsal Timer Loop
  useEffect(() => {
    let interval = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds(s => s - 1), 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const formatTimer = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full rounded-2xl bg-slate-900/90 border border-emerald-500/25 p-5 sm:p-7 shadow-xl shadow-black/40 text-left space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/35 flex items-center justify-center text-2xl shrink-0">
            🏆
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                MULTI-ROUND HACKATHON SUITE
              </span>
              <span className="text-xs text-slate-400 font-mono">From Inception to Winning Stage</span>
            </div>
            <h3 className="text-xl font-bold text-white font-heading">
              National Hackathon Stage Preparation &amp; Round Directives
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
              Scheduled milestone triggers: Prepare your PPT submission, mid-sprint mentor reviews, live 180-second stage pitch scripts, and tough judge counter-defenses for your {memberCount} teammates.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTeleprompterActive(!teleprompterActive)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              teleprompterActive
                ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-400/20'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
            }`}
          >
            <span>🎤</span> {teleprompterActive ? 'Hide Stage Teleprompter' : 'Launch 180s Stage Teleprompter'}
          </button>
        </div>
      </div>

      {/* 4 Rounds Pill Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 font-mono text-xs">
        {rounds.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => handleSelectRound(r.id)}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              activeRound === r.id
                ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500 font-bold shadow-md shadow-emerald-500/15'
                : 'bg-slate-950 border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-slate-300 font-bold">{r.num}</span>
              {activeRound === r.id && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              )}
            </div>
            <div className="font-heading font-bold text-white text-xs truncate">{r.name}</div>
            <div className="text-[10px] text-slate-400 truncate mt-0.5">{r.desc}</div>
          </button>
        ))}
      </div>

      {/* Live Stage Rehearsal Teleprompter Mode */}
      {teleprompterActive && (
        <div className="p-6 rounded-2xl bg-slate-950 border-2 border-emerald-400 space-y-4 animate-fadeIn shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                STAGE REHEARSAL TELEPROMPTER • TARGET: 135 WPM
              </span>
              <h4 className="text-base font-bold text-white font-heading">
                180-Second Live Pitch Script ({memberCount} Speakers)
              </h4>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="text-xl font-extrabold text-emerald-300 px-3 py-1 rounded-xl bg-slate-900 border border-emerald-500/40">
                ⏱️ {formatTimer(timerSeconds)}
              </span>
              <button
                type="button"
                onClick={() => setTimerRunning(!timerRunning)}
                className="px-3.5 py-1.5 rounded-xl font-bold bg-white/10 hover:bg-white/15 text-slate-200 border border-white/20"
              >
                {timerRunning ? '⏸️ Pause' : '▶️ Start Timer'}
              </button>
              <button
                type="button"
                onClick={() => { setTimerRunning(false); setTimerSeconds(180); }}
                className="px-2.5 py-1.5 rounded-xl text-[10px] text-slate-400 hover:text-white"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Script Paragraphs */}
          <div className="space-y-4 max-h-[340px] overflow-y-auto pr-2 text-xs font-sans leading-relaxed">
            {roundAssets?.stageScript180s?.sections?.map((sec, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-1">
                <div className="flex items-center justify-between font-mono text-[11px] text-emerald-400 font-bold mb-1">
                  <span>⏱️ {sec.timestamp} • {sec.phase}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    Speaker: {sec.speaker}
                  </span>
                </div>
                <p className="text-slate-200 text-sm italic font-serif">
                  {sec.script}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Tough Judge Counter-Defense Matrix */}
      <div className="space-y-3 font-mono text-xs pt-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-white uppercase text-xs">
            🛡️ Top Judge Objections &amp; Winning Counter-Defenses:
          </span>
          <span className="text-emerald-400 text-[11px]">
            Calibrated for National Hackathon Jury
          </span>
        </div>

        <div className="space-y-3">
          {roundAssets?.judgeCounterDefense?.map((item) => (
            <div key={item.id} className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="text-amber-300 font-bold text-xs font-heading">
                  🚨 Judge Question: {item.judgeQuestion}
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold shrink-0">
                  {item.confidenceScore}% Defense Confidence
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-emerald-500/20 text-slate-200 text-xs font-sans leading-relaxed">
                <strong className="text-emerald-400 font-mono text-[11px] block mb-0.5">✅ SQUAD COUNTER-DEFENSE:</strong>
                {item.counterDefense}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
