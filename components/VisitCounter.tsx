"use client";

// First-party visitor counter. Counts one visit per browser per day, stores only a daily number
// (see supabase/visits.sql). No cookies, no IP, no user id. Not tamper-proof: it is a simple count.

import React, { useEffect, useState } from "react";
import { publicRpc, publicSelect, supabaseEnabled } from "@/lib/supabase";

const KEY = "sb_visit_day";

export function VisitTracker() {
  useEffect(() => {
    if (!supabaseEnabled) return;
    try {
      const today = new Date().toISOString().slice(0, 10);
      if (window.localStorage.getItem(KEY) === today) return;
      // Mark the day first so reloads, extra tabs and quick page changes cannot count twice
      // while the request is still in flight; undo the mark only if the request failed.
      window.localStorage.setItem(KEY, today);
      publicRpc("track_visit").then((ok) => {
        if (!ok) {
          try {
            window.localStorage.removeItem(KEY);
          } catch {
            /* ignore */
          }
        }
      });
    } catch {
      /* storage blocked: skip counting */
    }
  }, []);
  return null;
}

interface Stats {
  total_visits: number;
  last_7_days: number;
}

export function VisitCount() {
  const [stats, setStats] = useState<Stats | null>(null);
  useEffect(() => {
    if (!supabaseEnabled) return;
    publicSelect<Stats>("visit_stats", { select: "total_visits,last_7_days" }).then((rows) => {
      if (rows[0]) setStats(rows[0]);
    });
  }, []);
  if (!stats || stats.total_visits < 1) return null;
  return (
    <p className="font-inter text-body-sm text-text-secondary-light dark:text-text-secondary-dark mt-2">
      {Number(stats.total_visits).toLocaleString("en-IN")} visits so far
    </p>
  );
}
