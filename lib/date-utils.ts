/**
 * Utility functions for date calculations, freshness badges, and relative timestamps.
 */

/**
 * Returns true if date is more than thresholdDays ago (default 180 days / 6 months).
 */
export function isStale(dateStr: string | undefined | null, thresholdDays: number = 180): boolean {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return false;

  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  if (diffTime < 0) return false;

  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays > thresholdDays;
}

/**
 * Returns true if date is within thresholdDays (default 30 days / 1 month).
 */
export function isNew(dateStr: string | undefined | null, thresholdDays: number = 30): boolean {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return false;

  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  if (diffTime < 0) return false;

  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= thresholdDays;
}

/**
 * Returns relative time string like "today", "yesterday", "5 days ago", "2 months ago", "1 year ago".
 */
export function getRelativeTime(dateStr: string | undefined | null): string {
  if (!dateStr) return "Unknown";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const now = new Date();
  const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSeconds < 0) {
    return "just now";
  }

  const diffDays = Math.floor(diffSeconds / (3600 * 24));
  if (diffDays === 0) {
    return "today";
  }
  if (diffDays === 1) {
    return "yesterday";
  }
  if (diffDays < 30) {
    return `${diffDays} days ago`;
  }

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) {
    return diffMonths === 1 ? "1 month ago" : `${diffMonths} months ago`;
  }

  const diffYears = Math.floor(diffDays / 365);
  return diffYears === 1 ? "1 year ago" : `${diffYears} years ago`;
}
