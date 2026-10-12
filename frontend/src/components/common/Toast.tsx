import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
          error: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
          info: <Info className="w-4 h-4 text-cyan-400 shrink-0" />,
        };

        const borderStyles = {
          success: 'border-emerald-500/30 bg-[#0d1f14]',
          error: 'border-rose-500/30 bg-[#221013]',
          info: 'border-cyan-500/30 bg-[#0b1b2b]',
        };

        return (
          <div
            key={toast.id}
            className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg border shadow-xl backdrop-blur-md text-sm text-slate-200 transition-all animate-fade-in ${borderStyles[toast.type]}`}
          >
            <div className="flex items-center gap-2.5">
              {icons[toast.type]}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-200 p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
