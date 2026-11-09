/* Home page: class tabs + chapter grid, driven by content/catalog.json. */
(function () {
  'use strict';
  var C = window.Chem;
  C.initTheme(document.getElementById('theme-btn'));
  C.registerServiceWorker();

  var tabsEl = document.getElementById('tabs');
  var gridEl = document.getElementById('grid');
  var emptyEl = document.getElementById('empty');
  var catalog = null;
  var active = null;

  function badge(ch) {
    if (ch.status !== 'ready') return '<span class="badge soon">Coming soon</span>';
    var p = C.Progress.get(ch.id);
    if (p.done) return '<span class="badge done">✔ Completed' + (p.quiz ? ' · Quiz ' + p.quiz.score + '/' + p.quiz.total : '') + '</span>';
    if (p.seen) return '<span class="badge ready">● In progress</span>';
    return '<span class="badge ready">● Ready to read</span>';
  }

  function render() {
    var cls = catalog.classes.filter(function (c) { return c.id === active; })[0];
    gridEl.innerHTML = '';
    emptyEl.hidden = true;
    if (!cls || (!cls.chapters.length && !(cls.parts && cls.parts.length))) { emptyEl.hidden = false; return; }

    function card(ch) {
      var li = document.createElement('li');
      var inner =
        '<span class="no">Chapter ' + ch.no + '</span>' +
        '<h3>' + C.esc(ch.title.as) + '</h3>' +
        '<span class="sub">' + C.esc(ch.title.en) + '</span>' + badge(ch);
      if (ch.status === 'ready') {
        li.innerHTML = '<a class="card" href="chapter.html?c=' + encodeURIComponent(ch.id) + '">' + inner + '</a>';
      } else {
        li.innerHTML = '<div class="card soon">' + inner + '</div>';
      }
      return li;
    }

    if (cls.parts && cls.parts.length) {
      /* a class split into parts: heading, then that part's chapters (or a "coming soon" note) */
      cls.parts.forEach(function (part) {
        var items = cls.chapters.filter(function (ch) { return ch.part === part.n; });
        var head = document.createElement('li');
        head.className = 'part-head';
        head.innerHTML = '<h2>' + C.esc(part.title) + '</h2>' +
          (items.length ? (part.note ? '<span class="en">' + C.esc(part.note) + '</span>' : '') : '<span class="badge soon">Coming soon</span>');
        gridEl.appendChild(head);
        if (!items.length) {
          var note = document.createElement('li');
          note.className = 'part-note';
          note.textContent = part.title + ' chapters will be added soon.';
          gridEl.appendChild(note);
        }
        items.forEach(function (ch) { gridEl.appendChild(card(ch)); });
      });
    } else {
      cls.chapters.forEach(function (ch) { gridEl.appendChild(card(ch)); });
    }
  }

  function renderTabs() {
    tabsEl.innerHTML = '';
    catalog.classes.forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'tab'; b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', String(c.id === active));
      b.textContent = c.title;
      b.addEventListener('click', function () { active = c.id; renderTabs(); render(); });
      tabsEl.appendChild(b);
    });
  }

  C.fetchJSON('content/catalog.json').then(function (data) {
    catalog = data;
    active = data.classes[0].id;
    renderTabs(); render();
  }).catch(function (err) {
    console.error(err);
    gridEl.innerHTML = '<li class="empty">Could not load the chapter list. Check your connection and try again.</li>';
  });
})();
