"use client";

import React from "react";

interface SyllabusProgressRingProps {
  percentage: number;
  completedUnitsCount: number;
  totalUnitsCount: number;
  size?: number;
  strokeWidth?: number;
  showText?: boolean;
}

export default function SyllabusProgressRing({
  percentage,
  completedUnitsCount,
  totalUnitsCount,
  size = 64,
  strokeWidth = 6,
  showText = true,
}: SyllabusProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className="flex items-center gap-3 bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark p-2.5 sm:p-3 rounded-2xl shadow-sm hover:shadow transition-shadow"
      title={`Syllabus Progress: ${completedUnitsCount} of ${totalUnitsCount} units completed (${percentage}%)`}
    >
      {/* SVG Ring */}
      <div className="relative shrink-0 flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-surface-container dark:text-inverse-surface"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`transition-all duration-500 ease-out ${
              percentage === 100
                ? "text-emerald-500"
                : percentage >= 50
                ? "text-primary dark:text-primary-fixed-dim"
                : "text-amber-500"
            }`}
          />
        </svg>

        {/* Inner percentage text */}
        <span className="absolute font-sora font-bold text-label-mono text-on-surface dark:text-text-primary-dark">
          {percentage}%
        </span>
      </div>

      {/* Label & Unit counts */}
      {showText && (
        <div className="flex flex-col">
          <span className="font-sora font-semibold text-body-sm text-on-surface dark:text-text-primary-dark leading-tight">
            Syllabus Progress
          </span>
          <span className="font-inter text-[12px] text-text-secondary-light dark:text-text-secondary-dark mt-0.5">
            {completedUnitsCount} of {totalUnitsCount} units completed
          </span>
        </div>
      )}
    </div>
  );
}
