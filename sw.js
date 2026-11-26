const CACHE_NAME = "imessage2-v2";

const FILES = [
  "./",
  "./index.html",
  "./app.js",
  "./manifest.json"
];

// Instalação
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const file of FILES) {
        try {
          await cache.add(file);
        } catch (error) {
          console.warn("Não foi possível guardar:", file);
        }
      }
    })
  );

  self.skipWaiting();
});

// Ativação
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );

  self.clients.claim();
});

// Funcionamento offline
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const copy = response.clone();

          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, copy);
          });
        }

        return response;
      }).catch(() => {
        return caches.match("./index.html");
      });
    })
  );
});
