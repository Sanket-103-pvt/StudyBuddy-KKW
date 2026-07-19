"use client";

import React from "react";
import Link from "next/link";
import { Clock, Trash2, ArrowRight } from "lucide-react";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { getRelativeTime } from "@/lib/date-utils";

export default function RecentlyViewed() {
  const { history, clearHistory } = useRecentlyViewed();

  if (!history || history.length === 0) {
    return null;
  }

  return (
    <section className="w-full max-w-5xl mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-sora font-semibold text-headline-sm text-on-surface dark:text-text-primary-dark flex items-center gap-2">
          <Clock size={18} className="text-primary dark:text-primary-fixed-dim" />
          Recently Viewed
        </h2>
        <button
          onClick={clearHistory}
          className="text-body-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-red-500 transition-colors flex items-center gap-1 font-medium"
        >
          <Trash2 size={14} /> Clear
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {history.map((item) => (
          <Link
            key={item.subjectId}
            href={`/${item.year}/${item.subjectId}`}
            className="group bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark hover:border-primary dark:hover:border-primary-fixed-dim px-4 py-2.5 rounded-xl flex items-center gap-3 transition-all shadow-sm hover:shadow"
          >
            <div className="flex flex-col text-left">
              <span className="font-sora font-semibold text-body-sm text-on-surface dark:text-text-primary-dark group-hover:text-primary dark:group-hover:text-primary-fixed-dim transition-colors">
                {item.subjectName}
              </span>
              <span className="font-mono text-[10px] text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
                {item.year.replace("-", " ")} • {getRelativeTime(item.viewedAt)}
              </span>
            </div>
            <ArrowRight size={14} className="text-text-secondary-light dark:text-text-secondary-dark group-hover:text-primary dark:group-hover:text-primary-fixed-dim group-hover:translate-x-0.5 transition-all opacity-60" />
          </Link>
        ))}
      </div>
    </section>
  );
}
