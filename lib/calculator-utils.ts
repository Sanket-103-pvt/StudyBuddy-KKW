export interface GradeOption {
  grade: string;
  point: number;
  label: string;
  isAudit?: boolean;
}

export const KKW_GRADE_SCALE: GradeOption[] = [
  { grade: "O", point: 10, label: "O (90-100% - Outstanding)" },
  { grade: "A", point: 9, label: "A (80-89% - Excellent)" },
  { grade: "B", point: 8, label: "B (70-79% - Very Good)" },
  { grade: "C", point: 7, label: "C (60-69% - Good)" },
  { grade: "D", point: 6, label: "D (50-59% - Average)" },
  { grade: "E", point: 5, label: "E (40-49% - Below Average)" },
  { grade: "F", point: 0, label: "F (Below 40% - Fail)" },
  { grade: "AB", point: 0, label: "AB (Absent)" },
  { grade: "AC", point: 0, label: "AC (Audit Course Completed)", isAudit: true },
];

export interface SubjectEntry {
  id: string;
  name: string;
  credits: number;
  grade: string;
}

export interface SemesterEntry {
  semNumber: number;
  subjects: SubjectEntry[];
}

export interface KKWClassResult {
  className: string;
  badgeColor: string;
  description: string;
}

/**
 * Calculates SGPA for a single semester given subject entries.
 * SGPA = (Sum of Credits * GradePoint) / Total Credits
 * Ignores Audit courses (AC).
 */
export function calculateSGPA(subjects: SubjectEntry[]): {
  sgpa: number;
  totalCredits: number;
  earnedCredits: number;
} {
  let totalCredits = 0;
  let earnedCredits = 0;
  let totalGradePoints = 0;

  subjects.forEach((subj) => {
    const gradeObj = KKW_GRADE_SCALE.find((g) => g.grade === subj.grade);
    if (!gradeObj || gradeObj.isAudit) return;

    totalCredits += subj.credits;
    if (gradeObj.point > 0) {
      earnedCredits += subj.credits;
    }
    totalGradePoints += subj.credits * gradeObj.point;
  });

  const sgpa = totalCredits > 0 ? parseFloat((totalGradePoints / totalCredits).toFixed(2)) : 0;
  return { sgpa, totalCredits, earnedCredits };
}

/**
 * Calculates overall CGPA across multiple semesters.
 * CGPA = (Sum of all Semester Credits * GradePoint) / Total Combined Credits
 */
export function calculateCGPA(semesters: SemesterEntry[]): {
  cgpa: number;
  totalCredits: number;
  earnedCredits: number;
  percentage: number;
} {
  let combinedCredits = 0;
  let combinedEarnedCredits = 0;
  let combinedGradePoints = 0;

  semesters.forEach((sem) => {
    sem.subjects.forEach((subj) => {
      const gradeObj = KKW_GRADE_SCALE.find((g) => g.grade === subj.grade);
      if (!gradeObj || gradeObj.isAudit) return;

      combinedCredits += subj.credits;
      if (gradeObj.point > 0) {
        combinedEarnedCredits += subj.credits;
      }
      combinedGradePoints += subj.credits * gradeObj.point;
    });
  });

  const cgpa = combinedCredits > 0 ? parseFloat((combinedGradePoints / combinedCredits).toFixed(2)) : 0;
  
  // Percentage conversion formula: (CGPA - 0.75) * 10 if CGPA >= 6.75, else CGPA * 9.5
  const percentage = cgpa >= 6.75 
    ? parseFloat(((cgpa - 0.75) * 10).toFixed(2)) 
    : parseFloat((cgpa * 9.5).toFixed(2));

  return { cgpa, totalCredits: combinedCredits, earnedCredits: combinedEarnedCredits, percentage };
}

/**
 * Maps CGPA to official KKWIEER Class Awarded (Table 3)
 */
export function getKKWClassAwarded(cgpa: number): KKWClassResult {
  if (cgpa >= 7.75) {
    return {
      className: "First Class with Distinction",
      badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      description: "Outstanding performance (CGPA 7.75 or above)",
    };
  }
  if (cgpa >= 6.75) {
    return {
      className: "First Class",
      badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      description: "Excellent performance (CGPA 6.75 - 7.74)",
    };
  }
  if (cgpa >= 6.25) {
    return {
      className: "Higher Second Class",
      badgeColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
      description: "Very good performance (CGPA 6.25 - 6.74)",
    };
  }
  if (cgpa >= 5.5) {
    return {
      className: "Second Class",
      badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      description: "Good performance (CGPA 5.50 - 6.24)",
    };
  }
  if (cgpa >= 4.0) {
    return {
      className: "Pass Class",
      badgeColor: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
      description: "Average performance (CGPA 4.00 - 5.49)",
    };
  }
  return {
    className: "Unclassified / Fail",
    badgeColor: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    description: "Below minimum passing grade (CGPA below 4.00)",
  };
}

/**
 * Pre-populated default KKWIEER Course Curriculums by Branch
 */
