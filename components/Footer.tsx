import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface-container-high dark:bg-inverse-surface w-full py-12 border-t border-border-light dark:border-border-dark mt-auto mb-16 md:mb-0 transition-colors">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="col-span-1 lg:col-span-2">
          <div className="font-sora font-bold text-headline-sm text-primary dark:text-primary-fixed-dim mb-4">
            Study Buddy KKW
          </div>
          <p className="font-inter text-body-sm text-text-secondary-light dark:text-text-secondary-dark mb-4 max-w-sm">
            One hub for every note, PYQ, and resource K.K. Wagh engineering students actually need. Built for students, by students.
          </p>
          <p className="font-inter text-body-sm text-text-secondary-light dark:text-text-secondary-dark">
            © {new Date().getFullYear()} Study Buddy KKW. Open Source Project under MIT License.
          </p>
        </div>
        
        <div>
          <h3 className="font-sora font-semibold text-body-md text-on-surface dark:text-text-primary-dark mb-3">
            Academic Resources
          </h3>
          <ul className="space-y-2">
            <li>
              <Link 
                href="/first-year" 
                className="font-inter text-body-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary-fixed-dim transition-colors"
              >
                First Year Materials
              </Link>
            </li>
            <li>
              <Link 
                href="/second-year" 
                className="font-inter text-body-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary-fixed-dim transition-colors"
              >
                Second Year Materials
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-sora font-semibold text-body-md text-on-surface dark:text-text-primary-dark mb-3">
            Community & Links
          </h3>
          <ul className="space-y-2">
            <li>
              <a 
                href="https://github.com/Sanket-103-pvt/StudyBuddy-KKW" 
                target="_blank"
                rel="noopener noreferrer"
                className="font-inter text-body-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary-fixed-dim transition-colors"
              >
                GitHub Repository
              </a>
            </li>
            <li>
              <Link 
                href="/contribute" 
                className="font-inter text-body-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary-fixed-dim transition-colors"
              >
                Contribute Notes
              </Link>
            </li>
            <li>
              <Link 
                href="/about" 
                className="font-inter text-body-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary-fixed-dim transition-colors"
              >
                About Project
              </Link>
            </li>
            <li>
              <Link 
                href="/contact" 
                className="font-inter text-body-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary-fixed-dim transition-colors"
              >
                Contact & Innovator
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
