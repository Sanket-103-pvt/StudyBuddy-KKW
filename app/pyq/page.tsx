import React from "react";
import type { Metadata } from "next";
import { Clock, ExternalLink } from "lucide-react";
import Footer from "@/components/Footer";
import { pyqItems, type PyqItem } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Previous Year Question Papers (PYQs) | Study Buddy KKW",
  description: "Previous year question papers for K.K. Wagh engineering subjects, organised by subject, year and session.",
};

function groupBySubject(items: PyqItem[]): [string, PyqItem[]][] {
  const map = new Map<string, PyqItem[]>();
  for (const item of items) {
    map.set(item.subject, [...(map.get(item.subject) ?? []), item]);
  }
  return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
}

export default function PyqPage() {
  const groups = groupBySubject(pyqItems);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow max-w-container-max w-full mx-auto px-margin-mobile md:px-margin-desktop py-10 md:py-12">
        <h1 className="font-sora font-bold text-headline-lg md:text-headline-xl text-on-surface dark:text-text-primary-dark mb-3">
          Previous Year Question Papers
        </h1>
        <p className="font-inter text-body-lg text-text-secondary-light dark:text-text-secondary-dark mb-8 max-w-2xl">
          Organised by subject, year and session.
        </p>

        {groups.length === 0 ? (
          <div className="rounded-2xl border border-border-light dark:border-border-dark bg-surface-container-lowest dark:bg-bg-dark p-8 md:p-12 text-center">
            <Clock className="mx-auto mb-4 text-primary dark:text-primary-fixed-dim" size={36} aria-hidden="true" />
            <h2 className="font-sora font-bold text-headline-sm text-on-surface dark:text-text-primary-dark mb-2">
              Coming soon
            </h2>
            <p className="font-inter text-body-md text-text-secondary-light dark:text-text-secondary-dark max-w-md mx-auto">
              Question papers are being collected and will appear here, grouped by subject, year and session.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {groups.map(([subject, items]) => (
              <section key={subject} aria-labelledby={`pyq-${subject}`}>
                <h2 id={`pyq-${subject}`} className="font-sora font-semibold text-headline-sm mb-3 text-on-surface dark:text-text-primary-dark">
                  {subject}
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {items
                    .slice()
                    .sort((a, b) => b.year.localeCompare(a.year))
                    .map((item) => (
                      <li key={`${item.year}-${item.session}-${item.url}`}>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between gap-3 min-h-[52px] px-4 py-3 rounded-xl border border-border-light dark:border-border-dark hover:border-primary text-on-surface dark:text-text-primary-dark"
                        >
                          <span className="font-inter font-medium">
                            {item.year} · {item.session}
                          </span>
                          <ExternalLink size={16} aria-hidden="true" />
                        </a>
                      </li>
                    ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
