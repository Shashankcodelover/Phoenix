'use client';

import { useState } from 'react';
import { hackathonApi } from '@/lib/api';

export default function TeamServerCreation({ room, onRoomUpdate }) {
  const [squadName, setSquadName] = useState(room?.squadName || 'Team Phoenix Nexus');
  const [copied, setCopied] = useState(false);
  const [joinAlert, setJoinAlert] = useState(null);
  const [loadingJoin, setLoadingJoin] = useState(false);
  
  // Custom teammate inputs
  const [customName, setCustomName] = useState('');
  const [customRole, setCustomRole] = useState('');

  const roomId = room?.roomId || 'ROOM-APEX-1001';
  const members = room?.members || [];
  const memberCount = members.length;
  const inviteLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/vault/hackathon?room=${roomId}`
    : `https://phoenix.os/vault/hackathon?room=${roomId}`;

  const handleCopy = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Add a custom teammate or preset teammate
  const handleAddTeammate = async (memberData = null) => {
    setLoadingJoin(true);

    const nextIndex = members.length + 1;
    const defaultCandidates = [
      { name: 'Alex Rivera', role: 'Frontend & Interaction Specialist', skills: 'Next.js 16, Tailwind, Canvas, WebAudio', avatar: '🎨' },
      { name: 'Priya Sharma', role: 'Backend, DB & RAG Engineer', skills: 'Express, MongoDB, Embeddings, Outbox CDC', avatar: '⚙️' },
      { name: 'Rohan Mehta', role: 'Pitch Specialist & Product Storyteller', skills: 'Devpost, Marp Decks, 180s Demos', avatar: '🎤' },
      { name: 'David Chen', role: 'DevOps & Cloud Infrastructure Lead', skills: 'Docker, Kubernetes, Vercel Edge, CI/CD', avatar: '🚀' },
      { name: 'Aarav Patel', role: 'AI/ML & Vector Embeddings Researcher', skills: 'PyTorch, Wasm Embeddings, Ollama', avatar: '🧠' }
    ];

    const fallbackCandidate = defaultCandidates[(nextIndex - 2) % defaultCandidates.length] || {
      name: `Teammate ${nextIndex}`,
      role: 'Full-Stack Developer',
      skills: 'JavaScript, React, Node.js',
      avatar: '👨‍💻'
    };

    const teammateToJoin = memberData || (customName.trim() ? {
      name: customName.trim(),
      role: customRole.trim() || 'Core Developer',
      skills: 'Full-Stack Engineering & System Design',
      avatar: '👨‍💻'
    } : fallbackCandidate);

    try {
      const res = await hackathonApi.joinRoom(roomId, teammateToJoin);
      if (res.success && res.room) {
        if (onRoomUpdate) onRoomUpdate(res.room);
        setJoinAlert(`🎉 ${teammateToJoin.name} (${teammateToJoin.role}) joined Room ${roomId}! Workload rebalanced across ${res.room.members.length} members.`);
        setCustomName('');
        setCustomRole('');
      }
    } catch {
      // Fallback
      const updated = {
        ...room,
        members: [...members, { id: `mem_${Date.now()}`, ...teammateToJoin, isLeader: false, status: 'Online' }]
      };
      if (onRoomUpdate) onRoomUpdate(updated);
      setJoinAlert(`🎉 ${teammateToJoin.name} joined Room ${roomId}!`);
      setCustomName('');
      setCustomRole('');
    } finally {
      setLoadingJoin(false);
      setTimeout(() => setJoinAlert(null), 3500);
    }
  };

  // Reset to single leader
  const handleResetSquad = async () => {
    try {
      const res = await hackathonApi.resetRoom(roomId);
      if (res.success && res.room) {
        if (onRoomUpdate) onRoomUpdate(res.room);
      }
    } catch {
      if (onRoomUpdate) onRoomUpdate({ ...room, members: [members[0]] });
    }
    setJoinAlert(`🔄 Room ${roomId} reset to solo leader state.`);
    setTimeout(() => setJoinAlert(null), 2500);
  };

  return (
    <div className="w-full rounded-2xl bg-slate-900/90 border border-emerald-500/25 p-5 sm:p-7 shadow-xl shadow-black/40 text-left space-y-6">
      
      {/* Friendly Header */}
      <div className="flex items-start gap-3.5 pb-4 border-b border-white/10">
        <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/35 flex items-center justify-center text-2xl shrink-0">
          🎮
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              STEP 2: SQUAD SERVER
            </span>
            <span className="text-xs text-slate-400 font-mono">Dynamic Member Scaling (Room: {roomId})</span>
          </div>
          <h3 className="text-xl font-bold text-white font-heading">
            Create Squad Workspace &amp; Invite Arbitrary Teammates
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
            Every teammate who joins Room <strong className="text-white font-mono">{roomId}</strong> is immediately integrated into the live sprint pipeline. The system dynamically divides the project deliverables across your squad size.
          </p>
        </div>
      </div>

      {/* Server Creation & Invite Code Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        <div>
          <label className="block text-slate-300 font-bold mb-1.5">SQUAD SERVER NAME</label>
          <input
            type="text"
            value={squadName}
            onChange={(e) => setSquadName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white focus:border-emerald-400 focus:outline-none"
            placeholder="e.g. Team Phoenix Nexus"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-bold mb-1.5 flex items-center justify-between">
            <span>UNIQUE SQUAD INVITE LINK:</span>
            <span className="text-[10px] text-emerald-400 font-bold">Room: {roomId}</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={inviteLink}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-emerald-300 select-all focus:outline-none truncate"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shrink-0"
            >
              {copied ? '✓ COPIED' : 'COPY'}
            </button>
          </div>
        </div>
      </div>

      {/* Join Notification Alert */}
      {joinAlert && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-xs font-mono text-emerald-300 animate-bounce flex items-center justify-between">
          <span>{joinAlert}</span>
          <span className="text-[10px] uppercase font-bold text-emerald-400">STATE REBALANCED</span>
        </div>
      )}

      {/* Dynamic Member Addition Controls */}
      <div className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-3 font-mono text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-bold text-white uppercase">
            👥 Add Teammates to Room {roomId} ({memberCount} Active):
          </span>
          {members.length > 1 && (
            <button
              type="button"
              onClick={handleResetSquad}
              className="text-red-400 hover:underline text-[11px]"
            >
              Reset to Solo Leader
            </button>
          )}
        </div>

        {/* Custom Name & Role Input */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Custom Name (e.g. Maya Lin)"
            className="px-3.5 py-2 rounded-lg bg-slate-900 border border-white/15 text-white focus:border-emerald-400 focus:outline-none"
          />
          <input
            type="text"
            value={customRole}
            onChange={(e) => setCustomRole(e.target.value)}
            placeholder="Custom Role (e.g. AI/ML Researcher)"
            className="px-3.5 py-2 rounded-lg bg-slate-900 border border-white/15 text-white focus:border-emerald-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => handleAddTeammate()}
            disabled={loadingJoin}
            className="px-4 py-2 rounded-lg font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all"
          >
            ➕ {loadingJoin ? 'Adding...' : 'Add Teammate'}
          </button>
        </div>

        {/* Quick Simulation Presets */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
          <span className="text-slate-400">Quick Simulation Presets:</span>
          <button
            type="button"
            onClick={() => handleAddTeammate({ name: 'Alex Rivera', role: 'Frontend & Interaction Specialist', skills: 'Next.js 16, Tailwind, Canvas', avatar: '🎨' })}
            className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-emerald-300 border border-white/10"
          >
            + Alex (Frontend)
          </button>
          <button
            type="button"
            onClick={() => handleAddTeammate({ name: 'Priya Sharma', role: 'Backend & DB Engineer', skills: 'Express, MongoDB, Embeddings', avatar: '⚙️' })}
            className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-emerald-300 border border-white/10"
          >
            + Priya (Backend)
          </button>
          <button
            type="button"
            onClick={() => handleAddTeammate({ name: 'Rohan Mehta', role: 'Pitch & Product Lead', skills: 'Devpost, Marp Decks, 180s Pitch', avatar: '🎤' })}
            className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-emerald-300 border border-white/10"
          >
            + Rohan (Pitch)
          </button>
          <button
            type="button"
            onClick={() => handleAddTeammate({ name: 'David Chen', role: 'DevOps & Cloud Lead', skills: 'Docker, Vercel, CI/CD', avatar: '🚀' })}
            className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-emerald-300 border border-white/10"
          >
            + David (DevOps)
          </button>
        </div>
      </div>

      {/* Dynamic Squad Members Roster Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
        {members.map((member, index) => (
          <div
            key={member.id || index}
            className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 flex items-start gap-3 shadow-md shadow-emerald-500/5 animate-fadeIn"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-lg shrink-0">
              {member.avatar || '👨‍💻'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="font-bold text-white text-xs truncate font-sans">
                  {member.name} {member.isLeader ? '(Leader)' : ''}
                </div>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 font-bold">
                  {member.status || 'Online'}
                </span>
              </div>
              <div className="text-[11px] text-emerald-400 font-medium truncate mt-0.5">
                {member.role}
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-1">
                Stack: {member.skills}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
