"use client";

import React, { useState, useEffect } from "react";
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
  Menu,
  X,
  Sparkles,
  Search,
} from "lucide-react";
import { GithubIcon } from "@/components/icons";
import indexData from "@/content/index.json";
import { formatYearTitle } from "@/lib/year-utils";
import { useToast } from "@/components/ToastProvider";
import OfflineBadge from "@/components/OfflineBadge";

export default function Sidebar() {
  const pathname = usePathname();
  const toast = useToast();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.shiftKey && e.key.toLowerCase() === "h") {
        e.preventDefault();
        setTheme((prevTheme) => {
          const next = prevTheme === "high-contrast" ? "dark" : "high-contrast";
          if (next === "high-contrast") {
            toast.success("High Contrast Accessibility Mode Enabled 👁️ (Alt+Shift+H)");
          } else {
            toast.info("High Contrast Mode Disabled");
          }
          return next;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setTheme, toast]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("high-contrast");
      toast.success("Switched to High Contrast Theme 👁️");
    } else {
      setTheme("light");
    }
  };

  const yearKeys = Object.keys(indexData);

  const yearLinks = yearKeys.map((yearKey) => ({
    name: formatYearTitle(yearKey),
    href: `/${yearKey}`,
    icon: GraduationCap,
  }));

  const mainNav = [{ name: "Dashboard", href: "/", icon: Home }];

  const toolNav = [
    { name: "SGPA / CGPA Calculator", href: "/calculator", icon: Calculator },
    { name: "Study Time Analytics", href: "/analytics", icon: BarChart2 },
    { name: "Contribute & Leaderboard", href: "/contribute", icon: Trophy },
  ];

  const infoNav = [
    { name: "About Platform", href: "/about", icon: Info },
    { name: "Contact & Support", href: "/contact", icon: MessageSquare },
  ];

  const triggerSearch = () => {
    const searchInput = document.querySelector<HTMLInputElement>("input[type='search'], input[placeholder*='Search']");
    if (searchInput) {
      searchInput.focus();
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Top Mobile Bar (Visible on mobile/tablet screens < lg) */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/95 dark:bg-bg-dark/95 backdrop-blur-md border-b border-border-light dark:border-border-dark px-4 h-16 flex items-center justify-between shadow-xs">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-sora font-bold text-sm shadow-xs">
            SB
          </div>
          <span className="font-sora font-bold text-body-md text-on-surface dark:text-text-primary-dark">
            Study Buddy KKW
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <OfflineBadge />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-surface-container dark:hover:bg-inverse-surface transition-colors"
            aria-label="Toggle Navigation Sidebar"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Overlay Backdrop for Mobile Drawer */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Vertical Sidebar Navigation Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 lg:z-auto shrink-0 h-screen w-72 bg-surface-container-lowest dark:bg-bg-dark border-r border-border-light dark:border-border-dark flex flex-col justify-between p-4 transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col gap-5 overflow-y-auto pr-1">
          {/* Sidebar Brand Header */}
          <div className="flex items-center justify-between pt-1 pb-3 border-b border-border-light/70 dark:border-border-dark/70">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-sora font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
                SB
              </div>
              <div className="flex flex-col">
                <span className="font-sora font-bold text-body-md text-on-surface dark:text-text-primary-dark tracking-tight leading-tight">
                  Study Buddy
                </span>
                <span className="font-mono text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <Sparkles size={11} /> K.K. Wagh Hub
                </span>
              </div>
            </Link>

            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden text-text-secondary-light dark:text-text-secondary-dark hover:text-on-surface p-1"
            >
              <X size={20} />
            </button>
          </div>

          {/* Search Trigger Button inside Sidebar */}
          <button
            onClick={triggerSearch}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-surface-container dark:bg-inverse-surface border border-border-light/60 dark:border-border-dark/60 text-text-secondary-light dark:text-text-secondary-dark hover:border-blue-500/40 transition-all text-body-sm font-inter text-left"
          >
            <span className="flex items-center gap-2">
              <Search size={16} className="text-text-secondary-light dark:text-text-secondary-dark" />
              <span>Search notes...</span>
            </span>
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark rounded text-text-secondary-light">
              Ctrl+K
            </kbd>
          </button>

          {/* Navigation Category 1: Main */}
          <div>
            <div className="px-3 mb-2 font-mono text-[10px] font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
              Navigation
            </div>
            <nav className="space-y-1">
              {mainNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-inter text-body-sm font-medium transition-all ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold shadow-xs border border-blue-200 dark:border-blue-800/50"
                        : "text-text-secondary-light dark:text-text-secondary-dark hover:bg-surface-container dark:hover:bg-inverse-surface hover:text-on-surface dark:hover:text-text-primary-dark"
                    }`}
                  >
                    <Icon size={18} className={isActive ? "text-blue-600 dark:text-blue-400" : ""} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Navigation Category 2: Academic Years */}
          <div>
            <div className="px-3 mb-2 font-mono text-[10px] font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
              Academic Courses
            </div>
            <nav className="space-y-1">
              {yearLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-inter text-body-sm font-medium transition-all ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold shadow-xs border border-blue-200 dark:border-blue-800/50"
                        : "text-text-secondary-light dark:text-text-secondary-dark hover:bg-surface-container dark:hover:bg-inverse-surface hover:text-on-surface dark:hover:text-text-primary-dark"
                    }`}
                  >
                    <Icon size={18} className={isActive ? "text-blue-600 dark:text-blue-400" : ""} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Navigation Category 3: Student Tools */}
          <div>
            <div className="px-3 mb-2 font-mono text-[10px] font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
              Student Utilities
            </div>
            <nav className="space-y-1">
              {toolNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-inter text-body-sm font-medium transition-all ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold shadow-xs border border-blue-200 dark:border-blue-800/50"
                        : "text-text-secondary-light dark:text-text-secondary-dark hover:bg-surface-container dark:hover:bg-inverse-surface hover:text-on-surface dark:hover:text-text-primary-dark"
                    }`}
                  >
                    <Icon size={18} className={isActive ? "text-blue-600 dark:text-blue-400" : ""} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Navigation Category 4: Platform Info */}
          <div>
            <div className="px-3 mb-2 font-mono text-[10px] font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
              Support
            </div>
            <nav className="space-y-1">
              {infoNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-inter text-body-sm font-medium transition-all ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold shadow-xs border border-blue-200 dark:border-blue-800/50"
                        : "text-text-secondary-light dark:text-text-secondary-dark hover:bg-surface-container dark:hover:bg-inverse-surface hover:text-on-surface dark:hover:text-text-primary-dark"
                    }`}
                  >
                    <Icon size={18} className={isActive ? "text-blue-600 dark:text-blue-400" : ""} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="pt-4 border-t border-border-light/70 dark:border-border-dark/70 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-inter text-body-xs text-text-secondary-light dark:text-text-secondary-dark font-medium">
              Theme
            </span>
            <button
              onClick={cycleTheme}
              className="p-2 rounded-xl border border-border-light dark:border-border-dark hover:bg-surface-container dark:hover:bg-inverse-surface text-on-surface dark:text-text-primary-dark transition-colors flex items-center gap-2 text-body-xs font-medium"
              title="Toggle Theme: Light / Dark / High Contrast (Alt+Shift+H)"
            >
              {mounted ? (
                theme === "high-contrast" ? (
                  <>
                    <Contrast size={16} className="text-amber-500 font-bold" /> High Contrast
                  </>
                ) : theme === "dark" ? (
                  <>
                    <Moon size={16} /> Dark Mode
                  </>
                ) : (
                  <>
                    <Sun size={16} /> Light Mode
                  </>
                )
              ) : (
                <div className="w-16 h-4 bg-surface-container rounded animate-pulse" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <OfflineBadge />
            <a
              href="https://github.com/Sanket-103-pvt/StudyBuddy-KKW"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl border border-border-light dark:border-border-dark hover:bg-surface-container dark:hover:bg-inverse-surface text-text-secondary-light hover:text-on-surface transition-colors"
              aria-label="GitHub Repository"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
