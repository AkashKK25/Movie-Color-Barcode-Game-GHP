/**
 * Service Worker for Movie Color Barcode Game
 * Provides offline functionality by caching assets
 */

const CACHE_NAME = 'movie-barcode-game-v1';

// Files to cache
const filesToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/js/gameEngine.js',
  '/js/animations.js',
  '/data/categories.js',
  '/data/easy.js',
  '/data/hard.js',
  '/assets/images/background-barcode.png',
  '/assets/images/favicon.ico',
  '/assets/sounds/correct.mp3',
  '/assets/sounds/wrong.mp3',
  '/assets/sounds/game-over.mp3',
  '/assets/sounds/tick.mp3',
  '/assets/sounds/start.mp3'
];

// Install service worker
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching Files...');
        return cache.addAll(filesToCache);
      })
      .then(() => {
        console.log('Service Worker: Installed');
        return self.skipWaiting();
      })
  );
});

// Activate service worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  // Clean up old caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    })
    .then(() => {
      console.log('Service Worker: Activated');
      return self.clients.claim();
    })
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  console.log('Service Worker: Fetching');
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest)
          .then(response => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            // Open cache
            caches.open(CACHE_NAME)
              .then(cache => {
                // Add response to cache
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(error => {
            // Network failed, try to serve offline page
            console.log('Service Worker: Fetch failed; returning offline page', error);
          });
      })
  );
});
