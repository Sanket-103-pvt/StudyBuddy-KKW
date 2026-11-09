import { buildSearchIndex, filterSearchIndex, getSearchYears } from "@/lib/search-index";

describe("search-index utilities", () => {
  test("buildSearchIndex lists subjects of every year in content/index.json", () => {
    const index = buildSearchIndex();
    expect(index.length).toBeGreaterThan(0);
    expect(getSearchYears(index)).toEqual(expect.arrayContaining(["first-year", "second-year"]));
    index.forEach((item) => {
      expect(item.subjectId).toBeTruthy();
      expect(item.subjectName).toBeTruthy();
    });
  });

  test("filters subjects by name, case-insensitive", () => {
    const results = filterSearchIndex(buildSearchIndex(), "MATH");
    expect(results.length).toBeGreaterThan(0);
    results.forEach((r) => expect(r.subjectName.toLowerCase()).toContain("math"));
  });

  test("year filter restricts results", () => {
    const results = filterSearchIndex(buildSearchIndex(), "data", { year: "second-year" });
    expect(results.length).toBeGreaterThan(0);
    results.forEach((r) => expect(r.year).toBe("second-year"));
  });

  test("year filter alone lists that year's subjects", () => {
    const results = filterSearchIndex(buildSearchIndex(), "", { year: "first-year", limit: 50 });
    expect(results.length).toBeGreaterThan(5);
  });

  test("respects limit and returns nothing for empty query without year", () => {
    expect(filterSearchIndex(buildSearchIndex(), "a", { limit: 2 }).length).toBeLessThanOrEqual(2);
    expect(filterSearchIndex(buildSearchIndex(), "  ")).toEqual([]);
  });
});
