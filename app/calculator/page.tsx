"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Calculator, 
  Plus, 
  Trash2, 
  Download, 
  RotateCcw, 
  Award, 
  GraduationCap, 
  CheckCircle2, 
  FileText,
  Info
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ToastProvider";
import { 
  KKW_GRADE_SCALE, 
  KKW_BRANCH_PRESETS, 
  calculateSGPA, 
  calculateCGPA, 
  getKKWClassAwarded,
  type SemesterEntry,
  type SubjectEntry 
} from "@/lib/calculator-utils";

const BRANCHES = [
  { id: "computer", name: "Computer Eng." },
  { id: "aids", name: "AI & Data Science" },
  { id: "entc", name: "E & TC" },
  { id: "mechanical", name: "Mechanical" },
  { id: "civil", name: "Civil" },
];

export default function CalculatorPage() {
  const toast = useToast();
  const [mounted, setMounted] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("computer");
  const [activeSemNumber, setActiveSemNumber] = useState(1);
  const [semesters, setSemesters] = useState<SemesterEntry[]>([]);
  const [studentName, setStudentName] = useState("");
  const [prn, setPrn] = useState("");

  // Initialize semesters from branch preset or localStorage
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("kkw_calculator_data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSemesters(parsed.semesters || []);
        setSelectedBranch(parsed.branch || "computer");
        setStudentName(parsed.studentName || "");
        setPrn(parsed.prn || "");
        return;
      } catch (e) {
        console.error("Failed to parse saved calculator state", e);
      }
    }

    // Default initialization from computer branch preset
    loadBranchPreset("computer");
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem("kkw_calculator_data", JSON.stringify({
        semesters,
        branch: selectedBranch,
        studentName,
        prn,
      }));
    } catch (e) {
      console.error("Failed to save calculator state", e);
    }
  }, [mounted, semesters, selectedBranch, studentName, prn]);

  const loadBranchPreset = (branchId: string) => {
    setSelectedBranch(branchId);
    const preset = KKW_BRANCH_PRESETS[branchId] || KKW_BRANCH_PRESETS["computer"];
    const initialSemesters: SemesterEntry[] = [1, 2, 3, 4].map((semNum) => ({
      semNumber: semNum,
      subjects: preset[semNum] ? JSON.parse(JSON.stringify(preset[semNum])) : [
        { id: `s_${semNum}_1`, name: "Core Course 1", credits: 4, grade: "O" },
        { id: `s_${semNum}_2`, name: "Core Course 2", credits: 3, grade: "A" },
      ],
    }));
    setSemesters(initialSemesters);
  };

  const handleBranchChange = (branchId: string) => {
    if (window.confirm("Change branch? This will load default subjects for the selected branch.")) {
      loadBranchPreset(branchId);
      toast.info(`Loaded subjects for ${BRANCHES.find(b => b.id === branchId)?.name}`);
    }
  };

  const currentSemester = useMemo(() => {
    return semesters.find((s) => s.semNumber === activeSemNumber) || {
      semNumber: activeSemNumber,
      subjects: [],
    };
  }, [semesters, activeSemNumber]);

  const currentSGPA = useMemo(() => {
    return calculateSGPA(currentSemester.subjects);
  }, [currentSemester]);

  const overallCGPA = useMemo(() => {
    return calculateCGPA(semesters);
  }, [semesters]);

  const classAwarded = useMemo(() => {
    return getKKWClassAwarded(overallCGPA.cgpa);
  }, [overallCGPA.cgpa]);

  const updateSubject = (semNum: number, subjectId: string, key: keyof SubjectEntry, value: string | number) => {
    setSemesters((prev) =>
      prev.map((sem) => {
        if (sem.semNumber !== semNum) return sem;
        return {
          ...sem,
          subjects: sem.subjects.map((subj) => {
            if (subj.id !== subjectId) return subj;
            return { ...subj, [key]: value };
          }),
        };
      })
    );
  };

  const addSubject = (semNum: number) => {
    const newId = `custom_${Date.now()}`;
    setSemesters((prev) =>
      prev.map((sem) => {
        if (sem.semNumber !== semNum) return sem;
        return {
          ...sem,
          subjects: [
            ...sem.subjects,
            { id: newId, name: "New Course", credits: 3, grade: "A" },
          ],
        };
      })
    );
    toast.success("Added new course row");
  };

  const removeSubject = (semNum: number, subjectId: string) => {
    setSemesters((prev) =>
      prev.map((sem) => {
        if (sem.semNumber !== semNum) return sem;
        return {
          ...sem,
          subjects: sem.subjects.filter((s) => s.id !== subjectId),
        };
      })
    );
    toast.info("Removed course row");
  };

  const addSemester = () => {
    if (semesters.length >= 8) {
      toast.error("Maximum 8 semesters supported");
      return;
    }
    const nextSem = semesters.length + 1;
    setSemesters((prev) => [
      ...prev,
      {
        semNumber: nextSem,
        subjects: [
          { id: `s_${nextSem}_1`, name: "Elective / Core Course 1", credits: 3, grade: "O" },
          { id: `s_${nextSem}_2`, name: "Elective / Core Course 2", credits: 3, grade: "A" },
          { id: `s_${nextSem}_3`, name: "Project / Lab", credits: 2, grade: "O" },
        ],
      },
    ]);
    setActiveSemNumber(nextSem);
    toast.success(`Added Semester ${nextSem}`);
  };

  const resetCalculator = () => {
    if (window.confirm("Reset all grades and subjects to branch defaults?")) {
      loadBranchPreset(selectedBranch);
      setStudentName("");
      setPrn("");
      toast.info("Calculator reset to defaults");
    }
  };

  const handlePrint = () => {
    toast.info("Opening print / PDF download dialog 🖨️");
    setTimeout(() => {
      window.print();
    }, 300);
  };

  if (!mounted) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow max-w-container-max w-full mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 animate-pulse">
          <div className="h-10 w-80 bg-surface-container dark:bg-inverse-surface rounded-xl mb-4" />
          <div className="h-5 w-96 bg-surface-container dark:bg-inverse-surface rounded-xl mb-8" />
          <div className="h-48 bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark p-6 rounded-2xl mb-8" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="print:hidden">
        <Navbar />
      </div>

      <main className="flex-grow max-w-container-max w-full mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12">
        {/* Printable Official Transcript Header (Only visible when printing) */}
        <div className="hidden print:block mb-8 border-b pb-6 text-center">
          <h1 className="text-2xl font-bold font-sora">K. K. WAGH INSTITUTE OF ENGINEERING EDUCATION & RESEARCH, NASHIK</h1>
          <p className="text-sm text-gray-600 font-mono mt-1">Official Student SGPA / CGPA Grade Performance Report</p>
          <div className="flex justify-between items-center mt-6 text-sm">
            <div>
              <p><strong>Student Name:</strong> {studentName || "N/A"}</p>
              <p><strong>PRN / Roll No:</strong> {prn || "N/A"}</p>
            </div>
            <div className="text-right">
              <p><strong>Branch:</strong> {BRANCHES.find(b => b.id === selectedBranch)?.name}</p>
              <p><strong>Date Generated:</strong> {new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
            </div>
          </div>
        </div>

        {/* Screen Header Controls */}
        <div className="print:hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8 pb-6 border-b border-border-light dark:border-border-dark">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-inverse-surface px-3 py-1 rounded-full text-label-mono font-mono text-primary dark:text-primary-fixed-dim mb-2 border border-primary/20">
              <Calculator size={16} />
              KKWIEER Grading Standard
            </div>
            <h1 className="font-sora font-bold text-headline-lg text-on-surface dark:text-text-primary-dark">
              SGPA & CGPA Calculator
            </h1>
            <p className="font-inter text-body-md text-text-secondary-light dark:text-text-secondary-dark mt-1">
              Calculate semester SGPA, cumulative CGPA, percentage, and awarded class based on K.K. Wagh Engineering credits.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetCalculator}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border-light dark:border-border-dark text-body-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark hover:bg-surface-container transition-all active:scale-95"
            >
              <RotateCcw size={16} /> Reset
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-body-sm font-semibold hover:bg-primary-container shadow-sm transition-all active:scale-95"
            >
              <Download size={16} /> Print / Save PDF
            </button>
          </div>
        </div>

        {/* Student Info & Branch Selection */}
        <div className="print:hidden bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark p-6 rounded-2xl shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block font-inter text-body-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">
                Engineering Branch
              </label>
              <select
                value={selectedBranch}
                onChange={(e) => handleBranchChange(e.target.value)}
                className="w-full bg-surface-container dark:bg-inverse-surface border border-border-light dark:border-border-dark rounded-xl px-3.5 py-2.5 font-inter text-body-sm text-on-surface dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {BRANCHES.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-inter text-body-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">
                Student Name (Optional for PDF)
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Sanket Chaudhari"
                className="w-full bg-surface-container dark:bg-inverse-surface border border-border-light dark:border-border-dark rounded-xl px-3.5 py-2.5 font-inter text-body-sm text-on-surface dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block font-inter text-body-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">
                PRN / Roll Number
              </label>
              <input
                type="text"
                value={prn}
                onChange={(e) => setPrn(e.target.value)}
                placeholder="e.g. 72345678B"
                className="w-full bg-surface-container dark:bg-inverse-surface border border-border-light dark:border-border-dark rounded-xl px-3.5 py-2.5 font-inter text-body-sm text-on-surface dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Overall CGPA & Awarded Class Highlight Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-primary/10 via-blue-500/5 to-purple-500/10 dark:from-primary/20 dark:to-purple-900/20 border border-primary/20 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <span className="font-inter text-body-sm font-semibold text-primary dark:text-primary-fixed-dim uppercase tracking-wider">
                Cumulative CGPA
              </span>
              <GraduationCap className="text-primary" size={24} />
            </div>
            <div>
              <div className="font-sora font-extrabold text-headline-xl text-primary dark:text-primary-fixed-dim">
                {overallCGPA.cgpa.toFixed(2)}
              </div>
              <span className="font-inter text-[12px] text-text-secondary-light dark:text-text-secondary-dark mt-1 block font-medium">
                {overallCGPA.earnedCredits} / {overallCGPA.totalCredits} Total Credits Earned
              </span>
            </div>
          </div>

          <div className="bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark p-6 rounded-2xl shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <span className="font-inter text-body-sm font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
                Equivalent Marks %
              </span>
              <FileText className="text-blue-500" size={24} />
            </div>
            <div>
              <div className="font-sora font-bold text-headline-xl text-on-surface dark:text-text-primary-dark">
                {overallCGPA.percentage}%
              </div>
              <span className="font-inter text-[12px] text-text-secondary-light dark:text-text-secondary-dark mt-1 block">
                SPPU Formula: (CGPA - 0.75) × 10
              </span>
            </div>
          </div>

          <div className="bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark p-6 rounded-2xl shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <span className="font-inter text-body-sm font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
                Awarded Class (KKWIEER)
              </span>
              <Award className="text-emerald-500" size={24} />
            </div>
            <div>
              <span className={`inline-block font-sora font-bold text-body-md px-3 py-1 rounded-xl border ${classAwarded.badgeColor} mb-1`}>
                {classAwarded.className}
              </span>
              <span className="font-inter text-[12px] text-text-secondary-light dark:text-text-secondary-dark block">
                {classAwarded.description}
              </span>
            </div>
          </div>
        </div>

        {/* Semester Selection Tabs */}
        <div className="print:hidden flex items-center gap-2 overflow-x-auto pb-4 mb-6 [scrollbar-width:none]">
          {semesters.map((sem) => {
            const semSGPA = calculateSGPA(sem.subjects).sgpa;
            const isActive = sem.semNumber === activeSemNumber;
            return (
              <button
                key={sem.semNumber}
                onClick={() => setActiveSemNumber(sem.semNumber)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-inter text-body-sm font-semibold transition-all shrink-0 active:scale-95 ${
                  isActive
                    ? "bg-primary text-white shadow"
                    : "bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:text-primary"
                }`}
              >
                <span>Semester {sem.semNumber}</span>
                <span className={`px-2 py-0.5 rounded-md font-mono text-[11px] ${isActive ? "bg-white/20 text-white" : "bg-surface-container dark:bg-inverse-surface"}`}>
                  SGPA: {semSGPA.toFixed(2)}
                </span>
              </button>
            );
          })}

          {semesters.length < 8 && (
            <button
              onClick={addSemester}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-dashed border-primary text-primary font-inter text-body-sm font-semibold hover:bg-primary/5 transition-all shrink-0"
            >
              <Plus size={16} /> Add Sem
            </button>
          )}
        </div>

        {/* Active Semester Form & Subject Table */}
        <div className="bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark p-6 rounded-2xl shadow-sm mb-10">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-border-light dark:border-border-dark">
            <div>
              <h2 className="font-sora font-bold text-headline-sm text-on-surface dark:text-text-primary-dark">
                Semester {activeSemNumber} Courses & Grades
              </h2>
              <span className="font-inter text-body-sm text-text-secondary-light dark:text-text-secondary-dark">
                Semester Credits: {currentSGPA.totalCredits} | Earned: {currentSGPA.earnedCredits}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="font-inter text-[11px] uppercase tracking-wider text-text-secondary-light font-medium block">
                  Semester SGPA
                </span>
                <span className="font-sora font-extrabold text-headline-md text-primary dark:text-primary-fixed-dim">
                  {currentSGPA.sgpa.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Subjects Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-light dark:border-border-dark font-inter text-body-sm text-text-secondary-light dark:text-text-secondary-dark">
                  <th className="py-3 px-2 font-semibold">#</th>
                  <th className="py-3 px-2 font-semibold min-w-[220px]">Subject Name</th>
                  <th className="py-3 px-2 font-semibold w-32">Credits ($C_i$)</th>
                  <th className="py-3 px-2 font-semibold min-w-[200px]">Grade Earned</th>
                  <th className="py-3 px-2 font-semibold w-24 text-center">Points ($G_i$)</th>
                  <th className="print:hidden py-3 px-2 font-semibold w-16 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light dark:divide-border-dark font-inter text-body-sm">
                {currentSemester.subjects.map((subj, idx) => {
                  const gradeObj = KKW_GRADE_SCALE.find((g) => g.grade === subj.grade);
                  return (
                    <tr key={subj.id} className="hover:bg-surface-container/50 dark:hover:bg-inverse-surface/30">
                      <td className="py-3.5 px-2 font-mono text-text-secondary-light">{idx + 1}</td>
                      <td className="py-3.5 px-2">
                        <input
                          type="text"
                          value={subj.name}
                          onChange={(e) => updateSubject(activeSemNumber, subj.id, "name", e.target.value)}
                          className="w-full bg-surface-container dark:bg-inverse-surface border border-border-light dark:border-border-dark rounded-lg px-3 py-1.5 text-on-surface dark:text-text-primary-dark focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </td>
                      <td className="py-3.5 px-2">
                        <input
                          type="number"
                          min="1"
                          max="8"
                          step="0.5"
                          value={subj.credits}
                          onChange={(e) => updateSubject(activeSemNumber, subj.id, "credits", parseFloat(e.target.value) || 0)}
                          className="w-20 bg-surface-container dark:bg-inverse-surface border border-border-light dark:border-border-dark rounded-lg px-3 py-1.5 text-on-surface dark:text-text-primary-dark font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </td>
                      <td className="py-3.5 px-2">
                        <select
                          value={subj.grade}
                          onChange={(e) => updateSubject(activeSemNumber, subj.id, "grade", e.target.value)}
                          className="w-full bg-surface-container dark:bg-inverse-surface border border-border-light dark:border-border-dark rounded-lg px-3 py-1.5 text-on-surface dark:text-text-primary-dark focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                        >
                          {KKW_GRADE_SCALE.map((g) => (
                            <option key={g.grade} value={g.grade}>
                              {g.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3.5 px-2 text-center font-mono font-bold text-primary dark:text-primary-fixed-dim">
                        {gradeObj ? (gradeObj.isAudit ? "Audit" : gradeObj.point) : 0}
                      </td>
                      <td className="print:hidden py-3.5 px-2 text-center">
                        <button
                          onClick={() => removeSubject(activeSemNumber, subj.id)}
                          className="p-1.5 text-text-secondary-light hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                          title="Remove subject"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <button
            onClick={() => addSubject(activeSemNumber)}
            className="print:hidden inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-container dark:bg-inverse-surface text-primary dark:text-primary-fixed-dim font-inter text-body-sm font-semibold hover:bg-primary/10 transition-all active:scale-95"
          >
            <Plus size={16} /> Add Subject to Semester {activeSemNumber}
          </button>
        </div>

        {/* Grade Reference Tables (KKWIEER Table 2 & Table 3) */}
        <div className="print:hidden grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark p-6 rounded-2xl shadow-sm">
            <h3 className="font-sora font-semibold text-headline-sm text-on-surface dark:text-text-primary-dark mb-2 flex items-center gap-2">
              <Info size={18} className="text-primary" />
              KKWIEER Grade Scale (Table 2)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-body-sm">
                <thead>
                  <tr className="border-b border-border-light dark:border-border-dark font-medium text-text-secondary-light">
                    <th className="py-2">Grade</th>
                    <th className="py-2">% Marks</th>
                    <th className="py-2">Points</th>
                    <th className="py-2">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light dark:divide-border-dark font-mono text-[13px]">
                  <tr><td className="py-1.5 font-bold text-primary">O</td><td>90 - 100</td><td>10</td><td>Outstanding</td></tr>
                  <tr><td className="py-1.5 font-bold text-primary">A</td><td>80 - 89</td><td>9</td><td>Excellent</td></tr>
                  <tr><td className="py-1.5 font-bold text-primary">B</td><td>70 - 79</td><td>8</td><td>Very Good</td></tr>
                  <tr><td className="py-1.5 font-bold text-primary">C</td><td>60 - 69</td><td>7</td><td>Good</td></tr>
                  <tr><td className="py-1.5 font-bold text-primary">D</td><td>50 - 59</td><td>6</td><td>Average</td></tr>
                  <tr><td className="py-1.5 font-bold text-primary">E</td><td>40 - 49</td><td>5</td><td>Below Average</td></tr>
                  <tr><td className="py-1.5 font-bold text-red-500">F</td><td>Below 40</td><td>0</td><td>Fail</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark p-6 rounded-2xl shadow-sm">
            <h3 className="font-sora font-semibold text-headline-sm text-on-surface dark:text-text-primary-dark mb-2 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-500" />
              CGPA & Awarded Class (Table 3)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-body-sm">
                <thead>
                  <tr className="border-b border-border-light dark:border-border-dark font-medium text-text-secondary-light">
                    <th className="py-2">CGPA Range</th>
                    <th className="py-2">Class Awarded</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light dark:divide-border-dark font-inter text-[13px]">
                  <tr><td className="py-2 font-mono font-bold">7.75 or above</td><td className="font-semibold text-emerald-600 dark:text-emerald-400">First Class with Distinction</td></tr>
                  <tr><td className="py-2 font-mono font-bold">6.75 - 7.74</td><td className="font-semibold text-blue-600 dark:text-blue-400">First Class</td></tr>
                  <tr><td className="py-2 font-mono font-bold">6.25 - 6.74</td><td className="font-semibold text-indigo-600 dark:text-indigo-400">Higher Second Class</td></tr>
                  <tr><td className="py-2 font-mono font-bold">5.50 - 6.24</td><td className="font-semibold text-amber-600 dark:text-amber-400">Second Class</td></tr>
                  <tr><td className="py-2 font-mono font-bold">4.00 - 5.49</td><td className="font-semibold text-slate-600 dark:text-slate-400">Pass Class</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
