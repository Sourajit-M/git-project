import React from 'react';

interface MarkdownPreviewProps {
  content: string;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content }) => {
  if (!content) {
    return <div className="text-slate-500 italic p-4 text-sm">No output generated yet.</div>;
  }

  const renderFormattedLine = (line: string, index: number) => {
    // Heading 1
    if (line.startsWith('# ')) {
      return (
        <h1 key={index} className="text-xl font-bold text-slate-100 border-b border-[#30363d] pb-2 mt-4 mb-2">
          {line.replace('# ', '')}
        </h1>
      );
    }
    // Heading 2
    if (line.startsWith('## ')) {
      return (
        <h2 key={index} className="text-lg font-semibold text-cyan-300 border-b border-[#30363d]/60 pb-1.5 mt-4 mb-2">
          {line.replace('## ', '')}
        </h2>
      );
    }
    // Heading 3
    if (line.startsWith('### ')) {
      return (
        <h3 key={index} className="text-base font-semibold text-slate-200 mt-3 mb-1.5">
          {line.replace('### ', '')}
        </h3>
      );
    }
    // Horizontal Rule
    if (line.trim() === '---') {
      return <hr key={index} className="border-[#30363d] my-4" />;
    }
    // Checklist
    if (line.trim().startsWith('- [ ] ') || line.trim().startsWith('- [x] ')) {
      const isChecked = line.trim().startsWith('- [x] ');
      const text = line.trim().replace(/- \[[ x]\] /, '');
      return (
        <div key={index} className="flex items-center gap-2 text-sm text-slate-300 my-1">
          <input
            type="checkbox"
            checked={isChecked}
            readOnly
            className="rounded border-[#30363d] text-cyan-500 bg-[#161b22] focus:ring-0 cursor-default"
          />
          <span>{text}</span>
        </div>
      );
    }
    // Bullet item
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      const text = line.trim().substring(2);
      return (
        <li key={index} className="text-sm text-slate-300 ml-4 list-disc my-1">
          {parseInlineFormatting(text)}
        </li>
      );
    }
    // Italic note
    if (line.startsWith('*') && line.endsWith('*')) {
      return (
        <p key={index} className="text-xs text-slate-400 italic my-2">
          {line.slice(1, -1)}
        </p>
      );
    }
    // Normal paragraph
    if (line.trim() === '') {
      return <div key={index} className="h-2" />;
    }
    return (
      <p key={index} className="text-sm text-slate-300 my-1 leading-relaxed">
        {parseInlineFormatting(line)}
      </p>
    );
  };

  const parseInlineFormatting = (text: string) => {
    // Handle inline code `code`
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded bg-[#161b22] border border-[#30363d] font-mono text-cyan-300 text-xs">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-slate-100">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-1 p-4 bg-[#0d1117] rounded-lg border border-[#30363d] overflow-y-auto max-h-[460px] text-slate-200">
      {content.split('\n').map((line, idx) => renderFormattedLine(line, idx))}
    </div>
  );
};
