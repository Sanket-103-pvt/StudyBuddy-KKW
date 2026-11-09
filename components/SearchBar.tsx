"use client";

// Subject search. Type a subject name (optionally pick a year) and open that subject's page.
// Used inline on the home page and inside the global Ctrl+K command palette.

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, BookOpen } from "lucide-react";
import { buildSearchIndex, filterSearchIndex, getSearchYears, type SearchResult } from "@/lib/search-index";
import { formatShortYear } from "@/lib/year-utils";

interface SearchBarProps {
  autoFocus?: boolean;
  /** Called after navigating to a subject (e.g. to close a modal). */
  onNavigate?: () => void;
}

export default function SearchBar({ autoFocus = false, onNavigate }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [year, setYear] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const index = useMemo(() => buildSearchIndex(), []);
  const years = useMemo(() => getSearchYears(index), [index]);
  const results = useMemo(
    () => filterSearchIndex(index, query, { year, limit: 12 }),
    [index, query, year]
  );

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const select = (item: SearchResult) => {
    setQuery("");
    setIsOpen(false);
    router.push(`/${item.year}/${item.subjectId}`);
    onNavigate?.();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[selectedIndex]) select(results[selectedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const showList = isOpen && (query.trim() !== "" || year !== null);

  return (
    <div ref={rootRef} className="relative w-full max-w-2xl mx-auto z-40">
      <div className="relative shadow-md rounded-2xl">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark"
          size={22}
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="search"
          inputMode="search"
          enterKeyHint="go"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(0);
            setIsOpen(true);
          }}
          onKeyDown={onKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder="Search a subject, e.g. DBMS"
          aria-label="Search subjects"
          role="combobox"
          aria-expanded={showList}
          aria-controls="subject-search-results"
          className="w-full pl-12 pr-24 py-4 rounded-2xl border border-border-light dark:border-border-dark focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-400 bg-surface-container-lowest dark:bg-bg-dark text-body-lg font-medium text-on-surface dark:text-text-primary-dark outline-none"
        />
        {query ? (
          <button
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-surface-container"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        ) : (
          <kbd className="hidden sm:inline-flex absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-surface-container dark:bg-inverse-surface border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark pointer-events-none">
            Ctrl + K
          </kbd>
        )}
      </div>

      {/* Year filter */}
      <div className="flex flex-wrap gap-2 mt-3" role="group" aria-label="Filter by year">
        <button
          onClick={() => setYear(null)}
          aria-pressed={year === null}
          className={`px-3.5 py-2 min-h-[40px] rounded-full text-body-sm font-semibold border transition-colors ${
            year === null
              ? "bg-primary text-white border-primary"
              : "border-border-light dark:border-border-dark text-on-surface dark:text-text-primary-dark"
          }`}
        >
          All years
        </button>
        {years.map((y) => (
          <button
            key={y}
            onClick={() => {
              setYear(y === year ? null : y);
              setSelectedIndex(0);
              setIsOpen(true);
            }}
            aria-pressed={year === y}
            className={`px-3.5 py-2 min-h-[40px] rounded-full text-body-sm font-semibold border transition-colors ${
              year === y
                ? "bg-primary text-white border-primary"
                : "border-border-light dark:border-border-dark text-on-surface dark:text-text-primary-dark"
            }`}
          >
            {formatShortYear(y)}
          </button>
        ))}
      </div>

      {showList && (
        <div
          id="subject-search-results"
          role="listbox"
          className="absolute top-full left-0 right-0 mt-2 bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-xl shadow-lg max-h-96 overflow-y-auto"
        >
          {results.length > 0 ? (
            <div className="divide-y divide-border-light dark:divide-border-dark">
              {results.map((item, idx) => (
                <button
                  key={`${item.year}-${item.subjectId}`}
                  role="option"
                  aria-selected={idx === selectedIndex}
                  onClick={() => select(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full px-5 py-3.5 flex items-center justify-between text-left min-h-[48px] ${
                    idx === selectedIndex ? "bg-surface-container dark:bg-inverse-surface" : ""
                  }`}
                >
                  <span className="flex items-center gap-3 min-w-0">
                    <BookOpen size={16} className="shrink-0 opacity-60" aria-hidden="true" />
                    <span className="font-sora font-semibold text-body-md text-on-surface dark:text-text-primary-dark truncate">
                      {item.subjectName}
                    </span>
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark shrink-0 ml-2">
                    {formatShortYear(item.year)}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-5 py-6 text-center text-text-secondary-light dark:text-text-secondary-dark text-body-sm">
              No subject found for &quot;<span className="font-semibold">{query}</span>&quot;.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
