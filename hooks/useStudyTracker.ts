"use client";

import { useEffect, useRef } from "react";

export interface StudySessionRecord {
  date: string; // YYYY-MM-DD
  subjectId: string;
  subjectName: string;
  year: string;
  secondsSpent: number;
}

export const STORAGE_KEY = "sb_study_analytics";
const IDLE_TIMEOUT_MS = 60000; // 60 seconds of inactivity pauses tracking

/**
 * Gets today's ISO date string (YYYY-MM-DD)
 */
export function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Retrieves all stored study analytics records from localStorage
 */
export function getStudyAnalytics(): StudySessionRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Saves all study analytics records to localStorage
 */
export function saveStudyAnalytics(records: StudySessionRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error("Failed to save study analytics to localStorage:", err);
  }
}

/**
 * Clears all study analytics records from localStorage
 */
export function clearStudyAnalytics(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Retrieves analytics records for the past N days (default 7 days)
 */
export function getWeeklyStudyAnalytics(days: number = 7): StudySessionRecord[] {
  const allRecords = getStudyAnalytics();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - (days - 1));
  cutoffDate.setHours(0, 0, 0, 0);

  return allRecords.filter((rec) => {
    const recDate = new Date(rec.date);
    return recDate >= cutoffDate;
  });
}

/**
 * Helper to update or accumulate seconds spent for a subject on a specific date
 */
export function recordSubjectStudyTime(
  subjectId: string,
  subjectName: string,
  year: string,
  additionalSeconds: number
): void {
  if (additionalSeconds <= 0) return;

  const today = getTodayDateString();
  const allRecords = getStudyAnalytics();

  const existingIndex = allRecords.findIndex(
    (r) => r.date === today && r.subjectId === subjectId
  );

  if (existingIndex >= 0) {
    allRecords[existingIndex].secondsSpent += additionalSeconds;
    allRecords[existingIndex].subjectName = subjectName; // keep updated
    allRecords[existingIndex].year = year;
  } else {
    allRecords.push({
      date: today,
      subjectId,
      subjectName,
      year,
      secondsSpent: additionalSeconds,
    });
  }

  saveStudyAnalytics(allRecords);
}

interface UseStudyTrackerProps {
  subjectId?: string;
  subjectName?: string;
  year?: string;
}

/**
 * Custom React hook to measure active study time on subject pages.
 * Pauses automatically when tab is hidden, window blurred, or user is idle.
 */
export function useStudyTracker({ subjectId, subjectName, year }: UseStudyTrackerProps) {
  const accumulatedSecondsRef = useRef<number>(0);
  const lastActiveTimestampRef = useRef<number>(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!subjectId || !subjectName || !year) return;

    let isTabActive = document.visibilityState === "visible";
    let isUserActive = true;
    let idleTimer: NodeJS.Timeout | null = null;

    const resetIdleTimer = () => {
      isUserActive = true;
      lastActiveTimestampRef.current = Date.now();
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        isUserActive = false;
      }, IDLE_TIMEOUT_MS);
    };

    // User activity listeners
    const activityEvents = ["mousemove", "keydown", "scroll", "touchstart", "click"];
    activityEvents.forEach((evt) => window.addEventListener(evt, resetIdleTimer));
    resetIdleTimer();

    // Visibility and focus listeners
    const handleVisibilityChange = () => {
      isTabActive = document.visibilityState === "visible";
      if (!isTabActive) {
        flushTime();
      } else {
        lastActiveTimestampRef.current = Date.now();
      }
    };

    const handleBlur = () => {
      isTabActive = false;
      flushTime();
    };

    const handleFocus = () => {
      isTabActive = true;
      lastActiveTimestampRef.current = Date.now();
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    // Save accumulated seconds to localStorage
    const flushTime = () => {
      if (accumulatedSecondsRef.current > 0) {
        recordSubjectStudyTime(
          subjectId,
          subjectName,
          year,
          accumulatedSecondsRef.current
        );
        accumulatedSecondsRef.current = 0;
      }
    };

    // 1-second interval to tick study time
    intervalRef.current = setInterval(() => {
      if (isTabActive && isUserActive) {
        accumulatedSecondsRef.current += 1;
        // Periodically sync to localStorage every 5 seconds
        if (accumulatedSecondsRef.current >= 5) {
          flushTime();
        }
      }
    }, 1000);

    // Cleanup on page navigate or unmount
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (idleTimer) clearTimeout(idleTimer);
      activityEvents.forEach((evt) => window.removeEventListener(evt, resetIdleTimer));
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      flushTime();
    };
  }, [subjectId, subjectName, year]);
}
