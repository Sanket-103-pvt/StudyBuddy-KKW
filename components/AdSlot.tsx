"use client";

// One Google ad unit. Renders nothing unless ads are configured, the visitor allowed them, and the page has real content.

import React, { useEffect, useRef } from "react";
import { ADS_ENABLED, ADSENSE_CLIENT, ADSENSE_SLOT_SUBJECT } from "@/lib/ads-config";
import { useAdConsent } from "@/components/AdConsent";

export default function AdSlot({ hasContent }: { hasContent: boolean }) {
  const consent = useAdConsent();
  const pushed = useRef(false);
  const show = ADS_ENABLED && ADSENSE_SLOT_SUBJECT !== "" && hasContent && consent === "granted";

  useEffect(() => {
    if (!show || pushed.current) return;
    pushed.current = true;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      (w.adsbygoogle = w.adsbygoogle || []).push({});
    } catch {
      /* ad script not ready or blocked: the slot stays empty */
    }
  }, [show]);

  if (!show) return null;
  return (
    <aside className="print:hidden mt-10" aria-label="Advertisement">
      <p className="mb-1 text-[11px] uppercase tracking-wider text-[var(--lp-muted)]">Advertisement</p>
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={ADSENSE_SLOT_SUBJECT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
