import type { Metadata } from "next";
import Footer from "@/components/Footer";
import ContributePanel from "@/components/ContributePanel";

export const metadata: Metadata = {
  title: "Contribute Notes | Study Buddy KKW",
  description: "Share notes with K.K. Wagh students, get reviewed by the admin and earn points on the contributor leaderboard.",
};

export default function ContributePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow max-w-container-max w-full mx-auto px-margin-mobile md:px-margin-desktop py-10 md:py-12">
        <h1 className="font-sora font-bold text-headline-lg md:text-headline-xl text-on-surface dark:text-text-primary-dark mb-3">
          Contribute notes
        </h1>
        <p className="font-inter text-body-lg text-text-secondary-light dark:text-text-secondary-dark mb-10 max-w-2xl">
          Help other students find good notes. Every submission is reviewed before it goes live.
        </p>
        <ContributePanel />
      </main>
      <Footer />
    </div>
  );
}
