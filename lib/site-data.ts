// Typed access to small hand-edited data files in /data.

import pyq from "@/data/pyq.json";
import timetables from "@/data/timetables.json";

export interface PyqItem {
  subject: string;
  year: string; // exam year, e.g. "2024"
  session: string; // e.g. "Winter", "Summer", "In-Sem"
  url: string;
}

export interface TimetableItem {
  title: string;
  year: string; // academic year, e.g. "first-year"
  url: string;
  contributor?: string;
}

export const pyqItems: PyqItem[] = (pyq as { items: PyqItem[] }).items;
export const timetableItems: TimetableItem[] = (timetables as { items: TimetableItem[] }).items;
