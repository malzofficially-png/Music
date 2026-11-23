(function () {
  'use strict';

  function gid(id) { return document.getElementById(id); }
  function es(s) { if (s == null) return ''; var d = document.createElement('div'); d.textContent = String(s); return d.innerHTML; }

  var Artist = {
    _songs: [],

    init: function () {
      if (!gid('artist-container')) {
        var d = document.createElement('div');
        d.id = 'artist-container';
        document.body.appendChild(d);
      }
    },

    open: function (id, name, cover) {
      if (!id) return;
      var modal = gid('artist-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'artist-modal';
        modal.className = 'viewer-overlay';
        modal.style.cssText = 'position:fixed;inset:0;z-index:100;background:#050505;display:flex;flex-direction:column;';
        document.body.appendChild(modal);
      }
      modal.style.display = 'flex';
      var FI = window.Player ? Player.FI : '';

      modal.innerHTML =
        '<header style="position:absolute;top:0;left:0;right:0;padding:16px;z-index:20;">' +
          '<button onclick="document.getElementById(\'artist-modal\').style.display=\'none\'" style="width:38px;height:38px;border-radius:50%;background:rgba(0,0,0,0.6);border:1px solid rgba(255,255,255,0.15);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;">' +
            '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2.5" style="width:20px;height:20px;"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>' +
          '</button>' +
        '</header>' +
        '<div style="flex:1;overflow-y:auto;padding-bottom:100px;">' +
          '<div style="padding:80px 20px 20px;text-align:center;">' +
            '<img src="' + (cover || FI) + '" style="width:140px;height:140px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,0.15);margin-bottom:16px;" onerror="this.src=\'' + FI + '\'">' +
            '<h1 style="font-size:26px;font-weight:900;color:#fff;">' + es(name) + '</h1>' +
          '</div>' +
          '<div id="artist-body" style="padding:0 20px;">' +
            '<p style="color:rgba(255,255,255,0.5);text-align:center;padding:20px 0;">Memuat...</p>' +
          '</div>' +
        '</div>';

      fetch(window.MALZ_CONFIG.api + 'artist&id=' + encodeURIComponent(id))
        .then(function (r) { return r.json(); })
        .then(function (d) {
          var body = gid('artist-body');
          if (!d || !d.result || !d.result.topSongs || !d.result.topSongs.length) {
            body.innerHTML = '<p style="color:rgba(255,255,255,0.5);text-align:center;padding:20px 0;">Tidak ada lagu</p>';
            return;
          }
          Artist._songs = d.result.topSongs.map(function (s) {
            var im = (s.thumbnails && s.thumbnails.length) ? s.thumbnails[s.thumbnails.length - 1].url : FI;
            return { id: s.videoId, videoId: s.videoId, title: s.title, artist: s.artist || name, cover: im, artistId: id, ytUrl: 'https://youtube.com/watch?v=' + s.videoId };
          });
          body.innerHTML = '<h2 style="font-size:16px;font-weight:800;color:#fff;margin-bottom:12px;">Lagu Populer</h2>' +
            '<div class="search-grid">' + Artist._songs.map(function (t, i) {
              return '<div class="search-card" onclick="Artist.play(' + i + ')">' +
                '<div class="search-card-img"><img src="' + t.cover + '" onerror="this.src=\'' + FI + '\'"></div>' +
                '<div class="search-card-title">' + es(t.title) + '</div>' +
                '<div class="search-card-sub">' + es(t.artist) + '</div>' +
              '</div>';
            }).join('') + '</div>';
        })
        .catch(function () {
          var body = gid('artist-body');
          if (body) body.innerHTML = '<p style="color:rgba(255,255,255,0.5);text-align:center;padding:20px 0;">Gagal memuat</p>';
        });
    },

    play: function (i) {
      if (Artist._songs[i] && window.Player) Player.playIndex(Artist._songs, i, 'artist');
      if (window.FullPlayer && FullPlayer.open) FullPlayer.open();
    }
  };

  window.Artist = Artist;

})();