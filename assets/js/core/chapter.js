/* Chapter page: loads content/<class>/<chapter>/chapter.json (+ quiz.json) and renders it.
   Other languages sit next to them as chapter.<code>.json / quiz.<code>.json (see assets/js/core/i18n.js).
   Block types: p, list, table, formula, note, anim.  See docs/ADDING_A_CHAPTER.md. */
(function () {
  'use strict';
  var C = window.Chem, I = C.i18n;
  C.initTheme(document.getElementById('theme-btn'));
  I.mountSwitch(document.getElementById('theme-btn'));
  C.registerServiceWorker();

  var root = document.getElementById('chapter');
  var chapterId = new URLSearchParams(location.search).get('c') || '';
  /* only allow ids like class-11/ch02-structure-of-atom */
  if (!/^class-\d+\/[a-z0-9-]+$/.test(chapterId)) {
    root.innerHTML = '<p class="loading">Chapter not found. <a href="index.html">Back to home</a>.</p>';
    return;
  }
  var base = 'content/' + chapterId + '/';
  var glossary = {};
  var shown = 'as';            /* language of the text currently on screen */
  var scriptsReady;

  /* ---- inline markup: **bold**, ^{sup}, _{sub}, [[glossary-key]] (input is escaped first) ---- */
  function inline(text) {
    var x = C.esc(text).replace(/\n/g, '<br>');
    x = x.replace(/\[\[([\w-]+)\]\]/g, function (m, k) {
      var g = glossary[k];
      if (!g) return m;
      /* the reader's language first, the other in brackets (Assamese stays visible: exams are in Assamese) */
      var main = shown === 'en' ? C.esc(g.en) : C.esc(g.as);
      var other = shown === 'en' ? '<span lang="as">' + C.esc(g.as) + '</span>' : C.esc(g.en);
      return '<span class="term" tabindex="0" data-def="' + C.esc(g.def) + '">' + main + ' <span class="en">(' + other + ')</span></span>';
    });
    x = x.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    x = x.replace(/\^\{(.+?)\}/g, '<sup>$1</sup>').replace(/_\{(.+?)\}/g, '<sub>$1</sub>');
    return x;
  }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  }

  var renderers = {
    p: function (b) { return el('p', '', inline(b.text)); },
    list: function (b) {
      var l = el(b.ordered ? 'ol' : 'ul');
      b.items.forEach(function (i) { l.appendChild(el('li', '', inline(i))); });
      return l;
    },
    table: function (b) {
      var wrap = el('div', 'table-wrap');
      var t = el('table');
      var head = '<thead><tr>' + b.head.map(function (h) { return '<th scope="col">' + inline(h) + '</th>'; }).join('') + '</tr></thead>';
      var body = '<tbody>' + b.rows.map(function (r) {
        return '<tr>' + r.map(function (c) { return '<td>' + inline(c) + '</td>'; }).join('') + '</tr>';
      }).join('') + '</tbody>';
      t.innerHTML = head + body;
      wrap.appendChild(t);
      return wrap;
    },
    formula: function (b) {
      return el('div', 'formula', (b.label ? '<span class="lbl">' + inline(b.label) + '</span>' : '') + inline(b.text));
    },
    note: function (b) {
      var kind = b.kind === 'try' ? 'try' : 'tip';
      var label = b.label || (kind === 'try' ? I.t('নিজে কৰি চাওক', 'Try it yourself') : I.t('মনত ৰাখিব', 'Remember'));
      return el('div', 'note ' + kind, '<span class="lbl">' + inline(label) + ':</span>' + inline(b.text));
    },
    anim: function (b) {
      var fig = el('figure', 'anim');
      fig.appendChild(el('div', 'anim-title', inline(b.title || '')));
      var host = el('div');
      fig.appendChild(host);
      if (b.caption) fig.appendChild(el('figcaption', '', inline(b.caption)));
      /* mount once the scripts have loaded */
      scriptsReady.then(function () { window.ChemAnim.mount(b.name, host); });
      return fig;
    }
  };

  /* scripts are loaded once per page, however many times the chapter is re-rendered */
  var loaded = {};
  function loadScript(src) {
    if (!loaded[src]) {
      loaded[src] = new Promise(function (resolve, reject) {
        var s = document.createElement('script');
        s.src = src; s.onload = resolve; s.onerror = function () { reject(new Error('Failed to load ' + src)); };
        document.head.appendChild(s);
      });
    }
    return loaded[src];
  }
  function loadScripts(list) {
    return list.reduce(function (p, src) { return p.then(function () { return loadScript(src); }); }, Promise.resolve());
  }

  function renderQuiz(quiz, container) {
    var answered = 0, correct = 0, total = quiz.questions.length;
    var score = el('p', 'score');
    quiz.questions.forEach(function (q, qi) {
      var card = el('div', 'q');
      card.appendChild(el('p', 'qt', (qi + 1) + '. ' + inline(q.q)));
      var explain = el('div', 'explain'); explain.hidden = true;
      var buttons = q.options.map(function (o, oi) {
        var b = el('button', 'opt', inline(o));
        b.type = 'button';
        b.addEventListener('click', function () {
          buttons.forEach(function (x, xi) {
            x.disabled = true;
            if (xi === q.answer) x.classList.add('right');
          });
          if (oi === q.answer) correct++; else b.classList.add('wrong');
          explain.innerHTML = (oi === q.answer ? '✔ Correct. ' : '✘ Incorrect. ') + inline(q.explain || '');
          explain.hidden = false;
          answered++;
          if (answered === total) {
            score.textContent = 'Your score: ' + correct + ' / ' + total;
            C.Progress.update(chapterId, { quiz: { score: correct, total: total } });
          }
        });
        card.appendChild(b);
        return b;
      });
      card.appendChild(explain);
      container.appendChild(card);
    });
    container.appendChild(score);
    var again = el('button', 'btn', 'Try again');
    again.type = 'button';
    again.addEventListener('click', function () { container.innerHTML = ''; renderQuiz(quiz, container); });
    container.appendChild(again);
  }

  function glossaryTable() {
    var keys = Object.keys(glossary), en = shown === 'en';
    var cell = function (txt, isAs) { return '<td' + (isAs ? ' lang="as"' : '') + '>' + C.esc(txt) + '</td>'; };
    var head = en ? ['English', 'Assamese', 'Meaning'] : ['Assamese', 'English', 'Meaning'];
    var wrap = el('div', 'table-wrap'), t = el('table');
    t.innerHTML = '<thead><tr>' + head.map(function (h) { return '<th scope="col">' + h + '</th>'; }).join('') + '</tr></thead><tbody>' +
      keys.map(function (k) {
        var g = glossary[k];
        return '<tr>' + (en ? cell(g.en, false) + cell(g.as, true) : cell(g.as, false) + cell(g.en, false)) + cell(g.def, false).replace('<td>', '<td style="white-space:normal;min-width:240px">') + '</tr>';
      }).join('') + '</tbody>';
    wrap.appendChild(t);
    return wrap;
  }

  function render(ch, quiz, catalog, wanted) {
    var title = ch.title, en = shown === 'en';
    document.title = title.en + ' · Chemistry in Assamese';
    root.innerHTML = '';

    var head = el('header', 'chapter-head');
    head.appendChild(el('div', 'crumbs', '<a href="index.html">Chemistry in Assamese</a> › Class ' + ch.class + ' › Chapter ' + ch.number));
    head.appendChild(el('h1', '', C.esc(en ? title.en : title.as)));
    head.appendChild(el('div', 'en', en ? '<span lang="as">' + C.esc(title.as) + '</span>' : C.esc(title.en)));
    root.appendChild(head);

    if (wanted !== shown) {   /* the reader asked for a language this chapter does not have yet */
      root.appendChild(el('div', 'lang-note', wanted === 'en'
        ? 'The English version of this chapter is coming soon. Showing the Assamese version for now.'
        : 'This chapter is not available in the selected language yet.'));
    }

    var goals = el('div', 'box');
    goals.appendChild(el('h2', '', 'What you will learn'));
    var gl = el('ul');
    ch.goals.forEach(function (g) { gl.appendChild(el('li', '', inline(g))); });
    goals.appendChild(gl);
    root.appendChild(goals);

    var toc = el('nav', 'box toc'); toc.setAttribute('aria-label', 'Chapter contents');
    toc.appendChild(el('h2', '', 'Contents'));
    ch.sections.forEach(function (s, i) { toc.appendChild(el('a', '', (i + 1) + '. ' + C.esc(s.title))).setAttribute('href', '#' + s.id); });
    toc.appendChild(el('a', '', 'Quiz')).setAttribute('href', '#quiz');
    root.appendChild(toc);

    ch.sections.forEach(function (s, i) {
      var sec = el('section', 'sec'); sec.id = s.id; sec.setAttribute('lang', shown);
      sec.appendChild(el('h2', '', (i + 1) + '. ' + inline(s.title)));
      s.blocks.forEach(function (b) {
        var r = renderers[b.type];
        if (r) sec.appendChild(r(b));
      });
      root.appendChild(sec);
    });

    if (ch.summary && ch.summary.length) {
      var sum = el('section', 'sec'); sum.id = 'summary'; sum.setAttribute('lang', shown);
      sum.appendChild(el('h2', '', 'Summary'));
      sum.appendChild(renderers.list({ items: ch.summary }));
      root.appendChild(sum);
    }

    if (Object.keys(glossary).length) {
      var gs = el('section', 'sec'); gs.id = 'key-terms';
      gs.appendChild(el('h2', '', 'Key terms'));
      gs.appendChild(glossaryTable());
      root.appendChild(gs);
    }

    var qs = el('section', 'sec'); qs.id = 'quiz'; qs.setAttribute('lang', shown);
    qs.appendChild(el('h2', '', 'Quiz: test yourself'));
    var qbox = el('div');
    qs.appendChild(qbox);
    root.appendChild(qs);
    if (quiz) renderQuiz(quiz, qbox); else qbox.textContent = 'Coming soon.';

    /* completion + next chapter */
    var nav = el('div', 'chap-nav');
    var done = el('button', 'btn primary');
    done.type = 'button';
    function paintDone() {
      var d = C.Progress.get(chapterId).done;
      done.textContent = d ? '✔ Completed (click to undo)' : 'Mark chapter as complete';
      done.setAttribute('aria-pressed', String(!!d));
    }
    done.addEventListener('click', function () { C.Progress.update(chapterId, { done: !C.Progress.get(chapterId).done }); paintDone(); });
    paintDone();
    nav.appendChild(done);
    var cls = (catalog.classes || []).filter(function (c) { return 'class-' + ch.class === c.id; })[0];
    var next = cls && cls.chapters.filter(function (c) { return c.no === ch.number + 1; })[0];
    if (next && next.status === 'ready') {
      nav.appendChild(el('a', 'btn', 'Next chapter →')).setAttribute('href', 'chapter.html?c=' + encodeURIComponent(next.id));
    } else {
      nav.appendChild(el('a', 'btn', '← All chapters')).setAttribute('href', 'index.html');
    }
    root.appendChild(nav);

    C.Progress.update(chapterId, { seen: Date.now() });
  }

  /* languages this chapter is available in (catalog "langs", default Assamese only) */
  function chapterLangs(catalog) {
    var found = null;
    (catalog.classes || []).forEach(function (c) { c.chapters.forEach(function (ch) { if (ch.id === chapterId) found = ch; }); });
    return (found && found.langs) || ['as'];
  }

  function load() {
    var wanted = I.get(), keepY = window.scrollY;
    return C.fetchJSON('content/catalog.json').catch(function () { return { classes: [] }; }).then(function (catalog) {
      shown = chapterLangs(catalog).indexOf(wanted) >= 0 ? wanted : 'as';
      var sfx = shown === 'as' ? '' : '.' + shown;
      return Promise.all([
        C.fetchJSON(base + 'chapter' + sfx + '.json'),
        C.fetchJSON(base + 'quiz' + sfx + '.json').catch(function () { return null; })
      ]).then(function (res) {
        var ch = res[0];
        glossary = ch.glossary || {};
        scriptsReady = loadScripts(['assets/js/anim/engine.js', 'assets/js/anim/elements.js'])
          .then(function () { return loadScripts((ch.scripts || []).map(function (s) { return base + s; })); });
        render(ch, res[1], catalog, wanted);
        if (keepY) window.scrollTo(0, keepY);
      });
    });
  }

  I.on(function () { load().catch(fail); });
  function fail(err) {
    console.error(err);
    root.innerHTML = '<p class="loading">Could not load this chapter. <a href="index.html">Back to home</a>.</p>';
  }
  load().catch(fail);
})();
