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
  title: "Study Buddy KKW - K.K. Wagh Engineering Study Hub",
  description: "One hub for every note, PYQ, and resource K.K. Wagh students actually need.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
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
