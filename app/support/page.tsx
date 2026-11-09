import type { Metadata } from "next";
import React from "react";
import { Coffee } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/icons";
import Footer from "@/components/Footer";
import { BUY_ME_A_COFFEE_URL, SUPPORT_LINKS, UPI_ID, UPI_LINK } from "@/lib/support-config";

export const metadata: Metadata = {
  title: "Support & Career Tips | Study Buddy KKW",
  description: "Study Buddy KKW is free. If it helped you, buy the creator a coffee and ask for career, GitHub and LinkedIn tips.",
  alternates: { canonical: "/support" },
};

const card = "rounded-none border border-border-light dark:border-border-dark bg-surface-container-lowest dark:bg-bg-dark p-6";
const btn = "inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-none text-sm font-medium transition-colors";

export default function SupportPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow max-w-container-max w-full mx-auto px-margin-mobile md:px-margin-desktop py-12">
        <div className="max-w-3xl mx-auto space-y-10">
          <header>
            <h1 className="font-tight font-semibold tracking-tight leading-[1.15] text-4xl md:text-5xl text-on-surface dark:text-text-primary-dark mb-4">
              Everything here stays <span className="bg-[var(--lp-accent)] text-black px-1.5 [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">free</span>
            </h1>
            <p className="font-inter text-body-lg text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
              Notes, the calculator and every tool on Study Buddy are free for every KKW student, and nothing is locked behind a payment.
              If it saved you time, you can say thanks with a coffee, and I will happily help you with career questions.
            </p>
          </header>

          <section className={card} aria-labelledby="about-heading">
            <h2 id="about-heading" className="font-tight text-2xl text-on-surface dark:text-text-primary-dark mb-3">About me</h2>
            <p className="font-inter text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
              I am Sanket Chaudhari, a final-year B.Tech student in Artificial Intelligence and Data Science at KKWIEER, and the creator of Study Buddy KKW.
              I built it because finding notes through WhatsApp groups and dead Drive links wasted everyone&apos;s time. I also contribute to open source on GitHub.
            </p>
          </section>

          <section className={card} aria-labelledby="tips-heading">
            <h2 id="tips-heading" className="font-tight text-2xl text-on-surface dark:text-text-primary-dark mb-3">What you can ask me</h2>
            <ul className="font-inter text-text-secondary-light dark:text-text-secondary-dark space-y-2 list-disc pl-5">
              <li>How to start and structure your <strong>GitHub</strong> profile and projects.</li>
              <li>How to improve your <strong>LinkedIn</strong> profile and reach out to people.</li>
              <li>Career and placement preparation, from a student who is going through it too.</li>
            </ul>
            <p className="font-inter text-sm text-text-secondary-light dark:text-text-secondary-dark mt-4">
              This is advice from one student to another, not a placement guarantee or a paid course.
            </p>
          </section>

          <section className={card} aria-labelledby="coffee-heading">
            <h2 id="coffee-heading" className="font-tight text-2xl text-on-surface dark:text-text-primary-dark mb-3">Buy me a coffee</h2>
            <div className="flex flex-col sm:flex-row gap-6 items-start mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/upi-qr.png" alt={`UPI QR code for ${UPI_ID}`} width={180} height={180} className="rounded-none border border-border-light dark:border-border-dark bg-white p-2" />
              <div className="font-inter text-text-secondary-light dark:text-text-secondary-dark space-y-3">
                <p>Scan with any UPI app (GPay, PhonePe, Paytm), or on your phone tap the button. Any amount, even ₹20 is appreciated.</p>
                <p className="font-mono text-sm break-all">UPI ID: <span className="text-on-surface dark:text-text-primary-dark">{UPI_ID}</span></p>
                <a href={UPI_LINK} className={`${btn} bg-on-surface text-white dark:bg-white dark:text-black hover:opacity-90 sm:hidden`}>Pay with UPI app</a>
              </div>
            </div>
            <ol className="font-inter text-text-secondary-light dark:text-text-secondary-dark space-y-1 list-decimal pl-5 mb-5">
              <li>Pay by UPI above, or through Buy Me a Coffee. Payments happen in your payment app, not on this site.</li>
              <li>Then message me on LinkedIn or Instagram and tell me what you need help with.</li>
            </ol>
            <div className="flex flex-wrap gap-3">
              {BUY_ME_A_COFFEE_URL ? (
                <a href={BUY_ME_A_COFFEE_URL} target="_blank" rel="noopener noreferrer" className={`${btn} bg-on-surface text-white dark:bg-white dark:text-black hover:opacity-90`}>
                  <Coffee size={16} aria-hidden /> Buy me a coffee
                </a>
              ) : (
                <span className={`${btn} border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark`}>
                  <Coffee size={16} aria-hidden /> Coffee link coming soon
                </span>
              )}
              <a href={SUPPORT_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className={`${btn} border border-border-light dark:border-border-dark hover:bg-surface-container dark:hover:bg-inverse-surface`}>
                <LinkedinIcon className="w-4 h-4" /> LinkedIn
              </a>
              <a href={SUPPORT_LINKS.instagram} target="_blank" rel="noopener noreferrer" className={`${btn} border border-border-light dark:border-border-dark hover:bg-surface-container dark:hover:bg-inverse-surface`}>
                <InstagramIcon className="w-4 h-4" /> Instagram
              </a>
              <a href={SUPPORT_LINKS.github} target="_blank" rel="noopener noreferrer" className={`${btn} border border-border-light dark:border-border-dark hover:bg-surface-container dark:hover:bg-inverse-surface`}>
                <GithubIcon className="w-4 h-4" /> GitHub
              </a>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
