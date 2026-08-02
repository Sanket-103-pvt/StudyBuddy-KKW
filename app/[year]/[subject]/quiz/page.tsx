import React from "react";
import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import indexData from "@/content/index.json";
import { formatYearTitle } from "@/lib/year-utils";
import QuizRunner from "@/components/QuizRunner";
import type { QuizQuestion } from "@/lib/quiz-utils";

interface PageProps {
  params: {
    year: string;
    subject: string;
  };
}

interface RawSubjectData {
  id: string;
  name: string;
  year: string;
  icon: string;
  lastUpdated: string;
  units: Array<{
    unitNumber: number;
    title: string;
  }>;
  quizzes?: QuizQuestion[];
}

export async function generateStaticParams() {
  const paths: { year: string; subject: string }[] = [];
  const years = Object.keys(indexData);

  for (const year of years) {
    const dirPath = path.join(process.cwd(), "content", year);
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      files.forEach((file) => {
        if (file.endsWith(".json")) {
          paths.push({
            year,
            subject: file.replace(".json", ""),
          });
        }
      });
    }
  }

  return paths;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year, subject } = params;
  const filePath = path.join(process.cwd(), "content", year, `${subject}.json`);

  if (!fs.existsSync(filePath)) {
    return {};
  }

  try {
    const subjectData: RawSubjectData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const yearLabel = formatYearTitle(year);
    return {
      title: `Practice Quiz: ${subjectData.name} (${yearLabel}) | Study Buddy KKW`,
      description: `Test your understanding of ${subjectData.name} with interactive unit quizzes.`,
    };
  } catch {
    return {};
  }
}

export default async function SubjectQuizPage({ params }: PageProps) {
  const { year, subject } = params;
  const validYears = Object.keys(indexData);

  if (!validYears.includes(year)) {
    notFound();
  }

  const filePath = path.join(process.cwd(), "content", year, `${subject}.json`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  let subjectData: RawSubjectData;

  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    subjectData = JSON.parse(fileContent);
  } catch (error) {
    console.error("Failed to load subject details for quiz:", error);
    notFound();
  }

  const quizzes = subjectData.quizzes || [];

  return (
    <QuizRunner
      subjectId={subjectData.id}
      subjectName={subjectData.name}
      year={year}
      quizzes={quizzes}
      unitTitles={subjectData.units.map((u) => ({ unitNumber: u.unitNumber, title: u.title }))}
    />
  );
}
