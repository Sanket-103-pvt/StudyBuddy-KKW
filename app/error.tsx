"use client";

import { useEffect } from "react";
import Link from "next/link";
import { reportError } from "@/lib/error-monitoring";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    reportError(error);
  }, [error]);

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16 bg-[var(--lp-bg)] text-[var(--lp-ink)]">
      <div className="max-w-md">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--lp-muted)]">Error</p>
        <h1 className="mt-3 font-tight font-semibold text-4xl tracking-tight">Something went wrong</h1>
        <p className="mt-4 text-[var(--lp-muted)] leading-relaxed">
          This page failed to load. We have been notified. You can try again, or go back to the home page.
        </p>
        <div className="mt-8 flex gap-3">
          <button type="button" onClick={reset} className="h-11 px-5 bg-[var(--lp-accent)] text-black font-semibold hover:brightness-95">
            Try again
          </button>
          <Link href="/" className="h-11 px-5 inline-flex items-center border border-[var(--lp-ink)] font-semibold hover:bg-[var(--lp-panel)]">
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
