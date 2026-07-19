import type { Metadata } from "next";
import { Inter, Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import BackToTop from "@/components/BackToTop";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://study-buddy-kkw.vercel.app"),
  title: "Study Buddy KKW - K.K. Wagh Engineering Notes, PYQs & Study Hub",
  description: "Official study hub for K.K. Wagh Institute of Engineering Education & Research (KKWIEER) students. Access syllabus notes, PYQs, placement resources & AI study planner.",
  keywords: [
    "KKW",
    "kkwagh",
    "kkwagh engineering",
    "kk wagh placements",
    "kk wagh notes",
    "kkwieer",
    "KKWIEER Nashik",
    "K.K. Wagh Institute of Engineering Education & Research",
    "Study Buddy KKW",
    "KKW notes",
    "KKW PYQs",
    "KKW syllabus",
    "KKW SPPU notes",
    "Sanket Chaudhari KKW",
    "KKW AI&DS notes",
  ],
  authors: [{ name: "Sanket Chaudhari", url: "https://sanketchaudhari.in" }],
  creator: "Sanket Chaudhari",
  publisher: "Study Buddy KKW",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Study Buddy KKW - K.K. Wagh Engineering Notes & PYQs",
    description: "One hub for every note, PYQ, placement resource & study material K.K. Wagh students need.",
    url: "https://study-buddy-kkw.vercel.app",
    siteName: "Study Buddy KKW",
    images: [{ url: "/og-preview.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Study Buddy KKW - K.K. Wagh Engineering Study Hub",
    description: "Access unit notes, PYQs & AI study planning for KKW students.",
    images: ["/og-preview.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${sora.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-bg-light text-on-surface dark:bg-bg-dark dark:text-text-primary-dark`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
