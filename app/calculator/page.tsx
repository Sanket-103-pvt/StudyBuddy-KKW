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
        {/* Print header */}
        <div className="hidden print:block mb-6 pb-4 border-b border-black text-center">
          <h1 className="text-xl font-bold">K. K. Wagh Institute of Engineering Education and Research, Nashik</h1>
          <p className="text-sm mt-1">SGPA / CGPA calculation (self-calculated, not an official record)</p>
          <p className="text-sm mt-3">
            Name: {data.studentName || "-"} &nbsp;|&nbsp; PRN: {data.prn || "-"} &nbsp;|&nbsp; Date: {new Date().toLocaleDateString("en-IN")}
          </p>
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
        <section className="mt-8 grid md:grid-cols-3 border border-[var(--lp-ink)]" aria-label="Results">
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
        <section className="hidden print:block">
          {data.semesters.map((s) => {
            const r = calculateSGPA(s.subjects);
            if (s.subjects.length === 0) return null;
            return (
              <div key={s.semNumber} className="mb-5 break-inside-avoid">
                <h2 className="font-bold mb-1">Semester {s.semNumber}: SGPA {r.totalCredits > 0 ? r.sgpa.toFixed(2) : "-"}</h2>
                <table className="w-full text-sm border-collapse">
                  <thead><tr className="border-b border-black text-left"><th className="py-1">Subject</th><th>Credits</th><th>Grade</th><th>Points</th></tr></thead>
                  <tbody>
                    {s.subjects.map((x, i) => {
                      const g = KKW_GRADE_SCALE.find((y) => y.grade === x.grade);
                      return (
                        <tr key={x.id} className="border-b border-gray-300">
                          <td className="py-1">{x.name || `Subject ${i + 1}`}</td><td>{x.credits}</td><td>{x.grade || "-"}</td><td>{g && !g.nonCountable ? g.point : "-"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })}
          <p className="font-bold mt-4">CGPA: {cgpa.totalCredits > 0 ? cgpa.cgpa.toFixed(2) : "-"} &nbsp;|&nbsp; {cgpa.totalCredits > 0 ? klass.className : ""}</p>
        </section>

        {/* Reference: Table 2 and Table 3 of the grade card */}
        <section className="print:hidden mt-14 grid lg:grid-cols-2 gap-8" aria-label="Grade card reference">
          <div className="border border-[var(--lp-line)]">
            <h2 className="px-4 py-3 font-tight font-semibold text-xl border-b border-[var(--lp-line)] bg-[var(--lp-panel)]">Grades and points</h2>
            <table className="w-full text-sm">
              <thead><tr className="text-left font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--lp-muted)]"><th className="px-4 py-2">Grade</th><th>% marks</th><th>Points</th><th>Meaning</th></tr></thead>
              <tbody className="font-mono">
                {[
                  ["O", "90-100", "10", "Outstanding"], ["A", "80-89", "9", "Excellent"], ["B", "70-79", "8", "Very Good"],
                  ["C", "60-69", "7", "Good"], ["D", "50-59", "6", "Average"], ["E", "40-49", "5", "Below Average"], ["F", "Below 40", "0", "Fail"],
                ].map((r) => (
                  <tr key={r[0]} className="border-t border-[var(--lp-line)]"><td className="px-4 py-2 font-bold">{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td className="font-sans">{r[3]}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border border-[var(--lp-line)]">
            <h2 className="px-4 py-3 font-tight font-semibold text-xl border-b border-[var(--lp-line)] bg-[var(--lp-panel)]">CGPA and class awarded</h2>
            <table className="w-full text-sm">
              <thead><tr className="text-left font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--lp-muted)]"><th className="px-4 py-2">CGPA</th><th>Class</th></tr></thead>
              <tbody>
                {[
                  ["7.75 or more", "First Class with Distinction"], ["6.75 to below 7.75", "First Class"], ["6.25 to below 6.75", "Higher Second Class"],
                  ["5.5 to below 6.25", "Second Class"], ["4.0 to below 5.5", "Pass Class"],
                ].map((r) => (
                  <tr key={r[0]} className="border-t border-[var(--lp-line)]"><td className="px-4 py-2 font-mono">{r[0]}</td><td>{r[1]}</td></tr>
                ))}
              </tbody>
            </table>
            <p className="px-4 py-3 border-t border-[var(--lp-line)] text-sm text-[var(--lp-muted)]">
              SGPA = sum of (credits x grade points) / total credits of the semester. CGPA uses the same formula over all semesters together, so it is not a plain average of your SGPAs. Check results against your official grade card.
            </p>
          </div>
        </section>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
