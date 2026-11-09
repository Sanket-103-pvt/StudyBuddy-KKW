"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Trophy, Send, LogIn } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ToastProvider";
import { formatYearTitle } from "@/lib/year-utils";
import {
  AVAILABLE_YEARS,
  NOTE_TYPE_LABELS,
  createSubmission,
  deleteSubmission,
  getSubjectsForYear,
  listLeaderboard,
  listMySubmissions,
  validateSubmission,
  type LeaderboardRow,
  type NoteType,
  type Submission,
  type SubmissionForm,
} from "@/lib/contrib";

const EMPTY_FORM: SubmissionForm = {
  kind: "resource",
  year: "",
  subjectId: "",
  unitNumber: "",
  title: "",
  url: "",
  noteType: "handwritten",
  description: "",
};

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200",
  approved: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200",
  rejected: "bg-red-100 text-red-900 dark:bg-red-950/50 dark:text-red-200",
};

const inputClass =
  "w-full min-h-[48px] px-4 rounded-xl border border-border-light dark:border-border-dark bg-surface-container-lowest dark:bg-bg-dark text-on-surface dark:text-text-primary-dark";

function Leaderboard({ rows }: { rows: LeaderboardRow[] | null }) {
  return (
    <section aria-labelledby="leaderboard-heading" className="mb-12">
      <h2 id="leaderboard-heading" className="font-sora font-bold text-headline-sm mb-4 flex items-center gap-2 text-on-surface dark:text-text-primary-dark">
        <Trophy size={22} className="text-amber-500" aria-hidden="true" /> Contributor leaderboard
      </h2>
      {rows === null ? (
        <p className="text-text-secondary-light dark:text-text-secondary-dark">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-text-secondary-light dark:text-text-secondary-dark">
          No points awarded yet. Be the first contributor.
        </p>
      ) : (
        <ol className="rounded-2xl border border-border-light dark:border-border-dark divide-y divide-border-light dark:divide-border-dark overflow-hidden">
          {rows.map((r, i) => (
            <li key={`${r.display_name}-${i}`} className="flex items-center justify-between gap-3 px-4 py-3 bg-surface-container-lowest dark:bg-bg-dark">
              <span className="flex items-center gap-3 min-w-0">
                <span className="w-7 text-center font-mono font-bold text-text-secondary-light dark:text-text-secondary-dark">{i + 1}</span>
                <span className="font-sora font-semibold truncate text-on-surface dark:text-text-primary-dark">{r.display_name}</span>
              </span>
              <span className="text-right shrink-0">
                <span className="block font-sora font-bold text-primary dark:text-primary-fixed-dim">{r.points} pts</span>
                <span className="block font-mono text-[11px] text-text-secondary-light dark:text-text-secondary-dark">
                  {r.approved_resources} {r.approved_resources === 1 ? "resource" : "resources"} · {r.valid_reports} {r.valid_reports === 1 ? "report" : "reports"}
                </span>
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

export default function ContributePanel() {
  const auth = useAuth();
  const toast = useToast();
  const [board, setBoard] = useState<LeaderboardRow[] | null>(null);
  const [mine, setMine] = useState<Submission[]>([]);
  const [form, setForm] = useState<SubmissionForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  const loadMine = useCallback(async () => {
    const { data } = await listMySubmissions();
    setMine(data);
  }, []);

  const removeMine = async (s: Submission) => {
    if (!window.confirm(`Delete "${s.title}"? This cannot be undone.`)) return;
    const { error } = await deleteSubmission(s.id);
    if (error) toast.error(error);
    else {
      toast.success("Submission deleted.");
      loadMine();
    }
  };

  useEffect(() => {
    if (!auth.enabled) {
      setBoard([]);
      return;
    }
    listLeaderboard().then(setBoard);
  }, [auth.enabled]);

  useEffect(() => {
    if (auth.signedIn) loadMine();
    else setMine([]);
  }, [auth.signedIn, loadMine]);

  const set = <K extends keyof SubmissionForm>(key: K, value: SubmissionForm[K]) =>
    setForm((f) => ({ ...f, [key]: value, ...(key === "year" ? { subjectId: "" } : {}) }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validateSubmission(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setSending(true);
    const { error } = await createSubmission(form);
    setSending(false);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success("Submitted. It will appear on the site after review.");
    setForm(EMPTY_FORM);
    loadMine();
  };

  const subjects = getSubjectsForYear(form.year);

  return (
    <div>
      <section className="mb-10 max-w-2xl">
        <h2 className="font-sora font-bold text-headline-sm mb-3 text-on-surface dark:text-text-primary-dark">How it works</h2>
        <ol className="list-decimal pl-5 space-y-1.5 font-inter text-body-md text-text-secondary-light dark:text-text-secondary-dark">
          <li>Login / Sign up with your KKWagh email and send a link to your notes (Google Drive or any public link).</li>
          <li>Your submission goes to a review queue. Handwritten or AI-generated notes are both welcome.</li>
          <li>If it is approved it appears on the subject page with your name, and you get points based on how useful it is.</li>
          <li>Points are given by the admin only. You can also report broken links for 1 to 2 points each when the report is verified.</li>
        </ol>
      </section>

      <Leaderboard rows={board} />

      <section aria-labelledby="submit-heading" className="mb-12 max-w-2xl">
        <h2 id="submit-heading" className="font-sora font-bold text-headline-sm mb-4 text-on-surface dark:text-text-primary-dark">
          Submit a resource
        </h2>

        {!auth.enabled ? (
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            Contributions open soon. Login is not switched on yet.
          </p>
        ) : !auth.signedIn ? (
          <button
            onClick={auth.signIn}
            className="inline-flex items-center gap-2 min-h-[48px] px-6 rounded-xl bg-primary text-white font-semibold"
          >
            <LogIn size={18} aria-hidden="true" /> Login / Sign up to contribute
          </button>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-4">
            <p className="font-inter text-body-sm text-text-secondary-light dark:text-text-secondary-dark">
              Signed in as <strong>{auth.displayName}</strong>. Your name is shown next to approved resources.
            </p>

            <div>
              <label htmlFor="c-kind" className="block mb-1 font-semibold text-body-sm">What are you sharing?</label>
              <select id="c-kind" className={inputClass} value={form.kind} onChange={(e) => set("kind", e.target.value as SubmissionForm["kind"])}>
                <option value="resource">Subject notes or study resource</option>
                <option value="timetable">Exam or class timetable</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="c-year" className="block mb-1 font-semibold text-body-sm">Year</label>
                <select id="c-year" className={inputClass} value={form.year} onChange={(e) => set("year", e.target.value)} aria-invalid={!!errors.year}>
                  <option value="">Choose year</option>
                  {AVAILABLE_YEARS.map((y) => (
                    <option key={y} value={y}>{formatYearTitle(y)}</option>
                  ))}
                </select>
                {errors.year && <p className="mt-1 text-body-sm text-red-600">{errors.year}</p>}
              </div>
              {form.kind === "resource" && (
                <div>
                  <label htmlFor="c-subject" className="block mb-1 font-semibold text-body-sm">Subject</label>
                  <select id="c-subject" className={inputClass} value={form.subjectId} onChange={(e) => set("subjectId", e.target.value)} disabled={!form.year} aria-invalid={!!errors.subjectId}>
                    <option value="">Choose subject</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                  {errors.subjectId && <p className="mt-1 text-body-sm text-red-600">{errors.subjectId}</p>}
                </div>
              )}
            </div>

            {form.kind === "resource" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="c-unit" className="block mb-1 font-semibold text-body-sm">Unit (optional)</label>
                  <select id="c-unit" className={inputClass} value={form.unitNumber} onChange={(e) => set("unitNumber", e.target.value)}>
                    <option value="">Whole subject</option>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>Unit {n}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="c-type" className="block mb-1 font-semibold text-body-sm">Type of notes</label>
                  <select id="c-type" className={inputClass} value={form.noteType} onChange={(e) => set("noteType", e.target.value as NoteType)}>
                    {(Object.keys(NOTE_TYPE_LABELS) as NoteType[]).map((t) => (
                      <option key={t} value={t}>{NOTE_TYPE_LABELS[t]}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="c-title" className="block mb-1 font-semibold text-body-sm">Title</label>
              <input id="c-title" className={inputClass} value={form.title} maxLength={120} onChange={(e) => set("title", e.target.value)} placeholder="e.g. DBMS Unit 2 handwritten notes" aria-invalid={!!errors.title} />
              {errors.title && <p className="mt-1 text-body-sm text-red-600">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="c-url" className="block mb-1 font-semibold text-body-sm">Link</label>
              <input id="c-url" type="url" inputMode="url" className={inputClass} value={form.url} maxLength={500} onChange={(e) => set("url", e.target.value)} placeholder="https://drive.google.com/…  (set sharing to “Anyone with the link”)" aria-invalid={!!errors.url} />
              {errors.url && <p className="mt-1 text-body-sm text-red-600">{errors.url}</p>}
            </div>

            <div>
              <label htmlFor="c-desc" className="block mb-1 font-semibold text-body-sm">Short description (optional)</label>
              <textarea id="c-desc" className={`${inputClass} py-3 min-h-[96px]`} value={form.description} maxLength={500} onChange={(e) => set("description", e.target.value)} />
              {errors.description && <p className="mt-1 text-body-sm text-red-600">{errors.description}</p>}
            </div>

            <button type="submit" disabled={sending} className="inline-flex items-center gap-2 min-h-[48px] px-6 rounded-xl bg-primary text-white font-semibold disabled:opacity-60">
              <Send size={18} aria-hidden="true" /> {sending ? "Sending…" : "Submit for review"}
            </button>
          </form>
        )}
      </section>

      {auth.signedIn && (
        <section aria-labelledby="mine-heading" className="mb-12 max-w-2xl">
          <h2 id="mine-heading" className="font-sora font-bold text-headline-sm mb-4 text-on-surface dark:text-text-primary-dark">Your submissions</h2>
          {mine.length === 0 ? (
            <p className="text-text-secondary-light dark:text-text-secondary-dark">Nothing submitted yet.</p>
          ) : (
            <ul className="space-y-3">
              {mine.map((s) => (
                <li key={s.id} className="p-4 rounded-xl border border-border-light dark:border-border-dark bg-surface-container-lowest dark:bg-bg-dark">
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-sora font-semibold break-words min-w-0 text-on-surface dark:text-text-primary-dark">{s.title}</span>
                    <span className={`shrink-0 px-2.5 py-1 rounded-full text-[12px] font-semibold capitalize ${STATUS_STYLE[s.status]}`}>{s.status}</span>
                  </div>
                  {s.status === "approved" && <p className="mt-1 text-body-sm text-emerald-700 dark:text-emerald-300">+{s.points} points</p>}
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="mt-1 block text-body-sm underline break-all text-text-secondary-light dark:text-text-secondary-dark">{s.url}</a>
                  {s.admin_note && <p className="mt-1 text-body-sm text-text-secondary-light dark:text-text-secondary-dark">Admin note: {s.admin_note}</p>}
                  {(s.status === "pending" || auth.isAdmin) && (
                    <button type="button" onClick={() => removeMine(s)} className="mt-2 min-h-[44px] px-3 text-body-sm font-semibold border border-red-600 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/40">
                      Delete
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
