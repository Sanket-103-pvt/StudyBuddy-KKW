import type { Metadata } from "next";
import AdminPanel from "@/components/AdminPanel";

export const metadata: Metadata = {
  title: "Admin | Study Buddy KKW",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main className="flex-grow max-w-container-max w-full mx-auto px-margin-mobile md:px-margin-desktop py-10 md:py-12">
      <h1 className="font-sora font-bold text-headline-lg text-on-surface dark:text-text-primary-dark mb-8">Admin</h1>
      <AdminPanel />
    </main>
  );
}
