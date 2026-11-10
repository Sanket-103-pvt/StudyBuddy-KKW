"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Plus, Trash2, Printer, RotateCcw } from "lucide-react";
import Footer from "@/components/Footer";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ToastProvider";
import { loadCalculatorFromCloud, saveCalculatorToCloud } from "@/lib/calculator-cloud";
import {
  KKW_GRADE_SCALE,
  MAX_SEMESTERS,
  MAX_SUBJECTS_PER_SEMESTER,
  calculateCGPA,
  calculateSGPA,
  emptyCalculator,
  getKKWClassAwarded,
  hasUnclearedCourse,
  hasUserData,
  newSubject,
  parseCalculatorData,
  type CalculatorData,
  type SubjectEntry,
} from "@/lib/calculator-utils";

const STORAGE_KEY = "kkw_sgpa_v2";

const eyebrow = "font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--lp-muted)]";
const input = "h-11 w-full px-3 border border-[var(--lp-line)] bg-[var(--lp-bg)] text-[var(--lp-ink)] focus:outline-none focus:border-[var(--lp-ink)]";
const btn = "inline-flex items-center justify-center gap-2 h-11 px-4 text-sm font-semibold";
const mark = "bg-[var(--lp-accent)] text-black px-1.5 [box-decoration-break:clone] [-webkit-box-decoration-break:clone]";

const GRADE_ROWS: string[][] = [
  ["O", "90-100", "10", "09.00-10.00", "Outstanding"],
  ["A", "80-89", "9", "08.00-08.99", "Excellent"],
  ["B", "70-79", "8", "07.00-07.99", "Very Good"],
  ["C", "60-69", "7", "06.00-06.99", "Good"],
  ["D", "50-59", "6", "05.00-05.99", "Average"],
  ["E", "40-49", "5", "04.00-04.99", "Below Average"],
  ["F", "Below 40", "0", "Below 04.00", "Fail"],
  ["FX", "-", "0", "-", "Detained, repeat the course"],
  ["AB", "Nil", "0", "-", "Absent"],
  ["IC", "-", "0", "-", "Incomplete course: absent for exam but continue for the course"],
  ["AC", "-", "-", "-", "Audit course completed"],
  ["ACN", "-", "-", "-", "Audit course not completed"],
  ["PP", "-", "-", "-", "Passed (only for non-audit course)"],
  ["NP", "-", "-", "-", "Not passed (only for non-audit course)"],
];

const CLASS_ROWS: string[][] = [
  ["7.75 or more", "First Class with Distinction"],
  ["6.75 or more but less than 7.75", "First Class"],
  ["6.25 or more but less than 6.75", "Higher Second Class"],
  ["5.5 or more but less than 6.25", "Second Class"],
  ["4.0 or more but less than 5.5", "Pass Class"],
];

const ABBREVIATIONS: string[][] = [
  ["AB", "Absent"], ["TW", "Term work"],
  ["ATKT", "Allowed to keep term"], ["VV", "Viva"],
  ["C", "Carried forward"], ["!", "Non countable credit course"],
  ["OR", "Oral"], ["#", "Ordinance 4 of SPPU"],
  ["PC", "Performance cancelled"], ["$", "Ordinance 1 of SPPU"],
  ["PR", "Practical"], ["&", "Ordinance 163 of SPPU"],
  ["TH", "Theory"], ["*", "Current appearance"],
  ["TU", "Tutorial"], ["@", "Ordinance 1+163 of SPPU"],
];

type SaveState = "device" | "loading" | "saving" | "saved" | "error";

