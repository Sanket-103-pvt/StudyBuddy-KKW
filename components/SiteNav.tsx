"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { ChevronDown, LogOut, Menu, Moon, Search, Shield, Sun, X } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import OfflineBadge from "@/components/OfflineBadge";

interface Item {
  title: string;
  text: string;
  href: string;
  soon?: boolean;
  external?: boolean;
}

const MENUS: { label: string; items: Item[] }[] = [
  {
    label: "Notes",
    items: [
      { title: "First Year", text: "Common engineering subjects for semesters I and II.", href: "/first-year" },
      { title: "Second Year", text: "Core AI&DS and CS subjects for semesters III and IV.", href: "/second-year" },
      { title: "Third Year (AI&DS only)", text: "AI&DS core and elective subjects for semesters V and VI.", href: "/third-year" },
      { title: "Fourth Year (AI&DS only)", text: "AI&DS subjects for semesters VII and VIII.", href: "/fourth-year" },
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
  {
    label: "More",
    items: [
      { title: "About", text: "Why Study Buddy exists and who runs it.", href: "/about" },
      { title: "Contact", text: "Write to us or report a problem.", href: "/contact" },
      { title: "GitHub", text: "The project is open source.", href: "https://github.com/Sanket-103-pvt/StudyBuddy-KKW", external: true },
    ],
  },
];

const linkBase = "relative h-16 px-3 inline-flex items-center text-[15px] text-[var(--lp-ink)] after:absolute after:left-3 after:right-3 after:bottom-0 after:h-[3px] after:bg-[var(--lp-accent)] after:origin-left after:transition-transform after:duration-200";
const idle = "after:scale-x-0 hover:after:scale-x-100 hover:bg-[var(--lp-panel)]";
const current = "after:scale-x-100 font-semibold";

export default function SiteNav() {
  const auth = useAuth();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [user, setUser] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => setMounted(true), []);

  // Close menus when the page changes.
  useEffect(() => {
    setOpen(null);
    setMobile(false);
    setUser(false);
  }, [pathname]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(null);
        setUser(false);
      }
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setUser(false);
        setMobile(false);
      }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, []);

  const openSearch = () => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }));
  const hoverOpen = (label: string) => {
    clearTimeout(closeTimer.current);
    setUser(false);
    setOpen(label);
  };
  const hoverClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 120);
  };
  const isCurrent = (items: Item[]) => items.some((i) => !i.external && (pathname === i.href || pathname.startsWith(`${i.href}/`)));
  const dark = mounted && theme === "dark";
  const firstName = auth.displayName?.split(" ")[0] ?? "Account";

  return (
    <header ref={ref} className="print:hidden relative z-40 shrink-0 bg-[var(--lp-bg)] border-b border-[var(--lp-line)]" onMouseLeave={hoverClose}>
      <div className="max-w-[1240px] mx-auto px-5 md:px-8 h-16 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5 text-[var(--lp-ink)]" aria-label="StudyBuddy home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.svg" alt="" width={32} height={32} className="w-8 h-8" />
          <span className="font-tight font-semibold text-lg tracking-tight">StudyBuddy</span>
        </Link>

        <nav aria-label="Main" className="hidden lg:flex items-center">
          {MENUS.map((m) => (
            <button
              key={m.label}
              type="button"
              aria-expanded={open === m.label}
              aria-haspopup="true"
              onMouseEnter={() => hoverOpen(m.label)}
              onFocus={() => hoverOpen(m.label)}
              onClick={() => setOpen(open === m.label ? null : m.label)}
              className={`${linkBase} gap-1 ${open === m.label || isCurrent(m.items) ? `${current} bg-[var(--lp-panel)]` : idle}`}
            >
              {m.label} <ChevronDown size={15} aria-hidden className={`transition-transform duration-200 ${open === m.label ? "rotate-180" : ""}`} />
            </button>
          ))}
          <Link href="/contribute" onMouseEnter={() => setOpen(null)} aria-current={pathname === "/contribute" ? "page" : undefined} className={`${linkBase} ${pathname === "/contribute" ? current : idle}`}>Contribute</Link>
          <Link href="/support" onMouseEnter={() => setOpen(null)} aria-current={pathname === "/support" ? "page" : undefined} className={`${linkBase} ${pathname === "/support" ? current : idle}`}>Support</Link>
        </nav>

        <div className="flex items-center gap-1">
          <OfflineBadge />
          <button type="button" onClick={openSearch} aria-label="Search subjects (Ctrl+K)" className="w-11 h-11 inline-flex items-center justify-center text-[var(--lp-ink)] hover:bg-[var(--lp-panel)]">
            <Search size={18} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => setTheme(dark ? "light" : "dark")}
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            className="w-11 h-11 inline-flex items-center justify-center text-[var(--lp-ink)] hover:bg-[var(--lp-panel)]"
          >
            {dark ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
          </button>

          {auth.enabled && auth.signedIn ? (
            <div className="relative hidden sm:block">
              <button
                type="button"
                aria-expanded={user}
                aria-haspopup="true"
                onClick={() => {
                  setOpen(null);
                  setUser(!user);
                }}
                className="h-11 px-4 inline-flex items-center gap-2 border border-[var(--lp-ink)] text-[var(--lp-ink)] text-sm font-semibold hover:bg-[var(--lp-panel)]"
              >
                {firstName} <ChevronDown size={14} aria-hidden />
              </button>
              {user && (
                <div className="lp-drop absolute right-0 top-[calc(100%+4px)] w-52 bg-[var(--lp-bg)] border border-[var(--lp-line)] shadow-[0_12px_24px_-12px_rgba(0,0,0,0.3)]">
                  {auth.isAdmin && (
                    <Link href="/admin" className="flex items-center gap-2 min-h-[44px] px-4 text-sm text-[var(--lp-ink)] hover:bg-[var(--lp-panel)]">
                      <Shield size={15} aria-hidden /> Admin
                    </Link>
                  )}
                  <button type="button" onClick={() => auth.signOut()} className="w-full flex items-center gap-2 min-h-[44px] px-4 text-sm text-left text-[var(--lp-ink)] hover:bg-[var(--lp-panel)]">
                    <LogOut size={15} aria-hidden /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : auth.enabled ? (
            <button type="button" onClick={() => auth.signIn()} className="hidden sm:inline-flex h-11 px-5 items-center bg-[var(--lp-accent)] text-black text-sm font-semibold hover:brightness-95">
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

      {/* Mega menu (desktop). Opens on hover, focus or click. */}
      {MENUS.map(
        (m) =>
          open === m.label && (
            <div
              key={m.label}
              onMouseEnter={() => hoverOpen(m.label)}
              className="lp-drop hidden lg:block absolute left-0 right-0 top-full bg-[var(--lp-bg)] border-b border-[var(--lp-line)] shadow-[0_12px_24px_-12px_rgba(0,0,0,0.25)]"
            >
              <ul className="max-w-[1240px] mx-auto px-8 py-8 grid grid-cols-3 gap-8">
                {m.items.map((it) => (
                  <li key={it.title}>
                    <Link
                      href={it.href}
                      {...(it.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      onClick={() => setOpen(null)}
                      className="block group"
                    >
                      <span className="block w-8 group-hover:w-14 transition-all duration-200 h-[3px] bg-[var(--lp-accent)] mb-4" />
                      <span className="block font-tight font-semibold text-[var(--lp-ink)] group-hover:underline underline-offset-4">
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
        <div className="lg:hidden absolute left-0 right-0 top-full border-t border-b border-[var(--lp-line)] bg-[var(--lp-bg)] px-5 py-4 max-h-[75vh] overflow-y-auto shadow-lg">
          {MENUS.map((m) => (
            <div key={m.label} className="mb-4">
              <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--lp-muted)] mb-1">{m.label}</div>
              {m.items.map((it) => (
                <Link
                  key={it.title}
                  href={it.href}
                  {...(it.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex items-center min-h-[44px] text-[var(--lp-ink)] border-b border-[var(--lp-line)]"
                >
                  {it.title}
                  {it.soon && <span className="ml-2 font-mono text-[10px] uppercase text-[var(--lp-muted)]">Soon</span>}
                </Link>
              ))}
            </div>
          ))}
          <Link href="/contribute" className="flex items-center min-h-[44px] text-[var(--lp-ink)] border-b border-[var(--lp-line)]">Contribute</Link>
          <Link href="/support" className="flex items-center min-h-[44px] text-[var(--lp-ink)] border-b border-[var(--lp-line)]">Support</Link>
          {auth.enabled && auth.signedIn && auth.isAdmin && (
            <Link href="/admin" className="flex items-center min-h-[44px] text-[var(--lp-ink)] border-b border-[var(--lp-line)]">Admin</Link>
          )}
          {auth.enabled &&
            (auth.signedIn ? (
              <button type="button" onClick={() => auth.signOut()} className="mt-4 w-full h-12 border border-[var(--lp-ink)] text-[var(--lp-ink)] font-semibold">
                Sign out ({firstName})
              </button>
            ) : (
              <button type="button" onClick={() => auth.signIn()} className="mt-4 w-full h-12 bg-[var(--lp-accent)] text-black font-semibold">
                Login / Sign up
              </button>
            ))}
        </div>
      )}
    </header>
  );
}
