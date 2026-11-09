"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, UserCheck } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { ALLOWED_EMAIL_DOMAIN } from "@/lib/auth-config";

const mark = "bg-[var(--lp-accent)] text-black px-1.5 [box-decoration-break:clone] [-webkit-box-decoration-break:clone]";

export default function LoginView() {
  const auth = useAuth();
  const [next, setNext] = useState("/");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const n = new URLSearchParams(window.location.search).get("next") || "/";
    setNext(n.startsWith("/") && !n.startsWith("//") && !n.startsWith("/login") ? n : "/");
  }, []);

  // Already signed in: go straight back.
  useEffect(() => {
    if (auth.signedIn) window.location.replace(next);
  }, [auth.signedIn, next]);

  const go = async () => {
    setBusy(true);
    await auth.signInWithGoogle(next);
    setTimeout(() => setBusy(false), 4000);
  };

  return (
    <main className="min-h-full flex items-center justify-center px-4 py-10 bg-[var(--lp-bg)] text-[var(--lp-ink)]">
      <div className="w-full max-w-[1000px] grid md:grid-cols-[1.15fr_1fr] border border-[var(--lp-ink)]">
        <section className="p-7 md:p-10 flex flex-col min-h-[420px] md:min-h-[560px] bg-[var(--lp-panel)] md:border-r border-[var(--lp-ink)] border-b md:border-b-0">
          <Link href="/" className="flex items-center gap-3 w-fit" aria-label="Study Buddy KKW home">
            <Image src="/icon.svg" alt="" width={40} height={40} />
            <span className="font-tight font-semibold text-xl">Study Buddy <span className={mark}>KKW</span></span>
          </Link>

          <div className="mt-auto pt-12">
            <span className="inline-block border border-[var(--lp-ink)] px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em]">
              Free for KKWIEER students
            </span>
            <h1 className="mt-5 font-tight font-semibold text-4xl md:text-5xl leading-[1.15] tracking-tight">
              Every problem,
              <br />
              <span className={mark}>one solution.</span>
            </h1>
            <p className="mt-5 max-w-md text-[var(--lp-muted)] leading-relaxed">
              Notes, unit-wise resources and a SGPA calculator for your semester, in one place. Log in to contribute notes and report broken links.
            </p>
          </div>

          <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--lp-muted)]">
            Built by students ·{" "}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-[var(--lp-ink)]">Privacy</Link> ·{" "}
            <Link href="/terms" className="underline underline-offset-2 hover:text-[var(--lp-ink)]">Terms</Link>
          </p>
        </section>

        <section className="p-7 md:p-10 flex flex-col justify-center bg-[var(--lp-bg)]">
          <h2 className="font-tight font-semibold text-3xl">Login / Sign up</h2>
          <p className="mt-2 text-[var(--lp-muted)]">Continue with your Google account.</p>

          <p className="mt-6 text-sm font-semibold">
            <span className={mark}>Use only your KKWagh college email ID (@{ALLOWED_EMAIL_DOMAIN}).</span>
          </p>

          {auth.enabled ? (
            <button
              type="button"
              onClick={go}
              disabled={busy || auth.signedIn}
              className="mt-6 h-12 w-full flex items-center justify-center gap-3 border border-[var(--lp-ink)] bg-[var(--lp-bg)] font-semibold hover:bg-[var(--lp-panel)] disabled:opacity-60"
            >
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
                <path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 0 1 0-9.4l-7.9-6.1a24 24 0 0 0 0 21.6l7.9-6.1z" />
                <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
              </svg>
              {busy ? "Opening Google…" : "Continue with Google"}
            </button>
          ) : (
            <p className="mt-6 border border-[var(--lp-line)] p-3 text-sm text-[var(--lp-muted)]">Login is not configured on this deployment.</p>
          )}

          <ul className="mt-8 space-y-3 text-sm text-[var(--lp-muted)]">
            <li className="flex gap-3"><ShieldCheck size={18} className="shrink-0 mt-0.5" aria-hidden="true" />Only verified Google accounts can sign in. There are no passwords.</li>
            <li className="flex gap-3"><UserCheck size={18} className="shrink-0 mt-0.5" aria-hidden="true" />Browsing notes never needs a login. It is only for contributing and reporting.</li>
          </ul>

          <Link href="/first-year" className="mt-8 text-sm underline underline-offset-4 w-fit hover:text-[var(--lp-accent)]">
            Just browse notes instead
          </Link>
        </section>
      </div>
    </main>
  );
}
