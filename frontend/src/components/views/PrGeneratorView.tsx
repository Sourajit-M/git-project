import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DiffViewer } from '../common/DiffViewer';
import { CopyButton } from '../common/CopyButton';
import { MarkdownPreview } from '../common/MarkdownPreview';
import { aiService } from '../../services/aiService';
import { githubService } from '../../services/githubService';
import { SAMPLE_DIFFS } from '../../services/mockData';
import { PrGenerateResponse } from '../../types/generator';
import {
  GitPullRequest,
  Sparkles,
  GitCompare,
  Eye,
  Code,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Cpu,
  Zap,
} from 'lucide-react';

export const PrGeneratorView: React.FC = () => {
  const { selectedRepo, isDemoMode, addToHistory, showToast } = useApp();

  const [baseBranch, setBaseBranch] = useState<string>('main');
  const [compareBranch, setCompareBranch] = useState<string>(
    selectedRepo?.branches[1] || 'feat/oauth2-github'
  );
  const [templateType, setTemplateType] = useState<'feature' | 'bugfix' | 'refactor' | 'full'>('full');
  const [customInstructions, setCustomInstructions] = useState<string>('');
  const [diff, setDiff] = useState<string>(SAMPLE_DIFFS.feature);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<PrGenerateResponse | null>(null);
  const [outputTab, setOutputTab] = useState<'preview' | 'raw'>('preview');

  const handleFetchDiff = async () => {
    if (!selectedRepo) return;
    try {
      showToast('Fetching branch diff from GitHub service...', 'info');
      const branchDiff = await githubService.getDiff(
        selectedRepo.name,
        baseBranch,
        compareBranch,
        isDemoMode
      );
      setDiff(branchDiff);
      showToast('Diff updated from branch comparison', 'success');
    } catch {
      showToast('Failed to fetch diff', 'error');
    }
  };

  const handleGeneratePr = async () => {
    if (!diff.trim()) {
      showToast('Please provide a diff for PR generation', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await aiService.generatePrDescription(
        {
          baseBranch,
          compareBranch,
          diff,
          templateType,
          customInstructions: customInstructions.trim() || undefined,
        },
        isDemoMode
      );
      setResult(response);

      // Save to PostgreSQL history
      await addToHistory({
        type: 'pr',
        title: response.title,
        preview: response.summary,
        cached: response.cachedInRedis || false,
        repoName: selectedRepo?.name,
        fullOutput: response.markdown,
      });

      showToast('Generated PR description successfully!', 'success');
    } catch {
      showToast('PR generation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#30363d] pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <GitPullRequest className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100">Pull Request AI Generator</h1>
            <p className="text-xs text-slate-400">
              Generates structured PR descriptions covering summary, changes, rationale, and testing information.
            </p>
          </div>
        </div>

        {/* Branch Compare selector */}
        <div className="flex items-center gap-2 bg-[#161b22] border border-[#30363d] rounded-lg p-1.5 text-xs">
          <GitCompare className="w-4 h-4 text-slate-400 ml-1" />
          <span className="text-slate-400 text-[11px]">base:</span>
          <input
            type="text"
            value={baseBranch}
            onChange={(e) => setBaseBranch(e.target.value)}
            className="w-20 bg-[#0d1117] border border-[#30363d] text-slate-200 text-xs rounded px-1.5 py-0.5 font-mono focus:outline-none"
          />
          <span className="text-slate-400 text-[11px]">← head:</span>
          <input
            type="text"
            value={compareBranch}
            onChange={(e) => setCompareBranch(e.target.value)}
            className="w-36 bg-[#0d1117] border border-[#30363d] text-slate-200 text-xs rounded px-1.5 py-0.5 font-mono focus:outline-none"
          />
          <button
            onClick={handleFetchDiff}
            className="px-2 py-0.5 rounded bg-[#21262d] hover:bg-[#30363d] text-cyan-300 text-xs transition-colors"
          >
            Load Diff
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Configuration & Diff Input (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-3.5 bg-[#161b22] border border-[#30363d] rounded-lg space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>PR Configuration</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">PR Template</label>
                <select
                  value={templateType}
                  onChange={(e) => setTemplateType(e.target.value as any)}
                  className="w-full bg-[#0d1117] border border-[#30363d] text-slate-200 text-xs rounded-md p-1.5 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="full">Standard Full PR (Summary + Changes + Testing)</option>
                  <option value="feature">Feature Implementation</option>
                  <option value="bugfix">Bug Fix & Root Cause</option>
                  <option value="refactor">Architecture Refactoring</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Custom Notes / Context</label>
                <input
                  type="text"
                  placeholder="e.g. Include regression test results"
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] text-slate-200 text-xs rounded-md p-1.5 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <DiffViewer diff={diff} onDiffChange={setDiff} isEditable={true} maxHeight="max-h-[380px]" />

          <button
            onClick={handleGeneratePr}
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-800 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/30 transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating Structured PR via Groq AI Service...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Pull Request Description</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Output Markdown & Preview (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 space-y-4 min-h-[500px] flex flex-col justify-between">
            {result ? (
              <div className="space-y-4">
                {/* Header info */}
                <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-200">Generated PR Draft</span>
                    {result.cachedInRedis && (
                      <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-mono flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Redis Cached
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-cyan-400" />
                      {result.modelUsed}
                    </span>
                    <CopyButton text={result.markdown} label="Copy PR Markdown" variant="solid" />
                  </div>
                </div>

                {/* PR Title field */}
                <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-2.5 flex items-center justify-between gap-2">
                  <div className="text-xs font-semibold text-slate-200 truncate">
                    <span className="text-slate-400 mr-2">PR Title:</span>
                    {result.title}
                  </div>
                  <CopyButton text={result.title} label="Title" />
                </div>

                {/* View Mode Tabs */}
                <div className="flex items-center gap-2 border-b border-[#30363d] pb-2">
                  <button
                    onClick={() => setOutputTab('preview')}
                    className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded transition-colors ${
                      outputTab === 'preview'
                        ? 'bg-[#21262d] text-cyan-300 font-medium'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Formatted Preview</span>
                  </button>
                  <button
                    onClick={() => setOutputTab('raw')}
                    className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded transition-colors ${
                      outputTab === 'raw'
                        ? 'bg-[#21262d] text-cyan-300 font-medium'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>Raw Markdown</span>
                  </button>
                </div>

                {/* Output content */}
                {outputTab === 'preview' ? (
                  <MarkdownPreview content={result.markdown} />
                ) : (
                  <textarea
                    readOnly
                    value={result.markdown}
                    rows={16}
                    className="w-full bg-[#0d1117] text-slate-300 font-mono text-xs p-3.5 rounded-lg border border-[#30363d] outline-none resize-none"
                  />
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-20 text-center text-slate-500 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#0d1117] border border-[#30363d] flex items-center justify-center">
                  <GitPullRequest className="w-6 h-6 text-slate-600" />
                </div>
                <p className="text-xs max-w-xs">
                  Compare branches or paste a diff on the left, then click <strong className="text-slate-300">Generate Pull Request Description</strong> to create structured markdown ready for GitHub.
                </p>
              </div>
            )}

            {result && (
              <div className="pt-3 border-t border-[#30363d] flex items-center justify-between">
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Ready to paste into GitHub PR description
                </div>
                <button
                  onClick={handleGeneratePr}
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
