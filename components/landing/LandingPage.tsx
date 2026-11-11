import React from "react";
import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Flag } from "lucide-react";
import CountUp from "@/components/landing/CountUp";
import LandingSearch from "@/components/landing/LandingSearch";
import PinnedResources from "@/components/PinnedResources";
import RecentlyViewed from "@/components/RecentlyViewed";
import indexData from "@/content/index.json";

interface Subject {
  id: string;
  name: string;
  unitCount: number;
}

interface SubjectFile {
  units?: { title: string; resources?: { label: string; url: string }[] }[];
}

const YEAR_TITLES: Record<string, string> = { "first-year": "First Year", "second-year": "Second Year", "third-year": "Third Year (AI&DS only)", "fourth-year": "Fourth Year (AI&DS only)" };
const years = Object.keys(indexData).filter((y) => y in YEAR_TITLES);

function readSubject(year: string, id: string): SubjectFile | null {
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), "content", year, `${id}.json`), "utf8"));
  } catch {
    return null;
  }
}

function resourceCount(year: string, id: string): number {
  const file = readSubject(year, id);
  return (file?.units ?? []).reduce((n, u) => n + (u.resources ?? []).filter((r) => r.url && r.url !== "#").length, 0);
}

const eyebrow = "font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--lp-muted)]";
const wrap = "max-w-[1240px] mx-auto px-5 md:px-8";
const btnPrimary = "inline-flex items-center justify-center gap-2 h-12 px-6 bg-[var(--lp-accent)] text-black text-[15px] font-semibold hover:brightness-95";
const btnGhost = "inline-flex items-center justify-center gap-2 h-12 px-6 border border-[var(--lp-ink)] text-[var(--lp-ink)] text-[15px] font-semibold hover:bg-[var(--lp-panel)]";

