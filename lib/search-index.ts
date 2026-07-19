// lib/search-index.ts
// Builds a flat, statically-typed search index from all subject JSON files.
// Uses static imports (not fs) so it is safe to use in "use client" components.

// ── First Year ────────────────────────────────────────────────────────────────
import appliedChemistry from "@/content/first-year/applied-chemistry.json";
import appliedPhysics from "@/content/first-year/applied-physics.json";
import cProgramming from "@/content/first-year/c-programming.json";
import ctps from "@/content/first-year/computational-thinking-and-problem-solving-ct-ps.json";
import engineeringDrawing from "@/content/first-year/engineering-drawing.json";
import fundamentalOfElectronics from "@/content/first-year/fundamental-of-electronics.json";
import fundamentalsOfEE from "@/content/first-year/fundamentals-of-electrical-engineering.json";
import math1 from "@/content/first-year/math-1.json";
import maths2 from "@/content/first-year/maths-2.json";
import other from "@/content/first-year/other.json";

// ── Second Year ───────────────────────────────────────────────────────────────
import advancedDataStructure from "@/content/second-year/advanced-data-structure.json";
import dataStructure from "@/content/second-year/data-structure.json";
import dbms from "@/content/second-year/dbms.json";
import deld from "@/content/second-year/deld.json";
import discreteStructures from "@/content/second-year/discrete-structures.json";
import maths3 from "@/content/second-year/maths-3.json";
import operatingSystems from "@/content/second-year/operating-systems.json";
import softwareEngineering from "@/content/second-year/software-engineering.json";
import syllabus from "@/content/second-year/syllabus.json";

import dsa from "@/content/second-year/dsa.json";
import discreteMath from "@/content/second-year/discrete-math.json";
import oop from "@/content/second-year/oop.json";
import em3 from "@/content/second-year/em3.json";

// ── Types ─────────────────────────────────────────────────────────────────────

export type SearchResultType = "subject" | "resource";

export interface SearchResult {
  type: SearchResultType;
  subjectId: string;
  subjectName: string;
  year: string;
  // Only present when type === "resource"
  unitTitle?: string;
  resourceLabel?: string;
  resourceUrl?: string;
  resourceType?: string;
}

// ── Internal shape of JSON files ──────────────────────────────────────────────

interface RawResource {
  label: string;
  type: string;
  url: string;
  lastUpdated?: string;
}

interface RawUnit {
  unitNumber: number;
  title: string;
  resources: RawResource[];
}

interface RawSubjectData {
  id: string;
  name: string;
  year: string;
  icon: string;
  lastUpdated: string;
  units: RawUnit[];
  bonus: RawResource[];
}

// ── All subject data in a single typed array ──────────────────────────────────

const ALL_SUBJECTS: RawSubjectData[] = [
  // First Year
  appliedChemistry,
  appliedPhysics,
  cProgramming,
  ctps,
  engineeringDrawing,
  fundamentalOfElectronics,
  fundamentalsOfEE,
  math1,
  maths2,
  other,
  // Second Year
  advancedDataStructure,
  dataStructure,
  dbms,
  deld,
  discreteStructures,
  maths3,
  operatingSystems,
  softwareEngineering,
  syllabus,
  dsa,
  discreteMath,
  oop,
  em3,
] as RawSubjectData[];

// ── Builder ───────────────────────────────────────────────────────────────────

let _cachedIndex: SearchResult[] | null = null;

export function buildSearchIndex(): SearchResult[] {
  // Return cached result to avoid re-building on every keystroke
  if (_cachedIndex) return _cachedIndex;

  const index: SearchResult[] = [];

  for (const subject of ALL_SUBJECTS) {
    // 1. Subject-level entry
    index.push({
      type: "subject",
      subjectId: subject.id,
      subjectName: subject.name,
      year: subject.year,
    });

    // 2. Unit resource entries
    for (const unit of subject.units) {
      for (const resource of unit.resources) {
        index.push({
          type: "resource",
          subjectId: subject.id,
          subjectName: subject.name,
          year: subject.year,
          unitTitle: unit.title,
          resourceLabel: resource.label,
          resourceUrl: resource.url,
          resourceType: resource.type,
        });
      }
    }

    // 3. Bonus resource entries
    for (const resource of subject.bonus) {
      index.push({
        type: "resource",
        subjectId: subject.id,
        subjectName: subject.name,
        year: subject.year,
        unitTitle: "Bonus",
        resourceLabel: resource.label,
        resourceUrl: resource.url,
        resourceType: resource.type,
      });
    }
  }

  _cachedIndex = index;
  return index;
}
