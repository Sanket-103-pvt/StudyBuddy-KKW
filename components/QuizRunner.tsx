"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Timer,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  BookOpen,
  Sparkles,
  ArrowRight,
  Check,
  Trophy,
} from "lucide-react";
import Footer from "@/components/Footer";

import { useToast } from "@/components/ToastProvider";
import { formatYearTitle } from "@/lib/year-utils";
import {
  getHighScore,
  saveQuizScore,
  formatQuizTime,
  type QuizQuestion,
} from "@/lib/quiz-utils";

interface QuizRunnerProps {
  subjectId: string;
  subjectName: string;
  year: string;
  quizzes: QuizQuestion[];
  unitTitles: Array<{ unitNumber: number; title: string }>;
}

export default function QuizRunner({
  subjectId,
  subjectName,
  year,
  quizzes,
  unitTitles,
}: QuizRunnerProps) {
  const toast = useToast();
  const [mounted, setMounted] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<number | "all">("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [highScore, setHighScore] = useState(0);

  // Default fallback questions if JSON has no custom quizzes array
  const activeQuestions = useMemo(() => {
    let pool = quizzes.length > 0 ? quizzes : [];

    if (pool.length === 0) {
      // Generate default unit review questions based on subject units
      pool = unitTitles.map((u, idx) => ({
        id: `auto-q-${idx + 1}`,
        unitNumber: u.unitNumber,
        question: `Which key concept is primarily covered under Unit ${u.unitNumber} (${u.title})?`,
        options: [
          `Core principles and applications of ${u.title}`,
          "Basic historical introduction & terminology",
          "Advanced lab experimental setups",
          "Non-syllabus optional reference topics",
        ],
        correctIndex: 0,
        explanation: `Unit ${u.unitNumber} focuses on the core concepts, theoretical proofs, and practical algorithms of ${u.title}.`,
      }));
    }

    if (selectedUnit === "all") return pool;
    return pool.filter((q) => q.unitNumber === selectedUnit);
  }, [quizzes, unitTitles, selectedUnit]);

  // Load high score
  useEffect(() => {
    setMounted(true);
    setHighScore(getHighScore(subjectId));
  }, [subjectId]);

  // Timer loop
  useEffect(() => {
    if (!mounted || isFinished || activeQuestions.length === 0) return;

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [mounted, isFinished, activeQuestions.length]);

  const currentQuestion = activeQuestions[currentIndex];

  const handleSelectOption = (index: number) => {
    if (selectedOption !== null || isFinished) return; // Prevent changing choice
    setSelectedOption(index);
    setAnswers((prev) => ({ ...prev, [currentIndex]: index }));
  };

  const handleNext = () => {
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(answers[currentIndex + 1] ?? null);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsFinished(true);

    // Calculate score
    let correctCount = 0;
    activeQuestions.forEach((q, idx) => {
      const chosen = answers[idx] ?? (idx === currentIndex ? selectedOption : null);
      if (chosen === q.correctIndex) {
        correctCount++;
      }
    });

    const scorePct = Math.round((correctCount / activeQuestions.length) * 100);

    // Save score
    saveQuizScore({
      subjectId,
      subjectName,
      scorePercentage: scorePct,
      correctAnswersCount: correctCount,
      totalQuestionsCount: activeQuestions.length,
      timeSpentSeconds: elapsedSeconds,
      completedAt: new Date().toISOString(),
    });

    // Refresh high score
    const newHigh = getHighScore(subjectId);
    setHighScore(newHigh);

    if (scorePct >= 80) {
      toast.success(`Outstanding score: ${scorePct}%! High Score Saved!`);
    } else {
      toast.info(`Quiz completed! Score: ${scorePct}%. Keep practicing!`);
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswers({});
    setElapsedSeconds(0);
    setIsFinished(false);
  };

  if (!mounted) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow max-w-container-max w-full mx-auto px-margin-mobile md:px-margin-desktop py-12 animate-pulse">
          <div className="h-10 w-48 bg-surface-container dark:bg-inverse-surface rounded-xl mb-6" />
          <div className="h-64 bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-2xl" />
        </main>
        <Footer />
      </div>
    );
  }

  // Calculate final score when finished
  const correctAnswersCount = activeQuestions.reduce((acc, q, idx) => {
    return answers[idx] === q.correctIndex ? acc + 1 : acc;
  }, 0);

  const scorePercentage = Math.round((correctAnswersCount / activeQuestions.length) * 100);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow max-w-container-max w-full mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12">
        {/* Back Link */}
        <Link
          href={`/${year}/${subjectId}`}
          className="inline-flex items-center gap-1 text-body-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary-fixed-dim mb-6 transition-colors group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-[2px] transition-transform" />
          Back to {subjectName} Notes
        </Link>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-border-light dark:border-border-dark">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-inverse-surface px-3 py-1 rounded-full text-label-mono font-mono text-primary dark:text-primary-fixed-dim mb-2 border border-primary/20">
              <Sparkles size={14} />
              {formatYearTitle(year)} Practice Engine
            </div>
            <h1 className="font-sora font-bold text-headline-lg text-on-surface dark:text-text-primary-dark">
              {subjectName} — Unit Practice Quiz
            </h1>
          </div>

          {/* High Score Badge & Timer */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark px-3.5 py-2 rounded-xl text-body-sm font-semibold text-on-surface dark:text-text-primary-dark">
              <Trophy size={16} className="text-amber-500" />
              <span>High Score: {highScore}%</span>
            </div>
            <div className="flex items-center gap-2 bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark px-3.5 py-2 rounded-xl text-body-sm font-mono text-primary dark:text-primary-fixed-dim font-bold">
              <Timer size={16} />
              <span>{formatQuizTime(elapsedSeconds)}</span>
            </div>
          </div>
        </div>

        {/* Unit Selector Filter Bar */}
        {!isFinished && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
            <button
              onClick={() => {
                setSelectedUnit("all");
                restartQuiz();
              }}
              className={`px-3.5 py-1.5 rounded-full font-inter text-body-sm font-semibold transition-all shrink-0 ${
                selectedUnit === "all"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-surface-container dark:bg-inverse-surface text-text-secondary-light dark:text-text-secondary-dark hover:text-on-surface"
              }`}
            >
              All Units ({quizzes.length || unitTitles.length})
            </button>
            {unitTitles.map((u) => (
              <button
                key={u.unitNumber}
                onClick={() => {
                  setSelectedUnit(u.unitNumber);
                  restartQuiz();
                }}
                className={`px-3.5 py-1.5 rounded-full font-inter text-body-sm font-semibold transition-all shrink-0 ${
                  selectedUnit === u.unitNumber
                    ? "bg-primary text-white shadow-sm"
                    : "bg-surface-container dark:bg-inverse-surface text-text-secondary-light dark:text-text-secondary-dark hover:text-on-surface"
                }`}
              >
                Unit {u.unitNumber}
              </button>
            ))}
          </div>
        )}

        {/* ── QUIZ DASHBOARD (FINISHED STATE) ────────────────────────────── */}
        {isFinished ? (
          <div className="max-w-2xl mx-auto bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-2xl shadow-lg p-8 text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 dark:bg-inverse-surface flex items-center justify-center mb-6">
              <Award size={40} className="text-primary dark:text-primary-fixed-dim" />
            </div>

            <h2 className="font-sora font-bold text-headline-md text-on-surface dark:text-text-primary-dark mb-2">
              {scorePercentage >= 80 ? "Quiz Mastered!" : scorePercentage >= 50 ? "Good Effort!" : "Keep Practicing!"}
            </h2>
            <p className="font-inter text-body-md text-text-secondary-light dark:text-text-secondary-dark mb-6">
              You scored <strong className="text-primary dark:text-primary-fixed-dim">{scorePercentage}%</strong> on {subjectName} practice quiz.
            </p>

            {/* Score Breakdown Cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-surface-container dark:bg-inverse-surface p-4 rounded-xl">
                <div className="font-sora font-bold text-headline-sm text-on-surface dark:text-text-primary-dark">
                  {correctAnswersCount} / {activeQuestions.length}
                </div>
                <div className="font-inter text-[11px] text-text-secondary-light dark:text-text-secondary-dark">
                  Correct Answers
                </div>
              </div>

              <div className="bg-surface-container dark:bg-inverse-surface p-4 rounded-xl">
                <div className="font-sora font-bold text-headline-sm text-primary dark:text-primary-fixed-dim">
                  {formatQuizTime(elapsedSeconds)}
                </div>
                <div className="font-inter text-[11px] text-text-secondary-light dark:text-text-secondary-dark">
                  Time Taken
                </div>
              </div>

              <div className="bg-surface-container dark:bg-inverse-surface p-4 rounded-xl">
                <div className="font-sora font-bold text-headline-sm text-amber-500">
                  {highScore}%
                </div>
                <div className="font-inter text-[11px] text-text-secondary-light dark:text-text-secondary-dark">
                  Personal Best
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={restartQuiz}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-sora font-semibold hover:bg-primary-container shadow-sm transition-all active:scale-95"
              >
                <RotateCcw size={18} /> Retake Quiz
              </button>
              <Link
                href={`/${year}/${subjectId}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border-light dark:border-border-dark font-sora font-semibold text-on-surface dark:text-text-primary-dark hover:bg-surface-container transition-all active:scale-95"
              >
                <BookOpen size={18} /> Review Notes
              </Link>
            </div>
          </div>
        ) : activeQuestions.length > 0 && currentQuestion ? (
          /* ── ACTIVE QUESTION CARD ────────────────────────────────────────── */
          <div className="max-w-3xl mx-auto">
            {/* Question Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center font-inter text-body-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">
                <span>
                  Question {currentIndex + 1} of {activeQuestions.length}
                </span>
                <span>
                  {Math.round(((currentIndex + 1) / activeQuestions.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-surface-container dark:bg-inverse-surface h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-primary dark:bg-primary-fixed-dim h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / activeQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Container */}
            <div className="bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-2xl shadow-sm p-6 md:p-8">
              {/* Unit Tag */}
              {currentQuestion.unitNumber && (
                <span className="inline-block font-mono text-[11px] font-semibold text-primary dark:text-primary-fixed-dim bg-primary/10 dark:bg-inverse-surface px-2.5 py-1 rounded-md uppercase mb-4 border border-primary/20">
                  Unit {currentQuestion.unitNumber}
                </span>
              )}

              {/* Question Text */}
              <h2 className="font-sora font-semibold text-headline-sm text-on-surface dark:text-text-primary-dark mb-6 leading-snug">
                {currentQuestion.question}
              </h2>

              {/* Options Grid */}
              <div className="space-y-3.5 mb-6">
                {currentQuestion.options.map((optionText, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQuestion.correctIndex;
                  const hasAnswered = selectedOption !== null;

                  let styleClass =
                    "border-border-light dark:border-border-dark hover:border-primary/40 bg-surface-container-lowest dark:bg-bg-dark text-on-surface dark:text-text-primary-dark";

                  if (hasAnswered) {
                    if (isCorrect) {
                      styleClass =
                        "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-semibold shadow-sm";
                    } else if (isSelected && !isCorrect) {
                      styleClass =
                        "border-red-500 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 font-semibold";
                    } else {
                      styleClass =
                        "opacity-50 border-border-light dark:border-border-dark bg-surface-container-lowest dark:bg-bg-dark text-text-secondary-light";
                    }
                  }

                  const optionLabels = ["A", "B", "C", "D"];

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={hasAnswered}
                      className={`w-full p-4 rounded-xl border text-left flex items-start justify-between gap-4 transition-all duration-200 ${styleClass} ${
                        !hasAnswered ? "active:scale-[0.99] cursor-pointer" : "cursor-default"
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="w-7 h-7 rounded-lg bg-surface-container dark:bg-inverse-surface flex items-center justify-center font-mono font-bold text-body-sm text-on-surface dark:text-text-primary-dark shrink-0">
                          {optionLabels[idx] || idx + 1}
                        </span>
                        <span className="font-inter text-body-md pt-0.5">{optionText}</span>
                      </div>

                      {hasAnswered && isCorrect && (
                        <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-1" />
                      )}
                      {hasAnswered && isSelected && !isCorrect && (
                        <XCircle size={20} className="text-red-500 shrink-0 mt-1" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Immediate Feedback Explanation Card */}
              {selectedOption !== null && (
                <div
                  className={`p-4 rounded-xl border mb-6 animate-in slide-in-from-bottom-2 duration-300 ${
                    selectedOption === currentQuestion.correctIndex
                      ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300"
                      : "bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300"
                  }`}
                >
                  <div className="font-sora font-semibold text-body-sm mb-1 flex items-center gap-2">
                    {selectedOption === currentQuestion.correctIndex ? (
                      <>
                        <Check size={16} className="text-emerald-600" /> Correct!
                      </>
                    ) : (
                      <>
                        <HelpCircle size={16} className="text-amber-600" /> Explanation:
                      </>
                    )}
                  </div>
                  <p className="font-inter text-body-sm leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}

              {/* Action Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  disabled={selectedOption === null}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-sora font-semibold hover:bg-primary-container shadow transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentIndex === activeQuestions.length - 1 ? "Finish Quiz" : "Next Question"}
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-text-secondary-light">
            No quiz questions found for this unit filter.
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
