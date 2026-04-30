const CACHE_NAME = 'primero-donas-v1';

const ASSETS = [
  './',
  './primero-donas-menu.html',
  'https://fonts.googleapis.com/css2?family=Yellowtail&family=Fredoka+One&family=Fredoka:wght@300;400;500;600&display=swap'
];

// Instalación: guarda todos los recursos en caché
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activación: elimina cachés viejas
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch: primero caché, si no hay red
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => {
      return cached || fetch(e.request).then((response) => {
        // Guarda recursos nuevos en caché (fuentes de Google, etc.)
        if (e.request.url.startsWith('https://fonts.')) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        }
        return response;
      }).catch(() => cached);
    })
  );
});
