"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FileText, 
  FolderOpen, 
  HelpCircle, 
  Star, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  Copy,
  Check,
  CheckCircle2
} from "lucide-react";
import { YoutubeIcon } from "@/components/icons";
import { isStale, isNew } from "@/lib/date-utils";
import { useToast } from "@/components/ToastProvider";
import { useSyllabusProgress } from "@/hooks/useSyllabusProgress";


interface Resource {
  label: string;
  type: string;
  url: string;
  lastUpdated?: string;
}

interface Unit {
  unitNumber: number;
  title: string;
  resources: Resource[];
}

interface UnitListProps {
  subjectId: string;
  subjectName: string;
  year: string;
  units: Unit[];
  bonus: Resource[];
}

function PdfPreviewBox({ url, label }: { url: string; label: string }) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  const getEmbedUrl = (driveUrl: string) => {
    const match = driveUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    return driveUrl;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!iframeLoaded) {
        setIframeError(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [iframeLoaded]);

  return (
    <div className="mt-3 border border-border-light dark:border-border-dark rounded-xl overflow-hidden shadow-inner bg-bg-light dark:bg-bg-dark">
      <div className="flex justify-between items-center px-4 py-2 bg-surface-container dark:bg-inverse-surface border-b border-border-light dark:border-border-dark text-body-sm">
        <span className="font-semibold text-on-surface dark:text-text-primary-dark">
          PDF Live Preview
        </span>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-primary dark:text-primary-fixed-dim hover:underline font-semibold flex items-center gap-1.5"
        >
          Open in Drive <ExternalLink size={12} />
        </a>
      </div>
      <div className="w-full aspect-[4/3] md:aspect-[16/9] relative flex items-center justify-center">
        {iframeError ? (
          <div className="flex flex-col items-center justify-center p-6 text-center bg-surface-container-low dark:bg-inverse-surface w-full h-full">
            <p className="text-body-sm text-text-secondary-light dark:text-text-secondary-dark mb-4">
              Preview unavailable — this file may be private or has been moved.
            </p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-medium text-body-sm hover:bg-primary/90 transition-colors shadow-sm"
            >
              Open in Google Drive <ExternalLink size={14} />
            </a>
          </div>
        ) : (
          <iframe
            src={getEmbedUrl(url)}
            className="w-full h-full border-none"
            allow="autoplay"
            title={label}
            onLoad={() => setIframeLoaded(true)}
          ></iframe>
        )}
      </div>
    </div>
  );
}

