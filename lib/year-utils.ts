/**
 * Utility functions for year titles, labels, and academic nomenclature formatting.
 */

const YEAR_TITLE_MAP: Record<string, string> = {
  "first-year": "First Year",
  "second-year": "Second Year",
  "third-year": "Third Year",
  "fourth-year": "Fourth Year",
};

const SHORT_YEAR_MAP: Record<string, string> = {
  "first-year": "1st Year",
  "second-year": "2nd Year",
  "third-year": "3rd Year",
  "fourth-year": "4th Year",
};

/**
 * Returns standardized year title (e.g. "First Year", "Second Year").
 */
export function formatYearTitle(year: string | undefined | null): string {
  if (!year) return "";
  if (YEAR_TITLE_MAP[year]) {
    return YEAR_TITLE_MAP[year];
  }
  return year
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Returns standardized short year label (e.g. "1st Year", "2nd Year").
 */
export function formatShortYear(year: string | undefined | null): string {
  if (!year) return "";
  if (SHORT_YEAR_MAP[year]) {
    return SHORT_YEAR_MAP[year];
  }
  return formatYearTitle(year);
}
