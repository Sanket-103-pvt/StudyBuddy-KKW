import type { Metadata } from "next";
import LoginView from "./LoginView";

export const metadata: Metadata = {
  title: "Login / Sign up | Study Buddy KKW",
  description: "Sign in to Study Buddy KKW with your KKWagh college email.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <LoginView />;
}
