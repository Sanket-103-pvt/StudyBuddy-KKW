"use client";

import React from "react";
import { Search } from "lucide-react";

// Looks like a search field, opens the global Ctrl+K palette (which has the subject search).
export default function LandingSearch() {
  const open = () => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }));
  return (
    <button
      type="button"
      onClick={open}
      aria-label="Search subjects"
      className="w-full flex items-center justify-between h-14 px-4 border border-[var(--lp-ink)] bg-[var(--lp-bg)] text-left text-[var(--lp-muted)] hover:bg-[var(--lp-panel)]"
    >
      <span className="flex items-center gap-3">
        <Search size={18} aria-hidden className="text-[var(--lp-ink)]" />
        Search a subject, e.g. DBMS
      </span>
      <kbd className="hidden sm:inline font-mono text-[11px] border border-[var(--lp-line)] px-2 py-1">CTRL K</kbd>
    </button>
  );
}
