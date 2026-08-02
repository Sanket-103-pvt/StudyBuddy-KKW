"use client";

import { useState, useEffect, useCallback } from "react";

export interface SubjectProgress {
  completedUnits: number[]; // e.g. [1, 2]
  completedResources: string[]; // array of resource URLs
  lastUpdated?: string;
}

export interface OverallProgressSummary {
  totalSubjectsTracked: number;
  totalCompletedUnits: number;
  totalUnitsTracked: number;
  overallPercentage: number;
  subjectSummaries: Array<{
    subjectId: string;
    subjectName?: string;
    year?: string;
    percentage: number;
    completedUnitsCount: number;
    totalUnitsCount: number;
  }>;
}

const STORAGE_PREFIX = "sb_progress_";

export function getSubjectProgress(subjectId: string): SubjectProgress {
  if (typeof window === "undefined" || !subjectId) {
    return { completedUnits: [], completedResources: [] };
  }
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${subjectId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        completedUnits: Array.isArray(parsed.completedUnits) ? parsed.completedUnits : [],
        completedResources: Array.isArray(parsed.completedResources) ? parsed.completedResources : [],
        lastUpdated: parsed.lastUpdated,
      };
    }
  } catch (err) {
    console.error(`Failed to read syllabus progress for ${subjectId}`, err);
  }
  return { completedUnits: [], completedResources: [] };
}

export function saveSubjectProgress(subjectId: string, progress: SubjectProgress): void {
  if (typeof window === "undefined" || !subjectId) return;
  try {
    const dataToSave = {
      ...progress,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(`${STORAGE_PREFIX}${subjectId}`, JSON.stringify(dataToSave));
    // Dispatch a custom storage event for sync across components
    window.dispatchEvent(new Event("sb_progress_updated"));
  } catch (err) {
    console.error(`Failed to save syllabus progress for ${subjectId}`, err);
  }
}

export function calculateProgressPercentage(
  completedUnitsCount: number,
  totalUnitsCount: number
): number {
  if (totalUnitsCount <= 0) return 0;
  const pct = Math.round((completedUnitsCount / totalUnitsCount) * 100);
  return Math.min(100, Math.max(0, pct));
}

export function getOverallProgressSummary(): OverallProgressSummary {
  if (typeof window === "undefined") {
    return {
      totalSubjectsTracked: 0,
      totalCompletedUnits: 0,
      totalUnitsTracked: 0,
      overallPercentage: 0,
      subjectSummaries: [],
    };
  }

  const subjectSummaries: OverallProgressSummary["subjectSummaries"] = [];
  let totalCompleted = 0;
  let totalUnits = 0;

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX) && !key.startsWith("sb_progress_meta_")) {
        const subjectId = key.replace(STORAGE_PREFIX, "");
        const progress = getSubjectProgress(subjectId);

        
        // Retrieve metadata if saved
        const metaRaw = localStorage.getItem(`sb_progress_meta_${subjectId}`);
        let meta: { subjectName?: string; year?: string; totalUnits?: number } = {};
        if (metaRaw) {
          try { meta = JSON.parse(metaRaw); } catch {}
        }

        const totalU = meta.totalUnits || 6; // default 6 units if meta unavailable
        const completedU = progress.completedUnits.length;
        const pct = calculateProgressPercentage(completedU, totalU);

        totalCompleted += completedU;
        totalUnits += totalU;

        subjectSummaries.push({
          subjectId,
          subjectName: meta.subjectName || subjectId,
          year: meta.year || "",
          percentage: pct,
          completedUnitsCount: completedU,
          totalUnitsCount: totalU,
        });
      }
    }
  } catch (err) {
    console.error("Failed to calculate overall progress summary", err);
  }

  const overallPct = calculateProgressPercentage(totalCompleted, totalUnits);

  return {
    totalSubjectsTracked: subjectSummaries.length,
    totalCompletedUnits: totalCompleted,
    totalUnitsTracked: totalUnits,
    overallPercentage: overallPct,
    subjectSummaries,
  };
}

