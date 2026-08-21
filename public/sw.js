// Progressive Web App Service Worker for Bin Abbas Real Estate - Live Real-Time & Offline Engine
const CACHE_NAME = "bin-abbas-real-estate-v25-live";

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

// Install: Skip waiting immediately so new code activates on all phones
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

// Activate: Delete all previous outdated caches and claim all clients immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[PWA SW] Purging old cache version:", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 🔔 Notification Click Handler: Opens/Focuses the App directly when notification is clicked
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const urlToOpen = (event.notification.data && event.notification.data.url) || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // If the app is already open in background, focus and bring it to front
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          return client.focus();
        }
      }
      // If not already open, open the app in a new window/tab
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Fetch: Network-First for real-time live updates, bypassing cache for all cloud & API endpoints
self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  // 1. COMPLETELY BYPASS Cache for Cloud Sync, Upstash, REST APIs, and Non-GET requests
  if (
    event.request.method !== "GET" || 
    url.includes("upstash.io") || 
    url.includes("/api/") || 
    url.includes("restful-api.dev") || 
    url.includes("data/ads.json") || 
    url.includes("data/devices.json") ||
    !url.startsWith("http")
  ) {
    return;
  }

  // 2. Network-First Strategy for HTML, JS bundles, and Assets (Fresh updates first, offline fallback)
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Fallback to cache when offline
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (event.request.mode === "navigate") {
            return caches.match("/index.html") || caches.match("/");
          }
          return new Response("", { status: 503, statusText: "Offline" });
        });
      })
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
