import type { Metadata } from "next";
import React from "react";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Study Buddy KKW",
  description: "What Study Buddy KKW stores about you, and why.",
  alternates: { canonical: "/privacy" },
};

const H2 = "font-sora font-semibold text-headline-sm text-on-surface dark:text-text-primary-dark mt-8 mb-3";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow max-w-container-max w-full mx-auto px-margin-mobile md:px-margin-desktop py-12">
        <div className="max-w-3xl mx-auto font-inter text-body-md text-text-secondary-light dark:text-text-secondary-dark space-y-4 leading-relaxed">
          <h1 className="font-tight font-semibold text-4xl md:text-5xl text-on-surface dark:text-text-primary-dark">Privacy Policy</h1>
          <p className="text-sm">Last updated: 9 November 2026</p>
          <p>Study Buddy KKW is a free student project run by Sanket Chaudhari. This page says what we store and why. We do not sell data and we do not run advertising trackers.</p>

          <h2 className={H2}>If you only browse</h2>
          <p>You do not need an account. Your bookmarks, recently viewed subjects, study progress, study time and exam dates are saved in your own browser (localStorage) and never sent to us. Clearing your browser data deletes them.</p>

          <h2 className={H2}>If you sign in with Google</h2>
          <p>Signing in is only needed to contribute notes, report broken links or appear on the leaderboard. Sign-up is limited to KKWagh college email accounts (@kkwagh.edu.in). We use Supabase Authentication with Google. We receive your Google account name and email address from Google. We store your display name (taken from your Google name) in our database. Your sign-in session is kept in your browser&apos;s localStorage. We do not receive your Google password.</p>

          <h2 className={H2}>What you submit</h2>
          <p>When you submit a resource link, a timetable link or a broken-link report, we store the link, the title and description you wrote, the subject, the review status and any points the admin gave, together with your account. If your submission is approved, your display name is shown publicly next to it and on the leaderboard.</p>

          <h2 className={H2}>Who can see it</h2>
          <p>Only the site admin can see pending submissions and who sent them. Other students see only approved items and public display names. Our hosting and database providers (Vercel and Supabase) process data on our behalf and keep standard server logs such as IP addresses.</p>

          <h2 className={H2}>Page view statistics</h2>
          <p>We use Vercel Web Analytics to count page views and see which pages are used. It does not use cookies and does not follow you across other websites. We also keep a simple daily visit count (one number per day, no personal data).</p>

          <h2 className={H2}>Error reports</h2>
          <p>When the site crashes in your browser, an error report (the error message, the page address and basic browser details) is sent to Sentry so we can fix it. We turn off sending IP addresses and personal details, and we do not record what you type.</p>

          <h2 className={H2}>Cookies</h2>
          <p>We do not set advertising or tracking cookies, so there is no cookie banner. Sign-in and preferences (such as light or dark theme) use browser storage.</p>

          <h2 className={H2}>Your choices</h2>
          <p>To see or delete your account and everything you submitted, email Studybuddykkw@gmail.com from your Google address and we will remove it. You can also clear local data any time from your browser settings.</p>

          <h2 className={H2}>Contact</h2>
          <p>Questions about privacy: Studybuddykkw@gmail.com</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
