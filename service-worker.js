const CACHE_NAME = 'bwexchanger-v1';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  // tambahkan semua CSS & JS penting
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch dari cache dulu, lalu network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(cacheResp => {
      return cacheResp || fetch(event.request).then(networkResp => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResp.clone());
          return networkResp;
        });
      });
    })
  );
});

// auto-update ketika ada versi baru
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') self.skipWaiting();
});