export function useSyllabusProgress(
  subjectId: string,
  totalUnitsCount: number,
  subjectName?: string,
  year?: string
) {
  const [progress, setProgress] = useState<SubjectProgress>({
    completedUnits: [],
    completedResources: [],
  });
  const [mounted, setMounted] = useState(false);

  const loadProgress = useCallback(() => {
    if (!subjectId) return;
    const current = getSubjectProgress(subjectId);
    setProgress(current);

    // Save subject metadata for overall summary calculations
    if (typeof window !== "undefined" && (subjectName || totalUnitsCount)) {
      try {
        localStorage.setItem(
          `sb_progress_meta_${subjectId}`,
          JSON.stringify({
            subjectName,
            year,
            totalUnits: totalUnitsCount,
          })
        );
      } catch {}
    }
  }, [subjectId, subjectName, year, totalUnitsCount]);

  useEffect(() => {
    setMounted(true);
    loadProgress();

    const handleStorageChange = () => {
      loadProgress();
    };

    window.addEventListener("sb_progress_updated", handleStorageChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("sb_progress_updated", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [loadProgress]);

  const toggleUnitCompletion = (
    unitNumber: number,
    unitResources: { url: string }[] = []
  ) => {
    const isCompleted = progress.completedUnits.includes(unitNumber);
    let updatedUnits: number[];
    let updatedResources = [...progress.completedResources];

    const resourceUrls = unitResources.map((r) => r.url);

    if (isCompleted) {
      // Unmark unit
      updatedUnits = progress.completedUnits.filter((u) => u !== unitNumber);
      // Also unmark resources of this unit
      updatedResources = updatedResources.filter((url) => !resourceUrls.includes(url));
    } else {
      // Mark unit completed
      updatedUnits = [...progress.completedUnits, unitNumber];
      // Mark all unit resources completed as well
      resourceUrls.forEach((url) => {
        if (!updatedResources.includes(url)) {
          updatedResources.push(url);
        }
      });
    }

    const newProgress: SubjectProgress = {
      completedUnits: updatedUnits,
      completedResources: updatedResources,
    };

    setProgress(newProgress);
    saveSubjectProgress(subjectId, newProgress);
    return !isCompleted;
  };

  const toggleResourceCompletion = (
    resourceUrl: string,
    unitNumber?: number,
    unitResources: { url: string }[] = []
  ) => {
    const isCompleted = progress.completedResources.includes(resourceUrl);
    let updatedResources: string[];

    if (isCompleted) {
      updatedResources = progress.completedResources.filter((url) => url !== resourceUrl);
    } else {
      updatedResources = [...progress.completedResources, resourceUrl];
    }

    let updatedUnits = [...progress.completedUnits];

    // If unitNumber & unitResources are provided, check if unit is fully completed
    if (unitNumber && unitResources.length > 0) {
      const allResourcesChecked = unitResources.every((r) =>
        r.url === resourceUrl ? !isCompleted : updatedResources.includes(r.url)
      );

      if (allResourcesChecked && !updatedUnits.includes(unitNumber)) {
        updatedUnits.push(unitNumber);
      } else if (!allResourcesChecked && updatedUnits.includes(unitNumber)) {
        updatedUnits = updatedUnits.filter((u) => u !== unitNumber);
      }
    }

    const newProgress: SubjectProgress = {
      completedUnits: updatedUnits,
      completedResources: updatedResources,
    };

    setProgress(newProgress);
    saveSubjectProgress(subjectId, newProgress);
    return !isCompleted;
  };

  const isUnitCompleted = (unitNumber: number) =>
    mounted && progress.completedUnits.includes(unitNumber);

  const isResourceCompleted = (resourceUrl: string) =>
    mounted && progress.completedResources.includes(resourceUrl);

  const percentage = calculateProgressPercentage(
    progress.completedUnits.length,
    totalUnitsCount
  );

  return {
    progress,
    mounted,
    percentage,
    completedUnitsCount: progress.completedUnits.length,
    totalUnitsCount,
    isUnitCompleted,
    isResourceCompleted,
    toggleUnitCompletion,
    toggleResourceCompletion,
  };
}
