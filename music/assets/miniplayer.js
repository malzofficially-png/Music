(function () {
  'use strict';

  var MP = {
    _lastVid: null,

    init: function () {
      var c = document.getElementById('mini-container');
      if (!c) {
        c = document.createElement('div');
        c.id = 'mini-container';
        document.body.appendChild(c);
      }
      var logo = (window.MALZ_CONFIG && MALZ_CONFIG.logo) || '/images/logo-web.png';

      c.innerHTML = ''
        + '<div id="mini-player" style="display:none;position:fixed;left:0;right:0;bottom:0;z-index:95;background:#000;border-top:1px solid rgba(255,255,255,0.08);padding:10px 16px;transform:translateY(100%);transition:transform 0.3s cubic-bezier(0.22,1,0.36,1);">'
        +   '<div style="display:flex;align-items:center;gap:12px;">'
        +     '<div id="mini-open-btn" style="display:flex;align-items:center;gap:10px;flex:1;min-width:0;cursor:pointer;">'
        +       '<img id="mini-cover" src="' + logo + '" alt="" style="width:48px;height:48px;border-radius:6px;object-fit:cover;border:1px solid rgba(255,255,255,0.1);flex-shrink:0;">'
        +       '<div style="min-width:0;flex:1;">'
        +         '<div id="mini-title" style="font-size:13px;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Pilih lagu</div>'
        +         '<div id="mini-artist" style="font-size:11px;color:rgba(255,255,255,0.5);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px;">Malz-Musify</div>'
        +       '</div>'
        +     '</div>'
        +     '<div style="display:flex;align-items:center;gap:14px;flex-shrink:0;">'
        +       '<button id="mini-prev-btn" type="button" aria-label="Prev" style="width:36px;height:36px;border-radius:50%;background:none;border:none;color:rgba(255,255,255,0.7);cursor:pointer;display:flex;align-items:center;justify-content:center;">'
        +         '<svg viewBox="0 0 24 24" fill="currentColor" style="width:18px;height:18px;"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" stroke-width="2"/></svg>'
        +       '</button>'
        +       '<button id="mini-play-btn" type="button" aria-label="Play" style="width:36px;height:36px;border-radius:50%;background:#fff;color:#000;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;">'
        +         '<svg viewBox="0 0 24 24" fill="currentColor" style="width:18px;height:18px;"><polygon points="6 3 20 12 6 21 6 3"/></svg>'
        +       '</button>'
        +       '<button id="mini-next-btn" type="button" aria-label="Next" style="width:36px;height:36px;border-radius:50%;background:none;border:none;color:rgba(255,255,255,0.7);cursor:pointer;display:flex;align-items:center;justify-content:center;">'
        +         '<svg viewBox="0 0 24 24" fill="currentColor" style="width:18px;height:18px;"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" stroke-width="2"/></svg>'
        +       '</button>'
        +     '</div>'
        +     '<div style="display:flex;align-items:center;gap:8px;flex:1;justify-content:flex-end;min-width:0;">'
        +       '<button id="mini-vol-btn" type="button" aria-label="Volume" style="background:none;border:none;color:rgba(255,255,255,0.5);cursor:pointer;padding:4px;">'
        +         '<svg id="mini-vol-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" style="width:16px;height:16px;"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>'
        +       '</button>'
        +       '<input id="vol-bar" type="range" min="0" max="100" value="100" style="width:80px;accent-color:#fff;">'
        +     '</div>'
        +   '</div>'
        +   '<div style="position:absolute;left:0;right:0;top:0;height:2px;background:rgba(255,255,255,0.08);overflow:hidden;">'
        +     '<i id="mini-progress" style="display:block;height:100%;width:0%;background:#fff;transition:width .15s linear;"></i>'
        +   '</div>'
        + '</div>';

      var openBtn = document.getElementById('mini-open-btn');
      if (openBtn) openBtn.addEventListener('click', function () {
        if (window.FullPlayer && FullPlayer.open) FullPlayer.open();
      });

      var prevBtn = document.getElementById('mini-prev-btn');
      if (prevBtn) prevBtn.addEventListener('click', function () {
        if (window.Player && Player.prev) Player.prev();
      });

      var nextBtn = document.getElementById('mini-next-btn');
      if (nextBtn) nextBtn.addEventListener('click', function () {
        if (window.Player && Player.next) Player.next();
      });

      var playBtn = document.getElementById('mini-play-btn');
      if (playBtn) playBtn.addEventListener('click', function () {
        if (window.Player && Player.toggle) Player.toggle();
      });

      var volBtn = document.getElementById('mini-vol-btn');
      if (volBtn) volBtn.addEventListener('click', function () {
        if (window.Player && Player.toggleMute) Player.toggleMute();
      });

      var volBar = document.getElementById('vol-bar');
      if (volBar) volBar.addEventListener('input', function () {
        if (window.Player && Player.setVolume) Player.setVolume(this.value);
      });
    },

    show: function () {
      var S = window.S || {};
      if (!S.ct) return;
      var mp = document.getElementById('mini-player');
      if (!mp) return;
      mp.style.display = 'block';
      void mp.offsetHeight;
      mp.style.transform = 'translateY(0)';
      this.update(S.ct);
      if (window.Player && Player.updateVolumeUI) Player.updateVolumeUI();
      if (window.Player && Player.updateUI) Player.updateUI();
      if (window.Player && Player.renderProgress) Player.renderProgress();
    },

    hide: function () {
      var mp = document.getElementById('mini-player');
      if (!mp) return;
      mp.style.transform = 'translateY(100%)';
    },

    update: function (track) {
      if (!track) return;

      var logo = (window.MALZ_CONFIG && MALZ_CONFIG.logo) || '/images/logo-web.png';
      var cover = track.cover || logo;
      var vid = track.videoId || track.id || '';
      var title = track.title || '';
      var artist = track.artist || '';
      var trackChanged = (vid !== this._lastVid);
      this._lastVid = vid;

      var c = document.getElementById('mini-cover');
      if (c) {
        var curSrc = c.getAttribute('src') || '';
        if (trackChanged || curSrc !== cover) {
          c.setAttribute('data-vid', vid);
          c.onerror = function () {
            this.onerror = null;
            this.src = logo;
          };
          c.src = cover;
        }
      }

      var t = document.getElementById('mini-title');
      if (t) t.textContent = title || 'Pilih lagu';

      var a = document.getElementById('mini-artist');
      if (a) a.textContent = artist || 'Malz-Musify';
    },

    refresh: function () {
      var S = window.S || {};
      if (!S.ct) return;
      this.update(S.ct);
      if (window.Player) {
        if (Player.updateUI) Player.updateUI();
        if (Player.updateVolumeUI) Player.updateVolumeUI();
        if (Player.renderProgress) Player.renderProgress();
      }
    },

    reset: function () {
      this._lastVid = null;
      var logo = (window.MALZ_CONFIG && MALZ_CONFIG.logo) || '/images/logo-web.png';
      var c = document.getElementById('mini-cover');
      if (c) c.src = logo;
      var t = document.getElementById('mini-title');
      if (t) t.textContent = 'Pilih lagu';
      var a = document.getElementById('mini-artist');
      if (a) a.textContent = 'Malz-Musify';
    }
  };

  window.MP = MP;

})();