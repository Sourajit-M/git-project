import React, { useState } from 'react';
import { FileCode, Plus, Minus, Code, Eye, Edit3 } from 'lucide-react';
import { CopyButton } from './CopyButton';

interface DiffViewerProps {
  diff: string;
  onDiffChange?: (newDiff: string) => void;
  isEditable?: boolean;
  maxHeight?: string;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({
  diff,
  onDiffChange,
  isEditable = true,
  maxHeight = 'max-h-[440px]',
}) => {
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted');

  // Count additions and deletions
  const lines = diff.split('\n');
  const additions = lines.filter((l) => l.startsWith('+') && !l.startsWith('+++')).length;
  const deletions = lines.filter((l) => l.startsWith('-') && !l.startsWith('---')).length;

  return (
    <div className="border border-[#30363d] rounded-lg bg-[#0d1117] overflow-hidden flex flex-col shadow-inner">
      {/* Header bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#161b22] border-b border-[#30363d] text-xs">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-cyan-400" />
          <span className="font-mono text-slate-300 font-medium">Git Diff Preview</span>
          {diff && (
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-[#30363d]">
              <span className="flex items-center text-emerald-400 font-mono">
                <Plus className="w-3 h-3 mr-0.5" />
                {additions}
              </span>
              <span className="flex items-center text-rose-400 font-mono">
                <Minus className="w-3 h-3 mr-0.5" />
                {deletions}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#0d1117] border border-[#30363d] rounded-md p-0.5">
            <button
              onClick={() => setViewMode('formatted')}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                viewMode === 'formatted'
                  ? 'bg-[#21262d] text-slate-100 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Visual</span>
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                viewMode === 'raw'
                  ? 'bg-[#21262d] text-slate-100 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isEditable ? <Edit3 className="w-3 h-3" /> : <Code className="w-3 h-3" />}
              <span>{isEditable ? 'Edit Diff' : 'Raw'}</span>
            </button>
          </div>
          <CopyButton text={diff} label="Copy Diff" />
        </div>
      </div>

      {/* Content area */}
      {viewMode === 'formatted' ? (
        <div
          className={`overflow-auto font-mono text-xs leading-relaxed select-text ${maxHeight} divide-y divide-[#21262d]/40`}
        >
          {lines.length === 0 || !diff.trim() ? (
            <div className="p-8 text-center text-slate-500">
              No diff content loaded. Paste or select a branch diff above.
            </div>
          ) : (
            lines.map((line, idx) => {
              const isHunk = line.startsWith('@@');
              const isAdd = line.startsWith('+') && !line.startsWith('+++');
              const isDel = line.startsWith('-') && !line.startsWith('---');
              const isFileHeader = line.startsWith('diff --git') || line.startsWith('index ') || line.startsWith('---') || line.startsWith('+++');

              let lineClass = 'text-slate-400 bg-transparent';
              if (isAdd) lineClass = 'diff-line-add';
              else if (isDel) lineClass = 'diff-line-del';
              else if (isHunk) lineClass = 'diff-line-hunk';
              else if (isFileHeader) lineClass = 'bg-[#161b22]/70 text-cyan-300 font-semibold';

              return (
                <div key={idx} className={`flex items-stretch px-3 py-0.5 hover:bg-white/[0.03] ${lineClass}`}>
                  <span className="w-10 select-none text-right pr-3 text-slate-600 border-r border-[#30363d]/40">
                    {idx + 1}
                  </span>
                  <span className="w-5 select-none text-center font-bold">
                    {isAdd ? '+' : isDel ? '-' : isHunk ? ' ' : ' '}
                  </span>
                  <span className="pl-2 whitespace-pre break-all flex-1">
                    {isAdd || isDel ? line.substring(1) : line}
                  </span>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="relative">
          <textarea
            value={diff}
            onChange={(e) => onDiffChange && onDiffChange(e.target.value)}
            disabled={!isEditable}
            rows={14}
            placeholder="Paste your Git diff here (git diff or git diff --staged)..."
            className="w-full bg-[#0d1117] text-slate-200 font-mono text-xs p-3.5 outline-none resize-y border-0 focus:ring-1 focus:ring-cyan-500/50"
            spellCheck={false}
          />
        </div>
      )}
    </div>
  );
};
