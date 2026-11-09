"use client";

import React, { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { listCommunityTimetables, type CommunityTimetable } from "@/lib/contrib";
import { supabaseEnabled } from "@/lib/supabase";
import { formatYearTitle } from "@/lib/year-utils";

export default function CommunityTimetables({ showEmptyMessage = false }: { showEmptyMessage?: boolean }) {
  const [items, setItems] = useState<CommunityTimetable[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!supabaseEnabled) {
      setLoaded(true);
      return;
    }
    let active = true;
    listCommunityTimetables().then((rows) => {
      if (!active) return;
      setItems(rows);
      setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);

  if (items.length === 0) {
    if (!showEmptyMessage || !loaded) return null;
    return (
      <p className="font-inter text-body-md text-text-secondary-light dark:text-text-secondary-dark">
        No timetable has been added yet. Coming soon.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
      {items.map((t) => (
        <li key={t.id}>
          <a
            href={t.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 min-h-[52px] px-4 py-3 rounded-xl border border-border-light dark:border-border-dark hover:border-primary text-on-surface dark:text-text-primary-dark"
          >
            <span>
              <span className="block font-inter font-medium">{t.title}</span>
              <span className="block font-mono text-[11px] text-text-secondary-light dark:text-text-secondary-dark">
                {formatYearTitle(t.year)} · shared by {t.contributor_name}
              </span>
            </span>
            <ExternalLink size={16} aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}
