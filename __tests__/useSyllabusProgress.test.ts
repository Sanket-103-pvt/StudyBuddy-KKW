import {
  getSubjectProgress,
  saveSubjectProgress,
  calculateProgressPercentage,
  getOverallProgressSummary,
  type SubjectProgress,
} from "@/hooks/useSyllabusProgress";

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
    key: (index: number) => Object.keys(store)[index] || null,
    get length() {
      return Object.keys(store).length;
    },
  };
})();

Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
  writable: true,
});

Object.defineProperty(global, "window", {
  value: {
    localStorage: localStorageMock,
    dispatchEvent: () => true,
  },
  writable: true,
});

describe("useSyllabusProgress utilities", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe("calculateProgressPercentage", () => {
    test("calculates 0% when completed count is 0", () => {
      expect(calculateProgressPercentage(0, 6)).toBe(0);
    });

    test("calculates correct percentage for partial completion", () => {
      expect(calculateProgressPercentage(3, 6)).toBe(50);
      expect(calculateProgressPercentage(1, 3)).toBe(33);
      expect(calculateProgressPercentage(2, 6)).toBe(33);
    });

    test("calculates 100% when all units are completed", () => {
      expect(calculateProgressPercentage(6, 6)).toBe(100);
    });

    test("handles edge case when totalUnits is 0", () => {
      expect(calculateProgressPercentage(2, 0)).toBe(0);
    });
  });

  describe("getSubjectProgress & saveSubjectProgress", () => {
    test("returns empty arrays when no progress is saved", () => {
      const progress = getSubjectProgress("dsa");
      expect(progress.completedUnits).toEqual([]);
      expect(progress.completedResources).toEqual([]);
    });

    test("saves and retrieves subject progress correctly", () => {
      const data: SubjectProgress = {
        completedUnits: [1, 3],
        completedResources: ["https://drive.google.com/file/1"],
      };

      saveSubjectProgress("dsa", data);

      const retrieved = getSubjectProgress("dsa");
      expect(retrieved.completedUnits).toEqual([1, 3]);
      expect(retrieved.completedResources).toEqual([
        "https://drive.google.com/file/1",
      ]);
      expect(retrieved.lastUpdated).toBeDefined();
    });
  });

  describe("getOverallProgressSummary", () => {
    test("returns empty summary when no subjects tracked", () => {
      const summary = getOverallProgressSummary();
      expect(summary.totalSubjectsTracked).toBe(0);
      expect(summary.overallPercentage).toBe(0);
      expect(summary.subjectSummaries).toEqual([]);
    });

    test("calculates overall progress summary across multiple subjects", () => {
      saveSubjectProgress("dsa", {
        completedUnits: [1, 2, 3],
        completedResources: [],
      });
      localStorage.setItem(
        "sb_progress_meta_dsa",
        JSON.stringify({ subjectName: "Data Structures", totalUnits: 6 })
      );

      saveSubjectProgress("dbms", {
        completedUnits: [1, 2, 3, 4, 5, 6],
        completedResources: [],
      });
      localStorage.setItem(
        "sb_progress_meta_dbms",
        JSON.stringify({ subjectName: "DBMS", totalUnits: 6 })
      );

      const summary = getOverallProgressSummary();
      expect(summary.totalSubjectsTracked).toBe(2);
      expect(summary.totalCompletedUnits).toBe(9);
      expect(summary.totalUnitsTracked).toBe(12);
      expect(summary.overallPercentage).toBe(75);
    });
  });
});
