"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FolderOpen, Star, ArrowRight, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ToastProvider";

interface BookmarkedResource {
  label: string;
  url: string;
  type: string;
  subjectId: string;
  subjectName: string;
  year: string;
}

// Resources the student pinned (kept on this device, no login). Renders nothing when there are none.
export default function PinnedResources() {
  const toast = useToast();
  const [mounted, setMounted] = useState(false);
  const [bookmarks, setBookmarks] = useState<BookmarkedResource[]>([]);

  useEffect(() => {
    setMounted(true);
    // Load bookmarked resources metadata from localStorage
    const savedUrls = localStorage.getItem("sb_bookmarks");
    if (savedUrls) {
      const urls: string[] = JSON.parse(savedUrls);
      const items: BookmarkedResource[] = [];
      
      urls.forEach(url => {
        const meta = localStorage.getItem(`sb_bm_meta_${url}`);
        if (meta) {
          items.push(JSON.parse(meta));
        }
      });
      
      setBookmarks(items);
    }
  }, []);

  const removeBookmark = (url: string, label?: string) => {
    const savedUrls = localStorage.getItem("sb_bookmarks");
    if (savedUrls) {
      const urls: string[] = JSON.parse(savedUrls);
      const updated = urls.filter(u => u !== url);
      localStorage.setItem("sb_bookmarks", JSON.stringify(updated));
      localStorage.removeItem(`sb_bm_meta_${url}`);
      setBookmarks(bookmarks.filter(b => b.url !== url));
      toast.info(`Unpinned "${label || "Resource"}" ⭐`);
    }
  };


  return (
    <>
        {mounted && bookmarks.length > 0 && (
          <section className="w-full max-w-container-max mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-sora font-semibold text-headline-sm text-on-surface dark:text-text-primary-dark flex items-center gap-2">
                <Star size={20} className="text-amber-500 fill-amber-500" />
                Pinned Resources
              </h2>
            </div>

            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map((bm, idx) => (
                <div 
                  key={idx}
                  className="bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark p-5 rounded-xl flex flex-col justify-between hover:shadow-sm transition-shadow"
                >
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-text-secondary-light dark:text-text-secondary-dark bg-surface-container dark:bg-inverse-surface px-2.5 py-0.5 rounded-full border border-border-light dark:border-border-dark">
                      {bm.subjectName}
                    </span>
                    <a
                      href={bm.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sora font-semibold text-body-md text-on-surface dark:text-text-primary-dark hover:text-primary dark:hover:text-primary-fixed-dim mt-3 block flex items-center gap-1.5 transition-colors"
                    >
                      <FolderOpen size={16} className="text-primary dark:text-primary-fixed-dim" />
                      <span className="truncate">{bm.label}</span>
                      <ExternalLink size={12} className="opacity-50" />
                    </a>
                  </div>
                  
                  <div className="flex justify-between items-center mt-5 pt-3 border-t border-border-light dark:border-border-dark">
                    <Link 
                      href={`/${bm.year}/${bm.subjectId}`}
                      className="text-body-sm text-primary dark:text-primary-fixed-dim font-medium hover:underline flex items-center gap-1"
                    >
                      View subject <ArrowRight size={12} />
                    </Link>
                    
                    <button 
                      onClick={() => removeBookmark(bm.url, bm.label)}
                      className="p-1 rounded-lg hover:bg-surface-container dark:hover:bg-inverse-surface text-text-secondary-light dark:text-text-secondary-dark hover:text-red-500 transition-all duration-200 active:scale-90 hover:scale-110"
                      aria-label="Remove pin"
                      title="Unpin resource"
                    >
                      <Star size={16} fill="currentColor" className="text-amber-500 hover:text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

    </>
  );
}
