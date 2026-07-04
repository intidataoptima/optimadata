const CACHE_NAME = "settingrouter-v1";

const urlsToCache = [
  "/settingrouter/",
  "/settingrouter/index.html",
  "/settingrouter/assets/css/style.css",
  "/settingrouter/assets/js/app.js",
  "/settingrouter/assets/js/modem-data.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});