// Service worker Beri Log — généré automatiquement
const CACHE = 'berilog-runtime';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  const isDocument =
    req.mode === 'navigate' ||
    url.pathname === '/' ||
    url.pathname.endsWith('.html');

  if (isDocument) {
    // RÉSEAU D'ABORD + no-store : on contourne le cache HTTP pour toujours
    // récupérer la toute dernière page (donc le dernier bundle). Hors-ligne,
    // on retombe sur la version en cache.
    event.respondWith(
      fetch(req, { cache: 'no-store' })
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() =>
          caches.match(req).then((r) => r || caches.match('/index.html'))
        )
    );
    return;
  }

  // Fichiers à nom unique (JS/images) : cache d'abord (rapides + hors-ligne).
  event.respondWith(
    caches.match(req).then(
      (cached) =>
        cached ||
        fetch(req).then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
    )
  );
});
