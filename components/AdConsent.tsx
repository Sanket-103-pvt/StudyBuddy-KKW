"use client";

// Ad consent: asks once, loads the Google ad script only after "Allow", and lets people change their mind
// from the footer. Everything here does nothing unless NEXT_PUBLIC_ADSENSE_CLIENT is set (see lib/ads-config.ts).

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ADS_ENABLED, ADSENSE_CLIENT, AD_CONSENT_EVENT, readAdConsent, writeAdConsent, type AdConsent } from "@/lib/ads-config";

export function useAdConsent(): AdConsent | "loading" {
  const [consent, setConsent] = useState<AdConsent | "loading">("loading");
  useEffect(() => {
    const update = () => setConsent(readAdConsent());
    update();
    window.addEventListener(AD_CONSENT_EVENT, update);
    return () => window.removeEventListener(AD_CONSENT_EVENT, update);
  }, []);
  return consent;
}

/** Loads adsbygoogle.js once, and only when the visitor allowed ads. */
function loadAdScript(): void {
  if (document.getElementById("adsbygoogle-js")) return;
  const s = document.createElement("script");
  s.id = "adsbygoogle-js";
  s.async = true;
  s.crossOrigin = "anonymous";
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(ADSENSE_CLIENT)}`;
  document.head.appendChild(s);
}

export function AdConsentBanner() {
  const consent = useAdConsent();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (ADS_ENABLED && consent === "granted") loadAdScript();
  }, [consent]);

  const choose = useCallback((value: "granted" | "denied") => {
    writeAdConsent(value);
    setDismissed(true);
  }, []);

  if (!ADS_ENABLED || consent !== null || dismissed) return null;

  return (
    <div
      role="dialog"
      aria-label="Ads and cookies"
      className="print:hidden fixed bottom-0 inset-x-0 z-[70] border-t border-[var(--lp-ink)] bg-[var(--lp-bg)] text-[var(--lp-ink)] px-4 py-4 md:px-8"
    >
      <div className="max-w-container-max mx-auto flex flex-col md:flex-row md:items-center gap-4">
        <p className="text-sm leading-relaxed flex-1">
          This site is free and shows ads from Google to cover its costs. Ads use cookies. If you allow them, Google and its partners may set cookies in your browser.
          If you decline, no ads are loaded and no ad cookies are set. Details are in the{" "}
          <Link href="/privacy" className="font-semibold underline underline-offset-4">Privacy Policy</Link>.
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            type="button"
            onClick={() => choose("denied")}
            className="px-4 py-2 text-sm font-semibold border border-[var(--lp-ink)] hover:bg-[var(--lp-panel)]"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => choose("granted")}
            className="px-4 py-2 text-sm font-semibold bg-[var(--lp-accent)] text-black border border-[var(--lp-ink)]"
          >
            Allow ads
          </button>
        </div>
      </div>
    </div>
  );
}

/** Footer link to change the choice. Hidden while ads are off. */
export function AdChoicesLink({ className }: { className?: string }) {
  if (!ADS_ENABLED) return null;
  return (
    <button type="button" className={className} onClick={() => writeAdConsent("reset")}>
      Ad choices
    </button>
  );
}
