"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

interface Item {
  title: string;
  text: string;
  href: string;
  soon?: boolean;
}

const MENUS: { label: string; items: Item[] }[] = [
  {
    label: "Notes",
    items: [
      { title: "First Year", text: "Common engineering subjects for semesters I and II.", href: "/first-year" },
      { title: "Second Year", text: "Core AI&DS and CS subjects for semesters III and IV.", href: "/second-year" },
      { title: "Previous Year Papers", text: "Subject, year and session wise papers.", href: "/pyq", soon: true },
    ],
  },
  {
    label: "Tools",
    items: [
      { title: "SGPA / CGPA Calculator", text: "Based on the SPPU credit system.", href: "/calculator" },
      { title: "Study Analytics", text: "Syllabus progress, stored on your device.", href: "/analytics" },
      { title: "Exam Countdown", text: "Days left and timetable links.", href: "/countdown" },
    ],
  },
];

export default function LandingNav() {
  const auth = useAuth();
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && (setOpen(null), setMobile(false));
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, []);

  const openSearch = () => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }));

  return (
    <header ref={ref} className="sticky top-0 z-40 bg-[var(--lp-bg)] border-b border-[var(--lp-line)]">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8 h-16 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5 text-[var(--lp-ink)]" aria-label="StudyBuddy home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.svg" alt="" width={32} height={32} className="w-8 h-8" />
          <span className="font-tight font-semibold text-lg tracking-tight">StudyBuddy</span>
        </Link>

        <nav aria-label="Main" className="hidden lg:flex items-center gap-1 text-[15px] text-[var(--lp-ink)]">
          {MENUS.map((m) => (
            <button
              key={m.label}
              type="button"
              aria-expanded={open === m.label}
              aria-haspopup="true"
              onClick={() => setOpen(open === m.label ? null : m.label)}
              className="h-10 px-3 inline-flex items-center gap-1 hover:bg-[var(--lp-panel)]"
            >
              {m.label} <ChevronDown size={15} aria-hidden className={open === m.label ? "rotate-180" : ""} />
            </button>
          ))}
          <Link href="/contribute" className="h-10 px-3 inline-flex items-center hover:bg-[var(--lp-panel)]">Contribute</Link>
          <Link href="/support" className="h-10 px-3 inline-flex items-center hover:bg-[var(--lp-panel)]">Support</Link>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openSearch}
            aria-label="Search subjects (Ctrl+K)"
            className="w-11 h-11 inline-flex items-center justify-center text-[var(--lp-ink)] hover:bg-[var(--lp-panel)]"
          >
            <Search size={18} aria-hidden />
          </button>
          {auth.enabled ? (
            <button
              type="button"
              onClick={() => auth.signIn()}
              className="hidden sm:inline-flex h-11 px-5 items-center bg-[var(--lp-accent)] text-black text-sm font-semibold hover:brightness-95"
            >
              Login / Sign up
            </button>
          ) : (
            <Link href="/first-year" className="hidden sm:inline-flex h-11 px-5 items-center bg-[var(--lp-accent)] text-black text-sm font-semibold hover:brightness-95">
              Browse notes
            </Link>
          )}
          <button
            type="button"
            className="lg:hidden w-11 h-11 inline-flex items-center justify-center text-[var(--lp-ink)] hover:bg-[var(--lp-panel)]"
            aria-label="Menu"
            aria-expanded={mobile}
            onClick={() => setMobile(!mobile)}
          >
            {mobile ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
          </button>
        </div>
      </div>

      {/* Mega menu (desktop) */}
      {MENUS.map(
        (m) =>
          open === m.label && (
            <div key={m.label} className="hidden lg:block absolute left-0 right-0 top-16 bg-[var(--lp-bg)] border-b border-[var(--lp-line)] shadow-[0_12px_24px_-12px_rgba(0,0,0,0.25)]">
              <ul className="max-w-[1240px] mx-auto px-8 py-8 grid grid-cols-3 gap-8">
                {m.items.map((it) => (
                  <li key={it.title}>
                    <Link href={it.href} onClick={() => setOpen(null)} className="block group">
                      <span className="block w-8 h-[3px] bg-[var(--lp-accent)] mb-4" />
                      <span className="block font-tight font-semibold text-[var(--lp-ink)] group-hover:underline">
                        {it.title}
                        {it.soon && <span className="ml-2 font-mono text-[10px] uppercase tracking-wider text-[var(--lp-muted)]">Soon</span>}
                      </span>
                      <span className="block mt-1 text-sm text-[var(--lp-muted)] leading-relaxed">{it.text}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )
      )}

      {/* Mobile menu */}
      {mobile && (
        <div className="lg:hidden border-t border-[var(--lp-line)] bg-[var(--lp-bg)] px-5 py-4 max-h-[75vh] overflow-y-auto">
          {MENUS.map((m) => (
            <div key={m.label} className="mb-4">
              <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--lp-muted)] mb-1">{m.label}</div>
              {m.items.map((it) => (
                <Link key={it.title} href={it.href} onClick={() => setMobile(false)} className="flex items-center min-h-[44px] text-[var(--lp-ink)] border-b border-[var(--lp-line)]">
                  {it.title}
                  {it.soon && <span className="ml-2 font-mono text-[10px] uppercase text-[var(--lp-muted)]">Soon</span>}
                </Link>
              ))}
            </div>
          ))}
          <Link href="/contribute" onClick={() => setMobile(false)} className="flex items-center min-h-[44px] text-[var(--lp-ink)] border-b border-[var(--lp-line)]">Contribute</Link>
          <Link href="/support" onClick={() => setMobile(false)} className="flex items-center min-h-[44px] text-[var(--lp-ink)] border-b border-[var(--lp-line)]">Support</Link>
          {auth.enabled && (
            <button type="button" onClick={() => auth.signIn()} className="mt-4 w-full h-12 bg-[var(--lp-accent)] text-black font-semibold">
              Login / Sign up
            </button>
          )}
        </div>
      )}
    </header>
  );
}
