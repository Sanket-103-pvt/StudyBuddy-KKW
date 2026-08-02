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
  MessageSquare,
  BarChart2
} from "lucide-react";
import { GithubIcon } from "@/components/icons";
import indexData from "@/content/index.json";
import { formatYearTitle, formatShortYear } from "@/lib/year-utils";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const yearKeys = Object.keys(indexData);

  const dynamicYearNavLinks = yearKeys.map((yearKey) => ({
    name: formatYearTitle(yearKey),
    shortName: formatShortYear(yearKey),
    href: `/${yearKey}`,
    icon: GraduationCap,
  }));

  interface NavItem {
    name: string;
    shortName?: string;
    href: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: React.ComponentType<any>;
  }

  const navLinks: NavItem[] = [
    { name: "Home", href: "/", icon: Home },
    ...dynamicYearNavLinks,
    { name: "Analytics", href: "/analytics", icon: BarChart2 },
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
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container dark:hover:bg-inverse-surface text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary-fixed-dim transition-colors"
              aria-label={mounted && theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {mounted ? (
                theme === "dark" ? <Sun size={20} /> : <Moon size={20} />
              ) : (
                <div className="w-5 h-5 rounded-full bg-surface-container dark:bg-inverse-surface animate-pulse" />
              )}
            </button>

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
        <div className="flex items-center h-16 max-w-full px-2 gap-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden justify-start sm:justify-around">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            const displayName = link.shortName || link.name;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center justify-center shrink-0 min-w-[3.25rem] px-2 h-14 rounded-lg transition-colors ${
                  isActive 
                    ? "text-primary dark:text-primary-fixed-dim" 
                    : "text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary-fixed-dim"
                }`}
              >
                <Icon size={19} />
                <span className="font-inter text-[10px] mt-0.5 whitespace-nowrap font-medium">{displayName}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
