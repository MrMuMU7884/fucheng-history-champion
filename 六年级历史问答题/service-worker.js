const CACHE_NAME='fucheng-history-year6-v13';
const ASSETS=['./','./index.html','./style.css','./branding.css','../compact-branding.css','../registration.css','../fourth-grade.css','../sixth-grade-banner.png','./company-logo.png','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png','./questions.js','../app.js'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request))));
