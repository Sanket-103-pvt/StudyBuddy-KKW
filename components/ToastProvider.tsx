"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toast: {
    show: (message: string, type?: ToastType, duration?: number) => void;
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
    warning: (message: string, duration?: number) => void;
  };
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (message: string, type: ToastType = "info", duration: number = 3000) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newToast: ToastItem = { id, type, message, duration };

      setToasts((prev) => [...prev.slice(-4), newToast]); // Limit to max 5 visible toasts

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback((msg: string, dur?: number) => show(msg, "success", dur), [show]);
  const error = useCallback((msg: string, dur?: number) => show(msg, "error", dur), [show]);
  const info = useCallback((msg: string, dur?: number) => show(msg, "info", dur), [show]);
  const warning = useCallback((msg: string, dur?: number) => show(msg, "warning", dur), [show]);

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case "success":
        return <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />;
      case "error":
        return <AlertCircle size={18} className="text-red-600 dark:text-red-400 shrink-0" />;
      case "warning":
        return <AlertTriangle size={18} className="text-amber-600 dark:text-amber-400 shrink-0" />;
      default:
        return <Info size={18} className="text-blue-600 dark:text-blue-400 shrink-0" />;
    }
  };

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case "success":
        return "bg-emerald-50 dark:bg-emerald-950/90 text-emerald-900 dark:text-emerald-100 border-emerald-200 dark:border-emerald-800/80 shadow-emerald-500/10";
      case "error":
        return "bg-red-50 dark:bg-red-950/90 text-red-900 dark:text-red-100 border-red-200 dark:border-red-800/80 shadow-red-500/10";
      case "warning":
        return "bg-amber-50 dark:bg-amber-950/90 text-amber-900 dark:text-amber-100 border-amber-200 dark:border-amber-800/80 shadow-amber-500/10";
      default:
        return "bg-surface-container-lowest dark:bg-bg-dark text-on-surface dark:text-text-primary-dark border-border-light dark:border-border-dark shadow-sm";
    }
  };

  return (
    <ToastContext.Provider value={{ toast: { show, success, error, info, warning }, removeToast }}>
      {children}
      
      {/* Floating Toast Notification Container */}
      <div 
        aria-live="polite" 
        aria-atomic="true"
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-[100] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 md:px-0"
      >
        <AnimatePresence mode="sync">
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl border shadow-lg backdrop-blur-md transition-all ${getToastStyles(
                t.type
              )}`}
            >
              <div className="flex items-center gap-3 pr-2 min-w-0">
                {getToastIcon(t.type)}
                <span className="font-inter text-body-sm font-medium leading-snug truncate">
                  {t.message}
                </span>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 opacity-70 hover:opacity-100 transition-opacity shrink-0 ml-2"
                aria-label="Dismiss toast"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context.toast;
}
