import React from 'react';
import { useApp } from '../context/AppContext';

export const ToastContainer = () => {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none font-sans">
      {toasts.map(toast => {
        let bg = 'bg-slate-900 text-white border-slate-700';
        let icon = 'info';
        
        if (toast.type === 'success') {
          bg = 'bg-emerald-950/90 text-emerald-100 border-emerald-500/40';
          icon = 'check_circle';
        } else if (toast.type === 'danger' || toast.type === 'error') {
          bg = 'bg-rose-950/90 text-rose-100 border-rose-500/40';
          icon = 'emergency';
        } else if (toast.type === 'warning') {
          bg = 'bg-amber-950/90 text-amber-100 border-amber-500/40';
          icon = 'warning';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-premium border shadow-2xl backdrop-blur-md flex items-start justify-between text-xs animate-slide-up transition-all ${bg}`}
          >
            <div className="flex items-start space-x-2.5">
              <span className="material-symbols-outlined text-lg shrink-0 mt-0.5">{icon}</span>
              <div>
                <h4 className="font-bold font-headline">{toast.title}</h4>
                <p className="text-[11px] opacity-90 mt-0.5 leading-snug">{toast.message}</p>
              </div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white ml-2 text-sm font-bold shrink-0"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
};
