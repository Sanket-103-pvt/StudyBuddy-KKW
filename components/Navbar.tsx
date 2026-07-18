"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { 
  Home, 
  GraduationCap, 
  Info, 
  Sun, 
  Moon,
  MessageSquare
} from "lucide-react";
import { GithubIcon } from "@/components/icons";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "First Year", href: "/first-year", icon: GraduationCap },
    { name: "Second Year", href: "/second-year", icon: GraduationCap },
    { name: "About", href: "/about", icon: Info },
    { name: "Contact", href: "/contact", icon: MessageSquare },
    { name: "Contribute", href: "/contribute", icon: GithubIcon },
  ];

  return (
    <>
      {/* Top Header/Navbar for Desktop */}
      <nav className="bg-surface-container-lowest dark:bg-bg-dark w-full sticky top-0 border-b border-border-light dark:border-border-dark shadow-sm z-50 transition-colors">
        <div className="flex justify-between items-center h-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary-container flex items-center justify-center text-white font-sora font-bold text-lg shadow-sm">
              SB
            </div>
            <span className="font-sora text-headline-sm font-bold text-primary dark:text-primary-fixed-dim hidden sm:block">
              Study Buddy KKW
            </span>
          </Link>

          {/* Navigation Links - Desktop Only */}
          <ul className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`font-inter text-body-sm font-medium pb-1 border-b-2 transition-all duration-150 ${
                      isActive
                        ? "text-primary dark:text-primary-fixed-dim border-primary dark:border-primary-fixed-dim"
                        : "text-text-secondary-light dark:text-text-secondary-dark border-transparent hover:text-primary dark:hover:text-primary-fixed-dim"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Actions: Theme Switcher & GitHub Icon */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container dark:hover:bg-inverse-surface text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary-fixed-dim transition-colors"
                aria-label="Toggle Theme"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}

            {/* Quick Github Link - Desktop Only */}
            <a
              href="https://github.com/Sanket-103-pvt/StudyBuddy-KKW"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex w-10 h-10 items-center justify-center rounded-lg hover:bg-surface-container dark:hover:bg-inverse-surface text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary-fixed-dim transition-colors"
              aria-label="GitHub Repository"
            >
              <GithubIcon className="w-5 h-5" />
            </a>
          </div>
        </div>
      </nav>

      {/* Bottom Tab Bar for Mobile Only */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container-lowest dark:bg-bg-dark border-t border-border-light dark:border-border-dark shadow-lg z-50 transition-colors">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto">
          {/* Home Tab */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-lg transition-colors ${
              pathname === "/" 
                ? "text-primary dark:text-primary-fixed-dim" 
                : "text-text-secondary-light dark:text-text-secondary-dark"
            }`}
          >
            <Home size={20} />
            <span className="font-inter text-[10px] mt-1">Home</span>
          </Link>

          {/* First Year Tab */}
          <Link
            href="/first-year"
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-lg transition-colors ${
              pathname === "/first-year" 
                ? "text-primary dark:text-primary-fixed-dim" 
                : "text-text-secondary-light dark:text-text-secondary-dark"
            }`}
          >
            <GraduationCap size={20} />
            <span className="font-inter text-[10px] mt-1">1st Year</span>
          </Link>

          {/* Second Year Tab */}
          <Link
            href="/second-year"
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-lg transition-colors ${
              pathname === "/second-year" 
                ? "text-primary dark:text-primary-fixed-dim" 
                : "text-text-secondary-light dark:text-text-secondary-dark"
            }`}
          >
            <GraduationCap size={20} />
            <span className="font-inter text-[10px] mt-1">2nd Year</span>
          </Link>

          {/* About Tab */}
          <Link
            href="/about"
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-lg transition-colors ${
              pathname === "/about" 
                ? "text-primary dark:text-primary-fixed-dim" 
                : "text-text-secondary-light dark:text-text-secondary-dark"
            }`}
          >
            <Info size={20} />
            <span className="font-inter text-[10px] mt-1">About</span>
          </Link>

          {/* Contact Tab */}
          <Link
            href="/contact"
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-lg transition-colors ${
              pathname === "/contact" 
                ? "text-primary dark:text-primary-fixed-dim" 
                : "text-text-secondary-light dark:text-text-secondary-dark"
            }`}
          >
            <MessageSquare size={20} />
            <span className="font-inter text-[10px] mt-1">Contact</span>
          </Link>
        </div>
      </div>
    </>
  );
}
