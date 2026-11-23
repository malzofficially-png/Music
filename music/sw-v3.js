const CACHE = 'malz-musify-v7';
const ASSETS = [
  '/music/',
  '/music/assets/css/style.css',
  '/music/assets/css/spotify.css',
  '/music/assets/css/malz-glass.css',
  '/music/assets/css/fp-anim.css',
  '/music/assets/css/theme.css',
  '/music/assets/theme.js',
  '/music/assets/app.js',
  '/music/assets/player.js',
  '/music/assets/home.js',
  '/music/assets/search.js',
  '/music/assets/library.js',
  '/music/assets/liked.js',
  '/music/assets/profile.js',
  '/music/assets/miniplayer.js',
  '/music/assets/fullplayer.js',
  '/music/assets/artist.js',
  '/music/assets/album.js',
  '/music/assets/icons/icon-192.png',
  '/music/assets/icons/icon-512.png',
  '/music/assets/manifest.json'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return Promise.allSettled(
        ASSETS.map(function (url) {
          return fetch(url, { cache: 'no-cache' }).then(function (res) {
            if (res && res.status === 200) return c.put(url, res);
          }).catch(function () {});
        })
      );
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE; })
            .map(function (k) { return caches.delete(k); })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (url.pathname.indexOf('/api.php') !== -1) return;
  if (url.pathname.indexOf('/audio') !== -1) return;
  if (req.headers.get('range')) return;

  e.respondWith(
    fetch(req, { cache: 'no-cache' }).then(function (res) {
      if (res && res.status === 200 && url.pathname.indexOf('/api.php') === -1) {
        var clone = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, clone); });
      }
      return res;
    }).catch(function () {
      return caches.match(req, { ignoreSearch: true }).then(function (c) {
        return c || caches.match('/music/');
      });
    })
  );
});
