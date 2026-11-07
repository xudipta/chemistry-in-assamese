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
    if (ch.status !== 'ready') return '<span class="badge soon">শীঘ্ৰে আহিছে</span>';
    var p = C.Progress.get(ch.id);
    if (p.done) return '<span class="badge done">✔ সম্পূৰ্ণ' + (p.quiz ? ' · কুইজ ' + p.quiz.score + '/' + p.quiz.total : '') + '</span>';
    if (p.seen) return '<span class="badge ready">● আৰম্ভ কৰিছে</span>';
    return '<span class="badge ready">● পঢ়িবলৈ সাজু</span>';
  }

  function render() {
    var cls = catalog.classes.filter(function (c) { return c.id === active; })[0];
    gridEl.innerHTML = '';
    emptyEl.hidden = true;
    if (!cls || !cls.chapters.length) { emptyEl.hidden = false; return; }
    cls.chapters.forEach(function (ch) {
      var li = document.createElement('li');
      var inner =
        '<span class="no">অধ্যায় ' + ch.no + '</span>' +
        '<h3>' + C.esc(ch.title.as) + '</h3>' +
        '<span class="sub">' + C.esc(ch.title.en) + '</span>' + badge(ch);
      if (ch.status === 'ready') {
        li.innerHTML = '<a class="card" href="chapter.html?c=' + encodeURIComponent(ch.id) + '">' + inner + '</a>';
      } else {
        li.innerHTML = '<div class="card soon">' + inner + '</div>';
      }
      gridEl.appendChild(li);
    });
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
    gridEl.innerHTML = '<li class="empty">অধ্যায়ৰ তালিকা লোড কৰিব পৰা নগ\'ল। ইণ্টাৰনেট সংযোগ পৰীক্ষা কৰি পুনৰ চেষ্টা কৰক।</li>';
  });
})();
