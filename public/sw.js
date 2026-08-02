// Service Worker for Study Buddy KKW PWA
// Implements stale-while-revalidate caching for offline notes, PDFs, and pages with bounded cache storage.

const CACHE_NAME = "studybuddy-kkw-v2";
const MAX_CACHE_ITEMS = 60; // Bounded cache size to prevent storage bloating on mobile browsers

const PRECACHE_ASSETS = [
  "/",
  "/first-year",
  "/second-year",
  "/third-year",
  "/fourth-year",
  "/calculator",
  "/analytics",
  "/contribute",
  "/about",
  "/manifest.webmanifest",
  "/icon.svg",
  "/workers/search.worker.js",
  "/content/index.json",
];

// Helper to prune cache if item count exceeds MAX_CACHE_ITEMS
async function limitCacheSize(cacheName, maxItems) {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    if (keys.length > maxItems) {
      await cache.delete(keys[0]);
      await limitCacheSize(cacheName, maxItems);
    }
  } catch (err) {
    console.error("Failed to prune cache:", err);
  }
}

// Install: pre-cache static pages, search index worker, and key JSON configs
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn("Some precache assets failed to load:", err);
      });
    })
  );
  self.skipWaiting();
});

// Activate: clean up older cache versions
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch: Stale-while-revalidate strategy for pages, notes, JSON configs, and PDFs
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET or cross-origin non-http(s) requests
  if (request.method !== "GET" || !url.protocol.startsWith("http")) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(request).then((cachedResponse) => {
        // Fetch network update in background (Stale-while-revalidate)
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              cache.put(request, responseToCache);
              limitCacheSize(CACHE_NAME, MAX_CACHE_ITEMS);
            }
            return networkResponse;
          })
          .catch(() => {
            // Offline fallback
            if (cachedResponse) return cachedResponse;
            if (request.mode === "navigate") {
              return cache.match("/");
            }
          });

        // Return cached response immediately if available, or wait for network fetch
        return cachedResponse || fetchPromise;
      });
    })
  );
});
