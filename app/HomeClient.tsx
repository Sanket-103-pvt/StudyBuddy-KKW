"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, BookOpen } from "lucide-react";

import Footer from "@/components/Footer";
import RecentlyViewed from "@/components/RecentlyViewed";
import SyllabusSummaryCard from "@/components/SyllabusSummaryCard";
import PinnedResources from "@/components/PinnedResources";
import QuickToolsGrid from "@/components/QuickToolsGrid";
import indexData from "@/content/index.json";


import { formatYearTitle } from "@/lib/year-utils";
import { useAuth } from "@/components/AuthProvider";

export default function HomeClient({ landing }: { landing: React.ReactNode }) {
  const { signedIn, displayName } = useAuth();
  if (!signedIn) return <>{landing}</>;

  return (
    <>
      <main className="flex-grow flex flex-col items-center px-margin-mobile md:px-margin-desktop py-4 md:py-8 max-w-container-max mx-auto w-full">


        <section className="w-full mb-10">
          <h1 className="font-tight font-semibold tracking-tight text-3xl md:text-4xl text-on-surface dark:text-text-primary-dark">
            Welcome back{displayName ? `, ${displayName.split(" ")[0]}` : ""}
          </h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mt-2">Pick up where you left off.</p>
        </section>

        <QuickToolsGrid />

        <RecentlyViewed />

        <SyllabusSummaryCard />


        <PinnedResources />

        {/* Year Selector Grid */}
        <section className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-gutter mb-12">
          {Object.keys(indexData).map((yearKey) => {
            const subjects = (indexData as Record<string, { id: string; name: string }[]>)[yearKey] || [];
            
            const yearDetails: Record<string, { title: string; desc: string; tags: string[] }> = {
              "first-year": {
                title: "First Year",
                desc: "Common engineering foundation courses for Semesters I & II.",
                tags: ["M-I", "M-II", "Physics", "Chemistry", "C Programming", "Mechanics"],
              },
              "second-year": {
                title: "Second Year",
                desc: "Core departmental subjects for Semesters III & IV (AI&DS / CS).",
                tags: ["Data Structures", "DELD", "Operating Systems", "DBMS", "Discrete Math", "Maths 3"],
              },
              "third-year": {
                title: "Third Year (AI&DS only)",
                desc: "AI&DS core and elective courses for Semesters V & VI.",
                tags: ["DSA", "AI", "Data Science", "TOC", "Cloud Computing", "NLP"],
              },
            };

            const details = yearDetails[yearKey] || {
              title: formatYearTitle(yearKey),
              desc: `Curriculum materials for ${formatYearTitle(yearKey)}.`,
              tags: ["Notes", "PYQs", "Syllabus"],
            };

            const yearStyle = {
              borderClass: "border-t-4 border-t-[var(--lp-ink)] hover:border-t-[var(--lp-accent)]",
              iconBg: "bg-[var(--lp-panel)] text-[var(--lp-ink)]",
              tagClass: "border-[var(--lp-line)] text-[var(--lp-muted)]",
            };

            return (
              <Link
                key={yearKey}
                href={`/${yearKey}`}
                className={`group bg-[var(--lp-bg)] p-7 border border-[var(--lp-line)] hover:border-[var(--lp-ink)] transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[240px] ${yearStyle.borderClass}`}
              >
                <div>
                  <div className="flex justify-between items-start mb-5">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold shadow-xs transition-transform group-hover:scale-105 ${yearStyle.iconBg}`}>
                      <GraduationCap size={24} />
                    </div>
                    <span className="font-mono text-label-mono font-semibold text-on-surface dark:text-text-primary-dark bg-surface-container dark:bg-inverse-surface px-3 py-1 rounded-full border border-border-light dark:border-border-dark flex items-center gap-1.5 shadow-xs">
                      <BookOpen size={13} className="text-primary dark:text-primary-fixed-dim" />
                      {subjects.length} Subjects
                    </span>
                  </div>

                  <h2 className="font-sora font-bold text-headline-md text-on-surface dark:text-text-primary-dark mb-2 group-hover:text-primary dark:group-hover:text-primary-fixed-dim transition-colors tracking-tight">
                    {details.title}
                  </h2>

                  <p className="font-inter text-body-sm text-text-secondary-light dark:text-text-secondary-dark mb-6 leading-relaxed">
                    {details.desc}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-auto pt-3 border-t border-border-light/50 dark:border-border-dark/50">
                  {details.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`font-mono text-[11px] px-2.5 py-1 rounded-lg border transition-all ${yearStyle.tagClass}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            );
          })}
        </section>
      </main>

      <Footer />
    </>
  );
}
