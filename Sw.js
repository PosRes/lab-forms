const CACHE = 'qms-lab-v1';
const STATIC = [
  '/',
  '/index.html',
  '/media-opening-record.html',
  '/reference-strain-record.html',
  '/equipment-log.html',
  '/records-viewer.html',
];

// Install: cache all static pages
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting())
  );
});

// Activate: delete old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch strategy:
// - Apps Script (Google) → always network
// - Static files → cache first, fallback network, update cache in background
self.addEventListener('fetch', e => {
  const url = e.request.url;

  // Always network for Apps Script / Google APIs
  if (url.includes('script.google.com') || url.includes('googleapis.com') || url.includes('fonts.g')) {
    e.respondWith(fetch(e.request).catch(() => new Response('', {status: 503})));
    return;
  }

  // Cache-first with background refresh for static assets
  e.respondWith(
    caches.open(CACHE).then(async cache => {
      const cached = await cache.match(e.request);
      const fetchPromise = fetch(e.request).then(res => {
        if (res.ok) cache.put(e.request, res.clone());
        return res;
      }).catch(() => null);

      return cached || fetchPromise;
    })
  );
});