export default function UnitList({ subjectId, subjectName, year, units, bonus }: UnitListProps) {
  const toast = useToast();
  const [openUnits, setOpenUnits] = useState<Record<number, boolean>>({ 1: true });
  const [mounted, setMounted] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [activePreviewUrl, setActivePreviewUrl] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const {
    isUnitCompleted,
    isResourceCompleted,
    toggleUnitCompletion,
    toggleResourceCompletion,
  } = useSyllabusProgress(subjectId, units.length, subjectName, year);

  useEffect(() => {
    setMounted(true);
    // Load bookmarks from localStorage
    const saved = localStorage.getItem("sb_bookmarks");
    if (saved) {
      setBookmarks(JSON.parse(saved));
    }
  }, []);

  const toggleUnit = (num: number) => {
    setOpenUnits(prev => ({ ...prev, [num]: !prev[num] }));
  };

  const isBookmarked = (url: string) => mounted && bookmarks.includes(url);

  const toggleBookmark = (resource: Resource) => {
    let updated;
    if (isBookmarked(resource.url)) {
      updated = bookmarks.filter(b => b !== resource.url);
      localStorage.removeItem(`sb_bm_meta_${resource.url}`);
      toast.info(`Unpinned "${resource.label}" ⭐`);
    } else {
      updated = [...bookmarks, resource.url];
      localStorage.setItem(`sb_bm_meta_${resource.url}`, JSON.stringify({
        label: resource.label,
        url: resource.url,
        type: resource.type,
        subjectId,
        subjectName,
        year,
      }));
      toast.success(`Pinned "${resource.label}" to Pinned Resources ⭐`);
    }
    setBookmarks(updated);
    localStorage.setItem("sb_bookmarks", JSON.stringify(updated));
  };

  const copyLink = (url: string, label: string) => {
    try {
      navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      toast.success(`Link for "${label}" copied to clipboard! 📋`);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch {
      toast.error("Failed to copy link to clipboard.");
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "folder":
        return <FolderOpen size={18} className="text-blue-500" />;
      case "video":
        return <YoutubeIcon className="w-[18px] h-[18px] text-red-500" />;
      case "question-bank":
        return <HelpCircle size={18} className="text-green-500" />;
      default:
        return <FileText size={18} className="text-gray-500 dark:text-gray-400" />;
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Units List */}
      <div className="space-y-4">
        {units.map((unit) => {
          const isOpen = openUnits[unit.unitNumber];
          const hasResources = unit.resources && unit.resources.length > 0;
          const unitDone = isUnitCompleted(unit.unitNumber);

          return (
            <div 
              key={unit.unitNumber}
              className={`bg-surface-container-lowest dark:bg-bg-dark border rounded-xl overflow-hidden transition-colors ${
                unitDone ? "border-emerald-300 dark:border-emerald-800/60" : "border-border-light dark:border-border-dark"
              }`}
            >
              {/* Accordion Header */}
              <div className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-surface-container-low dark:hover:bg-inverse-surface transition-colors">
                <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                  {/* Unit completion checkmark button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const isNowDone = toggleUnitCompletion(unit.unitNumber, unit.resources || []);
                      if (isNowDone) {
                        toast.success(`Unit ${unit.unitNumber} marked as completed! 🎉`);
                      } else {
                        toast.info(`Unit ${unit.unitNumber} marked incomplete`);
                      }
                    }}
                    className={`p-1 rounded-lg transition-all ${
                      unitDone
                        ? "text-emerald-500 hover:text-emerald-600 dark:text-emerald-400"
                        : "text-text-secondary-light/40 dark:text-text-secondary-dark/40 hover:text-emerald-500"
                    }`}
                    title={unitDone ? "Mark Unit Incomplete" : "Mark Unit Completed"}
                    aria-label={`Toggle Unit ${unit.unitNumber} completion`}
                  >
                    <CheckCircle2
                      size={22}
                      className={unitDone ? "fill-emerald-500/20 text-emerald-500" : ""}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleUnit(unit.unitNumber)}
                    className="flex items-center gap-3 text-left flex-1 min-w-0"
                  >
                    <span className={`font-mono text-label-mono px-2.5 py-1 rounded-md shrink-0 ${
                      unitDone
                        ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300"
                        : "text-primary dark:text-primary-fixed-dim bg-primary-fixed dark:bg-inverse-surface"
                    }`}>
                      Unit {unit.unitNumber}
                    </span>
                    <h4 className={`font-sora font-semibold text-body-md truncate ${
                      unitDone ? "line-through text-text-secondary-light dark:text-text-secondary-dark" : "text-on-surface dark:text-text-primary-dark"
                    }`}>
                      {unit.title}
                    </h4>
                  </button>
                </div>
                
                <button
                  type="button"
                  onClick={() => toggleUnit(unit.unitNumber)}
                  className="flex items-center gap-3 text-text-secondary-light dark:text-text-secondary-dark ml-2 shrink-0"
                >
                  <span className="text-body-sm hidden sm:inline">
                    {hasResources ? `${unit.resources.length} resources` : "No resources"}
                  </span>
                  {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>

              {/* Accordion Content */}
              {isOpen && (
                <div className="px-6 pb-5 pt-2 border-t border-border-light dark:border-border-dark divide-y divide-border-light dark:divide-border-dark">
                  {hasResources ? (
                    unit.resources.map((res, idx) => {
                      const isPreviewOpen = activePreviewUrl === res.url;
                      const isFile = res.type === "file";
                      const resDone = isResourceCompleted(res.url);

                      return (
                        <div key={idx} className="py-3.5 border-b border-border-light dark:border-border-dark last:border-0">
                          <div className="flex justify-between items-center hover:bg-surface-container-lowest dark:hover:bg-bg-dark transition-all py-1">
                            <div className="flex items-center gap-3 min-w-0">
                              {/* Resource Checkmark Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  const isNowDone = toggleResourceCompletion(res.url, unit.unitNumber, unit.resources || []);
                                  if (isNowDone) {
                                    toast.success(`Marked "${res.label}" completed! ✅`);
                                  } else {
                                    toast.info(`Marked "${res.label}" incomplete`);
                                  }
                                }}
                                className={`p-1 rounded-md transition-all shrink-0 ${
                                  resDone
                                    ? "text-emerald-500 dark:text-emerald-400"
                                    : "text-text-secondary-light/40 dark:text-text-secondary-dark/40 hover:text-emerald-500"
                                }`}
                                title={resDone ? "Mark Incomplete" : "Mark Completed"}
                                aria-label={`Toggle resource ${res.label} completion`}
                              >
                                <CheckCircle2
                                  size={18}
                                  className={resDone ? "fill-emerald-500/20 text-emerald-500" : ""}
                                />
                              </button>

                              <a
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-2.5 text-body-md hover:text-primary dark:hover:text-primary-fixed-dim font-medium transition-colors truncate ${
                                  resDone ? "line-through text-text-secondary-light dark:text-text-secondary-dark" : "text-on-surface dark:text-text-primary-dark"
                                }`}
                              >
                                {getResourceIcon(res.type)}
                                <span className="truncate">{res.label}</span>
                                {isNew(res.lastUpdated) && (
                                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 shrink-0">
                                    New
                                  </span>
                                )}
                                {isStale(res.lastUpdated) && (
                                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 shrink-0">
                                    May be outdated
                                  </span>
                                )}
                                <ExternalLink size={14} className="opacity-40 shrink-0" />
                              </a>
                            </div>

                            <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2">
                              {isFile && (
                                <button
                                  onClick={() => setActivePreviewUrl(isPreviewOpen ? null : res.url)}
                                  className="text-[12px] font-semibold text-primary dark:text-primary-fixed-dim hover:underline px-2.5 py-1 rounded bg-primary/10 dark:bg-inverse-surface transition-all active:scale-95 hover:scale-105"
                                >
                                  {isPreviewOpen ? "Hide Preview" : "Preview"}
                                </button>
                              )}

                              {res.lastUpdated && (
                                <span className="text-body-sm text-text-secondary-light dark:text-text-secondary-dark hidden sm:inline">
                                  Updated {new Date(res.lastUpdated).toLocaleDateString()}
                                </span>
                              )}
                              
                              <button
                                onClick={() => copyLink(res.url, res.label)}
                                className="p-1.5 rounded-md hover:bg-surface-container dark:hover:bg-inverse-surface text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary-fixed-dim transition-all duration-200 active:scale-90 hover:scale-110"
                                title="Copy resource link"
                                aria-label="Copy link"
                              >
                                {copiedUrl === res.url ? (
                                  <Check size={16} className="text-emerald-500 animate-bounce" />
                                ) : (
                                  <Copy size={16} />
                                )}
                              </button>

                              <button
                                onClick={() => toggleBookmark(res)}
                                className={`p-1.5 rounded-md hover:bg-surface-container dark:hover:bg-inverse-surface transition-all duration-200 active:scale-90 hover:scale-110 ${
                                  isBookmarked(res.url) 
                                    ? "text-amber-500" 
                                    : "text-text-secondary-light dark:text-text-secondary-dark hover:text-amber-500"
                                }`}
                                aria-label="Bookmark resource"
                                title={isBookmarked(res.url) ? "Unpin resource" : "Pin resource"}
                              >
                                <Star size={16} fill={isBookmarked(res.url) ? "currentColor" : "none"} className={isBookmarked(res.url) ? "scale-105" : ""} />
                              </button>
                            </div>
                          </div>

                          {isFile && isPreviewOpen && <PdfPreviewBox url={res.url} label={res.label} />}
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-6 text-center text-text-secondary-light dark:text-text-secondary-dark text-body-sm">
                      Notes coming soon — want to add them?{" "}
                      <Link 
                        href="/contribute" 
                        className="text-primary dark:text-primary-fixed-dim font-medium underline hover:text-primary-container"
                      >
                        Contribute here →
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bonus/Extra Resources Section */}
      {bonus && bonus.length > 0 && (
        <div className="bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-xl p-6 transition-colors">
          <h4 className="font-sora font-semibold text-headline-sm text-on-surface dark:text-text-primary-dark mb-4">
            🌟 Bonus Resources & PYQs
          </h4>
          <div className="divide-y divide-border-light dark:divide-border-dark">
            {bonus.map((res, idx) => {
              const isPreviewOpen = activePreviewUrl === res.url;
              const isFile = res.type === "file";
              const resDone = isResourceCompleted(res.url);

              return (
                <div key={idx} className="py-3.5 border-b border-border-light dark:border-border-dark last:border-0">
                  <div className="flex justify-between items-center py-1">
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        type="button"
                        onClick={() => {
                          const isNowDone = toggleResourceCompletion(res.url);
                          if (isNowDone) {
                            toast.success(`Marked "${res.label}" completed! ✅`);
                          } else {
                            toast.info(`Marked "${res.label}" incomplete`);
                          }
                        }}
                        className={`p-1 rounded-md transition-all shrink-0 ${
                          resDone
                            ? "text-emerald-500 dark:text-emerald-400"
                            : "text-text-secondary-light/40 dark:text-text-secondary-dark/40 hover:text-emerald-500"
                        }`}
                        title={resDone ? "Mark Incomplete" : "Mark Completed"}
                        aria-label={`Toggle resource ${res.label} completion`}
                      >
                        <CheckCircle2
                          size={18}
                          className={resDone ? "fill-emerald-500/20 text-emerald-500" : ""}
                        />
                      </button>

                      <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2.5 text-body-md hover:text-primary dark:hover:text-primary-fixed-dim font-medium transition-colors truncate ${
                          resDone ? "line-through text-text-secondary-light dark:text-text-secondary-dark" : "text-on-surface dark:text-text-primary-dark"
                        }`}
                      >
                        {getResourceIcon(res.type)}
                        <span className="truncate">{res.label}</span>
                        <ExternalLink size={14} className="opacity-40 shrink-0" />
                      </a>
                    </div>


                    <div className="flex items-center gap-2 sm:gap-3">
                      {isFile && (
                        <button
                          onClick={() => setActivePreviewUrl(isPreviewOpen ? null : res.url)}
                          className="text-[12px] font-semibold text-primary dark:text-primary-fixed-dim hover:underline px-2.5 py-1 rounded bg-primary/10 dark:bg-inverse-surface transition-all active:scale-95 hover:scale-105"
                        >
                          {isPreviewOpen ? "Hide Preview" : "Preview"}
                        </button>
                      )}

                      <button
                        onClick={() => copyLink(res.url, res.label)}
                        className="p-1.5 rounded-md hover:bg-surface-container dark:hover:bg-inverse-surface text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary-fixed-dim transition-all duration-200 active:scale-90 hover:scale-110"
                        title="Copy resource link"
                        aria-label="Copy link"
                      >
                        {copiedUrl === res.url ? (
                          <Check size={16} className="text-emerald-500 animate-bounce" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>

                      <button
                        onClick={() => toggleBookmark(res)}
                        className={`p-1.5 rounded-md hover:bg-surface-container dark:hover:bg-inverse-surface transition-all duration-200 active:scale-90 hover:scale-110 ${
                          isBookmarked(res.url) 
                            ? "text-amber-500" 
                            : "text-text-secondary-light dark:text-text-secondary-dark hover:text-amber-500"
                        }`}
                        aria-label="Bookmark resource"
                        title={isBookmarked(res.url) ? "Unpin resource" : "Pin resource"}
                      >
                        <Star size={16} fill={isBookmarked(res.url) ? "currentColor" : "none"} className={isBookmarked(res.url) ? "scale-105" : ""} />
                      </button>
                    </div>
                  </div>

                  {isFile && isPreviewOpen && <PdfPreviewBox url={res.url} label={res.label} />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
