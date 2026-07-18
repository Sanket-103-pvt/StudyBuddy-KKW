"use client";

// components/SearchBar.tsx
// Extended search bar: matches subject names, unit titles, and resource labels.
// Results are grouped into "Subjects" and "Resources" sections in the dropdown.

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, BookOpen, FileText, ExternalLink } from "lucide-react";
import { buildSearchIndex, type SearchResult } from "@/lib/search-index";

// Max results to show per section to keep dropdown scannable
const MAX_SUBJECT_RESULTS = 4;
const MAX_RESOURCE_RESULTS = 6;

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [subjectResults, setSubjectResults] = useState<SearchResult[]>([]);
  const [resourceResults, setResourceResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Build index once (cached internally in lib/search-index.ts)
  const searchIndex = React.useMemo(() => buildSearchIndex(), []);

  // Flat list of all results for keyboard navigation
  const allResults = [...subjectResults, ...resourceResults];

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Run search when query changes
  useEffect(() => {
    if (query.trim() === "") {
      setSubjectResults([]);
      setResourceResults([]);
      setIsOpen(false);
      return;
    }

    const q = query.toLowerCase();

    const subjects: SearchResult[] = [];
    const resources: SearchResult[] = [];

    for (const item of searchIndex) {
      if (item.type === "subject") {
        if (item.subjectName.toLowerCase().includes(q)) {
          subjects.push(item);
        }
      } else {
        // Resource: match against label or subject name
        const labelMatch = item.resourceLabel?.toLowerCase().includes(q);
        const subjectMatch = item.subjectName.toLowerCase().includes(q);
        if (labelMatch || subjectMatch) {
          resources.push(item);
        }
      }
    }

    setSubjectResults(subjects.slice(0, MAX_SUBJECT_RESULTS));
    setResourceResults(resources.slice(0, MAX_RESOURCE_RESULTS));
    setIsOpen(true);
    setSelectedIndex(-1);
  }, [query, searchIndex]);

  const handleSelect = (item: SearchResult) => {
    setQuery("");
    setIsOpen(false);
    if (item.type === "subject") {
      router.push(`/${item.year}/${item.subjectId}`);
    } else {
      // Open resource directly in new tab
      window.open(item.resourceUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev < allResults.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < allResults.length) {
        handleSelect(allResults[selectedIndex]);
      } else if (allResults.length > 0) {
        handleSelect(allResults[0]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const hasResults = subjectResults.length > 0 || resourceResults.length > 0;

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto z-40">
      {/* Search Input Box */}
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark"
          size={20}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() !== "" && setIsOpen(true)}
          placeholder="Search subjects, notes, PYQs, resources..."
          className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-border-light dark:border-border-dark shadow-sm focus:ring-2 focus:ring-primary dark:focus:ring-primary-fixed focus:border-primary dark:focus:border-primary-fixed bg-surface-container-lowest dark:bg-bg-dark text-body-lg text-on-surface dark:text-text-primary-dark transition-all outline-none"
        />

        {query && (
          <button
            onClick={() => {
              setQuery("");
              setSubjectResults([]);
              setResourceResults([]);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark hover:text-on-surface dark:hover:text-text-primary-dark"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Floating Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-xl shadow-lg max-h-96 overflow-y-auto">
          {hasResults ? (
            <>
              {/* ── Subjects Section ── */}
              {subjectResults.length > 0 && (
                <div>
                  <div className="px-5 pt-3 pb-1.5">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-text-secondary-light dark:text-text-secondary-dark">
                      Subjects
                    </span>
                  </div>
                  <div className="divide-y divide-border-light dark:divide-border-dark">
                    {subjectResults.map((item, idx) => (
                      <button
                        key={`sub-${item.subjectId}`}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full px-5 py-3 flex items-center justify-between text-left transition-colors ${
                          idx === selectedIndex
                            ? "bg-surface-container dark:bg-inverse-surface"
                            : "hover:bg-surface-container-low dark:hover:bg-inverse-surface"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <BookOpen
                            size={16}
                            className={`flex-shrink-0 ${idx === selectedIndex ? "text-primary dark:text-primary-fixed-dim" : "opacity-50"}`}
                          />
                          <span className={`font-sora font-semibold text-body-md ${idx === selectedIndex ? "text-primary dark:text-primary-fixed-dim" : "text-on-surface dark:text-text-primary-dark"}`}>
                            {item.subjectName}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-surface-container-low dark:bg-inverse-surface text-text-secondary-light dark:text-text-secondary-dark border border-border-light dark:border-border-dark flex-shrink-0">
                          {item.year === "first-year" ? "1st Year" : "2nd Year"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Resources Section ── */}
              {resourceResults.length > 0 && (
                <div className={subjectResults.length > 0 ? "border-t border-border-light dark:border-border-dark" : ""}>
                  <div className="px-5 pt-3 pb-1.5">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-text-secondary-light dark:text-text-secondary-dark">
                      Resources
                    </span>
                  </div>
                  <div className="divide-y divide-border-light dark:divide-border-dark">
                    {resourceResults.map((item, idx) => {
                      const flatIdx = subjectResults.length + idx;
                      return (
                        <button
                          key={`res-${item.subjectId}-${item.unitTitle}-${item.resourceLabel}-${idx}`}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setSelectedIndex(flatIdx)}
                          className={`w-full px-5 py-3 flex items-center justify-between text-left transition-colors ${
                            flatIdx === selectedIndex
                              ? "bg-surface-container dark:bg-inverse-surface"
                              : "hover:bg-surface-container-low dark:hover:bg-inverse-surface"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <FileText
                              size={15}
                              className={`flex-shrink-0 ${flatIdx === selectedIndex ? "text-primary dark:text-primary-fixed-dim" : "opacity-40"}`}
                            />
                            <div className="flex flex-col min-w-0 text-left">
                              {/* Resource label */}
                              <span className={`font-inter font-medium text-body-sm truncate ${flatIdx === selectedIndex ? "text-primary dark:text-primary-fixed-dim" : "text-on-surface dark:text-text-primary-dark"}`}>
                                {item.resourceLabel}
                              </span>
                              {/* Breadcrumb: Subject › Unit */}
                              <span className="font-mono text-[10px] text-text-secondary-light dark:text-text-secondary-dark truncate">
                                {item.subjectName} › {item.unitTitle}
                              </span>
                            </div>
                          </div>
                          <ExternalLink
                            size={12}
                            className="flex-shrink-0 opacity-40 ml-2"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="px-5 py-6 text-center text-text-secondary-light dark:text-text-secondary-dark text-body-sm">
              No results found for &quot;<span className="font-semibold">{query}</span>&quot;.
              <div className="mt-1 text-[12px] opacity-75">
                Try: subject name, &quot;notes&quot;, &quot;handwritten&quot;, &quot;PYQ&quot;, &quot;question bank&quot;
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
