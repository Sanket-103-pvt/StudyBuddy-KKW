"use client";

/**
 * PWARegister component - registers the service worker and manages PWA state.
 * Must be rendered inside the root layout as a client-side only component.
 */

import { useEffect } from "react";

export default function PWARegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // Register service worker after page load to not block critical rendering path
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js", { scope: "/" })
          .then((registration) => {
            console.log("[PWA] Service worker registered:", registration.scope);

            // Check for updates every hour
            setInterval(() => {
              registration.update();
            }, 60 * 60 * 1000);
          })
          .catch((error) => {
            console.warn("[PWA] Service worker registration failed:", error);
          });
      });
    }
  }, []);

  return null;
}
