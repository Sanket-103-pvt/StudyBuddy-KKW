import React from "react";
import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UnitList from "@/components/UnitList";
import SubjectViewTracker from "@/components/SubjectViewTracker";
import indexData from "@/content/index.json";

interface Resource {
  label: string;
  type: string;
  url: string;
  lastUpdated?: string;
}

interface Unit {
  unitNumber: number;
  title: string;
  resources: Resource[];
}

interface SubjectData {
  id: string;
  name: string;
  year: string;
  icon: string;
  lastUpdated: string;
  units: Unit[];
  bonus: Resource[];
}

interface PageProps {
  params: {
    year: string;
    subject: string;
  };
}

export async function generateStaticParams() {
  const paths: { year: string; subject: string }[] = [];
  const years = Object.keys(indexData);

  for (const year of years) {
    const dirPath = path.join(process.cwd(), "content", year);
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      files.forEach(file => {
        if (file.endsWith(".json")) {
          paths.push({
            year,
            subject: file.replace(".json", "")
          });
        }
      });
    }
  }

  return paths;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year, subject } = params;
  const validYears = Object.keys(indexData);

  if (!validYears.includes(year)) {
    return {};
  }

  const filePath = path.join(process.cwd(), "content", year, `${subject}.json`);

  if (!fs.existsSync(filePath)) {
    return {};
  }

  let subjectData: SubjectData;

  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    subjectData = JSON.parse(fileContent);
  } catch (error) {
    console.error("Failed to load subject details for metadata:", error);
    return {};
  }

  const yearLabel = year.replace("-", " ");
  const title = `${subjectData.name} (${yearLabel}) | Study Buddy KKW`;
  const description = `Access notes, PYQs, question banks, and study resources for ${subjectData.name} at K.K. Wagh.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/${year}/${subject}`,
      siteName: "Study Buddy KKW",
      images: [
        {
          url: "/og-preview.png",
          width: 1200,
          height: 630,
          alt: `${subjectData.name} - Study Buddy KKW`,
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

export default async function SubjectPage({ params }: PageProps) {
  const { year, subject } = params;
  const validYears = Object.keys(indexData);

  if (!validYears.includes(year)) {
    notFound();
  }

  const filePath = path.join(process.cwd(), "content", year, `${subject}.json`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  let subjectData: SubjectData;

  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    subjectData = JSON.parse(fileContent);
  } catch (error) {
    console.error("Failed to load subject details:", error);
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow max-w-container-max w-full mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12">
        {/* Back Link */}
        <Link 
          href={`/${year}`}
          className="inline-flex items-center gap-1 text-body-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary-fixed-dim mb-6 transition-colors group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-[2px] transition-transform" />
          Back to {year.replace("-", " ")}
        </Link>

        {/* Subject Header */}
        <div className="mb-10 pb-6 border-b border-border-light dark:border-border-dark flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <span className="font-mono text-label-mono text-primary dark:text-primary-fixed-dim bg-primary-fixed dark:bg-inverse-surface px-2.5 py-1 rounded-md uppercase">
              {year.replace("-", " ")} Course
            </span>
            <h1 className="font-sora font-bold text-headline-lg md:text-headline-xl text-on-surface dark:text-text-primary-dark mt-3 mb-2">
              {subjectData.name}
            </h1>
            <p className="font-inter text-body-sm text-text-secondary-light dark:text-text-secondary-dark">
              Resources for studying {subjectData.name} at K.K. Wagh.
            </p>
          </div>

          <div className="font-inter text-body-sm text-text-secondary-light dark:text-text-secondary-dark text-right">
            Last updated:{" "}
            <span className="font-medium text-on-surface dark:text-text-primary-dark">
              {new Date(subjectData.lastUpdated).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric"
              })}
            </span>
          </div>
        </div>

        {/* Units / Resources List */}
        <UnitList 
          subjectId={subjectData.id}
          subjectName={subjectData.name}
          year={year}
          units={subjectData.units} 
          bonus={subjectData.bonus} 
        />
        <SubjectViewTracker 
          subjectId={subjectData.id} 
          subjectName={subjectData.name} 
          year={year} 
        />
      </main>

      <Footer />
    </div>
  );
}
