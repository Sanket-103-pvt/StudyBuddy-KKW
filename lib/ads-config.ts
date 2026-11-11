// Google AdSense settings.
// The publisher id is public (it is visible in every ad page's source), so it lives here and in public/ads.txt.
// The verification meta tag uses it right away, so Google can check ownership while the site is being reviewed.
// Ads themselves (consent banner, ad script, ad slots) stay OFF until the build variable
// NEXT_PUBLIC_ADS_ENABLED=1 is set, which should happen only after AdSense approves the site.
// Optional ad unit id for subject pages: NEXT_PUBLIC_ADSENSE_SLOT_SUBJECT=1234567890

const DEFAULT_CLIENT = "ca-pub-3657681311952662";
const rawClient = (process.env.NEXT_PUBLIC_ADSENSE_CLIENT || DEFAULT_CLIENT).trim();
const rawSlot = (process.env.NEXT_PUBLIC_ADSENSE_SLOT_SUBJECT || "").trim();

/** Publisher id, or "" when the value looks wrong. */
export const ADSENSE_CLIENT = /^ca-pub-\d{10,20}$/.test(rawClient) ? rawClient : "";
export const ADSENSE_SLOT_SUBJECT = /^\d{6,20}$/.test(rawSlot) ? rawSlot : "";
export const ADS_ENABLED = ADSENSE_CLIENT !== "" && process.env.NEXT_PUBLIC_ADS_ENABLED === "1";

export const AD_CONSENT_KEY = "sb_ad_consent";
export const AD_CONSENT_EVENT = "sb-ad-consent-change";
export type AdConsent = "granted" | "denied" | null;

export function readAdConsent(): AdConsent {
  try {
    const v = window.localStorage.getItem(AD_CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function writeAdConsent(value: Exclude<AdConsent, null> | "reset"): void {
  try {
    if (value === "reset") window.localStorage.removeItem(AD_CONSENT_KEY);
    else window.localStorage.setItem(AD_CONSENT_KEY, value);
  } catch {
    /* storage blocked: the choice only lasts for this page view */
  }
  window.dispatchEvent(new CustomEvent(AD_CONSENT_EVENT));
}
