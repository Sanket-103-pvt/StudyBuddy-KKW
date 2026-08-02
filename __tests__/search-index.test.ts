import { buildSearchIndex, filterSearchIndex } from "@/lib/search-index";

describe("search-index utilities", () => {
  test("buildSearchIndex compiles a valid non-empty search index", () => {
    const index = buildSearchIndex();
    expect(Array.isArray(index)).toBe(true);
    expect(index.length).toBeGreaterThan(0);

    const subjects = index.filter((item) => item.type === "subject");
    const resources = index.filter((item) => item.type === "resource");

    expect(subjects.length).toBeGreaterThan(0);
    expect(resources.length).toBeGreaterThan(0);
  });

  test("filterSearchIndex filters subjects by query correctly", () => {
    const index = buildSearchIndex();
    const { subjects } = filterSearchIndex(index, "math");

    expect(subjects.length).toBeGreaterThan(0);
    subjects.forEach((subj) => {
      expect(subj.subjectName.toLowerCase()).toContain("math");
    });
  });

  test("filterSearchIndex filters resources by label or subject name", () => {
    const index = buildSearchIndex();
    const { resources } = filterSearchIndex(index, "notes");

    expect(resources.length).toBeGreaterThan(0);
    resources.forEach((res) => {
      const matchLabel = res.resourceLabel?.toLowerCase().includes("notes");
      const matchSubject = res.subjectName.toLowerCase().includes("notes");
      const matchUnit = res.unitTitle?.toLowerCase().includes("notes");
      expect(matchLabel || matchSubject || matchUnit).toBe(true);
    });
  });

  test("filterSearchIndex respects maxSubjects and maxResources parameters", () => {
    const index = buildSearchIndex();
    const { subjects, resources } = filterSearchIndex(index, "data", 2, 3);

    expect(subjects.length).toBeLessThanOrEqual(2);
    expect(resources.length).toBeLessThanOrEqual(3);
  });

  test("returns empty results for empty query", () => {
    const index = buildSearchIndex();
    const { subjects, resources } = filterSearchIndex(index, " ");

    expect(subjects).toEqual([]);
    expect(resources).toEqual([]);
  });
});
