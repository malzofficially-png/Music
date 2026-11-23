(function () {
  'use strict';

  var KEY = 'malz-musify-theme';
  var root = document.documentElement;

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function systemTheme() {
    try {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light' : 'dark';
    } catch (e) { return 'dark'; }
  }

  function apply(theme, animate) {
    if (theme !== 'light' && theme !== 'dark') theme = 'dark';
    if (animate) {
      root.classList.add('theme-anim');
      setTimeout(function () { root.classList.remove('theme-anim'); }, 320);
    }
    root.setAttribute('data-theme', theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f6f6f4' : '#050505');
    var btns = document.querySelectorAll('[data-theme-value]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute('aria-pressed', btns[i].getAttribute('data-theme-value') === theme ? 'true' : 'false');
    }
    try { window.dispatchEvent(new CustomEvent('malz:theme', { detail: { theme: theme } })); } catch (e) {}
  }

  function set(theme) {
    apply(theme, true);
    try { localStorage.setItem(KEY, theme); } catch (e) {}
  }

  function current() {
    var t = root.getAttribute('data-theme');
    return t === 'light' ? 'light' : 'dark';
  }

  apply(stored() || systemTheme(), false);

  var GEAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.2"/>' +
    '<path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.11a1.7 1.7 0 0 0-1.11-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.11a1.7 1.7 0 0 0 1.56-1.11 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1.03-1.56V3a2 2 0 1 1 4 0v.11a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9a1.7 1.7 0 0 0 1.56 1.03H21a2 2 0 1 1 0 4h-.11a1.7 1.7 0 0 0-1.49 1z"/></svg>';

  var SHEET = '' +
    '<div class="set-back" data-set-close hidden></div>' +
    '<div class="set-card" role="dialog" aria-modal="true" aria-label="Setelan" hidden>' +
    '  <div class="set-head">' +
    '    <span class="set-title">Setelan</span>' +
    '    <button type="button" class="set-x" data-set-close aria-label="Tutup">' +
    '      <svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
    '    </button>' +
    '  </div>' +
    '  <div class="set-row">' +
    '    <span class="set-label">' +
    '      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.4M12 19.6V22M2 12h2.4M19.6 12H22M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M19.1 4.9l-1.7 1.7M6.6 17.4l-1.7 1.7"/></svg>' +
    '      Tema' +
    '    </span>' +
    '    <div class="set-seg">' +
    '      <button type="button" data-theme-value="dark" aria-pressed="true">Gelap</button>' +
    '      <button type="button" data-theme-value="light" aria-pressed="false">Cerah</button>' +
    '    </div>' +
    '  </div>' +
    '</div>';

  function mount() {
    var right = document.querySelector('.nav-right');
    if (!right) return;

    if (!document.querySelector('.theme-toggle')) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'icon-btn theme-toggle';
      btn.setAttribute('aria-label', 'Setelan');
      btn.setAttribute('aria-expanded', 'false');
      btn.innerHTML = GEAR;
      var anchor = right.querySelector('.mobile-toggle');
      if (anchor) right.insertBefore(btn, anchor); else right.appendChild(btn);
    }

    if (!document.querySelector('.set-card')) {
      var box = document.createElement('div');
      box.className = 'set-wrap';
      box.innerHTML = SHEET;
      document.body.appendChild(box);
    }

    apply(current(), false);
  }

  function openSheet(open) {
    var card = document.querySelector('.set-card');
    var back = document.querySelector('.set-back');
    var btn = document.querySelector('.theme-toggle');
    if (!card || !back) return;
    card.hidden = !open;
    back.hidden = !open;
    if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (t.closest && t.closest('.theme-toggle')) { openSheet(true); return; }
    if (t.closest && t.closest('[data-set-close]')) { openSheet(false); return; }
    var seg = t.closest && t.closest('[data-theme-value]');
    if (seg) { set(seg.getAttribute('data-theme-value')); return; }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') openSheet(false);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }

  window.MalzTheme = { get: current, set: set, toggle: function () { set(current() === 'light' ? 'dark' : 'light'); } };
})();
