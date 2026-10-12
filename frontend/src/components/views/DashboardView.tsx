import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Repository } from '../../types/repo';
import {
  FolderGit2,
  Search,
  Star,
  GitFork,
  Lock,
  Globe,
  GitCommit,
  GitPullRequest,
  Tag,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Zap,
  Clock,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { repositories, selectedRepo, setSelectedRepo, setActiveTab, user, isDemoMode, history } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'public' | 'private'>('all');

  const filteredRepos = repositories.filter((repo) => {
    const matchesSearch =
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repo.language.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterType === 'public') return matchesSearch && !repo.isPrivate;
    if (filterType === 'private') return matchesSearch && repo.isPrivate;
    return matchesSearch;
  });

  const handleActionClick = (repo: Repository, tab: 'commits' | 'prs' | 'releases') => {
    setSelectedRepo(repo);
    setActiveTab(tab);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner: Connected GitHub Account */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-[#161b22] to-[#1a2332] border border-[#30363d] shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatarUrl}
            alt={user?.username}
            className="w-14 h-14 rounded-full border-2 border-cyan-500/40 object-cover shadow"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-100">{user?.name || 'GitHub User'}</h2>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                @{user?.username}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                OAuth2 Connected
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Central repository hub for AI-driven Git commits, PR summaries, and automated changelogs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#0d1117] px-4 py-2 rounded-lg border border-[#30363d] text-center">
            <span className="text-xs text-slate-400 block">Repositories</span>
            <span className="text-lg font-bold text-slate-200 font-mono">{repositories.length}</span>
          </div>
          <div className="bg-[#0d1117] px-4 py-2 rounded-lg border border-[#30363d] text-center">
            <span className="text-xs text-slate-400 block">Generations</span>
            <span className="text-lg font-bold text-cyan-400 font-mono">{history.length}</span>
          </div>
        </div>
      </div>

      {/* Feature Launcher Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1 */}
        <div
          onClick={() => setActiveTab('commits')}
          className="group p-4 rounded-xl bg-[#161b22] border border-[#30363d] hover:border-emerald-500/50 hover:bg-[#1a202c] cursor-pointer transition-all shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <GitCommit className="w-5 h-5" />
            </div>
            <span className="text-xs text-slate-400 flex items-center gap-1 group-hover:text-emerald-400">
              Launch <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <h3 className="text-sm font-semibold text-slate-200 group-hover:text-white">AI Commit Generator</h3>
          <p className="text-xs text-slate-400 mt-1">
            Analyze staged changes or diffs and produce conventional commits without writing boilerplate.
          </p>
        </div>

        {/* Card 2 */}
        <div
          onClick={() => setActiveTab('prs')}
          className="group p-4 rounded-xl bg-[#161b22] border border-[#30363d] hover:border-cyan-500/50 hover:bg-[#1a202c] cursor-pointer transition-all shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <GitPullRequest className="w-5 h-5" />
            </div>
            <span className="text-xs text-slate-400 flex items-center gap-1 group-hover:text-cyan-400">
              Launch <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <h3 className="text-sm font-semibold text-slate-200 group-hover:text-white">Pull Request Descriptions</h3>
          <p className="text-xs text-slate-400 mt-1">
            Generate structured PR documentation covering summaries, key changes, rationale, and testing steps.
          </p>
        </div>

        {/* Card 3 */}
        <div
          onClick={() => setActiveTab('releases')}
          className="group p-4 rounded-xl bg-[#161b22] border border-[#30363d] hover:border-purple-500/50 hover:bg-[#1a202c] cursor-pointer transition-all shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Tag className="w-5 h-5" />
            </div>
            <span className="text-xs text-slate-400 flex items-center gap-1 group-hover:text-purple-400">
              Launch <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <h3 className="text-sm font-semibold text-slate-200 group-hover:text-white">Release Notes Generator</h3>
          <p className="text-xs text-slate-400 mt-1">
            Transform commit logs and pull requests into publication-ready changelogs and release notes.
          </p>
        </div>
      </div>

      {/* Repositories Section */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-sm">
        {/* Search & Filter Toolbar */}
        <div className="p-4 border-b border-[#30363d] flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search repositories by name, language, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-[#0d1117] border border-[#30363d] rounded-lg p-0.5 text-xs">
              {(['all', 'public', 'private'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1 rounded-md capitalize transition-colors ${
                    filterType === type
                      ? 'bg-[#21262d] text-slate-100 font-medium'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Repository Cards List */}
        <div className="divide-y divide-[#30363d]">
          {filteredRepos.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              No repositories found matching your filter criteria.
            </div>
          ) : (
            filteredRepos.map((repo) => {
              const isCurrent = selectedRepo?.id === repo.id;
              return (
                <div
                  key={repo.id}
                  className={`p-4 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isCurrent ? 'bg-cyan-950/20 border-l-4 border-l-cyan-500' : 'hover:bg-[#1c222b]'
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2.5">
                      <FolderGit2 className="w-4 h-4 text-slate-400" />
                      <a
                        href={repo.htmlUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-semibold text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                      >
                        {repo.name}
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                      </a>
                      <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border border-[#30363d] text-slate-300 bg-[#0d1117]">
                        {repo.isPrivate ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                        {repo.isPrivate ? 'Private' : 'Public'}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30 font-medium">
                          Active Selection
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">{repo.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                      <span className="flex items-center gap-1 font-mono">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                        {repo.language}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400" />
                        {repo.starsCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="w-3.5 h-3.5 text-slate-400" />
                        {repo.forksCount}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        Default: {repo.defaultBranch}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleActionClick(repo, 'commits')}
                      className="px-2.5 py-1.5 rounded-md bg-[#21262d] hover:bg-[#30363d] text-emerald-400 text-xs font-medium border border-[#30363d] flex items-center gap-1.5 transition-colors"
                      title="Analyze diff and generate commit message"
                    >
                      <GitCommit className="w-3.5 h-3.5" />
                      <span>Commit</span>
                    </button>
                    <button
                      onClick={() => handleActionClick(repo, 'prs')}
                      className="px-2.5 py-1.5 rounded-md bg-[#21262d] hover:bg-[#30363d] text-cyan-400 text-xs font-medium border border-[#30363d] flex items-center gap-1.5 transition-colors"
                      title="Generate PR summary"
                    >
                      <GitPullRequest className="w-3.5 h-3.5" />
                      <span>PR</span>
                    </button>
                    <button
                      onClick={() => handleActionClick(repo, 'releases')}
                      className="px-2.5 py-1.5 rounded-md bg-[#21262d] hover:bg-[#30363d] text-purple-400 text-xs font-medium border border-[#30363d] flex items-center gap-1.5 transition-colors"
                      title="Generate release notes"
                    >
                      <Tag className="w-3.5 h-3.5" />
                      <span>Release</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
