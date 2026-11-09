"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ToastProvider";

const EMAIL = "Studybuddykkw@gmail.com";

const profiles = [
  { label: "Portfolio", handle: "sanketchaudhari.in", href: "https://sanketchaudhari.in" },
  { label: "LinkedIn", handle: "sanketchaudhari1035", href: "https://www.linkedin.com/in/sanketchaudhari1035/" },
  { label: "GitHub", handle: "sanket1035", href: "https://github.com/sanket1035" },
  { label: "Instagram", handle: "sanket_.103", href: "https://www.instagram.com/sanket_.103" },
];

const eyebrow = "font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--lp-muted)]";

export default function ContactPage() {
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      toast.success("Email address copied.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy the email address.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--lp-bg)] text-[var(--lp-ink)]">
      <main className="flex-grow w-full max-w-[1100px] mx-auto px-5 md:px-8 py-14 md:py-20">
        <header className="max-w-2xl">
          <p className={eyebrow}>Contact</p>
          <h1 className="font-tight font-semibold tracking-[-0.03em] text-4xl md:text-5xl mt-3">Contact StudyBuddy</h1>
          <p className="mt-5 text-lg text-[var(--lp-muted)] leading-relaxed">
            For questions, corrections, or to contribute study material, write to us using the details below. Every message is read by the person who maintains the platform.
          </p>
        </header>

        {/* About the maintainer. The photo fades into the page, with no frame. */}
        <section className="mt-16 grid md:grid-cols-[1fr_320px] gap-10 md:gap-16 items-start" aria-labelledby="maintainer">
          <div>
            <p className={eyebrow}>Founder and developer</p>
            <h2 id="maintainer" className="font-tight font-semibold tracking-[-0.02em] text-3xl mt-3">Sanket Chaudhari</h2>
            <p className="mt-1 text-[var(--lp-muted)]">B.Tech, Artificial Intelligence and Data Science, KKWIEER, Nashik</p>
            <p className="mt-6 text-[var(--lp-muted)] leading-relaxed max-w-xl">
              I built StudyBuddy to give K.K. Wagh students one dependable place for notes and study tools. I maintain the platform, review every contribution and keep the resources current.
            </p>

            <ul className="mt-8 border-t border-[var(--lp-line)]">
              {profiles.map((p) => (
                <li key={p.label} className="border-b border-[var(--lp-line)]">
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-4 min-h-[56px] hover:bg-[var(--lp-panel)] px-1 group"
                  >
                    <span className="font-medium">{p.label}</span>
                    <span className="flex items-center gap-2 text-sm text-[var(--lp-muted)] min-w-0">
                      <span className="font-mono truncate">{p.handle}</span>
                      <ArrowUpRight size={16} aria-hidden className="shrink-0 group-hover:text-[var(--lp-ink)]" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative order-first md:order-none max-w-[320px]">
            <Image
              src="/sanket-chaudhari.jpeg"
              alt="Sanket Chaudhari"
              width={600}
              height={800}
              priority
              className="w-full h-auto object-cover object-top grayscale-[20%]"
              style={{
                WebkitMaskImage: "linear-gradient(to bottom, #000 62%, transparent 100%)",
                maskImage: "linear-gradient(to bottom, #000 62%, transparent 100%)",
              }}
            />
          </div>
        </section>

        {/* Ways to get in touch */}
        <section className="mt-20" aria-labelledby="touch">
          <p className={eyebrow}>Get in touch</p>
          <h2 id="touch" className="font-tight font-semibold tracking-[-0.02em] text-3xl mt-3 mb-8">How we can help</h2>

          <div className="border-t border-[var(--lp-line)]">
            <div className="grid md:grid-cols-[260px_1fr] gap-2 md:gap-10 py-7 border-b border-[var(--lp-line)]">
              <h3 className="font-tight font-semibold text-lg">General enquiries and submissions</h3>
              <div>
                <p className="text-[var(--lp-muted)] leading-relaxed">Send questions, feedback, notes or Drive folders by email.</p>
                <div className="mt-3 flex items-center gap-1">
                  <a href={`mailto:${EMAIL}`} className="font-mono text-[15px] underline underline-offset-4">{EMAIL}</a>
                  <button
                    type="button"
                    onClick={copyEmail}
                    aria-label="Copy email address"
                    className="w-11 h-11 inline-flex items-center justify-center hover:bg-[var(--lp-panel)]"
                  >
                    {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-[260px_1fr] gap-2 md:gap-10 py-7 border-b border-[var(--lp-line)]">
              <h3 className="font-tight font-semibold text-lg">Bugs and feature requests</h3>
              <div>
                <p className="text-[var(--lp-muted)] leading-relaxed">StudyBuddy is open source. Report a problem or request a missing subject on GitHub.</p>
                <a
                  href="https://github.com/Sanket-103-pvt/StudyBuddy-KKW/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 font-medium underline underline-offset-4 min-h-[44px]"
                >
                  Open an issue <ArrowUpRight size={15} aria-hidden />
                </a>
              </div>
            </div>

            <div className="grid md:grid-cols-[260px_1fr] gap-2 md:gap-10 py-7 border-b border-[var(--lp-line)]">
              <h3 className="font-tight font-semibold text-lg">Broken links</h3>
              <p className="text-[var(--lp-muted)] leading-relaxed">
                Use the flag icon next to any resource to report a link that no longer works. You need to be logged in with your college email. You can also email the link to us.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
