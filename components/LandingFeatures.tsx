import React from "react";
import Link from "next/link";
import { BookOpen, Calculator, BarChart2, Timer, Flag, Users, ArrowUpRight } from "lucide-react";

const items = [
  { problem: "Notes are scattered across WhatsApp groups", solution: "One Year → Subject → Unit library of Drive links.", href: "/first-year", icon: BookOpen },
  { problem: "SGPA and CGPA by hand, every semester", solution: "A calculator built on the SPPU credit system.", href: "/calculator", icon: Calculator },
  { problem: "No idea how much syllabus is left", solution: "Progress tracking per subject, kept on your device.", href: "/analytics", icon: BarChart2 },
  { problem: "Exams sneak up on you", solution: "Countdown to your exam dates, with timetable links.", href: "/countdown", icon: Timer },
  { problem: "Drive links die and nobody tells you", solution: "Report a broken link in one tap. We verify and fix it.", href: "/first-year", icon: Flag },
  { problem: "Your good notes help no one", solution: "Submit them, get reviewed, and be credited by name.", href: "/contribute", icon: Users },
];

export default function LandingFeatures() {
  return (
    <section aria-labelledby="features-title" className="w-full mb-14 md:mb-20">
      <h2
        id="features-title"
        className="font-serif font-medium tracking-tight text-4xl md:text-5xl text-on-surface dark:text-text-primary-dark mb-3"
      >
        Forget the scramble
      </h2>
      <p className="text-text-secondary-light dark:text-text-secondary-dark max-w-xl mb-8">
        Every common study problem at KKW, and the one thing that fixes it.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map(({ problem, solution, href, icon: Icon }) => (
          <Link
            key={problem}
            href={href}
            className="group flex flex-col justify-between rounded-2xl border border-border-light dark:border-border-dark bg-surface-container-lowest dark:bg-bg-dark p-6 min-h-[13rem] hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <div>
              <Icon size={22} className="mb-4 text-on-surface dark:text-text-primary-dark" aria-hidden />
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark line-through decoration-1 mb-2">
                {problem}
              </p>
              <p className="font-serif text-2xl leading-snug text-on-surface dark:text-text-primary-dark">{solution}</p>
            </div>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-on-surface dark:text-text-primary-dark">
              Open <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
