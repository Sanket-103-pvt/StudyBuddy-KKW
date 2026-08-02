import React from "react";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">

      <main className="flex-grow max-w-container-max w-full mx-auto px-margin-mobile md:px-margin-desktop py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-sora font-bold text-headline-lg md:text-headline-xl text-on-surface dark:text-text-primary-dark mb-6">
            About Study Buddy KKW
          </h1>

          <div className="prose prose-blue dark:prose-invert font-inter text-body-lg text-text-secondary-light dark:text-text-secondary-dark space-y-6">
            <p>
              <strong>Study Buddy KKW</strong> is a central educational hub created specifically for engineering students at the <strong>K. K. Wagh Institute of Engineering Education & Research (KKWIEER)</strong>, Nashik.
            </p>
            
            <p>
              This project was born out of a simple problem: students wasting valuable time searching across WhatsApp chats, scattered Google Drive directories, and outdated portals for notes and past papers. Study Buddy solves this by organizing all essential materials—PPTs, handwritten notes, syllabus details, and question banks—in a mobile-friendly, single-click interface.
            </p>

            <h2 className="font-sora font-semibold text-headline-sm text-on-surface dark:text-text-primary-dark mt-8 mb-4">
              Our Impact
            </h2>
            <p>
              What started as a simple resource directory has now grown to serve over <strong>400+ students per year</strong>. It has become a trusted companion during exam preparations, helping students find exactly what they need in under 30 seconds.
            </p>

            <h2 className="font-sora font-semibold text-headline-sm text-on-surface dark:text-text-primary-dark mt-8 mb-4">
              Open Source Initiative
            </h2>
            <p>
              To ensure the content remains accurate, up-to-date, and comprehensive, Study Buddy KKW is now an open-source project. Any student can contribute by adding unit-wise notes, updating syllabus details, or correcting links.
            </p>
            <p>
              This collaborative model helps the portal grow while giving student contributors real-world experience working with GitHub and open-source workflows.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
