// Service worker for Study Buddy KKW.
// - Pre-caches the app shell so previously visited pages open without a network.
// - Navigations: network first, fall back to cache, then to the cached home page.
// - Static assets (_next/static, icons): cache first.
// Google Drive notes are external links and are NOT available offline.

const VERSION = "v3";
const PRECACHE = `studybuddy-kkw-precache-${VERSION}`;
const RUNTIME = `studybuddy-kkw-runtime-${VERSION}`;
const MAX_RUNTIME_ITEMS = 80;

const PRECACHE_URLS = [
  "/",
  "/first-year",
  "/second-year",
  "/calculator",
  "/analytics",
  "/countdown",
  "/pyq",
  "/about",
  "/manifest.webmanifest",
  "/icon.svg",
];

// Routes that must always hit the network (auth, admin, API).
const NETWORK_ONLY = [/^\/api\//, /^\/auth/, /^\/admin/];

async function trimCache(name, max) {
  const cache = await caches.open(name);
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - max; i++) {
    await cache.delete(keys[i]);
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(PRECACHE).then((cache) =>
      // One failing URL must not abort the others.
      Promise.allSettled(PRECACHE_URLS.map((url) => cache.add(url)))
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(names.filter((n) => n !== PRECACHE && n !== RUNTIME).map((n) => caches.delete(n)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // never touch Drive / third-party requests
  if (NETWORK_ONLY.some((re) => re.test(url.pathname))) return;

  // Page navigations: network first, then cache, then cached home page.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(RUNTIME).then((c) => c.put(request, copy).then(() => trimCache(RUNTIME, MAX_RUNTIME_ITEMS)));
          }
          return response;
        })
        .catch(async () => (await caches.match(request)) || (await caches.match("/")) || Response.error())
    );
    return;
  }

  // Static assets: cache first.
  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/") || url.pathname === "/icon.svg") {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(RUNTIME).then((c) => c.put(request, copy).then(() => trimCache(RUNTIME, MAX_RUNTIME_ITEMS)));
            }
            return response;
          })
      )
    );
  }
});