export default function CalculatorPage() {
  const auth = useAuth();
  const toast = useToast();
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<CalculatorData>(emptyCalculator());
  const [active, setActive] = useState(1);
  const [cloudReady, setCloudReady] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("device");
  const skipNextCloudSave = useRef(false);

  // 1. Load what this student saved on this device (no demo data).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? parseCalculatorData(JSON.parse(raw)) : null;
      if (parsed) setData(parsed);
    } catch {
      /* storage blocked or corrupt: start empty */
    }
    setMounted(true);
  }, []);

  // 2. Keep a copy on this device.
  useEffect(() => {
    if (!mounted) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* ignore */
    }
  }, [mounted, data]);

  // 3. After login, bring in the account copy (it wins), or upload what is already on this device.
  useEffect(() => {
    if (!mounted || auth.loading) return;
    if (!auth.signedIn) {
      setCloudReady(false);
      setSaveState("device");
      return;
    }
    let cancelled = false;
    setSaveState("loading");
    loadCalculatorFromCloud().then(async ({ data: cloud, error }) => {
      if (cancelled) return;
      if (error) {
        setSaveState("error");
        return;
      }
      if (cloud) {
        skipNextCloudSave.current = true;
        setData(cloud);
        setActive(1);
        toast.info("Loaded your saved calculator from your account.");
      } else if (hasUserData(data)) {
        const ok = await saveCalculatorToCloud(data);
        if (cancelled) return;
        if (!ok) {
          setSaveState("error");
          return;
        }
      }
      setCloudReady(true);
      setSaveState("saved");
    });
    return () => {
      cancelled = true;
    };
    // data is read once on login; later changes are saved by the effect below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, auth.loading, auth.signedIn]);

  // 4. Save changes to the account (waits a moment after typing stops).
  useEffect(() => {
    if (!cloudReady || !auth.signedIn) return;
    if (skipNextCloudSave.current) {
      skipNextCloudSave.current = false;
      return;
    }
    setSaveState("saving");
    const t = setTimeout(async () => {
      const ok = await saveCalculatorToCloud(data);
      setSaveState(ok ? "saved" : "error");
    }, 900);
    return () => clearTimeout(t);
  }, [data, cloudReady, auth.signedIn]);

  const semester = data.semesters.find((s) => s.semNumber === active) ?? data.semesters[0];
  const sgpa = useMemo(() => calculateSGPA(semester.subjects), [semester]);
  const cgpa = useMemo(() => calculateCGPA(data.semesters), [data.semesters]);
  const klass = useMemo(() => getKKWClassAwarded(cgpa.cgpa), [cgpa.cgpa]);
  const uncleared = useMemo(() => hasUnclearedCourse(data.semesters), [data.semesters]);

  const updateSemester = useCallback((semNumber: number, fn: (subjects: SubjectEntry[]) => SubjectEntry[]) => {
    setData((prev) => ({
      ...prev,
      semesters: prev.semesters.map((s) => (s.semNumber === semNumber ? { ...s, subjects: fn(s.subjects) } : s)),
    }));
  }, []);

  const updateSubject = (id: string, patch: Partial<SubjectEntry>) =>
    updateSemester(semester.semNumber, (subs) => subs.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const addSubject = () => {
    if (semester.subjects.length >= MAX_SUBJECTS_PER_SEMESTER) {
      toast.error(`At most ${MAX_SUBJECTS_PER_SEMESTER} subjects in a semester.`);
      return;
    }
    updateSemester(semester.semNumber, (subs) => [...subs, newSubject()]);
  };

  const removeSubject = (id: string) => updateSemester(semester.semNumber, (subs) => subs.filter((s) => s.id !== id));

  const addSemester = () => {
    if (data.semesters.length >= MAX_SEMESTERS) return;
    const next = data.semesters.length + 1;
    setData((prev) => ({ ...prev, semesters: [...prev.semesters, { semNumber: next, subjects: [] }] }));
    setActive(next);
  };

  const removeLastSemester = () => {
    if (data.semesters.length <= 1) return;
    const last = data.semesters[data.semesters.length - 1];
    if (last.subjects.length > 0 && !window.confirm(`Remove Semester ${last.semNumber} and its subjects?`)) return;
    setData((prev) => ({ ...prev, semesters: prev.semesters.slice(0, -1) }));
    setActive((a) => Math.min(a, data.semesters.length - 1));
  };

  const reset = () => {
    if (!window.confirm("Clear everything you entered? This also clears the copy saved in your account.")) return;
    setData(emptyCalculator());
    setActive(1);
  };

  const statusText: Record<SaveState, string> = {
    device: "Saved on this device only.",
    loading: "Loading your saved data…",
    saving: "Saving to your account…",
    saved: "Saved to your account.",
    error: "Could not reach your account. Your data is still saved on this device.",
  };

  if (!mounted) {
    return (
      <div className="flex flex-col min-h-full bg-[var(--lp-bg)]">
        <main className="flex-grow max-w-container-max w-full mx-auto px-margin-mobile md:px-margin-desktop py-12">
          <div className="h-10 w-72 bg-[var(--lp-panel)]" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-[var(--lp-bg)] text-[var(--lp-ink)]">
      <main className="flex-grow max-w-container-max w-full mx-auto px-margin-mobile md:px-margin-desktop py-10 md:py-14">
        {/* Print header: letterhead style */}
        <div className="hidden print:block mb-5 [print-color-adjust:exact] [-webkit-print-color-adjust:exact]">
          <div className="flex items-center justify-between pb-3 border-b-[3px] border-[#e8832a]">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icon.svg" alt="" width={44} height={44} />
              <div>
                <p className="font-tight font-bold text-xl leading-none">StudyBuddy <span className="bg-[#e8832a] text-black px-1">KKW</span></p>
                <p className="text-[11px] mt-1 tracking-wide">www.studybuddykkw.dev</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-tight font-bold text-lg leading-none tracking-wide uppercase">Statement of SGPA / CGPA</p>
              <p className="text-[11px] mt-1">Self-calculated &middot; Not an official record</p>
            </div>
          </div>
          <p className="text-[11px] mt-2 text-center tracking-wide">Grades as per K. K. Wagh Institute of Engineering Education and Research, Nashik (Autonomous)</p>
          <div className="mt-3 grid grid-cols-[1fr_auto_auto] gap-x-8 gap-y-1 border border-black px-3 py-2 text-sm">
            <p><span className="font-semibold">Name:</span> {data.studentName || "-"}</p>
            <p><span className="font-semibold">PRN:</span> {data.prn || "-"}</p>
            <p><span className="font-semibold">Date:</span> {new Date().toLocaleDateString("en-IN")}</p>
          </div>
        </div>

        <header className="print:hidden max-w-2xl">
          <p className={eyebrow}>Tool</p>
          <h1 className="mt-3 font-tight font-semibold tracking-[-0.03em] leading-[1.15] text-4xl md:text-5xl">
            <span className={mark}>SGPA</span> and CGPA Calculator
          </h1>
          <p className="mt-5 text-lg text-[var(--lp-muted)] leading-relaxed">
            Add your own subjects, credits and grades. The calculation follows the K.K. Wagh grade card. Nothing is pre-filled.
          </p>
        </header>

        <div className="print:hidden mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border border-[var(--lp-line)] bg-[var(--lp-panel)] px-4 py-3">
          <span className={`text-sm ${saveState === "error" ? "text-red-700 dark:text-red-400" : "text-[var(--lp-muted)]"}`}>{statusText[saveState]}</span>
          {auth.enabled && !auth.signedIn && !auth.loading && (
            <button type="button" onClick={() => auth.signIn()} className="text-sm font-semibold underline underline-offset-4 hover:text-[var(--lp-accent)]">
              Login / Sign up to keep it in your account
            </button>
          )}
        </div>

        {/* Results */}
        <section className="print:hidden mt-8 grid md:grid-cols-3 border border-[var(--lp-ink)]" aria-label="Results">
          <div className="p-6 md:border-r border-[var(--lp-ink)] border-b md:border-b-0">
            <p className={eyebrow}>Semester {semester.semNumber} SGPA</p>
            <p className="mt-2 font-tight font-semibold text-5xl tracking-tight">{sgpa.totalCredits > 0 ? sgpa.sgpa.toFixed(2) : "–"}</p>
            <p className="mt-2 text-sm text-[var(--lp-muted)]">{sgpa.totalCredits} credits counted</p>
          </div>
          <div className="p-6 md:border-r border-[var(--lp-ink)] border-b md:border-b-0 bg-[var(--lp-panel)]">
            <p className={eyebrow}>CGPA, all semesters</p>
            <p className="mt-2 font-tight font-semibold text-5xl tracking-tight">{cgpa.totalCredits > 0 ? cgpa.cgpa.toFixed(2) : "–"}</p>
            <p className="mt-2 text-sm text-[var(--lp-muted)]">{cgpa.earnedCredits} of {cgpa.totalCredits} credits earned</p>
          </div>
          <div className="p-6">
            <p className={eyebrow}>Class (from CGPA)</p>
            <p className="mt-2 font-tight font-semibold text-2xl leading-tight">{cgpa.totalCredits > 0 ? klass.className : "–"}</p>
            <p className="mt-2 text-sm text-[var(--lp-muted)]">{cgpa.totalCredits > 0 ? klass.description : "Add grades to see this"}</p>
          </div>
        </section>
        {uncleared && (
          <p className="print:hidden mt-3 text-sm text-[var(--lp-muted)] border-l-4 border-[var(--lp-accent)] pl-3">
            You have a failed, absent, detained or incomplete course. The college prints an SGPA only when all credits of the semester are earned, so treat this as an estimate.
          </p>
        )}

        {/* Semester tabs */}
        <div className="print:hidden mt-10 flex flex-wrap items-center gap-2" role="tablist" aria-label="Semesters">
          {data.semesters.map((s) => {
            const r = calculateSGPA(s.subjects);
            const on = s.semNumber === semester.semNumber;
            return (
              <button
                key={s.semNumber}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setActive(s.semNumber)}
                className={`h-11 px-4 border text-sm font-semibold ${on ? "bg-[var(--lp-ink)] text-[var(--lp-bg)] border-[var(--lp-ink)]" : "border-[var(--lp-line)] hover:border-[var(--lp-ink)]"}`}
              >
                Sem {s.semNumber}
                <span className="ml-2 font-mono text-[11px] opacity-80">{r.totalCredits > 0 ? r.sgpa.toFixed(2) : "–"}</span>
              </button>
            );
          })}
          {data.semesters.length < MAX_SEMESTERS && (
            <button type="button" onClick={addSemester} className={`${btn} border border-dashed border-[var(--lp-ink)] hover:bg-[var(--lp-panel)]`}>
              <Plus size={16} aria-hidden="true" /> Add semester
            </button>
          )}
        </div>

        {/* Subjects of the active semester */}
        <section className="print:hidden mt-4 border border-[var(--lp-line)]" aria-label={`Semester ${semester.semNumber} subjects`}>
          <div className="hidden md:grid grid-cols-[1fr_110px_1.1fr_70px_52px] gap-3 px-4 py-3 border-b border-[var(--lp-line)] bg-[var(--lp-panel)] font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--lp-muted)]">
            <span>Subject (optional name)</span><span>Credits</span><span>Grade</span><span>Points</span><span />
          </div>
          {semester.subjects.length === 0 ? (
            <p className="p-6 text-[var(--lp-muted)]">No subjects yet. Add each subject with its credits and the grade you got.</p>
          ) : (
            <ul>
              {semester.subjects.map((s, i) => {
                const g = KKW_GRADE_SCALE.find((x) => x.grade === s.grade);
                return (
                  <li key={s.id} className="grid grid-cols-2 md:grid-cols-[1fr_110px_1.1fr_70px_52px] gap-3 px-4 py-3 border-b border-[var(--lp-line)] last:border-b-0 items-center">
                    <input
                      aria-label={`Subject ${i + 1} name`}
                      className={`${input} col-span-2 md:col-span-1`}
                      value={s.name}
                      maxLength={80}
                      placeholder={`Subject ${i + 1}`}
                      onChange={(e) => updateSubject(s.id, { name: e.target.value })}
                    />
                    <input
                      aria-label={`Subject ${i + 1} credits`}
                      className={input}
                      type="number"
                      inputMode="decimal"
                      min={0.5}
                      max={10}
                      step={0.5}
                      value={s.credits}
                      onChange={(e) => updateSubject(s.id, { credits: Math.min(Math.max(parseFloat(e.target.value) || 0, 0), 10) })}
                    />
                    <select
                      aria-label={`Subject ${i + 1} grade`}
                      className={`${input} col-span-2 md:col-span-1`}
                      value={s.grade}
                      onChange={(e) => updateSubject(s.id, { grade: e.target.value })}
                    >
                      <option value="">Choose grade</option>
                      {KKW_GRADE_SCALE.map((x) => (
                        <option key={x.grade} value={x.grade}>{x.label}</option>
                      ))}
                    </select>
                    <span className="font-mono font-semibold md:text-center">
                      <span className="md:hidden text-[var(--lp-muted)] font-normal">Points </span>
                      {g ? (g.nonCountable ? "–" : g.point) : ""}
                    </span>
                    <button type="button" onClick={() => removeSubject(s.id)} aria-label={`Remove subject ${i + 1}`} className="touch-target h-11 w-11 inline-flex items-center justify-center justify-self-end hover:text-red-600">
                      <Trash2 size={18} aria-hidden="true" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="flex flex-wrap gap-3 p-4 border-t border-[var(--lp-line)] bg-[var(--lp-panel)]">
            <button type="button" onClick={addSubject} className={`${btn} bg-[var(--lp-accent)] text-black hover:brightness-95`}>
              <Plus size={16} aria-hidden="true" /> Add subject
            </button>
            {data.semesters.length > 1 && (
              <button type="button" onClick={removeLastSemester} className={`${btn} border border-[var(--lp-line)] hover:border-[var(--lp-ink)]`}>
                Remove last semester
              </button>
            )}
          </div>
        </section>

        {/* Optional printout details and actions */}
        <section className="print:hidden mt-8 grid md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
          <label className="block">
            <span className={eyebrow}>Name for printout (optional)</span>
            <input className={`${input} mt-2`} value={data.studentName} maxLength={80} onChange={(e) => setData((p) => ({ ...p, studentName: e.target.value }))} />
          </label>
          <label className="block">
            <span className={eyebrow}>PRN for printout (optional)</span>
            <input className={`${input} mt-2`} value={data.prn} maxLength={30} onChange={(e) => setData((p) => ({ ...p, prn: e.target.value }))} />
          </label>
          <div className="flex gap-3">
            <button type="button" onClick={() => window.print()} className={`${btn} border border-[var(--lp-ink)] hover:bg-[var(--lp-panel)]`}>
              <Printer size={16} aria-hidden="true" /> Print / Save PDF
            </button>
            <button type="button" onClick={reset} className={`${btn} border border-[var(--lp-line)] hover:border-[var(--lp-ink)]`}>
              <RotateCcw size={16} aria-hidden="true" /> Clear
            </button>
          </div>
        </section>

        {/* Printout: every semester */}
        <section className="hidden print:block [print-color-adjust:exact] [-webkit-print-color-adjust:exact]">
          {data.semesters.map((s) => {
            const r = calculateSGPA(s.subjects);
            if (s.subjects.length === 0) return null;
            return (
              <div key={s.semNumber} className="mb-5 break-inside-avoid">
                <div className="flex items-center justify-between bg-black text-white px-3 py-1 text-sm font-semibold tracking-wide uppercase">
                  <span>Semester {s.semNumber}</span>
                  <span>SGPA: {r.totalCredits > 0 ? r.sgpa.toFixed(2) : "-"}</span>
                </div>
                <table className="w-full text-sm border-collapse border-x border-b border-black">
                  <thead>
                    <tr className="bg-[#fbe9d6] text-left text-[12px] uppercase tracking-wide">
                      <th className="py-1 px-3 w-10">Sr.</th><th className="px-3">Course name</th><th className="px-3 text-center">Credits</th><th className="px-3 text-center">Grade</th><th className="px-3 text-center">Grade pt</th><th className="px-3 text-center">Credit pt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {s.subjects.map((x, i) => {
                      const g = KKW_GRADE_SCALE.find((y) => y.grade === x.grade);
                      const counted = g && !g.nonCountable;
                      return (
                        <tr key={x.id} className="border-t border-gray-300">
                          <td className="py-1 px-3">{i + 1}</td>
                          <td className="px-3">{x.name || `Subject ${i + 1}`}</td>
                          <td className="px-3 text-center">{x.credits}</td>
                          <td className="px-3 text-center font-semibold">{x.grade || "-"}</td>
                          <td className="px-3 text-center">{counted ? g.point : "-"}</td>
                          <td className="px-3 text-center">{counted ? g.point * x.credits : "-"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <p className="text-[11px] mt-1 text-right">Credits counted: {r.totalCredits} &nbsp;|&nbsp; Credits earned: {r.earnedCredits}</p>
              </div>
            );
          })}
          <div className="mt-4 border-2 border-black break-inside-avoid">
            <div className="grid grid-cols-3 text-center">
              <div className="py-3 border-r border-black">
                <p className="text-[11px] uppercase tracking-wide">CGPA</p>
                <p className="font-tight font-bold text-3xl">{cgpa.totalCredits > 0 ? cgpa.cgpa.toFixed(2) : "-"}</p>
              </div>
              <div className="py-3 border-r border-black">
                <p className="text-[11px] uppercase tracking-wide">Total credits earned</p>
                <p className="font-tight font-bold text-3xl">{cgpa.earnedCredits}<span className="text-base font-normal"> / {cgpa.totalCredits}</span></p>
              </div>
              <div className="py-3 px-2 bg-[#e8832a]">
                <p className="text-[11px] uppercase tracking-wide">Class awarded</p>
                <p className="font-tight font-bold text-lg leading-tight mt-1">{cgpa.totalCredits > 0 ? klass.className : "-"}</p>
              </div>
            </div>
          </div>
          <p className="text-[10px] mt-4 text-gray-600 leading-snug">
            SGPA and CGPA = sum of (credits x grade points) divided by sum of credits. Audit and non-countable courses are left out. Grade points: O 10, A 9, B 8, C 7, D 6, E 5, F 0.
            This sheet was calculated by the student on www.studybuddykkw.dev and is not issued by the college. Check against your official grade card.
          </p>
        </section>

        {/* Grade card reference (Tables 1, 2 and 3 of the K.K. Wagh grade card) */}
        <section className="print:hidden mt-14" aria-label="Grade card reference">
          <p className={eyebrow}>Reference</p>
          <h2 className="mt-3 mb-6 font-tight font-semibold tracking-[-0.03em] text-3xl md:text-4xl">
            K.K. Wagh grade card, <span className={mark}>at a glance</span>
          </h2>
          <div className="grid lg:grid-cols-2 gap-5 items-start">
            <div className="border border-[var(--lp-ink)]">
              <h3 className="px-4 py-2.5 bg-[var(--lp-ink)] text-[var(--lp-bg)] font-tight font-semibold text-lg flex justify-between items-baseline">
                Grades and points <span className="font-mono text-[10px] tracking-[0.12em] opacity-70">TABLE 2</span>
              </h3>
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="text-left font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--lp-muted)] bg-[var(--lp-panel)] border-b border-[var(--lp-ink)]">
                    <th className="px-3 py-2 whitespace-nowrap">Grade<sup>+</sup></th>
                    <th className="px-2 whitespace-nowrap">% marks<sup>++</sup></th>
                    <th className="px-2">Pts</th>
                    <th className="px-2 whitespace-nowrap hidden sm:table-cell">CGPA range</th>
                    <th className="px-2">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {GRADE_ROWS.map((r) => (
                    <tr key={r[0]} className="border-t border-[var(--lp-line)] align-top">
                      <td className="px-3 py-1.5 font-mono font-bold">{r[0]}</td>
                      <td className="px-2 py-1.5 font-mono whitespace-nowrap">{r[1]}</td>
                      <td className="px-2 py-1.5 font-mono">{r[2]}</td>
                      <td className="px-2 py-1.5 font-mono whitespace-nowrap hidden sm:table-cell">{r[3]}</td>
                      <td className="px-2 py-1.5">{r[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="px-3 py-2 border-t border-[var(--lp-line)] text-[11px] text-[var(--lp-muted)]">
                <sup>+</sup> Applicable for each course and CGPA &nbsp; <sup>++</sup> Applicable for each course only
              </p>
            </div>

            <div className="border border-[var(--lp-ink)]">
              <h3 className="px-4 py-2.5 bg-[var(--lp-ink)] text-[var(--lp-bg)] font-tight font-semibold text-lg flex justify-between items-baseline">
                CGPA, class and formulas <span className="font-mono text-[10px] tracking-[0.12em] opacity-70">TABLE 3</span>
              </h3>
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="text-left font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--lp-muted)] bg-[var(--lp-panel)] border-b border-[var(--lp-ink)]">
                    <th className="px-3 py-2">CGPA</th>
                    <th className="px-2">Class awarded</th>
                  </tr>
                </thead>
                <tbody>
                  {CLASS_ROWS.map((r) => (
                    <tr key={r[0]} className="border-t border-[var(--lp-line)]">
                      <td className="px-3 py-1.5 font-mono">{r[0]}</td>
                      <td className="px-2 py-1.5">{r[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-3 pt-3 pb-1 border-t border-[var(--lp-line)]">
                <h4 className="font-tight font-semibold text-base mb-1.5">How SGPA and CGPA are calculated</h4>
                <p className="text-[13px] leading-snug mb-1.5"><b className="font-mono">SGPA</b> = Σ (grade points earned × credits for each course) ÷ total credits for the semester</p>
                <p className="text-[13px] leading-snug mb-1.5"><b className="font-mono">CGPA</b> = Σ (C<sub>j</sub> × G<sub>j</sub>) ÷ Σ C<sub>j</sub>, over the courses of all semesters together</p>
                <p className="text-[12px] text-[var(--lp-muted)]">C = credits of the course, G = grade point earned in the course.</p>
              </div>
              <div className="px-3 pt-3 pb-2">
                <h4 className="font-tight font-semibold text-base mb-1.5">Abbreviations</h4>
                <dl className="grid sm:grid-cols-2 gap-x-5 text-[12px]">
                  {ABBREVIATIONS.map((x) => (
                    <div key={x[0]} className="flex gap-3 border-b border-[var(--lp-line)] py-1">
                      <dt className="font-mono font-bold w-10 shrink-0">{x[0]}</dt>
                      <dd>{x[1]}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <p className="px-3 py-2.5 border-t border-[var(--lp-line)] text-[12px] leading-snug text-[var(--lp-muted)]">
                The SGPA of a semester is printed on the grade card only if the candidate has passed in all heads of examination and earned all credits of that semester. A candidate is declared a pass on earning 50% of the total credits assigned in the respective year.
              </p>
            </div>
          </div>
          <p className="mt-3 text-[12px] text-[var(--lp-muted)]">Retyped from the K.K. Wagh grade card. Check results against your official grade card.</p>
        </section>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
