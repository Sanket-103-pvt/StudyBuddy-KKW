// SGPA / CGPA rules follow the K. K. Wagh grade card (Table 2: grades, Table 3: class awarded):
//   SGPA = sum(credits x grade point) / sum(credits) for one semester
//   CGPA = sum(credits x grade point) / sum(credits) over all semesters
// Non-countable courses (audit and pass/not-passed courses) are left out of both.

export interface GradeOption {
  grade: string;
  point: number;
  label: string;
  /** Non-countable credit course: not part of SGPA or CGPA. */
  nonCountable?: boolean;
}

export const KKW_GRADE_SCALE: GradeOption[] = [
  { grade: "O", point: 10, label: "O (90-100%, Outstanding)" },
  { grade: "A", point: 9, label: "A (80-89%, Excellent)" },
  { grade: "B", point: 8, label: "B (70-79%, Very Good)" },
  { grade: "C", point: 7, label: "C (60-69%, Good)" },
  { grade: "D", point: 6, label: "D (50-59%, Average)" },
  { grade: "E", point: 5, label: "E (40-49%, Below Average)" },
  { grade: "F", point: 0, label: "F (below 40%, Fail)" },
  { grade: "FX", point: 0, label: "FX (Detained, repeat the course)" },
  { grade: "AB", point: 0, label: "AB (Absent)" },
  { grade: "IC", point: 0, label: "IC (Incomplete course)" },
  { grade: "AC", point: 0, label: "AC (Audit course completed, not counted)", nonCountable: true },
  { grade: "ACN", point: 0, label: "ACN (Audit course not completed, not counted)", nonCountable: true },
  { grade: "PP", point: 0, label: "PP (Passed, non-audit, not counted)", nonCountable: true },
  { grade: "NP", point: 0, label: "NP (Not passed, non-audit, not counted)", nonCountable: true },
];

/** Grades that mean the credits were not earned (so the college would not print an SGPA). */
const NOT_PASSED = new Set(["F", "FX", "AB", "IC"]);

export const MAX_SEMESTERS = 8;
export const MAX_SUBJECTS_PER_SEMESTER = 20;

export interface SubjectEntry {
  id: string;
  name: string;
  credits: number;
  /** "" means no grade chosen yet; such a row is ignored. */
  grade: string;
}

export interface SemesterEntry {
  semNumber: number;
  subjects: SubjectEntry[];
}

export interface CalculatorData {
  semesters: SemesterEntry[];
  studentName: string;
  prn: string;
}

export interface KKWClassResult {
  className: string;
  description: string;
}

interface Totals {
  totalCredits: number;
  earnedCredits: number;
  gradePoints: number;
}

function sumSubjects(subjects: SubjectEntry[], into: Totals): void {
  subjects.forEach((subj) => {
    const gradeObj = KKW_GRADE_SCALE.find((g) => g.grade === subj.grade);
    if (!gradeObj || gradeObj.nonCountable) return;
    if (!(subj.credits > 0)) return;
    into.totalCredits += subj.credits;
    if (gradeObj.point > 0) into.earnedCredits += subj.credits;
    into.gradePoints += subj.credits * gradeObj.point;
  });
}

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/** SGPA of one semester. Rows without a grade or credits are ignored. */
export function calculateSGPA(subjects: SubjectEntry[]): { sgpa: number; totalCredits: number; earnedCredits: number } {
  const t: Totals = { totalCredits: 0, earnedCredits: 0, gradePoints: 0 };
  sumSubjects(subjects, t);
  return {
    sgpa: t.totalCredits > 0 ? round2(t.gradePoints / t.totalCredits) : 0,
    totalCredits: t.totalCredits,
    earnedCredits: t.earnedCredits,
  };
}

/** CGPA over all semesters: total credit points divided by total credits (not an average of SGPAs). */
export function calculateCGPA(semesters: SemesterEntry[]): { cgpa: number; totalCredits: number; earnedCredits: number } {
  const t: Totals = { totalCredits: 0, earnedCredits: 0, gradePoints: 0 };
  semesters.forEach((sem) => sumSubjects(sem.subjects, t));
  return {
    cgpa: t.totalCredits > 0 ? round2(t.gradePoints / t.totalCredits) : 0,
    totalCredits: t.totalCredits,
    earnedCredits: t.earnedCredits,
  };
}

/** True when a counted subject has a failed, absent, detained or incomplete grade. */
export function hasUnclearedCourse(semesters: SemesterEntry[]): boolean {
  return semesters.some((sem) => sem.subjects.some((s) => s.credits > 0 && NOT_PASSED.has(s.grade)));
}

/** Class awarded from CGPA (Table 3 of the grade card). */
export function getKKWClassAwarded(cgpa: number): KKWClassResult {
  if (cgpa >= 7.75) return { className: "First Class with Distinction", description: "CGPA 7.75 or more" };
  if (cgpa >= 6.75) return { className: "First Class", description: "CGPA 6.75 or more but less than 7.75" };
  if (cgpa >= 6.25) return { className: "Higher Second Class", description: "CGPA 6.25 or more but less than 6.75" };
  if (cgpa >= 5.5) return { className: "Second Class", description: "CGPA 5.5 or more but less than 6.25" };
  if (cgpa >= 4.0) return { className: "Pass Class", description: "CGPA 4.0 or more but less than 5.5" };
  return { className: "Below pass class", description: "CGPA below 4.0" };
}

export function emptyCalculator(): CalculatorData {
  return { semesters: [{ semNumber: 1, subjects: [] }], studentName: "", prn: "" };
}

export function newSubject(): SubjectEntry {
  const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  return { id, name: "", credits: 3, grade: "" };
}

const KNOWN_GRADES = new Set(KKW_GRADE_SCALE.map((g) => g.grade));

/**
 * Turns saved data (from this device or from the account) into safe calculator data.
 * Anything that does not look right is dropped or clamped, so bad saved data can never break the page.
 */
export function parseCalculatorData(raw: unknown): CalculatorData | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  if (!Array.isArray(obj.semesters)) return null;

  const semesters: SemesterEntry[] = [];
  for (const s of obj.semesters.slice(0, MAX_SEMESTERS)) {
    if (!s || typeof s !== "object" || !Array.isArray((s as { subjects?: unknown }).subjects)) continue;
    const subjects: SubjectEntry[] = [];
    for (const r of (s as { subjects: unknown[] }).subjects.slice(0, MAX_SUBJECTS_PER_SEMESTER)) {
      if (!r || typeof r !== "object") continue;
      const row = r as Record<string, unknown>;
      const credits = typeof row.credits === "number" && isFinite(row.credits) ? Math.min(Math.max(row.credits, 0), 10) : 0;
      const grade = typeof row.grade === "string" && KNOWN_GRADES.has(row.grade) ? row.grade : "";
      subjects.push({
        id: typeof row.id === "string" && row.id ? row.id.slice(0, 64) : newSubject().id,
        name: typeof row.name === "string" ? row.name.slice(0, 80) : "",
        credits,
        grade,
      });
    }
    semesters.push({ semNumber: semesters.length + 1, subjects });
  }
  if (semesters.length === 0) return null;

  return {
    semesters,
    studentName: typeof obj.studentName === "string" ? obj.studentName.slice(0, 80) : "",
    prn: typeof obj.prn === "string" ? obj.prn.slice(0, 30) : "",
  };
}

/** True when the student has typed anything worth keeping. */
export function hasUserData(data: CalculatorData): boolean {
  return data.studentName.trim() !== "" || data.prn.trim() !== "" || data.semesters.some((s) => s.subjects.length > 0);
}