export const KKW_BRANCH_PRESETS: Record<string, Record<number, SubjectEntry[]>> = {
  computer: {
    1: [
      { id: "c1", name: "Engineering Mathematics I", credits: 4, grade: "A" },
      { id: "c2", name: "Applied Physics", credits: 4, grade: "A" },
      { id: "c3", name: "C Programming", credits: 3, grade: "O" },
      { id: "c4", name: "Fundamentals of Electrical Eng.", credits: 3, grade: "B" },
      { id: "c5", name: "Engineering Graphics", credits: 2, grade: "A" },
      { id: "c6", name: "Environmental Studies (Audit)", credits: 0, grade: "AC" },
    ],
    2: [
      { id: "c7", name: "Engineering Mathematics II", credits: 4, grade: "A" },
      { id: "c8", name: "Applied Chemistry", credits: 4, grade: "A" },
      { id: "c9", name: "Computational Thinking & Problem Solving", credits: 3, grade: "O" },
      { id: "c10", name: "Fundamental of Electronics", credits: 3, grade: "B" },
      { id: "c11", name: "Workshop Practice", credits: 2, grade: "O" },
    ],
    3: [
      { id: "c12", name: "Discrete Mathematics", credits: 4, grade: "O" },
      { id: "c13", name: "Data Structures & Algorithms", credits: 3, grade: "A" },
      { id: "c14", name: "Digital Electronics & Logic Design", credits: 3, grade: "A" },
      { id: "c15", name: "Object Oriented Programming", credits: 3, grade: "O" },
      { id: "c16", name: "Computer Organization & Architecture", credits: 3, grade: "B" },
      { id: "c17", name: "DSA Lab", credits: 1.5, grade: "O" },
    ],
    4: [
      { id: "c18", name: "Engineering Mathematics III", credits: 4, grade: "A" },
      { id: "c19", name: "Operating Systems", credits: 3, grade: "O" },
      { id: "c20", name: "Database Management Systems", credits: 3, grade: "A" },
      { id: "c21", name: "Software Engineering", credits: 3, grade: "A" },
      { id: "c22", name: "Computer Networks", credits: 3, grade: "B" },
      { id: "c23", name: "DBMS Lab", credits: 1.5, grade: "O" },
    ],
  },
  aids: {
    1: [
      { id: "a1", name: "Engineering Mathematics I", credits: 4, grade: "A" },
      { id: "a2", name: "Applied Physics", credits: 4, grade: "A" },
      { id: "a3", name: "Python Programming for AI", credits: 3, grade: "O" },
      { id: "a4", name: "Basic Electrical Engineering", credits: 3, grade: "B" },
      { id: "a5", name: "Engineering Graphics", credits: 2, grade: "A" },
    ],
    2: [
      { id: "a6", name: "Engineering Mathematics II", credits: 4, grade: "A" },
      { id: "a7", name: "Applied Chemistry", credits: 4, grade: "B" },
      { id: "a8", name: "Data Structures & Algorithms", credits: 3, grade: "O" },
      { id: "a9", name: "Basic Electronics Engineering", credits: 3, grade: "A" },
    ],
    3: [
      { id: "a10", name: "Discrete Structures & Graph Theory", credits: 4, grade: "A" },
      { id: "a11", name: "Data Science Fundamentals", credits: 3, grade: "O" },
      { id: "a12", name: "Object Oriented Programming in Java", credits: 3, grade: "A" },
      { id: "a13", name: "Database Management Systems", credits: 3, grade: "A" },
    ],
    4: [
      { id: "a14", name: "Statistics for Data Science", credits: 4, grade: "O" },
      { id: "a15", name: "Artificial Intelligence Fundamentals", credits: 3, grade: "O" },
      { id: "a16", name: "Operating Systems", credits: 3, grade: "A" },
      { id: "a17", name: "Design & Analysis of Algorithms", credits: 3, grade: "B" },
    ],
  },
  entc: {
    1: [
      { id: "e1", name: "Engineering Mathematics I", credits: 4, grade: "A" },
      { id: "e2", name: "Applied Physics", credits: 4, grade: "B" },
      { id: "e3", name: "Basic Electronics Engineering", credits: 3, grade: "O" },
      { id: "e4", name: "C Programming", credits: 3, grade: "A" },
    ],
    2: [
      { id: "e5", name: "Engineering Mathematics II", credits: 4, grade: "A" },
      { id: "e6", name: "Applied Chemistry", credits: 4, grade: "A" },
      { id: "e7", name: "Electronic Devices & Circuits", credits: 3, grade: "B" },
    ],
  },
  mechanical: {
    1: [
      { id: "m1", name: "Engineering Mathematics I", credits: 4, grade: "B" },
      { id: "m2", name: "Engineering Physics", credits: 4, grade: "A" },
      { id: "m3", name: "Systems in Mechanical Eng.", credits: 3, grade: "A" },
      { id: "m4", name: "Engineering Graphics", credits: 3, grade: "O" },
    ],
  },
  civil: {
    1: [
      { id: "cv1", name: "Engineering Mathematics I", credits: 4, grade: "A" },
      { id: "cv2", name: "Engineering Chemistry", credits: 4, grade: "A" },
      { id: "cv3", name: "Basic Civil Engineering", credits: 3, grade: "O" },
      { id: "cv4", name: "Engineering Mechanics", credits: 3, grade: "B" },
    ],
  },
};
