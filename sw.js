// ================= CACHE VERSION =================

const CACHE_NAME = 'bw-exchanger-cache-' + new Date().toISOString().replace(/[-:.TZ]/g,'');

const FILES_TO_CACHE = [

  '/',
  '/index.html',

  '/css/style.css',
  '/css/header.css',
  '/css/dashboard.css',
  '/css/toast.css',

  '/js/app.js',
  '/js/config.js',
  '/js/price.js',
  '/js/exchanger.js',
  '/js/history.js',
  '/js/pwa.js',

  '/images/bunda-widya.jpg',
  '/images/sidra.png',
  '/images/pi.png'
];

// INSTALL

self.addEventListener('install', evt => {

  console.log('[SW] Install');

  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );

  self.skipWaiting();

});

// ACTIVATE

self.addEventListener('activate', evt => {

  console.log('[SW] Activate');

  evt.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null)
      )
    )
  );

  self.clients.claim();

});

// FETCH

self.addEventListener('fetch', evt => {

  if (evt.request.method !== 'GET') return;

  evt.respondWith(
    caches.match(evt.request)
      .then(cached => cached || fetch(evt.request))
  );

});