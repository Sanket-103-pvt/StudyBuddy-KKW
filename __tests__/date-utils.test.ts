import { isStale, isNew, getRelativeTime } from "../lib/date-utils";

describe("date-utils", () => {
  const getPastDateStr = (daysAgo: number): string => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split("T")[0];
  };

  const getFutureDateStr = (daysAhead: number): string => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split("T")[0];
  };

  describe("isStale", () => {
    it("returns true for a date 200 days ago (default threshold 180)", () => {
      expect(isStale(getPastDateStr(200))).toBe(true);
    });

    it("returns false for a date 100 days ago", () => {
      expect(isStale(getPastDateStr(100))).toBe(false);
    });

    it("returns false for null, undefined, or invalid dates", () => {
      expect(isStale(null)).toBe(false);
      expect(isStale(undefined)).toBe(false);
      expect(isStale("invalid-date")).toBe(false);
    });

    it("returns false for future dates", () => {
      expect(isStale(getFutureDateStr(10))).toBe(false);
    });
  });

  describe("isNew", () => {
    it("returns true for a date 10 days ago (default threshold 30)", () => {
      expect(isNew(getPastDateStr(10))).toBe(true);
    });

    it("returns false for a date 40 days ago", () => {
      expect(isNew(getPastDateStr(40))).toBe(false);
    });

    it("returns false for null, undefined, or invalid dates", () => {
      expect(isNew(null)).toBe(false);
      expect(isNew(undefined)).toBe(false);
      expect(isNew("invalid-date")).toBe(false);
    });

    it("returns false for future dates", () => {
      expect(isNew(getFutureDateStr(5))).toBe(false);
    });
  });

  describe("getRelativeTime", () => {
    it("returns 'today' for today's date", () => {
      expect(getRelativeTime(getPastDateStr(0))).toBe("today");
    });

    it("returns 'yesterday' for 1 day ago", () => {
      expect(getRelativeTime(getPastDateStr(1))).toBe("yesterday");
    });

    it("returns relative days for dates within 30 days", () => {
      expect(getRelativeTime(getPastDateStr(15))).toBe("15 days ago");
    });

    it("returns relative months for dates within a year", () => {
      expect(getRelativeTime(getPastDateStr(60))).toBe("2 months ago");
    });

    it("returns relative years for dates past a year", () => {
      expect(getRelativeTime(getPastDateStr(400))).toBe("1 year ago");
    });

    it("handles invalid dates and null/undefined gracefully", () => {
      expect(getRelativeTime(null)).toBe("Unknown");
      expect(getRelativeTime(undefined)).toBe("Unknown");
      expect(getRelativeTime("not-a-date")).toBe("not-a-date");
    });

    it("returns 'just now' for future dates", () => {
      expect(getRelativeTime(getFutureDateStr(2))).toBe("just now");
    });
  });
});
