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
  ExternalLink 
} from "lucide-react";
import { YoutubeIcon } from "@/components/icons";

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
  const [openUnits, setOpenUnits] = useState<Record<number, boolean>>({ 1: true });
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [activePreviewUrl, setActivePreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    // Load bookmarks from localStorage
    const saved = localStorage.getItem("sb_bookmarks");
    if (saved) {
      setBookmarks(JSON.parse(saved));
    }
  }, []);

  const toggleUnit = (num: number) => {
    setOpenUnits(prev => ({ ...prev, [num]: !prev[num] }));
  };

  const isBookmarked = (url: string) => bookmarks.includes(url);

  const toggleBookmark = (resource: Resource) => {
    let updated;
    if (isBookmarked(resource.url)) {
      updated = bookmarks.filter(b => b !== resource.url);
      // Remove metadata as well
      localStorage.removeItem(`sb_bm_meta_${resource.url}`);
    } else {
      updated = [...bookmarks, resource.url];
      // Save metadata for easy retrieval on the home page
      localStorage.setItem(`sb_bm_meta_${resource.url}`, JSON.stringify({
        label: resource.label,
        url: resource.url,
        type: resource.type,
        subjectId,
        subjectName,
        year,
      }));
    }
    setBookmarks(updated);
    localStorage.setItem("sb_bookmarks", JSON.stringify(updated));
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

          return (
            <div 
              key={unit.unitNumber}
              className="bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-xl overflow-hidden transition-colors"
            >
              {/* Accordion Header */}
              <button
                onClick={() => toggleUnit(unit.unitNumber)}
                className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-surface-container-low dark:hover:bg-inverse-surface transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-label-mono text-primary dark:text-primary-fixed-dim bg-primary-fixed dark:bg-inverse-surface px-2.5 py-1 rounded-md">
                    Unit {unit.unitNumber}
                  </span>
                  <h4 className="font-sora font-semibold text-body-md text-on-surface dark:text-text-primary-dark">
                    {unit.title}
                  </h4>
                </div>
                
                <div className="flex items-center gap-3 text-text-secondary-light dark:text-text-secondary-dark">
                  <span className="text-body-sm hidden sm:inline">
                    {hasResources ? `${unit.resources.length} resources` : "No resources"}
                  </span>
                  {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>

              {/* Accordion Content */}
              {isOpen && (
                <div className="px-6 pb-5 pt-2 border-t border-border-light dark:border-border-dark divide-y divide-border-light dark:divide-border-dark">
                  {hasResources ? (
                    unit.resources.map((res, idx) => {
                      const isPreviewOpen = activePreviewUrl === res.url;
                      const isFile = res.type === "file";
                      return (
                        <div key={idx} className="py-3.5 border-b border-border-light dark:border-border-dark last:border-0">
                          <div className="flex justify-between items-center hover:bg-surface-container-lowest dark:hover:bg-bg-dark transition-all py-1">
                            <a
                              href={res.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 text-body-md text-on-surface dark:text-text-primary-dark hover:text-primary dark:hover:text-primary-fixed-dim font-medium transition-colors"
                            >
                              {getResourceIcon(res.type)}
                              <span>{res.label}</span>
                              <ExternalLink size={14} className="opacity-40" />
                            </a>

                            <div className="flex items-center gap-3">
                              {isFile && (
                                <button
                                  onClick={() => setActivePreviewUrl(isPreviewOpen ? null : res.url)}
                                  className="text-[12px] font-semibold text-primary dark:text-primary-fixed-dim hover:underline px-2.5 py-1 rounded bg-primary/10 dark:bg-inverse-surface transition-colors"
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
                                onClick={() => toggleBookmark(res)}
                                className={`p-1.5 rounded-md hover:bg-surface-container dark:hover:bg-inverse-surface transition-colors ${
                                  isBookmarked(res.url) 
                                    ? "text-amber-500" 
                                    : "text-text-secondary-light dark:text-text-secondary-dark hover:text-amber-500"
                                }`}
                                aria-label="Bookmark resource"
                              >
                                <Star size={16} fill={isBookmarked(res.url) ? "currentColor" : "none"} />
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
              return (
                <div key={idx} className="py-3.5 border-b border-border-light dark:border-border-dark last:border-0">
                  <div className="flex justify-between items-center py-1">
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-body-md text-on-surface dark:text-text-primary-dark hover:text-primary dark:hover:text-primary-fixed-dim font-medium transition-colors"
                    >
                      {getResourceIcon(res.type)}
                      <span>{res.label}</span>
                      <ExternalLink size={14} className="opacity-40" />
                    </a>

                    <div className="flex items-center gap-3">
                      {isFile && (
                        <button
                          onClick={() => setActivePreviewUrl(isPreviewOpen ? null : res.url)}
                          className="text-[12px] font-semibold text-primary dark:text-primary-fixed-dim hover:underline px-2.5 py-1 rounded bg-primary/10 dark:bg-inverse-surface transition-colors"
                        >
                          {isPreviewOpen ? "Hide Preview" : "Preview"}
                        </button>
                      )}

                      <button
                        onClick={() => toggleBookmark(res)}
                        className={`p-1.5 rounded-md hover:bg-surface-container dark:hover:bg-inverse-surface transition-colors ${
                          isBookmarked(res.url) 
                            ? "text-amber-500" 
                            : "text-text-secondary-light dark:text-text-secondary-dark hover:text-amber-500"
                        }`}
                        aria-label="Bookmark resource"
                      >
                        <Star size={16} fill={isBookmarked(res.url) ? "currentColor" : "none"} />
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
