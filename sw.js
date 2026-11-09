/* Service worker: makes the site work offline.
   Network-first, so a new deploy shows up as soon as you are online; the cache is the offline fallback.
   Bump VERSION to drop old caches after a big change. */
const VERSION = 'chem-as-v11';
const SHELL = [
  './', 'index.html', 'chapter.html', 'manifest.webmanifest',
  'assets/css/base.css',
  'assets/js/core/app.js', 'assets/js/core/home.js', 'assets/js/core/chapter.js',
  'assets/js/anim/engine.js', 'assets/js/anim/elements.js',
  'assets/fonts/noto-sans-bengali-bengali-wght-normal.woff2', 'assets/fonts/noto-sans-bengali-latin-wght-normal.woff2',
  'assets/favicon.svg', 'assets/icons/icon-192.png', 'assets/icons/icon-512.png', 'assets/icons/apple-touch-icon.png',
  'content/catalog.json',
  'content/class-11/ch02-structure-of-atom/chapter.json',
  'content/class-11/ch02-structure-of-atom/quiz.json',
  'content/class-11/ch02-structure-of-atom/anim.js',
  'content/class-12/ch01-solutions/chapter.json',
  'content/class-12/ch01-solutions/quiz.json',
  'content/class-12/ch01-solutions/anim.js',
  'content/class-12/ch02-electrochemistry/chapter.json',
  'content/class-12/ch02-electrochemistry/quiz.json',
  'content/class-12/ch02-electrochemistry/anim.js',
  'content/class-12/ch03-chemical-kinetics/chapter.json',
  'content/class-12/ch03-chemical-kinetics/quiz.json',
  'content/class-12/ch03-chemical-kinetics/anim.js',
  'content/class-12/ch04-d-f-block/chapter.json',
  'content/class-12/ch04-d-f-block/quiz.json',
  'content/class-12/ch04-d-f-block/anim.js',
  'content/class-12/ch05-coordination-compounds/chapter.json',
  'content/class-12/ch05-coordination-compounds/quiz.json',
  'content/class-12/ch05-coordination-compounds/anim.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req)
      .then((hit) => hit || caches.match(req, { ignoreSearch: true }))
      .then((hit) => hit || (req.mode === 'navigate' ? caches.match('index.html') : Response.error())))
  );
});
