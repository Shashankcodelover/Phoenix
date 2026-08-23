'use client';

import { useState } from 'react';
import { hackathonApi } from '@/lib/api';

export default function DeepBuildGuide({ room }) {
  const roomId = room?.roomId || 'ROOM-APEX-1001';
  const lockedIdea = room?.lockedIdeaData || null;
  const problemStatement = room?.lockedProblemStatement || '';
  const members = room?.members || [];
  const memberCount = members.length;

  const [buildGuide, setBuildGuide] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLiveAi, setIsLiveAi] = useState(false);
  const [activeTab, setActiveTab] = useState('phases');
  const [expandedPhases, setExpandedPhases] = useState({});
  const [generationStep, setGenerationStep] = useState(0);

  const generationSteps = [
    '🏗️ Analyzing locked idea architecture and technical moat...',
    '📁 Generating optimal file/folder structure with module boundaries...',
    '💻 Writing step-by-step coding guide with actual code snippets...',
    '🔌 Designing API specifications and data schema...',
    '🧪 Formulating testing strategy and deployment pipeline...',
    '✨ Compiling the comprehensive Deep Build Guide...'
  ];

  const tabs = [
    { id: 'phases', label: '🏗️ Build Phases', desc: 'Step-by-step' },
    { id: 'structure', label: '📁 File Structure', desc: 'Project tree' },
    { id: 'api', label: '🔌 API Spec', desc: 'Endpoints' },
    { id: 'data', label: '💾 Data Schema', desc: 'Models' },
    { id: 'testing', label: '🧪 Testing', desc: 'Strategy' },
    { id: 'deploy', label: '🚀 Deploy', desc: 'Launch' }
  ];

  const togglePhase = (phaseNum) => {
    setExpandedPhases(prev => ({ ...prev, [phaseNum]: !prev[phaseNum] }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    setGenerationStep(0);
    setBuildGuide(null);

    const stepInterval = setInterval(() => {
      setGenerationStep(prev => prev < generationSteps.length - 1 ? prev + 1 : prev);
    }, 800);

    try {
      const payload = {
        ideaTitle: lockedIdea?.title || problemStatement,
        ideaDescription: lockedIdea?.tagline || '',
        realWorldProblem: lockedIdea?.realWorldProblem || '',
        technicalMoat: lockedIdea?.technicalMoat || '',
        targetUsers: lockedIdea?.targetUsers || '',
        domain: room?.activeDomain || 'AI & Developer Tools',
        hackathonDuration: '24 hours',
        teamSize: memberCount,
        techStack: lockedIdea?.deepBlueprint?.recommendedFileTree || [],
        deepBlueprint: lockedIdea?.deepBlueprint || {},
        onePagerData: room?.onePagerData || {}
      };

      const res = await hackathonApi.generateDeepBuildGuide(payload);
      clearInterval(stepInterval);

      if (res.success && res.buildGuide) {
        setBuildGuide(res.buildGuide);
        setIsLiveAi(Boolean(res.isLiveAiGenerated));
        // Auto-expand first phase
        setExpandedPhases({ 1: true });
      }
    } catch {
      clearInterval(stepInterval);
    }
    setLoading(false);
  };

  const handleExportMarkdown = () => {
    if (!buildGuide) return;
    let md = `# Deep Build Guide: ${buildGuide.projectTitle}\n\n`;

    md += `## Environment Setup\n`;
    md += `### Prerequisites\n${(buildGuide.environmentSetup?.prerequisites || []).map(p => `- ${p}`).join('\n')}\n\n`;
    md += `### Install Commands\n${(buildGuide.environmentSetup?.installCommands || []).map(c => `\`\`\`bash\n${c.command}\n# ${c.purpose}\n\`\`\``).join('\n\n')}\n\n`;
    md += `### Environment Variables\n${(buildGuide.environmentSetup?.envVariables || []).map(e => `- \`${e.key}=${e.value}\` — ${e.purpose}`).join('\n')}\n\n`;

    md += `## Folder Structure\n`;
    (buildGuide.folderStructure || []).forEach(f => {
      md += `- \`${f.path}\` [${f.priority}] — ${f.purpose}\n`;
    });
    md += '\n';

    md += `## Build Phases\n`;
    (buildGuide.buildPhases || []).forEach(phase => {
      md += `### Phase ${phase.phaseNumber}: ${phase.title} (${phase.duration})\n`;
      md += `**Objective:** ${phase.objective}\n\n`;
      (phase.tasks || []).forEach(task => {
        md += `#### ${task.taskId}: ${task.title}\n`;
        md += `**File:** \`${task.file}\`\n`;
        md += `${task.description}\n`;
        if (task.codeSnippet) {
          md += `\`\`\`typescript\n${task.codeSnippet}\n\`\`\`\n`;
        }
        md += `**Test:** ${task.testCriteria}\n\n`;
      });
    });

    md += `## API Specification\n`;
    (buildGuide.apiSpecification || []).forEach(api => {
      md += `### ${api.method} \`${api.endpoint}\`\n`;
      md += `${api.purpose}\n\n`;
    });

    md += `## Testing Strategy\n`;
    md += `### Unit Tests\n${(buildGuide.testingStrategy?.unitTests || []).map(t => `- ${t}`).join('\n')}\n\n`;
    md += `### Integration Tests\n${(buildGuide.testingStrategy?.integrationTests || []).map(t => `- ${t}`).join('\n')}\n\n`;

    md += `## Deployment\n`;
    md += `**Platform:** ${buildGuide.deploymentGuide?.platform || 'Vercel'}\n`;
    (buildGuide.deploymentGuide?.steps || []).forEach((s, i) => {
      md += `${i + 1}. ${s}\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(buildGuide.projectTitle || 'Project').replace(/[^a-zA-Z0-9]/g, '_')}_Build_Guide.md`;
    a.click();
  };

  return (
    <div className="w-full rounded-3xl bg-theme-card border border-emerald-500/30 p-5 sm:p-7 shadow-xl shadow-black/30 text-left space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-theme-glass">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl shrink-0">
            🏗️
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                STEP 9: DEEP BUILD GUIDE
              </span>
              {isLiveAi && (
                <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-300 text-[10px] font-mono font-bold border border-sky-500/30">
                  ✨ AI-Generated
                </span>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-theme-main font-heading">
              Comprehensive Execution Blueprint
            </h3>
            <p className="text-xs text-theme-muted leading-relaxed mt-0.5 font-medium">
              Deep, step-by-step build guide with code snippets, file structures, API specs, testing strategy, 
              and deployment — all strictly derived from your locked idea.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          {buildGuide && (
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
            {loading ? 'Generating...' : buildGuide ? 'Regenerate Guide' : 'Generate Build Guide'}
          </button>
        </div>
      </div>

      {/* Loading Animation */}
      {loading && (
        <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-theme-glass space-y-3 animate-pulse">
          <div className="text-xs font-mono text-theme-muted font-bold uppercase">
            🔬 DEEP ARCHITECTURAL ANALYSIS IN PROGRESS...
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

      {/* Build Guide Content */}
      {buildGuide && !loading && (
        <div className="space-y-5">

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
                    : 'text-theme-muted hover:text-theme-main hover:bg-slate-100/50 dark:hover:bg-white/5 border-transparent'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* TAB: Build Phases */}
          {activeTab === 'phases' && (
            <div className="space-y-3 animate-fadeIn">
              {(buildGuide.buildPhases || []).map((phase) => (
                <div key={phase.phaseNumber} className="rounded-2xl border border-theme-glass overflow-hidden">
                  <button
                    type="button"
                    onClick={() => togglePhase(phase.phaseNumber)}
                    className="w-full p-4 flex items-center justify-between gap-3 text-left bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30">
                        {phase.duration}
                      </span>
                      <div>
                        <div className="text-sm font-bold text-theme-main font-heading">
                          Phase {phase.phaseNumber}: {phase.title}
                        </div>
                        <div className="text-[11px] text-theme-muted">{phase.objective}</div>
                      </div>
                    </div>
                    <span className={`text-sm text-theme-subtle transition-transform ${expandedPhases[phase.phaseNumber] ? 'rotate-180' : ''}`}>▼</span>
                  </button>

                  {expandedPhases[phase.phaseNumber] && (
                    <div className="p-4 space-y-3 border-t border-theme-glass animate-fadeIn">
                      {(phase.tasks || []).map((task, tidx) => (
                        <div key={tidx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-theme-glass space-y-2.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded-lg bg-sky-500/20 text-sky-700 dark:text-sky-300 text-[10px] font-mono font-bold">
                              {task.taskId}
                            </span>
                            <span className="text-xs font-bold text-theme-main">{task.title}</span>
                          </div>
                          <div className="text-[11px] font-mono text-theme-muted flex items-center gap-1.5">
                            <span>📄</span> <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{task.file}</span>
                          </div>
                          <p className="text-xs text-theme-main leading-relaxed">{task.description}</p>
                          {task.codeSnippet && (
                            <pre className="p-3 rounded-xl bg-slate-900 dark:bg-black text-emerald-300 text-[11px] font-mono overflow-x-auto leading-relaxed border border-white/10">
                              {task.codeSnippet}
                            </pre>
                          )}
                          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-mono flex items-start gap-1.5">
                            <span className="shrink-0">✓</span>
                            <span><strong>Verify:</strong> {task.testCriteria}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB: File Structure */}
          {activeTab === 'structure' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-theme-glass space-y-2">
                <div className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                  📁 PROJECT FILE TREE
                </div>
                <div className="space-y-1.5 font-mono text-xs">
                  {(buildGuide.folderStructure || []).map((f, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-200/50 dark:hover:bg-white/5 transition-all">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 ${
                        f.priority === 'P0'
                          ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                          : 'bg-slate-200 dark:bg-slate-800 text-theme-muted'
                      }`}>
                        {f.priority}
                      </span>
                      <div className="min-w-0">
                        <div className="text-emerald-600 dark:text-emerald-400 font-semibold truncate">{f.path}</div>
                        <div className="text-theme-muted text-[10px] mt-0.5">{f.purpose}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Environment Setup */}
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-theme-glass space-y-3">
                <div className="text-[11px] font-mono font-bold text-sky-600 dark:text-sky-400 uppercase">
                  ⚡ SETUP COMMANDS
                </div>
                {(buildGuide.environmentSetup?.installCommands || []).map((cmd, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-900 dark:bg-black border border-white/10">
                    <code className="text-[11px] text-emerald-300 font-mono block">{cmd.command}</code>
                    <div className="text-[10px] text-slate-500 mt-1"># {cmd.purpose}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: API Specification */}
          {activeTab === 'api' && (
            <div className="space-y-3 animate-fadeIn">
              {(buildGuide.apiSpecification || []).map((api, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-theme-glass space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold ${
                      api.method === 'GET'
                        ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                        : api.method === 'POST'
                        ? 'bg-sky-500/20 text-sky-700 dark:text-sky-300'
                        : 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                    }`}>
                      {api.method}
                    </span>
                    <code className="text-xs font-mono text-theme-main font-bold">{api.endpoint}</code>
                  </div>
                  <p className="text-xs text-theme-muted">{api.purpose}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB: Data Schema */}
          {activeTab === 'data' && (
            <div className="space-y-3 animate-fadeIn">
              <p className="text-xs text-theme-muted font-mono">{buildGuide.dataSchema?.description}</p>
              {(buildGuide.dataSchema?.models || []).map((model, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-theme-glass space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">💾 {model.name}</span>
                    <span className="text-[10px] text-theme-muted font-mono">({model.storage})</span>
                  </div>
                  <div className="space-y-1 font-mono text-[11px]">
                    {(model.fields || []).map((field, fidx) => (
                      <div key={fidx} className="text-theme-main pl-3 border-l-2 border-purple-500/30">
                        {field}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: Testing */}
          {activeTab === 'testing' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-theme-glass space-y-2">
                <div className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">🧪 UNIT TESTS</div>
                {(buildGuide.testingStrategy?.unitTests || []).map((t, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-theme-main">
                    <span className="text-emerald-500 shrink-0">✦</span> <span>{t}</span>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-theme-glass space-y-2">
                <div className="text-[11px] font-mono font-bold text-sky-600 dark:text-sky-400 uppercase">🔗 INTEGRATION TESTS</div>
                {(buildGuide.testingStrategy?.integrationTests || []).map((t, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-theme-main">
                    <span className="text-sky-500 shrink-0">✦</span> <span>{t}</span>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-theme-glass space-y-2">
                <div className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase">🎤 DEMO VALIDATION</div>
                {(buildGuide.testingStrategy?.demoValidation || []).map((t, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-theme-main">
                    <span className="text-amber-500 shrink-0">✦</span> <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Deployment */}
          {activeTab === 'deploy' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                    🚀 DEPLOYMENT PLATFORM
                  </div>
                  <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-bold">
                    {buildGuide.deploymentGuide?.platform || 'Vercel'}
                  </span>
                </div>
                <div className="space-y-2">
                  {(buildGuide.deploymentGuide?.steps || []).map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-theme-main">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
                {buildGuide.deploymentGuide?.demoUrl && (
                  <div className="p-2.5 rounded-xl bg-slate-900 dark:bg-black border border-white/10 font-mono text-xs text-emerald-300">
                    🌐 Expected URL: {buildGuide.deploymentGuide.demoUrl}
                  </div>
                )}
              </div>

              {/* Critical Warnings */}
              {buildGuide.criticalWarnings?.length > 0 && (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-500/30 space-y-2">
                  <div className="text-[11px] font-mono font-bold text-rose-600 dark:text-rose-400 uppercase">
                    ⚠️ CRITICAL WARNINGS
                  </div>
                  {buildGuide.criticalWarnings.map((w, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-rose-700 dark:text-rose-300">
                      <span className="shrink-0">⚠️</span>
                      <span className="leading-relaxed">{w}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* Empty State */}
      {!buildGuide && !loading && (
        <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-dashed border-theme-glass text-center space-y-3">
          <div className="text-4xl">🏗️</div>
          <h4 className="text-sm font-bold text-theme-main font-heading">
            Generate Your Deep Build Guide
          </h4>
          <p className="text-xs text-theme-muted max-w-md mx-auto leading-relaxed">
            Click &quot;Generate Build Guide&quot; to create a comprehensive execution blueprint
            with file structures, code snippets, API specs, and deployment instructions — all
            strictly based on your locked idea.
          </p>
        </div>
      )}

    </div>
  );
}
