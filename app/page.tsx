"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { GraduationCap, FolderOpen, Star, ArrowRight, ExternalLink, BookOpen } from "lucide-react";

import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import RecentlyViewed from "@/components/RecentlyViewed";
import SyllabusSummaryCard from "@/components/SyllabusSummaryCard";
import QuickToolsGrid from "@/components/QuickToolsGrid";
import indexData from "@/content/index.json";


import { formatYearTitle } from "@/lib/year-utils";
import { useToast } from "@/components/ToastProvider";

interface BookmarkedResource {
  label: string;
  url: string;
  type: string;
  subjectId: string;
  subjectName: string;
  year: string;
}

export default function Home() {
  const toast = useToast();
  const [mounted, setMounted] = useState(false);
  const [bookmarks, setBookmarks] = useState<BookmarkedResource[]>([]);

  useEffect(() => {
    setMounted(true);
    // Load bookmarked resources metadata from localStorage
    const savedUrls = localStorage.getItem("sb_bookmarks");
    if (savedUrls) {
      const urls: string[] = JSON.parse(savedUrls);
      const items: BookmarkedResource[] = [];
      
      urls.forEach(url => {
        const meta = localStorage.getItem(`sb_bm_meta_${url}`);
        if (meta) {
          items.push(JSON.parse(meta));
        }
      });
      
      setBookmarks(items);
    }
  }, []);

  const removeBookmark = (url: string, label?: string) => {
    const savedUrls = localStorage.getItem("sb_bookmarks");
    if (savedUrls) {
      const urls: string[] = JSON.parse(savedUrls);
      const updated = urls.filter(u => u !== url);
      localStorage.setItem("sb_bookmarks", JSON.stringify(updated));
      localStorage.removeItem(`sb_bm_meta_${url}`);
      setBookmarks(bookmarks.filter(b => b.url !== url));
      toast.info(`Unpinned "${label || "Resource"}" ⭐`);
    }
  };

  return (
    <>
      <main className="flex-grow flex flex-col items-center px-margin-mobile md:px-margin-desktop py-8 md:py-12 max-w-container-max mx-auto w-full">


        {/* Hero Section */}
        <section className="text-center max-w-3xl mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-surface-container dark:bg-inverse-surface px-3.5 py-1 rounded-full text-label-mono font-mono text-text-secondary-light dark:text-text-secondary-dark mb-6 border border-border-light dark:border-border-dark transition-colors">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
            400+ students use this every year
          </div>
          
          <h1 className="font-sora font-bold text-headline-lg md:text-headline-xl text-on-surface dark:text-text-primary-dark mb-4 tracking-tight">
            Find your notes in seconds
          </h1>
          
          <p className="font-inter text-body-lg text-text-secondary-light dark:text-text-secondary-dark mb-8 max-w-2xl mx-auto">
            One hub for every note, PYQ, and resource K.K. Wagh students actually need.
          </p>
          
          <SearchBar />
        </section>

        <QuickToolsGrid />

        <RecentlyViewed />

        <SyllabusSummaryCard />


        {/* Bookmarks Section (Only shows if there are saved items) */}
        {mounted && bookmarks.length > 0 && (
          <section className="w-full max-w-container-max mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-sora font-semibold text-headline-sm text-on-surface dark:text-text-primary-dark flex items-center gap-2">
                <Star size={20} className="text-amber-500 fill-amber-500" />
                Pinned Resources
              </h2>
            </div>

            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map((bm, idx) => (
                <div 
                  key={idx}
                  className="bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark p-5 rounded-xl flex flex-col justify-between hover:shadow-sm transition-shadow"
                >
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-text-secondary-light dark:text-text-secondary-dark bg-surface-container dark:bg-inverse-surface px-2.5 py-0.5 rounded-full border border-border-light dark:border-border-dark">
                      {bm.subjectName}
                    </span>
                    <a
                      href={bm.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sora font-semibold text-body-md text-on-surface dark:text-text-primary-dark hover:text-primary dark:hover:text-primary-fixed-dim mt-3 block flex items-center gap-1.5 transition-colors"
                    >
                      <FolderOpen size={16} className="text-primary dark:text-primary-fixed-dim" />
                      <span className="truncate">{bm.label}</span>
                      <ExternalLink size={12} className="opacity-50" />
                    </a>
                  </div>
                  
                  <div className="flex justify-between items-center mt-5 pt-3 border-t border-border-light dark:border-border-dark">
                    <Link 
                      href={`/${bm.year}/${bm.subjectId}`}
                      className="text-body-sm text-primary dark:text-primary-fixed-dim font-medium hover:underline flex items-center gap-1"
                    >
                      View subject <ArrowRight size={12} />
                    </Link>
                    
                    <button 
                      onClick={() => removeBookmark(bm.url, bm.label)}
                      className="p-1 rounded-lg hover:bg-surface-container dark:hover:bg-inverse-surface text-text-secondary-light dark:text-text-secondary-dark hover:text-red-500 transition-all duration-200 active:scale-90 hover:scale-110"
                      aria-label="Remove pin"
                      title="Unpin resource"
                    >
                      <Star size={16} fill="currentColor" className="text-amber-500 hover:text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

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
