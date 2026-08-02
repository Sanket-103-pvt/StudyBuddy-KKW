// lib/quiz-utils.ts
// Data contracts and storage utilities for the Practice Quiz Engine

export interface QuizQuestion {
  id: string;
  unitNumber?: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizScoreRecord {
  subjectId: string;
  subjectName: string;
  scorePercentage: number;
  correctAnswersCount: number;
  totalQuestionsCount: number;
  timeSpentSeconds: number;
  completedAt: string;
}

const HIGH_SCORE_PREFIX = "sb_quiz_highscore_";
const HISTORY_PREFIX = "sb_quiz_history_";

export function getHighScore(subjectId: string): number {
  if (typeof window === "undefined" || !subjectId) return 0;
  try {
    const val = localStorage.getItem(`${HIGH_SCORE_PREFIX}${subjectId}`);
    return val ? parseInt(val, 10) : 0;
  } catch {
    return 0;
  }
}

export function saveQuizScore(record: QuizScoreRecord): void {
  if (typeof window === "undefined" || !record.subjectId) return;
  try {
    // 1. Update High Score if new score is higher
    const currentHigh = getHighScore(record.subjectId);
    if (record.scorePercentage > currentHigh) {
      localStorage.setItem(`${HIGH_SCORE_PREFIX}${record.subjectId}`, record.scorePercentage.toString());
    }

    // 2. Append to score history
    const historyKey = `${HISTORY_PREFIX}${record.subjectId}`;
    const existingRaw = localStorage.getItem(historyKey);
    const history: QuizScoreRecord[] = existingRaw ? JSON.parse(existingRaw) : [];
    history.unshift(record);

    // Keep last 10 attempts
    localStorage.setItem(historyKey, JSON.stringify(history.slice(0, 10)));

    // Notify storage listeners
    window.dispatchEvent(new Event("sb_quiz_score_updated"));
  } catch (err) {
    console.error("Failed to save quiz score:", err);
  }
}

export function formatQuizTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const padMin = mins.toString().padStart(2, "0");
  const padSec = secs.toString().padStart(2, "0");
  return `${padMin}:${padSec}`;
}
