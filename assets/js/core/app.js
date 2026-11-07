/* Shared helpers: theme toggle, progress storage, tiny utilities. */
(function (global) {
  'use strict';
  var PROGRESS_KEY = 'chem-as-progress-v1';
  var THEME_KEY = 'chem-as-theme';

  function safeGet(key) { try { return global.localStorage.getItem(key); } catch (e) { return null; } }
  function safeSet(key, val) { try { global.localStorage.setItem(key, val); } catch (e) { /* private mode etc. */ } }

  /* ---- progress: { chapters: { "<id>": { done: bool, quiz: {score, total}, seen: ts } } } ---- */
  function readProgress() {
    try { var p = JSON.parse(safeGet(PROGRESS_KEY) || '{}'); if (!p.chapters) p.chapters = {}; return p; }
    catch (e) { return { chapters: {} }; }
  }
  var Progress = {
    get: function (id) { return readProgress().chapters[id] || {}; },
    update: function (id, patch) {
      var p = readProgress();
      p.chapters[id] = Object.assign({}, p.chapters[id], patch);
      safeSet(PROGRESS_KEY, JSON.stringify(p));
      return p.chapters[id];
    },
    exportJSON: function () { return JSON.stringify(readProgress(), null, 2); },
    importJSON: function (text) {
      var p = JSON.parse(text);
      if (!p || typeof p.chapters !== 'object') throw new Error('Invalid backup');
      safeSet(PROGRESS_KEY, JSON.stringify(p));
    }
  };

  /* ---- theme: follows the system unless the user picks one ---- */
  function applyTheme(t) {
    if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
    else document.documentElement.removeAttribute('data-theme');
  }
  function currentIsDark() {
    var t = document.documentElement.getAttribute('data-theme');
    if (t) return t === 'dark';
    return !!(global.matchMedia && global.matchMedia('(prefers-color-scheme: dark)').matches);
  }
  function initTheme(btn) {
    applyTheme(safeGet(THEME_KEY));
    function paint() {
      btn.textContent = currentIsDark() ? '☀' : '🌙';
      btn.setAttribute('aria-label', currentIsDark() ? 'Switch to light theme' : 'Switch to dark theme');
    }
    btn.addEventListener('click', function () {
      var next = currentIsDark() ? 'light' : 'dark';
      applyTheme(next); safeSet(THEME_KEY, next); paint();
    });
    paint();
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }

  function fetchJSON(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error(url + ' → HTTP ' + r.status);
      return r.json();
    });
  }

  function registerServiceWorker() {
    if ('serviceWorker' in navigator && location.protocol !== 'file:') {
      navigator.serviceWorker.register('sw.js').catch(function () { /* offline support is optional */ });
    }
  }

  global.Chem = { Progress: Progress, initTheme: initTheme, esc: esc, fetchJSON: fetchJSON, registerServiceWorker: registerServiceWorker };
})(window);