export default function LandingPage() {
  const all = years.flatMap((y) => ((indexData as Record<string, Subject[]>)[y] ?? []).map((s) => ({ ...s, year: y })));
  const subjectCount = all.length;
  const unitCount = all.reduce((n, s) => n + s.unitCount, 0);
  const linkCount = all.reduce((n, s) => n + resourceCount(s.year, s.id), 0);
  const featured = all.filter((s) => s.year === "second-year" && s.unitCount > 0).slice(0, 6);

  // Shown rounded down with a "+", so the page never claims more than the content files hold.
  const floorTo = (n: number, step: number) => Math.floor(n / step) * step;
  const stats: [number, string, string][] = [
    [floorTo(subjectCount, 5), "Subjects", "+"],
    [floorTo(unitCount, 5), "Units", "+"],
    [floorTo(linkCount, 5), "Notes and resource links", "+"],
  ];

  const features = [
    {
      title: "Every subject in one library",
      text: "Year, subject and unit. No more hunting through WhatsApp groups.",
      art: (
        <div className="space-y-2">
          {["Unit 1", "Unit 2", "Unit 3"].map((u, i) => (
            <div key={u} className="flex items-center justify-between bg-[var(--lp-bg)] border border-[var(--lp-line)] px-3 h-9 text-sm text-[var(--lp-ink)]">
              <span>{u}</span>
              <span className="font-mono text-[10px] text-[var(--lp-muted)]">{3 - i} FILES</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Find a subject in seconds",
      text: "Press Ctrl+K anywhere and jump straight to the subject.",
      art: (
        <div className="bg-[var(--lp-bg)] border border-[var(--lp-line)]">
          <div className="flex items-center justify-between px-3 h-10 border-b border-[var(--lp-line)] text-sm text-[var(--lp-muted)]">
            <span>dbms</span>
            <kbd className="font-mono text-[10px] border border-[var(--lp-line)] px-1.5 py-0.5">CTRL K</kbd>
          </div>
          <div className="px-3 h-10 flex items-center text-sm text-[var(--lp-ink)]">Database Management Systems</div>
        </div>
      ),
    },
    {
      title: "SGPA and CGPA, done",
      text: "Pick grades and credits. The calculator follows the SPPU system.",
      art: (
        <div className="bg-[var(--lp-bg)] border border-[var(--lp-line)] text-sm text-[var(--lp-ink)]">
          {[["Subject A", "O"], ["Subject B", "A+"], ["Subject C", "A"]].map(([a, g]) => (
            <div key={a} className="flex justify-between px-3 h-9 items-center border-b border-[var(--lp-line)] last:border-0">
              <span>{a}</span>
              <span className="font-mono text-xs">{g}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Dead links get fixed",
      text: "Report a broken link in one tap. It is verified and replaced.",
      art: (
        <div className="bg-[var(--lp-bg)] border border-[var(--lp-line)] px-3 py-3 text-sm text-[var(--lp-ink)] flex items-center justify-between">
          <span>Unit 2 Notes</span>
          <span className="inline-flex items-center gap-1.5 text-[var(--lp-muted)]"><Flag size={14} aria-hidden /> Report</span>
        </div>
      ),
    },
  ];

  const steps = [
    ["Choose your year", "Open your year and pick the subject you are studying."],
    ["Open the unit", "Each unit lists its notes and resources as direct links."],
    ["Track your syllabus", "Mark units done and see progress. It stays on your device, no login."],
    ["Share what you have", "Login with your KKWagh email to submit notes. Approved ones carry your name."],
  ];

  return (
    <div className="bg-[var(--lp-bg)] text-[var(--lp-ink)] font-inter min-h-full">
      {/* Hero */}
      <section className={`${wrap} pt-14 md:pt-20 pb-16`}>
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-start">
          <div>
            <p className={`${eyebrow} inline-flex items-center gap-2 border border-[var(--lp-line)] px-3 py-1.5 mb-8`}>
              <span className="w-2 h-2 bg-[var(--lp-accent)]" aria-hidden /> Free for K.K. Wagh students
            </p>
            <h1 className="font-tight font-semibold tracking-[-0.035em] leading-[1.08] text-[44px] sm:text-6xl lg:text-[76px]">
              Every problem.
              <br />
              <span className="bg-[var(--lp-accent)] text-black px-1.5 [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">One solution:</span>
              <br />
              StudyBuddy.
            </h1>
            <p className="mt-7 text-lg text-[var(--lp-muted)] max-w-[34rem] leading-relaxed">
              Notes scattered over WhatsApp, dead Drive links, last-minute SGPA math. Subject-wise notes and student tools for K.K. Wagh engineering, in one place.
            </p>
            <div className="mt-9 max-w-[34rem]">
              <LandingSearch />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/first-year" className={btnPrimary}>Browse notes <ArrowUpRight size={17} aria-hidden /></Link>
              <Link href="/contribute" className={btnGhost}>Share your notes</Link>
            </div>
            <p className="mt-6 text-sm text-[var(--lp-muted)]">
              Built by Sanket Chaudhari ·{" "}
              <a href="https://sanketchaudhari.in" target="_blank" rel="noopener noreferrer" className="text-[var(--lp-ink)] underline underline-offset-4">
                sanketchaudhari.in
              </a>
            </p>
          </div>

          {/* Real library panel */}
          <div className="border border-[var(--lp-line)] bg-[var(--lp-bg)]">
            <div className="flex items-center justify-between px-5 h-12 border-b border-[var(--lp-line)] bg-[var(--lp-panel)]">
              <span className="font-tight font-semibold">Second Year</span>
              <span className={eyebrow}>Semesters III and IV</span>
            </div>
            <ul>
              {featured.map((s) => (
                <li key={s.id} className="border-b border-[var(--lp-line)] last:border-0">
                  <Link href={`/${s.year}/${s.id}`} className="flex items-center justify-between gap-4 px-5 min-h-[56px] hover:bg-[var(--lp-panel)] group">
                    <span className="text-[15px] font-medium">{s.name}</span>
                    <span className="flex items-center gap-3 shrink-0">
                      {s.unitCount > 0 && <span className={eyebrow}>{s.unitCount} UNITS</span>}
                      <ArrowRight size={16} aria-hidden className="text-[var(--lp-muted)] group-hover:text-[var(--lp-ink)]" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/second-year" className="flex items-center justify-between px-5 h-12 border-t border-[var(--lp-line)] text-sm font-semibold hover:bg-[var(--lp-panel)]">
              All second year subjects <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* Returning visitors: pinned and recently viewed (kept on this device; empty for new visitors) */}
      <div className={wrap}>
        <PinnedResources />
        <RecentlyViewed />
      </div>

      {/* Stats (real numbers from the content files) */}
      <section className={wrap} aria-label="StudyBuddy in numbers">
        <dl className="grid grid-cols-2 lg:grid-cols-4 bg-[var(--lp-panel)] border border-[var(--lp-line)]">
          {[...stats, ["Free", "Always, for every KKW student", ""] as [string, string, string]].map(([n, l, suf]) => (
            <div key={l} className="px-6 py-8 border-[var(--lp-line)] [&:nth-child(odd)]:border-r lg:border-r lg:last:border-r-0 [&:nth-child(-n+2)]:border-b lg:[&:nth-child(-n+2)]:border-b-0">
              <dd className="font-tight font-semibold tracking-tight text-4xl md:text-5xl">{typeof n === "number" ? <CountUp value={n} suffix={suf} /> : n}</dd>
              <dt className="mt-2 text-sm text-[var(--lp-muted)]">{l}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* Features */}
      <section className={`${wrap} py-24`} aria-labelledby="features-title">
        <p className={eyebrow}>Features</p>
        <h2 id="features-title" className="font-tight font-semibold tracking-[-0.03em] text-4xl md:text-5xl mt-3 mb-12 max-w-2xl">
          Forget the scramble before exams
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <article key={f.title} className="bg-[var(--lp-panel)] border border-[var(--lp-line)] p-4 flex flex-col justify-between min-h-[22rem]">
              <div className="pt-6 px-1">{f.art}</div>
              <div className="bg-[var(--lp-bg)] border border-[var(--lp-line)] p-5 mt-8">
                <h3 className="font-tight font-semibold text-lg leading-snug">{f.title}</h3>
                <p className="mt-2 text-sm text-[var(--lp-muted)] leading-relaxed">{f.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[var(--lp-panel)] border-y border-[var(--lp-line)]" aria-labelledby="how-title">
        <div className={`${wrap} py-24 grid lg:grid-cols-[1fr_1.2fr] gap-12`}>
          <div>
            <p className={eyebrow}>How it works</p>
            <h2 id="how-title" className="font-tight font-semibold tracking-[-0.03em] text-4xl md:text-5xl mt-3">
              From search to notes in four steps
            </h2>
          </div>
          <ol>
            {steps.map(([t, d], i) => (
              <li key={t} className="grid grid-cols-[56px_1fr] gap-4 py-6 border-t border-[var(--lp-ink)] first:border-t-2">
                <span className="font-mono text-sm text-[var(--lp-muted)]">0{i + 1}</span>
                <div>
                  <h3 className="font-tight font-semibold text-xl">{t}</h3>
                  <p className="mt-1.5 text-[var(--lp-muted)] leading-relaxed">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Browse by year */}
      <section className={`${wrap} py-24`} aria-labelledby="years-title">
        <p className={eyebrow}>Browse</p>
        <h2 id="years-title" className="font-tight font-semibold tracking-[-0.03em] text-4xl md:text-5xl mt-3 mb-12">Pick your year</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {years.map((y) => {
            const subs = (indexData as Record<string, Subject[]>)[y] ?? [];
            return (
              <article key={y} className="border border-[var(--lp-line)] flex flex-col">
                <div className="p-6 border-b border-[var(--lp-line)] flex items-baseline justify-between">
                  <h3 className="font-tight font-semibold text-2xl">{YEAR_TITLES[y]}</h3>
                  <span className={eyebrow}>{subs.length} SUBJECTS</span>
                </div>
                <ul className="p-6 flex flex-wrap gap-2 flex-1">
                  {subs.map((s) => (
                    <li key={s.id}>
                      <Link href={`/${y}/${s.id}`} className="inline-flex items-center min-h-[36px] px-3 border border-[var(--lp-line)] text-sm hover:border-[var(--lp-ink)]">
                        {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href={`/${y}`} className="flex items-center justify-between px-6 h-14 border-t border-[var(--lp-line)] font-semibold hover:bg-[var(--lp-panel)]">
                  Open {YEAR_TITLES[y]} <ArrowRight size={17} aria-hidden />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      {/* Call to action */}
      <section className={`${wrap} pb-24`}>
        <div className="bg-[#0e0e0e] text-white p-8 md:p-14 grid md:grid-cols-[1.4fr_1fr] gap-8 items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/60">Contribute</p>
            <h2 className="font-tight font-semibold tracking-[-0.03em] text-4xl md:text-5xl mt-3 leading-[1.05]">
              Have good notes? Get credited by name.
            </h2>
            <p className="mt-4 text-white/70 max-w-xl leading-relaxed">
              Submit a link, we review it, and approved notes go live with your name and points on the leaderboard.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link href="/contribute" className={btnPrimary}>Share your notes</Link>
            <Link href="/support" className="inline-flex items-center justify-center h-12 px-6 border border-white/40 text-white text-[15px] font-semibold hover:bg-white/10">Support the project</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0b0b0b] text-white">
        <div className={`${wrap} py-14 grid sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] gap-10`}>
          <div>
            <div className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icon.svg" alt="" width={32} height={32} className="w-8 h-8" />
              <span className="font-tight font-semibold text-lg">StudyBuddy</span>
            </div>
            <p className="mt-4 text-sm text-white/60 max-w-xs leading-relaxed">Free notes and student tools for K.K. Wagh engineering students. Built by a student.</p>
          </div>
          {[
            ["Notes", [["First Year", "/first-year"], ["Second Year", "/second-year"], ["Previous Year Papers", "/pyq"]]],
            ["Tools", [["SGPA / CGPA Calculator", "/calculator"], ["Study Analytics", "/analytics"], ["Exam Countdown", "/countdown"]]],
            ["Project", [["Contribute", "/contribute"], ["Support", "/support"], ["About", "/about"], ["Contact", "/contact"], ["Privacy", "/privacy"], ["Terms", "/terms"]]],
          ].map(([h, links]) => (
            <div key={h as string}>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/50 mb-4">{h as string}</h3>
              <ul className="space-y-2.5 text-sm">
                {(links as string[][]).map(([l, href]) => (
                  <li key={l}><Link href={href} className="text-white/80 hover:text-white inline-flex items-center min-h-[28px]">{l}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className={`${wrap} py-6 border-t border-white/10 text-xs text-white/50`}>
          © {new Date().getFullYear()} Study Buddy KKW. Open source under the MIT License. Not an official page of KKWIEER. Built by{" "}
          <a href="https://sanketchaudhari.in" target="_blank" rel="noopener noreferrer" className="text-white/80 underline underline-offset-4 hover:text-white">
            Sanket Chaudhari (sanketchaudhari.in)
          </a>
        </div>
      </footer>
    </div>
  );
}
