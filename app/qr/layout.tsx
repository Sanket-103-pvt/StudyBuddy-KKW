import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Opening Study Buddy KKW",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
