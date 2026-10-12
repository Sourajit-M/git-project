import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Layers,
  ArrowDownUp,
  Sparkles,
  Database,
  Zap,
  Server,
  Monitor,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Shield,
  RefreshCw,
} from 'lucide-react';
import { GithubIcon } from '../common/Icons';

export const ArchitectureView: React.FC = () => {
  const { isDemoMode, toggleDemoMode, showToast } = useApp();
  const [checkingBackend, setCheckingBackend] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'unknown' | 'online' | 'offline'>('unknown');

  const checkApi = async () => {
    setCheckingBackend(true);
    try {
      const res = await fetch('http://localhost:8080/api/v1/health', { method: 'GET' });
      if (res.ok) {
        setBackendStatus('online');
        showToast('Connected to Node.js Backend API on :8080', 'success');
      } else {
        setBackendStatus('offline');
        showToast('Backend responded with non-200 status', 'error');
      }
    } catch {
      setBackendStatus('offline');
      showToast('Could not reach http://localhost:8080. Check if backend is running.', 'info');
    } finally {
      setCheckingBackend(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#30363d] pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100">System Architecture & Service Map</h1>
            <p className="text-xs text-slate-400">
              Interactive architectural diagram reflecting your full-stack technical design.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={checkApi}
            disabled={checkingBackend}
            className="px-3 py-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-slate-200 text-xs font-medium border border-[#30363d] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checkingBackend ? 'animate-spin' : ''}`} />
            <span>Ping Backend (:8080)</span>
          </button>
        </div>
      </div>

      {/* Architecture Visual Diagram */}
      <div className="p-6 rounded-2xl bg-[#0d1117] border border-[#30363d] shadow-2xl space-y-6">
        {/* Tier 1: Frontend */}
        <div className="max-w-xl mx-auto p-4 rounded-xl bg-[#161b22] border-2 border-cyan-500/40 shadow-lg text-center space-y-1.5 transition-transform hover:scale-[1.01]">
          <div className="flex items-center justify-center gap-2">
            <Monitor className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100">React + Tailwind frontend</h3>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Dashboard • Diff input • Generated output
          </p>
          <div className="pt-2 flex items-center justify-center gap-2 text-[10px]">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              Vite + React 18
            </span>
            <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
              Tailwind CSS
            </span>
            <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium">
              Lucide Icons
            </span>
          </div>
        </div>

        {/* Arrow connector */}
        <div className="flex flex-col items-center justify-center text-slate-400">
          <ArrowDownUp className="w-6 h-6 text-cyan-400 animate-pulse" />
          <span className="text-[11px] font-mono text-slate-500 mt-1">REST API / JSON Payloads</span>
        </div>

        {/* Tier 2: Node.js REST API */}
        <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4 shadow-xl">
          <div className="text-center space-y-1 border-b border-[#30363d] pb-3">
            <div className="flex items-center justify-center gap-2">
              <Server className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold text-slate-100">Node.js REST API (Port 8080)</h2>
              {backendStatus === 'online' && (
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono">
                  <CheckCircle2 className="w-3 h-3" /> Online
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Express.js • Zod Validation • JWT Security
            </p>
          </div>

          {/* Tier 3: 4 Core Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* GitHub Service */}
            <div className="p-4 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-2 hover:border-slate-500 transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-slate-800 flex items-center justify-center">
                  <GithubIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">GitHub service</h4>
                  <p className="text-[11px] text-slate-400">OAuth2 + repository data</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Manages authorization codes, GitHub access tokens, pulls branches, and streams raw commit diffs.
              </p>
            </div>

            {/* AI Service */}
            <div className="p-4 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-2 hover:border-slate-500 transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-cyan-950/60 border border-cyan-800/40 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">AI service</h4>
                  <p className="text-[11px] text-slate-400">Groq (llama-3.3-70b-versatile)</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                High-speed inference for Conventional Commits, structured PR descriptions, and markdown release notes.
              </p>
            </div>

            {/* PostgreSQL */}
            <div className="p-4 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-2 hover:border-slate-500 transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-blue-950/60 border border-blue-800/40 flex items-center justify-center">
                  <Database className="w-4 h-4 text-sky-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">PostgreSQL (Docker)</h4>
                  <p className="text-[11px] text-slate-400">Prisma ORM • Users + history</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Relational storage for user accounts, repositories metadata, and historical generation telemetry.
              </p>
            </div>

            {/* Redis */}
            <div className="p-4 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-2 hover:border-slate-500 transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-amber-950/60 border border-amber-800/40 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Redis (Docker)</h4>
                  <p className="text-[11px] text-slate-400">ioredis • 45m Sliding TTL Cache</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                In-memory caching for OAuth sessions and sub-10ms response caching for identical diff queries.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* API Endpoints Contract Card */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-semibold text-slate-200">Node.js REST API Contracts</h3>
        <p className="text-xs text-slate-400">
          The frontend communicates directly with these standard REST endpoints:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 rounded bg-[#0d1117] border border-[#30363d] flex items-center justify-between">
            <div>
              <span className="text-emerald-400 font-bold mr-2">POST</span>
              <span className="text-slate-300">/api/v1/ai/generate/commit</span>
            </div>
            <span className="text-[10px] text-slate-500">Diff → Commit</span>
          </div>
          <div className="p-2.5 rounded bg-[#0d1117] border border-[#30363d] flex items-center justify-between">
            <div>
              <span className="text-emerald-400 font-bold mr-2">POST</span>
              <span className="text-slate-300">/api/v1/ai/generate/pull-request</span>
            </div>
            <span className="text-[10px] text-slate-500">Branch → PR</span>
          </div>
          <div className="p-2.5 rounded bg-[#0d1117] border border-[#30363d] flex items-center justify-between">
            <div>
              <span className="text-emerald-400 font-bold mr-2">POST</span>
              <span className="text-slate-300">/api/v1/ai/generate/release-notes</span>
            </div>
            <span className="text-[10px] text-slate-500">Commits → Notes</span>
          </div>
          <div className="p-2.5 rounded bg-[#0d1117] border border-[#30363d] flex items-center justify-between">
            <div>
              <span className="text-cyan-400 font-bold mr-2">GET</span>
              <span className="text-slate-300">/api/v1/github/repositories</span>
            </div>
            <span className="text-[10px] text-slate-500">User Repos</span>
          </div>
        </div>
      </div>
    </div>
  );
};
