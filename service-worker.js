const CACHE_NAME = 'vallonieres-cache-v1';
const urlsToCache = [
  '/vallonnieres-wms/',
  '/vallonnieres-wms/index.html',
  '/vallonnieres-wms/manifest.json'
];

// Install: Cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch: Serve from cache, then network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});