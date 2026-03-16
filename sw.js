// ================================
// BUNDAWIDYA EXCHANGER PWA SW
// ================================

const CACHE_VERSION = "bw-exchanger-v1";

const STATIC_CACHE = CACHE_VERSION + "-static";
const DYNAMIC_CACHE = CACHE_VERSION + "-dynamic";

const APP_SHELL = [

  "/exchangep2p/",
  "/exchangep2p/index.html",

  "/exchangep2p/css/style.css",
  "/exchangep2p/css/header.css",
  "/exchangep2p/css/dashboard.css",

  "/exchangep2p/js/app.js",
  "/exchangep2p/js/config.js",
  "/exchangep2p/js/exchanger.js",
  "/exchangep2p/js/pwa.js",

  "/exchangep2p/images/bunda-widya.jpg"

];

// ================================
// INSTALL
// ================================

self.addEventListener("install", event => {

  console.log("[SW] Installing...");

  event.waitUntil(

    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(APP_SHELL))

  );

  self.skipWaiting();

});

// ================================
// ACTIVATE
// ================================

self.addEventListener("activate", event => {

  console.log("[SW] Activated");

  event.waitUntil(

    caches.keys().then(keys => {

      return Promise.all(

        keys.map(key => {

          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {

            return caches.delete(key);

          }

        })

      );

    })

  );

  self.clients.claim();

});

// ================================
// FETCH
// ================================

self.addEventListener("fetch", event => {

  if (event.request.method !== "GET") return;

  event.respondWith(

    caches.match(event.request)

      .then(cacheRes => {

        if (cacheRes) return cacheRes;

        return fetch(event.request)

          .then(fetchRes => {

            return caches.open(DYNAMIC_CACHE)

              .then(cache => {

                cache.put(event.request, fetchRes.clone());

                return fetchRes;

              });

          })

          .catch(() => {

            // fallback ke index agar tidak 404
            return caches.match("/exchangep2p/index.html");

          });

      })

  );

});