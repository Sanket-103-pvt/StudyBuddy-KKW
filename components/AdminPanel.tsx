"use client";

import React, { useCallback, useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ToastProvider";
import {
  NOTE_TYPE_LABELS,
  clampPoints,
  listDailyVisits,
  listOpenReports,
  listPendingSubmissions,
  listApprovedSubmissions,
  deleteSubmission,
  reviewReport,
  reviewSubmission,
  type DailyVisit,
  type LinkReport,
  type Submission,
} from "@/lib/contrib";
import { formatYearTitle } from "@/lib/year-utils";

const field = "min-h-[44px] px-3 rounded-lg border border-border-light dark:border-border-dark bg-surface-container-lowest dark:bg-bg-dark text-on-surface dark:text-text-primary-dark";

function VisitsCard() {
  const [days, setDays] = useState<DailyVisit[] | null>(null);
  useEffect(() => {
    listDailyVisits(14).then((r) => setDays(r.data));
  }, []);
  if (!days) return null;
  const total = days.reduce((n, d) => n + d.visits, 0);
  const today = days[days.length - 1]?.visits ?? 0;
  const week = days.slice(-7).reduce((n, d) => n + d.visits, 0);
  const max = Math.max(1, ...days.map((d) => d.visits));
  return (
    <section aria-labelledby="visits-heading">
      <h2 id="visits-heading" className="font-sora font-bold text-headline-sm mb-4">Visits</h2>
      <div className="grid grid-cols-3 gap-3 max-w-xl mb-4">
        {[["Today", today], ["Last 7 days", week], ["Last 14 days", total]].map(([label, n]) => (
          <div key={label as string} className="p-4 rounded-xl border border-border-light dark:border-border-dark bg-surface-container-lowest dark:bg-bg-dark">
            <div className="font-sora font-bold text-2xl">{Number(n).toLocaleString("en-IN")}</div>
            <div className="text-body-sm text-text-secondary-light dark:text-text-secondary-dark">{label as string}</div>
          </div>
        ))}
      </div>
      <div className="flex items-end gap-1.5 h-28 max-w-xl" role="img" aria-label="Visits per day for the last 14 days">
        {days.map((d) => (
          <div key={d.day} className="flex-1 flex flex-col justify-end h-full" title={`${d.day}: ${d.visits}`}>
            <div className="w-full rounded-t bg-primary" style={{ height: `${Math.max(2, (d.visits / max) * 100)}%` }} />
          </div>
        ))}
      </div>
      <p className="text-[12px] text-text-secondary-light dark:text-text-secondary-dark mt-2">One count per browser per day. Not bot-filtered.</p>
    </section>
  );
}

function SubmissionCard({ s, onDone }: { s: Submission; onDone: () => void }) {
  const toast = useToast();
  const [points, setPoints] = useState("10");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const decide = async (status: "approved" | "rejected") => {
    setBusy(true);
    const { error } = await reviewSubmission(s.id, { status, points: clampPoints(points, 100), note });
    setBusy(false);
    if (error) toast.error(error);
    else {
      toast.success(status === "approved" ? "Approved" : "Rejected");
      onDone();
    }
  };

  return (
    <li className="p-4 rounded-xl border border-border-light dark:border-border-dark bg-surface-container-lowest dark:bg-bg-dark space-y-3">
      <div>
        <div className="font-sora font-semibold text-on-surface dark:text-text-primary-dark break-words">{s.title}</div>
        <div className="font-mono text-[12px] text-text-secondary-light dark:text-text-secondary-dark">
          {s.profiles?.display_name ?? "Unknown"} · {s.kind} · {formatYearTitle(s.year)}
          {s.subject_id ? ` · ${s.subject_id}` : ""}
          {s.unit_number ? ` · Unit ${s.unit_number}` : ""} · {NOTE_TYPE_LABELS[s.note_type]}
        </div>
        {s.description && <p className="mt-1 text-body-sm text-text-secondary-light dark:text-text-secondary-dark">{s.description}</p>}
        <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-1 text-primary dark:text-primary-fixed-dim underline break-all">
          Open link <ExternalLink size={13} aria-hidden="true" />
        </a>
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-body-sm font-semibold">
          Points (0 to 100)
          <input type="number" min={0} max={100} value={points} onChange={(e) => setPoints(e.target.value)} className={`${field} block w-28 mt-1`} />
        </label>
        <label className="text-body-sm font-semibold flex-1 min-w-[180px]">
          Note to contributor (optional)
          <input value={note} maxLength={300} onChange={(e) => setNote(e.target.value)} className={`${field} block w-full mt-1`} />
        </label>
      </div>
      <div className="flex gap-3">
        <button disabled={busy} onClick={() => decide("approved")} className="min-h-[44px] px-5 rounded-lg bg-emerald-600 text-white font-semibold disabled:opacity-60">Approve</button>
        <button disabled={busy} onClick={() => decide("rejected")} className="min-h-[44px] px-5 rounded-lg border border-red-500 text-red-600 dark:text-red-400 font-semibold disabled:opacity-60">Reject</button>
      </div>
    </li>
  );
}

function ReportCard({ r, onDone }: { r: LinkReport; onDone: () => void }) {
  const toast = useToast();
  const [points, setPoints] = useState("1");
  const [busy, setBusy] = useState(false);

  const decide = async (status: "valid" | "invalid") => {
    setBusy(true);
    const { error } = await reviewReport(r.id, { status, points: clampPoints(points, 2) });
    setBusy(false);
    if (error) toast.error(error);
    else {
      toast.success(status === "valid" ? "Marked valid" : "Marked invalid");
      onDone();
    }
  };

  return (
    <li className="p-4 rounded-xl border border-border-light dark:border-border-dark bg-surface-container-lowest dark:bg-bg-dark space-y-3">
      <div>
        <div className="font-sora font-semibold text-on-surface dark:text-text-primary-dark break-words">{r.resource_label ?? r.url}</div>
        <div className="font-mono text-[12px] text-text-secondary-light dark:text-text-secondary-dark">
          {r.profiles?.display_name ?? "Unknown"} · {r.subject_id}
        </div>
        {r.reason && <p className="mt-1 text-body-sm">{r.reason}</p>}
        <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-1 text-primary dark:text-primary-fixed-dim underline break-all">
          Open link <ExternalLink size={13} aria-hidden="true" />
        </a>
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-body-sm font-semibold">
          Points (0 to 2)
          <input type="number" min={0} max={2} value={points} onChange={(e) => setPoints(e.target.value)} className={`${field} block w-24 mt-1`} />
        </label>
        <button disabled={busy} onClick={() => decide("valid")} className="min-h-[44px] px-5 rounded-lg bg-emerald-600 text-white font-semibold disabled:opacity-60">Link is broken</button>
        <button disabled={busy} onClick={() => decide("invalid")} className="min-h-[44px] px-5 rounded-lg border border-border-light dark:border-border-dark font-semibold disabled:opacity-60">Link works</button>
      </div>
    </li>
  );
}

function ApprovedCard({ s, onDone }: { s: Submission; onDone: () => void }) {
  const toast = useToast();
  const remove = async () => {
    const who = s.profiles?.display_name ?? "the contributor";
    if (!window.confirm(`Delete "${s.title}"? It disappears from the site and ${s.points} points are removed from ${who}. This cannot be undone.`)) return;
    const { error } = await deleteSubmission(s.id);
    if (error) toast.error(error);
    else {
      toast.success("Deleted. Points removed.");
      onDone();
    }
  };
  return (
    <li className="p-4 border border-border-light dark:border-border-dark">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-sora font-semibold break-words">{s.title}</p>
          <p className="font-mono text-[11px] text-text-secondary-light dark:text-text-secondary-dark">
            {s.kind} · {s.year} · by {s.profiles?.display_name ?? "Unknown"} · {s.points} points
          </p>
          <a href={s.url} target="_blank" rel="noopener noreferrer" className="block mt-1 text-body-sm underline break-all">{s.url}</a>
        </div>
        <button type="button" onClick={remove} className="shrink-0 min-h-[44px] px-3 text-body-sm font-semibold border border-red-600 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/40">
          Delete
        </button>
      </div>
    </li>
  );
}

export default function AdminPanel() {
  const auth = useAuth();
  const [subs, setSubs] = useState<Submission[]>([]);
  const [approved, setApproved] = useState<Submission[]>([]);
  const [reports, setReports] = useState<LinkReport[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [s, r, a] = await Promise.all([listPendingSubmissions(), listOpenReports(), listApprovedSubmissions()]);
    setSubs(s.data);
    setApproved(a.data);
    setReports(r.data);
    setError(s.error ?? r.error ?? a.error);
  }, []);

  useEffect(() => {
    if (auth.isAdmin) load();
  }, [auth.isAdmin, load]);

  if (!auth.enabled) return <p>Login is not configured (missing Supabase environment variables).</p>;
  if (auth.loading) return <p>Loading…</p>;
  if (!auth.signedIn) {
    return (
      <button onClick={auth.signIn} className="min-h-[48px] px-6 rounded-xl bg-primary text-white font-semibold">
        Login / Sign up
      </button>
    );
  }
  if (!auth.isAdmin) return <p>This page is only for the site admin.</p>;

  return (
    <div className="space-y-12">
      {error && <p className="text-red-600">{error}</p>}
      <VisitsCard />
      <section aria-labelledby="pending-heading">
        <h2 id="pending-heading" className="font-sora font-bold text-headline-sm mb-4">Submissions to review ({subs.length})</h2>
        {subs.length === 0 ? <p className="text-text-secondary-light dark:text-text-secondary-dark">Nothing waiting.</p> : (
          <ul className="space-y-4 max-w-3xl">{subs.map((s) => <SubmissionCard key={s.id} s={s} onDone={load} />)}</ul>
        )}
      </section>
      <section aria-labelledby="approved-heading">
        <h2 id="approved-heading" className="font-sora font-bold text-headline-sm mb-4">Approved submissions ({approved.length})</h2>
        {approved.length === 0 ? <p className="text-text-secondary-light dark:text-text-secondary-dark">Nothing approved yet.</p> : (
          <ul className="space-y-3 max-w-3xl">{approved.map((s) => <ApprovedCard key={s.id} s={s} onDone={load} />)}</ul>
        )}
      </section>
      <section aria-labelledby="reports-heading">
        <h2 id="reports-heading" className="font-sora font-bold text-headline-sm mb-4">Broken link reports ({reports.length})</h2>
        {reports.length === 0 ? <p className="text-text-secondary-light dark:text-text-secondary-dark">No open reports.</p> : (
          <ul className="space-y-4 max-w-3xl">{reports.map((r) => <ReportCard key={r.id} r={r} onDone={load} />)}</ul>
        )}
      </section>
    </div>
  );
}
