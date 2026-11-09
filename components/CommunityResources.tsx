"use client";

import React, { useEffect, useState } from "react";
import { ExternalLink, Users } from "lucide-react";
import ReportLinkButton from "@/components/ReportLinkButton";
import { NOTE_TYPE_LABELS, listCommunityResources, type CommunityResource } from "@/lib/contrib";
import { supabaseEnabled } from "@/lib/supabase";

/** Approved student contributions for one subject. Renders nothing if there are none. */
export default function CommunityResources({ subjectId }: { subjectId: string }) {
  const [items, setItems] = useState<CommunityResource[]>([]);

  useEffect(() => {
    if (!supabaseEnabled) return;
    let active = true;
    listCommunityResources(subjectId).then((rows) => active && setItems(rows));
    return () => {
      active = false;
    };
  }, [subjectId]);

  if (items.length === 0) return null;

  return (
    <section className="mt-10" aria-labelledby="community-heading">
      <h2 id="community-heading" className="font-sora font-bold text-headline-sm mb-3 flex items-center gap-2 text-on-surface dark:text-text-primary-dark">
        <Users size={20} aria-hidden="true" /> Shared by students
      </h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((r) => (
          <li key={r.id} className="flex items-center justify-between gap-2 p-4 rounded-xl border border-border-light dark:border-border-dark bg-surface-container-lowest dark:bg-bg-dark">
            <a href={r.url} target="_blank" rel="noopener noreferrer" className="min-w-0 flex-1">
              <span className="flex items-center gap-2 font-sora font-semibold text-on-surface dark:text-text-primary-dark">
                <span className="truncate">{r.title}</span>
                <ExternalLink size={14} className="shrink-0" aria-hidden="true" />
              </span>
              <span className="block font-mono text-[11px] text-text-secondary-light dark:text-text-secondary-dark">
                {r.unit_number ? `Unit ${r.unit_number} · ` : ""}
                {NOTE_TYPE_LABELS[r.note_type]} · by {r.contributor_name}
              </span>
              {r.description && <span className="block mt-1 text-body-sm text-text-secondary-light dark:text-text-secondary-dark">{r.description}</span>}
            </a>
            <ReportLinkButton subjectId={r.subject_id} label={r.title} url={r.url} />
          </li>
        ))}
      </ul>
    </section>
  );
}
