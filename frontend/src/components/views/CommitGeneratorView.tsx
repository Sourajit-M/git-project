import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DiffViewer } from '../common/DiffViewer';
import { CopyButton } from '../common/CopyButton';
import { aiService } from '../../services/aiService';
import { SAMPLE_DIFFS } from '../../services/mockData';
import { CommitGenerateResponse, CommitFormat } from '../../types/generator';
import {
  GitCommit,
  Sparkles,
  Terminal,
  Zap,
  CheckCircle,
  RefreshCw,
  SlidersHorizontal,
  BookmarkCheck,
  Cpu,
  Layers,
} from 'lucide-react';

export const CommitGeneratorView: React.FC = () => {
  const { selectedRepo, isDemoMode, addToHistory, showToast } = useApp();

  const [diff, setDiff] = useState<string>(SAMPLE_DIFFS.feature);
  const [format, setFormat] = useState<CommitFormat>('conventional');
  const [includeScope, setIncludeScope] = useState<boolean>(true);
  const [scope, setScope] = useState<string>('auth');
  const [customContext, setCustomContext] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<CommitGenerateResponse | null>(null);

  const handleGenerate = async () => {
    if (!diff.trim()) {
      showToast('Please enter or paste a Git diff first', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await aiService.generateCommitMessage(
        {
          diff,
          repoName: selectedRepo?.name,
          format,
          includeScope,
          scope: scope.trim() || undefined,
          additionalContext: customContext.trim() || undefined,
        },
        isDemoMode
      );
      setResult(response);

      // Record to PostgreSQL history / local cache
      await addToHistory({
        type: 'commit',
        title: response.title,
        preview: response.primaryMessage,
        cached: response.cachedInRedis || false,
        repoName: selectedRepo?.name,
        fullOutput: response.primaryMessage,
      });

      showToast('Generated commit message successfully!', 'success');
    } catch {
      showToast('Generation failed. Check your API settings.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyAlternative = (alt: string) => {
    if (!result) return;
    const updated = {
      ...result,
      title: alt,
      primaryMessage: `${alt}\n\n${result.body || ''}`,
    };
    setResult(updated);
    showToast('Updated active commit message to selected alternative', 'info');
  };

  const loadSampleDiff = (type: 'feature' | 'bugfix' | 'refactor') => {
    setDiff(SAMPLE_DIFFS[type]);
    if (type === 'feature') setScope('auth');
    if (type === 'bugfix') setScope('cache');
    if (type === 'refactor') setScope('controller');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Description */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#30363d] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <GitCommit className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100">AI Commit Message Generator</h1>
              <p className="text-xs text-slate-400">
                Transforms staged diffs into meaningful, semantic Conventional Commits.
              </p>
            </div>
          </div>
        </div>

        {/* Diff Preset Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Presets:</span>
          <button
            onClick={() => loadSampleDiff('feature')}
            className="px-2.5 py-1 text-xs rounded-md bg-[#21262d] hover:bg-[#30363d] text-slate-300 border border-[#30363d] transition-colors"
          >
            OAuth Feature
          </button>
          <button
            onClick={() => loadSampleDiff('bugfix')}
            className="px-2.5 py-1 text-xs rounded-md bg-[#21262d] hover:bg-[#30363d] text-slate-300 border border-[#30363d] transition-colors"
          >
            Redis Cache Bug
          </button>
          <button
            onClick={() => loadSampleDiff('refactor')}
            className="px-2.5 py-1 text-xs rounded-md bg-[#21262d] hover:bg-[#30363d] text-slate-300 border border-[#30363d] transition-colors"
          >
            DTO Refactor
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Diff & Options (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Options Strip */}
          <div className="p-3.5 bg-[#161b22] border border-[#30363d] rounded-lg space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Generation Settings</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Commit Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as CommitFormat)}
                  className="w-full bg-[#0d1117] border border-[#30363d] text-slate-200 text-xs rounded-md p-1.5 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="conventional">Conventional Commits</option>
                  <option value="gitmoji">Gitmoji + Conventional</option>
                  <option value="concise">Concise One-Liner</option>
                  <option value="detailed">Detailed with Bullets</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Scope Prefix</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={includeScope}
                    onChange={(e) => setIncludeScope(e.target.checked)}
                    id="incScope"
                    className="rounded bg-[#0d1117] border-[#30363d] text-cyan-500 focus:ring-0"
                  />
                  <input
                    type="text"
                    placeholder="e.g. auth, api, ui"
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                    disabled={!includeScope}
                    className="w-full bg-[#0d1117] border border-[#30363d] text-slate-200 text-xs rounded-md p-1.5 disabled:opacity-50 focus:border-cyan-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Extra Prompt Context</label>
                <input
                  type="text"
                  placeholder="e.g. Closes issue #41"
                  value={customContext}
                  onChange={(e) => setCustomContext(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] text-slate-200 text-xs rounded-md p-1.5 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Diff Viewer Component */}
          <DiffViewer diff={diff} onDiffChange={setDiff} isEditable={true} />

          {/* Action Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analyzing Diff & Prompting AI Model...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Commit Message</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Generated Output (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 space-y-4 min-h-[440px] flex flex-col justify-between">
            {result ? (
              <div className="space-y-4">
                {/* Result Top Badges */}
                <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                      <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                      Generated Output
                    </span>
                    {result.cachedInRedis && (
                      <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-mono flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Redis Hit
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                    <Cpu className="w-3 h-3 text-cyan-400" />
                    <span>{result.modelUsed}</span>
                  </div>
                </div>

                {/* Main Commit Card */}
                <div className="bg-[#0d1117] border border-emerald-500/30 rounded-lg p-3.5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-mono text-xs font-bold text-emerald-400 break-words leading-relaxed">
                      {result.title}
                    </div>
                    <CopyButton text={result.title} label="Title" />
                  </div>

                  {result.body && (
                    <div className="border-t border-[#30363d] pt-2 text-xs font-mono text-slate-300 whitespace-pre-line leading-relaxed">
                      {result.body}
                    </div>
                  )}
                </div>

                {/* Quick Git Shell Command */}
                <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-2.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-mono text-xs text-slate-400 overflow-hidden text-ellipsis whitespace-nowrap">
                    <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="truncate">git commit -m &quot;{result.title}&quot;</span>
                  </div>
                  <CopyButton
                    text={`git commit -m "${result.primaryMessage.replace(/"/g, '\\"')}"`}
                    label="CLI"
                    variant="solid"
                  />
                </div>

                {/* Rationale & Explanation */}
                <div className="p-3 bg-[#0d1117]/60 border border-[#30363d] rounded-lg">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                    AI Rationale
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">{result.explanation}</p>
                </div>

                {/* Alternative Suggestions */}
                {result.alternatives && result.alternatives.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-slate-400 block">
                      Alternative Suggestions (click to select):
                    </span>
                    <div className="space-y-1.5">
                      {result.alternatives.map((alt, i) => (
                        <div
                          key={i}
                          onClick={() => handleApplyAlternative(alt)}
                          className="p-2 rounded-md bg-[#0d1117] border border-[#30363d] hover:border-cyan-500/50 hover:bg-[#161b22] text-xs font-mono text-slate-300 cursor-pointer flex items-center justify-between group transition-colors"
                        >
                          <span className="truncate">{alt}</span>
                          <span className="text-[10px] text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            Use this
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center text-slate-500 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#0d1117] border border-[#30363d] flex items-center justify-center">
                  <GitCommit className="w-6 h-6 text-slate-600" />
                </div>
                <p className="text-xs max-w-xs">
                  Click <strong className="text-slate-300">Generate Commit Message</strong> to analyze the diff on the left and produce structured Conventional Commits.
                </p>
              </div>
            )}

            {/* Bottom Actions */}
            {result && (
              <div className="pt-3 border-t border-[#30363d] flex items-center justify-between">
                <CopyButton text={result.primaryMessage} label="Copy Full Message" />
                <button
                  onClick={handleGenerate}
                  className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Regenerate</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
