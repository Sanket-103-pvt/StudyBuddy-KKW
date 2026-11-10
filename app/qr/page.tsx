"use client";

// Landing address for the printed poster QR code. Opening it counts as one page view of /qr in
// Vercel Analytics, which is how poster scans are counted, then it sends the visitor to the home page.
// Keep this route: printed posters point here.

import { useEffect } from "react";
import Link from "next/link";

export default function QrRedirect() {
  useEffect(() => {
    const t = setTimeout(() => window.location.replace("/"), 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16 bg-[var(--lp-bg)] text-[var(--lp-ink)]">
      <div className="text-center">
        <p className="font-tight font-semibold text-2xl">Opening StudyBuddy…</p>
        <p className="mt-3 text-sm text-[var(--lp-muted)]">
          Not opening? <Link href="/" className="underline underline-offset-2">Go to the home page</Link>.
        </p>
      </div>
    </main>
  );
}
