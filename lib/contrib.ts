// Contribution workflow: types, validation and database calls.
// All permission checks are enforced by Row Level Security in supabase/schema.sql;
// the validation here only gives students friendly messages before the request is sent.

import indexData from "@/content/index.json";
import { getSupabase, publicSelect } from "@/lib/supabase";

export type SubmissionKind = "resource" | "timetable";
export type NoteType = "handwritten" | "typed" | "ai_generated" | "other";
export type ReviewStatus = "pending" | "approved" | "rejected";

export const NOTE_TYPE_LABELS: Record<NoteType, string> = {
  handwritten: "Handwritten notes",
  typed: "Typed notes",
  ai_generated: "AI-generated notes",
  other: "Other",
};

export interface SubmissionForm {
  kind: SubmissionKind;
  year: string;
  subjectId: string;
  unitNumber: string; // "" = whole subject
  title: string;
  url: string;
  noteType: NoteType;
  description: string;
}

export interface Submission {
  id: string;
  kind: SubmissionKind;
  year: string;
  subject_id: string | null;
  unit_number: number | null;
  title: string;
  url: string;
  note_type: NoteType;
  description: string | null;
  status: ReviewStatus;
  points: number;
  admin_note: string | null;
  created_at: string;
  profiles?: { display_name: string } | null;
}

export interface LinkReport {
  id: string;
  subject_id: string;
  resource_label: string | null;
  url: string;
  reason: string | null;
  status: "open" | "valid" | "invalid";
  points: number;
  created_at: string;
  profiles?: { display_name: string } | null;
}

export interface CommunityResource {
  id: string;
  year: string;
  subject_id: string;
  unit_number: number | null;
  title: string;
  url: string;
  note_type: NoteType;
  description: string | null;
  contributor_name: string;
}

export interface CommunityTimetable {
  id: string;
  year: string;
  title: string;
  url: string;
  contributor_name: string;
}

export interface LeaderboardRow {
  display_name: string;
  points: number;
  approved_resources: number;
  valid_reports: number;
}

// ── Validation (pure, unit-tested) ──────────────────────────────────────────────

