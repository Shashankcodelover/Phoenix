'use client';

import { useState } from 'react';
import { hackathonApi } from '@/lib/api';

export default function DiscordTeamChat({ room }) {
  const roomId = room?.roomId || 'ROOM-APEX-1001';
  const squadName = room?.squadName || 'Team Phoenix Nexus';
  const members = room?.members || [{ name: 'Shashank J', role: 'Lead Architect', avatar: '👨‍💻' }];
  const memberCount = members.length;
  const problemStatement = room?.lockedProblemStatement || 'NexusAudio: Sub-300ms Multimodal Voice Coaching & CRDT Vector IDE';

  const [activeChannel, setActiveChannel] = useState('general-squad');
  const [inputMsg, setInputMsg] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiStatusStep, setAiStatusStep] = useState('');

  // Universal Squad Channels
  const universalChannels = [
    { id: 'general-squad', name: '📢 general-squad', type: 'universal', role: 'Universal Central Copilot', isUnlocked: true, description: `Universal broadcast for all ${memberCount} teammates in Room ${roomId}` },
    { id: 'project-pipeline', name: '🗺️ project-pipeline', type: 'universal', role: 'Sprint & JIRA Copilot', isUnlocked: true, description: `Live milestone pipeline & sprint blocker tracking for "${problemStatement}"` },
    { id: 'idea-voting-lab', name: '💡 idea-voting-lab', type: 'universal', role: 'Jury Scoring & Rubric Copilot', isUnlocked: true, description: `Domain & prize track scoring analysis` }
  ];

  // Helper to generate distinct, professional channel names and roles
  const getRoleTagAndLabel = (role = '', index = 0) => {
    const r = role.toLowerCase();
    if (r.includes('pitch') || r.includes('story') || r.includes('present') || r.includes('product')) {
      return { tag: 'pitch-coach', label: 'Pitch & Product Lead Copilot', avatar: '🎤' };
    }
    if (r.includes('frontend') || r.includes('ui') || r.includes('ux')) {
      return { tag: 'frontend-lead', label: 'Frontend & UI Specialist Copilot', avatar: '🎨' };
    }
    if (r.includes('backend') || r.includes('rag') || r.includes('db') || r.includes('database')) {
      return { tag: 'backend-rag', label: 'Backend & Systems Copilot', avatar: '⚙️' };
    }
    if (r.includes('devops') || r.includes('cloud') || r.includes('infra')) {
      return { tag: 'devops-lead', label: 'DevOps & Infra Copilot', avatar: '🚀' };
    }
    if (r.includes('ml') || r.includes('ai') || r.includes('research')) {
      return { tag: 'ml-researcher', label: 'ML & Algorithms Copilot', avatar: '🧠' };
    }
    if (r.includes('lead') || r.includes('architect') || index === 0) {
      return { tag: 'lead-architect', label: 'Lead Systems Architect Copilot', avatar: '👨‍💻' };
    }
    return { tag: `specialist-${index + 1}`, label: `${role} Copilot`, avatar: '🤖' };
  };

  // Generate distinct split channels for all active teammates
  const splitChannels = members.map((m, idx) => {
    const meta = getRoleTagAndLabel(m.role, idx);
    return {
      id: `split-${meta.tag}-${m.id || idx}`,
      name: `🔒 @ai-${meta.tag}`,
      type: 'split',
      role: meta.label,
      activeMember: m.name,
      avatar: meta.avatar,
      isUnlocked: true,
      description: `Private copilot for ${m.name} (${m.role})`
    };
  });

  const channels = [...universalChannels, ...splitChannels];

  // Isolated Message Histories per Channel
  const [messagesByChannel, setMessagesByChannel] = useState(() => {
    const initial = {
      'general-squad': [
        { id: 'g1', sender: members[0]?.name || 'Shashank J', role: members[0]?.role || 'Lead Architect', avatar: '👨‍💻', text: `Welcome to Room ${roomId}! We are targeting "${problemStatement}" with ${memberCount} active squad members.`, timestamp: 'Just now' },
        { id: 'g2', sender: 'AI Central Copilot', role: 'CENTRAL_AGENT', avatar: '🤖', text: `Squad Server connected for Room ${roomId}. All ${memberCount} teammates have dedicated private split AI copilots configured.`, timestamp: 'Just now' }
      ],
      'project-pipeline': [
        { id: 'p1', sender: 'Sprint & JIRA Copilot', role: 'PIPELINE_AGENT', avatar: '🗺️', text: `Sprint pipeline initialized for Room ${roomId}. Track your 5 execution phases and file structure ownership here.`, timestamp: 'Just now' }
      ],
      'idea-voting-lab': [
        { id: 'i1', sender: 'Jury Scoring Copilot', role: 'RUBRIC_AGENT', avatar: '💡', text: `Jury Scoring Rubric synchronized: Target 100/100 points across Innovation, Technical Moat, Social Impact, and 180s Presentation.`, timestamp: 'Just now' }
      ]
    };

    // Initialize private channels for each member
    splitChannels.forEach((c) => {
      initial[c.id] = [
        {
          id: `priv_init_${c.id}`,
          sender: c.role,
          role: 'COACH',
          avatar: c.avatar,
          text: `Private workspace unlocked for ${c.activeMember} (${c.role}). I am your dedicated AI mentor for "${problemStatement}". Ask me anything about your role deliverables, file scaffolding, or architecture trade-offs!`,
          timestamp: 'Just now'
        }
      ];
    });

    return initial;
  });

  const currentChannelObj = channels.find(c => c.id === activeChannel) || channels[0];
  const currentMessages = messagesByChannel[activeChannel] || [];

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg;
    setInputMsg('');

    const newMsg = {
      id: `m_${Date.now()}`,
      sender: `You (${members[0]?.name || 'Shashank J'})`,
      role: members[0]?.role || 'Lead Architect',
      avatar: '👨‍💻',
      text: userText,
      timestamp: 'Just now'
    };

    // Add user message to current channel's isolated history
    setMessagesByChannel(prev => ({
      ...prev,
      [activeChannel]: [...(prev[activeChannel] || []), newMsg]
    }));

    setLoadingAi(true);
    setAiStatusStep(`🧠 ${currentChannelObj.role} analyzing query for Room ${roomId}...`);

    try {
      const res = await hackathonApi.getSplitChatAdvice(
        roomId,
        userText,
        activeChannel,
        currentChannelObj.role,
        problemStatement
      );

      const aiResponse = res?.seniorCoachResponse || `Specialized Guidance for "${userText}": Break your logic into pure helper functions. Keep P99 latency < 35ms across all ${memberCount} connected peers.`;

      setTimeout(() => {
        setMessagesByChannel(prev => ({
          ...prev,
          [activeChannel]: [
            ...(prev[activeChannel] || []),
            {
              id: `ai_${Date.now()}`,
              sender: currentChannelObj.role,
              role: 'COACH',
              avatar: currentChannelObj.avatar || '🤖',
              text: aiResponse,
              timestamp: 'Just now'
            }
          ]
        }));
        setLoadingAi(false);
        setAiStatusStep('');
      }, 500);

    } catch (err) {
      setTimeout(() => {
        setMessagesByChannel(prev => ({
          ...prev,
          [activeChannel]: [
            ...(prev[activeChannel] || []),
            {
              id: `ai_${Date.now()}`,
              sender: currentChannelObj.role,
              role: 'COACH',
              avatar: currentChannelObj.avatar || '🤖',
              text: `Directives for "${userText}": Break logic into modular pure functions and test with our ${memberCount} room members.`,
              timestamp: 'Just now'
            }
          ]
        }));
        setLoadingAi(false);
        setAiStatusStep('');
      }, 400);
    }
  };

  return (
    <div className="w-full rounded-3xl bg-theme-card border border-emerald-500/30 overflow-hidden shadow-2xl shadow-black/40 flex flex-col md:flex-row min-h-[600px] text-left">
      
      {/* Left Discord Sidebar */}
      <div className="w-full md:w-64 bg-slate-100 dark:bg-slate-950/95 border-r border-theme-glass p-3.5 flex flex-col justify-between shrink-0 text-left">
        <div>
          <div className="flex items-center gap-2 px-2 py-2 mb-3 border-b border-theme-glass">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-base">
              🏆
            </div>
            <div className="min-w-0">
              <div className="font-heading font-bold text-sm text-theme-main truncate">
                {squadName}
              </div>
              <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold truncate">
                Room: {roomId} ({memberCount} Members)
              </div>
            </div>
          </div>

          {/* Universal Squad Channels */}
          <div className="mb-4">
            <div className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-theme-subtle px-2 mb-1.5">
              Universal Squad Channels
            </div>
            <div className="space-y-1 font-mono text-xs">
              {universalChannels.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveChannel(c.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between ${
                    activeChannel === c.id
                      ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/40 shadow-sm'
                      : 'text-theme-muted hover:text-theme-main hover:bg-slate-200/50 dark:hover:bg-white/5'
                  }`}
                >
                  <span className="truncate">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Split-Role AI Channels for All N Members */}
          <div>
            <div className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 px-2 mb-1.5 flex items-center justify-between">
              <span>Split Role Copilots</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold">
                {splitChannels.length} ACTIVE
              </span>
            </div>
            <div className="space-y-1 font-mono text-xs max-h-[240px] overflow-y-auto pr-1">
              {splitChannels.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveChannel(c.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between ${
                    activeChannel === c.id
                      ? 'bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/40 shadow-sm'
                      : 'text-theme-muted hover:text-theme-main hover:bg-slate-200/50 dark:hover:bg-white/5'
                  }`}
                >
                  <span className="truncate">{c.name}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Squad Status Footnote */}
        <div className="pt-3 border-t border-theme-glass text-[10px] font-mono text-theme-subtle flex items-center justify-between">
          <div className="flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{memberCount} Peer(s) Connected</span>
          </div>
          <span className="text-[9px] text-theme-subtle">Room {roomId}</span>
        </div>
      </div>

      {/* Main Chat Feed Area */}
      <div className="flex-1 flex flex-col justify-between bg-slate-50 dark:bg-slate-900/90 text-left">
        
        {/* Channel Banner Header */}
        <div className="px-5 py-3.5 border-b border-theme-glass bg-slate-100/90 dark:bg-slate-950/80 flex items-center justify-between gap-3 font-mono">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-theme-main truncate">
                {currentChannelObj.name}
              </span>
              <span className="text-[10px] px-2 py-0.2 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 uppercase font-bold">
                {currentChannelObj.type === 'split' ? 'INDIVIDUAL PRIVATE COPILOT' : 'UNIVERSAL SQUAD'}
              </span>
              {currentChannelObj.activeMember && (
                <span className="text-[10px] text-theme-subtle hidden sm:inline">
                  • Assigned: <strong className="text-theme-main">{currentChannelObj.activeMember}</strong>
                </span>
              )}
            </div>
            <div className="text-[11px] text-theme-muted truncate mt-0.5 font-sans font-medium">
              {currentChannelObj.description}
            </div>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 p-5 space-y-4 overflow-y-auto max-h-[420px]">
          {currentMessages.map((msg) => {
            const isMe = msg.sender.includes('You');
            const isCoach = msg.role === 'COACH' || msg.role === 'CENTRAL_AGENT' || msg.role === 'PIPELINE_AGENT' || msg.role === 'RUBRIC_AGENT';

            return (
              <div
                key={msg.id}
                className={`p-4 rounded-2xl border transition-all text-xs space-y-1.5 ${
                  isMe
                    ? 'bg-emerald-950/20 dark:bg-emerald-950/40 border-emerald-500/40 ml-4'
                    : isCoach
                    ? 'bg-slate-100 dark:bg-slate-950/90 border-theme-glass mr-4'
                    : 'bg-slate-100/70 dark:bg-slate-900 border-theme-glass'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{msg.avatar || '💬'}</span>
                    <strong className="text-theme-main font-bold">{msg.sender}</strong>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-white/10 text-theme-subtle uppercase">
                      {msg.role}
                    </span>
                  </div>
                  <span className="text-theme-subtle text-[10px]">{msg.timestamp}</span>
                </div>

                <div className="text-theme-main text-xs font-sans leading-relaxed whitespace-pre-line pl-6 font-medium">
                  {msg.text}
                </div>
              </div>
            );
          })}

          {loadingAi && (
            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 font-mono text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>{aiStatusStep || `Generating Senior Copilot guidance for ${currentChannelObj.name}...`}</span>
            </div>
          )}
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-theme-glass bg-slate-100 dark:bg-slate-950/80 flex items-center gap-2">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder={`Message ${currentChannelObj.name} (Ask for code scaffolds, file structure, or sprint guide)...`}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-theme-glass text-theme-main text-xs focus:border-emerald-500 focus:outline-none placeholder:text-slate-400 font-mono"
          />
          <button
            type="submit"
            disabled={loadingAi || !inputMsg.trim()}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold font-mono text-xs transition-all shadow-md shadow-emerald-500/20"
          >
            SEND ➔
          </button>
        </form>

      </div>

    </div>
  );
}
