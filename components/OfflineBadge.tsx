"use client";

import React, { useState, useEffect } from "react";
import { WifiOff } from "lucide-react";

export default function OfflineBadge() {
  const [isOffline, setIsOffline] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      setIsOffline(!navigator.onLine);

      const handleOffline = () => setIsOffline(true);
      const handleOnline = () => setIsOffline(false);

      window.addEventListener("offline", handleOffline);
      window.addEventListener("online", handleOnline);

      return () => {
        window.removeEventListener("offline", handleOffline);
        window.removeEventListener("online", handleOnline);
      };
    }
  }, []);

  if (!mounted || !isOffline) {
    return null;
  }

  return (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60 shadow-xs animate-pulse"
      title="You are currently offline. Notes and cached pages are available from local storage."
      role="status"
      aria-label="Offline Mode Active"
    >
      <WifiOff size={12} className="shrink-0" />
      <span>Offline Mode</span>
    </div>
  );
}
