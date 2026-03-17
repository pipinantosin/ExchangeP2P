const CACHE_NAME = "bw-exchanger-v1";

const urlsToCache = [

"/exchangep2p/",
"/exchangep2p/index.html",

"/exchangep2p/css/style.css",
"/exchangep2p/css/dashboard.css",
"/exchangep2p/css/header.css",
"/exchangep2p/css/modal.css",

"/exchangep2p/js/config.js",
"/exchangep2p/js/alur-transaksi.js",
"/exchangep2p/js/blockchain.js",

"/exchangep2p/js/history.js",

"/exchangep2p/js/app.js",
"/exchangep2p/js/account.js",
"/exchangep2p/js/user.js",
"/exchangep2p/js/price.js",
"/exchangep2p/js/wa.js",
"/exchangep2p/js/exchanger.js",
"/exchangep2p/js/qr.js",
"/exchangep2p/js/toast.js",
"/exchangep2p/js/splash.js",
"/exchangep2p/js/dashboard-mode.js",
"/exchangep2p/js/currency-toggle.js",
"/exchangep2p/js/settings.js",
"/exchangep2p/js/lang.js",
"/exchangep2p/js/info.js",

"/exchangep2p/images/pi.png",
"/exchangep2p/images/sda.png",
"/exchangep2p/images/bunda-widya.jpg",
"/exchangep2p/images/icon-192.png",
"/exchangep2p/images/icon-512.png"

];


// INSTALL
self.addEventListener("install", event => {

console.log("SW install");

event.waitUntil(

caches.open(CACHE_NAME)
.then(cache => cache.addAll(urlsToCache))

);

self.skipWaiting();

});


// ACTIVATE
self.addEventListener("activate", event => {

console.log("SW activate");

event.waitUntil(

caches.keys().then(keys => {

return Promise.all(

keys.map(key => {

if(key !== CACHE_NAME){
return caches.delete(key);
}

})

);

})

);

self.clients.claim();

});


// FETCH (offline mode)
self.addEventListener("fetch", event => {

event.respondWith(

caches.match(event.request)
.then(response => {

return response || fetch(event.request);

})

);

});

// PUSH NOTIFICATION
self.addEventListener('push', event => {
  let data = {title: 'Notifikasi', body: 'Transaksi baru masuk'};
  if(event.data){
    data = event.data.json();
  }

  self.registration.showNotification(data.title, {
    body: data.body,
    icon: 'images/sda.png'
  });
});