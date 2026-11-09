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
            
            const yearStyleMap: Record<
              string,
              { borderClass: string; iconBg: string; tagClass: string }
            > = {
              "first-year": {
                borderClass: "border-t-4 border-t-blue-500 hover:border-t-blue-600",
                iconBg: "bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400",
                tagClass:
                  "bg-blue-50/90 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800/50 font-semibold",
              },
              "second-year": {
                borderClass: "border-t-4 border-t-emerald-500 hover:border-t-emerald-600",
                iconBg: "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400",
                tagClass:
                  "bg-emerald-50/90 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50 font-semibold",
              },
              "third-year": {
                borderClass: "border-t-4 border-t-amber-500 hover:border-t-amber-600",
                iconBg: "bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400",
                tagClass:
                  "bg-amber-50/90 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800/50 font-semibold",
              },
              "fourth-year": {
                borderClass: "border-t-4 border-t-indigo-600 hover:border-t-indigo-700",
                iconBg: "bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400",
                tagClass:
                  "bg-indigo-50/90 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/50 font-semibold",
              },
            };

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
                title: "Third Year",
                desc: "Advanced specialization and elective courses for Semesters V & VI.",
                tags: ["Computer Networks", "TOC", "Web Tech", "AI & ML", "Cloud Computing"],
              },
              "fourth-year": {
                title: "Fourth Year",
                desc: "Capstone projects, industrial training, and electives for Semesters VII & VIII.",
                tags: ["Major Project", "Cyber Security", "DevOps", "Deep Learning", "Seminar"],
              },
            };

            const details = yearDetails[yearKey] || {
              title: formatYearTitle(yearKey),
              desc: `Curriculum materials for ${formatYearTitle(yearKey)}.`,
              tags: ["Notes", "PYQs", "Syllabus"],
            };

            const yearStyle = yearStyleMap[yearKey] || {
              borderClass: "border-t-4 border-t-blue-500",
              iconBg: "bg-blue-100 text-blue-600",
              tagClass: "bg-blue-50 text-blue-700 border-blue-200",
            };

            return (
              <Link
                key={yearKey}
                href={`/${yearKey}`}
                className={`group bg-surface-container-lowest dark:bg-bg-dark rounded-2xl p-7 border border-border-light/80 dark:border-border-dark/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[240px] ${yearStyle.borderClass}`}
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
