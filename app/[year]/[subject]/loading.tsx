// loading.tsx — Skeleton loading UI for the subject detail page.
// Next.js App Router automatically renders this as the Suspense fallback
// while the async SubjectPage component is loading.

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SubjectPageLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow max-w-container-max w-full mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12">

        {/* Back link skeleton */}
        <div className="h-4 w-32 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse mb-6" />

        {/* Subject Header skeleton */}
        <div className="mb-10 pb-6 border-b border-border-light dark:border-border-dark flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="flex flex-col gap-3 w-full max-w-lg">
            {/* Badge pill */}
            <div className="h-6 w-28 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
            {/* Subject title */}
            <div className="h-9 w-3/4 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
            {/* Subtitle */}
            <div className="h-4 w-1/2 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
          </div>

          {/* Last updated pill */}
          <div className="h-4 w-36 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>

        {/* Unit accordion skeleton — 4 rows */}
        <div className="w-full space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-xl overflow-hidden"
            >
              {/* Accordion header row */}
              <div className="w-full px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  {/* Unit badge */}
                  <div className="h-7 w-16 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  {/* Unit title */}
                  <div className="h-5 w-48 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
                </div>
                {/* Resource count + chevron */}
                <div className="flex items-center gap-3">
                  <div className="h-4 w-20 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse hidden sm:block" />
                  <div className="h-5 w-5 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
