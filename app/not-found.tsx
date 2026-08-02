import React from "react";
import Link from "next/link";
import { AlertCircle, Home } from "lucide-react";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">

      <main className="flex-grow flex flex-col items-center justify-center px-margin-mobile py-16 text-center max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/20 text-red-500 flex items-center justify-center mb-6 border border-red-100 dark:border-red-900/50">
          <AlertCircle size={32} />
        </div>
        
        <h1 className="font-sora font-bold text-headline-lg md:text-headline-xl text-on-surface dark:text-text-primary-dark mb-3">
          Page Not Found
        </h1>
        
        <p className="font-inter text-body-lg text-text-secondary-light dark:text-text-secondary-dark mb-8">
          The page or subject resource you are looking for doesn&apos;t exist, or has been moved to a new year&apos;s curriculum.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link 
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary hover:bg-primary-container px-5 py-3 rounded-lg font-sora font-semibold transition-colors shadow-sm"
          >
            <Home size={18} />
            Go to Homepage
          </Link>
          
          <Link 
            href="/first-year"
            className="inline-flex items-center justify-center gap-2 bg-surface-container-low dark:bg-inverse-surface text-on-surface dark:text-text-primary-dark border border-border-light dark:border-border-dark hover:bg-surface-container transition-colors px-5 py-3 rounded-lg font-sora font-semibold"
          >
            Browse Subjects
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
