import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GenerationType } from '../../types/generator';
import { CopyButton } from '../common/CopyButton';
import {
  History,
  GitCommit,
  GitPullRequest,
  Tag,
  Trash2,
  Zap,
  Database,
  Search,
  ExternalLink,
  Clock,
  Check,
} from 'lucide-react';

export const HistoryView: React.FC = () => {
  const { history, deleteHistoryItem, clearAllHistory, showToast, setActiveTab } = useApp();
  const [filterType, setFilterType] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<string | null>(history[0]?.id || null);

  const filtered = history.filter((item) => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.preview.toLowerCase().includes(search.toLowerCase()) ||
      (item.repoName && item.repoName.toLowerCase().includes(search.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const activeItemData = history.find((h) => h.id === selectedItem);

  const getIcon = (type: GenerationType) => {
    switch (type) {
      case 'commit':
        return <GitCommit className="w-4 h-4 text-emerald-400" />;
      case 'pr':
        return <GitPullRequest className="w-4 h-4 text-cyan-400" />;
      case 'release':
        return <Tag className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#30363d] pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100">Generation History & Cache</h1>
            <p className="text-xs text-slate-400">
              Synchronized with Spring Boot PostgreSQL (User history) and Redis (Cache layer).
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={clearAllHistory}
            className="px-3 py-1.5 rounded-md bg-rose-950/30 hover:bg-rose-950/60 text-rose-300 text-xs font-medium border border-rose-900/40 flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: History list (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Filters */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search history..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#161b22] border border-[#30363d] text-xs rounded-lg pl-8 pr-3 py-1.5 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-[#161b22] border border-[#30363d] text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Types</option>
              <option value="commit">Commits</option>
              <option value="pr">Pull Requests</option>
              <option value="release">Releases</option>
            </select>
          </div>

          {/* List items */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg divide-y divide-[#30363d] max-h-[600px] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No past generation records found.
              </div>
            ) : (
              filtered.map((item) => {
                const isSelected = item.id === selectedItem;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item.id)}
                    className={`p-3 cursor-pointer transition-colors space-y-1.5 ${
                      isSelected ? 'bg-cyan-950/30 border-l-2 border-l-cyan-500' : 'hover:bg-[#21262d]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {getIcon(item.type)}
                        <span className="text-xs font-semibold text-slate-200 truncate max-w-[200px]">
                          {item.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.cached ? (
                          <span
                            className="flex items-center gap-0.5 text-[9px] px-1 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono"
                            title="Cached in Redis"
                          >
                            <Zap className="w-2.5 h-2.5" /> Redis
                          </span>
                        ) : (
                          <span
                            className="flex items-center gap-0.5 text-[9px] px-1 py-0.2 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20 font-mono"
                            title="Stored in PostgreSQL"
                          >
                            <Database className="w-2.5 h-2.5" /> Postgres
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-mono text-slate-400">{item.repoName || 'general'}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detail preview (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {activeItemData ? (
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 space-y-4">
              <div className="flex items-start justify-between gap-4 border-b border-[#30363d] pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {getIcon(activeItemData.type)}
                    <span className="text-sm font-bold text-slate-100">{activeItemData.title}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="font-mono text-cyan-400">Repository: {activeItemData.repoName}</span>
                    <span>•</span>
                    <span>{activeItemData.timestamp}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <CopyButton text={activeItemData.fullOutput} label="Copy Output" />
                  <button
                    onClick={() => deleteHistoryItem(activeItemData.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-[#21262d] transition-colors"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Stored Content Display */}
              <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3.5 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-[460px] overflow-y-auto">
                {activeItemData.fullOutput}
              </div>

              {/* Status footer */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-[#30363d]">
                <div className="flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Persisted in PostgreSQL <code>generation_history</code> table</span>
                </div>
                {activeItemData.cached && (
                  <div className="flex items-center gap-1.5 text-amber-300">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Active in Redis cache</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-12 text-center text-slate-500 text-xs">
              Select an item from the history list to view its full output and metadata.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
