const CACHE_NAME = 'luxi-pwa-cache-v1';
const urlsToCache = [
  './', // Caches index.html
  './index.html',
  // Aquí debes listar todas las URLs de tus archivos locales que quieres cachear:
  // Si tienes archivos CSS externos, JS externos, o imágenes locales, agrégalos aquí.
  // Ejemplo:
  // './css/styles.css',
  // './js/main.js',
  './luxi-icon-192x192.png', // Los iconos del manifest
  './luxi-icon-512x512.png',
  './luxi-icon-maskable.png',
  // La URL de tu logo de Luxi (si es local)
  // './WhatsApp Image 2025-05-29 at 16.59.02.jpeg-0d8a5e03-557d-42ea-a541-dbd550b5fd13'
  // Si la URL de tu logo es la de Firebase Storage, no es necesario cachearla aquí
  // ya que es un recurso externo que se carga desde la red.
];

// Evento 'install': Se ejecuta cuando el Service Worker se instala por primera vez.
// Aquí cacheamos los activos de la aplicación.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento 'fetch': Intercepta las solicitudes de red.
// Intenta servir los recursos desde la caché, y si no están, va a la red.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Si el recurso está en caché, lo devuelve.
        if (response) {
          return response;
        }
        // Si no está en caché, va a la red para obtenerlo.
        return fetch(event.request);
      })
  );
});

// Evento 'activate': Se ejecuta cuando el Service Worker se activa.
// Aquí limpiamos cachés antiguas para asegurar que solo la versión actual esté en uso.
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Elimina cachés antiguas
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
