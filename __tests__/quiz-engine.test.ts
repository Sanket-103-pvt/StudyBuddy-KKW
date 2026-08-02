import {
  getHighScore,
  saveQuizScore,
  formatQuizTime,
  type QuizScoreRecord,
} from "@/lib/quiz-utils";

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
  value: {
    localStorage: localStorageMock,
    dispatchEvent: () => true,
  },
  writable: true,
});

describe("Quiz Engine Utilities", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe("formatQuizTime", () => {
    test("formats 0 seconds correctly as 00:00", () => {
      expect(formatQuizTime(0)).toBe("00:00");
    });

    test("formats under one minute correctly", () => {
      expect(formatQuizTime(45)).toBe("00:45");
    });

    test("formats minutes and seconds correctly", () => {
      expect(formatQuizTime(125)).toBe("02:05");
    });
  });

  describe("getHighScore & saveQuizScore", () => {
    test("returns 0 when no high score is recorded", () => {
      expect(getHighScore("dsa")).toBe(0);
    });

    test("saves and updates high score correctly when higher score is achieved", () => {
      const record1: QuizScoreRecord = {
        subjectId: "dsa",
        subjectName: "Data Structures",
        scorePercentage: 60,
        correctAnswersCount: 3,
        totalQuestionsCount: 5,
        timeSpentSeconds: 90,
        completedAt: new Date().toISOString(),
      };

      saveQuizScore(record1);
      expect(getHighScore("dsa")).toBe(60);

      const record2: QuizScoreRecord = {
        subjectId: "dsa",
        subjectName: "Data Structures",
        scorePercentage: 100,
        correctAnswersCount: 5,
        totalQuestionsCount: 5,
        timeSpentSeconds: 60,
        completedAt: new Date().toISOString(),
      };

      saveQuizScore(record2);
      expect(getHighScore("dsa")).toBe(100);
    });

    test("does not lower high score on lower quiz attempt", () => {
      saveQuizScore({
        subjectId: "dsa",
        subjectName: "Data Structures",
        scorePercentage: 80,
        correctAnswersCount: 4,
        totalQuestionsCount: 5,
        timeSpentSeconds: 60,
        completedAt: new Date().toISOString(),
      });

      saveQuizScore({
        subjectId: "dsa",
        subjectName: "Data Structures",
        scorePercentage: 40,
        correctAnswersCount: 2,
        totalQuestionsCount: 5,
        timeSpentSeconds: 50,
        completedAt: new Date().toISOString(),
      });

      expect(getHighScore("dsa")).toBe(80);
    });
  });
});
