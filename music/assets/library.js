(function () {
  'use strict';

  function gid(id) { return document.getElementById(id); }
  function es(s) { if (s == null) return ''; var d = document.createElement('div'); d.textContent = String(s); return d.innerHTML; }

  function getPlaylists() {
    try { return JSON.parse(localStorage.getItem('malz_playlists') || '[]'); } catch (e) { return []; }
  }
  function savePlaylists(p) {
    try { localStorage.setItem('malz_playlists', JSON.stringify(p)); } catch (e) {}
  }

  var Library = {
    render: function () {
      var el = gid('view-library');
      if (!el) return;
      el.style.display = 'block';
      var pls = getPlaylists();
      var FI = window.Player ? Player.FI : '';

      el.innerHTML =
        '<section style="padding:90px 20px 12px;">' +
          '<h1 style="font-size:26px;font-weight:900;color:#fff;margin-bottom:16px;">Library</h1>' +
          '<button onclick="Library.createNew()" style="width:100%;padding:14px;border-radius:14px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);color:#fff;font-weight:700;font-size:13px;cursor:pointer;margin-bottom:20px;">+ Buat Playlist Baru</button>' +
        '</section>' +
        '<div id="library-list" style="padding:0 20px 40px;"></div>';

      var list = gid('library-list');
      if (!pls.length) {
        list.innerHTML = '<div style="text-align:center;padding:60px 20px;color:rgba(255,255,255,0.4);">' +
          '<p style="font-size:14px;margin-bottom:4px;">Belum ada playlist</p>' +
          '<p style="font-size:12px;">Buat playlist pertamamu</p>' +
        '</div>';
        return;
      }
      list.innerHTML = '<div class="search-grid">' + pls.map(function (p, i) {
        var cover = p.cover || (p.songs && p.songs[0] ? p.songs[0].cover : FI);
        return '<div class="search-card" onclick="Library.open(' + i + ')">' +
          '<div class="search-card-img"><img src="' + cover + '" alt="" onerror="this.src=\'' + FI + '\'"></div>' +
          '<div class="search-card-title">' + es(p.name) + '</div>' +
          '<div class="search-card-sub">' + (p.songs ? p.songs.length : 0) + ' lagu</div>' +
        '</div>';
      }).join('') + '</div>';
    },

    open: function (i) {
      var pls = getPlaylists();
      var p = pls[i];
      if (!p || !p.songs || !p.songs.length) { if (App && App.toast) App.toast('Playlist kosong'); return; }
      if (window.Player) Player.playIndex(p.songs, 0, 'library');
      if (window.FullPlayer && FullPlayer.open) FullPlayer.open();
    },

    createNew: function () {
      var name = prompt('Nama playlist:');
      if (!name) return;
      var pls = getPlaylists();
      pls.push({ id: 'pl_' + Date.now(), name: name, songs: [], cover: '' });
      savePlaylists(pls);
      this.render();
    }
  };

  window.Library = Library;
  window.getUserPlaylists = getPlaylists;
  window.saveUserPlaylists = savePlaylists;
  window.createPlaylist = function (name, cover) {
    var pls = getPlaylists();
    var id = 'pl_' + Date.now();
    pls.push({ id: id, name: name, cover: cover || '', songs: [] });
    savePlaylists(pls);
    return id;
  };

})();