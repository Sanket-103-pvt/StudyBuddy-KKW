// Exam countdown helpers. Everything is stored locally in the browser.

export interface ExamEntry {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
}

export const EXAMS_KEY = "sb_exams";

/** Whole days from `today` to `date` (YYYY-MM-DD). 0 = today, negative = past. */
export function daysUntil(date: string, today: Date = new Date()): number {
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m || !d) return NaN;
  const target = Date.UTC(y, m - 1, d);
  const now = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((target - now) / 86_400_000);
}

export function loadExams(): ExamEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(EXAMS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((e) => e && typeof e.name === "string" && /^\d{4}-\d{2}-\d{2}$/.test(e.date))
      : [];
  } catch {
    return [];
  }
}

export function saveExams(exams: ExamEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(EXAMS_KEY, JSON.stringify(exams));
  } catch {
    /* storage unavailable (private mode / full) */
  }
}

export function sortExams(exams: ExamEntry[]): ExamEntry[] {
  return exams.slice().sort((a, b) => a.date.localeCompare(b.date));
}
