import {
  calculateSGPA,
  calculateCGPA,
  getKKWClassAwarded,
  hasUnclearedCourse,
  parseCalculatorData,
  hasUserData,
  emptyCalculator,
  type SubjectEntry,
} from "@/lib/calculator-utils";

describe("KKWIEER SGPA / CGPA calculator", () => {
  test("SGPA is credit-weighted and ignores audit and ungraded rows", () => {
    const subjects: SubjectEntry[] = [
      { id: "1", name: "A", credits: 4, grade: "O" }, // 40
      { id: "2", name: "B", credits: 4, grade: "A" }, // 36
      { id: "3", name: "C", credits: 3, grade: "B" }, // 24
      { id: "4", name: "D", credits: 3, grade: "C" }, // 21
      { id: "5", name: "Audit", credits: 2, grade: "AC" },
      { id: "6", name: "Not graded yet", credits: 3, grade: "" },
    ];
    const r = calculateSGPA(subjects); // 121 / 14
    expect(r.sgpa).toBe(8.64);
    expect(r.totalCredits).toBe(14);
    expect(r.earnedCredits).toBe(14);
  });

  test("a failed course counts its credits with 0 points but earns none", () => {
    const r = calculateSGPA([
      { id: "1", name: "A", credits: 4, grade: "A" }, // 36
      { id: "2", name: "B", credits: 4, grade: "F" }, // 0
    ]);
    expect(r.sgpa).toBe(4.5);
    expect(r.totalCredits).toBe(8);
    expect(r.earnedCredits).toBe(4);
  });

  test("grade card points: O=10 A=9 B=8 C=7 D=6 E=5 F=0", () => {
    const pts = (g: string) => calculateSGPA([{ id: "x", name: "", credits: 1, grade: g }]).sgpa;
    expect([pts("O"), pts("A"), pts("B"), pts("C"), pts("D"), pts("E"), pts("F")]).toEqual([10, 9, 8, 7, 6, 5, 0]);
  });

  test("CGPA is total credit points over total credits, not an average of SGPAs", () => {
    const semesters = [
      { semNumber: 1, subjects: [{ id: "1", name: "", credits: 2, grade: "O" }] }, // SGPA 10
      { semNumber: 2, subjects: [{ id: "2", name: "", credits: 6, grade: "D" }] }, // SGPA 6
    ];
    // (2*10 + 6*6) / 8 = 7.0, a plain average of SGPAs would give 8.0
    expect(calculateCGPA(semesters).cgpa).toBe(7);
  });

  test("empty input gives zero", () => {
    expect(calculateSGPA([]).sgpa).toBe(0);
    expect(calculateCGPA([{ semNumber: 1, subjects: [] }]).cgpa).toBe(0);
  });

  test("class awarded follows Table 3", () => {
    expect(getKKWClassAwarded(7.75).className).toBe("First Class with Distinction");
    expect(getKKWClassAwarded(7.74).className).toBe("First Class");
    expect(getKKWClassAwarded(6.75).className).toBe("First Class");
    expect(getKKWClassAwarded(6.25).className).toBe("Higher Second Class");
    expect(getKKWClassAwarded(5.5).className).toBe("Second Class");
    expect(getKKWClassAwarded(4.0).className).toBe("Pass Class");
    expect(getKKWClassAwarded(3.99).className).toBe("Below pass class");
  });

  test("hasUnclearedCourse flags F, FX, AB and IC only", () => {
    const make = (grade: string) => [{ semNumber: 1, subjects: [{ id: "1", name: "", credits: 3, grade }] }];
    expect(hasUnclearedCourse(make("F"))).toBe(true);
    expect(hasUnclearedCourse(make("AB"))).toBe(true);
    expect(hasUnclearedCourse(make("A"))).toBe(false);
    expect(hasUnclearedCourse(make("AC"))).toBe(false);
  });

  test("parseCalculatorData rejects junk and clamps values", () => {
    expect(parseCalculatorData(null)).toBeNull();
    expect(parseCalculatorData({ semesters: "x" })).toBeNull();
    const ok = parseCalculatorData({
      studentName: "x".repeat(500),
      prn: 5,
      semesters: [{ semNumber: 9, subjects: [{ id: "a", name: "N", credits: 999, grade: "ZZ" }, null] }],
    });
    expect(ok?.studentName.length).toBe(80);
    expect(ok?.prn).toBe("");
    expect(ok?.semesters[0].semNumber).toBe(1);
    expect(ok?.semesters[0].subjects).toHaveLength(1);
    expect(ok?.semesters[0].subjects[0]).toMatchObject({ credits: 10, grade: "" });
  });

  test("hasUserData is false for a fresh calculator", () => {
    expect(hasUserData(emptyCalculator())).toBe(false);
    const d = emptyCalculator();
    d.semesters[0].subjects.push({ id: "1", name: "", credits: 3, grade: "A" });
    expect(hasUserData(d)).toBe(true);
  });
});
