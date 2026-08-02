import { 
  calculateSGPA, 
  calculateCGPA, 
  getKKWClassAwarded, 
  KKW_BRANCH_PRESETS,
  type SubjectEntry 
} from "@/lib/calculator-utils";

describe("KKWIEER SGPA / CGPA Calculator Utilities", () => {
  test("calculateSGPA correctly calculates SGPA for 10-point grades", () => {
    const subjects: SubjectEntry[] = [
      { id: "1", name: "Subject A", credits: 4, grade: "O" }, // 4 * 10 = 40
      { id: "2", name: "Subject B", credits: 4, grade: "A" }, // 4 * 9 = 36
      { id: "3", name: "Subject C", credits: 3, grade: "B" }, // 3 * 8 = 24
      { id: "4", name: "Subject D", credits: 3, grade: "C" }, // 3 * 7 = 21
      { id: "5", name: "Audit Course", credits: 0, grade: "AC" }, // Non-credit
    ];

    // Total points = 40 + 36 + 24 + 21 = 121
    // Total credits = 4 + 4 + 3 + 3 = 14
    // SGPA = 121 / 14 = 8.64
    const result = calculateSGPA(subjects);
    expect(result.sgpa).toBe(8.64);
    expect(result.totalCredits).toBe(14);
    expect(result.earnedCredits).toBe(14);
  });

  test("calculateCGPA correctly computes overall CGPA and percentage", () => {
    const semesters = [
      {
        semNumber: 1,
        subjects: [
          { id: "1", name: "Math 1", credits: 4, grade: "O" },
          { id: "2", name: "Physics", credits: 4, grade: "A" },
        ],
      },
      {
        semNumber: 2,
        subjects: [
          { id: "3", name: "Math 2", credits: 4, grade: "A" },
          { id: "4", name: "Chemistry", credits: 4, grade: "O" },
        ],
      },
    ];

    // Points = (4*10 + 4*9) + (4*9 + 4*10) = 76 + 76 = 152
    // Total credits = 16
    // CGPA = 152 / 16 = 9.5
    const result = calculateCGPA(semesters);
    expect(result.cgpa).toBe(9.5);
    expect(result.totalCredits).toBe(16);
    // Percentage = (9.5 - 0.75) * 10 = 87.5%
    expect(result.percentage).toBe(87.5);
  });

  test("getKKWClassAwarded returns correct SPPU/KKW class according to Table 3", () => {
    expect(getKKWClassAwarded(8.5).className).toBe("First Class with Distinction");
    expect(getKKWClassAwarded(7.75).className).toBe("First Class with Distinction");
    expect(getKKWClassAwarded(7.5).className).toBe("First Class");
    expect(getKKWClassAwarded(6.5).className).toBe("Higher Second Class");
    expect(getKKWClassAwarded(6.0).className).toBe("Second Class");
    expect(getKKWClassAwarded(5.0).className).toBe("Pass Class");
    expect(getKKWClassAwarded(3.5).className).toBe("Unclassified / Fail");
  });

  test("KKW_BRANCH_PRESETS contains default engineering branches", () => {
    expect(KKW_BRANCH_PRESETS).toHaveProperty("computer");
    expect(KKW_BRANCH_PRESETS).toHaveProperty("aids");
    expect(KKW_BRANCH_PRESETS).toHaveProperty("entc");
    expect(KKW_BRANCH_PRESETS).toHaveProperty("mechanical");
    expect(KKW_BRANCH_PRESETS).toHaveProperty("civil");
  });
});
