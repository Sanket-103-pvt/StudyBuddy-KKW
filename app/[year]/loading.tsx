// loading.tsx — Skeleton loading UI for the year listing page (e.g. /first-year, /second-year).
// Next.js App Router automatically renders this as the Suspense fallback
// while the async YearPage component is loading.

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function YearPageLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow max-w-container-max w-full mx-auto px-margin-mobile md:px-margin-desktop py-12">

        {/* Page Header skeleton */}
        <div className="mb-10 max-w-2xl flex flex-col gap-3">
          {/* Eyebrow label */}
          <div className="h-4 w-36 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
          {/* Page title */}
          <div className="h-10 w-64 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
          {/* Description */}
          <div className="h-5 w-full max-w-md rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>

        {/* Subject card grid skeleton — 6 cards (matches max subjects per year) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-surface-container-lowest dark:bg-bg-dark rounded-xl p-6 border border-border-light dark:border-border-dark shadow-sm flex flex-col justify-between"
            >
              <div>
                {/* Card top row: icon + unit badge */}
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  <div className="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                </div>

                {/* Subject name */}
                <div className="h-6 w-3/4 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse mb-2" />
              </div>

              {/* Card footer: last updated */}
              <div className="mt-4 pt-4 border-t border-border-light dark:border-border-dark flex items-center justify-between">
                <div className="h-4 w-20 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="h-4 w-24 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
