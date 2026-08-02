"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, PieChart, Sparkles } from "lucide-react";
import { getOverallProgressSummary, type OverallProgressSummary } from "@/hooks/useSyllabusProgress";


export default function SyllabusSummaryCard() {
  const [summary, setSummary] = useState<OverallProgressSummary>({
    totalSubjectsTracked: 0,
    totalCompletedUnits: 0,
    totalUnitsTracked: 0,
    overallPercentage: 0,
    subjectSummaries: [],
  });
  const [mounted, setMounted] = useState(false);

  const updateSummary = () => {
    setSummary(getOverallProgressSummary());
  };

  useEffect(() => {
    setMounted(true);
    updateSummary();

    const handleStorageChange = () => {
      updateSummary();
    };

    window.addEventListener("sb_progress_updated", handleStorageChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("sb_progress_updated", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (!mounted || summary.totalSubjectsTracked === 0) {
    return null; // Don't render card if user hasn't started tracking any subjects yet
  }

  return (
    <section className="w-full max-w-5xl mb-12 animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-primary/5 via-surface-container-lowest to-surface-container dark:from-primary/10 dark:via-bg-dark dark:to-inverse-surface border border-primary/20 dark:border-primary/30 p-6 md:p-8 rounded-2xl shadow-sm">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 dark:bg-inverse-surface text-primary dark:text-primary-fixed-dim">
              <PieChart size={22} />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-primary dark:text-primary-fixed-dim font-semibold mb-0.5">
                <Sparkles size={12} />
                Semester Progress Tracker
              </div>
              <h2 className="font-sora font-bold text-headline-sm text-on-surface dark:text-text-primary-dark">
                Syllabus Completion Overview
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark px-4 py-2 rounded-xl shadow-xs">
            <span className="font-sora font-bold text-headline-sm text-primary dark:text-primary-fixed-dim">
              {summary.overallPercentage}%
            </span>
            <span className="font-inter text-body-sm text-text-secondary-light dark:text-text-secondary-dark border-l border-border-light dark:border-border-dark pl-3">
              {summary.totalCompletedUnits} of {summary.totalUnitsTracked} units completed
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-surface-container dark:bg-inverse-surface h-3 rounded-full overflow-hidden mb-6">
          <div
            className="bg-primary dark:bg-primary-fixed-dim h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${summary.overallPercentage}%` }}
          />
        </div>

        {/* Subject Progress Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {summary.subjectSummaries.map((subj) => (
            <Link
              key={subj.subjectId}
              href={`/${subj.year || "first-year"}/${subj.subjectId}`}
              className="group flex items-center justify-between p-3.5 rounded-xl bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark hover:border-primary/40 dark:hover:border-primary/50 transition-all hover:shadow-sm"
            >
              <div className="flex items-center gap-3 min-w-0">
                <CheckCircle2
                  size={18}
                  className={subj.percentage === 100 ? "text-emerald-500 shrink-0" : "text-text-secondary-light shrink-0 opacity-50 group-hover:opacity-100 group-hover:text-primary"}
                />
                <div className="truncate">
                  <div className="font-sora font-semibold text-body-sm text-on-surface dark:text-text-primary-dark truncate group-hover:text-primary transition-colors">
                    {subj.subjectName}
                  </div>
                  <div className="font-inter text-[11px] text-text-secondary-light dark:text-text-secondary-dark">
                    {subj.completedUnitsCount} / {subj.totalUnitsCount} units ({subj.percentage}%)
                  </div>
                </div>
              </div>
              <ArrowRight size={14} className="text-text-secondary-light group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
