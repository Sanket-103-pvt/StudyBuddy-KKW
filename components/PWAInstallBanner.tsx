"use client";

/**
 * PWAInstallBanner component - shows a custom install prompt banner when the
 * browser's beforeinstallprompt event fires. Includes dismiss and install actions.
 */

import React, { useState, useEffect } from "react";
import { Download, X, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed as standalone PWA
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
      return;
    }

    // Check if user already dismissed this session
    const dismissed = sessionStorage.getItem("pwa_install_dismissed");
    if (dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Listen for successful installation
    window.addEventListener("appinstalled", () => {
      setInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setInstalled(true);
    }
    setShowBanner(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem("pwa_install_dismissed", "true");
  };

  if (!showBanner || installed) return null;

  return (
    <div
      id="pwa-install-banner"
      className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-[60] animate-in slide-in-from-bottom-4 duration-300"
      role="banner"
      aria-label="Install Study Buddy KKW app"
    >
      <div className="bg-surface-container-lowest dark:bg-bg-dark border border-primary/30 dark:border-primary/40 rounded-2xl shadow-xl p-4 flex items-start gap-4">
        {/* App Icon */}
        <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-inverse-surface flex items-center justify-center shrink-0 border border-primary/20">
          <Smartphone size={24} className="text-primary dark:text-primary-fixed-dim" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-sora font-bold text-body-md text-on-surface dark:text-text-primary-dark leading-tight">
            Install Study Buddy KKW
          </h3>
          <p className="font-inter text-[12px] text-text-secondary-light dark:text-text-secondary-dark mt-0.5 leading-snug">
            Add to home screen for faster access, offline study notes, and a native app experience.
          </p>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3">
            <button
              id="pwa-install-btn"
              onClick={handleInstall}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-primary text-white font-inter text-[13px] font-semibold hover:bg-primary-container shadow-sm transition-all active:scale-95"
            >
              <Download size={14} /> Install Now
            </button>
            <button
              id="pwa-dismiss-btn"
              onClick={handleDismiss}
              className="px-3 py-1.5 rounded-xl font-inter text-[13px] font-medium text-text-secondary-light dark:text-text-secondary-dark hover:bg-surface-container dark:hover:bg-inverse-surface transition-all"
            >
              Not now
            </button>
          </div>
        </div>

        {/* Close */}
        <button
          onClick={handleDismiss}
          className="p-1 rounded-lg text-text-secondary-light hover:text-on-surface hover:bg-surface-container dark:hover:bg-inverse-surface transition-colors shrink-0 -mr-1 -mt-1"
          aria-label="Dismiss install prompt"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
