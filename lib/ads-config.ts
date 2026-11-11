// Google AdSense settings. Ads stay completely off (no script, no banner, no cookies) until the publisher ID is set
// in the build environment: NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-1234567890123456
// Optional ad unit id for subject pages: NEXT_PUBLIC_ADSENSE_SLOT_SUBJECT=1234567890

const rawClient = (process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "").trim();
const rawSlot = (process.env.NEXT_PUBLIC_ADSENSE_SLOT_SUBJECT || "").trim();

/** Publisher id, or "" when ads are off or the value looks wrong. */
export const ADSENSE_CLIENT = /^ca-pub-\d{10,20}$/.test(rawClient) ? rawClient : "";
export const ADSENSE_SLOT_SUBJECT = /^\d{6,20}$/.test(rawSlot) ? rawSlot : "";
export const ADS_ENABLED = ADSENSE_CLIENT !== "";

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
