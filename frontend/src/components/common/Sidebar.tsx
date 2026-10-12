import React from 'react';
import { useApp, ActiveTab } from '../../context/AppContext';
import {
  LayoutDashboard,
  GitCommit,
  GitPullRequest,
  Tag,
  History,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { GithubIcon } from './Icons';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, history } = useApp();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'dashboard',
      label: 'Repository Hub',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'commits',
      label: 'Commit Generator',
      icon: <GitCommit className="w-4 h-4 text-emerald-400" />,
      badge: 'AI Diff',
    },
    {
      id: 'prs',
      label: 'Pull Request AI',
      icon: <GitPullRequest className="w-4 h-4 text-cyan-400" />,
      badge: 'Structured',
    },
    {
      id: 'releases',
      label: 'Release Notes',
      icon: <Tag className="w-4 h-4 text-purple-400" />,
      badge: 'Changelog',
    },
    {
      id: 'history',
      label: 'History & Cache',
      icon: <History className="w-4 h-4 text-amber-400" />,
      badge: history.length > 0 ? String(history.length) : undefined,
    },
    {
      id: 'architecture',
      label: 'Architecture Map',
      icon: <Layers className="w-4 h-4 text-sky-400" />,
    },
  ];

  return (
    <aside className="w-64 border-r border-[#30363d] bg-[#161b22]/50 flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none">
      <div className="p-3 space-y-6">
        <div>
          <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Workspace Tools
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-[#21262d]/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'bg-[#21262d] text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick architecture card */}
        <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Architecture Stack</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Connected via Node.js REST API with Groq AI, Redis caching, and Docker PostgreSQL.
          </p>
          <div className="pt-1 flex flex-wrap gap-1 text-[10px] font-mono text-slate-400">
            <span className="px-1.5 py-0.5 rounded bg-[#161b22] border border-[#30363d]">Node.js</span>
            <span className="px-1.5 py-0.5 rounded bg-[#161b22] border border-[#30363d]">Groq AI</span>
            <span className="px-1.5 py-0.5 rounded bg-[#161b22] border border-[#30363d]">Redis</span>
            <span className="px-1.5 py-0.5 rounded bg-[#161b22] border border-[#30363d]">PostgreSQL</span>
          </div>
        </div>
      </div>

      {/* Footer link */}
      <div className="p-3 border-t border-[#30363d] text-xs text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px]">
          <GithubIcon className="w-3.5 h-3.5" />
          <span>OAuth2 Connected</span>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Operational" />
      </div>
    </aside>
  );
};
