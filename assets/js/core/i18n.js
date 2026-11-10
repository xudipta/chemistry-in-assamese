/* Language support.
   - Which content language the reader chose ('as' = Assamese, the default; 'en' = English), remembered in the browser,
     overridable with ?lang=en, and exposed as <html data-lang="…"> so CSS and animations can read it.
   - The header switch.
   - Chem.i18n.t(assamese, english): picks the right string for the few UI strings that depend on the language.
   A chapter lists the languages it is available in with "langs" in content/catalog.json (default ["as"]).
   Chapter text lives in content/<class>/<chapter>/chapter.json (Assamese) and chapter.<code>.json (other languages). */
(function (global) {
  'use strict';
  var C = global.Chem, KEY = 'chem-as-lang', LANGS = ['as', 'en'], DEFAULT = 'as';
  var cur = DEFAULT, listeners = [], sw = null;

  function valid(l) { return LANGS.indexOf(l) >= 0; }
  function stored() { try { var v = global.localStorage.getItem(KEY); return valid(v) ? v : null; } catch (e) { return null; } }
  function save(l) { try { global.localStorage.setItem(KEY, l); } catch (e) { /* private mode etc. */ } }
  function apply(l) { cur = l; document.documentElement.setAttribute('data-lang', l); }

  /* ?lang=en wins and is remembered; otherwise the saved choice; otherwise Assamese */
  (function init() {
    var q = new URLSearchParams(global.location.search).get('lang');
    if (valid(q)) { save(q); apply(q); } else apply(stored() || DEFAULT);
  })();

  function paintSwitch() {
    if (!sw) return;
    Array.prototype.forEach.call(sw.children, function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === cur)); });
  }

  function set(l) {
    if (!valid(l) || l === cur) return;
    save(l); apply(l);
    try { /* keep a shared ?lang= link in step with the choice */
      var u = new URL(global.location.href);
      if (u.searchParams.has('lang')) { u.searchParams.set('lang', l); global.history.replaceState(null, '', u); }
    } catch (e) { /* ignore */ }
    paintSwitch();
    listeners.slice().forEach(function (f) { f(l); });
  }

  /* Puts the switch in the header, just before the theme button. */
  function mountSwitch(themeBtn) {
    var wrap = document.createElement('div');
    wrap.className = 'header-tools';
    themeBtn.parentNode.insertBefore(wrap, themeBtn);
    sw = document.createElement('div');
    sw.className = 'lang-switch';
    sw.setAttribute('role', 'group');
    sw.setAttribute('aria-label', 'Content language');
    [['as', 'অসমীয়া'], ['en', 'English']].forEach(function (p) {
      var b = document.createElement('button');
      b.type = 'button'; b.setAttribute('lang', p[0]); b.setAttribute('data-lang', p[0]); b.textContent = p[1];
      b.addEventListener('click', function () { set(p[0]); });
      sw.appendChild(b);
    });
    wrap.appendChild(sw);
    wrap.appendChild(themeBtn);
    paintSwitch();
  }

  C.i18n = {
    LANGS: LANGS,
    get: function () { return cur; },
    set: set,
    on: function (f) { listeners.push(f); },
    t: function (as, en) { return cur === 'en' ? en : as; },
    mountSwitch: mountSwitch
  };
})(window);
