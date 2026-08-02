"use client";

import React from "react";
import Link from "next/link";
import { Calculator, HelpCircle, BarChart2, Trophy, ArrowRight } from "lucide-react";

const tools = [
  {
    title: "SGPA & CGPA Calculator",
    description: "Calculate semester SGPA and cumulative CGPA based on KKW credit weightage.",
    href: "/calculator",
    icon: Calculator,
    colorClass:
      "bg-blue-50/70 dark:bg-blue-950/30 border-blue-200/80 dark:border-blue-800/40 text-blue-900 dark:text-blue-100 hover:border-blue-400 dark:hover:border-blue-600",
    iconColor: "text-blue-600 dark:text-blue-400",
    badge: "Official SPPU Credit",
  },
  {
    title: "Practice Quiz Engine",
    description: "Test your conceptual understanding with unit-wise multiple-choice quizzes.",
    href: "/second-year/dsa/quiz",
    icon: HelpCircle,
    colorClass:
      "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-100 hover:border-emerald-400 dark:hover:border-emerald-600",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    badge: "Self-Assessment",
  },
  {
    title: "Study Time Tracker",
    description: "Track active viewing time per subject and monitor weekly study analytics.",
    href: "/analytics",
    icon: BarChart2,
    colorClass:
      "bg-amber-50/70 dark:bg-amber-950/30 border-amber-200/80 dark:border-amber-800/40 text-amber-900 dark:text-amber-100 hover:border-amber-400 dark:hover:border-amber-600",
    iconColor: "text-amber-600 dark:text-amber-400",
    badge: "Privacy First",
  },
  {
    title: "Contributor Leaderboard",
    description: "Submit notes, earn points, and view top student contributors across engineering departments.",
    href: "/contribute",
    icon: Trophy,
    colorClass:
      "bg-slate-100/70 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800/40 text-slate-900 dark:text-slate-100 hover:border-slate-400 dark:hover:border-slate-600",
    iconColor: "text-slate-700 dark:text-slate-300",
    badge: "Gamified",
  },
];

export default function QuickToolsGrid() {
  return (
    <section className="w-full max-w-container-max my-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-sora font-bold text-headline-sm text-on-surface dark:text-text-primary-dark">
          Interactive Student Utilities
        </h2>
        <span className="font-mono text-[11px] text-text-secondary-light dark:text-text-secondary-dark">
          Quick Access Tools
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className={`group p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between hover:shadow-md ${tool.colorClass}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl bg-white dark:bg-bg-dark shadow-xs ${tool.iconColor}`}>
                    <Icon size={22} />
                  </div>
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/80 dark:bg-bg-dark/80 border border-border-light/50 dark:border-border-dark/50">
                    {tool.badge}
                  </span>
                </div>

                <h3 className="font-sora font-semibold text-body-md mb-1 group-hover:text-primary dark:group-hover:text-primary-fixed-dim transition-colors">
                  {tool.title}
                </h3>
                <p className="font-inter text-body-xs opacity-80 leading-relaxed mb-4">
                  {tool.description}
                </p>
              </div>

              <div className="flex items-center gap-1.5 font-sora font-semibold text-body-xs group-hover:gap-2 transition-all">
                <span>Launch Tool</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
