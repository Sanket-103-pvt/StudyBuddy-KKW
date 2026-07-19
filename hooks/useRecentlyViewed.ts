import { useState, useEffect } from "react";

export interface RecentlyViewedItem {
  subjectId: string;
  subjectName: string;
  year: string;
  viewedAt: string;
}

const STORAGE_KEY = "sb_recently_viewed";
const MAX_ITEMS = 5;

export function useRecentlyViewed() {
  const [history, setHistory] = useState<RecentlyViewedItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch {
      setHistory([]);
    }
  }, []);

  const addToHistory = (item: Omit<RecentlyViewedItem, "viewedAt">) => {
    try {
      const currentRaw = localStorage.getItem(STORAGE_KEY);
      const current: RecentlyViewedItem[] = currentRaw ? JSON.parse(currentRaw) : [];

      const filtered = current.filter((h) => h.subjectId !== item.subjectId);
      const newItem: RecentlyViewedItem = {
        ...item,
        viewedAt: new Date().toISOString(),
      };

      const updated = [newItem, ...filtered].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setHistory(updated);
    } catch (error) {
      console.error("Failed to update recently viewed history:", error);
    }
  };

  const clearHistory = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setHistory([]);
    } catch (error) {
      console.error("Failed to clear recently viewed history:", error);
    }
  };

  return { history, addToHistory, clearHistory };
}
