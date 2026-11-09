"use client";

import React from "react";
import Link from "next/link";
import { Calculator, BarChart2, Trophy, Timer, ArrowRight } from "lucide-react";

const tools = [
  {
    title: "SGPA & CGPA Calculator",
    description: "Calculate semester SGPA and cumulative CGPA based on KKW credit weightage.",
    href: "/calculator",
    icon: Calculator,
    colorClass: "bg-[var(--lp-bg)] border-[var(--lp-line)] text-[var(--lp-ink)] hover:border-[var(--lp-ink)]",
    iconColor: "text-[var(--lp-ink)]",
    badge: "Official SPPU Credit",
  },
  {
    title: "Study Time Tracker",
    description: "Track active viewing time per subject and monitor weekly study analytics.",
    href: "/analytics",
    icon: BarChart2,
    colorClass: "bg-[var(--lp-bg)] border-[var(--lp-line)] text-[var(--lp-ink)] hover:border-[var(--lp-ink)]",
    iconColor: "text-[var(--lp-ink)]",
    badge: "Privacy First",
  },
  {
    title: "Exam Countdown",
    description: "Add your exam dates, see the days left and open exam timetables.",
    href: "/countdown",
    icon: Timer,
    colorClass: "bg-[var(--lp-bg)] border-[var(--lp-line)] text-[var(--lp-ink)] hover:border-[var(--lp-ink)]",
    iconColor: "text-[var(--lp-ink)]",
    badge: "On this device",
  },
  {
    title: "Contributor Leaderboard",
    description: "Submit notes, earn points, and view top student contributors across engineering departments.",
    href: "/contribute",
    icon: Trophy,
    colorClass: "bg-[var(--lp-bg)] border-[var(--lp-line)] text-[var(--lp-ink)] hover:border-[var(--lp-ink)]",
    iconColor: "text-[var(--lp-ink)]",
    badge: "Contribute",
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
              className={`group p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${tool.colorClass}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl bg-[var(--lp-panel)] ${tool.iconColor}`}>
                    <Icon size={22} />
                  </div>
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border border-[var(--lp-line)] text-[var(--lp-muted)]">
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
