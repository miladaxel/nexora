import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastMessage } from '@/types';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => {
      const id = 'toast_' + Math.random().toString(36).substr(2, 9);
      const newToast: ToastMessage = {
        id,
        type,
        title,
        message,
        timestamp: Date.now(),
      };

      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      {/* Toast container in bottom-left for RTL (standard position) or top-left */}
      <div
        aria-live="polite"
        className="fixed bottom-4 left-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((toast) => {
          const icons = {
            success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />,
            error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />,
            warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />,
            info: <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />,
          };

          return (
            <div
              key={toast.id}
              className={cn(
                'pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg backdrop-blur-md transition-all animate-fade-in text-right',
                toast.type === 'success' && 'bg-card/95 border-emerald-500/30 text-card-foreground',
                toast.type === 'error' && 'bg-card/95 border-rose-500/30 text-card-foreground',
                toast.type === 'warning' && 'bg-card/95 border-amber-500/30 text-card-foreground',
                toast.type === 'info' && 'bg-card/95 border-indigo-500/30 text-card-foreground'
              )}
            >
              {icons[toast.type]}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{toast.title}</p>
                {toast.message && (
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {toast.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-muted-foreground hover:text-foreground p-1 transition-colors rounded-lg hover:bg-muted"
                aria-label="بستن اعلان"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
