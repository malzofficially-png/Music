(function () {
  'use strict';

  var LIKE_KEY = 'malz_liked_v1';
  var CONSENT_KEY = 'mm_consent_v1';

  function readStore(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }

  function writeStore(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
    try { localStorage.setItem(key + '_backup', JSON.stringify(value)); } catch (e) {}
  }

  function songKey(s) {
    if (!s) return '';
    var id = s.videoId || s.id || s.ytUrl || s.url || '';
    var title = s.title || '';
    var artist = s.artist || '';
    return String(id || (title + '::' + artist)).trim() + '::' + String(title).trim();
  }

  function getLikedSongs() {
    var list = readStore(LIKE_KEY, []);
    return Array.isArray(list) ? list : [];
  }

  function isLikedSong(s) {
    var k = songKey(s);
    var list = getLikedSongs();
    for (var i = 0; i < list.length; i++) {
      if (songKey(list[i]) === k) return true;
    }
    return false;
  }

  function toggleLikeSong(s) {
    if (!s) return false;
    var list = getLikedSongs();
    var k = songKey(s);
    var idx = -1;
    for (var i = 0; i < list.length; i++) {
      if (songKey(list[i]) === k) { idx = i; break; }
    }
    var nowLiked;
    if (idx >= 0) {
      list.splice(idx, 1);
      nowLiked = false;
    } else {
      list.unshift({
        id: s.videoId || s.id || '',
        videoId: s.videoId || s.id || '',
        title: s.title || '',
        artist: s.artist || '',
        cover: s.cover || '',
        ytUrl: s.ytUrl || ''
      });
      nowLiked = true;
    }
    writeStore(LIKE_KEY, list);
    document.dispatchEvent(new CustomEvent('liked:changed', { detail: { song: s, liked: nowLiked } }));
    return nowLiked;
  }

  window.getLikedSongs = getLikedSongs;
  window.isLikedSong = isLikedSong;
  window.toggleLikeSong = toggleLikeSong;

  function readConsent() {
    var c = null;
    try { c = localStorage.getItem(CONSENT_KEY); } catch (e) {}
    if (!c) {
      var m = /(^|;\s*)mm_consent_v1=([^;]*)/.exec(document.cookie || '');
      if (m) c = m[2];
    }
    return c === 'granted' || c === 'denied' ? c : null;
  }

  function saveConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch (e) {}
    document.cookie = CONSENT_KEY + '=' + value + '; Max-Age=31536000; Path=/; SameSite=Lax';
  }

  function showConsent() {
    if (document.getElementById('cookieConsent')) return;
    var old = document.getElementById('cookieConsent');
    if (old) old.remove();

    var box = document.createElement('div');
    box.id = 'cookieConsent';
    box.className = 'cookie-consent';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Kebenihan kuki');

    var text = document.createElement('div');
    text.className = 'cookie-consent-text';
    text.innerHTML =
      '<b>Adakah anda ingin kuki?</b>' +
      '<span>Kami guna kuki untuk menyimpan lagu disukai, tetapan pemain dan pengalaman gunaan anda yang lebih baik.</span>';

    var actions = document.createElement('div');
    actions.className = 'cookie-consent-actions';

    var accept = document.createElement('button');
    accept.type = 'button';
    accept.className = 'cookie-btn cookie-btn-yes';
    accept.textContent = 'Ya';
    accept.onclick = function () {
      saveConsent('granted');
      box.classList.remove('show');
      setTimeout(function () { box.remove(); }, 260);
      if (window.App && App.toast) App.toast('Kuki dibenarkan');
    };

    var reject = document.createElement('button');
    reject.type = 'button';
    reject.className = 'cookie-btn cookie-btn-no';
    reject.textContent = 'Tidak / Tolak Semua';
    reject.onclick = function () {
      saveConsent('denied');
      box.classList.remove('show');
      setTimeout(function () { box.remove(); }, 260);
      if (window.App && App.toast) App.toast('Kuki ditolak');
    };

    actions.appendChild(accept);
    actions.appendChild(reject);
    box.appendChild(text);
    box.appendChild(actions);
    document.body.appendChild(box);
    requestAnimationFrame(function () { box.classList.add('show'); });
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.card-like') : null;
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    var song = {
      videoId: btn.getAttribute('data-vid') || '',
      id: btn.getAttribute('data-vid') || '',
      title: btn.getAttribute('data-title') || '',
      artist: btn.getAttribute('data-artist') || '',
      cover: btn.getAttribute('data-cover') || '',
      ytUrl: btn.getAttribute('data-url') || ''
    };
    var liked = toggleLikeSong(song);
    btn.classList.toggle('liked', liked);
    btn.setAttribute('aria-pressed', liked ? 'true' : 'false');
    if (window.Liked && App && App.current === 'liked' && Liked.render) {
      try { Liked.render(); } catch (e) {}
    }
    if (window.App && App.toast) {
      App.toast(liked ? 'Ditambah ke Lagu Disukai' : 'Dihapus dari Lagu Disukai');
    }
  });

  function refreshLikeButtons() {
    var btns = document.querySelectorAll('.card-like');
    for (var i = 0; i < btns.length; i++) {
      var song = {
        videoId: btns[i].getAttribute('data-vid') || '',
        title: btns[i].getAttribute('data-title') || '',
        artist: btns[i].getAttribute('data-artist') || ''
      };
      btns[i].classList.toggle('liked', isLikedSong(song));
    }
  }

  document.addEventListener('liked:changed', refreshLikeButtons);

  function boot() {
    if (!readConsent()) {
      setTimeout(showConsent, 1200);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
