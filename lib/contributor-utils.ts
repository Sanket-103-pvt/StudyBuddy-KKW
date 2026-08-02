// Contributor leaderboard data utilities and types for Study Buddy KKW

export interface Contributor {
  id: string;
  name: string;
  avatar: string; // initials fallback
  github?: string;
  uploads: number;
  points: number;
  badge: "gold" | "silver" | "bronze" | "contributor" | "newcomer";
  subjects: string[];
  joinedAt: string; // ISO date
}

export interface ContributionSubmission {
  id: string;
  contributorName: string;
  driveLink: string;
  subject: string;
  year: string;
  unit: string;
  description: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
}

const SUBMISSIONS_KEY = "sb_contribution_submissions";
const CONTRIBUTORS_KEY = "sb_contributors";

// Seed leaderboard with realistic KKWIEER contributor data
const SEED_CONTRIBUTORS: Contributor[] = [
  {
    id: "c_sanket",
    name: "Sanket Chaudhari",
    avatar: "SC",
    github: "Sanket-103-pvt",
    uploads: 42,
    points: 420,
    badge: "gold",
    subjects: ["Operating Systems", "DBMS", "DSA", "Software Engineering"],
    joinedAt: "2024-01-15",
  },
  {
    id: "c_priya",
    name: "Priya Sharma",
    avatar: "PS",
    uploads: 28,
    points: 280,
    badge: "silver",
    subjects: ["Engineering Mathematics II", "Applied Chemistry", "OOP"],
    joinedAt: "2024-02-10",
  },
  {
    id: "c_rohan",
    name: "Rohan Patil",
    avatar: "RP",
    uploads: 19,
    points: 190,
    badge: "bronze",
    subjects: ["Digital Electronics", "Computer Networks", "C Programming"],
    joinedAt: "2024-03-22",
  },
  {
    id: "c_aisha",
    name: "Aisha Khan",
    avatar: "AK",
    uploads: 11,
    points: 110,
    badge: "contributor",
    subjects: ["AI Fundamentals", "Data Science", "Statistics"],
    joinedAt: "2024-05-05",
  },
  {
    id: "c_nikhil",
    name: "Nikhil Jadhav",
    avatar: "NJ",
    uploads: 7,
    points: 70,
    badge: "contributor",
    subjects: ["Advanced Data Structures", "Engineering Maths III"],
    joinedAt: "2024-07-18",
  },
  {
    id: "c_shruti",
    name: "Shruti Desai",
    avatar: "SD",
    uploads: 3,
    points: 30,
    badge: "newcomer",
    subjects: ["Applied Physics", "Engineering Drawing"],
    joinedAt: "2024-11-01",
  },
];

export function getContributors(): Contributor[] {
  if (typeof window === "undefined") return SEED_CONTRIBUTORS;
  try {
    const stored = localStorage.getItem(CONTRIBUTORS_KEY);
    if (!stored) {
      localStorage.setItem(CONTRIBUTORS_KEY, JSON.stringify(SEED_CONTRIBUTORS));
      return SEED_CONTRIBUTORS;
    }
    return JSON.parse(stored);
  } catch {
    return SEED_CONTRIBUTORS;
  }
}

export function getSubmissions(): ContributionSubmission[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(SUBMISSIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveSubmission(submission: ContributionSubmission): void {
  if (typeof window === "undefined") return;
  const current = getSubmissions();
  current.unshift(submission);
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(current));
}

export function addContributorUpload(name: string, subject: string): void {
  if (typeof window === "undefined") return;
  const contributors = getContributors();
  const existing = contributors.find(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  );

  if (existing) {
    existing.uploads += 1;
    existing.points += 10;
    if (!existing.subjects.includes(subject)) {
      existing.subjects.push(subject);
    }
  } else {
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    contributors.push({
      id: `c_${Date.now()}`,
      name,
      avatar: initials,
      uploads: 1,
      points: 10,
      badge: "newcomer",
      subjects: [subject],
      joinedAt: new Date().toISOString().split("T")[0],
    });
  }

  // Re-sort and re-badge
  contributors.sort((a, b) => b.points - a.points);
  contributors.forEach((c, idx) => {
    if (idx === 0) c.badge = "gold";
    else if (idx === 1) c.badge = "silver";
    else if (idx === 2) c.badge = "bronze";
    else if (c.uploads >= 5) c.badge = "contributor";
    else c.badge = "newcomer";
  });

  localStorage.setItem(CONTRIBUTORS_KEY, JSON.stringify(contributors));
}

export const BADGE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  gold: {
    label: "🥇 Top Contributor",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700",
  },
  silver: {
    label: "🥈 Senior Contributor",
    color: "text-slate-600 dark:text-slate-300",
    bg: "bg-slate-50 dark:bg-slate-800/30 border-slate-300 dark:border-slate-600",
  },
  bronze: {
    label: "🥉 Active Contributor",
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-950/30 border-orange-300 dark:border-orange-600",
  },
  contributor: {
    label: "⭐ Contributor",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-600",
  },
  newcomer: {
    label: "🌱 Newcomer",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-600",
  },
};

// Flatten subjects list from indexData for form dropdown
export const SUBJECT_OPTIONS = [
  { group: "First Year", subjects: ["Engineering Mathematics I", "Engineering Mathematics II", "Applied Physics", "Applied Chemistry", "C Programming", "Fundamentals of Electrical Engineering", "Fundamental of Electronics", "Engineering Drawing", "Computational Thinking & Problem Solving"] },
  { group: "Second Year", subjects: ["Engineering Mathematics III", "Discrete Mathematics", "Data Structures & Algorithms", "Operating Systems", "Database Management System", "Object Oriented Programming", "Digital Electronics & Logic Design", "Software Engineering", "Computer Networks"] },
  { group: "Third Year", subjects: ["Advanced Data Structures", "Machine Learning", "Computer Architecture", "Compiler Design", "Theory of Computation", "Microprocessors"] },
  { group: "Fourth Year", subjects: ["Artificial Intelligence", "Deep Learning", "Blockchain Technology", "Cloud Computing", "Internet of Things", "Project"] },
];

export const UNIT_OPTIONS = ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5", "All Units", "Previous Year Questions", "Practical", "Viva Notes"];
