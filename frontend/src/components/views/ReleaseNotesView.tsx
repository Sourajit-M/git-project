import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CopyButton } from '../common/CopyButton';
import { MarkdownPreview } from '../common/MarkdownPreview';
import { aiService } from '../../services/aiService';
import { SAMPLE_COMMITS_FOR_RELEASE } from '../../services/mockData';
import { ReleaseNotesResponse } from '../../types/generator';
import {
  Tag,
  Sparkles,
  RefreshCw,
  Eye,
  Code,
  Layers,
  Cpu,
  Zap,
  ListPlus,
  BookOpen,
} from 'lucide-react';

export const ReleaseNotesView: React.FC = () => {
  const { selectedRepo, isDemoMode, addToHistory, showToast } = useApp();

  const [version, setVersion] = useState<string>('v1.4.0');
  const [previousVersion, setPreviousVersion] = useState<string>('v1.3.0');
  const [audience, setAudience] = useState<'developers' | 'users' | 'stakeholders'>('developers');
  const [commitsList, setCommitsList] = useState<string>(SAMPLE_COMMITS_FOR_RELEASE);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ReleaseNotesResponse | null>(null);
  const [outputTab, setOutputTab] = useState<'preview' | 'raw'>('preview');

  const handleGenerateRelease = async () => {
    if (!commitsList.trim()) {
      showToast('Please provide a collection of commit messages', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await aiService.generateReleaseNotes(
        {
          version,
          previousVersion,
          commitsList,
          audience,
        },
        isDemoMode
      );
      setResult(response);

      await addToHistory({
        type: 'release',
        title: `Release ${version} Changelog`,
        preview: response.releaseTitle,
        cached: response.cachedInRedis || false,
        repoName: selectedRepo?.name,
        fullOutput: response.rawMarkdown,
      });

      showToast(`Release notes for ${version} generated!`, 'success');
    } catch {
      showToast('Failed to generate release notes', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#30363d] pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100">Release Notes & Changelog Generator</h1>
            <p className="text-xs text-slate-400">
              Turns a collection of commits and pull requests into categorized, publication-ready release notes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCommitsList(SAMPLE_COMMITS_FOR_RELEASE)}
            className="px-2.5 py-1 text-xs rounded-md bg-[#21262d] hover:bg-[#30363d] text-slate-300 border border-[#30363d] transition-colors flex items-center gap-1.5"
          >
            <ListPlus className="w-3.5 h-3.5" />
            <span>Load Sample Commits</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Versioning & Commit Log Input (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-3.5 bg-[#161b22] border border-[#30363d] rounded-lg space-y-3">
            <span className="text-xs font-semibold text-slate-300 block">Release Configuration</span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">New Version Tag</label>
                <input
                  type="text"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] text-slate-200 text-xs rounded-md p-1.5 font-mono focus:border-cyan-500 focus:outline-none"
                  placeholder="v1.4.0"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Previous Tag</label>
                <input
                  type="text"
                  value={previousVersion}
                  onChange={(e) => setPreviousVersion(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] text-slate-200 text-xs rounded-md p-1.5 font-mono focus:border-cyan-500 focus:outline-none"
                  placeholder="v1.3.0"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Target Audience</label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value as any)}
                  className="w-full bg-[#0d1117] border border-[#30363d] text-slate-200 text-xs rounded-md p-1.5 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="developers">Developers & PRs</option>
                  <option value="users">End Users / Public</option>
                  <option value="stakeholders">Stakeholders</option>
                </select>
              </div>
            </div>
          </div>

          {/* Commits log textarea */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden flex flex-col">
            <div className="px-3.5 py-2 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Input Commits / Git Log Range</span>
              <span className="text-[11px] text-slate-400 font-mono">
                {commitsList.split('\n').filter((l) => l.trim()).length} commits
              </span>
            </div>
            <textarea
              rows={14}
              value={commitsList}
              onChange={(e) => setCommitsList(e.target.value)}
              placeholder="Paste git log --oneline output or PR titles here..."
              className="w-full bg-[#0d1117] text-slate-200 font-mono text-xs p-3.5 outline-none resize-y border-0 focus:ring-1 focus:ring-purple-500/50"
            />
          </div>

          <button
            onClick={handleGenerateRelease}
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Aggregating Commits into Release Notes...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Release Notes ({version})</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Generated Release Output (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 space-y-4 min-h-[500px] flex flex-col justify-between">
            {result ? (
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-200">Publication Output</span>
                    {result.cachedInRedis && (
                      <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-mono flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Redis Hit
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-cyan-400" />
                      {result.modelUsed}
                    </span>
                    <CopyButton text={result.rawMarkdown} label="Copy Changelog" variant="solid" />
                  </div>
                </div>

                {/* Release summary banner */}
                <div className="bg-[#0d1117] border border-purple-500/30 rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-purple-300 block">{result.releaseTitle}</span>
                    <span className="text-[11px] text-slate-400">Published: {result.generatedDate}</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">
                    {result.version}
                  </span>
                </div>

                {/* Preview / Raw Tabs */}
                <div className="flex items-center gap-2 border-b border-[#30363d] pb-2">
                  <button
                    onClick={() => setOutputTab('preview')}
                    className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded transition-colors ${
                      outputTab === 'preview'
                        ? 'bg-[#21262d] text-purple-300 font-medium'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Formatted Markdown</span>
                  </button>
                  <button
                    onClick={() => setOutputTab('raw')}
                    className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded transition-colors ${
                      outputTab === 'raw'
                        ? 'bg-[#21262d] text-purple-300 font-medium'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>Raw Markdown</span>
                  </button>
                </div>

                {outputTab === 'preview' ? (
                  <MarkdownPreview content={result.rawMarkdown} />
                ) : (
                  <textarea
                    readOnly
                    value={result.rawMarkdown}
                    rows={16}
                    className="w-full bg-[#0d1117] text-slate-300 font-mono text-xs p-3.5 rounded-lg border border-[#30363d] outline-none resize-none"
                  />
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-20 text-center text-slate-500 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#0d1117] border border-[#30363d] flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-slate-600" />
                </div>
                <p className="text-xs max-w-xs">
                  Input your release version and git commit log on the left, then click <strong className="text-slate-300">Generate Release Notes</strong> to produce a clean changelog categorized by features, fixes, and performance updates.
                </p>
              </div>
            )}

            {result && (
              <div className="pt-3 border-t border-[#30363d] flex items-center justify-between">
                <CopyButton text={result.rawMarkdown} label="Copy for GitHub Releases" />
                <button
                  onClick={handleGenerateRelease}
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
