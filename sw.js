// Service Worker for Divine Quotes PWA
const CACHE_NAME = 'divine-quotes-v2';

const ASSETS_TO_CACHE = [
  './',
  'index.html',
  'css/style.css',
  'js/quotes.js',
  'js/notifications.js',
  'js/app.js',
  'manifest.webmanifest',
  'icons/icon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png'
];

// Install: Cache all static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up previous cache versions
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
    }).then(() => self.clients.claim())
  );
});

// Fetch: Cache-First strategy for ultra-fast and offline experience
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse);
            });
          }
        }).catch(() => {/* Offline, ignore */});
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});

// Background Web Push entry point.
// A server-side Web Push provider can send a payload to this handler.
self.addEventListener('push', (event) => {
  let payload = {};

  try {
    payload = event.data ? event.data.json() : {};
  } catch (err) {
    payload = { body: event.data ? event.data.text() : '' };
  }

  const title = payload.title || 'Divine Quotes';
  const options = {
    body: payload.body || 'A moment of sacred wisdom is waiting for you.',
    icon: payload.icon || 'icons/icon-192.png',
    badge: payload.badge || 'icons/icon-192.png',
    tag: payload.tag || 'daily-divine-quote',
    renotify: Boolean(payload.renotify),
    data: {
      url: payload.url || './',
      quoteId: payload.quoteId || null
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification Click: Focus existing client or open new window
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      const targetUrl = event.notification.data?.url || './';

      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
