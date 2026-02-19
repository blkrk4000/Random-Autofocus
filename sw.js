
const CACHE_NAME = 'autofocus-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg'
];

// Install Event: Cache Core Assets
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Sofort aktivieren
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Wir versuchen zu cachen, aber fangen Fehler ab, falls im Dev-Modus Dateien fehlen
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('Pre-caching failed (expected in dev):', err);
      });
    })
  );
});

// Activate Event: Cleanup Old Caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch Event: Network First, falling back to Cache
// Strategie: Wir versuchen immer frische Daten zu holen (Network First), 
// damit Updates sofort sichtbar sind. Wenn offline, nehmen wir den Cache.
self.addEventListener('fetch', (event) => {
  // Nur GET Requests cachen
  if (event.request.method !== 'GET') return;

  // Ignore chrome-extension schemes
  if (event.request.url.startsWith('chrome-extension://')) return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Erfolgreichen Request in den Cache legen (dynamisches Caching)
        // Wir cachen ALLES was erfolgreich geladen wird
        return caches.open(CACHE_NAME).then((cache) => {
          try {
             cache.put(event.request, networkResponse.clone());
          } catch (e) {
             console.warn('Cache put failed', e);
          }
          return networkResponse;
        });
      })
      .catch(() => {
        // Bei Netzwerkfehler (Offline) aus dem Cache lesen
        return caches.match(event.request);
      })
  );
});