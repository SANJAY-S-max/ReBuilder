import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold animate-slide-up flex items-center gap-2.5 min-w-[260px] border cursor-pointer select-none transition-transform hover:scale-[1.02] ${
              t.type === 'success'
                ? 'bg-emerald-600/95 text-white border-emerald-500/50 shadow-emerald-950/40'
                : t.type === 'error'
                ? 'bg-red-600/95 text-white border-red-500/50 shadow-red-950/40'
                : t.type === 'warning'
                ? 'bg-amber-600/95 text-white border-amber-500/50 shadow-amber-950/40'
                : 'bg-slate-900/95 text-white border-slate-700/80 shadow-black/50'
            }`}
            onClick={() => dismiss(t.id)}
          >
            {t.type === 'success' && <CheckCircle2 size={16} className="text-emerald-200 flex-shrink-0" />}
            {t.type === 'error' && <AlertCircle size={16} className="text-red-200 flex-shrink-0" />}
            {t.type === 'warning' && <AlertTriangle size={16} className="text-amber-200 flex-shrink-0" />}
            {t.type === 'info' && <Info size={16} className="text-blue-200 flex-shrink-0" />}
            <span className="flex-1">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
