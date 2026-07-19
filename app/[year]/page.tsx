import React from "react";
import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SubjectCard from "@/components/SubjectCard";

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

export async function generateStaticParams() {
  return [
    { year: "first-year" },
    { year: "second-year" }
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year } = params;

  if (year !== "first-year" && year !== "second-year") {
    return {};
  }

  const yearLabel = year === "first-year" ? "First Year" : "Second Year";
  const indexPath = path.join(process.cwd(), "content", "index.json");
  let subjects: SubjectIndexItem[] = [];

  try {
    const fileContent = fs.readFileSync(indexPath, "utf-8");
    const data = JSON.parse(fileContent);
    subjects = data[year] || [];
  } catch (error) {
    console.error("Failed to load subject index for metadata:", error);
  }

  const first3 = subjects.slice(0, 3).map((s) => s.name).join(", ");
  const title = `${yearLabel} Subjects | Study Buddy KKW`;
  const description = `${subjects.length} subjects including ${first3}... Find notes, PYQs, and syllabus for KKW engineering students.`;

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
          alt: `${yearLabel} Subjects - Study Buddy KKW`,
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

  if (year !== "first-year" && year !== "second-year") {
    notFound();
  }

  // Load subject index
  const indexPath = path.join(process.cwd(), "content", "index.json");
  let subjects: SubjectIndexItem[] = [];

  try {
    const fileContent = fs.readFileSync(indexPath, "utf-8");
    const data = JSON.parse(fileContent);
    subjects = data[year] || [];
  } catch (error) {
    console.error("Failed to load subject index:", error);
    notFound();
  }

  const title = year === "first-year" ? "First Year Subjects" : "Second Year Subjects";
  const desc = year === "first-year" 
    ? "Common engineering foundation courses for Semester I & II" 
    : "Departmental core subjects for Semester III & IV (AI&DS / CS)";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow max-w-container-max w-full mx-auto px-margin-mobile md:px-margin-desktop py-12">
        {/* Page Header */}
        <div className="mb-10 max-w-2xl">
          <div className="text-body-sm font-semibold tracking-wider uppercase text-primary dark:text-primary-fixed-dim mb-2">
            {year === "first-year" ? "1st Year Curriculum" : "2nd Year Curriculum"}
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
