import { clampPoints, isHttpUrl, validateSubmission, getSubjectsForYear, type SubmissionForm } from "@/lib/contrib";

const base: SubmissionForm = {
  kind: "resource",
  year: "second-year",
  subjectId: "dbms",
  unitNumber: "1",
  title: "DBMS unit 1 notes",
  url: "https://drive.google.com/file/d/abc/view",
  noteType: "handwritten",
  description: "",
};

describe("contribution validation", () => {
  test("accepts a complete resource submission", () => {
    expect(validateSubmission(base)).toEqual({});
  });

  test("rejects non-http links, links with spaces and overlong links", () => {
    expect(isHttpUrl("https://drive.google.com/x")).toBe(true);
    expect(isHttpUrl("javascript:alert(1)")).toBe(false);
    expect(isHttpUrl("ftp://x.com/a")).toBe(false);
    expect(isHttpUrl("https://a.com/with space")).toBe(false);
    expect(isHttpUrl("https://a.com/" + "x".repeat(600))).toBe(false);
    expect(isHttpUrl("not a url")).toBe(false);
  });

  test("requires title, link and subject for resources", () => {
    const errors = validateSubmission({ ...base, title: "ab", url: "nope", subjectId: "" });
    expect(Object.keys(errors).sort()).toEqual(["subjectId", "title", "url"]);
  });

  test("timetables do not need a subject", () => {
    expect(validateSubmission({ ...base, kind: "timetable", subjectId: "" })).toEqual({});
  });

  test("clampPoints keeps admin points inside the allowed range", () => {
    expect(clampPoints("15", 100)).toBe(15);
    expect(clampPoints(500, 100)).toBe(100);
    expect(clampPoints(-4, 100)).toBe(0);
    expect(clampPoints("abc", 100)).toBe(0);
    expect(clampPoints(2.9, 2)).toBe(2);
  });

  test("lists subjects for a year from content/index.json", () => {
    expect(getSubjectsForYear("second-year").some((s) => s.id === "dbms")).toBe(true);
    expect(getSubjectsForYear("nope")).toEqual([]);
  });
});
