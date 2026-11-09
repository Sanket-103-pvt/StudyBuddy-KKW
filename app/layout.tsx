import type { Metadata } from "next";
import { Inter, Sora, JetBrains_Mono, Inter_Tight } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ToastProvider } from "@/components/ToastProvider";
import BackToTop from "@/components/BackToTop";
import PWARegister from "@/components/PWARegister";
import PWAInstallBanner from "@/components/PWAInstallBanner";
import SiteNav from "@/components/SiteNav";
import CommandPalette from "@/components/CommandPalette";
import AuthProvider from "@/components/AuthProvider";
import { Analytics } from "@vercel/analytics/next";
import { VisitTracker } from "@/components/VisitCounter";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-tight", display: "swap", weight: ["500", "600", "700"] });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.studybuddykkw.dev"),
  title: "Study Buddy KKW - K.K. Wagh Engineering Notes, PYQs & Study Hub",
  description: "Official study hub for K.K. Wagh Institute of Engineering Education & Research (KKWIEER) students. Subject-wise notes, SGPA/CGPA calculator and study tracking.",
  keywords: ["KKW", "kkwagh", "kkwagh engineering", "kk wagh placements", "kk wagh notes", "kkwieer", "KKWIEER Nashik", "K.K. Wagh Institute of Engineering Education & Research", "Study Buddy KKW", "KKW notes", "KKW PYQs", "KKW syllabus", "KKW SPPU notes", "Sanket Chaudhari KKW", "KKW AI&DS notes"],
  authors: [{ name: "Sanket Chaudhari", url: "https://sanketchaudhari.in" }],
  creator: "Sanket Chaudhari",
  publisher: "Study Buddy KKW",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg", shortcut: "/icon.svg", apple: "/apple-touch-icon.png" },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Study Buddy KKW" },
  openGraph: {
    title: "Study Buddy KKW - K.K. Wagh Engineering Notes & PYQs",
    description: "One hub for every note, PYQ, placement resource & study material K.K. Wagh students need.",
    url: "https://www.studybuddykkw.dev",
    siteName: "Study Buddy KKW",
    images: [{ url: "/og-preview.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Study Buddy KKW - K.K. Wagh Engineering Study Hub",
    description: "Subject-wise notes, SGPA/CGPA calculator and study tracking for KKW students.",
    images: ["/og-preview.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="msapplication-TileColor" content="#3b52d9" />
        <meta name="msapplication-TileImage" content="/icon.svg" />
        <meta name="msapplication-navbutton-color" content="#3b52d9" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Study Buddy" />
      </head>
      <body className={`${inter.variable} ${sora.variable} ${jetbrainsMono.variable} ${interTight.variable} antialiased bg-bg-light dark:bg-bg-dark text-on-surface dark:text-text-primary-dark`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} themes={["light", "dark"]}>
          <ToastProvider>
            <AuthProvider>
            {/* Global shell: top navigation, then the page content scrolls on its own. */}
            <div className="flex flex-col h-screen overflow-hidden">
              <SiteNav />
              <div id="main-scroll-area" className="flex-1 flex flex-col min-w-0 min-h-0 overflow-y-auto">
                {children}
              </div>
            </div>
            <VisitTracker />
            <Analytics />
            <CommandPalette />
            <BackToTop scrollContainerId="main-scroll-area" />
            <PWAInstallBanner />
          </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
        <PWARegister />
      </body>
    </html>
  );
}
