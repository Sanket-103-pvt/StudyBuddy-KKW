"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Home,
  GraduationCap,
  Calculator,
  BarChart2,
  Trophy,
  Info,
  MessageSquare,
  Sun,
  Moon,
  Contrast,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

import { GithubIcon } from "@/components/icons";
import indexData from "@/content/index.json";
import { formatYearTitle } from "@/lib/year-utils";
import { useToast } from "@/components/ToastProvider";
import OfflineBadge from "@/components/OfflineBadge";

export default function Navbar() {
  const pathname = usePathname();
  const toast = useToast();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [yearsDropdownOpen, setYearsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setYearsDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.shiftKey && e.key.toLowerCase() === "h") {
        e.preventDefault();
        setTheme((prevTheme) => {
          const next = prevTheme === "high-contrast" ? "dark" : "high-contrast";
          if (next === "high-contrast") {
            toast.success("High Contrast Accessibility Mode Enabled (Alt+Shift+H)");
          } else {
            toast.info("High Contrast Mode Disabled");
          }
          return next;
        });
      }
    };

    window.addEventListener("click", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("click", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setTheme, toast]);

  // Close menus on route change
  useEffect(() => {
    setYearsDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("high-contrast");
      toast.success("Switched to High Contrast Theme");
    } else {
      setTheme("light");
    }
  };

  const yearKeys = Object.keys(indexData);
  const yearLinks = yearKeys.map((key) => ({
    name: formatYearTitle(key),
    href: `/${key}`,
  }));

  const isYearActive = yearLinks.some((l) => pathname === l.href);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/85 dark:bg-bg-dark/85 backdrop-blur-md border-b border-border-light/60 dark:border-border-dark/60 shadow-xs transition-colors">
      <div className="max-w-container-max mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Brand Mark */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-sora font-bold text-sm shadow-xs group-hover:scale-105 transition-transform">
            SB
          </div>
          <div className="flex flex-col">
            <span className="font-sora font-bold text-body-md text-on-surface dark:text-text-primary-dark tracking-tight leading-tight">
              Study Buddy
            </span>
            <span className="font-mono text-[10px] font-semibold text-blue-600 dark:text-blue-400 hidden sm:block">
              K.K. Wagh Hub
            </span>
          </div>
        </Link>

        {/* Desktop Streamlined Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link
            href="/"
            className={`font-inter text-body-sm font-medium transition-colors ${
              pathname === "/"
                ? "text-blue-600 dark:text-blue-400 font-semibold"
                : "text-text-secondary-light dark:text-text-secondary-dark hover:text-on-surface dark:hover:text-text-primary-dark"
            }`}
          >
            Home
          </Link>

          {/* Academic Years Interactive Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setYearsDropdownOpen(!yearsDropdownOpen)}
              className={`flex items-center gap-1.5 font-inter text-body-sm font-medium transition-colors py-1 ${
                isYearActive
                  ? "text-blue-600 dark:text-blue-400 font-semibold"
                  : "text-text-secondary-light dark:text-text-secondary-dark hover:text-on-surface dark:hover:text-text-primary-dark"
              }`}
            >
              <GraduationCap size={16} />
              <span>Academic Years</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${yearsDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {yearsDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-2xl shadow-xl p-2 animate-in fade-in-80 slide-in-from-top-2 duration-200">
                <div className="px-3 py-1.5 font-mono text-[10px] font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
                  Select Curriculum
                </div>
                {yearLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-inter text-body-sm transition-colors ${
                      pathname === item.href
                        ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold"
                        : "text-on-surface dark:text-text-primary-dark hover:bg-surface-container dark:hover:bg-inverse-surface"
                    }`}
                  >
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="h-4 w-px bg-border-light dark:bg-border-dark" />

          {/* Student Utilities */}
          <Link
            href="/calculator"
            className={`flex items-center gap-1.5 font-inter text-body-sm font-medium transition-colors ${
              pathname === "/calculator"
                ? "text-blue-600 dark:text-blue-400 font-semibold"
                : "text-text-secondary-light dark:text-text-secondary-dark hover:text-on-surface dark:hover:text-text-primary-dark"
            }`}
          >
            <Calculator size={16} />
            <span>SGPA / CGPA Calculator</span>
          </Link>

          <Link
            href="/analytics"
            className={`flex items-center gap-1.5 font-inter text-body-sm font-medium transition-colors ${
              pathname === "/analytics"
                ? "text-blue-600 dark:text-blue-400 font-semibold"
                : "text-text-secondary-light dark:text-text-secondary-dark hover:text-on-surface dark:hover:text-text-primary-dark"
            }`}
          >
            <BarChart2 size={16} />
            <span>Analytics</span>
          </Link>

          <Link
            href="/contribute"
            className={`flex items-center gap-1.5 font-inter text-body-sm font-medium transition-colors ${
              pathname === "/contribute"
                ? "text-blue-600 dark:text-blue-400 font-semibold"
                : "text-text-secondary-light dark:text-text-secondary-dark hover:text-on-surface dark:hover:text-text-primary-dark"
            }`}
          >
            <Trophy size={16} />
            <span>Contribute</span>
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <OfflineBadge />

          <button
            onClick={cycleTheme}
            className="p-2 rounded-xl border border-border-light dark:border-border-dark hover:bg-surface-container dark:hover:bg-inverse-surface text-on-surface dark:text-text-primary-dark transition-colors"
            title="Toggle Theme: Light / Dark / High Contrast (Alt+Shift+H)"
            aria-label="Toggle Theme"
          >
            {mounted ? (
              theme === "high-contrast" ? (
                <Contrast size={18} className="text-amber-500 font-bold" />
              ) : theme === "dark" ? (
                <Moon size={18} />
              ) : (
                <Sun size={18} />
              )
            ) : (
              <div className="w-4 h-4 rounded-full bg-surface-container animate-pulse" />
            )}
          </button>

          <a
            href="https://github.com/Sanket-103-pvt/StudyBuddy-KKW"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex p-2 rounded-xl border border-border-light dark:border-border-dark hover:bg-surface-container dark:hover:bg-inverse-surface text-text-secondary-light hover:text-on-surface transition-colors"
            aria-label="GitHub Repository"
          >
            <GithubIcon className="w-4.5 h-4.5" />
          </a>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-text-secondary-light dark:text-text-secondary-dark hover:bg-surface-container transition-colors"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border-light dark:border-border-dark bg-white dark:bg-bg-dark px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl font-inter text-body-sm font-medium text-on-surface dark:text-text-primary-dark hover:bg-surface-container"
          >
            <Home size={18} />
            <span>Home</span>
          </Link>

          <div className="px-3 font-mono text-[10px] font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider pt-2">
            Academic Courses
          </div>
          {yearLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 px-3 py-2 rounded-xl font-inter text-body-sm font-medium text-on-surface dark:text-text-primary-dark hover:bg-surface-container"
            >
              <GraduationCap size={18} />
              <span>{item.name}</span>
            </Link>
          ))}

          <div className="px-3 font-mono text-[10px] font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider pt-2">
            Student Utilities
          </div>
          <Link
            href="/calculator"
            className="flex items-center gap-2 px-3 py-2 rounded-xl font-inter text-body-sm font-medium text-on-surface dark:text-text-primary-dark hover:bg-surface-container"
          >
            <Calculator size={18} />
            <span>SGPA / CGPA Calculator</span>
          </Link>
          <Link
            href="/analytics"
            className="flex items-center gap-2 px-3 py-2 rounded-xl font-inter text-body-sm font-medium text-on-surface dark:text-text-primary-dark hover:bg-surface-container"
          >
            <BarChart2 size={18} />
            <span>Study Time Analytics</span>
          </Link>
          <Link
            href="/contribute"
            className="flex items-center gap-2 px-3 py-2 rounded-xl font-inter text-body-sm font-medium text-on-surface dark:text-text-primary-dark hover:bg-surface-container"
          >
            <Trophy size={18} />
            <span>Contribute & Leaderboard</span>
          </Link>

          <div className="px-3 font-mono text-[10px] font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider pt-2">
            Support
          </div>
          <Link
            href="/about"
            className="flex items-center gap-2 px-3 py-2 rounded-xl font-inter text-body-sm font-medium text-on-surface dark:text-text-primary-dark hover:bg-surface-container"
          >
            <Info size={18} />
            <span>About Platform</span>
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-2 px-3 py-2 rounded-xl font-inter text-body-sm font-medium text-on-surface dark:text-text-primary-dark hover:bg-surface-container"
          >
            <MessageSquare size={18} />
            <span>Contact & Support</span>
          </Link>
        </div>
      )}
    </header>
  );
}
