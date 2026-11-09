// lib/search-index.ts
// Subject-level search index built from content/index.json.
// Only subject names are searched: picking a result opens that subject's page.

import indexData from "@/content/index.json";

export interface SearchResult {
  subjectId: string;
  subjectName: string;
  year: string;
}

interface IndexItem {
  id: string;
  name: string;
}

let _cachedIndex: SearchResult[] | null = null;

export function buildSearchIndex(): SearchResult[] {
  if (_cachedIndex) return _cachedIndex;
  const index: SearchResult[] = [];
  for (const [year, subjects] of Object.entries(indexData as Record<string, IndexItem[]>)) {
    for (const s of subjects) {
      index.push({ subjectId: s.id, subjectName: s.name, year });
    }
  }
  _cachedIndex = index;
  return index;
}

export function getSearchYears(index: SearchResult[]): string[] {
  return Array.from(new Set(index.map((r) => r.year)));
}

/**
 * Filters subjects by name. `year` is an optional filter ("first-year", ...).
 * With an empty query and a year selected, all subjects of that year are returned.
 */
export function filterSearchIndex(
  index: SearchResult[],
  query: string,
  options: { year?: string | null; limit?: number } = {}
): SearchResult[] {
  const { year = null, limit = 8 } = options;
  const q = (query ?? "").toLowerCase().trim();
  if (q === "" && !year) return [];

  return index
    .filter((item) => (!year || item.year === year) && (q === "" || item.subjectName.toLowerCase().includes(q)))
    .slice(0, limit);
}
