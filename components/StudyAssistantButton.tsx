"use client";

import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import StudyPlanModal from "@/components/StudyPlanModal";

interface StudyAssistantButtonProps {
  subjectId: string;
  subjectName: string;
  year?: string;
}

export default function StudyAssistantButton({
  subjectId,
  subjectName,
  year,
}: StudyAssistantButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-blue-600 text-white font-sora font-semibold text-body-sm shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
      >
        <Sparkles size={16} className="animate-pulse group-hover:rotate-12 transition-transform duration-200" />
        AI Study Plan
      </button>


      <StudyPlanModal
        subjectId={subjectId}
        subjectName={subjectName}
        year={year}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
