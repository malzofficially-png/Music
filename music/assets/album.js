(function () {
  'use strict';

  function gid(id) { return document.getElementById(id); }
  function es(s) { if (s == null) return ''; var d = document.createElement('div'); d.textContent = String(s); return d.innerHTML; }

  var Album = {
    _songs: [],

    init: function () {
      if (!gid('album-container')) {
        var d = document.createElement('div');
        d.id = 'album-container';
        document.body.appendChild(d);
      }
    },

    open: function (id, cover) {
      if (!id) return;
      var modal = gid('album-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'album-modal';
        modal.className = 'viewer-overlay';
        modal.style.cssText = 'position:fixed;inset:0;z-index:100;background:#050505;display:flex;flex-direction:column;';
        document.body.appendChild(modal);
      }
      modal.style.display = 'flex';
      var FI = window.Player ? Player.FI : '';
      var im = cover || FI;

      modal.innerHTML =
        '<header style="position:absolute;top:0;left:0;right:0;padding:16px;z-index:20;">' +
          '<button onclick="document.getElementById(\'album-modal\').style.display=\'none\'" style="width:38px;height:38px;border-radius:50%;background:rgba(0,0,0,0.6);border:1px solid rgba(255,255,255,0.15);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;">' +
            '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2.5" style="width:20px;height:20px;"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>' +
          '</button>' +
        '</header>' +
        '<div style="flex:1;overflow-y:auto;padding-bottom:100px;">' +
          '<div style="padding:80px 20px 20px;text-align:center;">' +
            '<img src="' + im + '" style="width:180px;height:180px;border-radius:14px;object-fit:cover;border:1px solid rgba(255,255,255,0.1);margin-bottom:16px;" onerror="this.src=\'' + FI + '\'">' +
            '<div style="font-size:11px;letter-spacing:2px;color:rgba(255,255,255,0.5);text-transform:uppercase;margin-bottom:6px;">ALBUM / PLAYLIST</div>' +
            '<h1 id="album-name" style="font-size:24px;font-weight:900;color:#fff;line-height:1.15;">Memuat...</h1>' +
            '<p id="album-sub" style="font-size:13px;color:rgba(255,255,255,0.5);margin-top:6px;"></p>' +
          '</div>' +
          '<div id="album-body" style="padding:0 20px;">' +
            '<p style="color:rgba(255,255,255,0.5);text-align:center;padding:20px 0;">Memuat...</p>' +
          '</div>' +
        '</div>';

      fetch(window.MALZ_CONFIG.api + 'album&id=' + encodeURIComponent(id))
        .then(function (r) { return r.json(); })
        .then(function (d) {
          var body = gid('album-body');
          if (!d || !d.result) {
            body.innerHTML = '<p style="color:rgba(255,255,255,0.5);text-align:center;">Gagal memuat</p>';
            return;
          }
          var a = d.result;
          var tn = gid('album-name'); if (tn) tn.textContent = a.title || 'Album';
          var ts = gid('album-sub'); if (ts) ts.textContent = ((a.songs ? a.songs.length : 0) + ' lagu') + (a.description ? ' • ' + a.description : '');

          Album._songs = (a.songs || []).map(function (s) {
            var sim = (s.thumbnails && s.thumbnails.length) ? (typeof s.thumbnails[0] === 'string' ? s.thumbnails[0] : s.thumbnails[0].url) : FI;
            return { id: s.videoId, videoId: s.videoId, title: s.title, artist: s.artist, cover: sim || FI, artistId: s.artistId, ytUrl: 'https://youtube.com/watch?v=' + s.videoId };
          });

          if (!Album._songs.length) {
            body.innerHTML = '<p style="color:rgba(255,255,255,0.5);text-align:center;">Tidak ada lagu</p>';
            return;
          }

          body.innerHTML = '<div class="search-grid">' + Album._songs.map(function (t, i) {
            return '<div class="search-card" onclick="Album.play(' + i + ')">' +
              '<div class="search-card-img"><img src="' + t.cover + '" onerror="this.src=\'' + FI + '\'"></div>' +
              '<div class="search-card-title">' + es(t.title) + '</div>' +
              '<div class="search-card-sub">' + es(t.artist) + '</div>' +
            '</div>';
          }).join('') + '</div>';
        })
        .catch(function () {
          var body = gid('album-body');
          if (body) body.innerHTML = '<p style="color:rgba(255,255,255,0.5);text-align:center;">Gagal memuat</p>';
        });
    },

    play: function (i) {
      if (Album._songs[i] && window.Player) Player.playIndex(Album._songs, i, 'album');
      if (window.FullPlayer && FullPlayer.open) FullPlayer.open();
    }
  };

  window.Album = Album;

})();