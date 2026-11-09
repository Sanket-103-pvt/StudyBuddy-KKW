import { daysUntil, sortExams } from "@/lib/countdown-utils";

describe("countdown-utils", () => {
  const today = new Date(2026, 10, 9); // 9 Nov 2026

  test("counts whole days, including today and past dates", () => {
    expect(daysUntil("2026-11-09", today)).toBe(0);
    expect(daysUntil("2026-11-10", today)).toBe(1);
    expect(daysUntil("2026-12-09", today)).toBe(30);
    expect(daysUntil("2026-11-08", today)).toBe(-1);
  });

  test("returns NaN for malformed dates", () => {
    expect(daysUntil("nope", today)).toBeNaN();
  });

  test("sorts exams by date ascending", () => {
    const sorted = sortExams([
      { id: "2", name: "B", date: "2026-12-01" },
      { id: "1", name: "A", date: "2026-11-20" },
    ]);
    expect(sorted.map((e) => e.id)).toEqual(["1", "2"]);
  });
});
