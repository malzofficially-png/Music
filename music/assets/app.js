(function () {
  'use strict';

  var App = {
    current: 'home',
    views: ['home', 'search', 'library', 'liked', 'offline', 'dev'],

    init: function () {
      if (window.Player && Player.init) Player.init();
      if (window.MP && MP.init) MP.init();
      if (window.FullPlayer && FullPlayer.init) FullPlayer.init();
      if (window.Artist && Artist.init) Artist.init();
      if (window.Album && Album.init) Album.init();

      this.onlineOffline();
      this.switch('home');
    },

    switch: function (view) {
      if (this.views.indexOf(view) === -1) view = 'home';
      this.current = view;
      for (var i = 0; i < this.views.length; i++) {
        var el = document.getElementById('view-' + this.views[i]);
        if (el) el.style.display = 'none';
      }
      var target = document.getElementById('view-' + view);
      if (target) target.style.display = 'block';

      var links = document.querySelectorAll('.nav-menu a');
      for (var j = 0; j < links.length; j++) {
        links[j].classList.toggle('active', links[j].getAttribute('data-nav') === view);
      }

      try {
        if (view === 'home' && window.Home && Home.render) Home.render();
        if (view === 'search' && window.Search && Search.render) Search.render();
        if (view === 'library' && window.Library && Library.render) Library.render();
        if (view === 'liked' && window.Liked && Liked.render) Liked.render();
        if (view === 'dev' && window.Profile && Profile.render) Profile.render();
      } catch (e) { console.warn('view render error:', e); }

      var main = document.getElementById('main-area');
      if (main) main.scrollTop = 0;
    },

    onlineOffline: function () {
      function update() {
        var banner = document.getElementById('pwa-offline-banner');
        if (banner) banner.style.display = navigator.onLine ? 'none' : 'flex';
      }
      window.addEventListener('online', update);
      window.addEventListener('offline', update);
      update();
    },

    toast: function (msg) {
      var el = document.getElementById('app-toast');
      if (!el) {
        el = document.createElement('div');
        el.id = 'app-toast';
        el.style.cssText = 'position:fixed;bottom:110px;left:50%;transform:translateX(-50%);background:#1a1a1a;color:#fff;padding:8px 16px;border-radius:20px;font-size:12px;z-index:9999;border:1px solid rgba(255,255,255,0.15);transition:opacity .2s;opacity:0;';
        document.body.appendChild(el);
      }
      el.textContent = String(msg);
      el.style.opacity = '1';
      clearTimeout(el._t);
      el._t = setTimeout(function () { el.style.opacity = '0'; }, 2000);
    }
  };

  window.App = App;

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { App.init(); });
    } else {
      App.init();
    }


})();