export function isHttpUrl(value: string): boolean {
  if (value.length > 500 || /\s/.test(value)) return false;
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateSubmission(form: SubmissionForm): Record<string, string> {
  const errors: Record<string, string> = {};
  const title = form.title.trim();
  if (title.length < 3 || title.length > 120) errors.title = "Title must be 3 to 120 characters.";
  if (!isHttpUrl(form.url.trim())) errors.url = "Enter a full link starting with https://";
  if (!form.year) errors.year = "Choose a year.";
  if (form.kind === "resource" && !form.subjectId) errors.subjectId = "Choose a subject.";
  if (form.description.trim().length > 500) errors.description = "Keep the description under 500 characters.";
  return errors;
}

/** Admin points are always a whole number inside the allowed range. */
export function clampPoints(value: string | number, max: number): number {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(n, max);
}

// ── Subjects for the form dropdowns (from content/index.json) ───────────────────

export function getSubjectsForYear(year: string): { id: string; name: string }[] {
  const list = (indexData as Record<string, { id: string; name: string }[]>)[year] ?? [];
  return list.map(({ id, name }) => ({ id, name }));
}

export const AVAILABLE_YEARS = Object.keys(indexData);

// ── Database calls ──────────────────────────────────────────────────────────────

type Result<T> = { data: T; error: string | null };

function fail<T>(empty: T, message: string): Result<T> {
  return { data: empty, error: message };
}

const NOT_CONFIGURED = "Login is not set up yet.";

export async function createSubmission(form: SubmissionForm): Promise<{ error: string | null }> {
  const sb = await getSupabase();
  if (!sb) return { error: NOT_CONFIGURED };
  const { error } = await sb.from("submissions").insert({
    kind: form.kind,
    year: form.year,
    subject_id: form.kind === "resource" ? form.subjectId : null,
    unit_number: form.unitNumber ? Number(form.unitNumber) : null,
    title: form.title.trim(),
    url: form.url.trim(),
    note_type: form.noteType,
    description: form.description.trim() || null,
  });
  if (error) {
    // The database refuses a 11th pending submission (spam brake).
    return { error: "Could not submit. You may already have 10 submissions waiting for review." };
  }
  return { error: null };
}

export async function listMySubmissions(): Promise<Result<Submission[]>> {
  const sb = await getSupabase();
  if (!sb) return fail([], NOT_CONFIGURED);
  const { data, error } = await sb.from("submissions").select("*").order("created_at", { ascending: false }).limit(50);
  return { data: (data as Submission[]) ?? [], error: error ? "Could not load your submissions." : null };
}

export async function createLinkReport(input: {
  subjectId: string;
  label: string;
  url: string;
  reason: string;
}): Promise<{ error: string | null; duplicate?: boolean }> {
  const sb = await getSupabase();
  if (!sb) return { error: NOT_CONFIGURED };
  const { error } = await sb.from("link_reports").insert({
    subject_id: input.subjectId,
    resource_label: input.label.slice(0, 200),
    url: input.url,
    reason: input.reason.trim().slice(0, 300) || null,
  });
  if (error?.code === "23505") return { error: null, duplicate: true };
  return { error: error ? "Could not send the report. Please try again." : null };
}

export async function listCommunityResources(subjectId: string): Promise<CommunityResource[]> {
  return publicSelect<CommunityResource>("community_resources", {
    select: "id,year,subject_id,unit_number,title,url,note_type,description,contributor_name",
    subject_id: `eq.${subjectId}`,
    order: "created_at.desc",
    limit: "50",
  });
}

export async function listCommunityTimetables(): Promise<CommunityTimetable[]> {
  return publicSelect<CommunityTimetable>("community_timetables", {
    select: "id,year,title,url,contributor_name",
    order: "created_at.desc",
    limit: "50",
  });
}

export async function listLeaderboard(): Promise<LeaderboardRow[]> {
  return publicSelect<LeaderboardRow>("leaderboard", {
    select: "display_name,points,approved_resources,valid_reports",
    limit: "50",
  });
}

// ── Admin ───────────────────────────────────────────────────────────────────────

export async function checkIsAdmin(): Promise<boolean> {
  const sb = await getSupabase();
  if (!sb) return false;
  const { data, error } = await sb.rpc("is_admin");
  return !error && data === true;
}

export async function listPendingSubmissions(): Promise<Result<Submission[]>> {
  const sb = await getSupabase();
  if (!sb) return fail([], NOT_CONFIGURED);
  const { data, error } = await sb
    .from("submissions")
    .select("*, profiles(display_name)")
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(100);
  return { data: (data as unknown as Submission[]) ?? [], error: error ? "Could not load submissions." : null };
}

export async function reviewSubmission(
  id: string,
  decision: { status: "approved" | "rejected"; points: number; note: string }
): Promise<{ error: string | null }> {
  const sb = await getSupabase();
  if (!sb) return { error: NOT_CONFIGURED };
  const { error } = await sb
    .from("submissions")
    .update({
      status: decision.status,
      points: decision.status === "approved" ? clampPoints(decision.points, 100) : 0,
      admin_note: decision.note.trim().slice(0, 300) || null,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id);
  return { error: error ? "Could not save the review." : null };
}

export async function listOpenReports(): Promise<Result<LinkReport[]>> {
  const sb = await getSupabase();
  if (!sb) return fail([], NOT_CONFIGURED);
  const { data, error } = await sb
    .from("link_reports")
    .select("*, profiles(display_name)")
    .eq("status", "open")
    .order("created_at", { ascending: true })
    .limit(100);
  return { data: (data as unknown as LinkReport[]) ?? [], error: error ? "Could not load reports." : null };
}

export async function reviewReport(
  id: string,
  decision: { status: "valid" | "invalid"; points: number }
): Promise<{ error: string | null }> {
  const sb = await getSupabase();
  if (!sb) return { error: NOT_CONFIGURED };
  const { error } = await sb
    .from("link_reports")
    .update({
      status: decision.status,
      points: decision.status === "valid" ? clampPoints(decision.points, 2) : 0,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id);
  return { error: error ? "Could not save the review." : null };
}

export interface DailyVisit {
  day: string;
  visits: number;
}

export async function listDailyVisits(days = 14): Promise<Result<DailyVisit[]>> {
  const sb = await getSupabase();
  if (!sb) return fail([], NOT_CONFIGURED);
  const { data, error } = await sb.rpc("admin_daily_visits", { days });
  if (error) return fail([], error.message);
  return { data: (data ?? []) as DailyVisit[], error: null };
}
