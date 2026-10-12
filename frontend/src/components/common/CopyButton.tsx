import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
  variant?: 'outline' | 'ghost' | 'solid';
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  label = 'Copy',
  className = '',
  variant = 'outline',
}) => {
  const [copied, setCopied] = useState(false);
  const { showToast } = useApp();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      showToast('Copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Failed to copy', 'error');
    }
  };

  const baseStyle =
    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors border select-none';
  const variantStyles = {
    outline: 'border-[#30363d] bg-[#161b22] hover:bg-[#21262d] text-slate-200',
    ghost: 'border-transparent hover:bg-[#21262d] text-slate-300',
    solid: 'border-emerald-600/50 bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30',
  };

  return (
    <button
      onClick={handleCopy}
      className={`${baseStyle} ${variantStyles[variant]} ${className}`}
      title="Copy to clipboard"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-400">Copied</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 text-slate-400" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
