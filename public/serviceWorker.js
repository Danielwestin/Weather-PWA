const CACHE_NAME = "cash-v2";
const urlsToCash = [
  "index.html",
  "offline.html",
  "https://fonts.googleapis.com/css?family=Cardo:400,700|Oswald&display=swap",
  "https://fonts.googleapis.com/css?family=Lora:400,700|Montserrat:300&display=swap",
  "https://fonts.gstatic.com/s/cardo/v13/wlp_gwjKBV1pqhv03IE7225PUCk.woff2",
  "https://fonts.gstatic.com/s/lora/v16/0QIvMX1D_JOuMwf7I_FMl_GW8g.woff2",
];

const self = this;

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("opened cache");
      return cache.addAll(urlsToCash);
    })

    // caches.open(CACHE_NAME).then((cache) => {
    //   return cache.match(e.request).then(
    //     (cacheResponse) =>
    //       cacheResponse ||
    //       fetch(e.request).then((networkResponse) => {
    //         cache.put(e.request, networkResponse.clone());
    //         return networkResponse;
    //       })
    //   );
    // })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((res) => {
      return fetch(event.request).catch(() => caches.match("offline.html"));
    })
  );
});

// cacheNames.map((cacheName) => {
//   if (!cacheWhiteList.includes(cacheName)) {
//     return caches.delete(cacheName);
//   }
// })

self.addEventListener("activate", (e) => {
  //   const cacheWhiteList = [];

  //   cacheWhiteList.push(CACHE_NAME);

  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});
