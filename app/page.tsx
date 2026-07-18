"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { GraduationCap, FolderOpen, Star, ArrowRight, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import indexData from "@/content/index.json";

interface BookmarkedResource {
  label: string;
  url: string;
  type: string;
  subjectId: string;
  subjectName: string;
}

export default function Home() {
  const [bookmarks, setBookmarks] = useState<BookmarkedResource[]>([]);

  useEffect(() => {
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

  const removeBookmark = (url: string) => {
    const savedUrls = localStorage.getItem("sb_bookmarks");
    if (savedUrls) {
      const urls: string[] = JSON.parse(savedUrls);
      const updated = urls.filter(u => u !== url);
      localStorage.setItem("sb_bookmarks", JSON.stringify(updated));
      localStorage.removeItem(`sb_bm_meta_${url}`);
      setBookmarks(bookmarks.filter(b => b.url !== url));
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow flex flex-col items-center px-margin-mobile md:px-margin-desktop py-12 md:py-20 max-w-container-max mx-auto w-full">
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

        {/* Bookmarks Section (Only shows if there are saved items) */}
        {bookmarks.length > 0 && (
          <section className="w-full max-w-5xl mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-sora font-semibold text-headline-sm text-on-surface dark:text-text-primary-dark">
                ⭐ Pinned Resources
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
                      href={`/${bm.subjectId.includes("discrete") || bm.subjectId.includes("deld") || bm.subjectId.includes("dbms") || bm.subjectId.includes("operating") || bm.subjectId.includes("maths-3") || bm.subjectId.includes("software") || bm.subjectId.includes("data-structure") ? "second-year" : "first-year"}/${bm.subjectId}`}
                      className="text-body-sm text-primary dark:text-primary-fixed-dim font-medium hover:underline flex items-center gap-1"
                    >
                      View subject <ArrowRight size={12} />
                    </Link>
                    
                    <button 
                      onClick={() => removeBookmark(bm.url)}
                      className="text-text-secondary-light dark:text-text-secondary-dark hover:text-red-500 transition-colors"
                      aria-label="Remove pin"
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
          {/* First Year Card */}
          <Link
            href="/first-year"
            className="group bg-surface-container-lowest dark:bg-bg-dark rounded-xl p-8 border border-border-light dark:border-border-dark shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[220px]"
          >
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-lg bg-surface-container dark:bg-inverse-surface flex items-center justify-center text-primary dark:text-primary-fixed-dim transition-colors">
                  <GraduationCap size={24} />
                </div>
                <span className="font-mono text-label-mono text-text-secondary-light dark:text-text-secondary-dark bg-surface-container dark:bg-inverse-surface px-2.5 py-1 rounded-full border border-border-light dark:border-border-dark">
                  {indexData["first-year"].length} Subjects
                </span>
              </div>
              
              <h2 className="font-sora font-semibold text-headline-md text-on-surface dark:text-text-primary-dark mb-2 group-hover:text-primary dark:group-hover:text-primary-fixed-dim transition-colors">
                First Year
              </h2>
              
              <p className="font-inter text-body-md text-text-secondary-light dark:text-text-secondary-dark mb-6">
                Common engineering foundation courses for Semester I & II.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-auto">
              {["M-I", "M-II", "Physics", "Chemistry", "C Programming", "Mechanics"].map((tag) => (
                <span 
                  key={tag}
                  className="font-mono text-[10px] px-2.5 py-1 rounded-full bg-surface-container-low dark:bg-inverse-surface border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark group-hover:border-primary-fixed-dim transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>

          {/* Second Year Card */}
          <Link
            href="/second-year"
            className="group bg-surface-container-lowest dark:bg-bg-dark rounded-xl p-8 border border-border-light dark:border-border-dark shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[220px]"
          >
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-lg bg-surface-container dark:bg-inverse-surface flex items-center justify-center text-primary dark:text-primary-fixed-dim transition-colors">
                  <GraduationCap size={24} />
                </div>
                <span className="font-mono text-label-mono text-text-secondary-light dark:text-text-secondary-dark bg-surface-container dark:bg-inverse-surface px-2.5 py-1 rounded-full border border-border-light dark:border-border-dark">
                  {indexData["second-year"].length} Subjects
                </span>
              </div>
              
              <h2 className="font-sora font-semibold text-headline-md text-on-surface dark:text-text-primary-dark mb-2 group-hover:text-primary dark:group-hover:text-primary-fixed-dim transition-colors">
                Second Year
              </h2>
              
              <p className="font-inter text-body-md text-text-secondary-light dark:text-text-secondary-dark mb-6">
                Core departmental subjects for Semesters III & IV (AI&DS / CS).
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-auto">
              {["Data Structures", "DELD", "Operating Systems", "DBMS", "Discrete Math", "Maths 3"].map((tag) => (
                <span 
                  key={tag}
                  className="font-mono text-[10px] px-2.5 py-1 rounded-full bg-surface-container-low dark:bg-inverse-surface border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark group-hover:border-primary-fixed-dim transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
