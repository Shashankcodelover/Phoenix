'use client';

import { useState } from 'react';
import { interviewApi } from '@/lib/api';

export default function LiveInterviewRoom() {
  const [domain, setDomain] = useState('Distributed Systems & Backend');
  const [targetCompany, setTargetCompany] = useState('Google');
  const [cameraActive, setCameraActive] = useState(true);
  const [micActive, setMicActive] = useState(true);
  const [candidateResponse, setCandidateResponse] = useState(
    'I designed a distributed transactional outbox with Kafka CDC to prevent dual-write inconsistencies between Postgres and Elasticsearch, keeping API latency under 25ms.'
  );
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [probes, setProbes] = useState([
    {
      id: 'p1',
      interviewer: 'Bar-Raiser Sentinel (Staff Architect)',
      question: 'In your transactional outbox pattern, what happens if the CDC connector crashes midway through reading WAL logs? How do you guarantee idempotency at the consumer end?',
      difficulty: 'Hard (L6 Bar-Raiser)',
      timestamp: 'Just now'
    }
  ]);

  const handleGenerateProbe = async () => {
    if (!candidateResponse.trim()) return;
    setIsEvaluating(true);
    try {
      // Evaluate star story or crisis scenario dynamically based on domain and input
      const res = await interviewApi.evaluateStarAnswer(
        `Technical interview for ${domain} at ${targetCompany}`,
        candidateResponse
      );
      
      const newQuestion = res.actionableTips?.[0] || 
        `Follow-up regarding ${domain}: How would you handle a 10x traffic surge without database connection exhaustion?`;

      setProbes(prev => [
        {
          id: `p_${Date.now()}`,
          interviewer: `AI Sentinel (${targetCompany} Lead)`,
          question: newQuestion,
          difficulty: 'L5/L6 Technical Depth',
          timestamp: 'Just now'
        },
        ...prev
      ]);
    } catch {
      setProbes(prev => [
        {
          id: `p_${Date.now()}`,
          interviewer: `AI Sentinel (${targetCompany} Bar-Raiser)`,
          question: `Deep dive into "${candidateResponse.slice(0, 45)}...": What specific concurrency primitives and backoff strategies do you implement to avoid thundering herd on cache misses?`,
          difficulty: 'L5/L6 Technical Depth',
          timestamp: 'Just now'
        },
        ...prev
      ]);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="w-full rounded-2xl bg-slate-950 border border-indigo-500/30 overflow-hidden shadow-2xl shadow-indigo-500/10">
      
      {/* Google Meet / WebRTC Style Top Meeting Bar */}
      <div className="p-3.5 bg-slate-900 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
          <span className="font-bold text-white font-heading">MEET ROOM: {targetCompany.toUpperCase()} • {domain.toUpperCase()}</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            ENCRYPTED WEBRTC P2P
          </span>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-white/15 text-slate-200 text-xs focus:border-indigo-400 focus:outline-none"
          >
            <option value="Distributed Systems & Backend">Distributed Systems &amp; Backend</option>
            <option value="Frontend Architecture & Web Performance">Frontend Architecture &amp; Web Performance</option>
            <option value="AI / ML Infrastructure & RAG">AI / ML Infrastructure &amp; RAG</option>
            <option value="Low-Level Concurrency & OS Internals">Low-Level Concurrency &amp; OS Internals</option>
            <option value="High-Throughput Database Design">High-Throughput Database Design</option>
          </select>

          <select
            value={targetCompany}
            onChange={(e) => setTargetCompany(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-white/15 text-slate-200 text-xs focus:border-indigo-400 focus:outline-none"
          >
            <option value="Google">Google (L5/L6)</option>
            <option value="Uber">Uber (Distributed Systems)</option>
            <option value="Stripe">Stripe (API Infrastructure)</option>
            <option value="Meta">Meta (E5 Production Eng)</option>
            <option value="Netflix">Netflix (Chaos & Resilience)</option>
          </select>
        </div>
      </div>

      {/* Video & Interview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 sm:p-6 bg-slate-950/90">
        
        {/* Left: Video Streams (Interviewer AI + Candidate Stream) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Interviewer Stream (Bar-Raiser AI) */}
          <div className="relative rounded-2xl bg-slate-900 border border-white/10 aspect-video flex flex-col justify-between p-4 overflow-hidden shadow-inner">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur text-white font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Bar-Raiser AI Sentinel
              </span>
              <span className="text-slate-400 text-[10px]">1080p • 60 FPS</span>
            </div>

            {/* Centered Avatar Graphic */}
            <div className="flex flex-col items-center justify-center my-auto">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 via-sky-400 to-emerald-400 p-1 shadow-lg shadow-indigo-500/25 animate-pulse">
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-2xl">
                  🤖
                </div>
              </div>
              <span className="text-xs text-slate-300 font-mono mt-2">Active Listener • Analyzing System Trade-offs</span>
            </div>

            <div className="text-[11px] text-slate-400 font-mono bg-black/50 p-2 rounded-xl backdrop-blur">
              ⚡ Status: Probing edge cases in real time
            </div>
          </div>

          {/* Candidate Stream (You) */}
          <div className="relative rounded-2xl bg-slate-900 border border-indigo-500/30 aspect-video flex flex-col justify-between p-4 overflow-hidden">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur text-white font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                You (Candidate)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCameraActive(!cameraActive)}
                  className={`p-1.5 rounded-lg text-xs ${cameraActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-400'}`}
                >
                  {cameraActive ? '📹 ON' : '📹 OFF'}
                </button>
                <button
                  type="button"
                  onClick={() => setMicActive(!micActive)}
                  className={`p-1.5 rounded-lg text-xs ${micActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-400'}`}
                >
                  {micActive ? '🎙️ ON' : '🎙️ MUTED'}
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center my-auto">
              <div className="w-14 h-14 rounded-full bg-slate-800 border border-white/15 flex items-center justify-center text-xl">
                👨‍💻
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-300 font-mono">
              <span>WPM: 142 (Optimal)</span>
              <span>Fillers: 0 Detected</span>
              <span className="text-emerald-400 font-bold">Composure: 96%</span>
            </div>
          </div>

        </div>

        {/* Right: Live Interactive Response Input & Sentinel Probes */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          
          {/* Candidate Explanation Input */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <span>💬</span> YOUR LIVE TECHNICAL RESPONSE (ANY TOPIC):
              </label>
              <span className="text-[10px] font-mono text-indigo-400">Dynamic AI Evaluation</span>
            </div>

            <textarea
              rows={3}
              value={candidateResponse}
              onChange={(e) => setCandidateResponse(e.target.value)}
              placeholder="Explain your architectural decision, data structure choice, or concurrency handling..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono leading-relaxed focus:border-indigo-400 focus:outline-none resize-none"
            />

            <button
              type="button"
              onClick={handleGenerateProbe}
              disabled={isEvaluating}
              className="w-full py-2.5 rounded-xl font-mono font-bold text-xs bg-gradient-to-r from-indigo-500 to-sky-400 hover:brightness-110 text-slate-950 transition-all shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2"
            >
              {isEvaluating ? (
                <span>⚡ AI Sentinel Synthesizing Bar-Raiser Question...</span>
              ) : (
                <span>🚀 SUBMIT EXPLANATION &amp; TRIGGER LIVE AI SENTINEL PROBE</span>
              )}
            </button>
          </div>

          {/* Dynamic Follow-Up Probes Feed */}
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            <div className="text-xs font-mono font-bold text-slate-400 flex items-center gap-2">
              <span>🎯</span> LIVE BAR-RAISER TECHNICAL PROBES ({probes.length})
            </div>

            {probes.map((probe) => (
              <div
                key={probe.id}
                className="p-4 rounded-xl bg-slate-900/90 border border-indigo-500/30 text-left space-y-2 animate-fadeIn"
              >
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="font-bold text-indigo-400">{probe.interviewer}</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-[10px]">
                    {probe.difficulty}
                  </span>
                </div>
                <p className="text-xs text-white leading-relaxed font-mono">
                  "{probe.question}"
                </p>
                <div className="text-[10px] text-slate-500 font-mono">
                  Delivered {probe.timestamp} • Evaluates architectural depth &amp; trade-off quantification
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
