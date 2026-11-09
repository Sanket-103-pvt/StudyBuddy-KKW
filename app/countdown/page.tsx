import type { Metadata } from "next";
import Footer from "@/components/Footer";
import ExamCountdown from "@/components/ExamCountdown";
import { timetableItems } from "@/lib/site-data";
import { ExternalLink } from "lucide-react";
import CommunityTimetables from "@/components/CommunityTimetables";
import { formatYearTitle } from "@/lib/year-utils";

export const metadata: Metadata = {
  title: "Exam Countdown & Timetable | Study Buddy KKW",
  description: "Track days left for your exams and open exam timetables for K.K. Wagh engineering students.",
};

export default function CountdownPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow max-w-container-max w-full mx-auto px-margin-mobile md:px-margin-desktop py-10 md:py-12">
        <h1 className="font-sora font-bold text-headline-lg md:text-headline-xl text-on-surface dark:text-text-primary-dark mb-3">
          Exam Countdown
        </h1>
        <p className="font-inter text-body-lg text-text-secondary-light dark:text-text-secondary-dark mb-8 max-w-2xl">
          Add your exam dates and see how many days are left. Dates are saved only on this device.
        </p>

        <ExamCountdown />

        <section className="mt-12" aria-labelledby="timetables-heading">
          <h2 id="timetables-heading" className="font-sora font-bold text-headline-sm text-on-surface dark:text-text-primary-dark mb-3">
            Timetables
          </h2>
          {timetableItems.length > 0 && (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {timetableItems.map((t) => (
                <li key={t.url}>
                  <a
                    href={t.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 min-h-[52px] px-4 py-3 rounded-xl border border-border-light dark:border-border-dark hover:border-primary text-on-surface dark:text-text-primary-dark"
                  >
                    <span>
                      <span className="block font-inter font-medium">{t.title}</span>
                      <span className="block font-mono text-[11px] text-text-secondary-light dark:text-text-secondary-dark">
                        {formatYearTitle(t.year)}
                        {t.contributor ? ` · shared by ${t.contributor}` : ""}
                      </span>
                    </span>
                    <ExternalLink size={16} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          )}
          <CommunityTimetables showEmptyMessage={timetableItems.length === 0} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
