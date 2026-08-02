import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import SubjectCard from "@/components/SubjectCard";
import indexData from "@/content/index.json";
import { formatYearTitle } from "@/lib/year-utils";

interface SubjectIndexItem {
  id: string;
  name: string;
  icon: string;
  unitCount: number;
  lastUpdated: string;
}

interface PageProps {
  params: {
    year: string;
  };
}

const yearTitles: Record<string, string> = {
  "first-year": "First Year Subjects",
  "second-year": "Second Year Subjects",
  "third-year": "Third Year Subjects",
  "fourth-year": "Fourth Year Subjects",
};

const yearDescriptions: Record<string, string> = {
  "first-year": "Common engineering foundation courses for Semesters I & II",
  "second-year": "Departmental core subjects for Semesters III & IV (AI&DS / CS)",
  "third-year": "Advanced specialization and elective courses for Semesters V & VI",
  "fourth-year": "Capstone projects, industrial training, and electives for Semesters VII & VIII",
};

export async function generateStaticParams() {
  return Object.keys(indexData).map((year) => ({ year }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year } = params;
  const validYears = Object.keys(indexData);

  if (!validYears.includes(year)) {
    return {};
  }

  const yearLabel = yearTitles[year] || `${formatYearTitle(year)} Subjects`;
  const subjects = (indexData as Record<string, SubjectIndexItem[]>)[year] || [];
  const first3 = subjects.slice(0, 3).map((s) => s.name).join(", ");
  const title = `${yearLabel} | Study Buddy KKW`;
  const description = `${subjects.length} subjects${first3 ? ` including ${first3}...` : ""}. Find notes, PYQs, and syllabus for KKW engineering students.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/${year}`,
      siteName: "Study Buddy KKW",
      images: [
        {
          url: "/og-preview.png",
          width: 1200,
          height: 630,
          alt: `${yearLabel} - Study Buddy KKW`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-preview.png"],
    },
  };
}

export default async function YearPage({ params }: PageProps) {
  const { year } = params;
  const validYears = Object.keys(indexData);

  if (!validYears.includes(year)) {
    notFound();
  }

  const subjects = (indexData as Record<string, SubjectIndexItem[]>)[year] || [];
  const title = yearTitles[year] || `${formatYearTitle(year)} Subjects`;
  const desc = yearDescriptions[year] || `Curriculum materials for ${formatYearTitle(year)}`;

  return (
    <div className="flex flex-col min-h-screen">
      
      <main className="flex-grow max-w-container-max w-full mx-auto px-margin-mobile md:px-margin-desktop py-12">
        {/* Page Header */}
        <div className="mb-10 max-w-2xl">
          <div className="text-body-sm font-semibold tracking-wider uppercase text-primary dark:text-primary-fixed-dim mb-2">
            {formatYearTitle(year)} Curriculum
          </div>
          <h1 className="font-sora font-bold text-headline-lg md:text-headline-xl text-on-surface dark:text-text-primary-dark mb-3">
            {title}
          </h1>
          <p className="font-inter text-body-lg text-text-secondary-light dark:text-text-secondary-dark">
            {desc}
          </p>
        </div>

        {/* Subjects Grid */}
        {subjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {subjects.map((sub) => (
              <SubjectCard
                key={sub.id}
                id={sub.id}
                name={sub.name}
                year={year}
                iconName={sub.icon}
                unitCount={sub.unitCount}
                lastUpdated={sub.lastUpdated}
              />
            ))}
          </div>
        ) : (
          <div className="bg-surface-container-lowest dark:bg-bg-dark rounded-xl p-12 text-center border border-border-light dark:border-border-dark">
            <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
              No subjects mapped yet for this year.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
