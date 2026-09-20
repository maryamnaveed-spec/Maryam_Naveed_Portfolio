const CACHE_NAME = 'maryam-naveed-v2';

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

// Only Next.js's own hashed, immutable build output is safe to cache
// aggressively - a given hashed filename's content never changes.
// Everything else (pages, and critically Next's internal RSC/data fetches
// that happen on client-side navigation between pages) must always hit
// the network, or admin changes (new/edited/deleted products, art, etc.)
// would keep showing stale until a hard refresh.
function isImmutableBuildAsset(url) {
  return url.pathname.startsWith('/_next/static/');
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Never intercept Supabase (data, auth, storage, realtime) - always live.
  if (isSupabaseRequest(url)) return;
  // Only handle our own origin's requests.
  if (url.origin !== self.location.origin) return;

  // Full page navigations: always go to the network first (bypassing the
  // browser's own HTTP cache too, via cache: 'no-store'), and only fall
  // back to a cached shell / offline notice if the network is unreachable.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request, { cache: 'no-store' })
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

  // Hashed build assets (icons, images, JS/CSS chunks under /_next/static/):
  // cache-first is safe since their filename changes whenever content does.
  if (isImmutableBuildAsset(url) || APP_SHELL.includes(url.pathname)) {
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
    return;
  }

  // Everything else - including Next.js's internal RSC/data fetches used
  // for client-side page transitions, and any other same-origin request -
  // is left completely untouched, straight to the network. This is what
  // actually fixes admin edits/deletes not showing up until a hard reload.
});
