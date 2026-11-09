import type { MetadataRoute } from "next";
import indexData from "@/content/index.json";

const BASE = "https://www.studybuddykkw.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/calculator", "/analytics", "/pyq", "/countdown", "/contribute", "/about", "/contact", "/support", "/privacy", "/terms"];
  const entries: MetadataRoute.Sitemap = staticPages.map((p) => ({ url: `${BASE}${p}` }));

  for (const [year, subjects] of Object.entries(indexData as Record<string, { id: string; lastUpdated: string }[]>)) {
    entries.push({ url: `${BASE}/${year}` });
    for (const s of subjects) {
      entries.push({ url: `${BASE}/${year}/${s.id}`, lastModified: s.lastUpdated });
    }
  }
  return entries;
}
