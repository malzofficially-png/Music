(function () {
  'use strict';

  function gid(id) { return document.getElementById(id); }
  function es(s) {
    if (s == null) return '';
    var d = document.createElement('div');
    d.textContent = String(s);
    return d.innerHTML;
  }
  function esJs(s) {
    if (s == null) return '';
    return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;').replace(/\n/g, ' ').replace(/\r/g, '');
  }

  var Liked = {
    render: function () {
      var el = gid('view-liked');
      if (!el) {
        el = document.createElement('div');
        el.id = 'view-liked';
        el.className = 'view';
        var wrap = document.querySelector('.wrap');
        if (wrap) wrap.appendChild(el);
      }
      el.style.display = 'block';

      var list = (typeof getLikedSongs === 'function') ? getLikedSongs() : [];
      var FI = window.Player ? Player.FI : '';
      var S = window.S || {};

      var head =
        '<section class="liked-head">' +
          '<h1 class="liked-title">Liked Songs</h1>' +
          '<div class="liked-badge">' +
            '<svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' +
          '</div>' +
        '</section>';

      var body = '';

      if (!list.length) {
        body =
          '<div class="empty-box">' +
            '<div class="empty-icon heart">' +
              '<svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' +
            '</div>' +
            '<h3>Belum ada lagu disukai</h3>' +
            '<p>Klik ikon hati pada lagu favoritmu untuk menyimpannya di sini.</p>' +
          '</div>';
      } else {
        body =
          '<div class="liked-toolbar">' +
            '<span class="liked-count">' + list.length + ' Lagu</span>' +
            '<button class="btn btn-glass btn-sm" onclick="Liked.playAll()">' +
              '<svg viewBox="0 0 24 24"><polygon points="6 3 20 12 6 21 6 3"/></svg> Putar Semua' +
            '</button>' +
          '</div>' +
          '<div class="grid">' + list.map(function (t, i) {
            var isCur = S.ct && ((S.ct.id && S.ct.id === t.id) || (S.ct.videoId && S.ct.videoId === t.videoId));
            var isPlay = isCur && S.ip;
            var isLoad = isCur && S.il;
            var icon = '<svg viewBox="0 0 24 24"><polygon points="6 3 20 12 6 21 6 3"/></svg>';
            if (isLoad) icon = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke-dasharray="6 4" fill="none"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/></circle></svg>';
            else if (isPlay) icon = '<svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';

            return '<div class="song-card' + (isPlay ? ' playing' : '') + '" data-title="' + esJs(t.title) + '" data-artist="' + esJs(t.artist) + '">' +
              '<div class="song-cover" onclick="Liked.playIndex(' + i + ')">' +
                '<img src="' + es(t.cover || FI) + '" alt="" loading="lazy" onerror="this.src=\'' + FI + '\'">' +
                '<div class="song-play">' + icon + '</div>' +
              '</div>' +
              '<div class="song-meta" onclick="Liked.playIndex(' + i + ')">' +
                '<h3>' + es(t.title) + '</h3>' +
                '<p>' + es(t.artist) + '</p>' +
              '</div>' +
              '<button class="song-remove heart-active" onclick="event.stopPropagation();Liked.unlike(' + i + ')" aria-label="Hapus">' +
                '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' +
              '</button>' +
              '<div class="song-eq"><span></span><span></span><span></span></div>' +
            '</div>';
          }).join('') + '</div>';
      }

      el.innerHTML = head + '<div class="liked-body">' + body + '</div>';
    },

    playAll: function () {
      var list = (typeof getLikedSongs === 'function') ? getLikedSongs() : [];
      if (!list.length) return;
      if (window.Player && Player.playIndex) Player.playIndex(list, 0, 'liked');
      if (window.FullPlayer && FullPlayer.open) FullPlayer.open();
    },

    playIndex: function (i) {
      var list = (typeof getLikedSongs === 'function') ? getLikedSongs() : [];
      if (!list[i]) return;
      if (window.Player && Player.playIndex) Player.playIndex(list, i, 'liked');
      if (window.FullPlayer && FullPlayer.open) FullPlayer.open();
    },

    unlike: function (i) {
      var list = (typeof getLikedSongs === 'function') ? getLikedSongs() : [];
      if (!list[i]) return;
      var song = list[i];
      if (typeof toggleLikeSong === 'function') toggleLikeSong(song);
      this.render();
      if (App && App.toast) App.toast('Dihapus dari Lagu Disukai');
    }
  };

  window.Liked = Liked;

})();