"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";

import { cn } from "@/lib/cn";
import { springSoft } from "@/lib/motion";

type ToastTone = "success" | "warn" | "danger" | "info";

export interface Toast {
  id: string;
  tone: ToastTone;
  title: string;
  message?: string;
}

interface ToastContextValue {
  push: (toast: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TONE_STYLES: Record<ToastTone, { ring: string; icon: ReactNode }> = {
  success: {
    ring: "ring-success-100",
    icon: <CheckCircle2 className="size-4.5 text-success-600" aria-hidden />,
  },
  warn: {
    ring: "ring-warn-100",
    icon: <AlertTriangle className="size-4.5 text-warn-600" aria-hidden />,
  },
  danger: {
    ring: "ring-danger-100",
    icon: <AlertTriangle className="size-4.5 text-danger-600" aria-hidden />,
  },
  info: {
    ring: "ring-brand-100",
    icon: <Info className="size-4.5 text-brand-600" aria-hidden />,
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (toast: Omit<Toast, "id">) => {
      counter.current += 1;
      const id = `toast-${counter.current}`;
      setToasts((current) => [...current.slice(-2), { ...toast, id }]);
      setTimeout(() => dismiss(id), 6500);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ push, dismiss }), [push, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* The container is always mounted and carries the live region, so
          screen readers announce toasts that are inserted later. */}
      <div
        role="region"
        aria-label="Notifications"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 top-0 z-100 flex overflow-x-clip sm:overflow-x-visible flex-col items-center gap-2 p-3 pt-[calc(0.75rem+env(safe-area-inset-top))] sm:inset-x-auto sm:top-auto sm:right-6 sm:bottom-6 sm:items-end sm:p-0"
      >
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={springSoft}
              role="status"
              className={cn(
                "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-line bg-surface p-3.5 shadow-lift ring-1 ring-inset",
                TONE_STYLES[toast.tone].ring,
              )}
            >
              <span className="mt-0.5">{TONE_STYLES[toast.tone].icon}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink-900">{toast.title}</p>
                {toast.message ? (
                  <p className="mt-0.5 text-[0.8125rem] leading-relaxed text-ink-500">
                    {toast.message}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss notification"
                className="-m-2 flex size-10 shrink-0 items-center justify-center rounded-md text-ink-400 sm:m-0 sm:size-auto sm:p-1 transition-colors hover:bg-surface-2 hover:text-ink-700"
              >
                <X className="size-4" aria-hidden />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside a ToastProvider.");
  }
  return context;
}
