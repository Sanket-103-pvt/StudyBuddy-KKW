"use client";

// Interactive Note Uploader and Contributor Leaderboard for Study Buddy KKW

import React, { useState, useEffect, useMemo } from "react";
import {
  GitFork,
  FileJson,
  CheckCircle,
  Upload,
  Trophy,
  Star,
  Send,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Users,
  TrendingUp,
  Award,
  Sparkles,
  FileText,
  AlertCircle,
  Check,
} from "lucide-react";

import { GithubIcon } from "@/components/icons";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ToastProvider";
import {
  getContributors,
  getSubmissions,
  saveSubmission,
  addContributorUpload,
  BADGE_CONFIG,
  SUBJECT_OPTIONS,
  UNIT_OPTIONS,
  type Contributor,
  type ContributionSubmission,
} from "@/lib/contributor-utils";

// ── Validation helpers ──────────────────────────────────────────────────────
function isDriveLink(url: string): boolean {
  return (
    url.startsWith("https://drive.google.com") ||
    url.startsWith("https://docs.google.com") ||
    url.startsWith("https://bit.ly") ||
    url.startsWith("http://")
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PodiumCard({ contributor, rank }: { contributor: Contributor; rank: 1 | 2 | 3 }) {
  const heights = { 1: "h-36", 2: "h-24", 3: "h-20" };
  const podiumColors = {
    1: "from-amber-400 to-amber-500",
    2: "from-slate-400 to-slate-500",
    3: "from-orange-400 to-orange-500",
  };
  const ringColors = {
    1: "ring-amber-400",
    2: "ring-slate-400",
    3: "ring-orange-400",
  };
  const emoji = { 1: "🥇", 2: "🥈", 3: "🥉" };

  return (
    <div className="flex flex-col items-center gap-2 group">
      {/* Avatar */}
      <div className={`w-16 h-16 rounded-full bg-primary/10 dark:bg-inverse-surface flex items-center justify-center font-sora font-bold text-lg text-primary dark:text-primary-fixed-dim ring-4 ${ringColors[rank]} shadow-lg group-hover:scale-105 transition-transform`}>
        {contributor.avatar}
      </div>

      {/* Name & stats */}
      <div className="text-center">
        <span className="font-sora font-bold text-body-sm text-on-surface dark:text-text-primary-dark block leading-tight">
          {contributor.name.split(" ")[0]}
        </span>
        <span className="font-mono text-[11px] text-text-secondary-light dark:text-text-secondary-dark">
          {contributor.points} pts
        </span>
      </div>

      {/* Podium block */}
      <div className={`w-24 ${heights[rank]} bg-gradient-to-b ${podiumColors[rank]} rounded-t-xl flex items-start justify-center pt-2 shadow-inner`}>
        <span className="text-2xl">{emoji[rank]}</span>
      </div>
    </div>
  );
}

function LeaderboardRow({ contributor, rank }: { contributor: Contributor; rank: number }) {
  const badge = BADGE_CONFIG[contributor.badge];
  return (
    <div className="flex items-center gap-4 py-3.5 border-b border-border-light dark:border-border-dark last:border-0 group">
      {/* Rank */}
      <span className="font-mono font-bold text-body-sm text-text-secondary-light dark:text-text-secondary-dark w-7 text-center shrink-0">
        {rank}
      </span>

      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-surface-container dark:bg-inverse-surface flex items-center justify-center font-sora font-bold text-body-sm text-on-surface dark:text-text-primary-dark shrink-0">
        {contributor.avatar}
      </div>

      {/* Name + badge */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-sora font-semibold text-body-sm text-on-surface dark:text-text-primary-dark truncate">
            {contributor.name}
          </span>
          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge.bg} ${badge.color} shrink-0`}>
            {badge.label}
          </span>
        </div>
        <div className="font-inter text-[11px] text-text-secondary-light dark:text-text-secondary-dark mt-0.5 truncate">
          {contributor.subjects.slice(0, 2).join(", ")}{contributor.subjects.length > 2 ? ` +${contributor.subjects.length - 2}` : ""}
        </div>
      </div>

      {/* Stats */}
      <div className="text-right shrink-0">
        <div className="font-sora font-bold text-body-sm text-primary dark:text-primary-fixed-dim">
          {contributor.points} pts
        </div>
        <div className="font-mono text-[11px] text-text-secondary-light dark:text-text-secondary-dark">
          {contributor.uploads} uploads
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ContributePage() {
  const toast = useToast();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "leaderboard" | "howto">("leaderboard");
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [submissions, setSubmissions] = useState<ContributionSubmission[]>([]);

  // Form state
  const [form, setForm] = useState({
    contributorName: "",
    driveLink: "",
    subject: "",
    unit: "",
    year: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setContributors(getContributors());
    setSubmissions(getSubmissions());
  }, []);

  // Top 3 for podium
  const top3 = useMemo(() => contributors.slice(0, 3) as Contributor[], [contributors]);

  // Stats
  const totalUploads = useMemo(() => contributors.reduce((acc, c) => acc + c.uploads, 0), [contributors]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.contributorName.trim() || form.contributorName.trim().length < 2) {
      newErrors.contributorName = "Name must be at least 2 characters";
    }
    if (!form.driveLink.trim()) {
      newErrors.driveLink = "Drive link is required";
    } else if (!isDriveLink(form.driveLink)) {
      newErrors.driveLink = "Please provide a valid Google Drive or accessible link";
    }
    if (!form.subject) {
      newErrors.subject = "Please select a subject";
    }
    if (!form.unit) {
      newErrors.unit = "Please select a unit or type";
    }
    if (!form.year) {
      newErrors.year = "Please select a year";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800)); // Simulate async submission

    const submission: ContributionSubmission = {
      id: `sub_${Date.now()}`,
      contributorName: form.contributorName.trim(),
      driveLink: form.driveLink.trim(),
      subject: form.subject,
      year: form.year,
      unit: form.unit,
      description: form.description.trim(),
      submittedAt: new Date().toISOString(),
      status: "pending",
    };

    saveSubmission(submission);
    addContributorUpload(form.contributorName.trim(), form.subject);

    // Refresh data
    setContributors(getContributors());
    setSubmissions(getSubmissions());

    setSubmitting(false);
    setSubmitted(true);
    toast.success(`Thank you ${form.contributorName.split(" ")[0]}! Submission received 🎉`);

    // Reset form after 2s
    setTimeout(() => {
      setSubmitted(false);
      setForm({ contributorName: "", driveLink: "", subject: "", unit: "", year: "", description: "" });
      setActiveTab("leaderboard");
    }, 2000);
  };

  const steps = [
    {
      title: "1. Fork the Repository",
      desc: "Click the 'Fork' button on our GitHub repository to create a copy under your personal account.",
      icon: GitFork,
    },
    {
      title: "2. Edit or Add JSON Content",
      desc: "Locate the subject file inside the content/ directory (e.g. content/first-year/maths-2.json) and add your drive link.",
      icon: FileJson,
    },
    {
      title: "3. Open a Pull Request",
      desc: "Submit your changes as a Pull Request. Once our maintainers verify the link permissions, it gets merged and deployed instantly!",
      icon: CheckCircle,
    },
  ];

  const TABS = [
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
    { id: "upload", label: "Submit Notes", icon: Upload },
    { id: "howto", label: "How To Contribute", icon: BookOpen },
  ] as const;

  if (!mounted) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow max-w-container-max w-full mx-auto px-margin-mobile md:px-margin-desktop py-12 animate-pulse">
          <div className="h-10 w-64 bg-surface-container dark:bg-inverse-surface rounded-xl mb-8" />
          <div className="h-64 bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-2xl" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow max-w-container-max w-full mx-auto px-margin-mobile md:px-margin-desktop py-10 md:py-14">

        {/* Page Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-inverse-surface px-3 py-1 rounded-full text-label-mono font-mono text-primary dark:text-primary-fixed-dim mb-3 border border-primary/20">
            <Sparkles size={14} />
            Community Contributions
          </div>
          <h1 className="font-sora font-bold text-headline-lg md:text-headline-xl text-on-surface dark:text-text-primary-dark mb-2">
            Contribute & Earn Recognition
          </h1>
          <p className="font-inter text-body-lg text-text-secondary-light dark:text-text-secondary-dark max-w-2xl">
            Help your fellow classmates by submitting notes, PYQs, and study resources. Top contributors earn leaderboard badges and eternal glory 🏆
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Contributors", value: contributors.length, icon: Users, color: "text-blue-500" },
            { label: "Total Uploads", value: totalUploads, icon: FileText, color: "text-emerald-500" },
            { label: "Your Submissions", value: submissions.length, icon: TrendingUp, color: "text-purple-500" },
            { label: "Points on Offer", value: "10/upload", icon: Award, color: "text-amber-500" },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark p-4 rounded-2xl shadow-sm flex items-center gap-3">
              <div className={`${stat.color} p-2 rounded-xl bg-current/10`}>
                <stat.icon size={20} className={stat.color} />
              </div>
              <div>
                <div className="font-sora font-bold text-body-md text-on-surface dark:text-text-primary-dark">{stat.value}</div>
                <div className="font-inter text-[11px] text-text-secondary-light dark:text-text-secondary-dark">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 border-b border-border-light dark:border-border-dark pb-0">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 font-inter text-body-sm font-semibold border-b-2 -mb-px transition-all ${
                  isActive
                    ? "text-primary dark:text-primary-fixed-dim border-primary dark:border-primary-fixed-dim"
                    : "text-text-secondary-light dark:text-text-secondary-dark border-transparent hover:text-on-surface"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── LEADERBOARD TAB ───────────────────────────────────────────── */}
        {activeTab === "leaderboard" && (
          <div>
            {/* Podium */}
            {top3.length >= 3 && (
              <div className="bg-gradient-to-br from-amber-50 via-white to-slate-50 dark:from-amber-950/20 dark:via-bg-dark dark:to-slate-950/20 border border-border-light dark:border-border-dark rounded-2xl p-8 mb-8 shadow-sm">
                <h2 className="font-sora font-bold text-headline-sm text-on-surface dark:text-text-primary-dark text-center mb-8">
                  🏆 Top 3 Contributors This Month
                </h2>
                <div className="flex items-end justify-center gap-4 md:gap-8">
                  {/* Silver - 2nd */}
                  <PodiumCard contributor={top3[1]} rank={2} />
                  {/* Gold - 1st */}
                  <PodiumCard contributor={top3[0]} rank={1} />
                  {/* Bronze - 3rd */}
                  <PodiumCard contributor={top3[2]} rank={3} />
                </div>
              </div>
            )}

            {/* Full Leaderboard Table */}
            <div className="bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-2xl shadow-sm p-6">
              <h3 className="font-sora font-semibold text-headline-sm text-on-surface dark:text-text-primary-dark mb-4 flex items-center gap-2">
                <Star size={18} className="text-primary dark:text-primary-fixed-dim" />
                Full Leaderboard
              </h3>
              <div>
                {contributors.map((c, idx) => (
                  <LeaderboardRow key={c.id} contributor={c} rank={idx + 1} />
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-border-light dark:border-border-dark text-center">
                <p className="font-inter text-body-sm text-text-secondary-light dark:text-text-secondary-dark">
                  Want to appear here? Submit your notes and earn <strong className="text-primary dark:text-primary-fixed-dim">10 points per upload!</strong>
                </p>
                <button
                  onClick={() => setActiveTab("upload")}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-inter text-body-sm font-semibold hover:bg-primary-container shadow-sm transition-all active:scale-95"
                >
                  <Upload size={16} /> Submit Notes Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── UPLOAD TAB ───────────────────────────────────────────────── */}
        {activeTab === "upload" && (
          <div className="max-w-2xl">
            <div className="bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-2xl shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-primary/10 dark:bg-inverse-surface rounded-xl">
                  <Upload size={22} className="text-primary dark:text-primary-fixed-dim" />
                </div>
                <div>
                  <h2 className="font-sora font-bold text-headline-sm text-on-surface dark:text-text-primary-dark">
                    Submit Study Notes
                  </h2>
                  <p className="font-inter text-body-sm text-text-secondary-light dark:text-text-secondary-dark">
                    Share your Google Drive link for review. Earn +10 points when approved.
                  </p>
                </div>
              </div>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
                    <Check size={32} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="font-sora font-bold text-headline-sm text-emerald-600 dark:text-emerald-400">
                    Submission Received!
                  </h3>
                  <p className="font-inter text-body-sm text-text-secondary-light">
                    Your notes are under review. Points will be credited once approved.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  {/* Contributor Name */}
                  <div>
                    <label className="block font-inter text-body-sm font-medium text-on-surface dark:text-text-primary-dark mb-1.5">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.contributorName}
                      onChange={(e) => setForm({ ...form, contributorName: e.target.value })}
                      placeholder="e.g. Priya Sharma"
                      className={`w-full bg-surface-container dark:bg-inverse-surface border rounded-xl px-4 py-2.5 font-inter text-body-sm text-on-surface dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary transition ${errors.contributorName ? "border-red-400" : "border-border-light dark:border-border-dark"}`}
                    />
                    {errors.contributorName && (
                      <p className="mt-1 font-inter text-[12px] text-red-500 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.contributorName}
                      </p>
                    )}
                  </div>

                  {/* Year + Subject row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-inter text-body-sm font-medium text-on-surface dark:text-text-primary-dark mb-1.5">
                        Academic Year <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={form.year}
                        onChange={(e) => setForm({ ...form, year: e.target.value, subject: "" })}
                        className={`w-full bg-surface-container dark:bg-inverse-surface border rounded-xl px-4 py-2.5 font-inter text-body-sm text-on-surface dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary transition ${errors.year ? "border-red-400" : "border-border-light dark:border-border-dark"}`}
                      >
                        <option value="">Select year</option>
                        <option value="first-year">First Year (FE)</option>
                        <option value="second-year">Second Year (SE)</option>
                        <option value="third-year">Third Year (TE)</option>
                        <option value="fourth-year">Fourth Year (BE)</option>
                      </select>
                      {errors.year && (
                        <p className="mt-1 font-inter text-[12px] text-red-500 flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.year}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block font-inter text-body-sm font-medium text-on-surface dark:text-text-primary-dark mb-1.5">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className={`w-full bg-surface-container dark:bg-inverse-surface border rounded-xl px-4 py-2.5 font-inter text-body-sm text-on-surface dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary transition ${errors.subject ? "border-red-400" : "border-border-light dark:border-border-dark"}`}
                      >
                        <option value="">Select subject</option>
                        {SUBJECT_OPTIONS.map((group) => (
                          <optgroup key={group.group} label={group.group}>
                            {group.subjects.map((subj) => (
                              <option key={subj} value={subj}>{subj}</option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                      {errors.subject && (
                        <p className="mt-1 font-inter text-[12px] text-red-500 flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.subject}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Unit */}
                  <div>
                    <label className="block font-inter text-body-sm font-medium text-on-surface dark:text-text-primary-dark mb-1.5">
                      Unit / Content Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.unit}
                      onChange={(e) => setForm({ ...form, unit: e.target.value })}
                      className={`w-full bg-surface-container dark:bg-inverse-surface border rounded-xl px-4 py-2.5 font-inter text-body-sm text-on-surface dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary transition ${errors.unit ? "border-red-400" : "border-border-light dark:border-border-dark"}`}
                    >
                      <option value="">Select unit</option>
                      {UNIT_OPTIONS.map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                    {errors.unit && (
                      <p className="mt-1 font-inter text-[12px] text-red-500 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.unit}
                      </p>
                    )}
                  </div>

                  {/* Drive Link */}
                  <div>
                    <label className="block font-inter text-body-sm font-medium text-on-surface dark:text-text-primary-dark mb-1.5">
                      Google Drive Link <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      value={form.driveLink}
                      onChange={(e) => setForm({ ...form, driveLink: e.target.value })}
                      placeholder="https://drive.google.com/drive/folders/..."
                      className={`w-full bg-surface-container dark:bg-inverse-surface border rounded-xl px-4 py-2.5 font-inter text-body-sm text-on-surface dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary transition ${errors.driveLink ? "border-red-400" : "border-border-light dark:border-border-dark"}`}
                    />
                    {errors.driveLink ? (
                      <p className="mt-1 font-inter text-[12px] text-red-500 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.driveLink}
                      </p>
                    ) : (
                      <p className="mt-1 font-inter text-[12px] text-text-secondary-light dark:text-text-secondary-dark">
                        Make sure the folder/file has &quot;Anyone with the link&quot; access enabled
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block font-inter text-body-sm font-medium text-on-surface dark:text-text-primary-dark mb-1.5">
                      Brief Description (Optional)
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="What's in these notes? e.g. Handwritten notes for Unit 3, last 5 years PYQs..."
                      rows={3}
                      className="w-full bg-surface-container dark:bg-inverse-surface border border-border-light dark:border-border-dark rounded-xl px-4 py-2.5 font-inter text-body-sm text-on-surface dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary resize-none transition"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-sora font-semibold hover:bg-primary-container shadow transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={18} /> Submit Notes
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* My Submissions */}
            {submissions.length > 0 && (
              <div className="mt-8 bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-2xl p-6 shadow-sm">
                <h3 className="font-sora font-semibold text-headline-sm text-on-surface dark:text-text-primary-dark mb-4">
                  Your Previous Submissions ({submissions.length})
                </h3>
                <div className="space-y-3">
                  {submissions.slice(0, 5).map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between py-3 border-b border-border-light dark:border-border-dark last:border-0">
                      <div>
                        <div className="font-sora font-semibold text-body-sm text-on-surface dark:text-text-primary-dark">
                          {sub.subject} — {sub.unit}
                        </div>
                        <div className="font-mono text-[11px] text-text-secondary-light dark:text-text-secondary-dark mt-0.5">
                          {sub.contributorName} · {new Date(sub.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border ${
                        sub.status === "approved" ? "bg-emerald-50 text-emerald-600 border-emerald-300 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-700" :
                        sub.status === "rejected" ? "bg-red-50 text-red-600 border-red-300 dark:bg-red-950/30 dark:text-red-400" :
                        "bg-amber-50 text-amber-600 border-amber-300 dark:bg-amber-950/30 dark:text-amber-400"
                      }`}>
                        {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── HOW TO TAB ───────────────────────────────────────────────── */}
        {activeTab === "howto" && (
          <div className="max-w-3xl">
            {/* Steps */}
            <div className="grid grid-cols-1 gap-6 mb-10">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark p-6 rounded-2xl shadow-sm flex gap-5">
                    <div className="p-3 rounded-xl bg-primary/10 dark:bg-inverse-surface shrink-0 self-start">
                      <Icon size={22} className="text-primary dark:text-primary-fixed-dim" />
                    </div>
                    <div>
                      <h3 className="font-sora font-bold text-body-md text-on-surface dark:text-text-primary-dark mb-1">
                        {step.title}
                      </h3>
                      <p className="font-inter text-body-sm text-text-secondary-light dark:text-text-secondary-dark">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://github.com/Sanket-103-pvt/StudyBuddy-KKW"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary hover:bg-primary-container px-6 py-3 rounded-xl font-sora font-semibold transition-all shadow-sm active:scale-95"
              >
                <GithubIcon className="w-5 h-5" />
                Fork on GitHub
                <ExternalLink size={14} />
              </a>
              <a
                href="https://github.com/Sanket-103-pvt/StudyBuddy-KKW/blob/master/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-border-light dark:border-border-dark px-6 py-3 rounded-xl font-sora font-semibold text-text-secondary-light dark:text-text-secondary-dark hover:text-on-surface hover:bg-surface-container transition-all active:scale-95"
              >
                <FileText size={18} />
                Read CONTRIBUTING.md
                <ChevronRight size={14} />
              </a>
            </div>
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
}
