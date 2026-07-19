import React from "react";
import Image from "next/image";
import { 
  Mail, 
  MessageSquare, 
  AlertCircle, 
  Globe, 
  Sparkles,
  Code2,
  ExternalLink
} from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/icons";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow max-w-container-max w-full mx-auto px-margin-mobile md:px-margin-desktop py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 font-mono text-label-mono text-primary dark:text-primary-fixed-dim bg-primary-container/10 dark:bg-inverse-surface px-3.5 py-1 rounded-full uppercase tracking-wider mb-4 border border-border-light dark:border-border-dark">
              <Sparkles size={14} className="animate-pulse" /> Support & Community
            </span>
            <h1 className="font-sora font-bold text-headline-lg md:text-headline-xl text-on-surface dark:text-text-primary-dark mb-4">
              Get in Touch with Us
            </h1>
            <p className="font-inter text-body-lg text-text-secondary-light dark:text-text-secondary-dark">
              Have questions, feedback, or need help with study resources? We&apos;re here to help K.K. Wagh students succeed.
            </p>
          </div>

          {/* Website Innovator & Creator Feature Card */}
          <section className="relative bg-gradient-to-br from-surface-container-lowest via-surface-container-lowest to-surface-container-low dark:from-bg-dark dark:via-bg-dark dark:to-inverse-surface border border-border-light dark:border-border-dark rounded-3xl p-8 md:p-10 shadow-xl overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-primary/10 dark:bg-primary-fixed-dim/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              {/* Left Details */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-primary dark:text-primary-fixed-dim mb-2">
                    <Code2 size={16} /> Lead Website Innovator & Creator
                  </div>
                  <h2 className="font-sora font-bold text-headline-md md:text-headline-lg text-on-surface dark:text-text-primary-dark">
                    Sanket Chaudhari
                  </h2>
                  <p className="font-mono text-body-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mt-1">
                    Department of AI & Data Science (AI&DS) • K.K. Wagh Institute
                  </p>
                </div>

                {/* Slogan Badge */}
                <div className="p-4 rounded-2xl bg-surface-container dark:bg-inverse-surface/60 border border-border-light dark:border-border-dark">
                  <p className="font-sora font-semibold text-body-md text-primary dark:text-primary-fixed-dim italic">
                    &ldquo;Every problem, one solution — Study Buddy&rdquo;
                  </p>
                  <p className="font-inter text-body-sm text-text-secondary-light dark:text-text-secondary-dark mt-2 leading-relaxed">
                    Building student-first digital solutions for K.K. Wagh. Passionate about AI & Data Science, crafting intuitive, accessible, and high-impact web platforms for engineering students.
                  </p>
                </div>

                {/* Handles Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <a
                    href="https://sanketchaudhari.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark hover:border-primary dark:hover:border-primary-fixed-dim flex flex-col items-start transition-all group shadow-sm hover:shadow"
                  >
                    <div className="flex items-center justify-between w-full text-text-secondary-light dark:text-text-secondary-dark group-hover:text-primary dark:group-hover:text-primary-fixed-dim mb-1">
                      <Globe size={16} />
                      <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="font-sora font-semibold text-[11px] text-on-surface dark:text-text-primary-dark truncate w-full">
                      Portfolio
                    </span>
                    <span className="font-mono text-[10px] text-text-secondary-light dark:text-text-secondary-dark truncate w-full">
                      sanketchaudhari.in
                    </span>
                  </a>

                  <a
                    href="https://github.com/sanket1035"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark hover:border-primary dark:hover:border-primary-fixed-dim flex flex-col items-start transition-all group shadow-sm hover:shadow"
                  >
                    <div className="flex items-center justify-between w-full text-text-secondary-light dark:text-text-secondary-dark group-hover:text-primary dark:group-hover:text-primary-fixed-dim mb-1">
                      <GithubIcon className="w-4 h-4" />
                      <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="font-sora font-semibold text-[11px] text-on-surface dark:text-text-primary-dark truncate w-full">
                      GitHub
                    </span>
                    <span className="font-mono text-[10px] text-text-secondary-light dark:text-text-secondary-dark truncate w-full">
                      @sanket1035
                    </span>
                  </a>

                  <a
                    href="https://www.linkedin.com/in/sanketchaudhari1035/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark hover:border-primary dark:hover:border-primary-fixed-dim flex flex-col items-start transition-all group shadow-sm hover:shadow"
                  >
                    <div className="flex items-center justify-between w-full text-text-secondary-light dark:text-text-secondary-dark group-hover:text-primary dark:group-hover:text-primary-fixed-dim mb-1">
                      <LinkedinIcon className="w-4 h-4" />
                      <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="font-sora font-semibold text-[11px] text-on-surface dark:text-text-primary-dark truncate w-full">
                      LinkedIn
                    </span>
                    <span className="font-mono text-[10px] text-text-secondary-light dark:text-text-secondary-dark truncate w-full">
                      @sanketchaudhari1035
                    </span>
                  </a>

                  <a
                    href="https://www.instagram.com/sanket_.103"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark hover:border-primary dark:hover:border-primary-fixed-dim flex flex-col items-start transition-all group shadow-sm hover:shadow"
                  >
                    <div className="flex items-center justify-between w-full text-text-secondary-light dark:text-text-secondary-dark group-hover:text-primary dark:group-hover:text-primary-fixed-dim mb-1">
                      <InstagramIcon className="w-4 h-4" />
                      <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="font-sora font-semibold text-[11px] text-on-surface dark:text-text-primary-dark truncate w-full">
                      Instagram
                    </span>
                    <span className="font-mono text-[10px] text-text-secondary-light dark:text-text-secondary-dark truncate w-full">
                      @sanket_.103
                    </span>
                  </a>
                </div>
              </div>

              {/* Right Avatar / Innovator Image Card */}
              <div className="lg:col-span-5 flex items-stretch justify-center h-full">
                <div className="p-1 rounded-3xl bg-gradient-to-tr from-primary via-blue-500 to-amber-400 shadow-xl overflow-hidden w-full h-full min-h-[300px] flex items-center justify-center">
                  <Image
                    src="/sanket-chaudhari.jpeg"
                    alt="Sanket Chaudhari"
                    width={600}
                    height={800}
                    className="w-full h-full min-h-[300px] object-cover object-top rounded-[22px] hover:scale-[1.02] transition-transform duration-300"
                    priority
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Standard Support Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email Card */}
            <div className="bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark p-6 rounded-2xl flex gap-4 transition-colors shadow-sm hover:shadow">
              <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-inverse-surface flex items-center justify-center text-primary dark:text-primary-fixed-dim shrink-0">
                <Mail size={22} />
              </div>
              <div>
                <h3 className="font-sora font-semibold text-body-md text-on-surface dark:text-text-primary-dark mb-1">
                  Official Email Address
                </h3>
                <p className="font-inter text-body-sm text-text-secondary-light dark:text-text-secondary-dark mb-3">
                  Send notes, drive folders, PYQ papers, or platform inquiries directly.
                </p>
                <a 
                  href="mailto:Studybuddykkw@gmail.com" 
                  className="font-mono font-medium text-body-sm text-primary dark:text-primary-fixed-dim hover:underline"
                >
                  Studybuddykkw@gmail.com
                </a>
              </div>
            </div>

            {/* GitHub Discussions Card */}
            <div className="bg-surface-container-lowest dark:bg-bg-dark border border-border-light dark:border-border-dark p-6 rounded-2xl flex gap-4 transition-colors shadow-sm hover:shadow">
              <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-inverse-surface flex items-center justify-center text-primary dark:text-primary-fixed-dim shrink-0">
                <MessageSquare size={22} />
              </div>
              <div>
                <h3 className="font-sora font-semibold text-body-md text-on-surface dark:text-text-primary-dark mb-1">
                  GitHub Open Source Hub
                </h3>
                <p className="font-inter text-body-sm text-text-secondary-light dark:text-text-secondary-dark mb-3">
                  Report bugs, request missing subjects, or contribute code.
                </p>
                <a 
                  href="https://github.com/Sanket-103-pvt/StudyBuddy-KKW" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-inter text-body-sm text-primary dark:text-primary-fixed-dim hover:underline font-semibold flex items-center gap-1.5"
                >
                  Visit GitHub Repository <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 p-6 rounded-2xl flex gap-4 items-start shadow-sm">
            <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-sora font-semibold text-body-md text-amber-800 dark:text-amber-300 mb-1">
                Notice: Missing Notes or Broken Drive Links
              </h4>
              <p className="font-inter text-body-sm text-amber-700 dark:text-amber-400">
                If you encounter a dead Google Drive link or wish to submit new subject notes, email us at <strong className="font-mono text-amber-900 dark:text-amber-200">Studybuddykkw@gmail.com</strong> or open an issue on our GitHub repository.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
