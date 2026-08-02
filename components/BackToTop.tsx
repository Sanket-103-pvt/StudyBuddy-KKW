"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

interface BackToTopProps {
  scrollContainerId?: string;
}

// BackToTop button — scrolls the main content container to top.
// When used inside a fixed-height app shell, we must scroll the inner container not window.
export default function BackToTop({ scrollContainerId }: BackToTopProps) {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const container = scrollContainerId
      ? document.getElementById(scrollContainerId)
      : null;
    const target = container || window;

    const handleScroll = () => {
      const scrollY = container ? container.scrollTop : window.scrollY;
      setShowButton(scrollY > 300);
    };

    target.addEventListener("scroll", handleScroll, { passive: true });
    return () => target.removeEventListener("scroll", handleScroll);
  }, [scrollContainerId]);

  const scrollToTop = () => {
    const container = scrollContainerId
      ? document.getElementById(scrollContainerId)
      : null;

    if (container) {
      container.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-50 p-3 rounded-full bg-primary text-white shadow-lg hover:bg-primary-container transition-all duration-300 ${
        showButton ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      aria-label="Back to top"
    >
      <ArrowUp size={20} />
    </button>
  );
}
