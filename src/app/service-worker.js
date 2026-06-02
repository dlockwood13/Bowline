/* ═════════════════════════════════════════════════════════════════════════
   SERVICE WORKER – Bowline PWA
   
   Provides:
   - Offline support (cache-first for assets, network-first for API)
   - Background sync for data persistence
   - Improved performance via intelligent caching
   - Works on iOS 16.1+ and Android 5.0+
   ═════════════════════════════════════════════════════════════════════════ */

const CACHE_VERSION = 'bowline-v1';
const ASSETS_CACHE = `${CACHE_VERSION}-assets`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;
const API_CACHE = `${CACHE_VERSION}-api`;

// ─── Assets to cache on install ───
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/src/styles/main.css',
  '/src/assets/bowline-mark.svg',
  '/src/assets/manifest.json',
  'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&display=swap',
  'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css',
];

// ─── INSTALL EVENT ───
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  
  event.waitUntil(
    caches.open(ASSETS_CACHE).then((cache) => {
      console.log('[SW] Pre-caching critical assets');
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Some assets failed to cache:', err);
      });
    }).then(() => {
      // Force new SW to activate immediately (development mode)
      self.skipWaiting();
    })
  );
});

// ─── ACTIVATE EVENT ───
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('bowline-') && name !== ASSETS_CACHE && name !== RUNTIME_CACHE && name !== API_CACHE)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      // Claim clients immediately
      return self.clients.claim();
    })
  );
});

// ─── FETCH EVENT ───
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests (except fonts)
  if (url.origin !== self.location.origin && !url.hostname.includes('fonts') && !url.hostname.includes('cdn.jsdelivr')) {
    return;
  }

  // Strategy 1: CACHE FIRST (for static assets)
  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image' ||
    request.destination === 'font' ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js')
  ) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response;
        }

        return fetch(request).then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200) {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(ASSETS_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });

          return response;
        }).catch((err) => {
          console.warn('[SW] Fetch failed for:', request.url, err);
          // Return placeholder for images if offline
          if (request.destination === 'image') {
            return new Response(
              '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="#EFEbE0" width="100" height="100"/></svg>',
              { headers: { 'Content-Type': 'image/svg+xml' } }
            );
          }
        });
      })
    );
    return;
  }

  // Strategy 2: NETWORK FIRST (for API calls & dynamic content)
  if (url.pathname.startsWith('/api') || request.headers.get('Accept')?.includes('application/json')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(API_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Return cached API response if network fails
          return caches.match(request).then((response) => {
            if (response) {
              return response;
            }
            // Return offline JSON response
            return new Response(
              JSON.stringify({ offline: true, message: 'App is offline' }),
              { headers: { 'Content-Type': 'application/json' } }
            );
          });
        })
    );
    return;
  }

  // Strategy 3: NETWORK FIRST (for HTML pages)
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (!response || response.status !== 200) {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(RUNTIME_CACHE).then((cache) => {
          cache.put(request, responseToCache);
        });

        return response;
      })
      .catch(() => {
        return caches.match(request).then((response) => {
          if (response) {
            return response;
          }
          // Return offline fallback page
          return caches.match('/index.html');
        });
      })
  );
});

// ─── BACKGROUND SYNC (for queuing actions when offline) ───
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(
      // TODO: Implement data sync logic
      Promise.resolve().then(() => {
        console.log('[SW] Background sync triggered');
      })
    );
  }
});

// ─── PUSH NOTIFICATIONS (for reminders) ───
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'Bowline reminder',
      icon: '/src/assets/bowline-mark-192.png',
      badge: '/src/assets/bowline-mark-192.png',
      tag: 'bowline-notification',
      requireInteraction: false,
      vibrate: [200, 100, 200],
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Bowline', options)
    );
  }
});

// ─── NOTIFICATION CLICK ───
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Check if app is already open
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new window if not already open
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

console.log('[SW] Service Worker loaded');
