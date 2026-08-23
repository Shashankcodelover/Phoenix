'use client';

import { useState } from 'react';

export default function SubmissionPackager({ room }) {
  const roomId = room?.roomId || 'ROOM-APEX-1001';
  const lockedIdea = room?.lockedIdeaData || null;
  const problemStatement = room?.lockedProblemStatement || '';
  const members = room?.members || [];
  const memberCount = members.length;

  const [activeTab, setActiveTab] = useState('readme');
  const [devpostGenerated, setDevpostGenerated] = useState(false);

  const projectName = lockedIdea?.title || problemStatement?.split(':')[0] || 'Project';

  const tabs = [
    { id: 'readme', label: '📄 README.md', desc: 'GitHub readme' },
    { id: 'devpost', label: '🏆 Devpost Submission', desc: 'Pitch fields' },
    { id: 'checklist', label: '✅ Deploy Checklist', desc: 'Final checks' },
    { id: 'demo', label: '🎬 Demo Storyboard', desc: 'Video script' }
  ];

  const readmeTemplate = `# ${projectName}

> ${lockedIdea?.tagline || 'A breakthrough solution for the modern hackathon challenge.'}

## 🎯 Problem Statement
${lockedIdea?.realWorldProblem || 'Existing solutions fail to address critical performance, cost, or accessibility constraints.'}

## 💡 Our Solution
${lockedIdea?.tagline || problemStatement}

## 🏗️ Technical Architecture
${lockedIdea?.deepBlueprint?.systemArchitecture || 'Modular, scalable architecture designed for hackathon-grade performance.'}

## 🚀 Tech Stack
${(lockedIdea?.deepBlueprint?.recommendedFileTree || ['Next.js', 'Node.js', 'WebRTC']).map(t => `- ${t}`).join('\n')}

## 👥 Team — ${room?.squadName || 'Team Phoenix'}
${members.map(m => `- **${m.name}** — ${m.role}`).join('\n')}

## 📦 Setup & Installation
\`\`\`bash
git clone https://github.com/team/${projectName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.git
cd ${projectName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}
npm install
npm run dev
\`\`\`

## 🏆 Hackathon
- **Event:** ${room?.hackathonName || 'National Hackathon 2026'}
- **Track:** ${room?.activeDomain || 'AI & Developer Tools'}
- **Room:** ${roomId}

## 📄 License
MIT License — Built with ❤️ at ${room?.hackathonName || 'National Hackathon 2026'}
`;

  const devpostFields = {
    title: projectName,
    tagline: lockedIdea?.tagline || '',
    inspiration: `We noticed that ${lockedIdea?.realWorldProblem || 'existing solutions have critical gaps'}.`,
    whatItDoes: lockedIdea?.tagline || problemStatement,
    howWeBuiltIt: `Using ${(lockedIdea?.deepBlueprint?.recommendedFileTree || []).slice(0, 3).join(', ')}. ${lockedIdea?.deepBlueprint?.systemArchitecture || ''}`,
    challenges: 'Real-time synchronization under unreliable network conditions, optimizing latency to sub-millisecond thresholds, and ensuring offline resilience for live demo stability.',
    accomplishments: `Achieved ${lockedIdea?.technicalMoat || 'breakthrough performance metrics'} within the hackathon timeframe.`,
    whatWeLearned: 'The importance of offline-first architecture, the power of peer-to-peer data mesh for cost reduction, and the value of exhaustive automated testing before live demos.',
    whatsNext: 'Enterprise SaaS offering, mobile companion app, and community-driven plugin marketplace.'
  };

  const deployChecklist = [
    { label: 'GitHub repository is public and README is up-to-date', done: false },
    { label: 'Live demo URL is deployed and accessible', done: false },
    { label: 'All team members are listed on the submission', done: false },
    { label: 'Demo video (2-3 min) is recorded and uploaded', done: false },
    { label: 'Devpost submission fields are complete', done: false },
    { label: 'Tech stack and APIs are declared', done: false },
    { label: 'Presentation deck (PPT) is uploaded', done: false },
    { label: 'Code compiles and runs from a fresh git clone', done: false },
    { label: 'No API keys or secrets committed to the repo', done: false },
    { label: 'License file is present', done: false },
    { label: 'Backup demo video saved locally', done: false },
    { label: 'Judge Q&A counter-defense notes are prepared', done: false }
  ];

  const [checklist, setChecklist] = useState(deployChecklist);

  const toggleCheck = (idx) => {
    setChecklist(prev => prev.map((item, i) => i === idx ? { ...item, done: !item.done } : item));
  };

  const completedCount = checklist.filter(c => c.done).length;

  const handleExportReadme = () => {
    const blob = new Blob([readmeTemplate], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    a.click();
  };

  return (
    <div className="w-full rounded-3xl bg-theme-card border border-emerald-500/30 p-5 sm:p-7 shadow-xl shadow-black/30 text-left space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-theme-glass">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl shrink-0">
            📦
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                STEP 12: SUBMISSION PACKAGER
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-theme-main font-heading">
              Hackathon Submission & Devpost Packager
            </h3>
            <p className="text-xs text-theme-muted leading-relaxed mt-0.5 font-medium">
              Generate README.md, Devpost submission fields, deployment checklist, and demo video storyboard — all pre-filled from your locked idea.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold">
            {completedCount}/{checklist.length} Complete
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar font-mono text-xs pb-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 rounded-xl border transition-all font-semibold flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 shadow-sm font-bold'
                : 'text-theme-muted hover:text-theme-main border-transparent'
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB: README */}
      {activeTab === 'readme' && (
        <div className="space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
              📄 AUTO-GENERATED README.md
            </div>
            <button
              type="button"
              onClick={handleExportReadme}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
            >
              <span>📥</span> Download README.md
            </button>
          </div>
          <pre className="p-5 rounded-2xl bg-slate-900 dark:bg-black text-emerald-300 text-xs font-mono overflow-x-auto leading-relaxed border border-white/10 max-h-[500px] overflow-y-auto">
            {readmeTemplate}
          </pre>
        </div>
      )}

      {/* TAB: Devpost */}
      {activeTab === 'devpost' && (
        <div className="space-y-3 animate-fadeIn">
          {Object.entries(devpostFields).map(([key, value]) => (
            <div key={key} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-theme-glass space-y-1.5">
              <div className="text-[11px] font-mono font-bold text-sky-600 dark:text-sky-400 uppercase">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </div>
              <p className="text-xs text-theme-main leading-relaxed">{value}</p>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setDevpostGenerated(true)}
            className="w-full px-4 py-3 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            <span>📋</span> Copy All Devpost Fields to Clipboard
          </button>
        </div>
      )}

      {/* TAB: Deploy Checklist */}
      {activeTab === 'checklist' && (
        <div className="space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
              ✅ PRE-SUBMISSION CHECKLIST
            </div>
            <div className="w-32 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${(completedCount / checklist.length) * 100}%` }}
              />
            </div>
          </div>
          {checklist.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => toggleCheck(idx)}
              className={`w-full p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                item.done
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                  : 'bg-slate-50 dark:bg-slate-950 border-theme-glass text-theme-main hover:border-emerald-500/20'
              }`}
            >
              <span className={`w-5 h-5 rounded-md border flex items-center justify-center text-[10px] shrink-0 ${
                item.done
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : 'border-slate-300 dark:border-slate-700'
              }`}>
                {item.done ? '✓' : ''}
              </span>
              <span className={`text-xs font-medium ${item.done ? 'line-through opacity-70' : ''}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* TAB: Demo Storyboard */}
      {activeTab === 'demo' && (
        <div className="space-y-3 animate-fadeIn">
          <div className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase">
            🎬 DEMO VIDEO STORYBOARD (2-3 MINUTES)
          </div>
          {[
            { time: '0:00 - 0:20', scene: 'Hook & Problem', desc: `Open with a compelling statistic about the problem. Show the pain point visually. "${lockedIdea?.realWorldProblem?.slice(0, 80) || 'Current tools fail at scale...'}..."` },
            { time: '0:20 - 0:45', scene: 'Solution Overview', desc: `Introduce ${projectName}. Show the landing page/dashboard. Explain the core value proposition in one sentence.` },
            { time: '0:45 - 1:30', scene: 'Live Demo', desc: `Walk through the primary user flow. Show real data being processed. Highlight the technical moat in action (e.g., speed, accuracy, offline capability).` },
            { time: '1:30 - 2:00', scene: 'Technical Architecture', desc: `Brief architecture diagram overlay. Mention key technologies: ${(lockedIdea?.deepBlueprint?.recommendedFileTree || []).slice(0, 3).join(', ')}. Show test results if available.` },
            { time: '2:00 - 2:30', scene: 'Impact & Metrics', desc: `Show quantified results. Compare before vs. after. Highlight the competitive advantage.` },
            { time: '2:30 - 3:00', scene: 'Closing & Call to Action', desc: `Summarize key achievement. Show the team. End with: "We're ${room?.squadName || 'Team Phoenix'}, and this is ${projectName}."` }
          ].map((scene, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-theme-glass flex items-start gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-mono font-bold shrink-0 border border-amber-500/30">
                {scene.time}
              </span>
              <div>
                <div className="text-xs font-bold text-theme-main">{scene.scene}</div>
                <p className="text-[11px] text-theme-muted leading-relaxed mt-0.5">{scene.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
