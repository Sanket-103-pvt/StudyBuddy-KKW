"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  BarChart2, 
  Clock, 
  Award, 
  Calendar, 
  Trash2, 
  BookOpen, 
  ArrowRight, 
  Sparkles,
  TrendingUp,
  PieChart as PieChartIcon
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ToastProvider";
import { 
  getStudyAnalytics, 
  clearStudyAnalytics, 
  saveStudyAnalytics,
  type StudySessionRecord 
} from "@/hooks/useStudyTracker";
import { formatYearTitle } from "@/lib/year-utils";

// Palette for subject pie/distribution charts
const SUBJECT_COLORS = [
  "#3b82f6", // blue
  "#10b981", // emerald
  "#8b5cf6", // purple
  "#f59e0b", // amber
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
  "#6366f1", // indigo
];

// Helper to format seconds into readable hours/minutes
function formatDuration(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds <= 0) return "0m";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  if (minutes > 0) {
    return `${minutes}m`;
  }
  return `${seconds}s`;
}

// Generate last 7 days array (dates and short day names)
function getLast7Days(): { dateStr: string; dayLabel: string }[] {
  const days = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" });
    days.push({ dateStr, dayLabel });
  }
  return days;
}

export default function AnalyticsPage() {
  const toast = useToast();
  const [mounted, setMounted] = useState(false);
  const [records, setRecords] = useState<StudySessionRecord[]>([]);

  const refreshAnalytics = () => {
    setRecords(getStudyAnalytics());
  };

  useEffect(() => {
    setMounted(true);
    refreshAnalytics();
  }, []);

  const handleClearAnalytics = () => {
    if (window.confirm("Are you sure you want to clear your study time history?")) {
      clearStudyAnalytics();
      setRecords([]);
      toast.info("Study analytics cleared 📊");
    }
  };

  const handleLoadDemoData = () => {
    const today = new Date();
    const demoRecords: StudySessionRecord[] = [];
    const subjects = [
      { id: "operating-systems", name: "Operating Systems", year: "second-year" },
      { id: "dbms", name: "Database Management System", year: "second-year" },
      { id: "deld", name: "Digital Electronics & Logic Design", year: "second-year" },
      { id: "math-1", name: "Engineering Mathematics I", year: "first-year" },
      { id: "c-programming", name: "C Programming", year: "first-year" },
    ];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      
      // Add random 15-45 minutes per subject
      subjects.forEach((subj, idx) => {
        if ((i + idx) % 2 === 0) {
          demoRecords.push({
            date: dateStr,
            subjectId: subj.id,
            subjectName: subj.name,
            year: subj.year,
            secondsSpent: (idx + 1) * 900 + Math.floor(Math.random() * 600),
          });
        }
      });
    }

    saveStudyAnalytics(demoRecords);
    setRecords(demoRecords);
    toast.success("Loaded sample study data! 🚀");
  };

  // Calculate totals and statistics
  const { 
    totalSeconds, 
    weeklyDayTotals, 
    subjectTotals, 
    topSubject, 
    activeDaysCount 
  } = useMemo(() => {
    const total = records.reduce((acc, curr) => acc + curr.secondsSpent, 0);

    // Past 7 days breakdown
    const last7 = getLast7Days();
    const dayTotalsMap: Record<string, number> = {};
    last7.forEach((d) => (dayTotalsMap[d.dateStr] = 0));

    records.forEach((r) => {
      if (dayTotalsMap[r.date] !== undefined) {
        dayTotalsMap[r.date] += r.secondsSpent;
      }
    });

    const weeklyDayTotals = last7.map((d) => ({
      dateStr: d.dateStr,
      dayLabel: d.dayLabel,
      seconds: dayTotalsMap[d.dateStr] || 0,
    }));

    const activeDaysCount = Object.values(dayTotalsMap).filter((s) => s > 0).length;

    // Subject breakdown
    const subjMap: Record<string, { id: string; name: string; year: string; seconds: number }> = {};
    records.forEach((r) => {
      if (!subjMap[r.subjectId]) {
        subjMap[r.subjectId] = {
          id: r.subjectId,
          name: r.subjectName,
          year: r.year,
          seconds: 0,
        };
      }
      subjMap[r.subjectId].seconds += r.secondsSpent;
    });

    const subjectTotals = Object.values(subjMap).sort((a, b) => b.seconds - a.seconds);
    const topSubject = subjectTotals.length > 0 ? subjectTotals[0] : null;

    return {
      totalSeconds: total,
      weeklyDayTotals,
      subjectTotals,
      topSubject,
      activeDaysCount,
    };
  }, [records]);

  // Max seconds in 7 days for bar heights
  const maxDaySeconds = Math.max(...weeklyDayTotals.map((d) => d.seconds), 1);

  if (!mounted) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow max-w-container-max w-full mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 animate-pulse">
          <div className="h-10 w-64 bg-surface-container dark:bg-inverse-surface rounded-xl mb-4" />
          <div className="h-5 w-96 bg-surface-container dark:bg-inverse-surface rounded-xl mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark p-5 rounded-2xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-72 bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark p-6 rounded-2xl" />
            <div className="h-72 bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark p-6 rounded-2xl" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow max-w-container-max w-full mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-border-light dark:border-border-dark">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-inverse-surface px-3 py-1 rounded-full text-label-mono font-mono text-primary dark:text-primary-fixed-dim mb-2 border border-primary/20">
              <BarChart2 size={16} />
              Privacy-First Local Analytics
            </div>
            <h1 className="font-sora font-bold text-headline-lg text-on-surface dark:text-text-primary-dark">
              Study Analytics & Time Spent Tracker
            </h1>
            <p className="font-inter text-body-md text-text-secondary-light dark:text-text-secondary-dark mt-1">
              Track your daily study habits, peak focus days, and subject time distribution.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {records.length === 0 && (
              <button
                onClick={handleLoadDemoData}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container dark:bg-inverse-surface text-body-sm font-semibold text-primary dark:text-primary-fixed-dim hover:bg-primary/10 transition-all active:scale-95"
              >
                <Sparkles size={16} /> Load Demo Data
              </button>
            )}
            {records.length > 0 && (
              <button
                onClick={handleClearAnalytics}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-body-sm font-semibold transition-all active:scale-95"
              >
                <Trash2 size={16} /> Clear Analytics
              </button>
            )}
          </div>
        </div>

        {/* Overview Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <div className="bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark p-5 rounded-2xl shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-3">
              <span className="font-inter text-body-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                Total Time Studied
              </span>
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                <Clock size={20} />
              </div>
            </div>
            <div>
              <div className="font-sora font-bold text-headline-md text-on-surface dark:text-text-primary-dark">
                {formatDuration(totalSeconds)}
              </div>
              <span className="font-inter text-[12px] text-text-secondary-light dark:text-text-secondary-dark mt-1 block">
                Accumulated active time
              </span>
            </div>
          </div>

          <div className="bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark p-5 rounded-2xl shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-3">
              <span className="font-inter text-body-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                Top Studied Subject
              </span>
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
                <Award size={20} />
              </div>
            </div>
            <div>
              <div className="font-sora font-bold text-headline-sm text-on-surface dark:text-text-primary-dark truncate">
                {topSubject ? topSubject.name : "N/A"}
              </div>
              <span className="font-inter text-[12px] text-text-secondary-light dark:text-text-secondary-dark mt-1 block">
                {topSubject ? `${formatDuration(topSubject.seconds)} spent` : "No sessions recorded"}
              </span>
            </div>
          </div>

          <div className="bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark p-5 rounded-2xl shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-3">
              <span className="font-inter text-body-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                Active Study Days
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                <Calendar size={20} />
              </div>
            </div>
            <div>
              <div className="font-sora font-bold text-headline-md text-on-surface dark:text-text-primary-dark">
                {activeDaysCount} / 7 <span className="text-body-sm font-normal text-text-secondary-light">days</span>
              </div>
              <span className="font-inter text-[12px] text-text-secondary-light dark:text-text-secondary-dark mt-1 block">
                Past 7 days activity
              </span>
            </div>
          </div>

          <div className="bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark p-5 rounded-2xl shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-3">
              <span className="font-inter text-body-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                Daily Avg. Focus
              </span>
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                <TrendingUp size={20} />
              </div>
            </div>
            <div>
              <div className="font-sora font-bold text-headline-md text-on-surface dark:text-text-primary-dark">
                {formatDuration(Math.round(totalSeconds / 7))}
              </div>
              <span className="font-inter text-[12px] text-text-secondary-light dark:text-text-secondary-dark mt-1 block">
                Average time per day
              </span>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Weekly Activity Bar Chart */}
          <div className="bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark p-6 rounded-2xl shadow-sm">
            <h3 className="font-sora font-semibold text-headline-sm text-on-surface dark:text-text-primary-dark mb-1 flex items-center gap-2">
              <BarChart2 size={18} className="text-primary dark:text-primary-fixed-dim" />
              Weekly Study Distribution
            </h3>
            <p className="font-inter text-body-sm text-text-secondary-light dark:text-text-secondary-dark mb-6">
              Daily time spent studying across the past 7 days
            </p>

            <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2 border-b border-border-light dark:border-border-dark">
              {weeklyDayTotals.map((item, idx) => {
                const heightPercent = maxDaySeconds > 0 ? (item.seconds / maxDaySeconds) * 100 : 0;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 dark:bg-white/90 text-white dark:text-black font-mono text-[11px] px-2.5 py-1 rounded-md whitespace-nowrap pointer-events-none z-20 shadow">
                      {item.dayLabel}: {formatDuration(item.seconds)}
                    </div>
                    
                    {/* Bar */}
                    <div 
                      className={`w-full max-w-[40px] rounded-t-lg transition-all duration-300 ${
                        item.seconds > 0 
                          ? "bg-gradient-to-t from-primary to-blue-500 hover:from-primary-container hover:to-blue-600 shadow-sm" 
                          : "bg-surface-container dark:bg-inverse-surface/40"
                      }`}
                      style={{ height: `${Math.max(heightPercent, 6)}%` }}
                    ></div>
                    
                    <span className="font-mono text-body-sm text-text-secondary-light dark:text-text-secondary-dark mt-2">
                      {item.dayLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Subject Distribution Chart (Pie / Percent Share) */}
          <div className="bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark p-6 rounded-2xl shadow-sm">
            <h3 className="font-sora font-semibold text-headline-sm text-on-surface dark:text-text-primary-dark mb-1 flex items-center gap-2">
              <PieChartIcon size={18} className="text-primary dark:text-primary-fixed-dim" />
              Subject Share Distribution
            </h3>
            <p className="font-inter text-body-sm text-text-secondary-light dark:text-text-secondary-dark mb-6">
              Percentage breakdown of time spent per subject
            </p>

            {subjectTotals.length > 0 ? (
              <div className="space-y-4 pt-2">
                {subjectTotals.map((subj, idx) => {
                  const percent = totalSeconds > 0 ? Math.round((subj.seconds / totalSeconds) * 100) : 0;
                  const color = SUBJECT_COLORS[idx % SUBJECT_COLORS.length];
                  return (
                    <div key={subj.id} className="space-y-1.5">
                      <div className="flex justify-between items-center text-body-sm">
                        <span className="font-sora font-semibold text-on-surface dark:text-text-primary-dark truncate pr-2">
                          {subj.name}
                        </span>
                        <span className="font-mono font-medium text-text-secondary-light dark:text-text-secondary-dark shrink-0">
                          {formatDuration(subj.seconds)} ({percent}%)
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2.5 bg-surface-container dark:bg-inverse-surface rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${percent}%`, backgroundColor: color }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-56 flex flex-col items-center justify-center text-center text-text-secondary-light dark:text-text-secondary-dark">
                <BookOpen size={32} className="opacity-40 mb-2" />
                <p className="font-inter text-body-sm">No subject sessions recorded yet.</p>
                <p className="font-inter text-[12px] mt-1 text-text-secondary-light/70">
                  Open any subject page to start tracking study time!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Subject Breakdown List */}
        {subjectTotals.length > 0 && (
          <div className="bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-2xl p-6 shadow-sm">
            <h3 className="font-sora font-semibold text-headline-sm text-on-surface dark:text-text-primary-dark mb-4">
              Detailed Subject Breakdown
            </h3>

            <div className="divide-y divide-border-light dark:divide-border-dark">
              {subjectTotals.map((subj) => (
                <div key={subj.id} className="py-4 flex justify-between items-center first:pt-0 last:pb-0">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-surface-container dark:bg-inverse-surface text-text-secondary-light dark:text-text-secondary-dark">
                      {formatYearTitle(subj.year)}
                    </span>
                    <h4 className="font-sora font-semibold text-body-md text-on-surface dark:text-text-primary-dark mt-1">
                      {subj.name}
                    </h4>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-mono font-bold text-body-md text-primary dark:text-primary-fixed-dim">
                      {formatDuration(subj.seconds)}
                    </span>
                    <Link
                      href={`/${subj.year}/${subj.id}`}
                      className="p-2 rounded-lg hover:bg-surface-container dark:hover:bg-inverse-surface text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-all active:scale-95"
                      title="View subject page"
                    >
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
