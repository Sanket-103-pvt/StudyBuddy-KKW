"use client";

import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { daysUntil, loadExams, saveExams, sortExams, type ExamEntry } from "@/lib/countdown-utils";

function label(days: number): string {
  if (days === 0) return "Today";
  if (days === 1) return "1 day left";
  if (days > 1) return `${days} days left`;
  return "Done";
}

export default function ExamCountdown() {
  const [exams, setExams] = useState<ExamEntry[]>([]);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setExams(sortExams(loadExams()));
    setReady(true);
  }, []);

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !date) return;
    const next = sortExams([...exams, { id: `${Date.now()}`, name: name.trim().slice(0, 60), date }]);
    setExams(next);
    saveExams(next);
    setName("");
    setDate("");
  };

  const remove = (id: string) => {
    const next = exams.filter((x) => x.id !== id);
    setExams(next);
    saveExams(next);
  };

  return (
    <div>
      <form onSubmit={add} className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-3 mb-6">
        <label className="sr-only" htmlFor="exam-name">Exam name</label>
        <input
          id="exam-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={60}
          placeholder="Exam name, e.g. DBMS End-Sem"
          className="min-h-[48px] px-4 rounded-xl border border-border-light dark:border-border-dark bg-surface-container-lowest dark:bg-bg-dark text-on-surface dark:text-text-primary-dark"
          required
        />
        <label className="sr-only" htmlFor="exam-date">Exam date</label>
        <input
          id="exam-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="min-h-[48px] px-4 rounded-xl border border-border-light dark:border-border-dark bg-surface-container-lowest dark:bg-bg-dark text-on-surface dark:text-text-primary-dark"
          required
        />
        <button
          type="submit"
          className="min-h-[48px] px-6 rounded-xl bg-primary text-white font-semibold"
        >
          Add exam
        </button>
      </form>

      {ready && exams.length === 0 && (
        <p className="font-inter text-body-md text-text-secondary-light dark:text-text-secondary-dark">
          No exams added yet.
        </p>
      )}

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {exams.map((x) => {
          const days = daysUntil(x.date);
          return (
            <li
              key={x.id}
              className="flex items-center justify-between gap-3 p-4 rounded-xl border border-border-light dark:border-border-dark bg-surface-container-lowest dark:bg-bg-dark"
            >
              <div className="min-w-0">
                <div className="font-sora font-semibold truncate text-on-surface dark:text-text-primary-dark">{x.name}</div>
                <div className="font-mono text-[12px] text-text-secondary-light dark:text-text-secondary-dark">{x.date}</div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`font-sora font-bold ${days >= 0 && days <= 7 ? "text-red-600 dark:text-red-400" : "text-primary dark:text-primary-fixed-dim"}`}>
                  {label(days)}
                </span>
                <button
                  onClick={() => remove(x.id)}
                  aria-label={`Remove ${x.name}`}
                  className="p-3 -m-1 rounded-lg hover:bg-surface-container text-text-secondary-light dark:text-text-secondary-dark"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
