(function () {
  'use strict';

  var FullPlayer = {
    view: 'cover',
    _lastVid: null,

    init: function () {
      var c = document.getElementById('full-container');
      if (!c) {
        c = document.createElement('div');
        c.id = 'full-container';
        document.body.appendChild(c);
      }
      var logo = (window.MALZ_CONFIG && MALZ_CONFIG.logo) || '/images/logo-web.png';

      c.innerHTML = ''
        + '<div id="full-player" style="display:none;position:fixed;inset:0;z-index:170;background:#050505;flex-direction:column;padding:16px 20px 20px;overflow:hidden;">'
        +   '<div style="position:absolute;inset:0;z-index:0;overflow:hidden;pointer-events:none;">'
        +     '<img id="fp-bg" src="' + logo + '" alt="" style="position:absolute;inset:-10%;width:120%;height:120%;object-fit:cover;filter:blur(80px) brightness(0.3);opacity:0.6;">'
        +     '<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(5,5,5,0.5) 0%,rgba(5,5,5,0.9) 100%);"></div>'
        +   '</div>'
        +   '<div style="position:relative;z-index:10;display:flex;align-items:center;justify-content:space-between;padding:4px 0;">'
        +     '<button id="fp-close-btn" type="button" aria-label="Tutup" style="width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,0.08);border:none;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;">'
        +       '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2.5" style="width:20px;height:20px;"><polyline points="6 9 12 15 18 9"/></svg>'
        +     '</button>'
        +     '<span style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.4);font-weight:700;">Sedang Diputar</span>'
        +     '<button id="fp-more-btn" type="button" aria-label="Menu" style="width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,0.08);border:none;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;">'
        +       '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2.5" style="width:18px;height:18px;"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>'
        +     '</button>'
        +   '</div>'
        +   '<div style="position:relative;z-index:10;display:flex;justify-content:center;gap:6px;margin:12px 0;">'
        +     '<button id="fp-tab-cover" type="button" style="padding:6px 20px;border-radius:999px;font-size:11px;font-weight:800;letter-spacing:0.5px;background:rgba(255,255,255,0.15);color:#fff;border:none;cursor:pointer;">Cover</button>'
        +     '<button id="fp-tab-lyrics" type="button" style="padding:6px 20px;border-radius:999px;font-size:11px;font-weight:800;letter-spacing:0.5px;background:transparent;color:rgba(255,255,255,0.5);border:none;cursor:pointer;">Lirik</button>'
        +   '</div>'
        +   '<div style="position:relative;z-index:10;flex:1;display:flex;align-items:center;justify-content:center;min-height:0;overflow:hidden;">'
        +     '<div id="fp-stage-cover" style="position:relative;width:100%;max-width:380px;aspect-ratio:1/1;">'
        +       '<img id="fp-cover" src="' + logo + '" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:14px;box-shadow:0 20px 60px rgba(0,0,0,0.7);">'
        +     '</div>'
        +     '<div id="fp-stage-lyrics" style="display:none;width:100%;max-width:460px;height:100%;background:rgba(10,10,10,0.75);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.1);border-radius:14px;padding:16px;flex-direction:column;">'
        +       '<div style="display:flex;align-items:center;gap:10px;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.08);flex-shrink:0;">'
        +         '<img id="fp-mini-cover" src="' + logo + '" alt="" style="width:40px;height:40px;border-radius:6px;object-fit:cover;">'
        +         '<div style="min-width:0;flex:1;">'
        +           '<div id="fp-mini-title" style="font-size:13px;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"></div>'
        +           '<div id="fp-mini-artist" style="font-size:11px;color:rgba(255,255,255,0.5);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"></div>'
        +         '</div>'
        +       '</div>'
        +       '<div id="full-inline-lyrics-scroll" style="flex:1;overflow-y:auto;padding:12px 0;scrollbar-width:none;">'
        +         '<div id="full-inline-lyrics-content" style="text-align:left;"></div>'
        +         '<div id="lyrics-empty" style="display:none;text-align:center;color:rgba(255,255,255,0.4);padding:40px 0;font-size:13px;">Lirik tidak tersedia</div>'
        +       '</div>'
        +     '</div>'
        +   '</div>'
        +   '<div style="position:relative;z-index:10;padding:8px 0;">'
        +     '<h2 id="fp-title" style="font-size:20px;font-weight:900;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Pilih lagu</h2>'
        +     '<p id="fp-artist" style="font-size:13px;color:rgba(255,255,255,0.6);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Malz-Musify</p>'
        +   '</div>'
        +   '<div style="position:relative;z-index:10;display:flex;align-items:center;gap:10px;padding:8px 0;">'
        +     '<span id="fp-time-curr" style="font-size:11px;font-family:monospace;color:rgba(255,255,255,0.5);min-width:34px;">0:00</span>'
        +     '<input id="fp-seek" type="range" min="0" max="100" value="0" style="flex:1;accent-color:#fff;">'
        +     '<span id="fp-time-dur" style="font-size:11px;font-family:monospace;color:rgba(255,255,255,0.5);min-width:34px;text-align:right;">0:00</span>'
        +   '</div>'
        +   '<div style="position:relative;z-index:10;display:flex;align-items:center;justify-content:space-between;padding:6px 0;">'
        +     '<button id="fp-shuffle" type="button" aria-label="Shuffle" style="width:40px;height:40px;border-radius:50%;background:none;border:none;color:rgba(255,255,255,0.5);cursor:pointer;">'
        +       '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" style="width:20px;height:20px;"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>'
        +     '</button>'
        +     '<button id="fp-prev-btn" type="button" aria-label="Prev" style="width:44px;height:44px;border-radius:50%;background:none;border:none;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;">'
        +       '<svg viewBox="0 0 24 24" fill="currentColor" style="width:22px;height:22px;"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" stroke-width="2"/></svg>'
        +     '</button>'
        +     '<button id="fp-play-btn" type="button" aria-label="Play" style="width:64px;height:64px;border-radius:50%;background:#fff;color:#050505;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;">'
        +       '<svg viewBox="0 0 24 24" fill="currentColor" style="width:28px;height:28px;"><polygon points="6 3 20 12 6 21 6 3"/></svg>'
        +     '</button>'
        +     '<button id="fp-next-btn" type="button" aria-label="Next" style="width:44px;height:44px;border-radius:50%;background:none;border:none;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;">'
        +       '<svg viewBox="0 0 24 24" fill="currentColor" style="width:22px;height:22px;"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" stroke-width="2"/></svg>'
        +     '</button>'
        +     '<button id="fp-repeat" type="button" aria-label="Repeat" style="width:40px;height:40px;border-radius:50%;background:none;border:none;color:rgba(255,255,255,0.5);cursor:pointer;">'
        +       '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" style="width:20px;height:20px;"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>'
        +     '</button>'
        +   '</div>'
        + '</div>';

      FullPlayer._mountMotion(document.getElementById('full-player'));

      var closeBtn = document.getElementById('fp-close-btn');
      if (closeBtn) closeBtn.addEventListener('click', function () { FullPlayer.close(); });

      var moreBtn = document.getElementById('fp-more-btn');
      if (moreBtn) moreBtn.addEventListener('click', function () { FullPlayer.openMore(); });

      var tabCover = document.getElementById('fp-tab-cover');
      if (tabCover) tabCover.addEventListener('click', function () { FullPlayer.switchView('cover'); });

      var tabLyrics = document.getElementById('fp-tab-lyrics');
      if (tabLyrics) tabLyrics.addEventListener('click', function () { FullPlayer.switchView('lyrics'); });

      var shuffle = document.getElementById('fp-shuffle');
      if (shuffle) shuffle.addEventListener('click', function () {
        if (window.Player && Player.toggleShuffle) Player.toggleShuffle();
      });

      var prev = document.getElementById('fp-prev-btn');
      if (prev) prev.addEventListener('click', function () {
        if (window.Player && Player.prev) Player.prev();
      });

      var next = document.getElementById('fp-next-btn');
      if (next) next.addEventListener('click', function () {
        if (window.Player && Player.next) Player.next();
      });

      var play = document.getElementById('fp-play-btn');
      if (play) play.addEventListener('click', function () {
        if (window.Player && Player.toggle) Player.toggle();
      });

      var repeat = document.getElementById('fp-repeat');
      if (repeat) repeat.addEventListener('click', function () {
        if (window.Player && Player.toggleRepeat) Player.toggleRepeat();
      });

      var seek = document.getElementById('fp-seek');
      if (seek) seek.addEventListener('input', function () {
        if (window.Player && Player.seek) Player.seek(this.value);
      });
    },

    _open: false,
    _gen: 0,
    _hideTimer: null,
    _scrim: null,
    _handle: null,

    _mountMotion: function (fp) {
      if (!fp || fp.__motionMounted) return;
      fp.__motionMounted = true;

      var scrim = document.createElement('div');
      scrim.className = 'fp-scrim';
      scrim.id = 'fp-scrim';
      document.body.appendChild(scrim);
      this._scrim = scrim;
      scrim.addEventListener('click', function () { FullPlayer.close(); });

      var header = fp.querySelector('#fp-close-btn');
      header = header ? header.parentNode : null;
      if (header && !document.getElementById('fp-drag-handle')) {
        var handle = document.createElement('div');
        handle.id = 'fp-drag-handle';
        handle.setAttribute('aria-hidden', 'true');
        fp.insertBefore(handle, fp.firstChild);
        this._handle = handle;
        this._bindDrag(fp, handle);
      }
    },

    _bindDrag: function (fp, handle) {
      var startY = 0, dy = 0, dragging = false, pid = null;

      function down(e) {
        pid = e.pointerId;
        startY = e.clientY;
        dy = 0;
        dragging = true;
        fp.classList.add('is-dragging');
        if (handle.setPointerCapture) { try { handle.setPointerCapture(pid); } catch (err) {} }
      }

      function move(e) {
        if (!dragging || (pid !== null && e.pointerId !== pid)) return;
        dy = e.clientY - startY;
        if (dy < 0) dy = dy * 0.28;
        fp.style.transform = 'translate3d(0,' + dy + 'px,0)';
        if (FullPlayer._scrim) FullPlayer._scrim.style.opacity = String(Math.max(0, 1 - Math.max(0, dy) / 420));
      }

      function up(e) {
        if (!dragging) return;
        dragging = false;
        fp.classList.remove('is-dragging');
        fp.style.transform = '';
        if (FullPlayer._scrim) FullPlayer._scrim.style.opacity = '';
        if (handle.releasePointerCapture && pid !== null) { try { handle.releasePointerCapture(pid); } catch (err) {} }
        if (dy > 130) FullPlayer.close();
        pid = null;
        dy = 0;
      }

      handle.addEventListener('pointerdown', down);
      handle.addEventListener('pointermove', move);
      handle.addEventListener('pointerup', up);
      handle.addEventListener('pointercancel', up);
      handle.addEventListener('lostpointercapture', up);
    },

    open: function () {
      var S = window.S || {};
      if (!S.ct) return;
      var fp = document.getElementById('full-player');
      if (!fp) return;
      if (this._open) { this.refresh(S.ct); return; }

      this._mountMotion(fp);

      var gen = ++this._gen;
      this._gen = gen;

      void fp.offsetHeight;
      fp.classList.add('is-open');
      if (this._scrim) { this._scrim.classList.add('is-open'); }

      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      this._open = true;

      this.refresh(S.ct);
      if (window.MP && MP.hide) MP.hide();
      if (window.Player) {
        if (Player.updateVolumeUI) Player.updateVolumeUI();
        if (Player.renderProgress) Player.renderProgress();
        if (Player.updateRepeatUI) Player.updateRepeatUI();
        if (Player.updateShuffleUI) Player.updateShuffleUI();
        if (Player.updateUI) Player.updateUI();
      }
      if (this.view === 'lyrics' && window.Player && Player.renderLyrics) Player.renderLyrics();
    },

    close: function () {
      var fp = document.getElementById('full-player');
      if (!fp) return;
      if (!this._open) return;

      var gen = ++this._gen;
      this._gen = gen;

      fp.classList.remove('is-open');
      if (this._scrim) this._scrim.classList.remove('is-open');

      this._open = false;
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      if (window.MP && MP.show) MP.show();
      if (window.MP && MP.refresh) MP.refresh();
    },

    isOpen: function () { return !!this._open; },

    refresh: function (track) {
      var S = window.S || {};
      var t = track || S.ct;
      if (!t) return;

      var logo = (window.MALZ_CONFIG && MALZ_CONFIG.logo) || '/images/logo-web.png';
      var cover = t.cover || logo;
      var vid = t.videoId || t.id || '';
      var trackChanged = (vid !== this._lastVid);
      this._lastVid = vid;

      var swap = trackChanged && FullPlayer.isOpen();

      ['fp-cover', 'fp-bg', 'fp-mini-cover'].forEach(function (id) {
        var e = document.getElementById(id);
        if (!e) return;
        var curSrc = e.getAttribute('src') || '';
        if (trackChanged || curSrc !== cover) {
          e.setAttribute('data-vid', vid);
          e.onerror = function () {
            this.onerror = null;
            this.src = logo;
          };
          if (swap) {
            e.classList.remove('fp-swap');
            void e.offsetWidth;
            e.classList.add('fp-swap');
            setTimeout(function () { e.classList.remove('fp-swap'); }, 480);
          }
          e.src = cover;
        }
      });

      ['fp-title', 'fp-mini-title'].forEach(function (id) {
        var e = document.getElementById(id);
        if (!e) return;
        if (swap) {
          e.classList.remove('fp-swap');
          void e.offsetWidth;
          e.classList.add('fp-swap');
          setTimeout(function () { e.classList.remove('fp-swap'); }, 380);
        }
        e.textContent = t.title || 'Pilih lagu';
      });

      ['fp-artist', 'fp-mini-artist'].forEach(function (id) {
        var e = document.getElementById(id);
        if (!e) return;
        if (swap) {
          e.classList.remove('fp-swap');
          void e.offsetWidth;
          e.classList.add('fp-swap');
          setTimeout(function () { e.classList.remove('fp-swap'); }, 380);
        }
        e.textContent = t.artist || 'Malz-Musify';
      });

      if (window.Player) {
        if (Player.updateUI) Player.updateUI();
        if (Player.renderProgress) Player.renderProgress();
      }
    },

    switchView: function (v) {
      this.view = v;
      var cover = document.getElementById('fp-stage-cover');
      var lyrics = document.getElementById('fp-stage-lyrics');
      var tc = document.getElementById('fp-tab-cover');
      var tl = document.getElementById('fp-tab-lyrics');
      if (!cover || !lyrics) return;
      if (v === 'lyrics') {
        cover.style.display = 'none';
        lyrics.style.display = 'flex';
        if (tc) { tc.style.background = 'transparent'; tc.style.color = 'rgba(255,255,255,0.5)'; }
        if (tl) { tl.style.background = 'rgba(255,255,255,0.15)'; tl.style.color = '#fff'; }
        if (window.Player && Player.renderLyrics) Player.renderLyrics();
      } else {
        lyrics.style.display = 'none';
        cover.style.display = 'block';
        if (tl) { tl.style.background = 'transparent'; tl.style.color = 'rgba(255,255,255,0.5)'; }
        if (tc) { tc.style.background = 'rgba(255,255,255,0.15)'; tc.style.color = '#fff'; }
      }
    },

    openMore: function () {
      var S = window.S || {};
      var existing = document.getElementById('fp-more-popup');
      if (existing) existing.remove();

      var popup = document.createElement('div');
      popup.id = 'fp-more-popup';
      popup.style.cssText = 'position:fixed;inset:0;z-index:300;background:rgba(0,0,0,0.75);display:flex;align-items:flex-end;justify-content:center;';
      popup.addEventListener('click', function (e) { if (e.target === popup) popup.remove(); });

      var speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
      var speedsHtml = speeds.map(function (sp) {
        var act = S.rate === sp;
        var style = act
          ? 'background:#fff;color:#000;border:1px solid #fff;'
          : 'background:rgba(255,255,255,0.06);color:#fff;border:1px solid rgba(255,255,255,0.08);';
        return '<button data-speed="' + sp + '" type="button" style="padding:12px;border-radius:10px;' + style + 'font-size:12px;font-weight:700;cursor:pointer;">' + sp + 'x</button>';
      }).join('');

      var sleepSec = S.sleepSec || 0;
      var sleepInfo = sleepSec > 0 ? '<div style="text-align:center;color:#ffb43c;font-size:11px;margin-bottom:12px;">Timer aktif: ' + Math.ceil(sleepSec / 60) + ' menit lagi</div>' : '';

      popup.innerHTML =
        '<div style="width:100%;max-width:480px;background:#0f0f0f;border-radius:20px 20px 0 0;padding:24px;border-top:1px solid rgba(255,255,255,0.1);">'
        + '<div style="width:40px;height:4px;background:rgba(255,255,255,0.2);border-radius:4px;margin:0 auto 16px;"></div>'
        + '<div style="display:flex;align-items:center;gap:12px;padding-bottom:16px;border-bottom:1px solid rgba(255,255,255,0.06);margin-bottom:16px;">'
        +   '<img src="' + ((S.ct && S.ct.cover) || '') + '" alt="" style="width:48px;height:48px;border-radius:8px;object-fit:cover;">'
        +   '<div style="min-width:0;flex:1;">'
        +     '<div style="font-size:14px;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + ((S.ct && S.ct.title) || '') + '</div>'
        +     '<div style="font-size:12px;color:rgba(255,255,255,0.5);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + ((S.ct && S.ct.artist) || '') + '</div>'
        +   '</div>'
        + '</div>'
        + sleepInfo
        + '<div style="font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.5);margin-bottom:10px;">Kecepatan</div>'
        + '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px;">' + speedsHtml + '</div>'
        + '<div style="font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.5);margin-bottom:10px;">Timer Tidur</div>'
        + '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;">'
        +   '<button data-sleep="5" type="button" style="padding:12px;border-radius:10px;background:rgba(255,255,255,0.06);color:#fff;border:1px solid rgba(255,255,255,0.08);font-size:12px;font-weight:700;cursor:pointer;">5 menit</button>'
        +   '<button data-sleep="15" type="button" style="padding:12px;border-radius:10px;background:rgba(255,255,255,0.06);color:#fff;border:1px solid rgba(255,255,255,0.08);font-size:12px;font-weight:700;cursor:pointer;">15 menit</button>'
        +   '<button data-sleep="30" type="button" style="padding:12px;border-radius:10px;background:rgba(255,255,255,0.06);color:#fff;border:1px solid rgba(255,255,255,0.08);font-size:12px;font-weight:700;cursor:pointer;">30 menit</button>'
        + '</div>'
        + '<button data-sleep-clear="1" type="button" style="width:100%;margin-top:10px;padding:12px;border-radius:10px;background:rgba(255,60,60,0.08);color:#ff7777;border:1px solid rgba(255,60,60,0.15);font-weight:700;cursor:pointer;font-size:12px;">Batalkan Timer</button>'
        + '<button data-close="1" type="button" style="width:100%;margin-top:10px;padding:12px;border-radius:10px;background:rgba(255,255,255,0.06);color:#fff;border:1px solid rgba(255,255,255,0.08);font-weight:700;cursor:pointer;">Tutup</button>'
        + '</div>';

      document.body.appendChild(popup);

      popup.querySelectorAll('[data-speed]').forEach(function (b) {
        b.addEventListener('click', function () {
          if (window.Player && Player.setRate) Player.setRate(this.getAttribute('data-speed'));
          popup.remove();
          if (App && App.toast) App.toast('Kecepatan: ' + this.getAttribute('data-speed') + 'x');
        });
      });

      popup.querySelectorAll('[data-sleep]').forEach(function (b) {
        b.addEventListener('click', function () {
          if (window.Player && Player.sleepMinutes) Player.sleepMinutes(parseInt(this.getAttribute('data-sleep'), 10));
          popup.remove();
        });
      });

      var sleepClear = popup.querySelector('[data-sleep-clear]');
      if (sleepClear) sleepClear.addEventListener('click', function () {
        if (window.Player && Player.clearSleep) Player.clearSleep();
        popup.remove();
        if (App && App.toast) App.toast('Timer dibatalkan');
      });

      var closeBtn = popup.querySelector('[data-close]');
      if (closeBtn) closeBtn.addEventListener('click', function () { popup.remove(); });
    }
  };

  window.FullPlayer = FullPlayer;

})();