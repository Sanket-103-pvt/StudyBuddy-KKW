"use client";

import React, { useState } from "react";
import { X, Sparkles, Calendar, CheckSquare, Loader2, AlertCircle, RefreshCw, Lightbulb, Target } from "lucide-react";
import { useToast } from "@/components/ToastProvider";

interface DailyItem {
  day: number;
  date: string;
  unit: string;
  topic: string;
  hours: number;
  priority: "HIGH" | "MEDIUM" | "LOW";
}

interface StudyPlanResponse {
  totalDays: number;
  dailyPlan: DailyItem[];
  weakAreaFocus: string[];
  tips: string[];
}

interface StudyPlanModalProps {
  subjectId: string;
  subjectName: string;
  year?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function StudyPlanModal({
  subjectId,
  subjectName,
  year,
  isOpen,
  onClose,
}: StudyPlanModalProps) {
  const toast = useToast();
  const todayStr = new Date().toISOString().split("T")[0];
  const [examDate, setExamDate] = useState("");
  const [completedUnits, setCompletedUnits] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<StudyPlanResponse | null>(null);

  if (!isOpen) return null;

  const toggleUnit = (unitNum: number) => {
    setCompletedUnits((prev) =>
      prev.includes(unitNum) ? prev.filter((u) => u !== unitNum) : [...prev, unitNum]
    );
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examDate) {
      setError("Please select your target exam date.");
      toast.warning("Please select your target exam date.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/study-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId,
          subjectName,
          year,
          examDate,
          completedUnits,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate study plan");
      }

      setPlan(data);
      toast.success("AI Study Plan generated successfully! 🤖✨");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(msg);
      toast.error(msg || "Failed to generate AI study plan.");
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return (
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50">
            HIGH
          </span>
        );
      case "MEDIUM":
        return (
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
            MEDIUM
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
            LOW
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-light dark:border-border-dark flex justify-between items-center bg-surface-container dark:bg-inverse-surface">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-primary-fixed-dim/20 flex items-center justify-center text-primary dark:text-primary-fixed-dim">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="font-sora font-bold text-headline-sm text-on-surface dark:text-text-primary-dark">
                AI Study Plan Generator
              </h3>
              <p className="font-inter text-body-sm text-text-secondary-light dark:text-text-secondary-dark">
                {subjectName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-container-high dark:hover:bg-inverse-surface text-text-secondary-light dark:text-text-secondary-dark transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-grow">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 flex items-start gap-3 text-body-sm">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Generation Error</span>
                {error}
              </div>
            </div>
          )}

          {!plan && !loading && (
            <form onSubmit={handleGenerate} className="space-y-6">
              {/* Exam Date */}
              <div>
                <label className="block font-sora font-semibold text-body-sm text-on-surface dark:text-text-primary-dark mb-2 flex items-center gap-2">
                  <Calendar size={16} className="text-primary dark:text-primary-fixed-dim" />
                  Target Exam Date
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border-light dark:border-border-dark bg-surface-container-lowest dark:bg-bg-dark text-on-surface dark:text-text-primary-dark focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>

              {/* Completed Units Checkboxes */}
              <div>
                <label className="block font-sora font-semibold text-body-sm text-on-surface dark:text-text-primary-dark mb-2 flex items-center gap-2">
                  <CheckSquare size={16} className="text-primary dark:text-primary-fixed-dim" />
                  Completed / Partially Studied Units
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[1, 2, 3, 4, 5].map((unitNum) => {
                    const isChecked = completedUnits.includes(unitNum);
                    return (
                      <button
                        key={unitNum}
                        type="button"
                        onClick={() => toggleUnit(unitNum)}
                        className={`px-3 py-2.5 rounded-xl border text-body-sm font-medium transition-all ${
                          isChecked
                            ? "bg-primary text-white border-primary"
                            : "bg-surface-container-low dark:bg-inverse-surface border-border-light dark:border-border-dark text-on-surface dark:text-text-primary-dark"
                        }`}
                      >
                        Unit {unitNum}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-primary text-white font-sora font-semibold text-body-md hover:bg-primary/90 transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <Sparkles size={18} />
                Generate AI Study Plan
              </button>
            </form>
          )}

          {loading && (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
              <Loader2 size={36} className="text-primary dark:text-primary-fixed-dim animate-spin" />
              <p className="font-sora font-semibold text-body-lg text-on-surface dark:text-text-primary-dark">
                Crafting your personalized study plan...
              </p>
              <p className="font-inter text-body-sm text-text-secondary-light dark:text-text-secondary-dark max-w-sm">
                Analyzing units, exam timeline, and prioritizing target topics using Gemini AI.
              </p>
            </div>
          )}

          {plan && !loading && (
            <div className="space-y-6">
              {/* Summary Bar */}
              <div className="flex justify-between items-center bg-surface-container dark:bg-inverse-surface p-4 rounded-xl border border-border-light dark:border-border-dark">
                <div>
                  <span className="font-sora font-bold text-headline-sm text-primary dark:text-primary-fixed-dim">
                    {plan.totalDays} Days
                  </span>
                  <span className="text-body-sm text-text-secondary-light dark:text-text-secondary-dark ml-2">
                    remaining until exam
                  </span>
                </div>
                <button
                  onClick={() => setPlan(null)}
                  className="px-3 py-1.5 rounded-lg bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark text-body-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw size={14} /> Regenerate
                </button>
              </div>

              {/* Day-wise Plan Table */}
              <div>
                <h4 className="font-sora font-semibold text-body-lg text-on-surface dark:text-text-primary-dark mb-3">
                  📅 Day-by-Day Schedule
                </h4>
                <div className="border border-border-light dark:border-border-dark rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-body-sm border-collapse">
                      <thead>
                        <tr className="bg-surface-container dark:bg-inverse-surface border-b border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark font-mono text-[11px] uppercase tracking-wider">
                          <th className="px-4 py-2.5">Day</th>
                          <th className="px-4 py-2.5">Unit</th>
                          <th className="px-4 py-2.5">Focus Topic</th>
                          <th className="px-4 py-2.5">Hours</th>
                          <th className="px-4 py-2.5">Priority</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-light dark:divide-border-dark">
                        {plan.dailyPlan.map((item, idx) => (
                          <tr key={idx} className="hover:bg-surface-container-low dark:hover:bg-inverse-surface/50">
                            <td className="px-4 py-3 font-semibold font-mono text-primary dark:text-primary-fixed-dim">
                              Day {item.day}
                            </td>
                            <td className="px-4 py-3 font-medium text-on-surface dark:text-text-primary-dark whitespace-nowrap">
                              {item.unit}
                            </td>
                            <td className="px-4 py-3 text-text-secondary-light dark:text-text-secondary-dark">
                              {item.topic}
                            </td>
                            <td className="px-4 py-3 font-mono font-medium">
                              {item.hours}h
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {getPriorityBadge(item.priority)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Weak Areas Focus */}
              {plan.weakAreaFocus && plan.weakAreaFocus.length > 0 && (
                <div className="bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark p-4 rounded-xl">
                  <h4 className="font-sora font-semibold text-body-md text-on-surface dark:text-text-primary-dark mb-2 flex items-center gap-2">
                    <Target size={16} className="text-amber-500" /> Key Weak Areas to Target
                  </h4>
                  <ul className="list-disc list-inside text-body-sm text-text-secondary-light dark:text-text-secondary-dark space-y-1">
                    {plan.weakAreaFocus.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tips */}
              {plan.tips && plan.tips.length > 0 && (
                <div className="bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark p-4 rounded-xl">
                  <h4 className="font-sora font-semibold text-body-md text-on-surface dark:text-text-primary-dark mb-2 flex items-center gap-2">
                    <Lightbulb size={16} className="text-emerald-500" /> Exam Preparation Tips
                  </h4>
                  <ul className="list-disc list-inside text-body-sm text-text-secondary-light dark:text-text-secondary-dark space-y-1">
                    {plan.tips.map((t, idx) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
