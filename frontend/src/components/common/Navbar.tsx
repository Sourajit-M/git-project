import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  GitBranch,
  FolderGit2,
  ToggleLeft,
  ToggleRight,
  LogOut,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { GithubIcon } from './Icons';

export const Navbar: React.FC = () => {
  const {
    user,
    isAuthenticated,
    isDemoMode,
    toggleDemoMode,
    repositories,
    selectedRepo,
    setSelectedRepo,
    loginWithGitHub,
    logout,
    setActiveTab,
  } = useApp();

  return (
    <header className="h-16 border-b border-[#30363d] bg-[#161b22]/90 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-6 flex items-center justify-between">
      {/* Brand & Active repo */}
      <div className="flex items-center gap-6">
        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-black font-bold shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <GitBranch className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-100 tracking-tight text-sm">GitAI Hub</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">AI Git & Release Engineering</p>
          </div>
        </div>

        {/* Repository selector */}
        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-[#30363d]">
            <FolderGit2 className="w-4 h-4 text-slate-400" />
            <div className="relative">
              <select
                value={selectedRepo?.name || ''}
                onChange={(e) => {
                  const found = repositories.find((r) => r.name === e.target.value);
                  setSelectedRepo(found || null);
                }}
                className="appearance-none bg-[#0d1117] border border-[#30363d] rounded-md text-xs font-mono text-slate-200 py-1.5 pl-3 pr-8 hover:border-slate-500 focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                {repositories.map((repo) => (
                  <option key={repo.id} value={repo.name}>
                    {repo.name} ({repo.defaultBranch})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      {/* Right controls: Demo Toggle, Architecture link, User profile */}
      <div className="flex items-center gap-4">
        {/* Architecture viewer button */}
        <button
          onClick={() => setActiveTab('architecture')}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-[#21262d] hover:bg-[#30363d] text-slate-300 border border-[#30363d] transition-colors"
          title="View System Architecture Diagram"
        >
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Architecture</span>
        </button>

        {/* Demo Mode toggle pill */}
        <div
          onClick={toggleDemoMode}
          className="flex items-center gap-2 px-2.5 py-1 rounded-full border border-[#30363d] bg-[#0d1117] text-xs cursor-pointer select-none hover:border-slate-500 transition-colors"
          title="Toggle between Simulated Mock Data and Live Node.js REST API (localhost:8080)"
        >
          <span className="text-[11px] text-slate-400">Mode:</span>
          {isDemoMode ? (
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span>Demo</span>
              <ToggleLeft className="w-4 h-4 text-emerald-400" />
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-cyan-400 font-medium">
              <span>Live API</span>
              <ToggleRight className="w-4 h-4 text-cyan-400" />
            </div>
          )}
        </div>

        {/* GitHub User Account & OAuth */}
        {isAuthenticated && user ? (
          <div className="flex items-center gap-3">
            <a
              href={user.htmlUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 group"
              title={`Connected via GitHub: ${user.name}`}
            >
              <img
                src={user.avatarUrl}
                alt={user.username}
                className="w-7 h-7 rounded-full border border-[#30363d] object-cover"
              />
              <span className="text-xs font-medium text-slate-300 group-hover:text-slate-100 hidden lg:inline">
                {user.username}
              </span>
            </a>
            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-md hover:bg-[#21262d] transition-colors"
              title="Sign out of GitHub"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={loginWithGitHub}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#24292f] hover:bg-[#2c323b] text-white text-xs font-medium border border-[#30363d] transition-colors shadow-sm"
          >
            <GithubIcon className="w-4 h-4" />
            <span>Connect GitHub</span>
          </button>
        )}
      </div>
    </header>
  );
};
