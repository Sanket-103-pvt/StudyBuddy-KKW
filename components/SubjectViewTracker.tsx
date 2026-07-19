"use client";

import { useEffect } from "react";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";

interface SubjectViewTrackerProps {
  subjectId: string;
  subjectName: string;
  year: string;
}

export default function SubjectViewTracker({
  subjectId,
  subjectName,
  year,
}: SubjectViewTrackerProps) {
  const { addToHistory } = useRecentlyViewed();

  useEffect(() => {
    addToHistory({ subjectId, subjectName, year });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectId, subjectName, year]);

  return null;
}
