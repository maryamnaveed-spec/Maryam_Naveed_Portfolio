const CACHE_NAME = 'maryam-naveed-v1';

// Small app-shell: icons/manifest only. Page HTML/JS/CSS are handled with a
// network-first strategy below (they're hashed per-build, so pre-listing
// them here would go stale). Supabase requests are never cached - the site
// leans on live data (art, books, chat, resume status), so caching those
// would show visitors outdated content.
const APP_SHELL = [
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function isSupabaseRequest(url) {
  return url.hostname.endsWith('.supabase.co');
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Never intercept Supabase (data, auth, storage, realtime) - always live.
  if (isSupabaseRequest(url)) return;
  // Only handle our own origin's requests.
  if (url.origin !== self.location.origin) return;

  // Page navigations: try the network first (fresh content), fall back to
  // cache, then to a minimal offline notice if nothing is cached yet.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(
          () =>
            caches.match(request).then(
              (cached) =>
                cached ||
                new Response(
                  '<h1 style="font-family:sans-serif;text-align:center;margin-top:20vh;">You are offline</h1><p style="text-align:center;font-family:sans-serif;color:#888;">Please reconnect to keep browsing.</p>',
                  { headers: { 'Content-Type': 'text/html' } }
                )
            )
        )
    );
    return;
  }

  // Static assets (icons, images, fonts, JS/CSS chunks): cache-first, then
  // refresh the cache in the background for next time.
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
});
