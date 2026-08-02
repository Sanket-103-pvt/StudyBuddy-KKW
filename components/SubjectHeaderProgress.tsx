"use client";

import React from "react";
import { useSyllabusProgress } from "@/hooks/useSyllabusProgress";
import SyllabusProgressRing from "@/components/SyllabusProgressRing";

interface SubjectHeaderProgressProps {
  subjectId: string;
  totalUnitsCount: number;
  subjectName?: string;
  year?: string;
}

export default function SubjectHeaderProgress({
  subjectId,
  totalUnitsCount,
  subjectName,
  year,
}: SubjectHeaderProgressProps) {
  const { mounted, percentage, completedUnitsCount } = useSyllabusProgress(
    subjectId,
    totalUnitsCount,
    subjectName,
    year
  );

  if (!mounted) {
    return (
      <div className="w-[180px] h-[64px] bg-surface-container dark:bg-inverse-surface rounded-2xl animate-pulse" />
    );
  }

  return (
    <SyllabusProgressRing
      percentage={percentage}
      completedUnitsCount={completedUnitsCount}
      totalUnitsCount={totalUnitsCount}
    />
  );
}
