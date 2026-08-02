import {
  STORAGE_KEY,
  getTodayDateString,
  getStudyAnalytics,
  saveStudyAnalytics,
  clearStudyAnalytics,
  getWeeklyStudyAnalytics,
  recordSubjectStudyTime,
  type StudySessionRecord,
} from "@/hooks/useStudyTracker";

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
  writable: true,
});
Object.defineProperty(global, "window", {
  value: { localStorage: localStorageMock },
  writable: true,
});

describe("useStudyTracker & Study Analytics Utilities", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("getTodayDateString returns YYYY-MM-DD format", () => {
    const dateStr = getTodayDateString();
    expect(dateStr).toMatch(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/);
  });

  test("getStudyAnalytics returns empty array when storage is empty", () => {
    const analytics = getStudyAnalytics();
    expect(analytics).toEqual([]);
  });

  test("recordSubjectStudyTime saves and accumulates study time correctly", () => {
    const today = getTodayDateString();
    recordSubjectStudyTime("dbms", "Database Management System", "second-year", 120);

    let analytics = getStudyAnalytics();
    expect(analytics).toHaveLength(1);
    expect(analytics[0]).toEqual({
      date: today,
      subjectId: "dbms",
      subjectName: "Database Management System",
      year: "second-year",
      secondsSpent: 120,
    });

    // Accumulate time for the same subject
    recordSubjectStudyTime("dbms", "Database Management System", "second-year", 180);
    analytics = getStudyAnalytics();
    expect(analytics).toHaveLength(1);
    expect(analytics[0].secondsSpent).toBe(300);
  });

  test("getWeeklyStudyAnalytics filters records from the past 7 days", () => {
    const today = new Date();
    const records: StudySessionRecord[] = [];

    // Add 10 days of records
    for (let i = 0; i < 10; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      records.push({
        date: d.toISOString().split("T")[0],
        subjectId: "os",
        subjectName: "Operating Systems",
        year: "second-year",
        secondsSpent: 300,
      });
    }

    saveStudyAnalytics(records);

    const weekly = getWeeklyStudyAnalytics(7);
    expect(weekly.length).toBeLessThanOrEqual(7);
    expect(weekly.length).toBeGreaterThanOrEqual(6);
  });

  test("clearStudyAnalytics clears localStorage key", () => {
    recordSubjectStudyTime("math-1", "Maths 1", "first-year", 300);
    expect(getStudyAnalytics()).toHaveLength(1);

    clearStudyAnalytics();
    expect(getStudyAnalytics()).toEqual([]);
  });
});
