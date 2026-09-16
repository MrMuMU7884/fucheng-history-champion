const CACHE_NAME='fucheng-history-year4-v2';
const ASSETS=['./','./index.html','./style.css','./branding.css','../registration.css','../quiz-flow.js','./company-logo.png','./questions.js','./app.js','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request))));
