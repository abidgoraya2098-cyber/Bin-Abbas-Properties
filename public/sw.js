// Progressive Web App Service Worker for Bin Abbas Real Estate - Complete 100% Offline Engine
const CACHE_NAME = "bin-abbas-real-estate-offline-v4";

const CORE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.ico",
  "/icon.svg",
  "/logo.svg",
  "/logo.png",
  "/Bin-Abbas-Properties-Logo.png",
  "/bin_abbas_logo.jpg",
  "/3d-app-icon.png",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png"
];

// Install: Cache all essential core assets and activate immediately
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS).catch((err) => {
        console.warn("[PWA SW] Precache warning:", err);
      });
    })
  );
});

// Activate: Delete any outdated caches and claim clients immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[PWA SW] Clearing old cache:", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: 100% Offline-Ready Stale-While-Revalidate & Cache-First with Dynamic Network Update
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || !event.request.url.startsWith("http")) {
    return;
  }

  // 1. Navigation requests (HTML Pages)
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(event.request).then((cached) => {
            return cached || caches.match("/index.html") || caches.match("/");
          });
        })
    );
    return;
  }

  // 2. Static Assets (JS, CSS, SVGs, Images, Web Fonts)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => {
          return cachedResponse;
        });

      return cachedResponse || fetchPromise;
    })
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
