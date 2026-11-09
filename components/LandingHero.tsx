import React from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import SearchBar from "@/components/SearchBar";

const progress = [
  { label: "Unit 1", done: 100 },
  { label: "Unit 2", done: 70 },
  { label: "Unit 3", done: 35 },
  { label: "Unit 4", done: 0 },
];

export default function LandingHero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative w-full overflow-hidden rounded-3xl mb-14 md:mb-20 bg-[#0e1a24] text-white"
    >
      {/* Soft colour fields, no stock photo needed */}
      <div aria-hidden className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/campus.png" alt="" className="absolute inset-0 w-full h-full object-cover scale-110 blur-[6px] opacity-70" />
        <div className="absolute inset-0 bg-[#0e1a24]/55" />
        <div className="absolute -top-24 -left-20 w-[28rem] h-[28rem] rounded-full bg-[#2f4a63] opacity-40 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-[30rem] h-[30rem] rounded-full bg-[#c2692a] opacity-40 blur-3xl" />
        <div className="absolute top-10 right-0 w-80 h-80 rounded-full bg-[#3b52d9] opacity-20 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
      </div>

      <div className="relative grid lg:grid-cols-[1.4fr_1fr] gap-10 items-end px-6 sm:px-10 lg:px-14 pt-12 sm:pt-16 pb-10 sm:pb-14 min-h-[34rem]">
        <div>
          <p className="inline-flex items-center gap-2 text-sm text-white/80 mb-6">
            <Sparkles size={16} aria-hidden />
            Free notes, PYQs and tools for K.K. Wagh students
          </p>

          <h1
            id="hero-title"
            className="font-serif font-medium tracking-tight leading-[1.02] text-5xl sm:text-6xl lg:text-7xl mb-6"
          >
            Every problem,
            <br />
            one solution:
            <br />
            StudyBuddy
          </h1>

          <p className="text-base sm:text-lg text-white/75 max-w-xl mb-8 leading-relaxed">
            Notes scattered over WhatsApp, dead Drive links, last-minute SGPA math. We put it all in one place, for free.
          </p>

          <div className="max-w-xl mb-6 dark">
            <SearchBar />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/first-year"
              className="inline-flex items-center gap-2 rounded-full bg-white text-black text-sm font-medium px-5 py-2.5 hover:bg-white/90 transition-colors"
            >
              Browse notes <ArrowUpRight size={16} aria-hidden />
            </Link>
            <Link
              href="/contribute"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 text-white text-sm font-medium px-5 py-2.5 hover:bg-white/10 transition-colors"
            >
              Share your notes
            </Link>
          </div>
        </div>

        {/* Illustrative card (static, no real numbers) */}
        <div className="hidden lg:block justify-self-end w-72" aria-hidden>
          <div className="rounded-3xl bg-white text-black p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="font-serif text-xl">Syllabus progress</span>
              <span className="text-[11px] rounded-full bg-black text-white px-2 py-0.5">Local</span>
            </div>
            <div className="space-y-3">
              {progress.map((p) => (
                <div key={p.label}>
                  <div className="flex justify-between text-xs text-black/60 mb-1">
                    <span>{p.label}</span>
                  </div>
                  <div className="h-3 rounded-full bg-black/10 overflow-hidden">
                    <div className="h-full rounded-full bg-black" style={{ width: `${p.done}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-black/50 mt-4">Tracked on your device. No login.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
