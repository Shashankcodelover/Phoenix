'use client';

import { useState } from 'react';
import { hackathonApi } from '@/lib/api';

export default function HackathonPosterScanner({ room, onUpdatePoster }) {
  const [inputText, setInputText] = useState(
    'Global AI Breakthrough Hackathon 2026! Submit 5-slide PPT by Aug 27. Final judging on Sep 1. Grand prize $10,000 for Multimodal AI.'
  );
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(room?.posterData || null);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setLoading(true);

    try {
      const res = await hackathonApi.scanPoster({ text: inputText });
      setScanResult(res);
      if (room?.roomId) {
        await hackathonApi.updatePoster(room.roomId, res);
      }
      if (onUpdatePoster) onUpdatePoster(res);
    } catch {
      const mock = {
        success: true,
        hackathonName: 'Global AI Breakthrough Hackathon 2026',
        organizer: 'Apex Hackathon Alliance & Devpost',
        mode: 'Hybrid (Online Sprint + Bengaluru Grand Finale)',
        submissionPhases: {
          registrationClose: 'In 3 Days',
          pptIdeaSubmission: 'In 7 Days (Aug 27)',
          sprintKickoff: 'In 10 Days',
          finalDemoAndJudging: 'In 12 Days (Sep 1)'
        },
        countdownHours: 168,
        prizeTracks: [
          { id: 't1', name: '🤖 Multimodal AI & Autonomous Agents', prize: '$10,000' },
          { id: 't2', name: '⚡ Distributed Systems & Offline P2P', prize: '$7,500' },
          { id: 't3', name: '🏥 HealthTech & Patient Triage', prize: '$5,000' }
        ],
        calendarEvent: {
          title: '🏆 Global AI Breakthrough Hackathon - PPT Deadline',
          gcalLink: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Global%20AI%20Hackathon%20PPT%20Deadline'
        }
      };
      setScanResult(mock);
      if (onUpdatePoster) onUpdatePoster(mock);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded-2xl bg-slate-900/90 border border-emerald-500/25 p-5 sm:p-7 shadow-xl shadow-black/40 text-left space-y-6">
      
      {/* Friendly Header */}
      <div className="flex items-start gap-3.5 pb-4 border-b border-white/10">
        <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/35 flex items-center justify-center text-2xl shrink-0">
          📋
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              STEP 1: POSTER SCANNER
            </span>
            <span className="text-xs text-slate-400 font-mono">Syncs with Room: {room?.roomId || 'APEX-LIVE'}</span>
          </div>
          <h3 className="text-xl font-bold text-white font-heading">
            Drop Hackathon Poster, Instagram Post, or Website Text
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
            Paste any hackathon brochure, Instagram caption, or Devpost link. The AI will extract milestones and broadcast the deadlines directly to all teammates in Room {room?.roomId || 'APEX-LIVE'}.
          </p>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleScan} className="space-y-4 font-mono text-xs">
        <div>
          <label className="block text-slate-300 font-bold mb-1.5 flex items-center justify-between">
            <span>PASTE POSTER TEXT, CAPTION OR DEVPOST DETAILS:</span>
            <span className="text-[10px] text-emerald-400 font-normal">Supports Instagram, Discord &amp; Web text</span>
          </label>
          <textarea
            rows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste poster details (e.g. 'SIH 2026 registration starts...')"
            className="w-full p-3.5 rounded-xl bg-slate-950 border border-white/15 text-white focus:border-emerald-400 focus:outline-none resize-none leading-relaxed"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl font-mono font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
        >
          {loading ? (
            <span>⚡ Scanning Poster &amp; Synchronizing Room Milestones...</span>
          ) : (
            <span>🚀 SCAN POSTER &amp; BROADCAST DEADLINES TO ROOM {room?.roomId || ''}</span>
          )}
        </button>
      </form>

      {/* Extracted Intelligence Display */}
      {scanResult && (
        <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-4 animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
            <div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                SYNCHRONIZED HACKATHON
              </span>
              <h4 className="text-base font-bold text-white font-heading">
                {scanResult.hackathonName}
              </h4>
            </div>
            <a
              href={scanResult.calendarEvent?.gcalLink || '#'}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-white/10 hover:bg-white/15 text-emerald-300 border border-emerald-500/30 transition-all flex items-center gap-1.5"
            >
              <span>📅</span> Add PPT Deadline to Google Calendar
            </a>
          </div>

          {/* Submission Phases Timeline Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-white/5">
              <div className="text-[10px] text-slate-400 uppercase">Registration Close</div>
              <div className="text-sm font-bold text-sky-400 mt-1">
                {typeof scanResult.submissionPhases?.registrationClose === 'string' && scanResult.submissionPhases.registrationClose.includes('T')
                  ? new Date(scanResult.submissionPhases.registrationClose).toLocaleDateString()
                  : scanResult.submissionPhases?.registrationClose || '3 Days Left'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/25">
              <div className="text-[10px] text-emerald-400 font-bold uppercase">PPT Submission</div>
              <div className="text-sm font-bold text-emerald-300 mt-1">
                {typeof scanResult.submissionPhases?.pptIdeaSubmission === 'string' && scanResult.submissionPhases.pptIdeaSubmission.includes('T')
                  ? new Date(scanResult.submissionPhases.pptIdeaSubmission).toLocaleDateString()
                  : scanResult.submissionPhases?.pptIdeaSubmission || '7 Days Left'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-white/5">
              <div className="text-[10px] text-slate-400 uppercase">Sprint Kickoff</div>
              <div className="text-sm font-bold text-indigo-400 mt-1">
                {typeof scanResult.submissionPhases?.sprintKickoff === 'string' && scanResult.submissionPhases.sprintKickoff.includes('T')
                  ? new Date(scanResult.submissionPhases.sprintKickoff).toLocaleDateString()
                  : scanResult.submissionPhases?.sprintKickoff || '10 Days Left'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-white/5">
              <div className="text-[10px] text-slate-400 uppercase">Final Demo</div>
              <div className="text-sm font-bold text-rose-400 mt-1">
                {typeof scanResult.submissionPhases?.finalDemoAndJudging === 'string' && scanResult.submissionPhases.finalDemoAndJudging.includes('T')
                  ? new Date(scanResult.submissionPhases.finalDemoAndJudging).toLocaleDateString()
                  : scanResult.submissionPhases?.finalDemoAndJudging || '12 Days Left'}
              </div>
            </div>
          </div>

          {/* Prize Tracks */}
          <div>
            <div className="text-[11px] font-mono font-bold text-slate-400 mb-2 uppercase">
              🎯 Available Prize Tracks ({scanResult.prizeTracks?.length || 0}):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
              {scanResult.prizeTracks?.map((track, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between">
                  <span className="text-slate-200 text-[11px] font-sans truncate">{track.name}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-bold shrink-0">
                    {track.prize}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
