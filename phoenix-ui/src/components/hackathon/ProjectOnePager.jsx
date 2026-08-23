'use client';

import { useState } from 'react';
import { hackathonApi } from '@/lib/api';

export default function ProjectOnePager({ room }) {
  const roomId = room?.roomId || 'ROOM-APEX-1001';
  const lockedIdea = room?.lockedIdeaData || null;
  const problemStatement = room?.lockedProblemStatement || '';
  const members = room?.members || [];
  const memberCount = members.length;

  const [onePager, setOnePager] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLiveAi, setIsLiveAi] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [generationStep, setGenerationStep] = useState(0);

  const generationSteps = [
    '📋 Analyzing the locked problem statement and domain context...',
    '🔬 Extracting scope boundaries, success metrics, and risk factors...',
    '⚡ Generating actionable execution strategy with AI agent task prompts...',
    '✨ Formatting the One-Pager document for maximum clarity...'
  ];

  const toggleSection = (key) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    setGenerationStep(0);
    setOnePager(null);

    const stepInterval = setInterval(() => {
      setGenerationStep(prev => prev < generationSteps.length - 1 ? prev + 1 : prev);
    }, 700);

    try {
      const payload = {
        ideaTitle: lockedIdea?.title || problemStatement,
        ideaDescription: lockedIdea?.tagline || '',
        realWorldProblem: lockedIdea?.realWorldProblem || '',
        technicalMoat: lockedIdea?.technicalMoat || '',
        targetUsers: lockedIdea?.targetUsers || '',
        domain: room?.activeDomain || 'AI & Developer Tools',
        hackathonName: room?.hackathonName || 'National Hackathon 2026',
        hackathonDuration: '24 hours',
        teamSize: memberCount,
        techStack: lockedIdea?.deepBlueprint?.recommendedFileTree || [],
        deepBlueprint: lockedIdea?.deepBlueprint || {}
      };

      const res = await hackathonApi.generateOnePager(payload);
      clearInterval(stepInterval);

      if (res.success && res.onePager) {
        setOnePager(res.onePager);
        setIsLiveAi(Boolean(res.isLiveAiGenerated));
        // Auto-expand all sections initially
        setExpandedSections({
          problemStatement: true,
          solution: true,
          scope: true,
          execution: true,
          timeline: true,
          metrics: true,
          risks: true
        });
      }
    } catch {
      clearInterval(stepInterval);
    }
    setLoading(false);
  };

  const handleExportMarkdown = () => {
    if (!onePager) return;
    let md = `# ${onePager.ideaTitle}\n\n`;
    md += `## 1. Problem Statement\n${onePager.problemStatement}\n\n`;
    md += `## 2. The Solution\n${onePager.solution}\n\n`;
    md += `## 3. Scope and "No-Gos"\n`;
    md += `### In Scope\n${(onePager.scopeAndNoGos?.inScope || []).map(s => `- ${s}`).join('\n')}\n\n`;
    md += `### No-Gos (Out of Scope)\n${(onePager.scopeAndNoGos?.noGos || []).map(s => `- ❌ ${s}`).join('\n')}\n\n`;
    md += `## 4. Execution Strategy\n`;
    (onePager.executionStrategy || []).forEach(step => {
      md += `### Step ${step.stepNumber}: ${step.title}\n`;
      md += `${step.description}\n`;
      if (step.isAgentTask && step.agentPrompt) {
        md += `> **AI Agent Prompt:** "${step.agentPrompt}"\n`;
      }
      md += '\n';
    });
    md += `## 5. Timeline & Appetite\n`;
    md += `**Total Duration:** ${onePager.timelineAndAppetite?.totalDuration || '24 hours'}\n\n`;
    (onePager.timelineAndAppetite?.phases || []).forEach(p => {
      md += `- **${p.phase}** (${p.duration}): ${p.deliverable}\n`;
    });
    md += `\n${onePager.timelineAndAppetite?.hardConstraint || ''}\n\n`;
    md += `## 6. Success Metrics\n${(onePager.successMetrics || []).map(m => `- ✅ ${m}`).join('\n')}\n\n`;
    md += `## 7. Risks & "Rabbit Holes"\n`;
    (onePager.risksAndRabbitHoles || []).forEach(r => {
      md += `- **⚠️ ${r.risk}**\n  → Mitigation: ${r.mitigation}\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(onePager.ideaTitle || 'Project').replace(/[^a-zA-Z0-9]/g, '_')}_One_Pager.md`;
    a.click();
  };

  return (
    <div className="w-full rounded-3xl bg-theme-card border border-emerald-500/30 p-5 sm:p-7 shadow-xl shadow-black/30 text-left space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-theme-glass">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl shrink-0">
            📝
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                STEP 8: PROJECT ONE-PAGER
              </span>
              <span className="text-xs text-theme-muted font-mono">
                Room: <strong className="text-theme-main font-bold">{roomId}</strong>
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-theme-main font-heading">
              Student Project One-Pager Generator
            </h3>
            <p className="text-xs text-theme-muted leading-relaxed mt-0.5 font-medium">
              Generates a concise, actionable 8-section document from your locked idea.
              Industry-standard format — ruthlessly prioritized for execution clarity.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          {onePager && (
            <button
              type="button"
              onClick={handleExportMarkdown}
              className="px-3.5 py-2 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-700 dark:text-sky-300 border border-sky-500/30 font-bold transition-all flex items-center gap-1.5"
            >
              <span>📄</span> Export Markdown
            </button>
          )}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 disabled:opacity-50"
          >
            <span>{loading ? '⏳' : '🚀'}</span>
            {loading ? 'Generating...' : onePager ? 'Regenerate One-Pager' : 'Generate One-Pager'}
          </button>
        </div>
      </div>

      {/* Locked Idea Context Banner */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-emerald-500/25 space-y-1.5">
        <div className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-2">
          <span>🔒 LOCKED PROBLEM STATEMENT</span>
          {isLiveAi && (
            <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-300 text-[10px] border border-sky-500/30 normal-case">
              ✨ Live AI Generated
            </span>
          )}
        </div>
        <p className="text-sm font-bold text-theme-main font-heading">
          {problemStatement || 'No idea locked yet — go to Step 3 to select an idea.'}
        </p>
        {lockedIdea?.tagline && (
          <p className="text-xs text-emerald-600 dark:text-emerald-300 italic font-medium">
            &quot;{lockedIdea.tagline}&quot;
          </p>
        )}
      </div>

      {/* Loading Animation */}
      {loading && (
        <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-theme-glass space-y-3 animate-pulse">
          <div className="text-xs font-mono text-theme-muted font-bold uppercase">
            🔬 DEEP RESEARCH & GENERATION IN PROGRESS...
          </div>
          <div className="space-y-2">
            {generationSteps.map((step, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-2 text-xs font-mono transition-all duration-300 ${
                  idx <= generationStep
                    ? 'text-emerald-600 dark:text-emerald-300 font-bold'
                    : 'text-theme-subtle'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                  idx < generationStep
                    ? 'bg-emerald-500 text-white'
                    : idx === generationStep
                    ? 'bg-emerald-500/30 text-emerald-600 dark:text-emerald-300 animate-pulse'
                    : 'bg-slate-200 dark:bg-slate-800 text-theme-subtle'
                }`}>
                  {idx < generationStep ? '✓' : idx + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* One-Pager Document */}
      {onePager && !loading && (
        <div className="space-y-4">

          {/* Section 1: Problem Statement */}
          <OnePagerSection
            num="1"
            title="Problem Statement"
            icon="🎯"
            color="rose"
            expanded={expandedSections.problemStatement}
            onToggle={() => toggleSection('problemStatement')}
          >
            <p className="text-sm text-theme-main leading-relaxed font-medium">
              {onePager.problemStatement}
            </p>
          </OnePagerSection>

          {/* Section 2: The Solution */}
          <OnePagerSection
            num="2"
            title="The Solution"
            icon="💡"
            color="emerald"
            expanded={expandedSections.solution}
            onToggle={() => toggleSection('solution')}
          >
            <p className="text-sm text-theme-main leading-relaxed font-medium">
              {onePager.solution}
            </p>
          </OnePagerSection>

          {/* Section 3: Scope and No-Gos */}
          <OnePagerSection
            num="3"
            title='Scope and "No-Gos"'
            icon="🔒"
            color="sky"
            expanded={expandedSections.scope}
            onToggle={() => toggleSection('scope')}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                  ✅ IN SCOPE
                </div>
                <ul className="space-y-1.5">
                  {(onePager.scopeAndNoGos?.inScope || []).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-theme-main">
                      <span className="text-emerald-500 shrink-0 mt-0.5">✦</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <div className="text-[11px] font-mono font-bold text-rose-600 dark:text-rose-400 uppercase">
                  ❌ NO-GOS (OUT OF SCOPE)
                </div>
                <ul className="space-y-1.5">
                  {(onePager.scopeAndNoGos?.noGos || []).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-theme-muted">
                      <span className="text-rose-400 shrink-0 mt-0.5">✕</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </OnePagerSection>

          {/* Section 4: Execution Strategy */}
          <OnePagerSection
            num="4"
            title="Execution Strategy"
            icon="🏗️"
            color="purple"
            expanded={expandedSections.execution}
            onToggle={() => toggleSection('execution')}
          >
            <div className="space-y-3">
              {(onePager.executionStrategy || []).map((step, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border ${
                    step.isAgentTask
                      ? 'bg-purple-50 dark:bg-purple-950/30 border-purple-500/30'
                      : 'bg-slate-50 dark:bg-slate-900/50 border-theme-glass'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-theme-main text-[10px] font-mono font-bold">
                      STEP {step.stepNumber}
                    </span>
                    {step.isAgentTask && (
                      <span className="px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-600 dark:text-purple-300 text-[10px] font-mono font-bold border border-purple-500/30">
                        🤖 AI AGENT TASK
                      </span>
                    )}
                    <span className="text-xs font-bold text-theme-main">{step.title}</span>
                  </div>
                  <p className="text-xs text-theme-muted leading-relaxed">{step.description}</p>
                  {step.isAgentTask && step.agentPrompt && (
                    <div className="mt-2 p-2.5 rounded-lg bg-slate-100 dark:bg-slate-950 border border-purple-500/20 font-mono text-[11px] text-purple-700 dark:text-purple-300 leading-relaxed">
                      <span className="font-bold text-purple-500">PROMPT →</span> &quot;{step.agentPrompt}&quot;
                    </div>
                  )}
                </div>
              ))}
            </div>
          </OnePagerSection>

          {/* Section 5: Timeline & Appetite */}
          <OnePagerSection
            num="5"
            title="Timeline & Appetite"
            icon="⏱️"
            color="amber"
            expanded={expandedSections.timeline}
            onToggle={() => toggleSection('timeline')}
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                <span>⏰</span>
                <span>TOTAL: {onePager.timelineAndAppetite?.totalDuration || '24 hours'}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(onePager.timelineAndAppetite?.phases || []).map((phase, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-theme-glass">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-mono font-bold">
                        {phase.duration}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-theme-main">{phase.phase}</div>
                    <div className="text-[11px] text-theme-muted mt-0.5">{phase.deliverable}</div>
                  </div>
                ))}
              </div>
              {onePager.timelineAndAppetite?.hardConstraint && (
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-500/30 text-xs font-bold text-amber-700 dark:text-amber-300 italic">
                  ⚠️ {onePager.timelineAndAppetite.hardConstraint}
                </div>
              )}
            </div>
          </OnePagerSection>

          {/* Section 6: Success Metrics */}
          <OnePagerSection
            num="6"
            title="Success Metrics"
            icon="📊"
            color="emerald"
            expanded={expandedSections.metrics}
            onToggle={() => toggleSection('metrics')}
          >
            <ul className="space-y-2">
              {(onePager.successMetrics || []).map((metric, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-theme-main">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{metric}</span>
                </li>
              ))}
            </ul>
          </OnePagerSection>

          {/* Section 7: Risks & Rabbit Holes */}
          <OnePagerSection
            num="7"
            title='Risks & "Rabbit Holes"'
            icon="⚠️"
            color="rose"
            expanded={expandedSections.risks}
            onToggle={() => toggleSection('risks')}
          >
            <div className="space-y-3">
              {(onePager.risksAndRabbitHoles || []).map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-500/20 space-y-1.5">
                  <div className="flex items-start gap-2 text-xs font-bold text-rose-700 dark:text-rose-300">
                    <span className="shrink-0">⚠️</span>
                    <span>{item.risk}</span>
                  </div>
                  <div className="text-[11px] text-theme-muted pl-5 border-l-2 border-emerald-500/40">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">→ Mitigation: </span>
                    {item.mitigation}
                  </div>
                </div>
              ))}
            </div>
          </OnePagerSection>

        </div>
      )}

      {/* Empty State */}
      {!onePager && !loading && (
        <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-dashed border-theme-glass text-center space-y-3">
          <div className="text-4xl">📝</div>
          <h4 className="text-sm font-bold text-theme-main font-heading">
            Generate Your Project One-Pager
          </h4>
          <p className="text-xs text-theme-muted max-w-md mx-auto leading-relaxed">
            Click &quot;Generate One-Pager&quot; to create a concise, actionable 8-section document
            from your locked problem statement. This will serve as the blueprint for your entire
            hackathon build.
          </p>
        </div>
      )}

    </div>
  );
}

/** Reusable collapsible section card */
function OnePagerSection({ num, title, icon, color, expanded, onToggle, children }) {
  const colorMap = {
    rose: 'border-rose-500/30 bg-rose-500/5',
    emerald: 'border-emerald-500/30 bg-emerald-500/5',
    sky: 'border-sky-500/30 bg-sky-500/5',
    purple: 'border-purple-500/30 bg-purple-500/5',
    amber: 'border-amber-500/30 bg-amber-500/5'
  };
  const headerColorMap = {
    rose: 'text-rose-600 dark:text-rose-400',
    emerald: 'text-emerald-600 dark:text-emerald-400',
    sky: 'text-sky-600 dark:text-sky-400',
    purple: 'text-purple-600 dark:text-purple-400',
    amber: 'text-amber-600 dark:text-amber-400'
  };

  return (
    <div className={`rounded-2xl border overflow-hidden transition-all ${expanded ? colorMap[color] || '' : 'border-theme-glass bg-transparent'}`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between gap-3 text-left group"
      >
        <div className="flex items-center gap-2.5">
          <span className={`text-[11px] font-mono font-bold ${headerColorMap[color] || 'text-theme-main'}`}>
            {icon} {num}.
          </span>
          <span className="text-sm font-bold text-theme-main font-heading">{title}</span>
        </div>
        <span className={`text-sm text-theme-subtle transition-transform ${expanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      {expanded && (
        <div className="px-4 pb-4 animate-fadeIn">
          {children}
        </div>
      )}
    </div>
  );
}
