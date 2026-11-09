"use client";

import { useEffect } from "react";
import { reportError } from "@/lib/error-monitoring";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    reportError(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0, padding: "4rem 1.5rem", background: "#fff", color: "#0e0e0e" }}>
        <h1 style={{ fontSize: "2rem", margin: 0 }}>Something went wrong</h1>
        <p style={{ color: "#5c5c57", maxWidth: "28rem" }}>The site failed to load. We have been notified.</p>
        <button type="button" onClick={reset} style={{ height: 44, padding: "0 20px", background: "#e8832a", border: 0, fontWeight: 600, cursor: "pointer" }}>
          Try again
        </button>
      </body>
    </html>
  );
}
