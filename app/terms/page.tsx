import type { Metadata } from "next";
import React from "react";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service | Study Buddy KKW",
  description: "Terms for using Study Buddy KKW.",
  alternates: { canonical: "/terms" },
};

const H2 = "font-sora font-semibold text-headline-sm text-on-surface dark:text-text-primary-dark mt-8 mb-3";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow max-w-container-max w-full mx-auto px-margin-mobile md:px-margin-desktop py-12">
        <div className="max-w-3xl mx-auto font-inter text-body-md text-text-secondary-light dark:text-text-secondary-dark space-y-4 leading-relaxed">
          <h1 className="font-serif font-medium text-4xl md:text-5xl text-on-surface dark:text-text-primary-dark">Terms of Service</h1>
          <p className="text-sm">Last updated: 9 November 2026</p>
          <p>By using Study Buddy KKW you agree to these terms. It is a free, student-run project and is not an official page of K.K. Wagh Institute of Engineering Education and Research.</p>

          <h2 className={H2}>What the site is</h2>
          <p>Study Buddy KKW organises links to study material, mostly on Google Drive, plus a few tools such as the SGPA/CGPA calculator. We do not host most of the files ourselves. Material is provided as is, can be wrong or out of date, and is not a substitute for your syllabus, faculty or official college notices. Check calculator results against official records.</p>

          <h2 className={H2}>Contributing</h2>
          <p>Only submit links to material you made, or have the right to share. Do not submit copyrighted books or paid content, personal data, or anything harmful or misleading. The admin may approve, edit or reject any submission and may remove approved items at any time. Points are given by the admin at their discretion and have no cash value. We may block accounts that spam or abuse the site.</p>

          <h2 className={H2}>Copyright and takedowns</h2>
          <p>If something listed here infringes your rights, email Studybuddykkw@gmail.com with the link and we will remove it promptly.</p>

          <h2 className={H2}>No warranty</h2>
          <p>The site is free and provided without guarantees of availability or accuracy. To the extent the law allows, we are not liable for losses from using it.</p>

          <h2 className={H2}>Changes</h2>
          <p>We may update these terms. The date above shows the latest version.</p>

          <h2 className={H2}>Contact</h2>
          <p>Studybuddykkw@gmail.com</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
